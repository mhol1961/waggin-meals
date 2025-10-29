import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/supabase/auth-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/subscriptions/[id]/invoices
 * Get invoices for a customer's subscription
 *
 * Customers can only view invoices for their own subscriptions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Require authentication
    const user = await requireAuth();

    // First, verify the subscription belongs to this user
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('customer_id')
      .eq('id', id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Verify ownership (customer_id should match auth user id)
    if (subscription.customer_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only view your own subscription invoices' },
        { status: 403 }
      );
    }

    // Fetch invoices for this subscription
    const { data: invoices, error } = await supabase
      .from('subscription_invoices')
      .select('*')
      .eq('subscription_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      );
    }

    return NextResponse.json({ invoices: invoices || [] });
  } catch (error: any) {
    console.error('Error in GET /api/subscriptions/[id]/invoices:', error);

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
