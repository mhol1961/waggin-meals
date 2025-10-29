import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/products/[handle]
 * Fetch a single product by its URL handle
 *
 * Returns product with collection info and variants (if any)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    if (!handle) {
      return NextResponse.json(
        { error: 'Product handle is required' },
        { status: 400 }
      );
    }

    // Fetch product with collection info using the view
    const { data: product, error: productError } = await supabase
      .from('products_with_collections')
      .select('*')
      .eq('handle', handle)
      .eq('is_published', true)
      .single();

    if (productError) {
      if (productError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', productError);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    // Fetch variants if product has them
    let variants = null;
    if (product.has_variants) {
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id)
        .order('display_order', { ascending: true });

      if (variantsError) {
        console.error('Error fetching variants:', variantsError);
      } else {
        variants = variantsData;
      }
    }

    return NextResponse.json({
      product: {
        ...product,
        variants: variants || [],
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in GET /api/products/[handle]:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
