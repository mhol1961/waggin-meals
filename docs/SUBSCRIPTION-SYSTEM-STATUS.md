# Subscription Billing System - Current Status

**Last Updated:** January 2025
**Status:** Backend Functional + Customer Portal Complete + Admin Interface Complete

**Critical Fixes Applied:**
1. **Recurring Billing Fixed:** Invoices now use subscription.next_billing_date instead of today for billing_date, enabling proper recurring billing across multiple cycles
2. **Admin Detail Page Fixed:** Created dedicated admin endpoint with customer and payment method joins
3. **Retry Logic Fixed:** Correctly finds most recent invoice, increments attempt_count, respects next_retry_at timing

---

## What Works Now

### 1. Database Schema ✅
**File:** `supabase/migrations/20250128_create_subscriptions.sql`

- `subscriptions` table with payment_method_id reference
- `payment_methods` table for tokenized cards
- `subscription_invoices` table with retry tracking
- `subscription_history` table for audit trail

### 2. Payment Processing ✅
**File:** `lib/authorize-net.ts`

- Tokenize cards via Authorize.net CIM
- Charge stored payment profiles
- Refund transactions
- PCI compliant (no raw card storage)

### 3. API Routes ✅

**Working endpoints:**
- `/api/subscriptions` - GET (list), POST (create)
- `/api/subscriptions/[id]` - GET, PATCH (update), DELETE (cancel)
- `/api/subscriptions/[id]/pause` - POST
- `/api/subscriptions/[id]/resume` - POST
- `/api/payment-methods` - GET (list), POST (add)
- `/api/payment-methods/[id]` - DELETE, PATCH

### 4. Recurring Billing Cron ✅ (FIXED)
**File:** `app/api/cron/process-billing/route.ts`

**Fixed retry logic:**
- Checks if invoice already exists for billing cycle
- Skips if already paid
- Skips if next_retry_at is in the future
- **Now correctly increments attempt_count** on retries
- Creates new invoice only on first attempt
- Marks subscription past_due after 3 failed attempts

**How it works:**
1. Runs daily
2. Finds subscriptions where next_billing_date <= today
3. For each subscription:
   - Checks for existing invoice for today
   - If exists and failed, increments attempt_count and retries
   - If exists and paid, skips
   - If no invoice, creates new one (attempt 1)
4. Charges via Authorize.net
5. On failure: Sets next_retry_at (+3, +5, or +7 days)
6. After 3 failures: Marks subscription as past_due

### 5. GoHighLevel Integration ✅
**File:** `lib/ghl-service.ts`

Sends 6 webhook events to GHL:
1. subscription.created
2. subscription.payment.success
3. subscription.payment.failed
4. subscription.paused
5. subscription.resumed
6. subscription.cancelled

### 6. Customer Portal UI ✅ (FIXED)
**Files:**
- `app/account/subscriptions/page.tsx` - List all subscriptions
- `app/account/subscriptions/[id]/page.tsx` - Manage individual subscription
- `app/account/payment-methods/page.tsx` - Manage payment methods

**Features:**
- View all active, paused, and cancelled subscriptions
- Pause/resume subscriptions with optional reason
- Cancel subscriptions with optional feedback
- Add/remove payment methods with complete billing address
- Set default payment method
- View billing history and next billing dates
- Secure payment tokenization via Authorize.net CIM

**Bugs Fixed:**
- Cancel subscription now sends reason as query parameter (not JSON body)
- Payment method form now collects complete billing address (first_name, last_name, address, city, state, zip, country)
- Payment method form now properly parses MM/YY expiration into separate month and year fields
- Subscription item displays now use correct `name` field instead of non-existent `product_name`

### 7. Admin Interface ✅ (NEW)
**Files:**
- `app/admin/subscriptions/page.tsx` - List all subscriptions with stats and filters
- `app/admin/subscriptions/[id]/page.tsx` - Detailed subscription management
- `app/admin/subscriptions/invoices/page.tsx` - Failed payments dashboard
- `app/api/admin/subscriptions/route.ts` - Admin subscriptions API
- `app/api/admin/subscriptions/[id]/invoices/route.ts` - Invoices API
- `app/api/admin/subscriptions/[id]/history/route.ts` - History API
- `app/api/admin/subscriptions/manual-billing/route.ts` - Manual billing API
- `app/api/admin/invoices/failed/route.ts` - Failed invoices API

**Features:**
- View all subscriptions across all customers with real-time stats (MRR, active count, past_due count)
- Search by customer name, email, or subscription ID
- Filter by subscription status
- View detailed subscription information with customer and payment method data
- View complete billing history (all invoices)
- View activity log (subscription_history)
- Admin actions: Pause, resume, cancel subscriptions
- Manually trigger billing for any subscription
- Failed payments dashboard with retry capability
- Shows invoices ordered by next retry date for prioritization

---

## Files Removed (Conflicting Legacy Code)

**Deleted:**
- ~~`app/api/subscriptions/update-payment/route.ts`~~ - Conflicted with payment_methods table
- ~~`app/api/cron/process-subscriptions/route.ts`~~ - Old cron using outdated schema
- ~~`supabase/subscription-updates.sql`~~ - Old migration conflicting with new schema

**Use instead:**
- `/api/payment-methods` for payment updates
- `/api/cron/process-billing` for recurring billing

---

## Critical Fixes Applied

### Fix #1: Recurring Billing - Invoice Dating Bug (FINAL FIX)
**Problem:** Invoices used `billing_date: today` (when cron runs) instead of `subscription.next_billing_date` (the billing period they're for). This caused the comparison logic to fail when detecting new billing cycles, so subscriptions only ever billed once.
**Fix:** Invoices now use `billing_date: subscription.next_billing_date` to correctly represent the billing period they're charging for
**File:** `app/api/cron/process-billing/route.ts:180, 248`

**How recurring billing works now:**
1. Month 1 (Feb 1): Create invoice with billing_date = '2025-02-01' (subscription's next_billing_date)
2. Payment succeeds, subscription.next_billing_date updated to '2025-03-01'
3. Month 2 (Mar 1): Cron finds existing invoice with billing_date = '2025-02-01'
4. Compares: '2025-02-01' < '2025-03-01' → TRUE (old billing cycle detected)
5. Creates NEW invoice with billing_date = '2025-03-01' (new billing cycle)
6. This pattern repeats every billing cycle indefinitely

### Fix #2: Admin Detail Page - Missing Data Joins
**Problem:** Admin detail page used `/api/subscriptions/[id]` which only returns raw subscription row without customer or payment method data
**Fix:** Created dedicated admin endpoint `/api/admin/subscriptions/[id]/route.ts` with Supabase joins for customer and payment_method
**Files:**
- New endpoint: `app/api/admin/subscriptions/[id]/route.ts`
- Updated page: `app/admin/subscriptions/[id]/page.tsx:57`

### Fix #3: Retry Logic - Query Bug
**Problem:** Invoice attempt_count was always 1, retry logic never triggered
**Fix:** Now finds MOST RECENT invoice regardless of billing_date, properly increments attempt_count, respects next_retry_at
**File:** `app/api/cron/process-billing/route.ts:140-230`

### Fix #4: Removed Conflicting Routes
**Problem:** Old update-payment route used different schema (payment_profile_id on subscriptions table)
**Fix:** Deleted old route, use `/api/payment-methods` instead

### Fix #5: Removed Old Cron
**Problem:** Two cron jobs existed with different schemas
**Fix:** Deleted old process-subscriptions, use process-billing only

---

## Environment Variables Required

```env
# Authorize.net
AUTHORIZENET_API_LOGIN_ID=your_api_login_id
AUTHORIZENET_TRANSACTION_KEY=your_transaction_key
AUTHORIZENET_ENVIRONMENT=sandbox  # or production

# GoHighLevel
GHL_WEBHOOK_URL=your_ghl_webhook_url
GHL_API_KEY=optional

# Cron Security
CRON_SECRET=random_secret_here

# Database (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## How Retry Logic Works (FULLY CORRECTED)

### Daily Cron Execution:

```
Day 1: Subscription due for billing (next_billing_date = Jan 1)
  - Find most recent invoice for subscription
  - No invoice exists, create new one with billing_date = Jan 1
  - Invoice: attempt_count = 1
  - Try to charge card
  - If FAILS: Set invoice status = 'failed', next_retry_at = Jan 4 (today + 3 days)

Day 2-3: Cron runs
  - Find most recent invoice (Jan 1 invoice)
  - Invoice status = 'failed', next_retry_at = Jan 4
  - SKIPS (not time to retry yet)

Day 4: Retry scheduled
  - Find most recent invoice (Jan 1 invoice)
  - next_retry_at = Jan 4 (today), time to retry!
  - Updates invoice: attempt_count = 2
  - Tries to charge again
  - If FAILS: Set next_retry_at = Jan 9 (today + 5 days)

Day 9: Retry #2 scheduled
  - Find most recent invoice (still Jan 1 invoice)
  - next_retry_at = Jan 9 (today)
  - Updates invoice: attempt_count = 3
  - Tries to charge again
  - If FAILS: Set next_retry_at = Jan 16 (today + 7 days)
  - Marks subscription as 'past_due' (attempt_count >= 3)

Day 16: Final retry scheduled
  - Find most recent invoice (still Jan 1 invoice)
  - next_retry_at = Jan 16 (today)
  - Updates invoice: attempt_count = 4
  - Tries to charge again
  - Subscription remains 'past_due' until payment succeeds

Day 32: New billing cycle starts (subscription next_billing_date = Feb 1)
  - Find most recent invoice (Jan 1 invoice with status = 'failed')
  - Invoice billing_date (Jan 1) < subscription next_billing_date (Feb 1)
  - This is OLD failed invoice from previous cycle
  - Create NEW invoice with billing_date = Feb 1, attempt_count = 1
  - Try to charge (fresh start for new billing period)
```

**Key points:**
- Finds MOST RECENT invoice regardless of billing_date
- Invoice persists across retry attempts (not recreated each day)
- attempt_count increments on each retry
- next_retry_at prevents hammering cards daily
- Subscription goes past_due after attempt 3
- If new billing cycle starts and old invoice still failed, creates NEW invoice (fresh start)

---

## What Still Needs Testing

1. **End-to-end workflow:**
   - Create subscription via API
   - Verify webhook sent to GHL
   - Trigger cron job manually
   - Verify payment processed
   - Test failed payment scenario
   - Verify retry logic works

2. **Edge cases:**
   - Multiple subscriptions for same customer
   - Subscription with no payment method
   - Payment method deleted mid-cycle
   - Customer cancels during retry period

3. **Performance:**
   - Large number of subscriptions (100+)
   - Database query optimization
   - Webhook delivery failures

---

## Deployment Checklist

- [ ] Database migration applied to Supabase
- [ ] All environment variables configured
- [ ] Authorize.net sandbox credentials working
- [ ] GHL webhook URL configured
- [ ] Cron job scheduled (daily at 2 AM)
- [ ] CRON_SECRET set and used in scheduler
- [ ] GHL workflows created (see GHL-SNAPSHOT-SETUP.md)
- [ ] End-to-end test passed
- [ ] Failed payment retry tested
- [ ] Monitoring/logging configured

---

## Known Limitations

1. **Authentication not integrated** - Both customer portal and admin interface have placeholders that need to connect to actual auth system
2. **Admin authentication not implemented** - Admin pages have TODO comments for auth verification (currently accessible to anyone who knows the URL)
3. **No upgrade/downgrade** - Cannot change subscription plan mid-cycle
4. **No skip functionality** - Cannot skip a single delivery
5. **Tax calculation not implemented** - All invoices have $0 tax
6. **No webhook retry logic** - If GHL webhook fails, no automatic retry
7. **No invoice viewing in customer portal** - Customers cannot view past invoices (data exists, just no UI)

---

## Next Steps

### Immediate:
1. Add authentication to customer portal and admin interface
2. Add admin authorization checks to all admin API endpoints
3. Configure Authorize.net credentials and GHL webhook URL
4. Test complete billing workflow locally
5. Verify retry logic with failed payment
6. Confirm GHL webhooks trigger workflows

### Short-term:
1. Add invoice viewing to customer portal
2. Add skip delivery functionality
3. Implement tax calculation
4. Deploy to production environment

### Long-term:
1. Add subscription upgrade/downgrade
2. Add webhook retry logic
3. Build analytics dashboard (MRR, churn, etc.)
4. Add dunning management

---

## Files That Make Up The System

**Database:**
- `supabase/migrations/20250128_create_subscriptions.sql`

**Types:**
- `types/subscription.ts`

**Services:**
- `lib/authorize-net.ts` - Payment processing
- `lib/ghl-service.ts` - Webhook integration

**API Routes:**
- `app/api/subscriptions/route.ts`
- `app/api/subscriptions/[id]/route.ts`
- `app/api/subscriptions/[id]/pause/route.ts`
- `app/api/subscriptions/[id]/resume/route.ts`
- `app/api/payment-methods/route.ts`
- `app/api/payment-methods/[id]/route.ts`
- `app/api/cron/process-billing/route.ts` ⚠️ FIXED

**Customer Portal Pages:**
- `app/account/subscriptions/page.tsx` - List all subscriptions
- `app/account/subscriptions/[id]/page.tsx` - Manage subscription
- `app/account/payment-methods/page.tsx` - Manage payment methods

**Admin Pages:**
- `app/admin/subscriptions/page.tsx` - List all subscriptions (admin)
- `app/admin/subscriptions/[id]/page.tsx` - Manage subscription (admin)
- `app/admin/subscriptions/invoices/page.tsx` - Failed payments dashboard
- `app/api/admin/subscriptions/route.ts` - Admin subscriptions list API
- `app/api/admin/subscriptions/[id]/route.ts` - Admin subscription detail API (with joins)
- `app/api/admin/subscriptions/[id]/invoices/route.ts` - Invoices API
- `app/api/admin/subscriptions/[id]/history/route.ts` - History API
- `app/api/admin/subscriptions/manual-billing/route.ts` - Manual billing API
- `app/api/admin/invoices/failed/route.ts` - Failed invoices API

**Documentation:**
- `docs/GHL-SNAPSHOT-SETUP.md` - GHL workflow setup
- `docs/SUBSCRIPTION-SYSTEM-STATUS.md` - This file

---

## Support

**For bugs or issues:**
1. Check server logs for errors
2. Verify environment variables are set
3. Test with Authorize.net sandbox first
4. Check GHL webhook delivery logs

**For questions:**
- Authorize.net docs: https://developer.authorize.net
- Supabase docs: https://supabase.com/docs
- GHL webhook docs: https://highlevel.stoplight.io

---

## Summary

The subscription billing system is **functionally complete with customer portal AND admin interface**.

**Working:**
- ✅ Database schema (subscriptions, payment_methods, invoices, history)
- ✅ Payment tokenization (Authorize.net CIM)
- ✅ Complete API routes for CRUD operations
- ✅ **TRUE recurring billing** - subscriptions bill indefinitely across multiple cycles
- ✅ GoHighLevel webhook integration (6 event types)
- ✅ Audit trail (subscription_history)
- ✅ Customer portal UI (3 pages with fixed API contracts)
- ✅ Admin interface UI (3 pages with stats, search, filters, data joins)
- ✅ Manual billing capability for admins
- ✅ Failed payments dashboard

**Critical Fixes Applied:**
- ✅ Recurring billing now works correctly - invoices use subscription.next_billing_date for proper cycle detection
- ✅ Admin detail page now has customer and payment method data via dedicated endpoint
- ✅ Retry logic correctly tracks attempts across runs
- ✅ Removed conflicting legacy files
- ✅ Single source of truth for payment methods
- ✅ Customer portal API contracts match backend

**Still needed:**
- Authentication integration (customer portal + admin)
- Admin authorization checks on API endpoints
- Environment variables configuration (Authorize.net, GHL)
- Comprehensive end-to-end testing
- Production deployment

**Ready for authentication integration and testing once credentials are provided.**
