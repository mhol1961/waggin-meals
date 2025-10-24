# Customer & Subscriber Import - Complete Explanation

## Overview

This document explains the complete process for importing customers and subscribers from Shopify to the new Waggin' Meals platform.

**Key Distinction**:
- **ALL CUSTOMERS** (500+) need to be imported → Can place orders, view history, etc.
- **SUBSCRIBERS** (116) are a subset of customers → Need secure tokens for payment re-authorization

---

## Understanding the Data

### 1. ALL Customers (~500+)
**File**: `shopify-files/customers_export.csv`

**Who They Are**:
- Everyone who has ever created an account or placed an order
- Includes subscribers AND non-subscribers
- Includes one-time buyers
- Includes newsletter signups with no orders

**What They Need**:
- Account in Supabase (so they can log in and place orders)
- Contact record in GHL (for email marketing)
- Proper tagging based on preferences and history

### 2. Subscribers (116)
**File**: `shopify-files/shopify-subscribers.csv`

**Who They Are**:
- Customers with active or past subscription boxes
- ~40-50 are active paying subscribers (critical for revenue)
- ~55-65 are newsletter subscribers or inactive

**What They Need**:
- Everything customers need (account, GHL contact)
- PLUS: Subscription record in database
- PLUS: Secure token for payment re-authorization
- PLUS: Portal URL for updating payment

---

## The Import Process

### Step 1: Import ALL Customers to Supabase

**Script**: `scripts/import-all-customers.js`

**What It Does**:
```
For each customer in customers_export.csv:
  → Create customer record in Supabase
  → Create default shipping address
  → Store order history metadata (total spent, order count)
```

**Result**: ~500+ customers in Supabase database

**Why This Matters**:
- All customers can now log in to wagginmeals.com
- All customers can place new orders
- Order history is preserved
- Addresses are ready for checkout

---

### Step 2: Generate Subscriber Tokens

**Script**: `scripts/generate-subscriber-tokens.js`

**What It Does**:
```
For each subscriber in shopify-subscribers.csv:
  → Read customer data from customers_export.csv
  → Generate unique secure token (UUID)
  → Determine subscription frequency from tags
  → Estimate subscription price from order history
  → Create portal URL: wagginmeals.com/account/{token}
  → Export to subscribers-with-tokens.json
  → Export to ghl-subscribers-import.csv
```

**Output Files**:
1. `subscribers-with-tokens.json` - For Supabase subscription import
2. `ghl-subscribers-import.csv` - Subscribers only for GHL

**Result**: 116 subscribers ready for database import

---

### Step 3: Import Subscribers to Supabase

**Script**: `scripts/import-subscribers-to-supabase.js`

**What It Does**:
```
For each subscriber in subscribers-with-tokens.json:
  → Find or create customer record (already exists from Step 1)
  → Create subscription record with:
    - Secure token
    - Token expiration (90 days)
    - Status: 'pending_payment'
    - Subscription items, frequency, pricing
    - Portal URL
```

**Result**: 116 subscriptions in database with secure tokens

**Why This Matters**:
- Subscribers can now access their portal via secure link
- Subscriptions are ready for payment re-authorization
- Automated billing will work after re-authorization

---

### Step 4: Generate GHL Import for ALL Customers

**Script**: `scripts/generate-ghl-all-customers.js`

**What It Does**:
```
For each customer in customers_export.csv:
  → Check if customer is also a subscriber
  → Parse email preferences (accepts marketing?)
  → Parse Shopify tags
  → Assign appropriate GHL tags:
    - Subscription status
    - Email preferences
    - Customer tier (VIP, Loyal, New, etc.)
    - Spending level
    - Dietary preferences
    - Frequency preferences
  → Add portal URL if subscriber
  → Export to ghl-all-customers-import.csv
```

**Tags Applied**:

#### Subscription Tags
- `Active Subscriber` - Has subscription
- `Needs Re-Authorization` - Needs to update payment
- `Customer` - Not subscribed

#### Email Preference Tags
- `Newsletter Subscriber` - Opted in to marketing
- `No Marketing Emails` - Opted out

#### Customer Tier Tags
- `New Customer` - 0 orders
- `Returning Customer` - 1-4 orders
- `Loyal Customer` - 5-9 orders
- `VIP Customer` - 10+ orders

#### Spending Tier Tags
- `High Value` - $500+ spent
- `Medium Value` - $200-499 spent
- `Low Value` - $1-199 spent

#### Preference Tags (from Shopify)
- Frequency: `Weekly`, `2 Week`, `Monthly`, etc.
- Protein: `Chicken`, `Beef`, `Turkey`, `Fish`
- Dietary: `Grain Free`, `Sensitive Stomach`, `Allergy Friendly`

**Output File**: `ghl-all-customers-import.csv`

**Result**: ALL customers ready for GHL import with intelligent tagging

---

## Why Import to Both Supabase AND GHL?

### Supabase (Database)
**Purpose**: Run the e-commerce platform
- Customer accounts
- Order processing
- Subscriptions
- Payment processing
- Shipping management

### GoHighLevel (CRM)
**Purpose**: Marketing and customer communication
- Email campaigns
- SMS campaigns
- Abandoned cart recovery
- Re-authorization campaigns
- Customer segmentation
- Workflow automation

### Data Sync
- When customer updates payment → Webhook to GHL
- When order placed → Webhook to GHL
- When subscription status changes → Webhook to GHL
- GHL uses this data to trigger appropriate workflows

---

## Import Workflow Summary

```
┌─────────────────────────────────────────────────────┐
│              STEP 1: SUPABASE IMPORT                │
└─────────────────────────────────────────────────────┘

customers_export.csv (500+)
    ↓
import-all-customers.js
    ↓
Supabase: customers table (500+)
Supabase: customer_addresses table (500+)

┌─────────────────────────────────────────────────────┐
│         STEP 2: SUBSCRIBER TOKEN GENERATION         │
└─────────────────────────────────────────────────────┘

shopify-subscribers.csv (116)
    +
customers_export.csv (for details)
    ↓
generate-subscriber-tokens.js
    ↓
subscribers-with-tokens.json
ghl-subscribers-import.csv

┌─────────────────────────────────────────────────────┐
│       STEP 3: SUBSCRIPTION IMPORT TO SUPABASE       │
└─────────────────────────────────────────────────────┘

subscribers-with-tokens.json (116)
    ↓
import-subscribers-to-supabase.js
    ↓
Supabase: subscriptions table (116)
    with secure tokens and portal URLs

┌─────────────────────────────────────────────────────┐
│          STEP 4: GHL IMPORT PREPARATION             │
└─────────────────────────────────────────────────────┘

customers_export.csv (500+)
    +
shopify-subscribers.csv (116)
    +
subscribers-with-tokens.json (for portal URLs)
    ↓
generate-ghl-all-customers.js
    ↓
ghl-all-customers-import.csv (500+)
    with intelligent tagging

┌─────────────────────────────────────────────────────┐
│              STEP 5: GHL IMPORT                     │
└─────────────────────────────────────────────────────┘

ghl-all-customers-import.csv
    ↓
Manual import in GHL dashboard
    ↓
GoHighLevel: contacts (500+)
    with tags and custom fields
```

---

## Scripts Overview

### 1. `import-all-customers.js`
- **Input**: `customers_export.csv`
- **Output**: Supabase customers + addresses
- **Run**: Once, before subscriber import

### 2. `generate-subscriber-tokens.js`
- **Input**: `shopify-subscribers.csv`, `customers_export.csv`
- **Output**: `subscribers-with-tokens.json`, `ghl-subscribers-import.csv`
- **Run**: Once, after customer import

### 3. `import-subscribers-to-supabase.js`
- **Input**: `subscribers-with-tokens.json`
- **Output**: Supabase subscriptions
- **Run**: Once, after token generation

### 4. `generate-ghl-all-customers.js`
- **Input**: `customers_export.csv`, `shopify-subscribers.csv`, `subscribers-with-tokens.json`
- **Output**: `ghl-all-customers-import.csv`
- **Run**: Once, after subscriber import

### 5. `check-migration-status.js`
- **Input**: Supabase database
- **Output**: Status report
- **Run**: Daily during re-authorization campaign

---

## GHL Import Field Mapping

When importing `ghl-all-customers-import.csv` to GoHighLevel, map fields as follows:

| CSV Column | GHL Field | Type |
|------------|-----------|------|
| email | Email | Built-in |
| firstName | First Name | Built-in |
| lastName | Last Name | Built-in |
| phone | Phone | Built-in |
| tags | Tags | Built-in |
| totalOrders | Total Orders | Custom Field (Number) |
| totalSpent | Total Spent | Custom Field (Currency) |
| acceptsMarketing | Accepts Marketing | Custom Field (Yes/No) |
| isSubscriber | Is Subscriber | Custom Field (Yes/No) |
| customerType | Customer Type | Custom Field (Text) |
| source | Source | Built-in |
| portalURL | Portal URL | Custom Field (URL) |
| subscriptionStatus | Subscription Status | Custom Field (Text) |

---

## Verifying the Import

### Check Supabase

```sql
-- All customers
SELECT COUNT(*) FROM customers;
-- Should show ~500+

-- All subscriptions
SELECT COUNT(*) FROM subscriptions;
-- Should show 116

-- Subscriptions with tokens
SELECT COUNT(*) FROM subscriptions WHERE secure_token IS NOT NULL;
-- Should show 116

-- Pending payment subscriptions
SELECT COUNT(*) FROM subscriptions WHERE status = 'pending_payment';
-- Should show 116 (before re-authorization campaign)
```

### Check GoHighLevel

1. Go to Contacts
2. Filter by tag: "Active Subscriber"
   - Should show 116 contacts
3. Filter by tag: "Needs Re-Authorization"
   - Should show 116 contacts
4. Filter by tag: "Customer"
   - Should show all non-subscribers (~400+)
5. Filter by tag: "Newsletter Subscriber"
   - Should show all who opted in
6. Filter by tag: "No Marketing Emails"
   - Should show all who opted out

---

## Common Questions

### Q: Why import all customers to GHL if some don't want emails?
**A**: Even customers who opt out of marketing still need transactional emails (order confirmations, shipping notifications). GHL workflows can respect the "No Marketing Emails" tag while still sending transactional messages.

### Q: Can I update customer data after import?
**A**: Yes! Both Supabase and GHL can be updated. Webhooks keep them in sync.

### Q: What if a customer becomes a subscriber later?
**A**: They'll create a subscription via the website. Their customer record already exists. A webhook will update GHL with new tags.

### Q: What if someone unsubscribes from newsletter?
**A**: Update their tags in GHL from "Newsletter Subscriber" to "No Marketing Emails". Marketing workflows will skip them.

### Q: Can I manually add tags in GHL?
**A**: Yes! The imported tags are just the starting point. Add custom tags as needed for campaigns.

---

## Next Steps After Import

### 1. Verify Data (Week 1)
- Check customer counts in Supabase
- Check contact counts in GHL
- Verify tags are assigned correctly
- Test a few portal URLs

### 2. Launch Re-Authorization (Week 1)
- Activate GHL "Subscription Re-Authorization" workflow
- Monitor email open/click rates
- Respond to customer inquiries
- Track completion rate daily

### 3. Launch Marketing (Week 2-3)
- Create segmented campaigns based on tags
- Target non-subscribers with special offers
- Target VIP customers with exclusive perks
- Respect "No Marketing Emails" tags

### 4. Monitor & Optimize (Ongoing)
- Track re-authorization completion rate
- Analyze campaign performance
- Refine tags based on behavior
- Add automation for common scenarios

---

## Summary

**Before Migration**:
- 500+ customers stuck in Shopify
- 116 subscribers with payment locked in Shopify
- Limited marketing automation
- No customer self-service

**After Migration**:
- ALL customers (500+) in Supabase → Can place orders
- ALL customers (500+) in GHL → Intelligent marketing
- 116 subscriptions with secure tokens → Can update payment
- Automated recurring billing → No manual work
- Segmented marketing → Right message to right customer
- Customer self-service portal → Less support burden

**The complete migration ensures no customer data is lost, all customers can continue ordering, subscribers can re-authorize payments, and Christie has powerful marketing automation with proper segmentation.**

---

## Questions?

Refer to:
- `SUBSCRIPTION-MIGRATION-GUIDE.md` - Step-by-step instructions
- `SUBSCRIPTION-SYSTEM-COMPLETE.md` - Technical implementation details
- Individual script files for technical reference

**All customers and subscribers will be fully migrated with proper tagging and capabilities! 🚀**
