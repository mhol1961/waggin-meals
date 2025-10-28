import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/auth-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/admin/subscriptions/manual-billing
 * Manually trigger billing for a specific subscription (admin only)
 *
 * This essentially runs the billing cron logic for a single subscription
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin();

    const body = await request.json();
    const { subscription_id } = body;

    if (!subscription_id) {
      return NextResponse.json(
        { error: 'subscription_id is required' },
        { status: 400 }
      );
    }

    // Get the subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscription_id)
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription must be active to process billing' },
        { status: 400 }
      );
    }

    // Call the actual billing cron endpoint
    // We'll trigger it via an internal fetch to the cron endpoint
    // with special admin authorization
    const cronResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/cron/process-billing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        'X-Manual-Subscription-ID': subscription_id, // Special header to process only this subscription
      },
    });

    if (!cronResponse.ok) {
      const errorData = await cronResponse.json();
      throw new Error(errorData.error || 'Failed to process billing');
    }

    const result = await cronResponse.json();

    // Log admin action
    await supabase.from('subscription_history').insert([
      {
        subscription_id,
        action: 'manual_billing_triggered',
        actor_type: 'admin',
        notes: 'Admin manually triggered billing process',
      },
    ]);

    return NextResponse.json({
      message: 'Billing processed successfully',
      result,
    });
  } catch (error: any) {
    console.error('Error in POST /api/admin/subscriptions/manual-billing:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
