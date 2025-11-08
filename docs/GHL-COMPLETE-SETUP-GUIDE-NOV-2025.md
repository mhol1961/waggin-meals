# GoHighLevel Complete Setup Guide
## Waggin Meals Website Integration

**Date**: November 7, 2025
**Status**: Ready for Implementation
**Estimated Setup Time**: 2-3 hours

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Tags to Create in GHL](#tags-to-create-in-ghl)
4. [Custom Fields to Create](#custom-fields-to-create)
5. [Newsletter Nurture Workflow](#newsletter-nurture-workflow)
6. [Consultation Workflows (Already Configured)](#consultation-workflows)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What's Been Built

Your website now has **comprehensive GoHighLevel integration** that automatically syncs contacts with tags as they progress through your customer journey:

**Newsletter Signup** → **Consultation Request** → **First Purchase** → **Subscription**

### How Tag Accumulation Works

**CRITICAL CONCEPT**: Tags **accumulate** - they're never removed, only added.

**Example Customer Journey**:
1. **Day 1**: Signs up for newsletter → Gets tags: `newsletter-footer`, `lead-nurture`, `email-marketing`
2. **Day 7**: Requests free consultation → **ADDS** tags: `free-consultation`, `contact-expert-form`
   - Total tags: 5 (newsletter tags + consultation tags)
3. **Day 14**: Becomes paying customer → **ADDS** tags: `customer`, `first-order`
   - Total tags: 7 (all previous + customer tags)
4. **Day 30**: Starts subscription → **ADDS** tags: `subscriber`, `subscription-active`
   - Total tags: 9 (all accumulated)

This allows you to:
- Identify newsletter subscribers who became customers
- Target different segments with precision
- Track complete customer lifecycle
- Never lose historical data

---

## Environment Variables Setup

### Required Credentials

You need these from your GoHighLevel account:

1. **GHL_API_KEY** - Your API key
2. **GHL_LOCATION_ID** - Your location/business ID

### How to Get Your Credentials

#### 1. Get Your API Key

1. Log into your GoHighLevel account
2. Click **Settings** (gear icon)
3. Click **Integrations** → **API Key**
4. Click **Create API Key** or copy existing key
5. **Save this securely** - you'll need it for Netlify

#### 2. Get Your Location ID

1. In GoHighLevel, go to **Settings**
2. Click **Business Profile**
3. Look for **Location ID** (usually in the URL or settings)
4. Copy this ID

### Add to Netlify Environment Variables

1. Log into Netlify
2. Go to your site → **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add these two variables:

```
GHL_API_KEY = [your API key from step 1]
GHL_LOCATION_ID = [your location ID from step 2]
```

5. Click **Save**
6. **Trigger a new deploy** for variables to take effect

---

## Tags to Create in GHL

### How to Create Tags in GHL

1. Go to **Contacts** in GHL dashboard
2. Click **Settings** (gear icon) → **Tags**
3. Click **+ Create Tag**
4. Enter tag name exactly as shown below
5. Choose a color (optional, for organization)
6. Save

### Required Tags by Category

#### Newsletter Tags (3 tags)

| Tag Name | Purpose | Auto-Applied When |
|----------|---------|-------------------|
| `newsletter-footer` | Signed up from footer form | Footer newsletter signup |
| `newsletter-page` | Signed up from page section | Newsletter page section |
| `lead-nurture` | Enters nurture sequence | Any newsletter signup |
| `email-marketing` | Eligible for campaigns | Any newsletter signup |

#### Consultation Tags (Already Created - 4 tags)

| Tag Name | Purpose | Auto-Applied When |
|----------|---------|-------------------|
| `free-consultation` | Free consultation request | Contact Expert form |
| `contact-expert-form` | Source: contact form | Contact Expert form |
| `paid-consultation-395` | Paid $395 consultation | Payment completed |
| `consultation-paid` | Consultation is paid for | Payment completed |

#### Customer Tags (Future - 4 tags)

| Tag Name | Purpose | Auto-Applied When |
|----------|---------|-------------------|
| `customer` | Made a purchase | First order completed |
| `first-order` | First purchase | First order completed |
| `repeat-customer` | 2+ orders | Second order completed |
| `high-value-customer` | $500+ total spent | Total spending exceeds $500 |

#### Subscription Tags (Future - 6 tags)

| Tag Name | Purpose | Auto-Applied When |
|----------|---------|-------------------|
| `subscriber` | Has active subscription | Subscription created |
| `subscription-active` | Currently active | Subscription is active |
| `subscription-customized` | Modified box contents | Customer customizes box |
| `subscription-skipped` | Skipped a delivery | Customer skips delivery |
| `subscription-cancelled` | Cancelled subscription | Subscription cancelled |
| `subscription-paused` | Paused subscription | Subscription paused |

**Total Tags to Create Now**: 4 newsletter tags
**Total Tags Already Created**: 4 consultation tags
**Total Tags for Future**: 10 customer/subscription tags (when those integrations are added)

---

## Custom Fields to Create

### How to Create Custom Fields in GHL

1. Go to **Settings** → **Custom Fields**
2. Click **+ New Custom Field**
3. Fill in details:
   - **Field Name**: Exactly as shown below
   - **Field Type**: Choose from dropdown
   - **Field Key**: Auto-generated (note this for later)
4. Click **Save**

### Recommended Custom Fields

| Field Name | Type | Purpose | Currently Used |
|------------|------|---------|----------------|
| `newsletter_source` | Text | Where they signed up (footer/page/blog) | ✅ Yes |
| `consultation_id` | Text | Links to consultation request | ✅ Yes (consultations) |
| `pet_count` | Number | Number of pets | ✅ Yes (consultations) |
| `current_spending` | Text | Monthly pet food spending | ✅ Yes (consultations) |
| `delivery_frequency` | Text | Preferred delivery schedule | ✅ Yes (consultations) |
| `order_count` | Number | Total orders placed | ⏳ Future |
| `total_spent` | Number | Lifetime value | ⏳ Future |
| `subscription_status` | Text | Current subscription status | ⏳ Future |

**Create These Now**: First 5 fields
**Create Later**: Last 3 fields (when order/subscription integrations added)

---

## Newsletter Nurture Workflow

### Workflow Overview

**Trigger**: Contact gets `lead-nurture` tag
**Goal**: Convert newsletter subscribers into customers
**Duration**: 21-day sequence
**Expected Conversion**: 10-15% of subscribers

### Step-by-Step Workflow Setup

#### Step 1: Create New Workflow

1. Go to **Automations** → **Workflows**
2. Click **+ Create Workflow**
3. Name: **Newsletter Nurture Sequence**
4. Description: **21-day email sequence to convert newsletter subscribers to customers**

#### Step 2: Set Trigger

1. Click **Add Trigger**
2. Choose **Tag Applied**
3. Select tag: **lead-nurture**
4. Save trigger

#### Step 3: Add Email 1 - Welcome + Free Guide (Day 0)

1. Click **+** to add action
2. Choose **Send Email**
3. Configure:
   - **Name**: Welcome Email
   - **Subject**: Welcome to the Waggin' Meals Pack! Here's Your Free Guide
   - **From**: Christie at Waggin' Meals
   - **Delay**: 0 days (immediate)

**Email Template**:
```
Hi {{contact.first_name}},

Welcome to the Waggin' Meals family! I'm Christie, and I'm so excited to help you give your furry friend the best nutrition possible.

As promised, here's your FREE Fresh Food Feeding Guide [LINK TO GUIDE]

This guide covers:
✅ How much to feed based on weight
✅ Transitioning to fresh food safely
✅ Common mistakes to avoid
✅ My secret formula for perfect portions

I'll be sending you weekly nutrition tips, success stories, and exclusive offers. But I promise - no spam, just good stuff!

Have questions? Just hit reply. I read every email.

To your pup's health,
Christie Willett, M.A., M.S.
Integrative Animal Nutritionist
Waggin' Meals

P.S. Check out our most popular success story: [LINK TO CASE STUDY]
```

#### Step 4: Add Email 2 - Success Story (Day 3)

1. Add another **Send Email** action
2. Configure:
   - **Name**: Success Story Email
   - **Subject**: How Bella Went from Picky Eater to Food Lover
   - **Delay**: 3 days after previous step

**Email Template**:
```
Hi {{contact.first_name}},

I wanted to share one of my favorite success stories with you...

Meet Bella - a 7-year-old Golden Retriever who refused to eat anything. Her owner tried everything: expensive kibble, wet food, toppers, even hand-feeding.

Nothing worked. Bella was losing weight and her owner was desperate.

Then we did a free consultation (yep, it's free!), discovered Bella's protein sensitivity, and created a custom meal plan.

Two weeks later? Bella literally licks her bowl clean. Every. Single. Meal.

[READ BELLA'S FULL STORY]

The best part? This could be your dog's story too.

Want to chat about your pup's nutrition? Book a free 30-minute consultation - no pressure, just answers.

[BOOK FREE CONSULTATION]

Wagging tails,
Christie

P.S. Next week I'll share my #1 nutrition tip that 90% of dog owners miss.
```

#### Step 5: Add Email 3 - Product Showcase (Day 7)

1. Add **Send Email** action
2. Configure:
   - **Name**: Product Introduction
   - **Subject**: Fresh Food Made Simple (No Cooking Required!)
   - **Delay**: 4 days after previous step

**Email Template**:
```
Hi {{contact.first_name}},

Quick question: Do you want to feed fresh food but think it's too much work?

I hear this ALL the time.

That's exactly why I created Waggin' Meals - fresh, human-grade dog food delivered to your door. No cooking, no guessing, no stress.

Here's what makes us different:

🥩 Human-grade ingredients (seriously, I eat this stuff to test it)
🔬 Scientifically formulated for complete nutrition
❄️ Arrives frozen, lasts weeks in your freezer
⏱️ Takes 60 seconds to serve (just thaw & serve)

[SHOP OUR MOST POPULAR MEALS]

And here's a secret: This week only, newsletter subscribers get 15% off their first order.

Use code: PACKFAMILY15

[BROWSE ALL MEALS]

Still have questions? Just reply to this email.

To your pup's health,
Christie

P.S. Every meal comes with a "picky eater guarantee." If your dog doesn't love it, you get a full refund. No questions asked.
```

#### Step 6: Add Email 4 - Special Offer (Day 14)

1. Add **Send Email** action
2. Configure:
   - **Name**: First Purchase Incentive
   - **Subject**: {{contact.first_name}}, Your Dog Deserves This (15% Off Ends Tonight!)
   - **Delay**: 7 days after previous step

**Email Template**:
```
Hi {{contact.first_name}},

I'm reaching out because your special 15% discount expires tonight at midnight.

Here's the thing...

I know changing your dog's food feels like a big decision. You're worried about:
- Will they actually eat it?
- Is it really worth the money?
- What if it upsets their stomach?

I get it. That's why every order comes with:

✅ 100% satisfaction guarantee
✅ Gradual transition guide
✅ Direct access to me for questions
✅ 15% off your first order (TODAY ONLY)

[CLAIM YOUR 15% DISCOUNT]

Over 520 dogs are thriving on Waggin' Meals right now. Your pup could be next.

The discount expires in a few hours. Don't let your dog miss out on better nutrition.

[SHOP NOW - 15% OFF]

Wagging tails,
Christie

P.S. Still unsure? Book a free consultation and let's chat about your dog's specific needs. [BOOK HERE]
```

#### Step 7: Add Email 5 - Consultation Offer (Day 21)

1. Add **Send Email** action
2. Configure:
   - **Name**: Free Consultation Offer
   - **Subject**: Let's Talk About Your Dog's Nutrition (It's Free!)
   - **Delay**: 7 days after previous step

**Email Template**:
```
Hi {{contact.first_name}},

Over the past 3 weeks, I've shared:
✓ Free feeding guides
✓ Success stories
✓ Product information
✓ Special discounts

But I realize... maybe none of that answered YOUR specific questions about YOUR dog.

So let's change that.

I'm offering you a FREE 30-minute nutrition consultation - no catch, no pressure, just answers.

Here's what we'll cover:
- Your dog's current diet (what's working, what's not)
- Health concerns or goals
- Custom feeding recommendations
- Specific product recommendations (if appropriate)

[BOOK YOUR FREE CONSULTATION]

Spots are limited because I personally do every consultation. Book yours before they're gone.

Looking forward to meeting you (and hearing about your pup!),

Christie Willett, M.A., M.S.
Integrative Animal Nutritionist

P.S. Can't make a consultation? Just reply to this email with questions. I personally read and respond to every message.
```

#### Step 8: Add Final Tag (Optional)

1. Add **Add/Remove Tag** action
2. Configure:
   - **Action**: Add Tag
   - **Tag**: `nurture-sequence-completed`
   - **Delay**: 0 days

This helps you track who completed the entire sequence.

### Save & Activate Workflow

1. Click **Save** (top right)
2. Click **Publish** to activate
3. Test with a dummy contact first!

---

## Consultation Workflows

### Already Configured ✅

You already have consultation workflows set up for:

1. **Free Consultation Follow-Up** (triggered by `free-consultation` tag)
2. **Paid Consultation Onboarding** (triggered by `paid-consultation-395` tag)

These are working and syncing contacts to GHL automatically.

**No action needed** - these continue to work as-is!

---

## Testing Checklist

### Test 1: Newsletter Signup

**Steps**:
1. Open your website in incognito mode
2. Scroll to footer
3. Enter test name & email (use unique email like `test1@yourdomain.com`)
4. Click Subscribe

**Expected Results**:
- ✅ Success message appears
- ✅ Contact appears in GHL within 2 minutes
- ✅ Contact has tags: `newsletter-footer`, `lead-nurture`, `email-marketing`
- ✅ Newsletter nurture workflow triggers (check workflow log)
- ✅ Welcome email sends (check email inbox)

**If It Fails**:
- Check Netlify environment variables are set correctly
- Check GHL API key is valid
- Check contact spam/error logs in Supabase `newsletter_subscribers` table

### Test 2: Newsletter Page Section

**Steps**:
1. Add `<Newsletter />` component to a page
2. Fill out the form with test email
3. Submit

**Expected Results**:
- ✅ Contact created in GHL
- ✅ Tags: `newsletter-page`, `lead-nurture`, `email-marketing`
- ✅ Workflow triggers

### Test 3: Tag Accumulation

**Steps**:
1. Sign up for newsletter with `test-accumulation@yourdomain.com`
2. Wait for contact to appear in GHL
3. Submit free consultation form with SAME email
4. Check GHL contact

**Expected Results**:
- ✅ SAME contact (not duplicate)
- ✅ Has ALL tags from both forms:
  - `newsletter-footer`
  - `lead-nurture`
  - `email-marketing`
  - `free-consultation`
  - `contact-expert-form`

This proves tag accumulation is working!

---

## Troubleshooting

### Contact Not Appearing in GHL

**Check**:
1. Environment variables set in Netlify?
2. Triggered new deploy after setting variables?
3. GHL API key valid and active?
4. Location ID correct?

**Debug**:
- Check Supabase table (`newsletter_subscribers`)
- Look for `ghl_sync_error` column
- Error message will tell you what went wrong

### Tags Not Applying

**Check**:
1. Tags created in GHL exactly as specified? (case-sensitive!)
2. Tag names match exactly (no typos)?

**Debug**:
- Check GHL contact → Tags tab
- Check `ghl_tags` column in Supabase
- Compare actual vs expected

### Workflow Not Triggering

**Check**:
1. Workflow published (not draft)?
2. Trigger tag matches exactly?
3. Workflow has no errors in GHL?

**Debug**:
- Go to GHL workflow → History tab
- Check if trigger was recognized
- Check workflow logs for errors

### Duplicate Contacts

**This should NOT happen** - the system checks by email first.

**If it does**:
- Check if emails have slight differences (trailing spaces, caps)
- Check GHL settings for duplicate detection
- May need to merge manually in GHL

---

## Success Metrics to Track

### Week 1 Benchmarks

After newsletter is live for 1 week, check:

- **Newsletter signups**: How many new subscribers?
- **GHL sync rate**: What % successfully synced? (Target: 98%+)
- **Workflow trigger rate**: Are all signups triggering workflow? (Target: 100%)
- **Email open rate**: How many opened welcome email? (Target: 40-60%)

### Month 1 Benchmarks

After 30 days:

- **Conversion rate**: Newsletter → Free consultation (Target: 5-10%)
- **Conversion rate**: Newsletter → Customer (Target: 10-15%)
- **Email engagement**: Are people opening emails? (Target: 35-50% open rate)
- **Unsubscribe rate**: How many opt out? (Target: <2%)

---

## Next Steps

### Immediate (Do This Now)

1. ✅ Add environment variables to Netlify
2. ✅ Create 4 newsletter tags in GHL
3. ✅ Create 5 custom fields in GHL
4. ✅ Build newsletter nurture workflow (30-45 minutes)
5. ✅ Test newsletter signup (5 minutes)
6. ✅ Test tag accumulation (10 minutes)

### Within 30 Days

1. Monitor newsletter signups daily
2. Review workflow performance weekly
3. Adjust email copy based on open/click rates
4. A/B test subject lines

### Future Enhancements (When Ready)

When order and subscription integrations are added:

1. Create customer tags (4 tags)
2. Create subscription tags (6 tags)
3. Build first order workflow
4. Build subscription lifecycle workflows
5. Build failed payment recovery workflow

---

## Support & Questions

If you run into issues:

1. **Check this guide first** - most answers are here
2. **Check Supabase logs** - `ghl_sync_error` column shows errors
3. **Check GHL workflow history** - shows what triggered and what didn't
4. **Ask for help** - provide specific error messages

---

**Setup completed? Check off your progress:**

- [ ] Environment variables added to Netlify
- [ ] New deploy triggered
- [ ] Newsletter tags created in GHL (4 tags)
- [ ] Custom fields created in GHL (5 fields)
- [ ] Newsletter nurture workflow built and published
- [ ] Test signup completed successfully
- [ ] Test contact appeared in GHL with correct tags
- [ ] Test email received
- [ ] Tag accumulation tested and working

**All checked?** 🎉 **Your GHL integration is LIVE!**

---

**Document Version**: 1.0
**Last Updated**: November 7, 2025
**Next Review**: After 30 days of operation
