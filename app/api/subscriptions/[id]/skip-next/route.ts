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
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

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

    // Get current subscription WITH customer join for ownership check
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
      console.warn(`🚨 Unauthorized skip attempt: User ${user.email} tried to skip subscription ${id} owned by ${currentSub.customers.email}`);
      return NextResponse.json(
        { error: 'Forbidden - you do not own this subscription' },
        { status: 403 }
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
      .eq('id', id)
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
        subscription_id: id,
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
        // Add tag for delivery skip
        const tags = ['subscription-skipped'];

        const ghlResult: GHL.GHLSyncResult = await GHL.syncContactToGHL({
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          tags,
          customFields: {
            subscription_id: subscription.id,
            last_skip_date: new Date().toISOString(),
            next_billing_date: newNextBilling.toISOString().split('T')[0],
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

          console.log(`[GHL] ✅ Synced delivery skip for ${customer.email}`);
        } else {
          console.error('[GHL] Failed to sync delivery skip:', ghlResult.error);
        }
      }
    } catch (ghlError) {
      console.error('[GHL] Error during skip sync:', ghlError);
      // Don't fail the request if GHL sync fails
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
