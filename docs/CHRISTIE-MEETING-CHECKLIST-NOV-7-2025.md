# Christie Meeting Checklist & Discussion Points
**Date**: November 7, 2025
**Meeting Purpose**: Review recent website updates and finalize GHL setup before launch

---

## 🎉 COMPLETED UPDATES

### 1. Navigation & Footer Improvements ✅
**What Changed:**
- Logo/tagline now displays on single line ("Healthy Gut = Clean Butt")
- Footer restructured with 5 comprehensive columns
- Added functional newsletter signup to footer (name + email)
- All forms connect to API (no embedded forms)

**What Christie Sees:**
- Professional, clean navigation
- Easy newsletter capture in footer
- Better site navigation for customers

---

### 2. Shop All Page - Product Images ✅
**What Was Fixed:**
- **16 products** now have proper images (were showing gray placeholders)
- All product images loading correctly

**Products Updated:**
- Bug Shield Soap & Spray ✅
- Derma Shield Shampoo ✅
- Pumpkin Broth ✅
- All Baked Bites varieties (6 products) ✅
- All Pup Packs (3 products) ✅
- Travel Fee consultations (3 products) ✅

---

### 3. GoHighLevel (GHL) Integration ✅
**What It Does:**
- Automatically syncs ALL customer interactions to GHL
- Tags customers based on their journey
- Enables automated email workflows
- Tracks complete customer lifecycle

**What's Integrated:**
- Newsletter signups (footer, page, modal)
- Order completions (all purchases)
- Subscription events (create, customize, skip, cancel, etc.)
- Free & paid consultations
- Tag accumulation (customers keep ALL tags from their journey)

---

## 📋 THINGS TO DISCUSS WITH CHRISTIE

### 1. **Travel Fee Products** - Clarification Needed

**Current Setup:**
- 3 travel fee products for in-person consultations
- Buncombe & Madison Counties
- Hendersonville & Yancey Counties
- Macon & Swain Counties

**Questions for Christie:**
- [ ] What are the actual travel fee amounts for each region?
- [ ] Should these be listed on Shop All page, or hidden from main shop?
- [ ] Do customers add this ALONG WITH the $395 consultation?
- [ ] Or is this a standalone "upgrade" option during checkout?
- [ ] Should there be a map/distance guide to help customers choose?

**Recommendation:**
Consider moving these to a separate "Add-Ons" or "Consultation Options" section, not mixed with regular products.

---

### 2. **Product Organization & Collections**

**Current Issue:**
All products display in one long list on Shop All page (40+ products)

**Questions for Christie:**
- [ ] Do you want products organized by category?
  - Fresh Meals
  - Freeze-Dried Toppers
  - Treats
  - Bundles/Packs
  - Care Products (soaps, shampoos)
  - Consultations
- [ ] Should customers be able to filter by category?
- [ ] Priority: Most important products should appear first - which ones?
- [ ] Are there seasonal products (Christmas Bundles) that should hide after the season?

---

### 3. **GoHighLevel Setup - Action Required**

**Christie Needs to Complete in GHL Dashboard:**

**A. Create 21 Tags** (15-20 minutes)
- Newsletter tags: `newsletter-footer`, `newsletter-modal`, `newsletter-page`, `lead-nurture`, `email-marketing`
- Customer tags: `customer`, `first-order`, `repeat-customer`, `high-value-customer`
- Subscription tags: `subscriber`, `subscription-active`, `subscription-customized`, `subscription-skipped`, `subscription-frequency-changed`, `subscription-paused`, `subscription-resumed`, `subscription-cancelled`
- Consultation tags: `free-consultation`, `contact-expert-form`, `paid-consultation-395`, `consultation-paid`

**B. Create 10 Custom Fields** (10-15 minutes)
- `last_order_number`, `last_order_total`, `order_count`
- `subscription_id`, `subscription_frequency`, `subscription_amount`, `subscription_status`, `next_billing_date`
- `consultation_id`, `consultation_amount`

**C. Build 7 Automated Workflows** (2-3 hours)
1. **Newsletter Nurture** (Priority 1) - 5-email sequence over 21 days
2. **First Order Follow-Up** - Thank you + review request
3. **Subscription Welcome** - How to customize + tips
4. **Subscription Cancelled Win-Back** (Priority 2) - Save the customer!
5. **Subscription Paused** - Re-engagement reminder
6. **High-Value Customer VIP** - Special recognition
7. **Paid Consultation Onboarding** - Prep + follow-up

**Documentation Provided:**
- `/docs/AI-ASSISTANT-COORDINATION-GUIDE.md` - Complete GHL setup instructions
- `/docs/GHL-COMPLETE-SETUP-GUIDE-NOV-2025.md` - Detailed workflow templates
- `/docs/GHL-INTEGRATION-COMPLETION-NOV-7-2025.md` - Technical summary

---

### 4. **Newsletter Content Strategy**

**Current Status:**
- Forms are functional and capturing leads ✅
- GHL workflows need to be built with actual email content

**Questions for Christie:**
- [ ] What's your "free guide" for new newsletter subscribers?
- [ ] Success stories to share (we have Bella the picky eater)
- [ ] First-time discount amount? (suggested: 15%)
- [ ] Free consultation offer timing (suggested: Day 21)

---

### 5. **Product Descriptions & SEO**

**Questions for Christie:**
- [ ] Do product descriptions need updating?
- [ ] Any specific keywords/phrases to emphasize?
- [ ] Health benefits to highlight for each product?
- [ ] Ingredients/sourcing stories customers should know?

---

### 6. **Pricing & Inventory**

**Questions for Christie:**
- [ ] Are all product prices current and correct?
- [ ] Do you want low-stock warnings on products?
- [ ] Out-of-stock: Hide product or show "Sold Out"?
- [ ] Pre-order capabilities needed for new products?

---

### 7. **Customer Portal Features**

**Currently Live:**
- Order history
- Subscription management (skip, customize, pause, cancel, change frequency)
- Consultation history
- Payment methods
- Address management

**Questions for Christie:**
- [ ] Are there other self-service features customers need?
- [ ] Reorder favorite products with one click?
- [ ] Gift subscription purchases?
- [ ] Referral program interest?

---

## ✅ THINGS CHRISTIE NEEDS TO CHECK

### Website Testing Checklist

**Navigation & Layout:**
- [ ] Visit homepage - check logo/tagline layout
- [ ] Test main navigation dropdowns
- [ ] Check footer newsletter form (submit test signup)
- [ ] Verify footer links work correctly
- [ ] Test on mobile device (iPhone/Android)

**Shop All Page:**
- [ ] Scroll through all products
- [ ] Verify ALL images are loading (no gray boxes)
- [ ] Check that product titles are accurate
- [ ] Review product descriptions
- [ ] Test "Add to Cart" on a few products
- [ ] Check product prices are correct

**Specific Products to Review:**
- [ ] Bug Shield Soap - image correct?
- [ ] Bug Shield Spray - image correct?
- [ ] Derma Shield Shampoo - image correct?
- [ ] Pumpkin Broth - image correct?
- [ ] All Baked Bites varieties - using correct generic image?
- [ ] Pup Pack bundles - image represents the bundle?
- [ ] Travel Fee consultations - image appropriate?

**Checkout Flow:**
- [ ] Add product to cart
- [ ] Proceed to checkout
- [ ] Fill out shipping info
- [ ] Review cart totals
- [ ] **DO NOT** submit payment (unless intentional test)

**Customer Account:**
- [ ] Log into account portal
- [ ] Check if existing orders display correctly
- [ ] Test subscription management features
- [ ] Update profile info
- [ ] Add/edit payment method

**Newsletter Forms:**
- [ ] Footer newsletter - submit test signup
- [ ] Check if confirmation appears
- [ ] Verify it logs to your database (ask developer to confirm)

---

## 🚨 URGENT ITEMS

### Before Launch:
1. **GHL Setup** - Must create tags, fields, and workflows
2. **Travel Fee Decision** - Show on main shop or separate section?
3. **Product Order** - Prioritize important products first
4. **Test Checkout** - Complete a full test order
5. **Mobile Testing** - Test on actual phones/tablets

---

## 📊 BUSINESS METRICS TO TRACK

Once GHL is set up, track these metrics:

**Newsletter Performance:**
- Signup conversion rate (visitors → subscribers)
- Email open rates
- Click-through rates
- Newsletter → Customer conversion

**Customer Journey:**
- Average time from signup to first purchase
- First-order → Subscription conversion rate
- Subscription retention rate
- High-value customer growth

**Subscription Health:**
- Active subscriptions
- Churn rate (cancellations)
- Skip frequency
- Customization usage (how many use it?)

**Marketing ROI:**
- Which tags have highest conversion?
- Which email sequence performs best?
- Win-back campaign success rate

---

## 💡 FUTURE ENHANCEMENTS

**Consider Adding (Post-Launch):**
- Product reviews & ratings
- Customer testimonials on product pages
- Live chat support
- Subscription gifting
- Loyalty/rewards program
- Recipe blog integration with products
- Video tutorials (feeding guides, recipes)
- Case studies (success stories)

---

## 📞 QUESTIONS TO ASK CHRISTIE

1. **"What's your biggest concern about the website right now?"**

2. **"Which product should be the #1 featured item?"**

3. **"What do most customers ask about before purchasing?"**
   - (Add FAQ or product details to address this)

4. **"Are there any legal/compliance requirements I should know?"**
   - FDA disclaimers?
   - Ingredient disclosures?
   - State-specific regulations?

5. **"What's your capacity for orders right now?"**
   - Do we need to limit subscriptions?
   - Maximum orders per week?

6. **"What's your email sending strategy?"**
   - Frequency of newsletters?
   - Promotional email limits?
   - Customer communication preferences?

7. **"Do you have professional product photos coming?"**
   - Should we wait to launch?
   - Placeholder images acceptable?

---

## 🎯 SUCCESS CRITERIA

**By End of Next Week:**
- [ ] GHL fully configured with all workflows active
- [ ] All product images finalized
- [ ] Shop organized by category
- [ ] Mobile testing complete
- [ ] At least 3 test orders processed successfully
- [ ] Newsletter workflow tested end-to-end

**Within 30 Days:**
- [ ] 100+ newsletter subscribers
- [ ] 10+ orders through new website
- [ ] 5+ active subscriptions
- [ ] GHL automations running smoothly
- [ ] Customer feedback collected

---

## 📁 DOCUMENTS TO SEND CHRISTIE

**Send These Files:**
1. This checklist (CHRISTIE-MEETING-CHECKLIST-NOV-7-2025.md)
2. AI-ASSISTANT-COORDINATION-GUIDE.md (for GHL setup)
3. GHL-COMPLETE-SETUP-GUIDE-NOV-2025.md (workflow details)
4. Screenshot of current Shop All page (so she can review products)

**Include:**
- Link to dev site: [INSERT YOUR DEV URL]
- Login credentials for testing account
- Any passwords needed

---

## 🔐 SECURITY REMINDERS

**Before Deploying to Production:**
- [ ] All environment variables secured in Netlify
- [ ] API keys not exposed in client-side code
- [ ] Database RLS policies enforced
- [ ] Payment processing PCI compliant
- [ ] Customer data properly encrypted

---

## 📝 NOTES FROM MEETING

**Use this section during your call:**

**Christie's Top Priority:**
_________________________________________

**Concerns Raised:**
_________________________________________

**Decisions Made:**
_________________________________________

**Action Items:**
| Task | Owner | Deadline |
|------|-------|----------|
|      |       |          |
|      |       |          |
|      |       |          |

**Follow-Up Needed:**
_________________________________________

---

**Meeting Date:** _______________
**Next Meeting:** _______________
**Prepared By:** AI Assistant
**Document Version:** 1.0
