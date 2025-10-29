import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/subscriptions/[id]/skip-next
 * Skip the next delivery for a subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { reason } = body;

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

    if (currentSub.status !== 'active') {
      return NextResponse.json(
        { error: 'Only active subscriptions can skip deliveries' },
        { status: 400 }
      );
    }

    // Calculate new next_billing_date (skip one cycle)
    const currentNextBilling = new Date(currentSub.next_billing_date);
    const newNextBilling = calculateNextBillingDate(currentNextBilling, currentSub.frequency);

    // Update subscription
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        next_billing_date: newNextBilling.toISOString().split('T')[0],
        metadata: {
          ...currentSub.metadata,
          last_skip_date: new Date().toISOString(),
          last_skip_reason: reason,
          total_skips: (currentSub.metadata?.total_skips || 0) + 1,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error skipping delivery:', updateError);
      return NextResponse.json(
        { error: 'Failed to skip delivery' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: params.id,
        action: 'delivery_skipped',
        old_status: 'active',
        new_status: 'active',
        notes: reason || 'Customer skipped next delivery',
        actor_type: 'customer',
        metadata: {
          old_next_billing_date: currentSub.next_billing_date,
          new_next_billing_date: newNextBilling.toISOString().split('T')[0],
        },
      },
    ]);

    // Send notification to GoHighLevel
    const { data: customer } = await supabase
      .from('customers')
      .select('email, first_name, last_name, phone')
      .eq('id', subscription.customer_id)
      .single();

    if (customer) {
      await GHL.notifyDeliverySkipped({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        frequency: subscription.frequency,
        old_delivery_date: currentSub.next_billing_date,
        new_delivery_date: newNextBilling.toISOString().split('T')[0],
        skip_reason: reason,
      });
    }

    return NextResponse.json({
      subscription,
      message: `Next delivery skipped. Your next order will be on ${newNextBilling.toLocaleDateString()}.`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in POST /api/subscriptions/[id]/skip-next:', error);
    return NextResponse.json(
      { error: errorMessage },
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
