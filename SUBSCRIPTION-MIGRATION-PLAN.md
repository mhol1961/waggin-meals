# 🚨 CRITICAL: Subscription Migration & Management Plan

## Overview
Christie has ~100 existing subscribers who need to be migrated to the new system. They must re-enter payment information to continue automatic billing. **This system must be flawless - it's the revenue backbone.**

---

## Architecture Components

### 1. Customer Portal (Secure Self-Service)
**URL:** `https://wagginmeals.com/account/[secure-token]`

**Features:**
- ✅ View subscription details (products, frequency, next billing)
- ✅ Update payment method (Authorize.net CIM integration)
- ✅ Change delivery frequency (weekly, bi-weekly, monthly)
- ✅ Modify subscription items (add/remove products)
- ✅ Update shipping address
- ✅ Pause subscription (up to 3 months)
- ✅ Cancel subscription (with confirmation)
- ✅ View order history
- ✅ Download invoices

**Security:**
- Unique secure token per customer (UUID-based)
- Token expires after 90 days of inactivity
- No password required for re-authorization (reduces friction)
- HTTPS only
- Rate limiting

---

### 2. Payment Tokenization (Authorize.net CIM)

**Why CIM?**
- PCI compliant (we don't store card numbers)
- Secure payment tokens
- Supports recurring billing
- Authorized.net already configured

**Implementation:**
- Create Customer Profile in Authorize.net
- Store Payment Profile (tokenized card)
- Link token to subscription in our database
- Use token for recurring charges

**Flow:**
```
Customer enters card → Authorize.net CIM → Returns token → Store token in DB → Use for billing
```

**Security:**
- Card data never touches our server
- Authorize.net iframe for PCI compliance
- Tokens can't be reverse-engineered to get card numbers

---

### 3. Subscriber Import System

**Admin Interface:** `/admin/subscriptions/import`

**Process:**
1. Upload CSV with existing subscriber data
2. System validates data
3. Preview import (show what will be created)
4. Execute import
5. Generate unique secure links for each subscriber
6. Export links for email campaign

**CSV Format Required:**
```csv
email,first_name,last_name,phone,dog_name,frequency,products,price,next_billing_date,notes
jane@example.com,Jane,Smith,555-1234,Max,monthly,"Beef Bowl (2), Chicken Board (1)",89.97,2024-02-15,Ships 1st of month
```

**Import Actions:**
- Create/update customer record
- Create subscription record (status: "pending_payment")
- Generate secure token for customer portal
- Create customer in Authorize.net CIM
- Log import for tracking

---

### 4. Re-Authorization Campaign

**Email Template:**
```
Subject: 🐾 Action Required: Update Your Waggin' Meals Subscription

Hi {First Name},

Great news! We've upgraded our system to serve you better.

To continue your {Frequency} subscription for {Dog Name}, please update
your payment information by {Deadline Date}.

[UPDATE PAYMENT METHOD] ← Big button with secure link

Your current subscription:
• {Products list}
• Next delivery: {Next Billing Date}
• Total: ${Total}/month

This is quick and secure - it takes less than 2 minutes.

Questions? Reply to this email or call us at (XXX) XXX-XXXX.

Thanks for being part of the Waggin' Meals family!

With love and tail wags,
The Waggin' Meals Team
```

**SMS Template (optional backup):**
```
Waggin' Meals: Please update payment for {Dog Name}'s subscription by {Date}.
Quick & secure: {Short Link}
Questions? Call XXX-XXX-XXXX
```

**Campaign Strategy:**
- **Day 0:** Initial email with 14-day deadline
- **Day 5:** Friendly reminder email
- **Day 10:** Urgent reminder email + SMS
- **Day 13:** Final notice - subscription will pause
- **Day 15:** Subscription paused, send reactivation link

---

### 5. Recurring Billing Automation

**Daily Cron Job** (runs at 2 AM):
```
1. Query subscriptions where next_billing_date = today AND status = 'active'
2. For each subscription:
   a. Charge payment token via Authorize.net
   b. If successful:
      - Create order in system
      - Send order confirmation email
      - Update next_billing_date (add frequency)
      - Update customer stats (order count, total spent)
      - Send to GHL for workflow triggers
   c. If failed:
      - Log failure
      - Send payment failed email
      - Retry in 3 days (up to 3 attempts)
      - After 3 failures: pause subscription + send notification
```

**API Endpoint:** `/api/cron/process-subscriptions`
**Trigger:** Vercel Cron or external service (Uptime Robot, EasyCron)

---

### 6. Failed Payment Handling

**Retry Logic:**
- Attempt 1: Immediate (when cron runs)
- Attempt 2: 3 days later
- Attempt 3: 7 days later (10 days total)
- After 3 failures: Auto-pause subscription

**Customer Communication:**

**Failed Payment Email:**
```
Subject: Payment Issue with Your Waggin' Meals Subscription

Hi {First Name},

We had trouble processing your payment for {Dog Name}'s subscription.

What happened: {Reason - e.g., "Card declined"}
Amount: ${Total}
Next attempt: {Date}

Please update your payment method to avoid interruption:
[UPDATE PAYMENT METHOD]

If you need help, we're here! Reply to this email or call us.
```

**Subscription Paused Email:**
```
Subject: Your Subscription Has Been Paused

Hi {First Name},

We've paused {Dog Name}'s subscription after multiple payment attempts.

Don't worry - your subscription is safe! Just update your payment method
and we'll resume deliveries:

[REACTIVATE SUBSCRIPTION]

Miss us? We miss you too! 🐾
```

---

### 7. Admin Subscription Management

**Dashboard:** `/admin/subscriptions`

**Features:**
- View all subscriptions (active, paused, cancelled)
- Filter by status, frequency, next billing date
- Search by customer name/email
- View subscription details
- Manual payment processing
- Edit subscription (items, frequency, pricing)
- Pause/resume subscription
- Cancel subscription
- View billing history
- Failed payment alerts
- Export subscriber list

**Metrics to Track:**
- Total active subscriptions
- Monthly recurring revenue (MRR)
- Churn rate
- Average subscription value
- Failed payment rate
- Reactivation rate

---

## Database Schema Updates Needed

### Add to subscriptions table:
```sql
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_profile_id TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_last_four TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_card_type TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS secure_token TEXT UNIQUE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS failed_payment_count INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS last_payment_attempt TIMESTAMP WITH TIME ZONE;
```

### New table: subscription_billing_history
```sql
CREATE TABLE subscription_billing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL, -- 'success', 'failed', 'refunded'
  payment_response JSONB, -- Full Authorize.net response
  error_message TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Implementation Phases

### Phase 1: Core Subscription System (High Priority)
**Timeline: 4-6 hours**

1. ✅ Update database schema
2. ✅ Create customer portal UI
3. ✅ Integrate Authorize.net CIM for payment tokenization
4. ✅ Build payment update flow
5. ✅ Test payment tokenization thoroughly

### Phase 2: Import & Migration (Critical Path)
**Timeline: 3-4 hours**

1. ✅ Build admin import interface
2. ✅ Create CSV parser and validator
3. ✅ Build import preview system
4. ✅ Execute import with secure token generation
5. ✅ Generate personalized re-authorization links
6. ✅ Test with sample data

### Phase 3: Re-Authorization Campaign (Marketing Critical)
**Timeline: 2-3 hours**

1. ✅ Create email templates (HTML + plain text)
2. ✅ Create SMS templates
3. ✅ Build campaign tracking
4. ✅ Set up reminder schedule
5. ✅ Test email deliverability

### Phase 4: Recurring Billing Automation (Revenue Critical)
**Timeline: 4-5 hours**

1. ✅ Build subscription processing cron job
2. ✅ Integrate Authorize.net charging API
3. ✅ Create order from successful subscription charge
4. ✅ Build retry logic for failed payments
5. ✅ Test thoroughly with test accounts

### Phase 5: Admin Management & Monitoring (Operations)
**Timeline: 3-4 hours**

1. ✅ Build subscription dashboard
2. ✅ Create subscription detail pages
3. ✅ Build edit/pause/cancel functionality
4. ✅ Add failed payment alerts
5. ✅ Create reports and exports

### Phase 6: Testing & Launch (Mission Critical)
**Timeline: 2-3 hours**

1. ✅ End-to-end testing with test cards
2. ✅ Test all failure scenarios
3. ✅ Verify email/SMS delivery
4. ✅ Load test with 100 concurrent users
5. ✅ Backup and rollback plan

**Total Estimated Time: 18-25 hours of focused development**

---

## Risk Mitigation

### Risk 1: Payment Failures During Migration
**Mitigation:**
- Extended deadline (14 days) for re-authorization
- Multiple reminder emails/SMS
- Phone call backup for high-value customers
- Manual payment processing option

### Risk 2: Customer Confusion
**Mitigation:**
- Crystal clear email instructions
- Video tutorial (2-minute screen recording)
- Dedicated support phone line during migration
- FAQ page on website

### Risk 3: Technical Failures
**Mitigation:**
- Thorough testing with Authorize.net sandbox
- Rate limiting to prevent overload
- Database backups before import
- Rollback plan if critical issues
- Monitor error logs in real-time

### Risk 4: Lost Revenue
**Mitigation:**
- Track re-authorization rate daily
- Personal outreach for non-responders after 7 days
- Incentive for quick re-authorization (10% off next order)
- Pause instead of cancel (easy reactivation)

---

## Success Metrics

### Target Goals:
- **90%+ re-authorization rate** within 14 days
- **95%+ successful payments** on first recurring billing cycle
- **< 5% churn rate** during migration
- **Zero data loss** during import
- **< 2% failed payment rate** ongoing

### Monitoring (Daily during migration):
- Re-authorization completion rate
- Email open/click rates
- Support ticket volume
- Payment update success rate
- Error logs and failed attempts

---

## Launch Checklist

### Before Import:
- [ ] Test payment tokenization with all card types
- [ ] Test subscription charging with test tokens
- [ ] Verify email templates render correctly
- [ ] Test secure portal with multiple scenarios
- [ ] Database backups confirmed
- [ ] Authorize.net production credentials configured
- [ ] Support team trained on new system
- [ ] FAQ page published
- [ ] Video tutorial recorded and uploaded

### During Import:
- [ ] Import subscribers in small batches (10 at a time)
- [ ] Verify each batch before proceeding
- [ ] Monitor error logs
- [ ] Test sample portal links immediately
- [ ] Confirm emails are sending

### After Import:
- [ ] Send initial re-authorization emails
- [ ] Monitor response rate hourly for first 24 hours
- [ ] Be available for support questions
- [ ] Follow up with non-responders after 5 days
- [ ] Track completion daily

### First Billing Cycle:
- [ ] Manual review before automatic processing
- [ ] Monitor cron job execution
- [ ] Check for failed payments immediately
- [ ] Respond to failed payments within 1 hour
- [ ] Celebrate successful charges! 🎉

---

## Questions for Christie

Before I start building, I need to know:

1. **Current Subscription Data:**
   - Do you have a CSV/spreadsheet of current subscribers?
   - What data do you have? (email, name, products, frequency, pricing, next billing date?)
   - Are there any special cases or custom arrangements?

2. **Pricing & Products:**
   - Will subscription pricing stay the same?
   - Any promotional pricing to honor?
   - Are products changing?

3. **Payment Processing:**
   - Authorize.net credentials ready for production?
   - Do you have test credentials for sandbox testing?

4. **Timeline:**
   - When do you need this live?
   - When should subscribers be notified?
   - What's the deadline for re-authorization?

5. **Customer Communication:**
   - Should re-authorization emails come from you personally or "Waggin' Meals Team"?
   - Do you want to personally call high-value customers?
   - Do you want to offer incentive for quick re-authorization?

6. **Billing Frequency:**
   - Are all subscriptions monthly? Or mixed (weekly, bi-weekly, monthly)?
   - Do billing dates stay the same or normalize to 1st of month?

7. **Failure Handling:**
   - Should we try to contact customers by phone for failed payments?
   - How many chances before pausing subscription?
   - Any customers who should never be auto-cancelled?

---

## Next Immediate Steps

1. **You answer the questions above**
2. **Share subscriber CSV** (even if incomplete - I can work with it)
3. **I build Phase 1** (Core system - 4-6 hours)
4. **We test together** with test cards
5. **I build Phase 2** (Import system - 3-4 hours)
6. **Test import** with sample data
7. **Import real subscribers** in small batches
8. **Launch campaign** with your approval
9. **Monitor closely** during migration
10. **Celebrate success!** 🎉

This is doable. We'll get it right. Let's tackle this systematically! 🐾
