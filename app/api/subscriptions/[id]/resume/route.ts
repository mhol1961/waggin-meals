import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/subscriptions/[id]/resume
 * Resume a paused subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current subscription
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentSub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (currentSub.status !== 'paused') {
      return NextResponse.json(
        { error: 'Only paused subscriptions can be resumed' },
        { status: 400 }
      );
    }

    // Calculate new next_billing_date
    const now = new Date();
    const nextBillingDate = calculateNextBillingDate(now, currentSub.frequency);

    // Resume subscription
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        paused_at: null,
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
        metadata: {
          ...currentSub.metadata,
          pause_reason: undefined,
          resume_date: undefined,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error resuming subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to resume subscription' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: params.id,
        action: 'resumed',
        old_status: 'paused',
        new_status: 'active',
        actor_type: 'customer',
      },
    ]);

    // Send notification to GoHighLevel
    const { data: customer } = await supabase
      .from('customers')
      .select('email, first_name, last_name, phone')
      .eq('id', subscription.customer_id)
      .single();

    if (customer) {
      await GHL.notifySubscriptionResumed({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        frequency: subscription.frequency,
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
        amount: subscription.amount,
        items: subscription.items,
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error in POST /api/subscriptions/[id]/resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateNextBillingDate(from: Date, frequency: string): Date {
  const next = new Date(from);

  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case '4-weeks':
      next.setDate(next.getDate() + 28);
      break;
    case '6-weeks':
      next.setDate(next.getDate() + 42);
      break;
    case '8-weeks':
      next.setDate(next.getDate() + 56);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }

  return next;
}
