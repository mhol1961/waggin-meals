import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';
import type { UpdateSubscriptionRequest, PauseSubscriptionRequest } from '@/types/subscription';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/subscriptions/[id]
 * Get a single subscription
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error in GET /api/subscriptions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/subscriptions/[id]
 * Update a subscription
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: UpdateSubscriptionRequest = await request.json();

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

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.frequency) {
      updates.frequency = body.frequency;
    }

    if (body.items) {
      updates.items = body.items;
      // Recalculate amount
      const amount = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      updates.amount = amount * (1 - (currentSub.discount_percentage || 0) / 100);
    }

    if (body.payment_method_id) {
      updates.payment_method_id = body.payment_method_id;
    }

    if (body.next_billing_date) {
      updates.next_billing_date = body.next_billing_date;
    }

    // Update subscription
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: params.id,
        action: 'updated',
        changed_fields: updates,
        actor_type: 'customer',
      },
    ]);

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error in PATCH /api/subscriptions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscriptions/[id]
 * Cancel a subscription
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason');

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

    // Update subscription to cancelled
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error cancelling subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: params.id,
        action: 'cancelled',
        old_status: currentSub.status,
        new_status: 'cancelled',
        notes: reason || undefined,
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
      await GHL.notifySubscriptionCancelled({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        frequency: subscription.frequency,
        amount: subscription.amount,
        items: subscription.items,
        cancellation_reason: reason || undefined,
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error in DELETE /api/subscriptions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
