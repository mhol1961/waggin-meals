import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/products
 * Fetch all published products with optional filtering
 *
 * Query params:
 * - collection: Filter by collection slug (e.g., "fresh-food")
 * - category: Filter by category (e.g., "Dog Food")
 * - featured: "true" to get only featured products
 * - limit: Number of products to return (default: all)
 * - in_stock: "true" to get only in-stock products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionSlug = searchParams.get('collection');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const inStockOnly = searchParams.get('in_stock') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;

    // Build query
    let query = supabase
      .from('products_with_collections')
      .select('*')
      .eq('is_published', true)
      .eq('status', 'active');

    // Apply filters
    if (collectionSlug) {
      query = query.eq('collection_slug', collectionSlug);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    if (inStockOnly) {
      query = query.eq('in_stock', true);
    }

    // Order by inventory (high stock first) and created date
    query = query.order('inventory_count', { ascending: false });

    // Apply limit if specified
    if (limit) {
      query = query.limit(limit);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
