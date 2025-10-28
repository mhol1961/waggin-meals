# GoHighLevel Snapshot Setup Guide
## Subscription Billing Automation Workflows

This document provides all the information needed to create GoHighLevel workflows for the Waggin Meals subscription billing system.

---

## Overview

The Waggin Meals website sends webhook events to GoHighLevel for all subscription-related events. GHL workflows receive these events and handle all customer communication (emails, SMS, etc.).

**Architecture:**
- **Supabase** → Processes payments, manages subscriptions, stores data
- **Webhook** → Sends event to GHL when subscription events occur
- **GoHighLevel** → Receives event, triggers workflow, sends email/SMS to customer

---

## Environment Variables Required

Add these to your `.env.local` file:

```env
# GoHighLevel Integration
GHL_WEBHOOK_URL=your_ghl_webhook_url_here
GHL_API_KEY=your_ghl_api_key_here  # Optional, only if GHL requires authentication
```

**How to get these:**
1. Log into your GoHighLevel account
2. Go to Settings → Integrations → Webhooks
3. Create a new webhook endpoint for "Subscription Events"
4. Copy the webhook URL provided by GHL
5. Paste it into your `.env.local` file

---

## Webhook Events Sent to GHL

The website sends these 6 event types to GoHighLevel:

### 1. `subscription.created`
**When it triggers:** Customer creates a new subscription
**Use case:** Welcome email, explain what happens next

**Data sent to GHL:**
```json
{
  "event_type": "subscription.created",
  "customer": {
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1234567890"
  },
  "subscription": {
    "id": "uuid-here",
    "status": "active",
    "frequency": "monthly",
    "amount": 89.99,
    "next_billing_date": "2025-02-28",
    "items": [
      {
        "product_name": "Premium Dog Food Bundle",
        "variant_title": "Large Dog (50-80 lbs)",
        "quantity": 1,
        "price": 89.99
      }
    ]
  }
}
```

---

### 2. `subscription.payment.success`
**When it triggers:** Recurring payment processed successfully
**Use case:** Payment confirmation, shipping notification

**Data sent to GHL:**
```json
{
  "event_type": "subscription.payment.success",
  "customer": {
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1234567890"
  },
  "subscription": {
    "id": "uuid-here",
    "status": "active",
    "frequency": "monthly",
    "amount": 89.99,
    "next_billing_date": "2025-03-28",
    "items": [
      {
        "product_name": "Premium Dog Food Bundle",
        "variant_title": "Large Dog (50-80 lbs)",
        "quantity": 1,
        "price": 89.99
      }
    ]
  },
  "payment": {
    "invoice_number": "INV-1738123456-abc123",
    "transaction_id": "40123456789",
    "amount": 89.99,
    "billing_date": "2025-01-28"
  }
}
```

---

### 3. `subscription.payment.failed`
**When it triggers:** Recurring payment fails (card declined, expired, etc.)
**Use case:** Alert customer to update payment method

**Data sent to GHL:**
```json
{
  "event_type": "subscription.payment.failed",
  "customer": {
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1234567890"
  },
  "subscription": {
    "id": "uuid-here",
    "status": "active",  // or "past_due" if attempt_count >= 3
    "frequency": "monthly",
    "amount": 89.99,
    "next_billing_date": "2025-02-28",
    "items": [
      {
        "product_name": "Premium Dog Food Bundle",
        "variant_title": "Large Dog (50-80 lbs)",
        "quantity": 1,
        "price": 89.99
      }
    ]
  },
  "payment": {
    "invoice_number": "INV-1738123456-abc123",
    "amount": 89.99,
    "billing_date": "2025-01-28",
    "attempt_count": 1,  // 1, 2, or 3
    "next_retry_date": "2025-01-31",  // +3 days for attempt 1, +5 for attempt 2, +7 for attempt 3
    "error_message": "Card declined"
  }
}
```

---

### 4. `subscription.paused`
**When it triggers:** Customer pauses their subscription
**Use case:** Confirmation email, remind them how to resume

**Data sent to GHL:**
```json
{
  "event_type": "subscription.paused",
  "customer": {
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1234567890"
  },
  "subscription": {
    "id": "uuid-here",
    "status": "paused",
    "frequency": "monthly",
    "amount": 89.99,
    "next_billing_date": "",  // Empty while paused
    "items": [
      {
        "product_name": "Premium Dog Food Bundle",
        "variant_title": "Large Dog (50-80 lbs)",
        "quantity": 1,
        "price": 89.99
      }
    ]
  },
  "metadata": {
    "pause_reason": "Going on vacation",
    "resume_date": "2025-03-15"  // Optional - if customer set auto-resume date
  }
}
```

---

### 5. `subscription.resumed`
**When it triggers:** Customer resumes a paused subscription
**Use case:** Welcome back email, confirm next billing date

**Data sent to GHL:**
```json
{
  "event_type": "subscription.resumed",
  "customer": {
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1234567890"
  },
  "subscription": {
    "id": "uuid-here",
    "status": "active",
    "frequency": "monthly",
    "amount": 89.99,
    "next_billing_date": "2025-02-28",
    "items": [
      {
        "product_name": "Premium Dog Food Bundle",
        "variant_title": "Large Dog (50-80 lbs)",
        "quantity": 1,
        "price": 89.99
      }
    ]
  }
}
```

---

### 6. `subscription.cancelled`
**When it triggers:** Customer cancels their subscription
**Use case:** Goodbye email, feedback survey, win-back offer

**Data sent to GHL:**
```json
{
  "event_type": "subscription.cancelled",
  "customer": {
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1234567890"
  },
  "subscription": {
    "id": "uuid-here",
    "status": "cancelled",
    "frequency": "monthly",
    "amount": 89.99,
    "next_billing_date": "",  // Empty after cancelled
    "items": [
      {
        "product_name": "Premium Dog Food Bundle",
        "variant_title": "Large Dog (50-80 lbs)",
        "quantity": 1,
        "price": 89.99
      }
    ]
  },
  "metadata": {
    "cancellation_reason": "Too expensive"  // Optional - if customer provided reason
  }
}
```

---

## How to Create GHL Workflows

### Step 1: Create Webhook Trigger

In each workflow:
1. Add trigger: **Webhook**
2. Set filter: `event_type` equals `subscription.created` (or whichever event)
3. GHL will automatically parse the JSON data into custom fields

### Step 2: Add Email Action

For each event, create an email with dynamic fields:

**Available merge fields from webhook:**
- `{{customer.first_name}}`
- `{{customer.email}}`
- `{{customer.last_name}}`
- `{{customer.phone}}`
- `{{subscription.id}}`
- `{{subscription.frequency}}`
- `{{subscription.amount}}`
- `{{subscription.next_billing_date}}`
- `{{subscription.items[0].product_name}}`
- `{{subscription.items[0].variant_title}}`
- `{{subscription.items[0].quantity}}`
- `{{payment.invoice_number}}` (payment events only)
- `{{payment.transaction_id}}` (payment events only)
- `{{payment.attempt_count}}` (failed payment only)
- `{{payment.next_retry_date}}` (failed payment only)

### Step 3: Conditional Logic Examples

**For failed payments - escalate urgency:**
```
IF {{payment.attempt_count}} equals 1
  → Send "Payment Issue - We'll Retry" email
ELSE IF {{payment.attempt_count}} equals 2
  → Send "Important: Update Payment Method" email
ELSE IF {{payment.attempt_count}} equals 3
  → Send "Final Notice: Subscription Will Be Paused" email
```

**For subscriptions by frequency:**
```
IF {{subscription.frequency}} equals "weekly"
  → Send email mentioning weekly deliveries
ELSE IF {{subscription.frequency}} equals "monthly"
  → Send email mentioning monthly deliveries
```

---

## Recommended Workflow Structure

### Workflow 1: Subscription Created
- **Trigger:** `subscription.created`
- **Actions:**
  1. Send welcome email
  2. Add to "Active Subscribers" tag
  3. Add to appropriate frequency list (weekly/monthly/etc.)
  4. Wait 24 hours → Send "Getting Started" tips email

### Workflow 2: Payment Success
- **Trigger:** `subscription.payment.success`
- **Actions:**
  1. Send payment confirmation email
  2. Update contact custom field: `last_payment_date`
  3. Wait 1 day → Send shipping notification (if needed)

### Workflow 3: Payment Failed
- **Trigger:** `subscription.payment.failed`
- **Actions:**
  1. Send urgent email based on attempt count (use conditional logic)
  2. Add to "Payment Issue" tag
  3. IF attempt_count >= 3: Add to "Past Due" tag
  4. Send SMS if attempt_count >= 2

### Workflow 4: Subscription Paused
- **Trigger:** `subscription.paused`
- **Actions:**
  1. Send pause confirmation email
  2. Remove from "Active Subscribers" tag
  3. Add to "Paused Subscribers" tag
  4. Wait 7 days → Send "Miss You" email with resume link

### Workflow 5: Subscription Resumed
- **Trigger:** `subscription.resumed`
- **Actions:**
  1. Send welcome back email
  2. Add back to "Active Subscribers" tag
  3. Remove from "Paused Subscribers" tag

### Workflow 6: Subscription Cancelled
- **Trigger:** `subscription.cancelled`
- **Actions:**
  1. Send goodbye email
  2. Remove from "Active Subscribers" tag
  3. Add to "Cancelled Subscribers" tag
  4. Send feedback survey (optional)
  5. Wait 30 days → Send win-back offer email

---

## Email Template Examples

### Payment Success Email (Simple Template)

**Subject:** Payment Received - Your Order is Processing 🐾

**Body:**
```
Hi {{customer.first_name}},

Thank you! Your subscription payment of ${{subscription.amount}} has been processed successfully.

Invoice Number: {{payment.invoice_number}}
Next Billing Date: {{subscription.next_billing_date}}

Your order is being prepared and will ship within 1-2 business days.

Questions? Reply to this email anytime!

🐾 Waggin' Meals Team
```

---

### Payment Failed Email (Attempt 1)

**Subject:** Payment Issue - We'll Retry in 3 Days

**Body:**
```
Hi {{customer.first_name}},

We had trouble processing your subscription payment of ${{subscription.amount}}.

This could be due to:
- Insufficient funds
- Expired card
- Temporary hold by your bank

Don't worry! We'll automatically retry on {{payment.next_retry_date}}.

Want to update your payment method now? Click here:
https://wagginmeals.com/account/payment-methods

Questions? We're here to help!

🐾 Waggin' Meals Team
```

---

### Payment Failed Email (Attempt 3 - Final)

**Subject:** ⚠️ Action Required: Subscription Will Be Paused

**Body:**
```
Hi {{customer.first_name}},

This is our 3rd attempt to process your payment of ${{subscription.amount}}.

Your subscription will be paused unless you update your payment method.

Update now (takes 30 seconds):
https://wagginmeals.com/account/payment-methods

After updating, your subscription will automatically resume!

Need help? Call us at (555) 123-4567 or reply to this email.

🐾 Waggin' Meals Team
```

---

## Prompt for Your AI Assistant

**Copy and paste this to your GHL AI assistant:**

```
I need help creating 6 GoHighLevel workflows for subscription billing automation.

The workflows receive webhook events from my website with JSON data containing customer and subscription information.

Please create these 6 workflows:

1. subscription.created - Welcome email when subscription is created
2. subscription.payment.success - Payment confirmation
3. subscription.payment.failed - Alert customer to update payment (with conditional logic for 3 attempts)
4. subscription.paused - Confirmation when customer pauses
5. subscription.resumed - Welcome back when customer resumes
6. subscription.cancelled - Goodbye and feedback request

For each workflow:
- Set up webhook trigger filtering by event_type
- Create professional email template using merge fields from webhook data
- Add appropriate tags and contact updates
- Include follow-up sequences where relevant

Use these merge fields:
- {{customer.first_name}}
- {{customer.email}}
- {{subscription.amount}}
- {{subscription.next_billing_date}}
- {{subscription.frequency}}
- {{payment.invoice_number}}
- {{payment.attempt_count}} (failed payments only)
- {{payment.next_retry_date}} (failed payments only)

Brand: Waggin' Meals - Premium dog nutrition subscription
Tone: Friendly, professional, dog-lover focused
```

Then attach this file (GHL-SNAPSHOT-SETUP.md) so your AI has all the webhook event structures and examples.

---

## Testing the Integration

### 1. Test Webhook Connection

```bash
# Send test webhook to GHL
curl -X POST YOUR_GHL_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "subscription.created",
    "customer": {
      "email": "test@example.com",
      "first_name": "Test",
      "last_name": "Customer"
    },
    "subscription": {
      "id": "test-123",
      "status": "active",
      "frequency": "monthly",
      "amount": 89.99,
      "next_billing_date": "2025-02-28",
      "items": [
        {
          "product_name": "Test Product",
          "quantity": 1,
          "price": 89.99
        }
      ]
    }
  }'
```

### 2. Check GHL Workflow Triggers

- Go to GHL → Automation → Workflows
- Find "Subscription Created" workflow
- Check "Recent Activity" to see if test webhook triggered
- Verify email was sent to test@example.com

### 3. Test All 6 Event Types

Send test webhooks for all 6 event types to ensure workflows trigger correctly.

---

## FAQ

**Q: Do I need to configure anything on the website?**
A: Just add `GHL_WEBHOOK_URL` to your `.env.local` file. The website handles the rest.

**Q: What if GHL is down when an event occurs?**
A: The webhook will fail gracefully and log the error. You can resend webhooks manually if needed.

**Q: Can I send SMS instead of emails?**
A: Yes! In GHL workflows, add SMS actions instead of or in addition to email actions.

**Q: How do I customize the email templates?**
A: Edit them directly in GoHighLevel's workflow builder using the visual email editor.

**Q: Can I add delays between emails?**
A: Yes! Use GHL's "Wait" action to add delays (e.g., "Wait 24 hours" before sending follow-up).

**Q: What happens if a customer has multiple subscriptions?**
A: Each subscription event is sent separately with its own `subscription.id`. You can use that ID to track which subscription triggered the workflow.

---

## Support

**Need help setting this up?**
- Review the webhook event structures above
- Check the GHL workflow examples
- Test with the cURL command provided
- Refer to GoHighLevel's webhook documentation: https://highlevel.stoplight.io/

**Technical Issues:**
- Verify `GHL_WEBHOOK_URL` is set in `.env.local`
- Check browser console and server logs for errors
- Test webhook with cURL to isolate issues
