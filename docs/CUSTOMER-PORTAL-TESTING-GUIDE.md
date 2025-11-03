# Customer Portal Testing Guide
**Waggin' Meals Premium Customer Portal**
**Features: Subscription Management & Consultation History**
**Created**: November 2, 2025

---

## 📋 Overview

This guide covers testing for the new premium customer portal features that give customers self-service control over their subscriptions and consultation history.

### What Was Built:

**Phase 1: Core Portal Enhancements**
1. Skip next delivery
2. Change delivery frequency
3. Update shipping address
4. Consultation history page
5. Next box preview widget

**Phase 2: Subscription Customization**
6. Customize box contents (add/remove products, change quantities)

---

## ✅ Pre-Testing Setup

### 1. Verify Build Success
- ✅ Build completed successfully (168 pages generated, exit code 0)
- ✅ No TypeScript errors
- ✅ All new routes compiled

### 2. Required Test Data

**You'll need a test customer account with:**
- Active subscription (for testing subscription features)
- At least one free consultation request (for testing consultation history)
- Valid email address (for testing GHL integration)

**To create test data:**
```sql
-- Check existing subscriptions
SELECT * FROM subscriptions WHERE status = 'active' LIMIT 5;

-- Check existing consultation requests
SELECT * FROM consultation_requests LIMIT 5;
```

### 3. Environment Variables

Verify these are set in `.env.local`:
```bash
# Required for GHL integration testing
GHL_API_KEY=your_api_key
GHL_LOCATION_ID=your_location_id

# Optional custom fields
GHL_CUSTOM_FIELD_CONSULTATION_ID=field_id
GHL_CUSTOM_FIELD_PET_COUNT=field_id
```

---

## 🧪 Phase 1 Testing: Core Portal Features

### Test 1: Skip Next Delivery

**Location**: `/account/subscriptions/[id]`

**Steps:**
1. Log in as customer with active subscription
2. Navigate to **Account → Subscriptions**
3. Click on an active subscription
4. Locate the "Skip Next Delivery" button in the subscription management section
5. Click **Skip Next Delivery**
6. Confirm the action in the modal dialog
7. Wait for success message

**Expected Results:**
- ✅ Modal appears asking for confirmation
- ✅ Success message: "Next delivery has been skipped!"
- ✅ Subscription details refresh automatically
- ✅ Next billing date advances by one billing cycle
- ✅ Page shows updated delivery schedule

**Verification:**
```sql
-- Check subscription was updated
SELECT id, next_billing_date, updated_at
FROM subscriptions
WHERE id = 'your-subscription-id';

-- Check if skip was recorded in history
SELECT * FROM subscription_history
WHERE subscription_id = 'your-subscription-id'
ORDER BY created_at DESC LIMIT 1;
```

**GHL Integration Check:**
- Tag `subscription-skipped` should be added to contact in GHL (if GHL is configured)

---

### Test 2: Change Delivery Frequency

**Location**: `/account/subscriptions/[id]`

**Steps:**
1. On subscription detail page, click **Change Frequency**
2. Modal opens with current frequency pre-selected
3. Select new frequency (e.g., change from "Every 2 weeks" to "Monthly")
4. Click **Save Changes**
5. Wait for confirmation

**Expected Results:**
- ✅ Modal displays with radio buttons for frequency options:
  - Every week
  - Every 2 weeks
  - Every 3 weeks
  - Monthly
- ✅ Current frequency is pre-selected
- ✅ Success message appears after save
- ✅ Subscription refreshes showing new frequency
- ✅ Next billing date recalculates based on new frequency

**Verification:**
```sql
-- Check frequency was updated
SELECT id, frequency, next_billing_date, updated_at
FROM subscriptions
WHERE id = 'your-subscription-id';
```

**GHL Integration Check:**
- Tag `subscription-frequency-changed` added to contact in GHL

---

### Test 3: Update Shipping Address

**Location**: `/account/subscriptions/[id]`

**Steps:**
1. On subscription detail page, click **Update Address**
2. Modal opens with form fields
3. Enter new shipping address:
   - Address Line 1: "123 New Street"
   - Address Line 2: "Apt 4B" (optional)
   - City: "Asheville"
   - State: "NC"
   - Postal Code: "28801"
4. Click **Save Address**
5. Wait for confirmation

**Expected Results:**
- ✅ Modal displays with all address fields
- ✅ Form validates required fields (address, city, state, zip)
- ✅ Success message appears after save
- ✅ Subscription refreshes with new address visible
- ✅ Future deliveries will ship to new address

**Verification:**
```sql
-- Check address was updated
SELECT id, shipping_address, updated_at
FROM subscriptions
WHERE id = 'your-subscription-id';
```

**Important**: The `shipping_address` column is JSONB, so it stores the entire address object:
```json
{
  "address": "123 New Street",
  "address2": "Apt 4B",
  "city": "Asheville",
  "state": "NC",
  "zip": "28801"
}
```

---

### Test 4: Consultation History Page

**Location**: `/account/consultations`

**Steps:**
1. Navigate to **Account → Consultations** (or go directly to `/account/consultations`)
2. Page should load showing two sections:
   - Free Consultations
   - Paid Consultations ($395)
3. Review the data displayed

**Expected Results:**
- ✅ Page displays all free consultation requests for logged-in customer
- ✅ Each consultation shows:
  - Status badge (pending, contacted, completed)
  - Submission date
  - Pet names (if pet profiles exist)
  - Number of pets
  - Current spending amount
  - GHL sync status
- ✅ Page displays all paid consultations
- ✅ Each paid consultation shows:
  - Status badge (pending, paid, completed)
  - Submission date
  - Payment amount ($395)
  - Questionnaire completion indicator
- ✅ Empty state message if no consultations exist
- ✅ Stats cards showing total counts

**Verification:**
```sql
-- Check free consultations
SELECT id, first_name, last_name, email, status, created_at, ghl_synced_at
FROM consultation_requests
WHERE email = 'customer@example.com'
ORDER BY created_at DESC;

-- Check paid consultations
SELECT id, first_name, last_name, email, status, amount_paid, created_at
FROM paid_consultations
WHERE email = 'customer@example.com'
ORDER BY created_at DESC;
```

---

### Test 5: Next Box Preview Widget

**Location**: `/account` (main account dashboard)

**Steps:**
1. Log in and navigate to account dashboard
2. Widget should appear at top of page (before account menu cards)
3. Widget shows details for next upcoming subscription delivery

**Expected Results:**
- ✅ Widget displays countdown: "X days until your next delivery"
- ✅ Shows subscription details:
  - Product name
  - Quantity
  - Price
- ✅ Shows delivery frequency (e.g., "Every 2 weeks")
- ✅ Shows next billing date
- ✅ Quick action buttons visible:
  - "Skip This Delivery" (links to subscription detail)
  - "Customize Box" (links to subscription detail)
- ✅ Widget only shows if customer has active subscription
- ✅ If multiple subscriptions, shows the one with nearest billing date

**Edge Cases:**
- No active subscriptions → Widget doesn't appear (not an error)
- Subscription paused → Widget doesn't appear
- Next billing date is today → Shows "0 days"
- Next billing date passed → Shows negative number (bug - should trigger billing)

---

## 🧪 Phase 2 Testing: Customize Box

### Test 6: Customize Subscription Box Contents

**Location**: `/account/subscriptions/[id]`

**This is the PREMIUM FEATURE that prevents cancellations.**

**Steps:**

#### Part A: Opening the Modal
1. On active subscription detail page, scroll to "Items in Subscription" section
2. Click **Customize Box** button (green-blue gradient)
3. Modal should open

**Expected Results:**
- ✅ Modal opens with full-screen overlay
- ✅ Header shows "Customize Your Box"
- ✅ Modal is scrollable (up to 70vh height)
- ✅ Close button (X) visible in top-right

---

#### Part B: Viewing Current Items
1. Review the "Current Items" section at top of modal
2. Each item should display:
   - Product name
   - Price per unit
   - Quantity controls (+/- buttons)
   - Subtotal for that item
   - Remove button (trash icon)

**Expected Results:**
- ✅ All current subscription items are listed
- ✅ Quantities match subscription data
- ✅ Prices are accurate
- ✅ Subtotals calculate correctly (price × quantity)

---

#### Part C: Adjusting Quantities
1. Click the **+** button on an item
2. Quantity should increase by 1
3. Click the **-** button on an item
4. Quantity should decrease by 1
5. Try to decrease quantity to 0

**Expected Results:**
- ✅ + button increases quantity immediately
- ✅ - button decreases quantity immediately
- ✅ Subtotal updates in real-time
- ✅ Total price updates in real-time
- ✅ Reducing to 0 removes the item from list
- ✅ Price summary shows change (+$X.XX or -$X.XX)

---

#### Part D: Removing Items
1. Click the trash icon next to an item
2. Item should be removed from current items

**Expected Results:**
- ✅ Item disappears immediately
- ✅ Total price recalculates
- ✅ Price summary updates
- ✅ Can remove all items except the last one (validation prevents saving with 0 items)

---

#### Part E: Browsing Products
1. Click **+ Browse Products** button
2. Product list expands below
3. Search for a product using the search box

**Expected Results:**
- ✅ Product list appears with all published products
- ✅ Each product shows:
  - Product image (if available)
  - Product title
  - Price
  - "Add" button
- ✅ Search filters products in real-time
- ✅ Search is case-insensitive
- ✅ Products are sorted alphabetically by title
- ✅ Product list is scrollable (max 264px height)

---

#### Part F: Adding Products
1. Click **Add** button on a product
2. Product should be added to "Current Items" section
3. Try adding the same product again

**Expected Results:**
- ✅ Product appears in current items with quantity = 1
- ✅ Product list closes automatically after adding
- ✅ Search box clears
- ✅ If product already exists, quantity increases by 1 instead of duplicating
- ✅ Total price updates immediately
- ✅ Price summary shows change

---

#### Part G: Price Preview
1. Make several changes (add products, change quantities)
2. Review the price summary box at bottom of modal

**Expected Results:**
- ✅ "Current Total" shows original subscription amount
- ✅ "New Total" shows updated amount after changes
- ✅ "Change" shows difference with color coding:
  - Green text if price decreased
  - Orange/red text if price increased
  - Shows + or - symbol
  - Shows dollar amount
- ✅ All calculations are accurate

---

#### Part H: Saving Changes
1. Click **Save Changes** button
2. Wait for processing
3. Modal should close

**Expected Results:**
- ✅ Button shows "Saving..." during processing
- ✅ Button is disabled during save
- ✅ Success message appears (or modal just closes)
- ✅ Modal closes automatically after save
- ✅ Subscription detail page refreshes
- ✅ Items section shows new products/quantities
- ✅ Subscription amount updates to new total
- ✅ `updated_at` timestamp updates

**Verification:**
```sql
-- Check subscription was updated
SELECT id, items, amount, updated_at
FROM subscriptions
WHERE id = 'your-subscription-id';

-- Verify items structure (should be JSONB array)
SELECT items FROM subscriptions WHERE id = 'your-subscription-id';
```

Expected `items` structure:
```json
[
  {
    "name": "Beef & Sweet Potato Bowl",
    "product_id": "uuid-here",
    "quantity": 2,
    "price": 45.99
  },
  {
    "name": "Chicken Superfood Mix",
    "product_id": "uuid-here",
    "quantity": 1,
    "price": 39.99
  }
]
```

**GHL Integration Check:**
- Contact should be tagged with `subscription-customized` in GHL
- Check GHL contact record for tag

---

#### Part I: Validation & Error Handling
1. Remove all items from subscription
2. Try to click **Save Changes**

**Expected Results:**
- ✅ Alert appears: "Please add at least one product to your subscription"
- ✅ Save button is disabled when items array is empty
- ✅ Modal stays open

**Test API Error:**
1. Temporarily break API (stop dev server, etc.)
2. Try to save changes

**Expected Results:**
- ✅ Error alert appears: "Failed to update subscription. Please try again."
- ✅ Modal stays open
- ✅ Changes are not lost
- ✅ User can try again

---

#### Part J: Cancel Without Saving
1. Make several changes to subscription
2. Click **Cancel** button (or X in corner)

**Expected Results:**
- ✅ Modal closes immediately
- ✅ Changes are NOT saved
- ✅ Subscription remains unchanged
- ✅ Can reopen modal and see original items

---

## 🔧 Troubleshooting

### Issue: Modal doesn't open
**Check:**
- Browser console for JavaScript errors
- Make sure subscription status is 'active'
- Verify `showCustomizeModal` state is updating

### Issue: Products don't load
**Check:**
```sql
-- Verify products exist and are published
SELECT id, title, price, published FROM products WHERE published = true;
```
- Check browser console for API errors
- Verify Supabase client is initialized

### Issue: Save fails
**Check:**
- Browser console for error details
- Network tab for API response
- Verify subscription ID is valid
- Check API endpoint logs: `/api/subscriptions/[id]/update-items`

### Issue: Price calculations wrong
**Check:**
- Verify `price` field on products is correct
- Console.log the `calculateTotal()` function output
- Check that price is stored as number, not string

### Issue: GHL tag not added
**Check:**
- Environment variables are set: `GHL_API_KEY`, `GHL_LOCATION_ID`
- Check server logs for GHL API errors
- Verify customer email exists in GHL
- GHL sync is non-blocking - save will succeed even if GHL fails

---

## 📊 Success Criteria

### Phase 1 ✅
- [ ] Can skip next delivery without errors
- [ ] Can change delivery frequency (all 4 options work)
- [ ] Can update shipping address with validation
- [ ] Consultation history page displays all consultations correctly
- [ ] Next box preview widget appears on dashboard with accurate countdown

### Phase 2 ✅
- [ ] Customize box modal opens and displays current items
- [ ] Can increase/decrease quantities with +/- buttons
- [ ] Can remove items
- [ ] Can browse and search all products
- [ ] Can add products to subscription
- [ ] Duplicate products increment quantity instead of duplicating
- [ ] Price calculations are accurate in real-time
- [ ] Price summary shows current, new, and change
- [ ] Save button works and persists changes to database
- [ ] Subscription refreshes after save
- [ ] Validation prevents saving with 0 items
- [ ] Cancel discards changes
- [ ] GHL integration adds `subscription-customized` tag

---

## 🎯 Business Impact Metrics

Track these metrics before/after launch:

1. **Cancellation Rate**
   - Before: Customers cancel to change products
   - Target: 30-50% reduction in cancellations
   - Measure: % of subscriptions cancelled per month

2. **Support Ticket Volume**
   - Before: Customers email Christie for every change
   - Target: 70-80% reduction in support emails
   - Measure: # of subscription-related support tickets per week

3. **Subscription Value**
   - Before: Fixed subscription amounts
   - Target: 15-25% increase in average subscription value
   - Measure: Average `amount` field across all active subscriptions

4. **Customer Engagement**
   - Before: Customers don't interact with portal
   - Target: 40%+ of customers use customize feature within 30 days
   - Measure: # of unique customers who trigger `subscription-customized` tag

---

## 📝 Testing Checklist Summary

**Core Features:**
- [ ] Skip delivery works
- [ ] Change frequency works (all options)
- [ ] Update address works with validation
- [ ] Consultation history displays correctly
- [ ] Next box preview widget appears

**Customize Box:**
- [ ] Modal opens
- [ ] Current items display correctly
- [ ] Quantity controls work (+/-)
- [ ] Remove items works
- [ ] Browse products works
- [ ] Search filters products
- [ ] Add products works
- [ ] Duplicate detection works
- [ ] Price calculations accurate
- [ ] Save persists changes
- [ ] Validation prevents empty subscriptions
- [ ] Cancel discards changes
- [ ] GHL integration works

**Database Verification:**
- [ ] Subscription updates persist
- [ ] Items array structure is correct
- [ ] Amount updates correctly
- [ ] Timestamps update
- [ ] No data corruption

**GHL Integration:**
- [ ] Tags are added correctly
- [ ] Contact matching works (by email)
- [ ] Errors don't block saves

---

## 🚀 Ready for Production

Once all tests pass:

1. **Deploy to Netlify**
   ```bash
   git add .
   git commit -m "Add premium customer portal features"
   git push origin main
   ```

2. **Verify in Production**
   - Test with real customer account
   - Verify GHL integration in live environment
   - Monitor for errors in first 24 hours

3. **Announce to Customers**
   - Send email campaign (via GHL) announcing new self-service features
   - Create tutorial video showing how to customize box
   - Update FAQ page with self-service instructions

4. **Monitor Metrics**
   - Track cancellation rate changes
   - Monitor support ticket volume
   - Track customize feature adoption
   - Measure subscription value changes

---

**Questions or Issues?**
Refer to:
- `docs/GHL-INTEGRATION-GUIDE.md` for GHL setup and workflows
- `docs/ORDER_MANAGEMENT_SYSTEM.md` for related order features
- Database schema: `supabase/universal-migration.sql`

**Testing completed by**: _____________
**Date**: _____________
**Production deploy date**: _____________
