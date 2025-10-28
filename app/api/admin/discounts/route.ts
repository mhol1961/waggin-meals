import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const body = await request.json();
    const {
      code,
      description,
      discount_type,
      discount_value,
      usage_limit,
      minimum_purchase,
      starts_at,
      expires_at,
      is_active
    } = body;

    // Validate required fields
    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate discount value
    if (discount_type === 'percentage' && (discount_value < 0 || discount_value > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Create discount code
    const { data: discount, error } = await supabase
      .from('discount_codes')
      .insert({
        code: code.toUpperCase(),
        description,
        discount_type,
        discount_value,
        usage_limit,
        minimum_purchase,
        starts_at,
        expires_at,
        is_active
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating discount code:', error);
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Discount code already exists' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json(discount);
  } catch (error) {
    console.error('Error in discount POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: discounts, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching discount codes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch discount codes' },
        { status: 500 }
      );
    }

    return NextResponse.json(discounts);
  } catch (error) {
    console.error('Error in discount GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
