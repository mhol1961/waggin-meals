# Customer Account System - Implementation Plan

## ✅ COMPLETED: Admin Authentication

The admin authentication is now live and working:
- **Admin Login:** https://wagginmeals.com/admin/login
- **Credentials:** Use the `ADMIN_USERNAME` and `ADMIN_PASSWORD` from your Netlify environment variables
- **Features:** Login, logout, session management, route protection

---

## 🔄 NEXT: Customer Account System

Customer accounts are a **much larger system** that requires:

### 1. Authentication & User Management

**What customers need:**
- Registration page (`/signup` or `/register`)
- Login page (`/login`)
- Password reset/forgot password
- Email verification
- Profile management page

**Best approach: Use Supabase Auth**
- You already have Supabase configured
- Provides built-in authentication
- Handles email verification, password resets, OAuth
- Free tier includes 50,000 monthly active users
- Setup: https://supabase.com/docs/guides/auth

### 2. Customer Dashboard

**Pages needed:**
- `/account` or `/dashboard` - Main customer portal
- `/account/profile` - Edit profile, change password
- `/account/subscriptions` - Manage meal subscriptions
- `/account/orders` - Order history
- `/account/pets` - Manage pet profiles
- `/account/addresses` - Shipping addresses
- `/account/payment-methods` - Saved payment methods

### 3. Subscription Management

**Features customers need:**
- View active subscriptions
- Pause/resume subscriptions
- Change delivery frequency
- Modify meal selections
- Cancel subscription
- Update payment method

**Integration required:**
- Payment processor (Stripe, Square, or Shopify)
- Subscription management logic
- Webhook handlers for payment events
- Email notifications for subscription changes

### 4. Database Schema

**New Supabase tables needed:**
```sql
-- customers
- id (uuid, primary key)
- email (text, unique)
- first_name (text)
- last_name (text)
- phone (text)
- created_at (timestamp)
- updated_at (timestamp)

-- customer_pets
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- name (text)
- breed (text)
- weight (decimal)
- age (integer)
- dietary_restrictions (text)
- created_at (timestamp)

-- subscriptions
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- status (text: active, paused, cancelled)
- frequency (text: weekly, biweekly, monthly)
- next_delivery_date (date)
- meal_plan (json)
- stripe_subscription_id (text)
- created_at (timestamp)
- updated_at (timestamp)

-- orders
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- subscription_id (uuid, foreign key, nullable)
- status (text: pending, processing, shipped, delivered)
- total_amount (decimal)
- shipping_address (json)
- items (json)
- created_at (timestamp)
- updated_at (timestamp)
```

### 5. Payment Integration

**Options:**

**Option A: Stripe (Recommended)**
- Best for subscriptions
- Built-in billing portal
- Easy integration
- Handles failed payments automatically
- Customer portal for managing cards/subscriptions

**Option B: Shopify (If using Shopify for products)**
- Already handles products
- Can add subscription app (like Recharge)
- All-in-one solution
- More expensive

**Option C: Square**
- Good for local business
- POS integration
- Subscription support

### 6. Email Notifications

**Customer emails needed:**
- Welcome email (registration)
- Order confirmation
- Shipping notification
- Subscription renewal reminder
- Payment failed
- Subscription paused/cancelled confirmation

**Can use:**
- Resend (we removed it earlier) or
- SendGrid or
- Your existing SMTP setup

---

## Implementation Time Estimate

**Basic customer accounts:** 2-3 days
- Registration/login
- Profile page
- Pet management

**With subscriptions:** 5-7 days
- All above features
- Payment integration
- Subscription management
- Order history

**Full system with notifications:** 10-14 days
- Everything above
- Email automation
- Customer support features
- Analytics

---

## Quick Start Option: Use Existing Solutions

**Fastest path to launch:**

1. **Use Shopify** for everything:
   - Products, checkout, customer accounts all built-in
   - Add subscription app (Recharge, Bold, etc.)
   - Embed Shopify customer portal on your site
   - Time: 1-2 days setup

2. **Use Stripe Customer Portal**:
   - Stripe creates a hosted portal
   - Customers manage subscriptions there
   - Your site just links to it
   - Time: 2-3 days setup

3. **Build custom (what we'd do)**:
   - Full control over design
   - Better integration with your brand
   - More flexibility
   - Time: 10-14 days

---

## Recommendation

**For Christie to review the site now:**
- ✅ Admin login is ready - she can test the CMS
- ✅ All public pages work
- ✅ Hero variations are ready to view

**For customer accounts:**
- **Short term:** Use Shopify or Stripe's hosted portals
- **Long term:** Build custom portal after getting customer feedback

Would you like me to:
1. Build the custom customer account system now?
2. Integrate with Shopify for quick launch?
3. Set up Stripe customer portal?
4. Just focus on other site features for now?

---

## Login Credentials for Christie

**Admin Portal:**
- URL: `https://wagginmeals.com/admin/login`
- Username: (from your ADMIN_USERNAME env var)
- Password: (from your ADMIN_PASSWORD env var)

Once logged in, Christie can:
- Create blog posts at `/admin/blog/new`
- Create case studies at `/admin/case-studies/new`
- Upload Word documents that convert to HTML
- Add images and rich formatting
