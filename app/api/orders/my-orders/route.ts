import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/supabase/auth-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/orders/my-orders
 * Get all orders for the authenticated customer
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Fetch orders for this customer
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_title,
          product_name,
          variant_title,
          quantity,
          price,
          unit_price,
          total,
          total_price
        )
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error: any) {
    console.error('Error in GET /api/orders/my-orders:', error);

    // Handle authentication errors
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
