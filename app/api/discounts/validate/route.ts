import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      );
    }

    // Fetch discount code
    const { data: discount, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !discount) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 404 }
      );
    }

    // Validate discount code
    const now = new Date();

    // Check if active
    if (!discount.is_active) {
      return NextResponse.json(
        { error: 'This discount code is no longer active' },
        { status: 400 }
      );
    }

    // Check if started
    if (discount.starts_at && new Date(discount.starts_at) > now) {
      return NextResponse.json(
        { error: 'This discount code is not yet valid' },
        { status: 400 }
      );
    }

    // Check if expired
    if (discount.expires_at && new Date(discount.expires_at) < now) {
      return NextResponse.json(
        { error: 'This discount code has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
      return NextResponse.json(
        { error: 'This discount code has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check minimum purchase
    if (discount.minimum_purchase && subtotal < discount.minimum_purchase) {
      return NextResponse.json(
        {
          error: `Minimum purchase of $${discount.minimum_purchase.toFixed(2)} required for this discount code`
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.discount_type === 'percentage') {
      discountAmount = subtotal * (discount.discount_value / 100);
    } else {
      discountAmount = discount.discount_value;
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    return NextResponse.json({
      valid: true,
      discount_amount: discountAmount,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      code: discount.code
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
