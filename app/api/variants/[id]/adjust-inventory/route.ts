import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { AdjustInventoryRequest, AdjustInventoryResponse } from '@/types/product-variant';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/variants/[id]/adjust-inventory
 * Adjust variant inventory with automatic audit logging
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const variantId = params.id;
    const body = await request.json();

    // Validate required fields
    if (body.quantity_change === undefined || !body.reason) {
      return NextResponse.json(
        { error: 'Missing required fields: quantity_change, reason' },
        { status: 400 }
      );
    }

    // Validate reason
    const validReasons = ['sale', 'restock', 'return', 'damaged', 'correction', 'other', 'adjustment', 'subscription', 'subscription_renewal'];
    if (!validReasons.includes(body.reason)) {
      return NextResponse.json(
        { error: `Invalid reason. Must be one of: ${validReasons.join(', ')}` },
        { status: 400 }
      );
    }

    // Call the database function to adjust inventory
    const { data, error } = await supabase.rpc('adjust_variant_inventory', {
      p_variant_id: variantId,
      p_quantity_change: body.quantity_change,
      p_reason: body.reason,
      p_notes: body.notes || null,
      p_order_id: body.order_id || null,
      p_adjusted_by: body.adjusted_by || 'system',
    });

    if (error) {
      console.error('Error adjusting inventory:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to adjust inventory' },
        { status: 500 }
      );
    }

    return NextResponse.json(data as AdjustInventoryResponse);
  } catch (error: any) {
    console.error('Error in POST /api/variants/[id]/adjust-inventory:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
