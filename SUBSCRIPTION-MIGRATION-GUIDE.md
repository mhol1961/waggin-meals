# Subscription Migration Guide

## Overview

This guide walks through the complete process of migrating 116 subscribers from Shopify to the new Waggin' Meals platform with automated recurring billing via Authorize.net.

**Critical Success Factor**: ~40-50 active paying subscribers need to re-authorize their payment methods to maintain $3,000-5,000/month recurring revenue.

---

## Prerequisites

### 1. Authorize.net Setup
- [ ] Confirm Authorize.net account has CIM (Customer Information Manager) enabled
- [ ] Get API Login ID
- [ ] Get Transaction Key
- [ ] Set environment to 'production' or 'sandbox'

### 2. GoHighLevel Setup
- [ ] Generate GHL snapshot from `GHL-SNAPSHOT-SPECIFICATION.md`
- [ ] Import snapshot into your GHL account
- [ ] Get webhook URLs:
  - Payment Updated webhook URL
  - Payment Failed webhook URL

### 3. Environment Variables
Add to `.env.local`:
```bash
# Authorize.net
AUTHORIZENET_API_LOGIN_ID=your_login_id_here
AUTHORIZENET_TRANSACTION_KEY=your_transaction_key_here
AUTHORIZENET_ENVIRONMENT=production  # or 'sandbox' for testing

# GoHighLevel Webhooks
GHL_WEBHOOK_PAYMENT_UPDATED=https://your-ghl-webhook-url/payment-updated
GHL_WEBHOOK_PAYMENT_FAILED=https://your-ghl-webhook-url/payment-failed

# Cron Secret (for securing the billing automation)
CRON_SECRET=your_random_secure_string_here
```

---

## Migration Steps

### Step 1: Import All Customers from Shopify

**IMPORTANT**: Before migrating subscriptions, we need to import ALL existing customers from Shopify (not just subscribers). This ensures all customer data, order history, and addresses are preserved.

```bash
cd scripts
node import-all-customers.js
```

**What it does**:
- Reads `shopify-files/customers_export.csv`
- Imports ALL customers (500+ customers) into Supabase
- Creates customer records with order history metadata
- Creates default shipping addresses
- Updates existing customers if already in database

**Expected output**:
```
🐾 Waggin' Meals - Import All Customers from Shopify

📊 Found 523 customers in Shopify export

✓  Created: customer1@example.com
✓  Created: customer2@example.com
↻  Updated: customer3@example.com
...

📊 Import Summary:
   Total: 523
   ✅ Created: 487
   ↻  Updated: 36
   ❌ Failed: 0

✅ Customer import complete!
```

**Why this matters**:
- All customers can now log in and place orders
- Existing customers with order history are preserved
- Subscribers (next step) will link to existing customer records
- No customer data is lost from Shopify

---

### Step 2: Generate Subscriber Tokens

This script processes the Shopify subscriber CSV and generates secure tokens for subscription re-authorization.

```bash
cd scripts
node generate-subscriber-tokens.js
```

**What it does**:
- Reads `shopify-files/shopify-subscribers.csv` and `shopify-files/customers_export.csv`
- Generates unique secure tokens (UUIDs) for each subscriber
- Determines subscription frequency from Shopify tags
- Estimates subscription pricing from order history
- Creates two output files:
  - `shopify-files/subscribers-with-tokens.json` (for Supabase import)
  - `shopify-files/ghl-import.csv` (for GoHighLevel import)

**Expected output**:
```
🐾 Waggin' Meals Subscriber Token Generation

✅ Found 116 subscribers
✅ Found 500+ customers

📊 Active subscribers: 116

✅ Processed 116 subscribers with tokens

💾 Saved subscriber data to: subscribers-with-tokens.json
💾 Saved GHL import CSV to: ghl-import.csv

📊 Summary:
   Total subscribers: 116
   With order history: 50
   Average subscription: $75.00
   Estimated MRR: $4,500.00
```

---

### Step 3: Apply Database Schema Updates

Run the SQL script to add required fields for subscription tokenization and billing.

```bash
# In Supabase Dashboard > SQL Editor, paste and run:
supabase/subscription-updates.sql
```

**What it does**:
- Adds payment tokenization fields to `subscriptions` table
- Creates `subscription_billing_history` table
- Creates helper functions for billing automation
- Adds indexes for performance

---

### Step 4: Import Subscribers to Supabase

This script imports all subscribers into the database with their secure tokens.

```bash
cd scripts
node import-subscribers-to-supabase.js
```

**What it does**:
- Creates/updates customers in `customers` table
- Creates addresses in `customer_addresses` table
- Creates subscriptions in `subscriptions` table with:
  - Status: `pending_payment`
  - Secure tokens
  - Token expiration: 90 days
  - Portal URLs: `https://wagginmeals.com/account/{token}`

**Expected output**:
```
🐾 Waggin' Meals Subscriber Import to Supabase

📊 Found 116 subscribers to import

Importing customer1@example.com...
  ✓ Created new customer
  ✓ Created address
  ✓ Created subscription with secure token
  🔗 Portal: https://wagginmeals.com/account/abc123-def456...

📊 Import Summary:
   Total: 116
   ✅ Successful: 116
   ❌ Failed: 0
```

---

### Step 5: Import Subscribers to GoHighLevel

Import the GHL CSV file to enable marketing automation.

1. Go to GoHighLevel > Contacts
2. Click "Import"
3. Upload `shopify-files/ghl-import.csv`
4. Map fields:
   - email → Email
   - firstName → First Name
   - lastName → Last Name
   - phone → Phone
   - tags → Tags
   - subscriptionStatus → Custom Field: Subscription Status
   - subscriptionFrequency → Custom Field: Subscription Frequency
   - subscriptionPrice → Custom Field: Subscription Price
   - nextBillingDate → Custom Field: Next Billing Date
   - securePortalToken → Custom Field: Secure Portal Token
   - portalURL → Custom Field: Portal URL

5. Confirm import

**Result**: All 116 subscribers are now in GHL with:
- Tags: "Active Subscriber" and "Needs Re-Authorization"
- Portal URLs ready for campaign

---

### Step 6: Launch Re-Authorization Campaign

1. In GHL, navigate to Workflows
2. Find "Subscription Re-Authorization" workflow
3. Review the workflow:
   - Day 0: Email with secure portal link
   - Day 5: Friendly reminder
   - Day 10: Urgent reminder + SMS
   - Day 13: Final notice
   - Day 15: Subscription paused notice

4. Activate the workflow
5. Trigger for all contacts with tag "Needs Re-Authorization"

**Campaign Timeline**:
- **Day 0-5**: Initial reach-out and gentle reminders
- **Day 5-10**: Increased urgency
- **Day 10-15**: Final warnings
- **Day 15**: Auto-pause subscriptions without payment

---

### Step 7: Setup Automated Billing (Cron Job)

The recurring billing automation needs to run daily at 2 AM.

#### Option A: Vercel Cron (Recommended)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/process-subscriptions",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Deploy to Vercel, and cron will run automatically.

#### Option B: External Cron Service

Use a service like:
- **Cron-job.org**
- **EasyCron**
- **AWS EventBridge**

Configure to call:
```
POST https://wagginmeals.com/api/cron/process-subscriptions
Authorization: Bearer YOUR_CRON_SECRET
```

Schedule: Daily at 2:00 AM

---

### Step 8: Monitor Re-Authorization Progress

Check daily how many subscribers have re-authorized.

#### In Supabase Dashboard:

```sql
-- Total subscribers
SELECT COUNT(*) FROM subscriptions;

-- Re-authorized (active)
SELECT COUNT(*) FROM subscriptions WHERE status = 'active';

-- Pending payment
SELECT COUNT(*) FROM subscriptions WHERE status = 'pending_payment';

-- Re-authorization rate
SELECT
  ROUND(COUNT(*) FILTER (WHERE status = 'active') * 100.0 / COUNT(*), 2) AS completion_rate
FROM subscriptions;
```

#### In GoHighLevel:

Create a report showing:
- Total contacts with "Needs Re-Authorization" tag
- Contacts that removed the tag (successfully re-authorized)
- Completion rate over time

---

## Customer Portal Experience

### How Customers Re-Authorize

1. Customer receives email from GHL with unique portal link:
   ```
   https://wagginmeals.com/account/abc123-def456-ghi789
   ```

2. Customer clicks link → arrives at secure portal (no login required)

3. Portal shows:
   - Current subscription details
   - Products in subscription
   - Billing frequency
   - Next billing date
   - Subscription total

4. Customer clicks "Add Payment Method"

5. Enters card details:
   - Card number
   - Expiration month/year
   - CVV
   - Billing ZIP

6. Submits form → Card is tokenized via Authorize.net CIM

7. Success! Subscription status changes to "active"

8. GHL receives webhook → Removes "Needs Re-Authorization" tag

### Security Features

- ✅ Unique UUID tokens (impossible to guess)
- ✅ 90-day expiration on tokens
- ✅ No password required (reduces friction)
- ✅ PCI-compliant payment processing (Authorize.net)
- ✅ Card numbers never stored (only payment profile IDs)
- ✅ Tokens are single-use per customer

---

## Automated Recurring Billing

Once a customer re-authorizes, automated billing takes over.

### How It Works

1. **Daily at 2 AM**: Cron job runs `process-subscriptions` API
2. **Query**: Find subscriptions where `next_billing_date <= TODAY` and `status = 'active'`
3. **For each subscription**:
   - Charge the payment profile via Authorize.net
   - If successful:
     - Create order
     - Send order confirmation email
     - Update next billing date (based on frequency)
     - Reset failed payment count to 0
   - If failed:
     - Increment failed payment count
     - Log error in billing history
     - Send webhook to GHL
     - If 3rd failure: Auto-pause subscription

### Failed Payment Recovery

GHL workflow triggers automatically on payment failure:

- **1st failure**: Friendly email + request to update payment
- **2nd failure**: Urgent email + SMS
- **3rd failure**: Subscription paused + final notice

Customers can update payment anytime via portal link to reactivate.

---

## Testing Checklist

Before launching the re-authorization campaign:

### Database Tests
- [ ] Run subscription-updates.sql successfully
- [ ] Verify all subscribers imported correctly
- [ ] Check secure tokens are unique and valid
- [ ] Confirm token expiration dates are 90 days out

### Customer Portal Tests
- [ ] Test with valid secure token
- [ ] Test with expired token
- [ ] Test with invalid token
- [ ] Enter test card in payment form
- [ ] Verify Authorize.net tokenization works
- [ ] Confirm subscription status changes to 'active'

### Authorize.net Tests
- [ ] Test in sandbox mode first
- [ ] Use Authorize.net test cards:
  - 4111111111111111 (Visa - Success)
  - 4000000000000002 (Visa - Decline)
- [ ] Verify customer profiles are created
- [ ] Verify payment profiles are created
- [ ] Check payment profile IDs are stored

### Billing Automation Tests
- [ ] Manually trigger cron job:
  ```bash
  curl -X POST https://wagginmeals.com/api/cron/process-subscriptions \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```
- [ ] Verify subscriptions are charged
- [ ] Verify orders are created
- [ ] Verify next billing dates update
- [ ] Test failed payment logic with invalid profile
- [ ] Verify webhooks are sent to GHL

### GoHighLevel Tests
- [ ] Import test contacts with GHL CSV
- [ ] Verify custom fields populate correctly
- [ ] Test re-authorization workflow sends emails
- [ ] Test webhook integration receives events
- [ ] Verify tags update based on webhooks

---

## Launch Day Checklist

### Pre-Launch (1 day before)
- [ ] All testing complete and passing
- [ ] Authorize.net in production mode
- [ ] Environment variables set correctly
- [ ] Cron job scheduled and verified
- [ ] GHL campaign ready to activate
- [ ] Support email/phone monitored

### Launch Morning
- [ ] Final database check - all 116 subscribers imported
- [ ] Final GHL check - all 116 contacts imported
- [ ] Activate GHL re-authorization workflow
- [ ] Monitor first batch of emails sent
- [ ] Check for bounce backs or errors

### First Week Monitoring
- [ ] Check re-authorization rate daily
- [ ] Monitor GHL workflow analytics
- [ ] Respond to customer support inquiries quickly
- [ ] Check billing automation logs
- [ ] Track failed payment attempts

### Week 2
- [ ] Analyze completion rate
- [ ] Identify subscribers who haven't responded
- [ ] Personal outreach to high-value customers if needed
- [ ] Prepare for first automated billing cycle

---

## Troubleshooting

### Common Issues

#### "Token expired" message
- Customer waited too long (>90 days)
- Solution: Generate new token and resend via GHL

#### Payment tokenization fails
- Invalid card details
- Authorize.net API error
- Solution: Check Authorize.net dashboard for specific error, advise customer

#### Cron job not running
- Check authorization header matches CRON_SECRET
- Verify cron service is configured correctly
- Check server logs for errors

#### Orders not creating
- Check product inventory
- Verify shipping address is valid
- Check order creation logs in Supabase

---

## Success Metrics

Track these KPIs throughout migration:

### Week 1
- **Target**: 30% re-authorization rate (35 subscribers)
- **Metric**: Subscriptions with status = 'active'

### Week 2
- **Target**: 60% re-authorization rate (70 subscribers)
- **Metric**: Payment profiles created

### Week 3
- **Target**: 80%+ re-authorization rate (95+ subscribers)
- **Metric**: Active subscriptions with next billing date set

### Monthly
- **Target**: Maintain $4,000+ MRR
- **Metric**: Sum of all active subscription totals
- **Churn**: <5% monthly

---

## Support Resources

### For Technical Issues
- Review server logs in Vercel/hosting dashboard
- Check Supabase logs for database errors
- Review Authorize.net dashboard for payment errors
- Check GHL workflow execution logs

### For Customer Support
- Portal access issues → Generate new token
- Payment declined → Ask customer to contact their bank
- Subscription questions → Review customer's subscription in Supabase
- Billing disputes → Check `subscription_billing_history` table

---

## Post-Migration

Once 80%+ subscribers have re-authorized:

1. **Shopify Shutdown**:
   - Export final data backups
   - Cancel Shopify subscription
   - Update DNS if needed

2. **Optimization**:
   - Analyze re-authorization campaign performance
   - Optimize email copy based on open/click rates
   - Identify friction points in payment flow

3. **Expansion**:
   - Launch new subscription tiers
   - Add product variants to subscriptions
   - Build subscriber-exclusive perks
   - Implement referral bonuses

---

## Questions?

If you encounter issues during migration:

1. Check this guide first
2. Review error logs in Supabase/Vercel
3. Test in sandbox mode to isolate issue
4. Check `.env.local` for correct API keys
5. Verify GHL webhooks are receiving events

**Migration complete!** Your subscribers are now on a modern, automated recurring billing system with full customer self-service. 🎉
