# Database Setup Instructions

## CRITICAL: Run This First!

The e-commerce system needs additional database tables. Follow these steps:

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `lpevubhnsicbbpzeqmmv`
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 2: Run Orders Schema

1. Open the file: `/supabase/orders-schema.sql`
2. Copy ALL the contents (it's a large file)
3. Paste into Supabase SQL Editor
4. Click **RUN** (or press Cmd/Ctrl + Enter)

### Step 3: Verify Tables Created

Run this query to verify:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these NEW tables:
- ✅ customers
- ✅ customer_addresses
- ✅ orders
- ✅ order_items
- ✅ subscriptions
- ✅ abandoned_carts
- ✅ discount_codes
- ✅ product_variants
- ✅ inventory_alerts

### Step 4: Test Order Creation

1. Visit your website
2. Add a product to cart
3. Go to checkout
4. Fill out the form
5. Submit order
6. Check Supabase: `SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;`

## What Each Table Does

### customers
Stores customer information (email, name, order history)

### customer_addresses
Stores shipping/billing addresses for customers

### orders
Main orders table with all order details, status, payment info

### order_items
Individual products in each order

### subscriptions
Recurring orders (monthly boxes, auto-delivery)

### abandoned_carts
Tracks carts that were started but not completed (for recovery emails)

### discount_codes
Promo codes and coupons

### product_variants
Different sizes/options for products (e.g., Small, Medium, Large)

### inventory_alerts
Automatic alerts when products run low

## Troubleshooting

### Error: "relation already exists"
No problem! It means the table is already there. Continue to next step.

### Error: "permission denied"
Make sure you're using the correct Supabase project. Check the URL matches your project ID.

### Can't see tables in dashboard
Refresh the page or click "Database" → "Tables" in left sidebar.

## After Setup

Once tables are created, you can:
1. Accept real orders
2. View orders at `/admin/orders`
3. Manage customers
4. Create discount codes
5. Track inventory

## Need Help?

If you get errors, copy the error message and I'll help fix it!
