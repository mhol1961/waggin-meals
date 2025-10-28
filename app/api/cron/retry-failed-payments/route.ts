import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendPaymentRetrySuccessEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
} from '@/lib/ghl-email-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_RETRY_ATTEMPTS = 3;

/**
 * POST /api/cron/retry-failed-payments
 *
 * Daily cron job to retry failed subscription payments
 * Should be called daily (e.g., via Vercel Cron, GitHub Actions, or external service)
 *
 * Retry schedule:
 * - Attempt 1: 3 days after initial failure
 * - Attempt 2: 7 days after first retry
 * - Attempt 3: 14 days after second retry
 * - After 3 failed attempts: Cancel subscription
 *
 * Authentication: Requires CRON_SECRET environment variable
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error('CRON_SECRET not configured');
      return NextResponse.json(
        { error: 'Cron job not configured' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('Invalid cron secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    console.log(`[Retry] Starting failed payment retry for ${today}`);

    // Find all failed invoices that are due for retry
    // Must join customers table for email/shipping data
    const { data: failedInvoices, error: fetchError } = await supabase
      .from('subscription_invoices')
      .select(`
        *,
        subscription:subscriptions(
          *,
          customer:customers(
            id,
            email,
            first_name,
            last_name,
            phone,
            default_shipping_address
          )
        ),
        payment_method:payment_methods(*)
      `)
      .eq('status', 'failed')
      .lt('attempt_count', MAX_RETRY_ATTEMPTS)
      .lte('next_retry_at', new Date().toISOString())
      .order('next_retry_at', { ascending: true });

    if (fetchError) {
      console.error('Error fetching failed invoices:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      );
    }

    if (!failedInvoices || failedInvoices.length === 0) {
      console.log('[Retry] No failed payments ready for retry');
      return NextResponse.json({
        success: true,
        message: 'No failed payments ready for retry',
        processed: 0,
      });
    }

    console.log(`[Retry] Found ${failedInvoices.length} failed payments to retry`);

    const results = {
      total: failedInvoices.length,
      successful: 0,
      failed: 0,
      cancelled: 0,
      errors: [] as any[],
    };

    // Process each failed invoice
    for (const invoice of failedInvoices) {
      try {
        const result = await retryFailedPayment(invoice);

        if (result === 'success') {
          results.successful++;
        } else if (result === 'cancelled') {
          results.cancelled++;
        } else {
          results.failed++;
        }
      } catch (error: any) {
        console.error(`Error retrying invoice ${invoice.id}:`, error);
        results.failed++;
        results.errors.push({
          invoice_id: invoice.id,
          subscription_id: invoice.subscription_id,
          error: error.message,
        });
      }
    }

    console.log('[Retry] Failed payment retry complete:', results);

    return NextResponse.json({
      success: true,
      message: `Processed ${results.total} failed payments`,
      results,
    });

  } catch (error: any) {
    console.error('Error in payment retry cron:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Retry a failed payment
 * Returns: 'success' | 'failed' | 'cancelled'
 */
async function retryFailedPayment(invoice: any): Promise<string> {
  const { subscription, payment_method } = invoice;
  const attemptNumber = invoice.attempt_count + 1;

  console.log(`[Retry] Attempting payment ${attemptNumber}/${MAX_RETRY_ATTEMPTS} for invoice ${invoice.invoice_number}`);

  // Update attempt tracking
  await supabase
    .from('subscription_invoices')
    .update({
      attempt_count: attemptNumber,
      last_attempt_at: new Date().toISOString(),
    })
    .eq('id', invoice.id);

  try {
    // Attempt to charge the payment method
    const transactionId = await chargePaymentMethod(
      payment_method,
      invoice.total,
      invoice.invoice_number
    );

    // Payment succeeded!
    console.log(`[Retry] Payment successful for invoice ${invoice.invoice_number}`);

    // Update invoice as paid
    await supabase
      .from('subscription_invoices')
      .update({
        status: 'paid',
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
        next_retry_at: null, // Clear retry schedule
      })
      .eq('id', invoice.id);

    // Reactivate subscription if it was past_due
    if (subscription.status === 'past_due') {
      await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('id', subscription.id);
    }

    // Create subscription history entry
    await supabase.from('subscription_history').insert({
      subscription_id: subscription.id,
      action: 'payment_succeeded',
      old_status: subscription.status,
      new_status: 'active',
      actor_type: 'system',
      notes: `Payment retry ${attemptNumber} succeeded. Invoice ${invoice.invoice_number}. Transaction: ${transactionId}`,
    });

    // Send success email via GHL
    const customer = subscription.customer || {};
    await sendPaymentRetrySuccessEmail({
      customer_email: customer.email || '',
      customer_first_name: customer.first_name || '',
      customer_last_name: customer.last_name,
      customer_phone: customer.phone,
      invoice_number: invoice.invoice_number,
      transaction_id: transactionId,
      amount: invoice.total,
      attempt_number: attemptNumber,
    });

    // Create order for fulfillment if not already created
    if (!invoice.order_id) {
      await createSubscriptionOrder(subscription, invoice, transactionId);
    }

    return 'success';

  } catch (error: any) {
    console.error(`[Retry] Payment failed for invoice ${invoice.invoice_number}:`, error);

    // Check if this was the final retry attempt
    if (attemptNumber >= MAX_RETRY_ATTEMPTS) {
      // Cancel subscription after max retries
      console.log(`[Retry] Max retries reached - cancelling subscription ${subscription.id}`);

      await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);

      await supabase
        .from('subscription_invoices')
        .update({
          status: 'failed',
          next_retry_at: null, // No more retries
        })
        .eq('id', invoice.id);

      // Create subscription history entry
      await supabase.from('subscription_history').insert({
        subscription_id: subscription.id,
        action: 'cancelled',
        old_status: subscription.status,
        new_status: 'cancelled',
        actor_type: 'system',
        notes: `Subscription cancelled after ${MAX_RETRY_ATTEMPTS} failed payment attempts. Invoice ${invoice.invoice_number}`,
      });

      // Send cancellation email via GHL
      const customer = subscription.customer || {};
      await sendSubscriptionCancelledEmail({
        customer_email: customer.email || '',
        customer_first_name: customer.first_name || '',
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        total_attempts: attemptNumber,
      });

      return 'cancelled';

    } else {
      // Schedule next retry
      const nextRetryDate = calculateNextRetryDate(attemptNumber);

      await supabase
        .from('subscription_invoices')
        .update({
          status: 'failed',
          next_retry_at: nextRetryDate.toISOString(),
        })
        .eq('id', invoice.id);

      // Create subscription history entry
      await supabase.from('subscription_history').insert({
        subscription_id: subscription.id,
        action: 'payment_failed',
        actor_type: 'system',
        notes: `Payment retry ${attemptNumber} failed. Next retry scheduled for ${nextRetryDate.toISOString().split('T')[0]}. Error: ${error.message}`,
      });

      // Send retry notification email via GHL
      const customer = subscription.customer || {};
      await sendPaymentFailedEmail({
        customer_email: customer.email || '',
        customer_first_name: customer.first_name || '',
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        invoice_number: invoice.invoice_number,
        error_message: error.message,
        next_retry_date: nextRetryDate.toISOString().split('T')[0],
      });

      return 'failed';
    }
  }
}

/**
 * Charge a payment method via Authorize.net
 * TODO: Implement actual Authorize.net integration
 */
async function chargePaymentMethod(
  paymentMethod: any,
  amount: number,
  invoiceNumber: string
): Promise<string> {
  // This is a placeholder - will be implemented when Authorize.net credentials are available

  if (!process.env.AUTHORIZENET_API_LOGIN_ID || !process.env.AUTHORIZENET_TRANSACTION_KEY) {
    console.warn('[Payment] Authorize.net credentials not configured - simulating successful payment');
    return `RETRY-${Date.now()}`; // Simulated transaction ID
  }

  // TODO: Actual Authorize.net implementation
  throw new Error('Authorize.net integration not yet implemented');
}

/**
 * Calculate next retry date based on attempt number
 * - Attempt 1: +3 days
 * - Attempt 2: +7 days
 * - Attempt 3: +14 days
 */
function calculateNextRetryDate(attemptNumber: number): Date {
  const next = new Date();

  switch (attemptNumber) {
    case 1:
      next.setDate(next.getDate() + 3);
      break;
    case 2:
      next.setDate(next.getDate() + 7);
      break;
    case 3:
    default:
      next.setDate(next.getDate() + 14);
      break;
  }

  return next;
}

/**
 * Create an order record from a successful subscription billing
 */
async function createSubscriptionOrder(
  subscription: any,
  invoice: any,
  transactionId: string
) {
  console.log(`[Order] Creating order for subscription ${subscription.id}`);

  const orderNumber = `SUB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

  // Items is already a JSONB object from Supabase, no need to parse
  const items = Array.isArray(subscription.items) ? subscription.items : [];

  if (items.length === 0) {
    console.warn(`[Order] No items found for subscription ${subscription.id}`);
    return;
  }

  // Get customer data from joined relation
  const customer = subscription.customer || {};
  const shippingAddress = customer.default_shipping_address || {};

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: subscription.customer_id,
      status: 'pending',
      payment_status: 'paid',
      subtotal: subscription.amount,
      shipping_cost: 0,
      tax: 0,
      total: subscription.amount,
      customer_email: customer.email || '',
      customer_first_name: customer.first_name || '',
      customer_last_name: customer.last_name || '',
      shipping_address: shippingAddress,
      payment_intent_id: transactionId,
      notes: `Auto-generated from subscription ${subscription.id} - Invoice ${invoice.invoice_number} (Retry)`,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return;
  }

  // Create order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name || item.title,
    variant_title: item.variant_title,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  await supabase.from('order_items').insert(orderItems);

  // Link invoice to order
  await supabase
    .from('subscription_invoices')
    .update({ order_id: order.id })
    .eq('id', invoice.id);

  console.log(`[Order] Created order ${orderNumber} for subscription ${subscription.id}`);
}
