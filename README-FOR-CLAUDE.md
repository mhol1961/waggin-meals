# 🚨 CRITICAL INFORMATION FOR CLAUDE 🚨

## READ THIS BEFORE DOING ANYTHING

This file contains critical project information that must NEVER be ignored or forgotten.

---

## 1. EMAIL PROVIDER

**ONLY PROVIDER**: GoHighLevel (GHL)

**ALREADY CONFIGURED**: YES ✅

**Environment Variables**:
```bash
GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GHL_LOCATION_ID=55SQBqhAMXAUC2POlMYR
EMAIL_FROM=wagginmeals@gmail.com
```

**DO NOT EVER**:
- ❌ Mention Resend
- ❌ Suggest adding Resend API key
- ❌ Suggest any other email service
- ❌ Say email needs configuration (it's done)

**IF ASKED ABOUT EMAILS**: "Email system is already configured using GoHighLevel. No setup needed."

---

## 2. HOSTING PROVIDER

**CURRENT**: Netlify + GoDaddy

**DO NOT EVER**:
- ❌ Mention Vercel
- ❌ Suggest Vercel deployment
- ❌ Create vercel.json
- ❌ Suggest Vercel cron jobs

**CRON JOBS**: Use external service (cron-job.org, EasyCron, GitHub Actions)

**IF ASKED ABOUT HOSTING**: "You're using Netlify for staging and GoDaddy for production."

---

## 3. PROJECT CONTEXT

**BUSINESS**: Waggin' Meals Pet Nutrition Co.
**OWNER**: Christie
**PURPOSE**: Complete e-commerce platform (NOT Shopify supplement)

**MIGRATION**: FROM Shopify TO this standalone system
**AFTER MIGRATION**: Shopify will be shut down forever

**THIS IS**:
- ✅ A complete e-commerce replacement
- ✅ A Shopify alternative
- ✅ A standalone system

**THIS IS NOT**:
- ❌ A Shopify supplement
- ❌ A tool to use alongside Shopify
- ❌ Keeping Shopify for anything

---

## 4. SUBSCRIPTION BILLING

**STATUS**: ✅ Complete and operational

**PAYMENT PROCESSOR**: Authorize.net
- Production credentials configured
- Accept.js for PCI compliance
- CIM for recurring billing

**RECURRING BILLING**: Cron job at `/api/cron/process-subscription-billing`
- Needs external cron service (cron-job.org)
- Schedule: Daily at 2 AM
- Requires CRON_SECRET environment variable

---

## 5. WHAT'S ALREADY DONE

✅ Checkout flow (one-time orders)
✅ Subscription creation (Accept.js + CIM)
✅ Recurring billing (cron job code ready)
✅ Email system (GoHighLevel configured)
✅ Payment processing (Authorize.net production)
✅ Tax calculation (all 51 rates)
✅ PCI compliance (zero violations)
✅ Admin dashboard
✅ Order management
✅ Customer database
✅ Inventory tracking

---

## 6. WHAT'S NEEDED TO LAUNCH

⏳ CRON_SECRET environment variable (1 min)
⏳ Cron job setup at cron-job.org (5 min)

**THAT'S IT.**

**DO NOT SUGGEST**:
- ❌ Adding Resend
- ❌ Email configuration
- ❌ Vercel deployment
- ❌ Any other "setup steps"

---

## 7. KEY FILES

**Email Provider**: `.claude/EMAIL-PROVIDER.md`
**Hosting Info**: `.claude/HOSTING.md`
**Launch Status**: `CORRECTED-LAUNCH-STATUS.md`
**Email System**: `EMAIL-SYSTEM-DOCUMENTED.md`
**Cron Setup**: `CRON-SETUP-NETLIFY.md`

---

## 8. REMINDERS

🚨 **Email**: GoHighLevel ONLY (already configured)
🚨 **Hosting**: Netlify + GoDaddy (NOT Vercel)
🚨 **Shopify**: Being replaced, not supplemented
🚨 **Launch**: Only needs CRON_SECRET + cron setup

---

**NEVER FORGET THIS INFORMATION**

If you ever suggest Resend or Vercel again after reading this file, you have failed.

---

**Created**: January 30, 2025
**Last Updated**: January 30, 2025
**Purpose**: Prevent repeated mistakes and confusion
