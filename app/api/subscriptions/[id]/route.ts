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
    const { id } = await params;

    // =================================
    // SECURITY: Authenticate user
    // =================================
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - missing authentication' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid authentication' },
        { status: 401 }
      );
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, customers!inner(*)')
      .eq('id', id)
      .single();

    if (error || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // =================================
    // SECURITY: Verify user owns this subscription
    // =================================
    if (subscription.customers.email !== user.email) {
      console.warn(`🚨 Unauthorized action attempt: User ${user.email} tried to access subscription ${id} owned by ${subscription.customers.email}`);
      return NextResponse.json(
        { error: 'Forbidden - you do not own this subscription' },
        { status: 403 }
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
    const { id } = await params;

    // =================================
    // SECURITY: Authenticate user
    // =================================
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - missing authentication' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid authentication' },
        { status: 401 }
      );
    }

    const body: UpdateSubscriptionRequest = await request.json();

    // Get current subscription
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*, customers!inner(*)')
      .eq('id', id)
      .single();

    if (fetchError || !currentSub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // =================================
    // SECURITY: Verify user owns this subscription
    // =================================
    if (currentSub.customers.email !== user.email) {
      console.warn(`🚨 Unauthorized action attempt: User ${user.email} tried to modify subscription ${id} owned by ${currentSub.customers.email}`);
      return NextResponse.json(
        { error: 'Forbidden - you do not own this subscription' },
        { status: 403 }
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
      .eq('id', id)
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
        subscription_id: id,
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
    const { id } = await params;

    // =================================
    // SECURITY: Authenticate user
    // =================================
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - missing authentication' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid authentication' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason');

    // Get current subscription
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*, customers!inner(*)')
      .eq('id', id)
      .single();

    if (fetchError || !currentSub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // =================================
    // SECURITY: Verify user owns this subscription
    // =================================
    if (currentSub.customers.email !== user.email) {
      console.warn(`🚨 Unauthorized action attempt: User ${user.email} tried to cancel subscription ${id} owned by ${currentSub.customers.email}`);
      return NextResponse.json(
        { error: 'Forbidden - you do not own this subscription' },
        { status: 403 }
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
      .eq('id', id)
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
        subscription_id: id,
        action: 'cancelled',
        old_status: currentSub.status,
        new_status: 'cancelled',
        notes: reason || undefined,
        actor_type: 'customer',
      },
    ]);

    // =================================
    // SYNC TO GHL (Tag Accumulation)
    // =================================
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('email, first_name, last_name, phone')
        .eq('id', subscription.customer_id)
        .single();

      if (customer) {
        // Add tag for subscription cancellation
        const tags = ['subscription-cancelled'];

        const ghlResult: GHL.GHLSyncResult = await GHL.syncContactToGHL({
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          tags,
          customFields: {
            subscription_id: subscription.id,
            subscription_status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            cancellation_reason: reason || 'Not specified',
          },
        });

        // Log GHL sync result
        if (ghlResult.success && ghlResult.contactId) {
          await supabase
            .from('subscriptions')
            .update({
              ghl_contact_id: ghlResult.contactId,
              ghl_tags: [...(currentSub.ghl_tags || []), ...tags],
              ghl_last_sync_at: new Date().toISOString(),
              ghl_sync_error: null,
            })
            .eq('id', id);

          console.log(`[GHL] ✅ Synced subscription cancellation for ${customer.email}`);
        } else {
          console.error('[GHL] Failed to sync subscription cancellation:', ghlResult.error);
        }
      }
    } catch (ghlError) {
      console.error('[GHL] Error during cancellation sync:', ghlError);
      // Don't fail the request if GHL sync fails
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
