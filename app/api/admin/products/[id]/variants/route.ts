import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { CreateVariantRequest, ProductVariant } from '@/types/product-variant';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/products/[id]/variants
 * Get all variants for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Fetch variants for this product
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching variants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch variants' },
        { status: 500 }
      );
    }

    return NextResponse.json({ variants: variants || [] });
  } catch (error) {
    console.error('Error in GET /api/products/[id]/variants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/[id]/variants
 * Create a new variant for a product
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body: CreateVariantRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.sku || body.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: title, sku, price' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const { data: existing } = await supabase
      .from('product_variants')
      .select('id')
      .eq('sku', body.sku)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 409 }
      );
    }

    // Create variant
    const { data: variant, error } = await supabase
      .from('product_variants')
      .insert([
        {
          product_id: productId,
          title: body.title,
          sku: body.sku,
          price: body.price,
          compare_at_price: body.compare_at_price || null,
          cost_per_unit: body.cost_per_unit || null,
          weight: body.weight || null,
          weight_unit: body.weight_unit || 'lb',
          dimensions_length: body.dimensions_length || null,
          dimensions_width: body.dimensions_width || null,
          dimensions_height: body.dimensions_height || null,
          dimensions_unit: body.dimensions_unit || 'in',
          option1_name: body.option1_name || null,
          option1_value: body.option1_value || null,
          option2_name: body.option2_name || null,
          option2_value: body.option2_value || null,
          option3_name: body.option3_name || null,
          option3_value: body.option3_value || null,
          inventory_quantity: body.inventory_quantity || 0,
          inventory_policy: body.inventory_policy || 'deny',
          track_inventory: body.track_inventory !== false, // Default true
          is_available: body.is_available !== false, // Default true
          requires_shipping: body.requires_shipping !== false, // Default true
          taxable: body.taxable !== false, // Default true
          image_url: body.image_url || null,
          position: body.position || 0,
          barcode: body.barcode || null,
          notes: body.notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating variant:', error);
      return NextResponse.json(
        { error: 'Failed to create variant' },
        { status: 500 }
      );
    }

    // Update product has_variants flag
    await supabase
      .from('products')
      .update({ has_variants: true })
      .eq('id', productId);

    return NextResponse.json(
      { variant, message: 'Variant created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/products/[id]/variants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
