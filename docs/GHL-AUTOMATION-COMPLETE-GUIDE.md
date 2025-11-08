# GoHighLevel Complete Automation Setup Guide

**Date**: November 3, 2025
**Status**: Ready for Implementation
**Estimated Setup Time**: 2-3 hours

---

## 🎉 What We Built

I've analyzed your complete GHL snapshot ZIP file and created:

### ✅ Files Created

1. **`scripts/setup-ghl-automation.js`** - Automation script that:
   - Analyzes snapshot structure
   - Generates comprehensive documentation
   - Lists all 54 custom fields needed
   - Lists all 50 tags
   - Provides pipeline specifications

2. **`lib/ghl-webhook.ts`** - TypeScript webhook helper with:
   - `sendGHLEvent()` - Generic event sender
   - Pre-built event functions for all common events
   - Type-safe API
   - Error handling

3. **`docs/GHL-CUSTOM-FIELDS.md`** - Complete reference:
   - All 54 custom fields organized by category
   - Field types and names
   - Customer data, orders, subscriptions, consultations, pet info, cart tracking

4. **`docs/GHL-TAGS-REFERENCE.md`** - Complete reference:
   - All 50 tags organized by category
   - Contact lifecycle, order status, subscription status, interests, engagement

5. **`docs/GHL-WEBHOOK-SETUP.md`** - Implementation guide:
   - How to create webhook workflow in GHL
   - All 6 event routes (order.placed, subscription.created, etc.)
   - Next.js integration code examples

---

## 📦 Snapshot Contents (Analyzed)

From `wagginmeals_ghl_snapshot_kit.zip`:

- ✅ **54 Custom Fields** (customer, payment, orders, subscriptions, consultations, pets, cart)
- ✅ **50 Tags** (lifecycle, statuses, interests, engagement, GDPR)
- ✅ **2 Pipelines** (Consultations $395, Orders & Subscriptions)
- ✅ **6 Webhook Events** (order placed/shipped, subscription created, payment failed, cart abandoned, consultation booked)
- ✅ **25+ Email Templates** (order series, subscription series, consultation series, abandoned cart)
- ✅ **4 SMS Templates** (shipping, payment failed, subscription reminders)

---

## 🚀 Implementation Steps

### Step 1: Create Custom Fields in GHL (60 minutes)

**Why Manual**: GHL v1 API doesn't support custom field creation via API.

**How to Do It**:
1. Log into GoHighLevel: https://app.gohighlevel.com/
2. Go to: **Settings → Custom Fields**
3. Click "Add Custom Field" for each field
4. Reference: `docs/GHL-CUSTOM-FIELDS.md`

**All 54 Fields Organized by Category**:

#### Customer Data (14 fields)
- `wm_customer_id` - TEXT
- `wm_first_name` - TEXT
- `wm_last_name` - TEXT
- `wm_email` - EMAIL
- `wm_phone` - PHONE
- `wm_accepts_marketing` - CHECKBOX
- `wm_email_verified` - CHECKBOX
- `wm_created_at` - DATE
- `wm_address_line1` - TEXT
- `wm_address_line2` - TEXT
- `wm_city` - TEXT
- `wm_state` - TEXT
- `wm_postal_code` - TEXT
- `wm_country` - TEXT

#### Payment Data (6 fields)
- `wm_authnet_profile_id` - TEXT
- `wm_authnet_payment_profile_id` - TEXT
- `wm_card_type` - TEXT
- `wm_card_last_four` - TEXT
- `wm_card_expiration` - TEXT
- `wm_payment_method_is_default` - CHECKBOX

#### Order History (7 fields)
- `wm_total_orders` - NUMBER
- `wm_total_spent` - MONETARY
- `wm_average_order_value` - MONETARY
- `wm_last_order_date` - DATE
- `wm_last_order_number` - TEXT
- `wm_last_order_amount` - MONETARY
- `wm_last_shipping_method` - TEXT

#### Subscription Data (10 fields)
- `wm_has_subscription` - CHECKBOX
- `wm_subscription_id` - TEXT
- `wm_subscription_status` - TEXT
- `wm_subscription_frequency` - TEXT
- `wm_subscription_amount` - MONETARY
- `wm_subscription_next_billing` - DATE
- `wm_subscription_last_billing` - DATE
- `wm_subscription_start_date` - DATE
- `wm_subscription_items` - TEXT (long text)

#### Consultation Data (6 fields)
- `wm_consultation_booked` - CHECKBOX
- `wm_consultation_date` - DATE_TIME
- `wm_consultation_status` - TEXT
- `wm_consultation_paid` - CHECKBOX
- `wm_consultation_type` - TEXT

#### Pet Data (5 fields)
- `wm_dog_name` - TEXT
- `wm_dog_breed` - TEXT
- `wm_dog_age` - NUMBER
- `wm_dog_weight` - NUMBER
- `wm_health_concerns` - TEXT (long text)

#### Cart Abandonment (7 fields)
- `wm_cart_abandoned` - CHECKBOX
- `wm_cart_abandon_date` - DATE_TIME
- `wm_cart_items` - TEXT (long text)
- `wm_cart_value` - MONETARY
- `wm_cart_recovery_sent` - CHECKBOX
- `wm_cart_recovered` - CHECKBOX

#### Segmentation (2 fields)
- `wm_is_first_order` - CHECKBOX
- `wm_geo_segment` - TEXT

**Pro Tip**: You can bulk-import custom fields using GHL's import feature if available.

---

### Step 2: Create Pipelines in GHL (10 minutes)

**Pipeline 1: Consultations ($395)**
1. Go to: **Opportunities → Pipelines**
2. Click "Create Pipeline"
3. Name: "Consultations ($395)"
4. Add 7 stages:
   - Inquiry
   - Booking Pending
   - Scheduled
   - Paid & Confirmed
   - Completed
   - No Show
   - Cancelled

**Pipeline 2: Orders & Subscriptions**
1. Create new pipeline
2. Name: "Orders & Subscriptions"
3. Add 8 stages:
   - Cart Active
   - Cart Abandoned
   - Order Placed
   - Processing
   - Shipped
   - Delivered
   - Subscription Active
   - Subscription Past Due

---

### Step 3: Create Webhook Workflow in GHL (30 minutes)

**Create the Event Router Workflow**:

1. Go to: **Automation → Workflows**
2. Click "Create Workflow"
3. Name: **"Event Router (Next.js → GHL)"**
4. Trigger: **"Incoming Webhook"**
5. Copy the webhook URL (you'll need it for .env.local)

**Add 6 Event Routes**:

For each event below, add a **Filter** node that checks `event` field, then add actions:

#### Route 1: Order Placed
- **Filter**: `event` equals `order.placed`
- **Actions**:
  1. Add tag: `order-placed`
  2. Move to pipeline: "Orders & Subscriptions" → "Order Placed"
  3. Update custom fields from webhook payload
  4. Start sequence: "Order Lifecycle" (create this next)

#### Route 2: Order Shipped
- **Filter**: `event` equals `order.shipped`
- **Actions**:
  1. Add tag: `order-shipped`
  2. Move to stage: "Shipped"
  3. Start sequence: "Out for Delivery Scheduler"

#### Route 3: Subscription Created
- **Filter**: `event` equals `subscription.created`
- **Actions**:
  1. Add tags: `subscriber-active`, `first-subscription`
  2. Move to stage: "Subscription Active"
  3. Update custom fields
  4. Start sequence: "Subscription Lifecycle"

#### Route 4: Payment Failed
- **Filter**: `event` equals `payment.failed`
- **Actions**:
  1. Add tags: `subscriber-past-due`, `payment-failed`
  2. Move to stage: "Subscription Past Due"
  3. Start sequence: "Dunning Sequence"

#### Route 5: Cart Abandoned
- **Filter**: `event` equals `cart.abandoned`
- **Actions**:
  1. Add tag: `cart-abandoned`
  2. Move to stage: "Cart Abandoned"
  3. Update custom fields (cart_value, cart_items, cart_abandon_date)
  4. Start sequence: "Abandoned Cart"

#### Route 6: Consultation Booked
- **Filter**: `event` equals `consultation.booked`
- **Actions**:
  1. Add tag: `consultation-booked`
  2. Move to pipeline: "Consultations ($395)" → "Scheduled"
  3. Start sequence: "Consultation Reminders"

**Save the webhook URL!**

---

### Step 4: Add Webhook URL to Environment Variables (2 minutes)

Add this to your `.env.local`:

```bash
# GoHighLevel Webhook URL (from Step 3)
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/xxxxxxxxxxx
```

Also add to **Netlify** (same as Authorize.net vars):
- Key: `GHL_WEBHOOK_URL`
- Value: (your webhook URL from GHL)
- Scopes: Builds, Functions, Runtime
- Secret: No

**Redeploy** after adding to Netlify.

---

### Step 5: Integrate Webhooks into Next.js (30 minutes)

The helper function is already created at `lib/ghl-webhook.ts`.

#### Usage Example 1: Order Placed

In `app/api/checkout/create-order/route.ts`, add after order is created:

```typescript
import { sendOrderPlacedEvent } from '@/lib/ghl-webhook';

// After order created successfully:
if (ghlContactId) {
  await sendOrderPlacedEvent({
    contactId: ghlContactId,
    orderNumber: order.order_number,
    amount: order.total,
    items: order.items.map(i => `${i.product_name} x${i.quantity}`).join(', '),
    shippingMethod: order.shipping_method || 'standard',
  });
}
```

#### Usage Example 2: Subscription Created

In `app/api/checkout/create-subscription/route.ts`:

```typescript
import { sendSubscriptionCreatedEvent } from '@/lib/ghl-webhook';

// After subscription created:
if (ghlContactId) {
  await sendSubscriptionCreatedEvent({
    contactId: ghlContactId,
    subscriptionId: subscription.id,
    amount: subscription.amount,
    frequency: subscription.frequency,
    items: JSON.stringify(subscription.items),
    nextBillingDate: subscription.next_billing_date,
  });
}
```

#### Usage Example 3: Payment Failed

In `app/api/cron/process-billing/route.ts`:

```typescript
import { sendPaymentFailedEvent } from '@/lib/ghl-webhook';

// When payment fails:
if (ghlContactId) {
  await sendPaymentFailedEvent({
    contactId: ghlContactId,
    subscriptionId: subscription.id,
    amount: subscription.amount,
    reason: 'Card declined',
  });
}
```

#### Usage Example 4: Cart Abandoned

Create a new API route: `app/api/cart/abandoned/route.ts`:

```typescript
import { sendCartAbandonedEvent } from '@/lib/ghl-webhook';

export async function POST(request: Request) {
  const { email, firstName, lastName, cartValue, cartItems } = await request.json();

  // Optionally find GHL contact ID by email first
  await sendCartAbandonedEvent({
    email,
    firstName,
    lastName,
    cartValue,
    cartItems,
  });

  return NextResponse.json({ success: true });
}
```

Call this API after 30 minutes of cart inactivity using a client-side timer or cron job.

---

### Step 6: Create Email Sequences (60 minutes)

Use the email templates from the snapshot:

**Location**: `public/ghl_snapshot_extracted/wagginmeals_ghl_snapshot_kit/emails/`

**Sequences to Create**:

1. **Order Lifecycle** (5 emails):
   - `order_1_confirmed.md` - Immediate
   - `order_2_preparing.md` - +1 day
   - `order_3_shipped.md` - When shipped (triggered by event)
   - `order_4_out_for_delivery.md` - +2 days after shipped
   - `order_5_feedback.md` - +3 days after delivered

2. **Subscription Lifecycle** (3 emails):
   - `sub_1_welcome.md` - Immediate
   - `sub_2_renewal_7.md` - 7 days before billing
   - `sub_3_renewal_1.md` - 1 day before billing

3. **Abandoned Cart** (3 emails):
   - `abandoned_1_waiting.md` - +1 hour
   - `abandoned_2_offer.md` - +24 hours (with discount code)
   - `abandoned_3_last_chance.md` - +48 hours

4. **Consultation Series** (4 emails):
   - `consult_1_invite.md` - When booked
   - `consult_2_meet.md` - 1 day before
   - `consult_3_confirmed.md` - Day of consultation
   - `consult_4_plan_ready.md` - After consultation

5. **Product Reminders** (4 emails):
   - `pp_1_storage.md` - +3 days after delivery
   - `pp_2_two_weeks.md` - +14 days after delivery
   - `pp_3_reorder.md` - +21 days after delivery
   - `pp_4_subscribe.md` - +28 days after delivery

**How to Create**:
1. Go to: **Marketing → Emails**
2. Create email template for each
3. Copy content from `.md` files
4. Replace variables with GHL custom field syntax: `{{contact.custom_fields.wm_field_name}}`
5. Go to: **Automation → Campaigns**
6. Create sequences with proper delays

---

### Step 7: Create SMS Sequences (15 minutes)

**Location**: `public/ghl_snapshot_extracted/wagginmeals_ghl_snapshot_kit/sms/`

**SMS to Create**:

1. **`shipping_notification.txt`** - Send when order ships
2. **`payment_failed.txt`** - Send when subscription payment fails
3. **`subscription_reminder.txt`** - Send 1 day before billing
4. **`pickup_ready.txt`** - Send when local pickup order is ready

**How to Create**:
1. Go to: **Automation → SMS**
2. Create SMS template for each
3. Add to appropriate workflow triggers

---

## 🎯 Testing Checklist

After setup is complete, test each flow:

### Order Flow Test
- [ ] Add product to cart
- [ ] Complete checkout
- [ ] Verify webhook fires (`order.placed`)
- [ ] Check GHL: Contact updated with order data
- [ ] Check GHL: Tag `order-placed` added
- [ ] Check GHL: Contact moved to "Order Placed" stage
- [ ] Check GHL: "Order Lifecycle" sequence started
- [ ] Verify order confirmation email sent

### Subscription Flow Test
- [ ] Create new subscription
- [ ] Verify webhook fires (`subscription.created`)
- [ ] Check GHL: Contact updated with subscription data
- [ ] Check GHL: Tags `subscriber-active` and `first-subscription` added
- [ ] Check GHL: Contact moved to "Subscription Active" stage
- [ ] Check GHL: "Subscription Lifecycle" sequence started
- [ ] Verify welcome email sent

### Payment Failure Test
- [ ] Manually trigger payment failure (test card decline)
- [ ] Verify webhook fires (`payment.failed`)
- [ ] Check GHL: Tags `subscriber-past-due` and `payment-failed` added
- [ ] Check GHL: Contact moved to "Subscription Past Due" stage
- [ ] Check GHL: "Dunning Sequence" started
- [ ] Verify payment failure SMS/email sent

### Cart Abandonment Test
- [ ] Add product to cart
- [ ] Enter email (create guest checkout)
- [ ] Leave cart for 30 minutes
- [ ] Verify webhook fires (`cart.abandoned`)
- [ ] Check GHL: Tag `cart-abandoned` added
- [ ] Check GHL: Cart data saved to custom fields
- [ ] Check GHL: "Abandoned Cart" sequence started
- [ ] Verify first abandoned cart email sent (+1 hour)

---

## 📊 What This Achieves

### Automated Customer Lifecycle Management
- ✅ Every order tracked in GHL
- ✅ Every subscription tracked in GHL
- ✅ Payment failures trigger recovery workflows
- ✅ Cart abandonment triggers win-back campaigns
- ✅ Consultation bookings trigger reminder sequences

### Complete Customer View in GHL
- ✅ 54 custom fields capture every data point
- ✅ Order history, subscription status, pet info, cart data
- ✅ Authorize.net payment profile IDs stored
- ✅ Tags track lifecycle stages and interests

### Professional E-Commerce Automation
- ✅ Order confirmation & shipping emails
- ✅ Subscription lifecycle management
- ✅ Failed payment dunning sequence
- ✅ Abandoned cart recovery (3-email series)
- ✅ Product reorder reminders
- ✅ Consultation booking & reminders

### Marketing & Segmentation
- ✅ 50 tags for precise segmentation
- ✅ Product interest tracking
- ✅ Engagement scoring (email opens, clicks)
- ✅ Lifecycle stage tracking
- ✅ Win-back campaigns for churned customers

---

## 🚨 Important Notes

### Webhooks vs. Direct GHL API
- **Webhooks** (what we built): Next.js → GHL via webhook URL
  - ✅ Simpler (one URL, events trigger workflows)
  - ✅ No API key management
  - ✅ Visual workflow builder in GHL
  - ❌ No response data from GHL

- **Direct API** (alternative): Next.js → GHL REST API
  - ✅ Get response data (contactId, etc.)
  - ✅ More control
  - ❌ More complex
  - ❌ Requires API key management

**We chose webhooks for simplicity.** If you need response data, we can switch to direct API calls.

### GHL Contact ID Management
Currently, the webhook helper expects `contactId` to be known. You have two options:

**Option 1**: Store GHL Contact ID in Supabase
- When creating customers, also create them in GHL via API
- Store `ghl_contact_id` in Supabase `customers` table
- Pass it to webhook events

**Option 2**: Use Email as Identifier
- GHL can find/create contacts by email
- Modify webhook workflow to lookup/create contact by email
- No need to store `contactId`

**Recommendation**: Option 2 is simpler. Modify the webhook helper to always include `email` and let GHL handle contact matching.

---

## 📝 Next Steps

1. **Today**: Create custom fields in GHL (60 min)
2. **Today**: Create pipelines in GHL (10 min)
3. **Today**: Create webhook workflow in GHL (30 min)
4. **Today**: Add `GHL_WEBHOOK_URL` to .env.local and Netlify (5 min)
5. **Tomorrow**: Integrate webhooks into Next.js API routes (30 min)
6. **Tomorrow**: Test order flow end-to-end (15 min)
7. **This Week**: Create all email sequences (2-3 hours)
8. **This Week**: Create SMS templates (30 min)
9. **This Week**: Test all flows thoroughly (1 hour)

**Total Estimated Time**: 6-8 hours spread over 2-3 days

---

## 💡 Pro Tips

1. **Start Small**: Set up order flow first, test it, then add subscription flow.
2. **Test with Real Data**: Use real emails (your own) to see emails/SMS in action.
3. **Use GHL Preview**: Preview emails and workflows before activating.
4. **Monitor Webhook Logs**: GHL shows webhook activity - check for errors.
5. **Gradual Rollout**: Enable automations one at a time to avoid overwhelming customers.

---

## 🆘 Troubleshooting

### Webhooks Not Firing
- Check `GHL_WEBHOOK_URL` is correct in .env.local and Netlify
- Check GHL workflow is "Published" (not draft)
- Check webhook logs in GHL for errors
- Test webhook manually with Postman

### Custom Fields Not Populating
- Verify field keys match exactly (case-sensitive)
- Check GHL workflow is updating custom fields from webhook payload
- Check webhook payload includes `customFields` object

### Tags Not Being Added
- Verify tags are spelled correctly in webhook helper
- Check GHL workflow has "Add Tag" action
- Tags are created automatically on first use

### Emails Not Sending
- Verify email sequences are published
- Check sequence triggers match webhook events
- Check contact is actually in the sequence (GHL → Contact → Sequences)
- Check email content doesn't have syntax errors

---

## 📞 Support Resources

- **GHL Documentation**: https://help.gohighlevel.com/
- **GHL API Docs**: https://highlevel.stoplight.io/
- **GHL Community**: https://www.facebook.com/groups/gohighlevel
- **Webhook Testing**: https://webhook.site/ (test webhook payloads)

---

**Last Updated**: November 3, 2025
**Status**: Ready for Implementation
**Next Action**: Create 54 custom fields in GHL (see Step 1)
