# GoHighLevel (GHL) Integration Guide
**Waggin' Meals E-Commerce Platform**
**Last Updated**: November 2, 2025

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [What's Already Integrated](#whats-already-integrated)
3. [Required GHL Configuration](#required-ghl-configuration)
4. [Workflow Automation Setup](#workflow-automation-setup)
5. [Additional Integration Opportunities](#additional-integration-opportunities)
6. [Testing & Verification](#testing--verification)

---

## Overview

This document outlines the GoHighLevel CRM integration for Waggin' Meals. The platform uses GHL for **marketing automation, customer lifecycle management, and email/SMS campaigns**.

**Important**: Christie uses GHL workflows exclusively for all email marketing. The website triggers these workflows via API calls and webhooks - it does NOT send emails directly.

---

## What's Already Integrated

### ✅ **Free Consultations (Contact Expert Form)**

**File**: `app/api/contact-expert/route.ts`

**What Happens**:
1. Customer submits free consultation form at `/contact-expert`
2. API saves data to database (consultation_requests + pet_profiles tables)
3. API syncs contact to GHL CRM with tags

**GHL API Call**:
```javascript
POST https://rest.gohighlevel.com/v1/contacts/
Authorization: Bearer ${GHL_API_KEY}

Body:
{
  locationId: process.env.GHL_LOCATION_ID,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address1: "123 Main St",
  city: "Asheville",
  state: "NC",
  postalCode: "28801",
  tags: ["free-consultation", "contact-expert-form"],
  customField: {
    [GHL_CUSTOM_FIELD_CONSULTATION_ID]: "uuid",
    [GHL_CUSTOM_FIELD_PET_COUNT]: "2",
    [GHL_CUSTOM_FIELD_SPENDING]: "100",
    [GHL_CUSTOM_FIELD_FREQUENCY]: "monthly"
  }
}
```

**Tags Applied**:
- `free-consultation`
- `contact-expert-form`

**Error Handling**:
- Errors stored in `consultation_requests.admin_notes`
- Visible in admin dashboard at `/admin/consultations`

---

### ✅ **Paid Consultations ($395)**

**File**: `app/api/consultations/complete-payment/route.ts`

**What Happens**:
1. Customer completes questionnaire and payment for $395 consultation
2. API updates consultation status to 'paid'
3. API syncs contact to GHL CRM with tags

**GHL API Call**:
```javascript
POST https://rest.gohighlevel.com/v1/contacts/
Authorization: Bearer ${GHL_API_KEY}

Body:
{
  locationId: process.env.GHL_LOCATION_ID,
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  phone: "+1234567890",
  city: "Asheville",
  state: "NC",
  tags: ["paid-consultation-395", "consultation-paid"],
  customField: {
    [GHL_CUSTOM_FIELD_CONSULTATION_ID]: "uuid"
  }
}
```

**Tags Applied**:
- `paid-consultation-395`
- `consultation-paid`

**Error Handling**:
- Errors stored in `paid_consultations.admin_notes`
- Visible in admin dashboard at `/admin/paid-consultations`

---

## Required GHL Configuration

### Environment Variables

Add these to your `.env.local` file (local dev) and Netlify (production):

```bash
# =====================================================
# GoHighLevel CRM Integration
# =====================================================

# REQUIRED for all GHL features
GHL_API_KEY=your_ghl_api_key_here
GHL_LOCATION_ID=your_ghl_location_id_here

# OPTIONAL custom field IDs (for additional data tracking)
GHL_CUSTOM_FIELD_CONSULTATION_ID=field_id_for_consultation
GHL_CUSTOM_FIELD_PET_COUNT=field_id_for_pet_count
GHL_CUSTOM_FIELD_SPENDING=field_id_for_current_spending
GHL_CUSTOM_FIELD_FREQUENCY=field_id_for_delivery_frequency
```

### How to Get These Values:

**1. GHL API Key**:
- Log into GoHighLevel
- Go to Settings → Integrations → API Keys
- Create new API key with permissions:
  - Contacts: Read/Write
  - Opportunities: Read/Write (optional)
  - Workflows: Trigger (optional)

**2. GHL Location ID**:
- In GHL, go to Settings → Company
- Copy the Location ID (usually starts with `loc_`)

**3. Custom Field IDs**:
- Go to Settings → Custom Fields
- Create fields for:
  - Consultation ID (Text field)
  - Pet Count (Number field)
  - Current Spending (Currency field)
  - Delivery Frequency (Dropdown field)
- Copy each field's ID

---

## Workflow Automation Setup

### **Workflow 1: Free Consultation Follow-Up**

**Trigger**: Tag added = `free-consultation`

**Workflow Steps**:
1. **Wait** 5 minutes (give Christie time to review)
2. **Send Email**: "We received your consultation request"
   - Template: Thank you for reaching out
   - Next steps: Christie will review within 24-48 hours
   - Include pet names from custom fields
3. **Wait** 1 day
4. **Check**: Has Christie contacted them? (check for `contacted` tag)
5. **If No**: Send SMS reminder to Christie
6. **Wait** 2 days
7. **If Still No Contact**: Send follow-up email to customer
8. **Tag**: Add `consultation-follow-up-sent`

---

### **Workflow 2: Paid Consultation Onboarding**

**Trigger**: Tag added = `paid-consultation-395`

**Workflow Steps**:
1. **Immediate**: Send confirmation email
   - Template: "Payment confirmed! Here's what happens next"
   - Include scheduling link
   - Outline 3-part consultation process
2. **Create Task**: Assign to Christie "Review consultation questionnaire"
3. **Wait** 24 hours
4. **Check**: Has consultation been scheduled? (check for `scheduled` tag)
5. **If No**: Send SMS to Christie + email to customer
6. **After Consultation**: Send follow-up resources
   - Meal planning guide
   - Feeding calculator link
   - Product recommendations

---

### **Workflow 3: Subscription Lifecycle** (NOT YET BUILT)

**Trigger**: Customer starts subscription

**Workflow Steps**:
1. **Welcome Series** (3 emails over 7 days)
   - Email 1: Welcome + what to expect
   - Email 2: Feeding tips & storage guide
   - Email 3: Exclusive member benefits
2. **Monthly Check-In** (recurring)
   - Email on day 15 of each month
   - "How is [Dog Name] doing?"
   - Link to update subscription
3. **Renewal Reminder**
   - Email 3 days before next charge
   - Preview next box contents
   - Option to skip or customize

---

### **Workflow 4: Failed Payment Recovery** (NOT YET BUILT)

**Trigger**: Tag added = `payment-failed`

**Workflow Steps**:
1. **Immediate**: Send email "Payment issue with your subscription"
   - Friendly tone
   - Link to update payment method
2. **Wait** 24 hours
3. **Check**: Payment updated? (remove `payment-failed` tag if fixed)
4. **If Not Fixed**: Send SMS
5. **Wait** 48 hours
6. **Check Again**: Still failed?
7. **If Still Failed**: Pause subscription + send final notice
8. **Tag**: Add `subscription-cancelled-payment-failure`

---

### **Workflow 5: Abandoned Cart** (NOT YET BUILT)

**Trigger**: Customer adds to cart but doesn't checkout (15 minutes)

**Workflow Steps**:
1. **Wait** 15 minutes
2. **Send Email**: "Did you forget something?"
   - Show cart contents
   - Limited-time discount code (10% off)
3. **Wait** 24 hours
4. **Check**: Did they purchase?
5. **If No**: Send follow-up email
   - Different discount (free shipping)
   - Customer testimonials
6. **Wait** 3 days
7. **If Still No Purchase**: Final email
   - "Last chance" messaging
   - Christie's personal note

---

## Additional Integration Opportunities

### **🔄 Webhook Triggers** (To Be Built)

The website should trigger GHL workflows when these events occur:

#### **Subscription Events**:
```javascript
// When subscription status changes
POST https://rest.gohighlevel.com/v1/contacts/${contactId}/tags
Body: {
  tags: [
    "subscription-active",      // Status changed to active
    "subscription-paused",      // Customer paused subscription
    "subscription-cancelled",   // Customer cancelled
    "subscription-skipped",     // Customer skipped next delivery
    "subscription-frequency-changed"  // Customer changed frequency
  ]
}
```

#### **Order Events**:
```javascript
// When order is fulfilled
POST https://rest.gohighlevel.com/v1/contacts/${contactId}/tags
Body: {
  tags: [
    "order-shipped",           // Order has shipped
    "order-delivered",         // Order delivered (tracking confirmed)
    "repeat-customer",         // 2nd+ order
    "high-value-customer"      // $500+ lifetime spend
  ]
}
```

#### **Customer Lifecycle Events**:
```javascript
// Engagement milestones
POST https://rest.gohighlevel.com/v1/contacts/${contactId}/tags
Body: {
  tags: [
    "consultation-completed",   // Consultation delivered
    "product-review-left",      // Customer left review
    "referral-made",            // Customer referred someone
    "loyalty-tier-upgraded"     // Reached new loyalty tier
  ]
}
```

---

### **📊 Custom Fields to Add in GHL**:

Create these custom fields in GHL for better segmentation:

1. **Lifetime Value** (Currency) - Total amount spent
2. **Subscription Status** (Dropdown: active, paused, cancelled)
3. **Dog Breed** (Text) - For breed-specific marketing
4. **Dog Age** (Number) - For age-appropriate products
5. **Preferred Products** (Multi-select) - Chicken, beef, fish, etc.
6. **Dietary Restrictions** (Text) - Allergies, sensitivities
7. **Last Order Date** (Date) - For win-back campaigns
8. **Consultation Type** (Dropdown: free, paid, none)

---

## Testing & Verification

### **Test Checklist**:

**Free Consultation Sync**:
- [ ] Submit free consultation form at `/contact-expert`
- [ ] Verify contact appears in GHL with correct tags
- [ ] Check custom fields populated correctly
- [ ] Confirm workflow triggered (if configured)
- [ ] Verify error handling (test with invalid API key)

**Paid Consultation Sync**:
- [ ] Complete paid consultation questionnaire
- [ ] Complete payment ($395)
- [ ] Verify contact appears in GHL with correct tags
- [ ] Check consultation ID in custom field
- [ ] Confirm workflow triggered (if configured)
- [ ] Test email confirmation sent via GHL

**Error Monitoring**:
- [ ] Check `/admin/consultations` for sync errors
- [ ] Check `/admin/paid-consultations` for sync errors
- [ ] Verify `admin_notes` field shows error details
- [ ] Test retry mechanism (if failed, manually retry sync)

---

## Implementation Priority

### **Phase 1: Already Done** ✅
- Free consultation sync
- Paid consultation sync
- Error tracking and reporting

### **Phase 2: High Priority** (Next to build)
- Subscription lifecycle webhooks
- Failed payment recovery workflow
- Order fulfillment notifications

### **Phase 3: Medium Priority**
- Abandoned cart tracking
- Customer segmentation tags
- Win-back campaigns

### **Phase 4: Nice to Have**
- Product review requests
- Referral program automation
- Birthday/anniversary campaigns

---

## Support & Troubleshooting

### **Common Issues**:

**1. Contact not syncing to GHL**:
- Check API key is valid
- Verify location ID is correct
- Check network connectivity
- Review error in `admin_notes` field

**2. Custom fields not populating**:
- Verify custom field IDs in environment variables
- Ensure field IDs exist in GHL
- Check field types match (text, number, etc.)

**3. Workflows not triggering**:
- Confirm tags are spelled correctly
- Check workflow is published in GHL
- Verify trigger conditions match

**4. Duplicate contacts**:
- GHL matches by email - ensure email is unique
- Use email as primary identifier
- GHL will update existing contact if email matches

---

## Notes

- **All email sending happens in GHL** - the website only triggers workflows
- **Tags are the key** - use tags to trigger automation
- **Custom fields enhance personalization** - but are optional
- **Error tracking is built-in** - check admin dashboard for sync failures
- **Christie owns GHL configuration** - developers only integrate API calls

---

**For Questions**: Contact development team or refer to GHL API docs at https://highlevel.stoplight.io/
