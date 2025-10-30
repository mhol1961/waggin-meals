import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = await params;

    // Get order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in order GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes, tracking_number, carrier } = body;

    // Get current order to check status change
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .single();

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (status !== undefined) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (tracking_number !== undefined) {
      updateData.tracking_number = tracking_number;
    }

    if (carrier !== undefined) {
      updateData.carrier = carrier;
    }

    // Update order
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        items:order_items(*)
      `)
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send email notification if status changed
    if (status && status !== currentOrder?.status && updatedOrder.customer_email) {
      try {
        let emailType: string | null = null;

        // Map order status to email type
        switch (status) {
          case 'processing':
            emailType = 'order_processing';
            break;
          case 'shipped':
            emailType = 'order_shipped';
            break;
          case 'out_for_delivery':
            emailType = 'order_out_for_delivery';
            break;
          case 'delivered':
            emailType = 'order_delivered';
            break;
        }

        // Send email if we have a matching type
        if (emailType) {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: emailType,
              to: updatedOrder.customer_email,
              data: {
                order_number: updatedOrder.order_number,
                customer_first_name: updatedOrder.customer_first_name || updatedOrder.shipping_first_name,
                customer_email: updatedOrder.customer_email,
                tracking_number: updatedOrder.tracking_number,
                carrier: updatedOrder.carrier,
                items: updatedOrder.items.map((item: any) => ({
                  product_name: item.product_title,
                  variant_title: item.variant_title,
                  quantity: item.quantity,
                  unit_price: item.price,
                  total_price: item.total,
                })),
                subtotal: updatedOrder.subtotal,
                shipping_cost: updatedOrder.shipping_cost,
                tax: updatedOrder.tax,
                total: updatedOrder.total,
                shipping_address: {
                  first_name: updatedOrder.shipping_first_name,
                  last_name: updatedOrder.shipping_last_name,
                  address_line1: updatedOrder.shipping_address,
                  address_line2: updatedOrder.shipping_address2,
                  city: updatedOrder.shipping_city,
                  state: updatedOrder.shipping_state,
                  postal_code: updatedOrder.shipping_zip,
                  country: updatedOrder.shipping_country || 'US',
                },
                created_at: updatedOrder.created_at,
              },
            }),
          });
        }
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error in order PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
