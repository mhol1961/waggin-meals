import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as AuthorizeNet from '@/lib/authorize-net';
import * as GHL from '@/lib/ghl-service';
import type { Subscription, SubscriptionInvoice } from '@/types/subscription';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/cron/process-billing
 *
 * Recurring billing cron job
 * Should be called daily to process subscriptions due for billing
 *
 * Configure in Netlify/Vercel:
 * - Create scheduled function to call this endpoint daily
 * - Or use external cron service (cron-job.org, EasyCron, etc.)
 *
 * Secure with CRON_SECRET environment variable
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting billing process...');

    // Check if this is a manual single-subscription billing request
    const manualSubscriptionId = request.headers.get('X-Manual-Subscription-ID');

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Get subscriptions to process
    let query = supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    if (manualSubscriptionId) {
      // Process only the specified subscription (manual admin trigger)
      console.log(`Manual billing triggered for subscription ${manualSubscriptionId}`);
      query = query.eq('id', manualSubscriptionId);
    } else {
      // Normal cron: process subscriptions due for billing
      query = query.lte('next_billing_date', today);
    }

    const { data: subscriptions, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    console.log(`Found ${subscriptions?.length || 0} subscriptions due for billing`);

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as Array<{ subscription_id: string; error: string }>,
    };

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: 'No subscriptions due for billing',
        results,
      });
    }

    // Process each subscription
    for (const subscription of subscriptions) {
      try {
        results.processed++;
        await processSubscriptionBilling(subscription);
        results.succeeded++;
      } catch (error: any) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        results.failed++;
        results.errors.push({
          subscription_id: subscription.id,
          error: error.message || 'Unknown error',
        });
      }
    }

    console.log('Billing process completed', results);

    return NextResponse.json({
      message: 'Billing process completed',
      results,
    });
  } catch (error) {
    console.error('Error in POST /api/cron/process-billing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process billing for a single subscription
 */
async function processSubscriptionBilling(subscription: Subscription) {
  console.log(`Processing subscription ${subscription.id}`);

  // Get payment method
  if (!subscription.payment_method_id) {
    throw new Error('No payment method on file');
  }

  const { data: paymentMethod, error: pmError } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('id', subscription.payment_method_id)
    .single();

  if (pmError || !paymentMethod) {
    throw new Error('Payment method not found');
  }

  const today = new Date().toISOString().split('T')[0];

  // Find the most recent invoice for this subscription (regardless of billing_date)
  const { data: existingInvoices } = await supabase
    .from('subscription_invoices')
    .select('*')
    .eq('subscription_id', subscription.id)
    .order('created_at', { ascending: false })
    .limit(1);

  const existingInvoice = existingInvoices && existingInvoices.length > 0 ? existingInvoices[0] : null;

  let invoice: any;
  let invoiceNumber: string;

  if (existingInvoice) {
    // Compare invoice billing_date with subscription next_billing_date to determine if new cycle
    // Use string comparison since both are date strings in YYYY-MM-DD format
    const invoiceBillingDate = existingInvoice.billing_date;
    const subscriptionBillingDate = subscription.next_billing_date;

    // If invoice is for an earlier billing period than subscription's current billing date,
    // this is an old invoice from a previous billing cycle - create a new one
    if (invoiceBillingDate < subscriptionBillingDate) {
      // Old invoice from previous billing cycle - create new invoice for current cycle
      console.log(`Previous invoice ${existingInvoice.invoice_number} (status: ${existingInvoice.status}) was for ${existingInvoice.billing_date}, creating new invoice for current cycle ${subscription.next_billing_date}`);

      invoiceNumber = `INV-${Date.now()}-${subscription.id.substring(0, 8)}`;

      const { data: newInvoice, error: invoiceError } = await supabase
        .from('subscription_invoices')
        .insert([
          {
            subscription_id: subscription.id,
            invoice_number: invoiceNumber,
            status: 'pending',
            subtotal: subscription.amount,
            tax: 0, // TODO: Calculate tax based on customer location
            shipping: 0, // Included in subscription
            discount: 0,
            total: subscription.amount,
            payment_method_id: subscription.payment_method_id,
            billing_date: subscription.next_billing_date, // Use subscription's billing date, not today
            due_date: subscription.next_billing_date,
            attempt_count: 1,
            last_attempt_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (invoiceError || !newInvoice) {
        throw new Error('Failed to create new invoice for new billing cycle');
      }

      invoice = newInvoice;
    } else {
      // Invoice is for the current billing cycle (billing_date matches subscription's next_billing_date)
      if (existingInvoice.status === 'paid') {
        console.log(`Invoice ${existingInvoice.invoice_number} already paid for current cycle ${subscription.next_billing_date}, skipping`);
        return; // Already processed successfully for current cycle
      }

      // Check if we need to wait before retrying failed invoice
      if (existingInvoice.status === 'failed' && existingInvoice.next_retry_at) {
        const nextRetry = new Date(existingInvoice.next_retry_at);
        if (nextRetry > new Date()) {
          console.log(`Invoice ${existingInvoice.invoice_number} scheduled for retry on ${existingInvoice.next_retry_at}, skipping`);
          return; // Not time to retry yet
        }
      }

      // Time to retry the current failed invoice
      const newAttemptCount = existingInvoice.attempt_count + 1;
      const { data: updatedInvoice, error: updateError } = await supabase
        .from('subscription_invoices')
        .update({
          attempt_count: newAttemptCount,
          last_attempt_at: new Date().toISOString(),
          status: 'pending',
        })
        .eq('id', existingInvoice.id)
        .select()
        .single();

      if (updateError || !updatedInvoice) {
        throw new Error('Failed to update invoice for retry');
      }

      invoice = updatedInvoice;
      invoiceNumber = existingInvoice.invoice_number;
      console.log(`Retrying invoice ${invoiceNumber}, attempt ${newAttemptCount}`);
    }
  } else {
    // No existing invoice - create first one
    invoiceNumber = `INV-${Date.now()}-${subscription.id.substring(0, 8)}`;

    const { data: newInvoice, error: invoiceError } = await supabase
      .from('subscription_invoices')
      .insert([
        {
          subscription_id: subscription.id,
          invoice_number: invoiceNumber,
          status: 'pending',
          subtotal: subscription.amount,
          tax: 0, // TODO: Calculate tax based on customer location
          shipping: 0, // Included in subscription
          discount: 0,
          total: subscription.amount,
          payment_method_id: subscription.payment_method_id,
          billing_date: subscription.next_billing_date, // Use subscription's billing date, not today
          due_date: subscription.next_billing_date,
          attempt_count: 1,
          last_attempt_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (invoiceError || !newInvoice) {
      throw new Error('Failed to create invoice');
    }

    invoice = newInvoice;
    console.log(`Created first invoice ${invoiceNumber} for subscription ${subscription.id} billing period ${subscription.next_billing_date}`);
  }

  try {
    // Charge the payment method via Authorize.net
    if (!AuthorizeNet.isConfigured()) {
      throw new Error('Payment processor not configured');
    }

    const transactionResponse = await AuthorizeNet.chargeCustomerProfile(
      paymentMethod.customer_profile_id!,
      paymentMethod.payment_profile_id!,
      subscription.amount,
      invoiceNumber,
      `Subscription payment - ${subscription.type}`
    );

    // Create order record
    const { data: order } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: subscription.customer_id,
          status: 'paid',
          payment_status: 'paid',
          total_amount: subscription.amount,
          items: subscription.items,
          is_subscription: true,
          subscription_id: subscription.id,
          transaction_id: transactionResponse.transactionId,
        },
      ])
      .select()
      .single();

    // Update invoice as paid
    await supabase
      .from('subscription_invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        transaction_id: transactionResponse.transactionId,
        order_id: order?.id,
      })
      .eq('id', invoice.id);

    // Calculate next billing date
    const nextBillingDate = calculateNextBillingDate(
      new Date(),
      subscription.frequency
    );

    // Update subscription
    await supabase
      .from('subscriptions')
      .update({
        last_billing_date: new Date().toISOString().split('T')[0],
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: subscription.id,
        action: 'payment_succeeded',
        actor_type: 'system',
        notes: `Payment succeeded. Invoice: ${invoiceNumber}, Transaction: ${transactionResponse.transactionId}`,
      },
    ]);

    // Send success notification to GoHighLevel
    const { data: customer } = await supabase
      .from('customers')
      .select('email, first_name, last_name, phone')
      .eq('id', subscription.customer_id)
      .single();

    if (customer) {
      await GHL.notifySubscriptionPaymentSuccess({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        frequency: subscription.frequency,
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
        amount: subscription.amount,
        items: subscription.items,
        invoice_number: invoiceNumber,
        transaction_id: transactionResponse.transactionId,
        billing_date: new Date().toISOString().split('T')[0],
      });
    }

    console.log(`Successfully processed subscription ${subscription.id}`);
  } catch (error: any) {
    console.error(`Payment failed for subscription ${subscription.id}:`, error);

    // Update invoice as failed
    const nextRetry = calculateNextRetry(invoice.attempt_count);

    await supabase
      .from('subscription_invoices')
      .update({
        status: 'failed',
        next_retry_at: nextRetry.toISOString(),
      })
      .eq('id', invoice.id);

    // Check if we should mark subscription as past_due
    if (invoice.attempt_count >= 3) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: subscription.id,
        action: 'payment_failed',
        old_status: subscription.status,
        new_status: invoice.attempt_count >= 3 ? 'past_due' : subscription.status,
        actor_type: 'system',
        notes: `Payment failed. Attempt ${invoice.attempt_count}. ${error.message}`,
      },
    ]);

    // Send failed payment notification to GoHighLevel
    const { data: customer } = await supabase
      .from('customers')
      .select('email, first_name, last_name, phone')
      .eq('id', subscription.customer_id)
      .single();

    if (customer) {
      await GHL.notifySubscriptionPaymentFailed({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        frequency: subscription.frequency,
        next_billing_date: subscription.next_billing_date,
        amount: subscription.amount,
        items: subscription.items,
        invoice_number: invoiceNumber,
        attempt_count: invoice.attempt_count,
        next_retry_date: nextRetry.toISOString().split('T')[0],
        error_message: error.message,
      });
    }

    throw error;
  }
}

/**
 * Calculate next billing date based on frequency
 */
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

/**
 * Calculate next retry time for failed payments
 * Attempt 1: Retry in 3 days
 * Attempt 2: Retry in 5 days
 * Attempt 3+: Retry in 7 days
 */
function calculateNextRetry(attemptCount: number): Date {
  const next = new Date();

  if (attemptCount === 1) {
    next.setDate(next.getDate() + 3);
  } else if (attemptCount === 2) {
    next.setDate(next.getDate() + 5);
  } else {
    next.setDate(next.getDate() + 7);
  }

  return next;
}
