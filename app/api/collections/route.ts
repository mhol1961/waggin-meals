import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/collections
 * Fetch all published collections with product counts
 *
 * Query params:
 * - include_products: "true" to include full product list in each collection
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('include_products') === 'true';

    // Fetch collections ordered by display_order
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (collectionsError) {
      console.error('Error fetching collections:', collectionsError);
      return NextResponse.json(
        { error: 'Failed to fetch collections' },
        { status: 500 }
      );
    }

    // Enhance collections with product counts and optionally products
    const enhancedCollections = await Promise.all(
      collections.map(async (collection) => {
        // Get product count for this collection
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('collection_id', collection.id)
          .eq('is_published', true)
          .eq('status', 'active');

        if (countError) {
          console.error(`Error counting products for collection ${collection.slug}:`, countError);
        }

        const enhanced: Record<string, unknown> = {
          ...collection,
          product_count: count || 0,
        };

        // Optionally include full product list
        if (includeProducts) {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('collection_id', collection.id)
            .eq('is_published', true)
            .eq('status', 'active')
            .order('inventory_count', { ascending: false });

          if (productsError) {
            console.error(`Error fetching products for collection ${collection.slug}:`, productsError);
          } else {
            enhanced.products = products;
          }
        }

        return enhanced;
      })
    );

    return NextResponse.json({ collections: enhancedCollections });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in GET /api/collections:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
