import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_FREQUENCIES = ['weekly', 'biweekly', 'monthly', '4-weeks', '6-weeks', '8-weeks'];

/**
 * POST /api/subscriptions/[id]/change-frequency
 * Change the billing frequency of a subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { frequency, reason } = body;

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

    // Validate frequency
    if (!frequency || !VALID_FREQUENCIES.includes(frequency)) {
      return NextResponse.json(
        {
          error: 'Invalid frequency',
          valid_frequencies: VALID_FREQUENCIES,
        },
        { status: 400 }
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
      console.warn(`🚨 Unauthorized frequency change attempt: User ${user.email} tried to change subscription ${id} owned by ${currentSub.customers.email}`);
      return NextResponse.json(
        { error: 'Forbidden - you do not own this subscription' },
        { status: 403 }
      );
    }

    if (currentSub.status !== 'active' && currentSub.status !== 'paused') {
      return NextResponse.json(
        { error: 'Only active or paused subscriptions can change frequency' },
        { status: 400 }
      );
    }

    // Don't update if frequency is the same
    if (currentSub.frequency === frequency) {
      return NextResponse.json(
        { message: 'Frequency is already set to this value' },
        { status: 200 }
      );
    }

    // Calculate new next_billing_date based on new frequency
    const currentNextBilling = new Date(currentSub.next_billing_date);
    const today = new Date();

    // If next billing is in the past or today, calculate from today
    const startDate = currentNextBilling < today ? today : currentNextBilling;
    const newNextBilling = calculateNextBillingDate(startDate, frequency);

    // Update subscription
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        frequency,
        next_billing_date: newNextBilling.toISOString().split('T')[0],
        metadata: {
          ...currentSub.metadata,
          last_frequency_change: new Date().toISOString(),
          previous_frequency: currentSub.frequency,
          frequency_change_reason: reason,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error changing frequency:', updateError);
      return NextResponse.json(
        { error: 'Failed to change frequency' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: id,
        action: 'frequency_changed',
        old_status: currentSub.status,
        new_status: currentSub.status,
        notes: reason || `Frequency changed from ${currentSub.frequency} to ${frequency}`,
        actor_type: 'customer',
        metadata: {
          old_frequency: currentSub.frequency,
          new_frequency: frequency,
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
        // Add tag for frequency change
        const tags = ['subscription-frequency-changed'];

        const ghlResult: GHL.GHLSyncResult = await GHL.syncContactToGHL({
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          tags,
          customFields: {
            subscription_id: subscription.id,
            subscription_frequency: frequency,
            next_billing_date: newNextBilling.toISOString().split('T')[0],
            subscription_amount: subscription.amount.toString(),
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

          console.log(`[GHL] ✅ Synced frequency change for ${customer.email}: ${currentSub.frequency} → ${frequency}`);
        } else {
          console.error('[GHL] Failed to sync frequency change:', ghlResult.error);
        }
      }
    } catch (ghlError) {
      console.error('[GHL] Error during frequency change sync:', ghlError);
      // Don't fail the request if GHL sync fails
    }

    return NextResponse.json({
      subscription,
      message: `Delivery frequency updated to ${formatFrequency(frequency)}. Next delivery: ${newNextBilling.toLocaleDateString()}.`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in POST /api/subscriptions/[id]/change-frequency:', error);
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

function formatFrequency(frequency: string): string {
  const map: Record<string, string> = {
    weekly: 'Weekly',
    biweekly: 'Every 2 Weeks',
    monthly: 'Monthly',
    '4-weeks': 'Every 4 Weeks',
    '6-weeks': 'Every 6 Weeks',
    '8-weeks': 'Every 8 Weeks',
  };
  return map[frequency] || frequency;
}
