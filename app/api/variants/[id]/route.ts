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
    const { id } = await params;

    const { data: variant, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ variant });
  } catch (error) {
    console.error('Error in GET /api/variants/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/variants/[id]
 * Update a variant
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateVariantRequest = await request.json();

    // Check if variant exists
    const { data: existing } = await supabase
      .from('product_variants')
      .select('id, sku')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // If updating SKU, check for duplicates
    if (body.sku && body.sku !== existing.sku) {
      const { data: duplicate } = await supabase
        .from('product_variants')
        .select('id')
        .eq('sku', body.sku)
        .single();

      if (duplicate) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 409 }
        );
      }
    }

    // Build update object (only include fields that were provided)
    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.sku !== undefined) updates.sku = body.sku;
    if (body.price !== undefined) updates.price = body.price;
    if (body.compare_at_price !== undefined) updates.compare_at_price = body.compare_at_price;
    if (body.cost_per_unit !== undefined) updates.cost_per_unit = body.cost_per_unit;
    if (body.weight !== undefined) updates.weight = body.weight;
    if (body.weight_unit !== undefined) updates.weight_unit = body.weight_unit;
    if (body.dimensions_length !== undefined) updates.dimensions_length = body.dimensions_length;
    if (body.dimensions_width !== undefined) updates.dimensions_width = body.dimensions_width;
    if (body.dimensions_height !== undefined) updates.dimensions_height = body.dimensions_height;
    if (body.dimensions_unit !== undefined) updates.dimensions_unit = body.dimensions_unit;
    if (body.option1_name !== undefined) updates.option1_name = body.option1_name;
    if (body.option1_value !== undefined) updates.option1_value = body.option1_value;
    if (body.option2_name !== undefined) updates.option2_name = body.option2_name;
    if (body.option2_value !== undefined) updates.option2_value = body.option2_value;
    if (body.option3_name !== undefined) updates.option3_name = body.option3_name;
    if (body.option3_value !== undefined) updates.option3_value = body.option3_value;
    if (body.inventory_quantity !== undefined) updates.inventory_quantity = body.inventory_quantity;
    if (body.inventory_policy !== undefined) updates.inventory_policy = body.inventory_policy;
    if (body.track_inventory !== undefined) updates.track_inventory = body.track_inventory;
    if (body.is_available !== undefined) updates.is_available = body.is_available;
    if (body.requires_shipping !== undefined) updates.requires_shipping = body.requires_shipping;
    if (body.taxable !== undefined) updates.taxable = body.taxable;
    if (body.image_url !== undefined) updates.image_url = body.image_url;
    if (body.position !== undefined) updates.position = body.position;
    if (body.barcode !== undefined) updates.barcode = body.barcode;
    if (body.notes !== undefined) updates.notes = body.notes;

    // Update variant
    const { data: variant, error } = await supabase
      .from('product_variants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating variant:', error);
      return NextResponse.json(
        { error: 'Failed to update variant' },
        { status: 500 }
      );
    }

    return NextResponse.json({ variant, message: 'Variant updated successfully' });
  } catch (error) {
    console.error('Error in PATCH /api/variants/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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
    const { id } = await params;

    // Get variant to check product_id
    const { data: variant } = await supabase
      .from('product_variants')
      .select('product_id')
      .eq('id', id)
      .single();

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Delete variant
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting variant:', error);
      return NextResponse.json(
        { error: 'Failed to delete variant' },
        { status: 500 }
      );
    }

    // Check if product has any remaining variants
    const { data: remainingVariants } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', variant.product_id)
      .limit(1);

    // Update product has_variants flag if no variants remain
    if (!remainingVariants || remainingVariants.length === 0) {
      await supabase
        .from('products')
        .update({ has_variants: false })
        .eq('id', variant.product_id);
    }

    return NextResponse.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/variants/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
