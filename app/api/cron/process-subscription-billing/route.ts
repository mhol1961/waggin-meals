import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chargeStoredPaymentMethod } from '@/lib/authorizenet-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/cron/process-subscription-billing
 * Process recurring subscription billing for all active subscriptions
 *
 * This endpoint should be called daily (recommended: 2 AM) via:
 * - Vercel Cron Jobs (vercel.json configuration)
 * - External cron service (e.g., cron-job.org)
 * - Server cron job
 *
 * Security: Requires CRON_SECRET environment variable to prevent unauthorized access
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('[Billing Cron] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Billing Cron] Starting subscription billing process...');

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Get all active subscriptions that are due for billing today
    const { data: dueSubscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customers!inner(id, email, first_name, last_name),
        payment_methods!inner(
          id,
          authorize_net_profile_id,
          authorize_net_payment_profile_id,
          card_type,
          last_four
        )
      `)
      .in('status', ['active', 'past_due'])
      .lte('next_billing_date', today);

    if (fetchError) {
      console.error('[Billing Cron] Error fetching subscriptions:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    if (!dueSubscriptions || dueSubscriptions.length === 0) {
      console.log('[Billing Cron] No subscriptions due for billing today');
      return NextResponse.json({
        success: true,
        message: 'No subscriptions due for billing',
        processed: 0,
      });
    }

    console.log(`[Billing Cron] Found ${dueSubscriptions.length} subscriptions due for billing`);

    const results = {
      total: dueSubscriptions.length,
      successful: 0,
      failed: 0,
      errors: [] as Array<{ subscriptionId: string; error: string }>,
    };

    // Process each subscription
    for (const subscription of dueSubscriptions) {
      try {
        console.log(`[Billing Cron] Processing subscription ${subscription.id}`);

        // Check if we already billed today (prevent duplicate charges)
        const { data: todayInvoices } = await supabase
          .from('subscription_invoices')
          .select('id')
          .eq('subscription_id', subscription.id)
          .eq('billing_date', today)
          .limit(1);

        if (todayInvoices && todayInvoices.length > 0) {
          console.log(`[Billing Cron] Subscription ${subscription.id} already billed today, skipping`);
          continue;
        }

        const paymentMethod = subscription.payment_methods;
        const customer = subscription.customers;

        if (!paymentMethod || !paymentMethod.authorize_net_profile_id || !paymentMethod.authorize_net_payment_profile_id) {
          throw new Error('Payment method not properly configured');
        }

        // Calculate billing amount
        const amount = subscription.price * subscription.quantity;
        const invoiceNumber = `SUB-${subscription.id.substring(0, 8)}-${Date.now()}`;

        // Charge the payment method
        console.log(`[Billing Cron] Charging $${amount} for subscription ${subscription.id}`);

        const chargeResponse = await chargeStoredPaymentMethod({
          amount: amount,
          customerProfileId: paymentMethod.authorize_net_profile_id,
          customerPaymentProfileId: paymentMethod.authorize_net_payment_profile_id,
          invoiceNumber: invoiceNumber,
          description: `Recurring: ${subscription.product_title}${subscription.variant_title ? ' - ' + subscription.variant_title : ''}`,
          customerId: subscription.customer_id,
          customerEmail: customer.email,
        });

        if (!chargeResponse.success) {
          throw new Error(chargeResponse.error || 'Payment failed');
        }

        console.log(`[Billing Cron] Payment successful for subscription ${subscription.id}: ${chargeResponse.transactionId}`);

        // Create invoice record
        await supabase.from('subscription_invoices').insert([
          {
            subscription_id: subscription.id,
            amount: amount,
            status: 'paid',
            billing_date: today,
            transaction_id: chargeResponse.transactionId,
          },
        ]);

        // Calculate next billing date
        const nextBillingDate = calculateNextBillingDate(new Date(subscription.next_billing_date), subscription.frequency);

        // Update subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'active', // Reset to active if was past_due
            next_billing_date: nextBillingDate.toISOString().split('T')[0],
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        // Add history entry
        await supabase.from('subscription_history').insert([
          {
            subscription_id: subscription.id,
            action: 'payment_processed',
            actor_type: 'system',
            notes: `Recurring payment processed: $${amount} (Transaction: ${chargeResponse.transactionId})`,
          },
        ]);

        // Send success email
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'subscription_payment_success',
              to: customer.email,
              data: {
                subscription_id: subscription.id,
                customer_name: `${customer.first_name} ${customer.last_name}`,
                product_title: subscription.product_title,
                variant_title: subscription.variant_title,
                amount: amount,
                transaction_id: chargeResponse.transactionId,
                next_billing_date: nextBillingDate.toLocaleDateString(),
              },
            }),
          });
        } catch (emailError) {
          console.error(`[Billing Cron] Error sending success email for subscription ${subscription.id}:`, emailError);
        }

        results.successful++;
        console.log(`[Billing Cron] Successfully processed subscription ${subscription.id}`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Billing Cron] Error processing subscription ${subscription.id}:`, errorMessage);

        results.failed++;
        results.errors.push({
          subscriptionId: subscription.id,
          error: errorMessage,
        });

        // Update subscription to past_due or payment_failed
        const customer = subscription.customers;

        // Check if this is a retry or first failure
        const { data: recentFailures } = await supabase
          .from('subscription_invoices')
          .select('id')
          .eq('subscription_id', subscription.id)
          .eq('status', 'failed')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

        const failureCount = (recentFailures?.length || 0) + 1;

        // After 3 failures within 7 days, mark as payment_failed
        const newStatus = failureCount >= 3 ? 'payment_failed' : 'past_due';

        await supabase
          .from('subscriptions')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        // Create failed invoice record
        await supabase.from('subscription_invoices').insert([
          {
            subscription_id: subscription.id,
            amount: subscription.price * subscription.quantity,
            status: 'failed',
            billing_date: today,
            transaction_id: null,
          },
        ]);

        // Add history entry
        await supabase.from('subscription_history').insert([
          {
            subscription_id: subscription.id,
            action: 'payment_failed',
            actor_type: 'system',
            notes: `Payment failed (attempt ${failureCount}): ${errorMessage}`,
          },
        ]);

        // Send failure email
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'subscription_payment_failed',
              to: customer.email,
              data: {
                subscription_id: subscription.id,
                customer_name: `${customer.first_name} ${customer.last_name}`,
                product_title: subscription.product_title,
                variant_title: subscription.variant_title,
                error_message: errorMessage,
                failure_count: failureCount,
                is_final_attempt: failureCount >= 3,
                update_payment_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/payment-methods`,
              },
            }),
          });
        } catch (emailError) {
          console.error(`[Billing Cron] Error sending failure email for subscription ${subscription.id}:`, emailError);
        }
      }
    }

    console.log(`[Billing Cron] Billing process complete: ${results.successful} successful, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      results: results,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Billing Cron] Fatal error in billing process:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Calculate next billing date based on frequency
 */
function calculateNextBillingDate(currentBillingDate: Date, frequency: string): Date {
  const next = new Date(currentBillingDate);

  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'bi-weekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1); // Default to monthly
  }

  return next;
}

/**
 * GET /api/cron/process-subscription-billing
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    message: 'Subscription billing cron endpoint is operational',
    note: 'Use POST method with CRON_SECRET to trigger billing',
  });
}
