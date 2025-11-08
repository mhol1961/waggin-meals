import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAdminAuth } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/inventory/low-stock
 * Get all variants with low stock (inventory < 10)
 * REQUIRES ADMIN AUTHENTICATION
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await checkAdminAuth();
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const threshold = parseInt(searchParams.get('threshold') || '10');

    // Query the low_stock_variants view
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        product:products!product_variants_product_id_fkey (
          title,
          handle,
          category
        )
      `)
      .eq('track_inventory', true)
      .eq('is_available', true)
      .lt('inventory_quantity', threshold)
      .order('inventory_quantity', { ascending: true });

    if (error) {
      console.error('Error fetching low stock variants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch low stock variants' },
        { status: 500 }
      );
    }

    // Format the response
    const variants = data.map((v: any) => ({
      ...v,
      product_title: v.product?.title,
      product_handle: v.product?.handle,
      product_category: v.product?.category,
    }));

    return NextResponse.json({
      variants,
      count: variants.length,
      threshold,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/inventory/low-stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
