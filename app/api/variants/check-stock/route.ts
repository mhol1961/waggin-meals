import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { StockCheckResponse } from '@/types/product-variant';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/variants/check-stock
 * Check if variant has sufficient stock for purchase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variant_id, quantity } = body;

    if (!variant_id || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: variant_id, quantity' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Call the database function to check stock
    const { data: hasStock, error } = await supabase.rpc('check_variant_stock', {
      p_variant_id: variant_id,
      p_quantity: quantity,
    });

    if (error) {
      console.error('Error checking stock:', error);
      return NextResponse.json(
        { error: 'Failed to check stock' },
        { status: 500 }
      );
    }

    // Get variant details for response
    const { data: variant } = await supabase
      .from('product_variants')
      .select('inventory_quantity, is_available, track_inventory, inventory_policy')
      .eq('id', variant_id)
      .single();

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    const response: StockCheckResponse = {
      available: hasStock,
      variant_id,
      requested_quantity: quantity,
      available_quantity: variant.inventory_quantity,
    };

    if (!hasStock) {
      if (!variant.is_available) {
        response.message = 'Product variant is not available';
      } else if (variant.track_inventory && variant.inventory_quantity < quantity) {
        response.message = `Only ${variant.inventory_quantity} units available`;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/variants/check-stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
