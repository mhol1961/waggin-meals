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

    const body: PauseSubscriptionRequest = await request.json();

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
        // Add tag for subscription pause
        const tags = ['subscription-paused'];

        const ghlResult: GHL.GHLSyncResult = await GHL.syncContactToGHL({
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          tags,
          customFields: {
            subscription_id: subscription.id,
            subscription_status: 'paused',
            pause_reason: body.reason || 'Not specified',
            paused_at: new Date().toISOString(),
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

          console.log(`[GHL] ✅ Synced subscription pause for ${customer.email}`);
        } else {
          console.error('[GHL] Failed to sync subscription pause:', ghlResult.error);
        }
      }
    } catch (ghlError) {
      console.error('[GHL] Error during pause sync:', ghlError);
      // Don't fail the request if GHL sync fails
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
