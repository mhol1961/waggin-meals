# AI Assistant Coordination Guide
**Date**: November 7, 2025
**Purpose**: Synchronize GHL snapshot AI with website integration work

---

## 🚨 CRITICAL: NO EMBEDDED FORMS NEEDED

**YOUR AI ASSISTANT SHOULD NOT BUILD EMBEDDED FORMS FOR THESE FEATURES:**

All website forms are **custom-built React components** that submit data to **Next.js API endpoints**, which then sync to GHL via **REST API** (not embedded forms).

The website handles ALL form UI and validation. GHL receives contacts via API calls, not form embeds.

---

## Architecture Overview

```
User Fills Form → Website API Endpoint → GHL REST API → GHL Contact Created/Updated → GHL Workflow Triggered
```

**NOT**:
```
User Fills Form → GHL Embedded Form → GHL Contact Created (❌ We're NOT doing this)
```

---

## What's Already Built (Website Side)

### 1. Newsletter Signup System ✅
**Forms Built:**
- Footer newsletter form (`components/footer-newsletter.tsx`)
- Page newsletter section (`components/newsletter.tsx`)
- Homepage modal (existing)

**API Endpoint:**
- `POST /api/newsletter/subscribe`

**Data Sent to GHL:**
- Email
- First Name
- Tags: `newsletter-{source}`, `lead-nurture`, `email-marketing`

**GHL Needs:**
- Workflow: Newsletter nurture sequence (5 emails)
- Tags: Create tags listed above
- Custom fields: (optional, for tracking)

---

### 2. Order Completion Sync ✅
**Trigger:**
- When customer completes a purchase

**API Endpoint:**
- `POST /api/checkout/create-order`

**Data Sent to GHL:**
- Email, First Name, Last Name, Phone
- Tags: `customer`, `first-order` OR `repeat-customer`, `high-value-customer` (if $500+)
- Custom Fields: `last_order_number`, `last_order_total`, `order_count`

**GHL Needs:**
- Workflow: Order confirmation (optional - website already sends email)
- Workflow: Upsell/cross-sell sequences for customers
- Workflow: High-value customer VIP treatment
- Tags: Create tags listed above

---

### 3. Subscription Events Sync ✅
**All Subscription Actions Sync to GHL:**

| Event | API Endpoint | Tags Added |
|-------|--------------|------------|
| **Create** | `POST /api/subscriptions` | `subscriber`, `subscription-active` |
| **Customize Box** | `POST /api/subscriptions/[id]/update-items` | `subscription-customized` |
| **Skip Delivery** | `POST /api/subscriptions/[id]/skip-next` | `subscription-skipped` |
| **Change Frequency** | `POST /api/subscriptions/[id]/change-frequency` | `subscription-frequency-changed` |
| **Pause** | `POST /api/subscriptions/[id]/pause` | `subscription-paused` |
| **Resume** | `POST /api/subscriptions/[id]/resume` | `subscription-resumed` |
| **Cancel** | `DELETE /api/subscriptions/[id]` | `subscription-cancelled` |

**GHL Needs:**
- Workflow: Welcome new subscribers (triggered by `subscription-active` tag)
- Workflow: Re-engagement for paused subscriptions
- Workflow: Win-back for cancelled subscriptions
- Tags: Create all tags listed above
- Custom Fields: `subscription_id`, `subscription_frequency`, `subscription_amount`, `subscription_status`, `next_billing_date`

---

### 4. Free Consultation Requests (Already Built)
**Form:** Contact form on nutrition services page

**API Endpoint:**
- `POST /api/consultations/request`

**Data Sent to GHL:**
- Email, Name, Phone, Pet details
- Tags: `free-consultation`, `contact-expert-form`

**GHL Needs:**
- Workflow: Free consultation follow-up (automated)
- Tags: Create tags listed above

---

### 5. Paid Consultations (Already Built)
**API Endpoint:**
- `POST /api/consultations/complete-payment`

**Data Sent to GHL:**
- Email, Name, Phone
- Tags: `paid-consultation-395`, `consultation-paid`
- Custom Fields: `consultation_id`, `consultation_amount`

**GHL Needs:**
- Workflow: Paid consultation onboarding
- Workflow: Post-consultation follow-up
- Tags: Create tags listed above

---

## What Your AI Assistant SHOULD Build

### In GHL Dashboard:

#### 1. Create All Tags
Your AI assistant should tell you to create these tags in GHL:

**Newsletter Tags:**
- `newsletter-footer`
- `newsletter-modal`
- `newsletter-page`
- `lead-nurture`
- `email-marketing`

**Customer Tags:**
- `customer`
- `first-order`
- `repeat-customer`
- `high-value-customer`

**Subscription Tags:**
- `subscriber`
- `subscription-active`
- `subscription-customized`
- `subscription-skipped`
- `subscription-frequency-changed`
- `subscription-paused`
- `subscription-resumed`
- `subscription-cancelled`

**Consultation Tags:**
- `free-consultation`
- `contact-expert-form`
- `paid-consultation-395`
- `consultation-paid`

#### 2. Create Custom Fields
Your AI assistant should tell you to create these custom fields:

| Field Name | Type | Purpose |
|------------|------|---------|
| `last_order_number` | Text | Track most recent order |
| `last_order_total` | Number | Track order value |
| `order_count` | Number | Total orders placed |
| `subscription_id` | Text | Active subscription ID |
| `subscription_frequency` | Text | How often (weekly, monthly, etc.) |
| `subscription_amount` | Number | Subscription price |
| `subscription_status` | Text | active, paused, cancelled |
| `next_billing_date` | Date | Next subscription charge |
| `consultation_id` | Text | Paid consultation reference |
| `consultation_amount` | Number | Consultation price paid |

#### 3. Build Workflows (Automations)
Your AI assistant should create workflows for:

**Newsletter Workflow (PRIORITY 1):**
- Trigger: Contact gets tag `newsletter-footer` OR `newsletter-modal` OR `newsletter-page`
- Actions:
  1. Wait 0 minutes → Send welcome email with free guide
  2. Wait 3 days → Send success story (Bella the picky eater)
  3. Wait 4 days → Send product showcase with 15% discount code
  4. Wait 7 days → Send urgency email (discount expiring)
  5. Wait 7 days → Send free consultation offer

**First Order Workflow:**
- Trigger: Contact gets tag `first-order`
- Actions:
  1. Wait 1 day → Send thank you + care instructions
  2. Wait 7 days → Request review
  3. Wait 14 days → Offer subscription with discount

**Subscription Welcome Workflow:**
- Trigger: Contact gets tag `subscription-active`
- Actions:
  1. Wait 0 minutes → Welcome to subscription family email
  2. Wait 3 days → How to customize your box
  3. Wait 7 days → Nutrition tips + education

**Subscription Cancelled Workflow (PRIORITY 2):**
- Trigger: Contact gets tag `subscription-cancelled`
- Actions:
  1. Wait 1 day → Feedback survey
  2. Wait 7 days → Win-back offer (20% off to reactivate)
  3. Wait 14 days → Keep engaged with newsletter

**Subscription Paused Workflow:**
- Trigger: Contact gets tag `subscription-paused`
- Actions:
  1. Wait 14 days → Reminder about resume
  2. Wait 7 days → Offer to customize before resuming

**High-Value Customer Workflow:**
- Trigger: Contact gets tag `high-value-customer`
- Actions:
  1. Wait 0 minutes → VIP thank you email
  2. Add to VIP segment for exclusive offers

**Paid Consultation Workflow:**
- Trigger: Contact gets tag `consultation-paid`
- Actions:
  1. Wait 0 minutes → Consultation confirmation + prep instructions
  2. Wait 1 day after consultation → Follow-up resources
  3. Wait 7 days → Check-in + offer ongoing support

---

## Tag Accumulation Strategy (IMPORTANT!)

**How Tags Work:**
- Tags are **NEVER REMOVED**, only **ADDED**
- This creates a complete customer lifecycle history

**Example Journey:**
1. User signs up for newsletter → Gets tags: `newsletter-footer`, `lead-nurture`, `email-marketing`
2. User places first order → **KEEPS** newsletter tags + **ADDS**: `customer`, `first-order`
3. User subscribes → **KEEPS** all previous tags + **ADDS**: `subscriber`, `subscription-active`
4. User customizes box → **KEEPS** all tags + **ADDS**: `subscription-customized`
5. User becomes high-value → **KEEPS** all tags + **ADDS**: `high-value-customer`

**Final Tag List for This Customer:**
```
[newsletter-footer, lead-nurture, email-marketing, customer, first-order,
 subscriber, subscription-active, subscription-customized, high-value-customer]
```

This allows GHL to:
- See complete customer history
- Segment by multiple criteria
- Build sophisticated workflows based on combinations

---

## What Your AI Assistant Should NOT Do

❌ **DO NOT** create embedded forms for:
- Newsletter signup
- Contact forms
- Consultation requests
- Checkout forms
- Subscription management

These are **already built** as custom React components with API integration.

❌ **DO NOT** configure email sending from website:
- Website uses GHL workflows for ALL marketing emails
- Website only sends transactional emails (order confirmations, etc.)

❌ **DO NOT** create duplicate contacts:
- The website API handles contact creation/update
- GHL just receives the data and triggers workflows

---

## Instructions for Your AI Assistant

### Copy This Message to Your AI Assistant:

```
You are helping set up GoHighLevel for a website that uses API integration (not embedded forms).

ALL FORMS ARE CUSTOM-BUILT ON THE WEBSITE. Your job is to configure GHL to:
1. Receive contact data via REST API
2. Create/update contacts with tags
3. Trigger automated workflows based on tags

DO NOT BUILD EMBEDDED FORMS. The website already has all forms built.

YOUR TASKS:
1. Create 21 tags (see list in AI-ASSISTANT-COORDINATION-GUIDE.md)
2. Create 10 custom fields (see list in guide)
3. Build 7 workflows (see specifications in guide):
   - Newsletter nurture (5-email sequence)
   - First order follow-up
   - Subscription welcome
   - Subscription cancelled win-back
   - Subscription paused re-engagement
   - High-value customer VIP
   - Paid consultation onboarding

CRITICAL: Tags accumulate, they are never removed. A customer can have multiple tags showing their complete journey.

REFERENCE DOCUMENT: /docs/AI-ASSISTANT-COORDINATION-GUIDE.md
DETAILED GHL SETUP: /docs/GHL-COMPLETE-SETUP-GUIDE-NOV-2025.md
```

---

## Testing Checklist

Once your AI assistant completes GHL setup, test each integration:

### Newsletter Test:
1. Submit footer newsletter form on website
2. Check GHL → Contact should appear with tags: `newsletter-footer`, `lead-nurture`, `email-marketing`
3. Check workflow triggered → Should receive welcome email

### Order Test:
1. Place test order on website
2. Check GHL → Contact should get tags: `customer`, `first-order`
3. Check custom fields populated: `last_order_number`, `last_order_total`, `order_count`

### Subscription Test:
1. Create test subscription
2. Check GHL → Tags: `subscriber`, `subscription-active`
3. Customize subscription → Tag added: `subscription-customized`
4. Cancel subscription → Tag added: `subscription-cancelled`
5. Check workflow triggered → Win-back email sent

### Tag Accumulation Test:
1. Use same email for newsletter signup, order, and subscription
2. Check GHL contact → Should have ALL tags from all actions
3. Verify tags are accumulating (not replacing)

---

## Environment Variables Needed

Your AI assistant does NOT need to configure these (already done):

```env
# Already configured in Netlify
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_location_id
NEXT_PUBLIC_SITE_URL=https://wagginmeals.com
```

---

## API Integration Architecture (Technical)

For your AI assistant's reference, here's how the integration works:

```typescript
// Website Form Submission
const response = await fetch('/api/newsletter/subscribe', {
  method: 'POST',
  body: JSON.stringify({ firstName, email, source: 'footer' })
});

// API Endpoint (Next.js)
// 1. Saves to Supabase database
// 2. Calls syncContactToGHL()

// GHL Service (lib/ghl-service.ts)
export async function syncContactToGHL(contact: {
  email: string;
  firstName: string;
  tags: string[];
}) {
  // 1. Check if contact exists in GHL
  // 2. If exists: UPDATE with new tags (accumulate)
  // 3. If new: CREATE contact with tags
  // 4. GHL workflows trigger based on tags
}
```

**Result:**
- Contact appears in GHL
- Tags applied
- Workflows trigger automatically
- No embedded forms needed

---

## Summary

**Website Team (Already Done):**
- ✅ Built all forms as custom React components
- ✅ Created API endpoints that sync to GHL
- ✅ Implemented tag accumulation logic
- ✅ Database schema with GHL tracking columns

**Your AI Assistant's Job (GHL Dashboard):**
- ⏳ Create 21 tags
- ⏳ Create 10 custom fields
- ⏳ Build 7 automated workflows
- ⏳ Test all integrations

**What NOT to Build:**
- ❌ Embedded forms (website already has them)
- ❌ Email sending from website (GHL workflows handle it)
- ❌ Duplicate contact management (website API handles it)

---

## Questions for Your AI Assistant?

If your AI assistant asks about:

**"Should I create forms?"** → NO. Forms are already built on website.

**"How do contacts get into GHL?"** → Via REST API calls from website endpoints.

**"What triggers workflows?"** → Tags applied when contacts are synced via API.

**"Should I configure webhooks?"** → NO. Website uses direct API integration, not webhooks.

**"What about email templates?"** → YES. You need to create email templates for the 7 workflows.

**"What about SMS?"** → Optional. Not required for initial launch.

---

## File References

- **This Guide**: `/docs/AI-ASSISTANT-COORDINATION-GUIDE.md`
- **Detailed GHL Setup**: `/docs/GHL-COMPLETE-SETUP-GUIDE-NOV-2025.md`
- **GHL Service Code**: `/lib/ghl-service.ts`
- **Newsletter API**: `/app/api/newsletter/subscribe/route.ts`
- **Order Sync**: `/app/api/checkout/create-order/route.ts`
- **Subscription APIs**: `/app/api/subscriptions/**/*.ts`

---

## Contact for Questions

If your AI assistant gets stuck or needs clarification, refer back to:
1. This coordination guide
2. The detailed GHL setup guide
3. The actual API endpoint code (to see exactly what data is sent)

**Remember**: The website and GHL are PARTNERS. Website handles forms and UI, GHL handles automation and workflows. They communicate via REST API.

🐾 **Let's get this integration done right!** 🐾
