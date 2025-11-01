import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  chargeStoredPaymentMethod,
  createCustomerProfile,
  createPaymentProfile,
  isConfigured as isAuthorizeNetConfigured
} from '@/lib/authorizenet-service';
import { checkCartAvailability, decrementInventory } from '@/lib/inventory';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface OrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  title: string;
  variant_title?: string;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface NewCard {
  card_number: string;
  expiration_month: string;
  expiration_year: string;
  cvv: string;
  card_type?: string;
  billing_address: ShippingAddress;
}

/**
 * POST /api/checkout/create-order
 * Create a one-time order with payment processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      email,
      shipping_address,
      shipping_method, // NEW: shipping method selection
      payment_method_id,
      new_card,
      items,
      subtotal,
      shipping,
      tax,
      total,
      status, // NEW: support pending_payment status
    } = body;

    // Validate required fields
    if (!email || !shipping_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Only require payment if NOT creating a pending order
    // Pending orders will be completed by separate payment endpoint
    const isPendingOrder = status === 'pending_payment';

    if (!isPendingOrder && !payment_method_id && !new_card) {
      return NextResponse.json(
        { error: 'Payment method required' },
        { status: 400 }
      );
    }

    // ====================================
    // INVENTORY CHECK (before payment)
    // ====================================
    // Check inventory availability for all items
    try {
      const inventoryChecks = await checkCartAvailability(
        items.map((item: OrderItem) => ({
          productId: item.product_id,
          variantId: item.variant_id || null,
          quantity: item.quantity,
        }))
      );

      // Find any unavailable items
      const unavailableItems = inventoryChecks.filter(check => !check.available);

      if (unavailableItems.length > 0) {
        const itemDetails = unavailableItems.map(check => {
          const item = items.find((i: OrderItem) =>
            i.product_id === check.productId &&
            (i.variant_id || null) === (check.variantId || null)
          );
          return {
            title: item?.title || 'Unknown',
            variant_title: item?.variant_title,
            requested: check.requested_quantity,
            available: check.current_quantity,
            reason: check.reason,
          };
        });

        return NextResponse.json(
          {
            error: 'Some items are out of stock',
            unavailable_items: itemDetails,
          },
          { status: 400 }
        );
      }
    } catch (inventoryError) {
      // Log inventory check failure but don't block order
      console.error('[Order] Inventory check failed, proceeding anyway:', inventoryError);
    }

    // Get or create customer
    let customerId = customer_id;
    let customer;

    if (customer_id) {
      // Get existing customer
      const { data: existingCustomer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customer_id)
        .single();

      if (customerError) {
        console.error('Error fetching customer:', customerError);
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      customer = existingCustomer;
    } else {
      // Check if customer exists by email
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (existingCustomer) {
        customer = existingCustomer;
        customerId = existingCustomer.id;
      } else {
        // Create new guest customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert([
            {
              email: email,
              first_name: shipping_address.first_name,
              last_name: shipping_address.last_name,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating customer:', createError);
          return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
          );
        }

        customer = newCustomer;
        customerId = newCustomer.id;
      }
    }

    // Process payment (skip for pending orders)
    let transactionId: string | null = null;
    let paymentStatus: 'pending' | 'paid' | 'failed' = 'pending';
    let paymentError: string | null = null;

    // Skip payment processing if this is a pending order
    // Pending orders will be completed via separate /api/payments endpoint
    if (isPendingOrder) {
      console.log('[Order] Creating pending order - payment will be processed separately');
      paymentStatus = 'pending';
    } else if (!isAuthorizeNetConfigured()) {
      // ⚠️ REMOVED: Fake payment success simulation
      // Never mark orders as paid without actually charging
      console.error('[Order] Authorize.net not configured - cannot process payment');
      paymentStatus = 'failed';
      paymentError = 'Payment gateway not configured';
    } else {
      try {
        if (payment_method_id) {
          // Use saved payment method - fetch from database
          const { data: paymentMethod, error: pmError } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('id', payment_method_id)
            .single();

          if (pmError || !paymentMethod) {
            throw new Error('Payment method not found');
          }

          if (!paymentMethod.authorize_net_profile_id || !paymentMethod.authorize_net_payment_profile_id) {
            throw new Error('Payment method not configured for Authorize.net');
          }

          // Charge the saved payment method
          const authResponse = await chargeStoredPaymentMethod({
            amount: total,
            customerProfileId: paymentMethod.authorize_net_profile_id,
            customerPaymentProfileId: paymentMethod.authorize_net_payment_profile_id,
            invoiceNumber: `WM${Date.now().toString().slice(-8)}`,
            description: `Order - ${items.length} item(s)`,
            customerId: customerId,
            customerEmail: email,
          });

          if (authResponse.success && authResponse.transactionId) {
            transactionId = authResponse.transactionId;
            paymentStatus = 'paid';
          } else {
            throw new Error(authResponse.error || 'Payment failed');
          }
        } else {
          // ⚠️ REMOVED: Raw card data handling (PCI violation)
          // Payment processing should ONLY use Accept.js tokens via /api/payments endpoint
          // This path should never execute in normal flow
          throw new Error('Direct card processing not supported. Use /api/payments endpoint with Accept.js tokens.');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Payment failed';
        console.error('Payment processing error:', error);
        paymentStatus = 'failed';
        paymentError = errorMessage;
      }
    }

    // Generate order number
    const orderNumber = `WM${Date.now().toString().slice(-8)}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: customerId,
          order_number: orderNumber,
          status: isPendingOrder ? 'pending_payment' : (paymentStatus === 'paid' ? 'pending' : 'payment_failed'),
          payment_status: paymentStatus,
          payment_method: payment_method_id ? 'saved_card' : (isPendingOrder ? null : 'new_card'),
          transaction_id: transactionId,

          // Customer info
          customer_email: email,
          customer_first_name: shipping_address.first_name,
          customer_last_name: shipping_address.last_name,

          // Shipping address
          shipping_first_name: shipping_address.first_name,
          shipping_last_name: shipping_address.last_name,
          shipping_address: shipping_address.address,
          shipping_address2: shipping_address.address2,
          shipping_city: shipping_address.city,
          shipping_state: shipping_address.state,
          shipping_zip: shipping_address.zip,
          shipping_country: shipping_address.country,
          shipping_phone: shipping_address.phone,
          shipping_method: shipping_method || 'standard', // Store selected shipping method

          // Totals
          subtotal: subtotal,
          shipping_cost: shipping,
          tax: tax,
          total: total,

          // Metadata
          notes: paymentError,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: OrderItem) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_title: item.title,
      variant_title: item.variant_title,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Order is already created, so just log the error
    }

    // ====================================
    // DECREMENT INVENTORY (after successful payment)
    // ====================================
    if (paymentStatus === 'paid') {
      // Decrement inventory for each item
      for (const item of items) {
        try {
          await decrementInventory(
            item.product_id,
            item.variant_id || null,
            item.quantity,
            order.id,
            null,
            'system'
          );
          console.log(`[Inventory] Decremented ${item.quantity}x ${item.title} for order ${orderNumber}`);
        } catch (inventoryError) {
          console.error(`[Inventory] Failed to decrement inventory for ${item.title}:`, inventoryError);
          // Don't fail the order - log error for manual review
        }
      }
    }

    // Send order confirmation email
    if (paymentStatus === 'paid') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'order_confirmation',
            to: email,
            data: {
              order_number: orderNumber,
              customer_name: `${shipping_address.first_name} ${shipping_address.last_name}`,
              total: total,
              items: items,
              shipping_address: shipping_address,
            },
          }),
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the order if email fails
      }

      // Add to GoHighLevel
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ghl/add-contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            firstName: shipping_address.first_name,
            lastName: shipping_address.last_name,
            phone: shipping_address.phone,
            tags: ['customer', 'order-placed'],
            customFields: {
              last_order_number: orderNumber,
              last_order_total: total,
            },
          }),
        });
      } catch (ghlError) {
        console.error('Error adding to GHL:', ghlError);
        // Don't fail the order if GHL fails
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: orderNumber,
        status: order.status,
        payment_status: paymentStatus,
        total: total,
        transaction_id: transactionId,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error in POST /api/checkout/create-order:', error);
    console.error('Error stack:', errorStack);
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorStack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
      },
      { status: 500 }
    );
  }
}
