import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { sendOrderShippedEmail } from '@/lib/email-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { tracking_number, carrier = 'USPS' } = body;

    if (!tracking_number) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    // Update order with tracking info and set status to shipped
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        tracking_number,
        carrier,
        status: 'shipped',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
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

    // Send shipping notification email
    try {
      const emailData = {
        order_number: updatedOrder.order_number,
        customer_first_name: updatedOrder.customer_first_name,
        customer_email: updatedOrder.customer_email,
        tracking_number,
        carrier,
        items: updatedOrder.items.map((item: any) => ({
          product_name: item.product_name,
          variant_title: item.variant_title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        })),
        subtotal: updatedOrder.subtotal,
        shipping_cost: updatedOrder.shipping_cost,
        tax: updatedOrder.tax,
        total: updatedOrder.total,
        shipping_address: updatedOrder.shipping_address,
        created_at: updatedOrder.created_at
      };

      await sendOrderShippedEmail(emailData);
    } catch (emailError) {
      // Don't fail if email fails
      console.error('Failed to send shipping notification:', emailError);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error in shipping notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
