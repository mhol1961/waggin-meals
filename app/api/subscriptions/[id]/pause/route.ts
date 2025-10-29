import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';
import type { PauseSubscriptionRequest } from '@/types/subscription';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/subscriptions/[id]/pause
 * Pause a subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: PauseSubscriptionRequest = await request.json();

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
        { error: 'Only active subscriptions can be paused' },
        { status: 400 }
      );
    }

    // Pause subscription
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'paused',
        paused_at: new Date().toISOString(),
        metadata: {
          ...currentSub.metadata,
          pause_reason: body.reason,
          resume_date: body.resume_date,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error pausing subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to pause subscription' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: id,
        action: 'paused',
        old_status: 'active',
        new_status: 'paused',
        notes: body.reason,
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
      await GHL.notifySubscriptionPaused({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        frequency: subscription.frequency,
        amount: subscription.amount,
        items: subscription.items,
        pause_reason: body.reason,
        resume_date: body.resume_date,
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error in POST /api/subscriptions/[id]/pause:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
