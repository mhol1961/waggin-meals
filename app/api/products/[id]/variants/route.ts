/**
 * Product Variants API Routes
 * /api/products/[id]/variants
 *
 * Handles listing and creating variants for a specific product
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { CreateVariantRequest } from '@/types/product-variant';

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

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, title, has_variants')
      .eq('id', productId)
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

    // Fetch variants
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('position', { ascending: true });

    if (variantsError) {
      console.error('Error fetching variants:', variantsError);
      return NextResponse.json(
        { error: 'Failed to fetch variants' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      product: {
        id: product.id,
        title: product.title,
        has_variants: product.has_variants,
      },
      variants: variants || [],
      count: variants?.length || 0,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in GET /api/products/[id]/variants:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, title')
      .eq('id', productId)
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

    // Parse request body
    const body: CreateVariantRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      );
    }

    if (body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if SKU already exists (if provided)
    if (body.sku) {
      const { data: existingSku } = await supabase
        .from('product_variants')
        .select('id')
        .eq('sku', body.sku)
        .single();

      if (existingSku) {
        return NextResponse.json(
          { error: `SKU "${body.sku}" already exists` },
          { status: 409 }
        );
      }
    } else {
      // Auto-generate SKU
      body.sku = await generateUniqueSKU(productId, body.title);
    }

    // Set defaults
    const variantData = {
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
      inventory_quantity: body.inventory_quantity ?? 0,
      inventory_policy: body.inventory_policy || 'deny',
      track_inventory: body.track_inventory ?? true,
      is_available: body.is_available ?? true,
      requires_shipping: body.requires_shipping ?? true,
      taxable: body.taxable ?? true,
      image_url: body.image_url || null,
      position: body.position ?? 0,
      barcode: body.barcode || null,
      notes: body.notes || null,
    };

    // Create variant
    const { data: variant, error: createError } = await supabase
      .from('product_variants')
      .insert(variantData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating variant:', createError);
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
      {
        message: 'Variant created successfully',
        variant,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in POST /api/products/[id]/variants:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * Helper: Generate unique SKU
 */
async function generateUniqueSKU(
  productId: string,
  variantTitle: string
): Promise<string> {
  // Get product title
  const { data: product } = await supabase
    .from('products')
    .select('title')
    .eq('id', productId)
    .single();

  const productName = product?.title || 'PRODUCT';

  // Clean and format strings
  const productSlug = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 10);
  const variantSlug = variantTitle
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 10);

  // Try to generate unique SKU (max 10 attempts)
  for (let attempt = 0; attempt < 10; attempt++) {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sku = `${productSlug}-${variantSlug}-${random}`;

    // Check if SKU exists
    const { data: existing } = await supabase
      .from('product_variants')
      .select('id')
      .eq('sku', sku)
      .single();

    if (!existing) {
      return sku;
    }
  }

  // Fallback to timestamp-based SKU
  const timestamp = Date.now().toString().slice(-8);
  return `${productSlug}-${timestamp}`;
}
