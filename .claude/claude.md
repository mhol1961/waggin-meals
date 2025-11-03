# 🚨🚨🚨 READ THIS FIRST - DO NOT FORGET 🚨🚨🚨

## 🛑🛑🛑 CRITICAL GIT COMMIT RULES 🛑🛑🛑

### ❌ NEVER COMMIT TO GIT WITHOUT EXPLICIT USER PERMISSION ❌

**ABSOLUTE RULES:**
1. **DO NOT run `git commit` unless the user explicitly tells you to commit**
2. **DO NOT run `git push` unless the user explicitly tells you to push**
3. **ALWAYS verify builds work locally BEFORE committing** (`npm run build` must succeed)
4. **User is near Netlify build limit** - every commit triggers a build and costs money
5. **Builds often fail first time** - must test locally to avoid wasting builds
6. **WAIT for user approval** even if changes look perfect

**CORRECT WORKFLOW:**
1. Make code changes
2. Run `npm run build` locally to verify
3. Fix any errors
4. Run `npm run build` again until it passes
5. **WAIT for user to say "commit this"**
6. Only then: `git add` and `git commit`
7. **WAIT for user to say "push this"**
8. Only then: `git push`

**If you commit without permission, you waste Netlify builds and cost money.**

---

## 🚨🚨🚨 CRITICAL EMAIL SYSTEM RULES 🚨🚨🚨

### ❌ NEVER USE RESEND - ONLY GOHIGHLEVEL ❌

**ABSOLUTE RULES:**
1. **CHRISTIE WILL NEVER EVER USE RESEND FOR EMAILS**
2. **ALL EMAILS ARE SENT VIA GOHIGHLEVEL WORKFLOWS**
3. **EMAIL TRIGGERS: GHL form submissions, webhooks, or automation workflows**
4. **DO NOT create email sending code - use GHL webhooks instead**
5. **DO NOT call /api/send-email - trigger GHL workflows instead**
6. **Christie has GHL workflows set up - we just need to trigger them**

**HOW EMAILS WORK:**
- Form submission → GHL catches it → GHL sends emails via workflows
- Or: API endpoint → Webhook to GHL → GHL automation triggers → Emails sent
- Or: Database trigger → Webhook to GHL → Email workflow executes

**NEVER suggest Resend, SendGrid, Mailgun, or any other email service. ONLY GoHighLevel.**

---

## ⚠️⚠️⚠️ THIS IS A COMPLETE, STANDALONE E-COMMERCE WEBSITE ⚠️⚠️⚠️

### ABSOLUTE RULES - NEVER BREAK THESE:

1. **THIS IS A MIGRATION FROM SHOPIFY TO A COMPLETE NEW E-COMMERCE PLATFORM**
2. **WE ARE MIGRATING ALL CUSTOMERS, SUBSCRIBERS, PRODUCTS, AND DATA FROM SHOPIFY**
3. **CHRISTIE HATES SHOPIFY - WE'RE MOVING EVERYTHING TO THIS NEW SYSTEM**
4. **THIS NEW SYSTEM MUST HAVE EVERY E-COMMERCE FEATURE SHOPIFY HAD**
5. **AFTER MIGRATION IS COMPLETE, SHOPIFY WILL BE SHUT DOWN FOREVER**
6. **NEVER SUGGEST KEEPING SHOPIFY OR USING IT ALONGSIDE THIS SYSTEM**

**We're migrating FROM Shopify TO this new complete e-commerce platform.**
**After all customers/subscribers are migrated, Shopify gets shut down and never used again.**

---

## ⚠️ THIS IS A COMPLETE SHOPIFY REPLACEMENT - NOT A MIGRATION

**CHRISTIE HATES SHOPIFY AND WILL NEVER USE IT FOR E-COMMERCE.**

This is a **BRAND NEW, STANDALONE E-COMMERCE WEBSITE** that must have:
- ✅ **ALL e-commerce features** (product management, orders, customers, inventory)
- ✅ **FULL subscription management** (recurring billing, auto-charge, failed payments)
- ✅ **COMPLETE admin dashboard** (manage everything - products, orders, customers, subscriptions)
- ✅ **ALL payment processing** (Authorize.net with CIM for tokenization)
- ✅ **Marketing automation** (GoHighLevel for CRM, email, SMS, abandoned cart)
- ✅ **Customer portal** (self-service subscription management)
- ✅ **Everything Shopify does but BETTER and under Christie's control**

**The Shopify exports were to MIGRATE AWAY from Shopify, NOT to keep using it.**

**NEVER suggest keeping Shopify or using it alongside this system. This system IS the complete replacement.**

---

## Project: Waggin' Meals Complete E-Commerce Platform

**Business:** Premium dog nutrition products (fresh food, meal toppers, supplements)
**Owner:** Christie
**Current Situation:** Migrating FROM Shopify (which she hates)
**Goal:** Complete, standalone e-commerce platform with better control and automation

---

## What We're Building (COMPLETE E-COMMERCE SYSTEM):

### Core E-Commerce:
- ✅ Product catalog management
- ✅ Inventory tracking
- ✅ Shopping cart & checkout
- ✅ Order management & fulfillment
- ✅ Customer database
- ✅ Payment processing (Authorize.net)
- ✅ Discount/promo codes
- ✅ Tax calculation
- ✅ Shipping management

### Subscription System (CRITICAL):
- ✅ Recurring billing automation
- ✅ Subscription management dashboard
- ✅ Customer self-service portal
- ✅ Payment tokenization (Authorize.net CIM)
- ✅ Failed payment recovery
- ✅ Subscription pause/resume/cancel
- ✅ Flexible billing frequencies (weekly, bi-weekly, monthly)

### Marketing & Automation:
- ✅ GoHighLevel CRM integration
- ✅ Email marketing automation
- ✅ Abandoned cart recovery
- ✅ Customer segmentation & tagging
- ✅ Newsletter management
- ✅ SMS campaigns (optional)
- ✅ Review requests
- ✅ Win-back campaigns

### Admin Features:
- ✅ Complete admin dashboard at /admin
- ✅ Product management
- ✅ Order tracking & fulfillment
- ✅ Customer management
- ✅ Subscription management
- ✅ Analytics & reporting
- ✅ Discount code management
- ✅ Content management (blog, videos, testimonials)

---

## Tech Stack:

**Frontend:** Next.js 15 (App Router)
**Database:** Supabase (PostgreSQL)
**Payment Processing:** Authorize.net (with CIM for recurring)
**CRM/Marketing:** GoHighLevel
**Email:** Resend (transactional) + GHL (marketing)
**Hosting:** Vercel

---

## Current Status:

### ✅ Completed:
- Website structure & design
- Product pages & catalog
- Blog system with admin
- Contact form
- Newsletter system
- Order management system
- Order detail pages
- Email notification system (order confirmations, shipping)
- Discount code system
- Admin navigation & dashboard

### 🔄 In Progress:
- Subscriber data analysis (116 subscribers from Shopify export)
- Customer portal for payment updates
- Subscription billing automation
- GoHighLevel integration

### ⏳ Next Up:
- Authorize.net CIM integration
- Recurring billing cron job
- Failed payment handling
- Product variants
- Shipping calculator
- Collections management

---

## Critical Data:

**Active Subscribers:** ~40-50 people
**Newsletter Contacts:** ~55-65 people
**Monthly Recurring Revenue:** $3,000-5,000/month
**Migration Source:** Shopify (but NOT keeping Shopify)

**Files:**
- Customer export: `/shopify-files/customers_export.csv`
- Subscriber list: `/shopify-files/shopify-subscribers.csv`
- Orders: `/shopify-files/orders_export_1.csv`
- Products: `/shopify-files/products_export_1.csv`

---

## Important Context:

Christie wants:
- ✅ Full control over her e-commerce platform
- ✅ Better subscription management than Shopify
- ✅ Integrated CRM & marketing automation
- ✅ No monthly Shopify fees
- ✅ Custom features tailored to her business
- ✅ Direct database access
- ✅ Ability to scale without platform limitations

Christie does NOT want:
- ❌ Shopify (ever again)
- ❌ Platform limitations
- ❌ Monthly subscription app fees
- ❌ Vendor lock-in
- ❌ Limited customization

---

## Project Goal:

Build a COMPLETE, STANDALONE e-commerce platform that:
1. Replaces Shopify entirely
2. Manages all products, orders, and customers
3. Handles recurring subscriptions automatically
4. Integrates marketing automation (GHL)
5. Provides excellent admin UX for Christie
6. Scales as business grows
7. Costs less than Shopify + apps
8. Gives Christie full control

---

## Remember:

**THIS IS NOT A SHOPIFY SUPPLEMENT. THIS IS A SHOPIFY REPLACEMENT.**

When Christie asks for e-commerce features, she needs FULL features - not "keep Shopify for that."

Build it right. Build it complete. Build it better than Shopify.

🐾 **Waggin' Meals deserves better than Shopify!** 🐾
