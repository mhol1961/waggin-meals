import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/variants/[id]/adjustments
 * Fetch inventory adjustment history for a variant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const variantId = params.id;

    const { data: adjustments, error } = await supabase
      .from('inventory_adjustments')
      .select('*')
      .eq('variant_id', variantId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching adjustments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch adjustment history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ adjustments });
  } catch (error: any) {
    console.error('Error in GET /api/variants/[id]/adjustments:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
