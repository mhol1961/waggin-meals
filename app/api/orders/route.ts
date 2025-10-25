import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateOrderNumber, calculateOrderTotal } from '@/lib/order-utils';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerInfo,
      items,
      paymentMethod = 'authorize_net',
      paymentId = null,
      discountCode = null,
    } = body;

    const supabase = createServerClient();

    // Calculate order totals
    let discountAmount = 0;
    if (discountCode) {
      // Apply discount code logic
      const { data: discount } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode)
        .eq('is_active', true)
        .single();

      if (discount) {
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        if (discount.discount_type === 'percentage') {
          discountAmount = subtotal * (discount.discount_value / 100);
        } else {
          discountAmount = discount.discount_value;
        }

        // Update discount usage
        await supabase
          .from('discount_codes')
          .update({ usage_count: discount.usage_count + 1 })
          .eq('id', discount.id);
      }
    }

    const totals = calculateOrderTotal(items, 12.99, 0.08, discountAmount);
    const orderNumber = generateOrderNumber();

    // Create or get customer
    let customer;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerInfo.email)
      .single();

    if (existingCustomer) {
      customer = existingCustomer;
      // Update customer stats
      await supabase
        .from('customers')
        .update({
          total_orders: customer.total_orders + 1,
          total_spent: customer.total_spent + totals.total,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customer.id);
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: customerInfo.email,
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          phone: customerInfo.phone,
          total_orders: 1,
          total_spent: totals.total,
        })
        .select()
        .single();

      if (customerError) throw customerError;
      customer = newCustomer;

      // Create default shipping address
      await supabase
        .from('customer_addresses')
        .insert({
          customer_id: customer.id,
          address_type: 'shipping',
          address_line1: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zip_code: customerInfo.zipCode,
          is_default: true,
        });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customer.id,
        customer_email: customerInfo.email,
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_first_name: customerInfo.firstName,
        customer_last_name: customerInfo.lastName,
        status: 'pending',
        payment_status: 'paid', // Assuming payment succeeded
        payment_method: paymentMethod,
        payment_id: paymentId,
        subtotal: totals.subtotal,
        shipping_cost: totals.shipping,
        tax: totals.tax,
        discount_amount: totals.discount,
        total: totals.total,
        shipping_address_line1: customerInfo.address,
        shipping_city: customerInfo.city,
        shipping_state: customerInfo.state,
        shipping_zip: customerInfo.zipCode,
        shipping_phone: customerInfo.phone,
        shipping_notes: customerInfo.shippingNotes,
        shipping_address: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          address_line1: customerInfo.address,
          address_line2: customerInfo.address2 || null,
          city: customerInfo.city,
          state: customerInfo.state,
          postal_code: customerInfo.zipCode,
          country: 'US',
          phone: customerInfo.phone
        }
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_handle: item.handle,
      product_title: item.title,
      product_name: item.title,
      quantity: item.quantity,
      price: item.price,
      unit_price: item.price,
      total: item.price * item.quantity,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update product inventory
    for (const item of items) {
      await supabase.rpc('decrement_product_inventory', {
        product_id: item.id,
        quantity: item.quantity,
      });
    }

    // Send order confirmation email
    try {
      const emailData = {
        order_number: order.order_number,
        customer_first_name: customerInfo.firstName,
        customer_email: customerInfo.email,
        items: orderItems.map((item: any) => ({
          product_name: item.product_title,
          variant_title: null,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.total
        })),
        subtotal: totals.subtotal,
        shipping_cost: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        shipping_address: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          address_line1: customerInfo.address,
          address_line2: null,
          city: customerInfo.city,
          state: customerInfo.state,
          postal_code: customerInfo.zipCode,
          country: 'United States'
        },
        created_at: order.created_at,
        id: order.id
      };

      // Send customer confirmation email
      await sendOrderConfirmationEmail(emailData);

      // Send admin notification email
      await sendAdminOrderNotification(emailData);
    } catch (emailError) {
      // Don't fail the order if email fails
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    const supabase = createServerClient();

    if (orderNumber) {
      // Get specific order
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;

      return NextResponse.json({ order });
    } else {
      // Get all orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
