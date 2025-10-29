import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  chargeStoredPaymentMethod,
  createCustomerProfile,
  createPaymentProfile,
  isConfigured as isAuthorizeNetConfigured
} from '@/lib/authorizenet-service';

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
      payment_method_id,
      new_card,
      items,
      subtotal,
      shipping,
      tax,
      total,
    } = body;

    // Validate required fields
    if (!email || !shipping_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!payment_method_id && !new_card) {
      return NextResponse.json(
        { error: 'Payment method required' },
        { status: 400 }
      );
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

    // Process payment
    let transactionId: string | null = null;
    let paymentStatus: 'pending' | 'paid' | 'failed' = 'pending';
    let paymentError: string | null = null;

    // Check if Authorize.net is configured
    if (!isAuthorizeNetConfigured()) {
      console.warn('[Order] Authorize.net not configured - simulating payment success');
      transactionId = `TEMP-${Date.now()}`;
      paymentStatus = 'paid';
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
        } else if (new_card) {
          // Process new card payment
          // Step 1: Get or create Authorize.net customer profile
          let authorizeNetProfileId = customer.authorize_net_profile_id;

          if (!authorizeNetProfileId) {
            const profileResponse = await createCustomerProfile({
              customerId: customerId,
              email: email,
              description: `${shipping_address.first_name} ${shipping_address.last_name}`,
            });

            if (!profileResponse.success || !profileResponse.profileId) {
              throw new Error(profileResponse.error || 'Failed to create customer profile');
            }

            authorizeNetProfileId = profileResponse.profileId;

            // Save profile ID to customer record
            await supabase
              .from('customers')
              .update({ authorize_net_profile_id: authorizeNetProfileId })
              .eq('id', customerId);
          }

          // Step 2: Create payment profile (save card)
          const expirationDate = `${new_card.expiration_year}-${new_card.expiration_month.padStart(2, '0')}`;

          const paymentProfileResponse = await createPaymentProfile({
            customerProfileId: authorizeNetProfileId,
            cardNumber: new_card.card_number,
            expirationDate: expirationDate,
            cvv: new_card.cvv,
            billingAddress: {
              firstName: new_card.billing_address.first_name,
              lastName: new_card.billing_address.last_name,
              address: new_card.billing_address.address,
              city: new_card.billing_address.city,
              state: new_card.billing_address.state,
              zip: new_card.billing_address.zip,
              country: new_card.billing_address.country || 'US',
            },
          });

          if (!paymentProfileResponse.success || !paymentProfileResponse.paymentProfileId) {
            throw new Error(paymentProfileResponse.error || 'Failed to save payment method');
          }

          const authorizeNetPaymentProfileId = paymentProfileResponse.paymentProfileId;

          // Step 3: Charge the payment profile
          const invoiceNumber = `WM${Date.now().toString().slice(-8)}`;
          const authResponse = await chargeStoredPaymentMethod({
            amount: total,
            customerProfileId: authorizeNetProfileId,
            customerPaymentProfileId: authorizeNetPaymentProfileId,
            invoiceNumber: invoiceNumber,
            description: `Order - ${items.length} item(s)`,
            customerId: customerId,
            customerEmail: email,
          });

          if (authResponse.success && authResponse.transactionId) {
            transactionId = authResponse.transactionId;
            paymentStatus = 'paid';

            // Step 4: Save payment method to database if customer is logged in
            if (customer_id) {
              const last4 = new_card.card_number.slice(-4);
              await supabase.from('payment_methods').insert({
                customer_id: customerId,
                type: new_card.card_type || 'card',
                last4: last4,
                brand: new_card.card_type,
                exp_month: parseInt(new_card.expiration_month),
                exp_year: parseInt(new_card.expiration_year),
                is_default: false,
                authorize_net_profile_id: authorizeNetProfileId,
                authorize_net_payment_profile_id: authorizeNetPaymentProfileId,
              });
            }
          } else {
            throw new Error(authResponse.error || 'Payment failed');
          }
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
          status: paymentStatus === 'paid' ? 'pending' : 'payment_failed',
          payment_status: paymentStatus,
          payment_method: payment_method_id ? 'saved_card' : 'new_card',
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
    console.error('Error in POST /api/checkout/create-order:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
