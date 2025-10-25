import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateOrderNumber } from '@/lib/order-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Authorize.net configuration
const AUTHORIZENET_API_LOGIN_ID = process.env.AUTHORIZENET_API_LOGIN_ID;
const AUTHORIZENET_TRANSACTION_KEY = process.env.AUTHORIZENET_TRANSACTION_KEY;
const AUTHORIZENET_ENVIRONMENT = process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox';

const AUTHORIZENET_URL = AUTHORIZENET_ENVIRONMENT === 'production'
  ? 'https://api.authorize.net/xml/v1/request.api'
  : 'https://apitest.authorize.net/xml/v1/request.api';

// Verify this is a legitimate cron request
function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // If no secret is set, allow (for development)
    return true;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function POST(request: NextRequest) {
  // Verify authorization
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Starting subscription processing...');

  try {
    // Get subscriptions due for billing
    const { data: subscriptions, error: subsError } = await supabase
      .rpc('get_subscriptions_due_for_billing');

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions due for billing');
      return NextResponse.json({
        success: true,
        message: 'No subscriptions due for billing',
        processed: 0,
      });
    }

    console.log(`Found ${subscriptions.length} subscriptions to process`);

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Process each subscription
    for (const subscription of subscriptions) {
      try {
        await processSubscription(subscription, results);
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        results.errors.push({
          subscription_id: subscription.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        results.failed++;
      }
    }

    console.log('Subscription processing complete:', results);

    return NextResponse.json({
      success: true,
      processed: subscriptions.length,
      successful: results.successful,
      failed: results.failed,
      errors: results.errors,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processSubscription(subscription: any, results: any) {
  console.log(`Processing subscription ${subscription.id}...`);

  // Charge the payment profile
  const chargeResult = await chargePaymentProfile(
    subscription.payment_customer_profile_id,
    subscription.payment_profile_id,
    subscription.total
  );

  // Log billing attempt
  await supabase.from('subscription_billing_history').insert({
    subscription_id: subscription.id,
    amount: subscription.total,
    status: chargeResult.success ? 'success' : 'failed',
    payment_response: chargeResult.response,
    error_message: chargeResult.error || null,
  });

  if (!chargeResult.success) {
    // Handle failed payment
    await handleFailedPayment(subscription.id);
    results.failed++;
    return;
  }

  // Create order from successful charge
  const order = await createOrderFromSubscription(
    subscription,
    chargeResult.transactionId
  );

  if (!order) {
    console.error('Failed to create order for subscription', subscription.id);
    results.failed++;
    return;
  }

  // Update billing history with order ID
  await supabase
    .from('subscription_billing_history')
    .update({ order_id: order.id })
    .eq('subscription_id', subscription.id)
    .order('created_at', { ascending: false })
    .limit(1);

  // Update next billing date
  await supabase.rpc('update_next_billing_date', {
    sub_id: subscription.id,
    freq: subscription.frequency,
  });

  // Reset failed payment count
  await supabase
    .from('subscriptions')
    .update({
      failed_payment_count: 0,
      last_payment_attempt: new Date().toISOString(),
    })
    .eq('id', subscription.id);

  console.log(`Successfully processed subscription ${subscription.id}`);
  results.successful++;
}

async function chargePaymentProfile(
  customerProfileId: string,
  paymentProfileId: string,
  amount: number
): Promise<{
  success: boolean;
  transactionId?: string;
  response?: any;
  error?: string;
}> {
  try {
    const authNetRequest = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: AUTHORIZENET_API_LOGIN_ID,
          transactionKey: AUTHORIZENET_TRANSACTION_KEY,
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: amount.toFixed(2),
          profile: {
            customerProfileId: customerProfileId,
            paymentProfile: {
              paymentProfileId: paymentProfileId,
            },
          },
        },
      },
    };

    const response = await fetch(AUTHORIZENET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authNetRequest),
    });

    const data = await response.json();

    if (data.messages?.resultCode === 'Ok' && data.transactionResponse?.responseCode === '1') {
      return {
        success: true,
        transactionId: data.transactionResponse.transId,
        response: data,
      };
    }

    return {
      success: false,
      response: data,
      error: data.transactionResponse?.errors?.[0]?.errorText || 'Transaction failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function handleFailedPayment(subscriptionId: string) {
  // Increment failed payment count
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('failed_payment_count, customer_id')
    .eq('id', subscriptionId)
    .single();

  if (!subscription) return;

  const newFailedCount = (subscription.failed_payment_count || 0) + 1;

  await supabase
    .from('subscriptions')
    .update({
      failed_payment_count: newFailedCount,
      last_payment_attempt: new Date().toISOString(),
      status: newFailedCount >= 3 ? 'paused' : 'active',
    })
    .eq('id', subscriptionId);

  // Get customer info for webhook
  const { data: customer } = await supabase
    .from('customers')
    .select('email, first_name')
    .eq('id', subscription.customer_id)
    .single();

  // Send webhook to GHL for failed payment
  if (process.env.GHL_WEBHOOK_PAYMENT_FAILED && customer) {
    try {
      await fetch(process.env.GHL_WEBHOOK_PAYMENT_FAILED, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'subscription.payment_failed',
          email: customer.email,
          subscription_id: subscriptionId,
          retry_count: newFailedCount,
          failed_at: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to send GHL webhook:', error);
    }
  }
}

async function createOrderFromSubscription(subscription: any, transactionId: string) {
  try {
    // Get customer info
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('id', subscription.customer_id)
      .single();

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get shipping address
    const { data: address } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('id', subscription.shipping_address_id)
      .single();

    if (!address) {
      throw new Error('Shipping address not found');
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        customer_id: customer.id,
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        status: 'processing',
        payment_status: 'paid',
        payment_method: 'authorize_net',
        payment_intent_id: transactionId,
        subtotal: subscription.subtotal,
        shipping_cost: subscription.shipping_cost,
        tax: subscription.tax_amount,
        total: subscription.total,
        shipping_address: {
          first_name: address.first_name || customer.first_name,
          last_name: address.last_name || customer.last_name,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          city: address.city,
          state: address.state,
          postal_code: address.zip_code,
          country: address.country || 'US',
          phone: address.phone,
        },
        notes: 'Subscription order',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const items = typeof subscription.items === 'string'
      ? JSON.parse(subscription.items)
      : subscription.items;

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_handle: item.product_handle || '',
      product_name: item.product_name || item.title,
      variant_title: item.variant_title || null,
      quantity: item.quantity,
      unit_price: item.price || item.unit_price,
      total_price: (item.price || item.unit_price) * item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);

    // Update customer stats
    await supabase
      .from('customers')
      .update({
        total_orders: customer.total_orders + 1,
        total_spent: customer.total_spent + subscription.total,
      })
      .eq('id', customer.id);

    console.log(`Created order ${order.order_number} for subscription ${subscription.id}`);

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

// Allow GET requests to manually trigger (for testing)
export async function GET(request: NextRequest) {
  return POST(request);
}
