# GoHighLevel Webhook Setup

## Webhook URL
Create a workflow in GHL with trigger: "Incoming Webhook"

**Workflow Name**: Event Router (Next.js → GHL)

## Webhook Endpoint URL
The webhook URL will be provided by GHL after creating the workflow.
Save it to your .env.local:

```bash
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...
```

## Event Routes

Your Next.js app will send these events to GHL:

### 1. Order Placed
```json
{
  "event": "order.placed",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_last_order_number": "WM-1234",
    "wm_last_order_amount": "89.99",
    "wm_last_order_date": "2025-11-03"
  }
}
```

**Actions in GHL Workflow**:
- Add tag: "order-placed"
- Move to pipeline: "Orders & Subscriptions" → "Order Placed"
- Start sequence: "Order Lifecycle"

### 2. Order Shipped
```json
{
  "event": "order.shipped",
  "contactId": "GHL_CONTACT_ID",
  "tracking": "1Z999AA10123456784"
}
```

**Actions**:
- Add tag: "order-shipped"
- Move to stage: "Shipped"
- Start sequence: "Out for Delivery Scheduler"

### 3. Subscription Created
```json
{
  "event": "subscription.created",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_subscription_id": "sub_123",
    "wm_subscription_amount": "59.99",
    "wm_subscription_frequency": "monthly"
  }
}
```

**Actions**:
- Add tags: "subscriber-active", "first-subscription"
- Move to stage: "Subscription Active"
- Start sequence: "Subscription Lifecycle"

### 4. Payment Failed
```json
{
  "event": "payment.failed",
  "contactId": "GHL_CONTACT_ID",
  "reason": "Card declined"
}
```

**Actions**:
- Add tags: "subscriber-past-due", "payment-failed"
- Move to stage: "Subscription Past Due"
- Start sequence: "Dunning Sequence"

### 5. Cart Abandoned
```json
{
  "event": "cart.abandoned",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_cart_value": "79.99",
    "wm_cart_items": "Fresh Food Bowl x2, Meal Topper x1"
  }
}
```

**Actions**:
- Add tag: "cart-abandoned"
- Move to stage: "Cart Abandoned"
- Start sequence: "Abandoned Cart"

### 6. Consultation Booked
```json
{
  "event": "consultation.booked",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_consultation_date": "2025-11-15T10:00:00Z",
    "wm_consultation_type": "paid"
  }
}
```

**Actions**:
- Add tag: "consultation-booked"
- Move to pipeline: "Consultations ($395)" → "Scheduled"
- Start sequence: "Consultation Reminders"

## Implementation in Next.js

Add this helper function to your Next.js app:

```javascript
// lib/ghl-webhook.ts
export async function sendGHLEvent(event: string, contactId: string, data: any = {}) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('GHL_WEBHOOK_URL not configured');
    return;
  }

  const payload = {
    event,
    contactId,
    timestamp: new Date().toISOString(),
    ...data,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('GHL webhook failed:', response.status);
    }
  } catch (error) {
    console.error('GHL webhook error:', error);
  }
}
```

Use it in your API routes:

```javascript
// app/api/checkout/create-order/route.ts
import { sendGHLEvent } from '@/lib/ghl-webhook';

// After order created successfully:
await sendGHLEvent('order.placed', ghlContactId, {
  customFields: {
    wm_last_order_number: orderNumber,
    wm_last_order_amount: total.toString(),
    wm_last_order_date: new Date().toISOString(),
  }
});
```
