/**
 * GoHighLevel Webhook Integration
 *
 * This helper makes it easy to send events from Next.js to GoHighLevel workflows.
 * Events trigger automations, tag updates, pipeline movements, and email sequences in GHL.
 */

export interface GHLEventData {
  event: string;
  contactId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customFields?: Record<string, string | number | boolean>;
  tags?: string[];
  [key: string]: any;
}

/**
 * Send an event to GoHighLevel via webhook
 *
 * @param event Event type (e.g., 'order.placed', 'subscription.created')
 * @param data Event data including contactId and custom fields
 */
export async function sendGHLEvent(
  event: string,
  data: Omit<GHLEventData, 'event'>
): Promise<boolean> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[GHL] GHL_WEBHOOK_URL not configured - event not sent:', event);
    return false;
  }

  const payload: GHLEventData = {
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GHL] Webhook failed for event "${event}":`, response.status, errorText);
      return false;
    }

    console.log(`[GHL] ✅ Event sent: ${event}`, data.contactId || data.email);
    return true;

  } catch (error) {
    console.error(`[GHL] Error sending event "${event}":`, error);
    return false;
  }
}

/**
 * Event Helpers - Pre-configured functions for common events
 */

export async function sendOrderPlacedEvent(data: {
  contactId: string;
  orderNumber: string;
  amount: number;
  items: string;
  shippingMethod: string;
}) {
  return sendGHLEvent('order.placed', {
    contactId: data.contactId,
    customFields: {
      wm_last_order_number: data.orderNumber,
      wm_last_order_amount: data.amount.toString(),
      wm_last_order_date: new Date().toISOString(),
      wm_last_shipping_method: data.shippingMethod,
    },
    tags: ['order-placed'],
  });
}

export async function sendOrderShippedEvent(data: {
  contactId: string;
  orderNumber: string;
  trackingNumber?: string;
}) {
  return sendGHLEvent('order.shipped', {
    contactId: data.contactId,
    customFields: {
      wm_last_order_number: data.orderNumber,
    },
    tracking: data.trackingNumber,
    tags: ['order-shipped'],
  });
}

export async function sendSubscriptionCreatedEvent(data: {
  contactId: string;
  subscriptionId: string;
  amount: number;
  frequency: string;
  items: string;
  nextBillingDate: string;
}) {
  return sendGHLEvent('subscription.created', {
    contactId: data.contactId,
    customFields: {
      wm_has_subscription: 'true',
      wm_subscription_id: data.subscriptionId,
      wm_subscription_amount: data.amount.toString(),
      wm_subscription_frequency: data.frequency,
      wm_subscription_items: data.items,
      wm_subscription_next_billing: data.nextBillingDate,
      wm_subscription_start_date: new Date().toISOString(),
      wm_subscription_status: 'active',
    },
    tags: ['subscriber-active', 'first-subscription'],
  });
}

export async function sendPaymentFailedEvent(data: {
  contactId: string;
  subscriptionId: string;
  amount: number;
  reason: string;
}) {
  return sendGHLEvent('payment.failed', {
    contactId: data.contactId,
    customFields: {
      wm_subscription_id: data.subscriptionId,
      wm_subscription_status: 'past_due',
    },
    reason: data.reason,
    amount: data.amount,
    tags: ['subscriber-past-due', 'payment-failed'],
  });
}

export async function sendCartAbandonedEvent(data: {
  contactId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  cartValue: number;
  cartItems: string;
}) {
  return sendGHLEvent('cart.abandoned', {
    contactId: data.contactId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    customFields: {
      wm_cart_abandoned: 'true',
      wm_cart_abandon_date: new Date().toISOString(),
      wm_cart_value: data.cartValue.toString(),
      wm_cart_items: data.cartItems,
    },
    tags: ['cart-abandoned'],
  });
}

export async function sendConsultationBookedEvent(data: {
  contactId: string;
  consultationDate: string;
  consultationType: 'free' | 'paid';
  paid: boolean;
}) {
  return sendGHLEvent('consultation.booked', {
    contactId: data.contactId,
    customFields: {
      wm_consultation_booked: 'true',
      wm_consultation_date: data.consultationDate,
      wm_consultation_type: data.consultationType,
      wm_consultation_paid: data.paid ? 'true' : 'false',
      wm_consultation_status: 'scheduled',
    },
    tags: ['consultation-booked', data.consultationType === 'paid' ? 'paid-consultation' : ''],
  });
}

/**
 * Update customer data in GHL
 */
export async function updateGHLContact(data: {
  contactId: string;
  customFields: Record<string, string | number | boolean>;
  tags?: string[];
}) {
  return sendGHLEvent('contact.updated', {
    contactId: data.contactId,
    customFields: data.customFields,
    tags: data.tags || [],
  });
}

/**
 * Track order lifecycle events
 */
export async function sendOrderProcessingEvent(contactId: string, orderNumber: string) {
  return sendGHLEvent('order.processing', {
    contactId,
    customFields: { wm_last_order_number: orderNumber },
    tags: ['order-processing'],
  });
}

export async function sendOrderDeliveredEvent(contactId: string, orderNumber: string) {
  return sendGHLEvent('order.delivered', {
    contactId,
    customFields: { wm_last_order_number: orderNumber },
    tags: ['order-delivered'],
  });
}

/**
 * Track subscription lifecycle events
 */
export async function sendSubscriptionRenewalReminderEvent(
  contactId: string,
  subscriptionId: string,
  daysUntilRenewal: number
) {
  const tag =
    daysUntilRenewal === 7
      ? 'subscription-renewal-7-days'
      : daysUntilRenewal === 3
      ? 'subscription-renewal-3-days'
      : 'subscription-billing-today';

  return sendGHLEvent('subscription.renewal_reminder', {
    contactId,
    customFields: {
      wm_subscription_id: subscriptionId,
    },
    daysUntilRenewal,
    tags: [tag],
  });
}

export async function sendSubscriptionCancelledEvent(contactId: string, subscriptionId: string) {
  return sendGHLEvent('subscription.cancelled', {
    contactId,
    customFields: {
      wm_subscription_id: subscriptionId,
      wm_subscription_status: 'cancelled',
      wm_has_subscription: 'false',
    },
    tags: ['subscriber-cancelled'],
  });
}

export async function sendSubscriptionPausedEvent(contactId: string, subscriptionId: string) {
  return sendGHLEvent('subscription.paused', {
    contactId,
    customFields: {
      wm_subscription_id: subscriptionId,
      wm_subscription_status: 'paused',
    },
    tags: ['subscriber-paused'],
  });
}
