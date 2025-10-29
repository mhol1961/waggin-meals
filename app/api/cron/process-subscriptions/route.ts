import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendSubscriptionReceiptEmail,
  sendPaymentFailedEmail,
} from '@/lib/ghl-email-service';
import { chargeStoredPaymentMethod } from '@/lib/authorizenet-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/cron/process-subscriptions
 *
 * Daily cron job to process subscription billings
 * Should be called daily (e.g., via Vercel Cron, GitHub Actions, or external service)
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

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    console.log(`[Cron] Starting subscription processing for ${today}`);

    // Find all subscriptions due for billing today
    // Include both 'active' and 'past_due' so failed payments can be retried
    const { data: dueSubscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        payment_method:payment_methods(*),
        customer:customers(
          id,
          email,
          first_name,
          last_name,
          phone
        )
      `)
      .in('status', ['active', 'past_due'])
      .lte('next_billing_date', today)
      .order('next_billing_date', { ascending: true });

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    if (!dueSubscriptions || dueSubscriptions.length === 0) {
      console.log('[Cron] No subscriptions due for billing');
      return NextResponse.json({
        success: true,
        message: 'No subscriptions due for billing',
        processed: 0,
      });
    }

    console.log(`[Cron] Found ${dueSubscriptions.length} subscriptions to process`);

    const results = {
      total: dueSubscriptions.length,
      successful: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Process each subscription
    for (const subscription of dueSubscriptions) {
      try {
        await processSubscriptionBilling(subscription);
        results.successful++;
      } catch (error: any) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        results.failed++;
        results.errors.push({
          subscription_id: subscription.id,
          error: error.message,
        });
      }
    }

    console.log('[Cron] Subscription processing complete:', results);

    return NextResponse.json({
      success: true,
      message: `Processed ${results.total} subscriptions`,
      results,
    });

  } catch (error: any) {
    console.error('Error in subscription cron:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process billing for a single subscription
 */
async function processSubscriptionBilling(subscription: any) {
  console.log(`[Billing] Processing subscription ${subscription.id}`);

  const billingDate = new Date().toISOString().split('T')[0];

  // Check if invoice already exists for this billing cycle
  const { data: existingInvoice } = await supabase
    .from('subscription_invoices')
    .select('*')
    .eq('subscription_id', subscription.id)
    .eq('billing_date', billingDate)
    .single();

  if (existingInvoice) {
    console.log(`[Billing] Invoice already exists for subscription ${subscription.id} on ${billingDate} - skipping`);
    return; // Skip duplicate billing
  }

  // Create invoice record
  const invoiceNumber = generateInvoiceNumber();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // 3 days to pay

  const { data: invoice, error: invoiceError } = await supabase
    .from('subscription_invoices')
    .insert({
      subscription_id: subscription.id,
      invoice_number: invoiceNumber,
      status: 'pending',
      subtotal: subscription.amount,
      tax: 0, // TODO: Calculate tax based on shipping address
      shipping: 0, // TODO: Add shipping cost if applicable
      discount: 0,
      total: subscription.amount,
      payment_method_id: subscription.payment_method_id,
      billing_date: billingDate,
      due_date: dueDate.toISOString().split('T')[0],
      attempt_count: 0,
    })
    .select()
    .single();

  if (invoiceError) {
    throw new Error(`Failed to create invoice: ${invoiceError.message}`);
  }

  console.log(`[Billing] Created invoice ${invoiceNumber} for subscription ${subscription.id}`);

  // Attempt to charge the payment method
  try {
    const transactionId = await chargePaymentMethod(
      subscription.payment_method,
      subscription.amount,
      invoiceNumber
    );

    // Update invoice as paid
    await supabase
      .from('subscription_invoices')
      .update({
        status: 'paid',
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
      })
      .eq('id', invoice.id);

    // Update subscription with next billing date
    const nextBillingDate = calculateNextBillingDate(
      subscription.next_billing_date,
      subscription.frequency
    );

    await supabase
      .from('subscriptions')
      .update({
        last_billing_date: billingDate,
        next_billing_date: nextBillingDate,
      })
      .eq('id', subscription.id);

    // Create subscription history entry
    await supabase.from('subscription_history').insert({
      subscription_id: subscription.id,
      action: 'payment_succeeded',
      actor_type: 'system',
      notes: `Successful billing for invoice ${invoiceNumber}. Transaction ID: ${transactionId}`,
    });

    // Send receipt email via GHL
    const customer = subscription.customer;
    if (!customer || !customer.email) {
      console.error(`[Billing] CRITICAL: Missing customer data for subscription ${subscription.id}. Cannot send receipt email.`);
      console.error(`[Billing] Customer object:`, customer);
      // Don't fail the whole billing, but log loudly
    } else {
      await sendSubscriptionReceiptEmail({
        customer_email: customer.email,
        customer_first_name: customer.first_name || '',
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        invoice_number: invoiceNumber,
        transaction_id: transactionId,
        amount: subscription.amount,
        billing_date: billingDate,
        items: subscription.items || [],
      });
    }

    // Create order record for inventory tracking and fulfillment
    await createSubscriptionOrder(subscription, invoice, transactionId);

    console.log(`[Billing] Successfully charged subscription ${subscription.id}`);

  } catch (error: any) {
    console.error(`[Billing] Payment failed for subscription ${subscription.id}:`, error);

    // Update invoice as failed
    await supabase
      .from('subscription_invoices')
      .update({
        status: 'failed',
        attempt_count: 1,
        last_attempt_at: new Date().toISOString(),
        next_retry_at: calculateNextRetryDate(1).toISOString(),
      })
      .eq('id', invoice.id);

    // Update subscription status
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('id', subscription.id);

    // Create subscription history entry
    await supabase.from('subscription_history').insert({
      subscription_id: subscription.id,
      action: 'payment_failed',
      old_status: 'active',
      new_status: 'past_due',
      actor_type: 'system',
      notes: `Payment failed for invoice ${invoiceNumber}. Error: ${error.message}`,
    });

    // Send payment failed email via GHL
    const customer = subscription.customer;
    const nextRetryDate = calculateNextRetryDate(1);
    if (!customer || !customer.email) {
      console.error(`[Billing] CRITICAL: Missing customer data for subscription ${subscription.id}. Cannot send payment failed email.`);
      console.error(`[Billing] Customer object:`, customer);
    } else {
      await sendPaymentFailedEmail({
        customer_email: customer.email,
        customer_first_name: customer.first_name || '',
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        invoice_number: invoiceNumber,
        error_message: error.message,
        next_retry_date: nextRetryDate.toISOString().split('T')[0],
      });
    }

    throw error;
  }
}

/**
 * Charge a payment method via Authorize.net
 */
async function chargePaymentMethod(
  paymentMethod: any,
  amount: number,
  invoiceNumber: string
): Promise<string> {
  if (!paymentMethod) {
    throw new Error('Payment method not found');
  }

  // Check if Authorize.net credentials are configured
  if (!process.env.AUTHORIZENET_API_LOGIN_ID || !process.env.AUTHORIZENET_TRANSACTION_KEY) {
    console.warn('[Payment] Authorize.net credentials not configured - simulating successful payment');
    return `SIM-${Date.now()}`; // Simulated transaction ID for development
  }

  // Validate payment method has Authorize.net profile IDs
  if (!paymentMethod.authorize_net_profile_id || !paymentMethod.authorize_net_payment_profile_id) {
    throw new Error('Payment method not configured for Authorize.net CIM');
  }

  // Charge the payment method via Authorize.net CIM
  const authResponse = await chargeStoredPaymentMethod({
    amount: amount,
    customerProfileId: paymentMethod.authorize_net_profile_id,
    customerPaymentProfileId: paymentMethod.authorize_net_payment_profile_id,
    invoiceNumber: invoiceNumber,
    description: `Subscription billing - Invoice ${invoiceNumber}`,
  });

  if (!authResponse.success || !authResponse.transactionId) {
    throw new Error(authResponse.error || 'Payment processing failed');
  }

  return authResponse.transactionId;
}

/**
 * Calculate next billing date based on frequency
 */
function calculateNextBillingDate(currentDate: string, frequency: string): string {
  const next = new Date(currentDate);

  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'bi-weekly':
    case 'biweekly':
      next.setDate(next.getDate() + 14);
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
    case 'monthly':
    default:
      next.setMonth(next.getMonth() + 1);
      break;
  }

  return next.toISOString().split('T')[0];
}

/**
 * Calculate next retry date for failed payments
 * Uses exponential backoff: 3 days, 7 days, 14 days
 */
function calculateNextRetryDate(attemptCount: number): Date {
  const next = new Date();

  switch (attemptCount) {
    case 1:
      next.setDate(next.getDate() + 3); // Retry in 3 days
      break;
    case 2:
      next.setDate(next.getDate() + 7); // Retry in 7 days
      break;
    case 3:
      next.setDate(next.getDate() + 14); // Final retry in 14 days
      break;
    default:
      next.setDate(next.getDate() + 30); // Cancel after 30 days
      break;
  }

  return next;
}

/**
 * Generate unique invoice number
 */
function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);

  return `INV-${year}${month}${day}-${timestamp}`;
}

/**
 * Create an order record from a successful subscription billing
 * This allows the subscription to go through the normal fulfillment workflow
 */
async function createSubscriptionOrder(
  subscription: any,
  invoice: any,
  transactionId: string
) {
  console.log(`[Order] Creating order for subscription ${subscription.id}`);

  // Generate order number
  const orderNumber = `SUB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

  // Items is already a JSONB object from Supabase, no need to parse
  const items = Array.isArray(subscription.items) ? subscription.items : [];

  if (items.length === 0) {
    console.warn(`[Order] No items found for subscription ${subscription.id}`);
    return;
  }

  // Get customer data
  const customer = subscription.customer || {};

  // Fetch default shipping address from customer_addresses table
  const { data: addressData } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', subscription.customer_id)
    .eq('is_default', true)
    .eq('address_type', 'shipping')
    .single();

  // Format shipping address for orders table
  const shippingAddress = addressData ? {
    first_name: addressData.first_name || customer.first_name || '',
    last_name: addressData.last_name || customer.last_name || '',
    address1: addressData.address_line1,
    address2: addressData.address_line2 || '',
    city: addressData.city,
    state: addressData.state,
    zip: addressData.zip_code,
    country: addressData.country || 'US',
    phone: addressData.phone || customer.phone || ''
  } : {};

  // Create order
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
      notes: `Auto-generated from subscription ${subscription.id} - Invoice ${invoice.invoice_number}`,
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
    variant_id: item.variant_id || null,
    variant_title: item.variant_title || null,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  await supabase.from('order_items').insert(orderItems);

  // Update inventory (variant or product level)
  for (const item of items) {
    if (item.variant_id) {
      // Deduct from variant inventory using the database function
      await supabase.rpc('adjust_variant_inventory', {
        p_variant_id: item.variant_id,
        p_quantity_change: -item.quantity,
        p_reason: 'subscription_renewal',
        p_order_id: order.id,
        p_adjusted_by: 'system'
      });
    } else {
      // Deduct from product-level inventory
      await supabase.rpc('decrement_product_inventory', {
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }
  }

  // Link invoice to order
  await supabase
    .from('subscription_invoices')
    .update({ order_id: order.id })
    .eq('id', invoice.id);

  console.log(`[Order] Created order ${orderNumber} for subscription ${subscription.id}`);
}
