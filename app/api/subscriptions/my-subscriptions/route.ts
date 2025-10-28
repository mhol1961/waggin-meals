import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/supabase/auth-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/subscriptions/my-subscriptions
 * Get all subscriptions for the authenticated customer
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Fetch subscriptions for this customer
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        payment_method:payment_methods(
          id,
          card_type,
          last_four,
          expiration_month,
          expiration_year
        )
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptions: subscriptions || [] });
  } catch (error: any) {
    console.error('Error in GET /api/subscriptions/my-subscriptions:', error);

    // Handle authentication errors
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
