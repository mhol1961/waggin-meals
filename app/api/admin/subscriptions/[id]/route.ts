import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/auth-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/subscriptions/[id]
 * Get detailed subscription information with customer and payment method data (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireAdmin();

    const { id } = await params;

    // Fetch subscription with customer and payment method joins
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customer:customers!subscriptions_customer_id_fkey (
          id,
          email,
          first_name,
          last_name,
          phone
        ),
        payment_method:payment_methods!subscriptions_payment_method_id_fkey (
          id,
          card_type,
          last_four,
          expiration_month,
          expiration_year,
          billing_address
        )
      `)
      .eq('id', id)
      .single();

    if (error || !subscription) {
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error in GET /api/admin/subscriptions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
