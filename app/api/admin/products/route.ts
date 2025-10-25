import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * GET /api/admin/products
 * Get all products (including unpublished)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ products: data });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      handle,
      description,
      price,
      compare_at_price,
      weight,
      sku,
      inventory_count,
      category,
      tags,
      images,
      in_stock,
      is_featured,
      is_published,
    } = body;

    // Validate required fields
    if (!title || !handle || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, handle, price, and category' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if handle already exists
    const { data: existing } = await supabase
      .from('products')
      .select('handle')
      .eq('handle', handle)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A product with this handle already exists' },
        { status: 400 }
      );
    }

    // Create product
    const { data, error } = await supabase
      .from('products')
      .insert({
        title,
        handle,
        description,
        price,
        compare_at_price,
        weight,
        sku,
        inventory_count: inventory_count || 0,
        category,
        tags: tags || [],
        images: images || [],
        in_stock: in_stock !== undefined ? in_stock : true,
        is_featured: is_featured || false,
        is_published: is_published || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
