/**
 * GoHighLevel (GHL) Integration Service
 *
 * Sends subscription events to GoHighLevel for customer communication automation
 * GHL workflows handle all email notifications, SMS, and marketing automation
 */

interface GHLWebhookPayload {
  event_type: string;
  customer: {
    email: string;
    first_name: string;
    last_name?: string;
    phone?: string;
  };
  subscription?: {
    id: string;
    status: string;
    frequency: string;
    amount: number;
    next_billing_date: string;
    items: Array<{
      product_name: string;
      variant_title?: string;
      quantity: number;
      price: number;
    }>;
  };
  payment?: {
    invoice_number: string;
    transaction_id?: string;
    amount: number;
    billing_date: string;
    attempt_count?: number;
    next_retry_date?: string;
    error_message?: string;
  };
  metadata?: Record<string, any>;
}

/**
 * Send webhook event to GoHighLevel
 */
async function sendGHLWebhook(payload: GHLWebhookPayload): Promise<boolean> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('GHL_WEBHOOK_URL not configured. Webhook not sent.');
    console.log('Event details:', payload.event_type, payload.customer.email);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add GHL API key if required
        ...(process.env.GHL_API_KEY ? { 'Authorization': `Bearer ${process.env.GHL_API_KEY}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send GHL webhook:', error);
      return false;
    }

    console.log(`GHL webhook sent successfully: ${payload.event_type} for ${payload.customer.email}`);
    return true;
  } catch (error) {
    console.error('Error sending GHL webhook:', error);
    return false;
  }
}

/**
 * Send subscription created event to GHL
 */
export async function notifySubscriptionCreated(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.created',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
  });
}

/**
 * Send subscription payment success event to GHL
 */
export async function notifySubscriptionPaymentSuccess(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  invoice_number: string;
  transaction_id?: string;
  billing_date: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.payment.success',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
    payment: {
      invoice_number: data.invoice_number,
      transaction_id: data.transaction_id,
      amount: data.amount,
      billing_date: data.billing_date,
    },
  });
}

/**
 * Send subscription payment failed event to GHL
 */
export async function notifySubscriptionPaymentFailed(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  invoice_number: string;
  attempt_count: number;
  next_retry_date: string;
  error_message?: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.payment.failed',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: data.attempt_count >= 3 ? 'past_due' : 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
    payment: {
      invoice_number: data.invoice_number,
      amount: data.amount,
      billing_date: new Date().toISOString().split('T')[0],
      attempt_count: data.attempt_count,
      next_retry_date: data.next_retry_date,
      error_message: data.error_message,
    },
  });
}

/**
 * Send subscription paused event to GHL
 */
export async function notifySubscriptionPaused(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  pause_reason?: string;
  resume_date?: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.paused',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'paused',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: '', // No next billing while paused
      items: data.items,
    },
    metadata: {
      pause_reason: data.pause_reason,
      resume_date: data.resume_date,
    },
  });
}

/**
 * Send subscription resumed event to GHL
 */
export async function notifySubscriptionResumed(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.resumed',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
  });
}

/**
 * Send subscription cancelled event to GHL
 */
export async function notifySubscriptionCancelled(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  cancellation_reason?: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.cancelled',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'cancelled',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: '', // No future billing
      items: data.items,
    },
    metadata: {
      cancellation_reason: data.cancellation_reason,
    },
  });
}

/**
 * Check if GHL integration is configured
 */
export function isGHLConfigured(): boolean {
  return !!process.env.GHL_WEBHOOK_URL;
}
