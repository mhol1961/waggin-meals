/**
 * Single Variant API Routes
 * /api/variants/[id]
 *
 * Handles GET, PUT, and DELETE operations for individual variants
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { UpdateVariantRequest } from '@/types/product-variant';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/variants/[id]
 * Get a single variant by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: variantId } = await params;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Fetch variant with product info
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select(
        `
        *,
        products:product_id (
          id,
          title,
          handle,
          category
        )
      `
      )
      .eq('id', variantId)
      .single();

    if (variantError) {
      if (variantError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching variant:', variantError);
      return NextResponse.json(
        { error: 'Failed to fetch variant' },
        { status: 500 }
      );
    }

    return NextResponse.json({ variant });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in GET /api/variants/[id]:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * PUT /api/variants/[id]
 * Update a variant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: variantId } = await params;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Verify variant exists
    const { data: existingVariant, error: findError } = await supabase
      .from('product_variants')
      .select('id, sku, product_id')
      .eq('id', variantId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        );
      }
      console.error('Error finding variant:', findError);
      return NextResponse.json(
        { error: 'Failed to find variant' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: UpdateVariantRequest = await request.json();

    // Validate price if provided
    if (body.price !== undefined && body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if SKU already exists (if updating SKU)
    if (body.sku && body.sku !== existingVariant.sku) {
      const { data: duplicateSku } = await supabase
        .from('product_variants')
        .select('id')
        .eq('sku', body.sku)
        .neq('id', variantId)
        .single();

      if (duplicateSku) {
        return NextResponse.json(
          { error: `SKU "${body.sku}" already exists` },
          { status: 409 }
        );
      }
    }

    // Update variant
    const { data: variant, error: updateError } = await supabase
      .from('product_variants')
      .update(body)
      .eq('id', variantId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating variant:', updateError);
      return NextResponse.json(
        { error: 'Failed to update variant' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Variant updated successfully',
      variant,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in PUT /api/variants/[id]:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * PATCH /api/variants/[id]
 * Partially update a variant (alias for PUT)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

/**
 * DELETE /api/variants/[id]
 * Delete a variant
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: variantId } = await params;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Get variant to check product_id
    const { data: variant, error: findError } = await supabase
      .from('product_variants')
      .select('id, product_id, title')
      .eq('id', variantId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        );
      }
      console.error('Error finding variant:', findError);
      return NextResponse.json(
        { error: 'Failed to find variant' },
        { status: 500 }
      );
    }

    const productId = variant.product_id;

    // Check if this is the last variant
    const { data: otherVariants, error: countError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .neq('id', variantId);

    if (countError) {
      console.error('Error counting variants:', countError);
      return NextResponse.json(
        { error: 'Failed to count variants' },
        { status: 500 }
      );
    }

    const isLastVariant = !otherVariants || otherVariants.length === 0;

    // Delete the variant
    const { error: deleteError } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId);

    if (deleteError) {
      console.error('Error deleting variant:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete variant' },
        { status: 500 }
      );
    }

    // Update product has_variants flag if this was the last variant
    if (isLastVariant) {
      await supabase
        .from('products')
        .update({ has_variants: false })
        .eq('id', productId);
    }

    return NextResponse.json({
      message: 'Variant deleted successfully',
      deleted_variant: {
        id: variantId,
        title: variant.title,
      },
      is_last_variant: isLastVariant,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in DELETE /api/variants/[id]:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
