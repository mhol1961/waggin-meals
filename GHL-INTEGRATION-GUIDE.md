# GoHighLevel Integration Guide - Waggin' Meals

## Step-by-Step Integration After GHL Snapshot is Generated

### Phase 1: Get Your GHL Resources (Do This First)

Once your GHL snapshot is created, collect these items:

#### 1. Form Embed Codes
You'll need the embed codes for:
- ✅ Newsletter Signup form (`newsletter-signup`)
- ✅ Contact Form (`contact-form`)
- ✅ Abandoned Cart Capture form (`abandoned-cart-capture`)

**How to get them:**
1. Log into GHL
2. Go to Sites → Forms
3. Click on each form
4. Click "Embed" button
5. Copy the embed code (should look like: `<iframe src="https://api.leadconnectorhq.com/widget/form/...`)

#### 2. Webhook URLs
You'll need webhook URLs for these events:
- ✅ New Order webhook
- ✅ Abandoned Cart webhook
- ✅ Order Shipped webhook

**How to get them:**
1. Go to Automations → Workflows
2. Open "First Purchase Thank You" workflow
3. The first trigger should be "Webhook"
4. Copy the webhook URL (looks like: `https://services.leadconnectorhq.com/hooks/...`)
5. Repeat for Abandoned Cart workflow

#### 3. API Credentials (You should already have these)
- ✅ GHL_API_KEY
- ✅ GHL_LOCATION_ID

---

### Phase 2: Update Environment Variables

Add to your `.env.local` file:

```bash
# GoHighLevel Integration
GHL_ENABLED=true
GHL_API_KEY=your_actual_api_key_here
GHL_LOCATION_ID=your_actual_location_id_here

# GoHighLevel Webhook URLs (get from Step 1)
GHL_WEBHOOK_NEW_ORDER=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_CART_ABANDONED=https://services.leadconnectorhq.com/hooks/xxxxx
GHL_WEBHOOK_ORDER_SHIPPED=https://services.leadconnectorhq.com/hooks/xxxxx

# Form IDs (optional, for reference)
GHL_FORM_NEWSLETTER=newsletter-signup
GHL_FORM_CONTACT=contact-form
GHL_FORM_CART_CAPTURE=abandoned-cart-capture
```

---

### Phase 3: Replace Forms in Website

#### A. Newsletter Signup Form

**Files to update:**
1. `app/blog/page.tsx` (already has NewsletterSignupForm component)
2. Any other pages where you want newsletter signup

**Option 1: Use GHL Embed (Recommended)**
Replace the current `<NewsletterSignupForm />` component with GHL iframe:

```tsx
<div className="max-w-md mx-auto">
  {/* Paste your GHL Newsletter form embed code here */}
  <iframe
    src="https://api.leadconnectorhq.com/widget/form/YOUR_FORM_ID"
    style={{ width: '100%', height: '400px', border: 'none', borderRadius: '8px' }}
  />
</div>
```

**Option 2: Keep Custom Form, Send to GHL via API**
We'll build an API endpoint that submits to GHL when form is submitted.

---

#### B. Contact Form

**File to update:** `app/contact/page.tsx`

**Current:** Sends email via SMTP
**New:** Send to GHL instead (or in addition)

Replace form action or add GHL submission to existing contact API route.

---

### Phase 4: Integration Code I'll Build

After you provide the webhook URLs and form details, I'll create:

#### 1. GHL Service Library
**File:** `lib/ghl-service.ts`
- Functions to create/update contacts
- Functions to send webhook events
- Functions to add tags
- Functions to update custom fields

#### 2. Updated Order API
**File:** `app/api/orders/route.ts`
- Send order data to GHL webhook when order created
- Tag customer appropriately (First-Time Buyer or Repeat)
- Update custom fields (Order Count, Total Purchases, Last Purchase Date)

#### 3. Abandoned Cart System
**Files:**
- `app/api/cart/abandoned/route.ts` (NEW)
- `components/cart-drawer.tsx` (UPDATE)
- Cart tracking with local storage
- Automatic webhook after 30 minutes of inactivity
- Email capture in cart

#### 4. Updated Contact Form API
**File:** `app/api/contact/route.ts`
- Send submissions to GHL instead of/in addition to email
- Tag contacts appropriately
- Trigger GHL workflow

#### 5. Shipping Notification Integration
**File:** `app/api/admin/orders/[id]/shipping/route.ts`
- Already exists, will add GHL webhook call
- Update contact timeline in GHL when order ships

---

### Phase 5: Testing Checklist

Once integration is complete, test each flow:

#### Newsletter Signup
1. ☐ Submit newsletter form
2. ☐ Check GHL for new contact
3. ☐ Verify tags: "Newsletter Subscriber", "Website Lead"
4. ☐ Verify welcome email received (from GHL)
5. ☐ Check workflow is triggered

#### Contact Form
1. ☐ Submit contact form
2. ☐ Check GHL for new contact/updated contact
3. ☐ Verify tags: "Contact Form Lead", inquiry type
4. ☐ Verify auto-response email received
5. ☐ Verify admin notification sent

#### Order Flow
1. ☐ Place test order
2. ☐ Check GHL contact updated with order data
3. ☐ Verify custom fields updated (Order Count, Total Purchases)
4. ☐ Verify tags: "First-Time Buyer" or "Repeat Customer"
5. ☐ Verify "First Purchase Thank You" workflow triggered
6. ☐ Check pipeline stage updated

#### Abandoned Cart
1. ☐ Add items to cart
2. ☐ Enter email in cart capture form
3. ☐ Leave site without checking out
4. ☐ Wait 30 minutes
5. ☐ Check GHL for abandoned cart contact
6. ☐ Verify tags: "Abandoned Cart", "High Intent"
7. ☐ Verify abandoned cart workflow triggered
8. ☐ Receive first recovery email (1 hour mark)

#### Shipping Notification
1. ☐ Add tracking number to test order
2. ☐ Check GHL contact timeline updated
3. ☐ Verify order status changed in GHL
4. ☐ Check if shipping notification sent (depends on config)

---

### Phase 6: Monitor & Optimize

After launch, monitor these metrics in GHL:

**Week 1: Validation**
- Are contacts being created properly?
- Are tags being applied correctly?
- Are workflows triggering as expected?
- Are custom fields updating?

**Week 2-4: Optimization**
- Email open rates by workflow
- Abandoned cart recovery rate
- Newsletter to purchase conversion
- Workflow engagement metrics

**Month 2+: Scaling**
- A/B test email subject lines
- Test different discount amounts in abandoned cart
- Adjust workflow timing based on data
- Segment customers for targeted campaigns

---

## Common Issues & Solutions

### Issue: Contacts Not Creating in GHL
**Solution:**
- Check GHL_ENABLED=true in .env.local
- Verify API key is correct
- Check GHL API logs for errors
- Ensure location ID is correct

### Issue: Webhooks Not Triggering
**Solution:**
- Verify webhook URLs are correct
- Check webhook is active in GHL workflow
- Test webhook with sample payload in GHL
- Check server logs for webhook call errors

### Issue: Tags Not Applying
**Solution:**
- Verify tag names match exactly (case-sensitive)
- Pre-create all tags in GHL before testing
- Check workflow automation settings

### Issue: Duplicate Contacts
**Solution:**
- GHL should auto-merge by email
- Check for email typos
- Verify de-duplication settings in GHL

---

## Next Steps After You Get GHL Snapshot

1. **Import Snapshot** into your GHL location
2. **Collect Resources** (webhook URLs, form embed codes)
3. **Share with me:**
   - The 3 webhook URLs
   - Whether you want embedded forms or API integration
   - Any custom requirements for workflows
4. **I'll build** the integration code
5. **Test together** in staging environment
6. **Launch** to production
7. **Monitor** and optimize

---

## Questions to Consider

Before I build the integration code, let me know your preferences:

1. **Form Integration:**
   - Option A: Use GHL embedded forms (easier, but less customizable)
   - Option B: Keep custom forms, submit to GHL via API (more control, matches your design)
   - Option C: Hybrid (use embeds for some, custom for others)

2. **Email Sending:**
   - Keep Resend for transactional (recommended)
   - Use GHL for all marketing emails (recommended)
   - Admin notifications - email or SMS?

3. **Abandoned Cart:**
   - Capture email in cart drawer?
   - Time before marking as abandoned (30 minutes recommended)
   - Show popup with discount after X minutes?

4. **Contact Form:**
   - Send to both email AND GHL? (recommended for redundancy)
   - Or only GHL?

5. **Customer Data Sync:**
   - Sync all existing customers to GHL?
   - Start fresh with new customers only?

Let me know your preferences and share those webhook URLs when ready! 🚀
