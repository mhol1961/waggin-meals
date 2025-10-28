import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/inventory/adjustments
 * Get inventory adjustment history with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variant_id');
    const reason = searchParams.get('reason');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('inventory_adjustments')
      .select(`
        *,
        variant:product_variants!inventory_adjustments_variant_id_fkey (
          id,
          title,
          sku,
          product:products!product_variants_product_id_fkey (
            title,
            handle
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (variantId) {
      query = query.eq('variant_id', variantId);
    }

    if (reason) {
      query = query.eq('reason', reason);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inventory adjustments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch inventory adjustments' },
        { status: 500 }
      );
    }

    // Format the response
    const adjustments = data.map((adj: any) => ({
      ...adj,
      variant_title: adj.variant?.title,
      variant_sku: adj.variant?.sku,
      product_title: adj.variant?.product?.title,
      product_handle: adj.variant?.product?.handle,
    }));

    return NextResponse.json({
      adjustments,
      count: adjustments.length,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/inventory/adjustments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
