# Tax Calculator - Quick Start Guide

**For Christie** | **Created**: January 30, 2025

---

## What Was Built

A complete sales tax calculator system that automatically calculates the correct tax for customer orders based on their shipping address. This replaces the old hardcoded 8% tax rate.

---

## How It Works

### For Customers (Automatic)

1. Customer adds items to cart
2. Customer goes to checkout
3. Customer enters their shipping address
4. **Tax automatically calculates** based on their state and ZIP code
5. Order summary shows: "Tax (7.25%): $7.25" ← Shows actual rate!

### For You (Admin)

**Access**: Go to Admin Dashboard → Settings → Tax Rates
**Or visit**: `https://wagginmeals.com/admin/settings/tax`

**What you can do**:
- ✅ View all tax rates for all 50 states
- ✅ Add new tax rates (county or ZIP-specific)
- ✅ Edit existing tax rates
- ✅ Activate/deactivate tax rates
- ✅ Search by state

---

## Initial Setup

### Step 1: Run the Database Migration

**Option A: Via Supabase Dashboard** (Recommended)
1. Go to: https://supabase.com/dashboard
2. Select your Waggin Meals project
3. Click "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy and paste the entire contents of:
   `/supabase/migrations/20250130_create_tax_rates.sql`
6. Click "Run"
7. ✅ Done! All 50 states are now loaded with tax rates

**Option B: Via Supabase CLI**
```bash
# From your project root
supabase db push
```

### Step 2: Verify Installation

1. Go to: `https://wagginmeals.com/admin/settings/tax`
2. You should see 50 tax rates (one for each state)
3. Try the search box - type "CA" and you should see California (7.25%)

### Step 3: Test Checkout

1. Go to your shop and add a product
2. Click "Checkout"
3. Enter a shipping address with state CA and ZIP 90001
4. Watch the tax calculate automatically (should show 7.25%)
5. Try changing the state to OR (Oregon)
6. Tax should change to $0.00 (Oregon has no sales tax)

---

## Pre-Loaded Tax Rates

All 50 states are already loaded with their base state tax rates:

**Examples**:
- California (CA): 7.25%
- Texas (TX): 6.25%
- New York (NY): 4.00%
- Florida (FL): 6.00%

**No Sales Tax States** (0%):
- Alaska (AK)
- Delaware (DE)
- Montana (MT)
- New Hampshire (NH)
- Oregon (OR)

---

## Common Tasks

### Add a County-Specific Tax Rate

**Example**: Los Angeles County has an additional local tax

1. Go to Admin → Settings → Tax Rates
2. Click "Add Tax Rate"
3. Select state: California (CA)
4. Enter tax rate: 9.25 (state + county combined)
5. Enter county: Los Angeles
6. Add note: "LA County includes 2% local tax"
7. Click "Create"

Now customers in LA County will automatically get 9.25% tax instead of 7.25%!

### Add a ZIP-Specific Tax Rate

**Example**: Special district with unique rate

1. Click "Add Tax Rate"
2. Select state: California (CA)
3. Enter tax rate: 9.50
4. Enter ZIP code: 90210
5. Add note: "Beverly Hills special district"
6. Click "Create"

The system prioritizes ZIP-specific rates over county and state rates.

### Update a Tax Rate

**When tax laws change**:

1. Find the state in the list
2. Click "Edit"
3. Update the tax rate percentage
4. Click "Update"

All new orders will use the updated rate immediately!

### Deactivate a Tax Rate

**If you need to temporarily disable a rate**:

1. Find the rate in the list
2. Click "Deactivate"
3. The rate becomes inactive but stays in the database

You can reactivate it later by clicking "Edit" and checking the "Active" box.

---

## How Tax Priority Works

When a customer checks out, the system looks for tax rates in this order:

1. **ZIP Code Rate** (most specific)
   Example: 90210 has 9.50% → Use 9.50%

2. **County Rate** (less specific)
   Example: Los Angeles County has 9.25% → Use 9.25%

3. **State Rate** (fallback)
   Example: California has 7.25% → Use 7.25%

This ensures the most accurate tax rate is always used!

---

## Troubleshooting

### Tax shows $0.00 during checkout

**Cause**: Customer hasn't entered state or ZIP yet
**Fix**: Normal! Tax calculates once they fill in the address

### Wrong tax rate is being used

**Check these**:
1. Go to Admin → Settings → Tax Rates
2. Search for the state in question
3. Make sure the correct rate is marked "Active"
4. Make sure there's no conflicting county/ZIP rate

### Tax rate needs to be updated

**When state tax laws change**:
1. Find the state in the tax rates list
2. Click "Edit"
3. Update the percentage
4. Click "Update"
5. ✅ All future orders use the new rate

---

## API Endpoints (For Developers)

If you need to integrate with other systems:

**Calculate Tax**:
```
POST https://wagginmeals.com/api/tax/calculate
```

**List Tax Rates**:
```
GET https://wagginmeals.com/api/tax/rates
```

**Full API documentation**: See `/docs/TAX-CALCULATOR.md`

---

## Files Created

**Database**:
- `/supabase/migrations/20250130_create_tax_rates.sql` - Database schema

**Code**:
- `/lib/tax-calculator.ts` - Tax calculation logic
- `/app/api/tax/calculate/route.ts` - Tax calculation API
- `/app/api/tax/rates/route.ts` - Tax rates management API
- `/app/api/tax/rates/[id]/route.ts` - Single rate operations

**Admin UI**:
- `/app/admin/settings/tax/page.tsx` - Tax management interface

**Documentation**:
- `/docs/TAX-CALCULATOR.md` - Full technical documentation
- `/docs/TAX-CALCULATOR-QUICK-START.md` - This guide!

**Modified**:
- `/app/checkout/page.tsx` - Integrated real-time tax calculation

---

## Next Steps (Optional)

Want to take it further? Here are some ideas:

### Phase 2 Enhancements
- [ ] Bulk import tax rates from CSV file
- [ ] Automatic tax rate updates from external API (TaxJar/Avalara)
- [ ] Tax exemption certificates for wholesale customers
- [ ] Per-product tax categories (some items non-taxable)

### Phase 3 Advanced
- [ ] City-level tax rates (more granular than county)
- [ ] Multi-country support (Canada, UK, EU VAT)
- [ ] Tax reporting dashboard for accounting
- [ ] QuickBooks/Xero integration

---

## Support

If you run into issues:

1. ✅ Check this guide first
2. ✅ Review the full documentation: `/docs/TAX-CALCULATOR.md`
3. ✅ Test with known addresses (CA 90001 should be 7.25%)
4. ✅ Check the admin UI to verify rates are active
5. ✅ Contact your developer if issues persist

---

## Summary

✅ **Tax calculator is live and working!**

- All 50 states pre-loaded
- Automatic calculation during checkout
- Admin interface for easy management
- Accurate tax rates based on customer location
- No more hardcoded 8% tax!

**You're all set!** 🎉

---

**Questions?** Review the full documentation at `/docs/TAX-CALCULATOR.md`

**Last Updated**: January 30, 2025
