# Order Management System - Technical Documentation

**Date**: January 2025
**Status**: ✅ Complete
**Version**: 1.0

---

## Overview

This document details the complete order management system built for Waggin' Meals, including customer-facing order history, admin fulfillment workflow, and security fixes.

## Table of Contents

1. [Architecture](#architecture)
2. [Customer Order History](#customer-order-history)
3. [Admin Order Fulfillment](#admin-order-fulfillment)
4. [Security Fixes](#security-fixes)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Components](#components)
8. [Testing & Usage](#testing--usage)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Order Management System                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │  Customer Portal     │      │   Admin Portal       │    │
│  ├──────────────────────┤      ├──────────────────────┤    │
│  │ - Order History      │      │ - Order List         │    │
│  │ - Order Details      │      │ - Order Detail       │    │
│  │ - Track Packages     │      │ - Status Updates     │    │
│  │ - Reorder           │      │ - Add Tracking       │    │
│  └──────────┬───────────┘      │ - Print Packing Slip │    │
│             │                   └──────────┬───────────┘    │
│             │                               │                │
│             └───────────┬───────────────────┘                │
│                         │                                    │
│                    ┌────▼─────┐                             │
│                    │ API Layer │                             │
│                    ├──────────┤                             │
│                    │ - Orders  │                             │
│                    │ - Auth    │                             │
│                    │ - Email   │                             │
│                    └────┬─────┘                             │
│                         │                                    │
│                    ┌────▼─────┐                             │
│                    │ Supabase  │                             │
│                    │ Database  │                             │
│                    └───────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (customers), JWT (admin)
- **Email**: Resend (transactional notifications)
- **State Management**: React Context API

---

## Customer Order History

### Overview

Customers can view all their orders, track packages, and reorder previous purchases from their account portal.

### Files Created

1. **`/app/api/orders/my-orders/route.ts`** - API endpoint for fetching customer orders
2. **`/app/account/orders/page.tsx`** - Order history list page
3. **`/app/account/orders/[id]/page.tsx`** - Individual order detail page

### Features

#### Order List Page (`/account/orders`)

**URL**: `/account/orders`
**Authentication**: Required (Supabase Auth)

**Features**:
- Displays all orders in reverse chronological order
- Order cards showing:
  - Order number and date
  - Order status (pending, processing, shipped, delivered, cancelled)
  - Payment status (paid, pending, failed, refunded)
  - Total amount
  - Order items with quantities
  - Tracking number (if available)
- Action buttons:
  - **View Details** - Navigate to full order page
  - **Order Again** - Reorder same items (delivered orders only)
  - **Track Package** - External tracking link (if shipped)
- Empty state with "Shop Now" CTA
- Loading states during auth and data fetch

**Status Badges**:
```typescript
Order Status:
- pending     → Yellow badge
- processing  → Blue badge
- shipped     → Purple badge
- delivered   → Green badge
- cancelled   → Red badge
- payment_failed → Red badge

Payment Status:
- paid      → Green badge
- pending   → Yellow badge
- failed    → Red badge
- refunded  → Gray badge
```

#### Order Detail Page (`/account/orders/[id]`)

**URL**: `/account/orders/[id]`
**Authentication**: Required (Supabase Auth)

**Features**:
- Complete order information:
  - Order header with status and date
  - All order items with detailed pricing
  - Shipping address
  - Tracking information with external link
  - Payment information
  - Discount codes applied
- Order summary sidebar:
  - Subtotal breakdown
  - Shipping cost
  - Tax amount
  - Discount amount
  - Total
- Action buttons:
  - **Contact Support** - Navigate to contact page
  - **Order Again** - Reorder items

### API Endpoint: Get Customer Orders

**Endpoint**: `GET /api/orders/my-orders`
**Authentication**: Required (Supabase Auth via `requireAuth()`)

**Request**:
```bash
GET /api/orders/my-orders
Headers:
  Cookie: sb-access-token=... (managed by Supabase)
```

**Response**:
```json
{
  "orders": [
    {
      "id": "uuid",
      "order_number": "WM-20250126-001",
      "status": "shipped",
      "payment_status": "paid",
      "total": 127.45,
      "created_at": "2025-01-26T10:30:00Z",
      "order_items": [
        {
          "id": "uuid",
          "product_title": "Chicken & Sweet Potato Bowl",
          "variant_title": "Medium (5 lbs)",
          "quantity": 2,
          "price": 49.99,
          "total": 99.98
        }
      ],
      "shipping_address": { ... },
      "tracking_number": "9405511899223197651234"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Database error

**Security**:
- Uses `requireAuth()` server helper to verify authentication
- Filters orders by `customer_id` to ensure users only see their own orders
- Service role key used for Supabase queries (bypasses RLS but filtered in code)

### Authentication Bug Fix

**Issue**: Both order pages were checking for `session` from `useAuth()`, but the auth context only exposes `{ user, role, loading }`. This caused all authenticated users to be redirected to login.

**Fix** (in both `/app/account/orders/page.tsx` and `/app/account/orders/[id]/page.tsx`):

```typescript
// BEFORE (broken):
const { user, session } = useAuth();
if (!session) {
  router.push('/auth/login');
}

// AFTER (fixed):
const { user, loading } = useAuth();

useEffect(() => {
  if (loading) return; // Wait for auth to load
  if (!user) {
    router.push('/auth/login?redirect=/account/orders');
    return;
  }
  fetchOrders();
}, [user, loading]);
```

**Key Changes**:
1. Check `loading` state first to avoid redirect loops
2. Check `user` instead of non-existent `session`
3. Renamed internal loading states to `ordersLoading`/`orderLoading` to avoid conflicts
4. Added redirect parameter for better UX

---

## Admin Order Fulfillment

### Overview

Complete admin workflow for processing orders from placement through delivery, including status updates, tracking numbers, and packing slip printing.

### Files

**Existing** (already implemented):
- `/app/admin/orders/page.tsx` - Order list with stats
- `/app/admin/orders/[id]/page.tsx` - Order detail (server component)
- `/components/admin/order-detail-client.tsx` - Interactive order management
- `/app/api/admin/orders/[id]/route.ts` - Update order status/notes
- `/app/api/admin/orders/[id]/shipping/route.ts` - Add tracking number

**New**:
- `/components/admin/packing-slip.tsx` - Printable packing slip

### Features

#### Admin Order List (`/admin/orders`)

**URL**: `/admin/orders`
**Authentication**: Admin only (JWT session)

**Features**:
- Order statistics dashboard:
  - Total orders count
  - Pending orders count
  - Processing orders count
  - Shipped orders count
  - Total revenue
- Searchable/filterable order table
- Click order to view details

#### Admin Order Detail (`/admin/orders/[id]`)

**URL**: `/admin/orders/[id]`
**Authentication**: Admin only (JWT session)

**Features Implemented**:

1. **Status Management**
   - Quick status buttons: pending → processing → shipped → delivered
   - Also: cancelled, refunded
   - Updates database and refreshes view
   - Current status highlighted in blue

2. **Tracking Number Management**
   - Add tracking form with carrier selection (USPS, UPS, FedEx, DHL)
   - Automatically sets status to "shipped"
   - Sends email notification to customer
   - **NEW**: Display tracking info after adding:
     - Tracking number in monospace font
     - Carrier name
     - Ship date with timestamp
     - "Track Package" link with carrier-specific URL
     - Green checkmark icon

3. **Order Notes**
   - Add/edit internal notes about the order
   - Not visible to customers
   - Useful for special instructions or issues

4. **Print Packing Slip**
   - **NEW**: Dropdown menu with two options:
     - **"Preview & Print"** - Review before printing
     - **"Quick Print"** - Opens print dialog immediately
   - Professional layout with:
     - Waggin' Meals branding
     - Order number and date
     - Customer shipping address
     - Items table with checkboxes
     - Quality check checklist
     - Signature line for staff
   - Printer-friendly CSS (hides UI elements, clean margins)

### Packing Slip Component

**File**: `/components/admin/packing-slip.tsx`

**Props**:
```typescript
interface PackingSlipProps {
  order: PackingSlipData;
  onClose?: () => void;
  autoPrint?: boolean; // NEW: Auto-open print dialog
}
```

**Layout**:
```
┌────────────────────────────────────────┐
│         Waggin' Meals                  │
│    Premium Dog Nutrition Co.           │
│        PACKING SLIP                    │
├────────────────────────────────────────┤
│ Order #: WM-001   │  Ship To:          │
│ Date: Jan 26      │  John Doe          │
│                    │  123 Main St       │
│                    │  Austin, TX 78701  │
├────────────────────────────────────────┤
│ QTY │ Product         │ SKU    │ ☐     │
│  2  │ Chicken Bowl    │ Medium │ □     │
│  1  │ Meal Topper     │ —      │ □     │
│                                         │
│ Total Items: 3                         │
├────────────────────────────────────────┤
│ ⚠️ Special Instructions:               │
│ Customer allergic to chicken - double  │
│ check ingredients                       │
├────────────────────────────────────────┤
│ Quality Check:                         │
│ □ All items accounted for              │
│ □ Package sealed properly              │
│ □ Shipping label attached              │
│                                         │
│ Packed By: _____________  Date: ____   │
└────────────────────────────────────────┘
```

**Print Styles**:
```css
@media print {
  body * { visibility: hidden; }
  #packing-slip-content,
  #packing-slip-content * { visibility: visible; }
  .no-print { display: none !important; }
}

@page {
  margin: 0.5in;
  size: letter;
}
```

### API Endpoints

#### Update Order Status

**Endpoint**: `PATCH /api/admin/orders/[id]`
**Authentication**: Admin JWT

**Request**:
```json
{
  "status": "shipped",
  "notes": "Customer requested expedited shipping"
}
```

**Response**:
```json
{
  "id": "uuid",
  "order_number": "WM-001",
  "status": "shipped",
  "notes": "Customer requested expedited shipping",
  "updated_at": "2025-01-26T15:30:00Z",
  "items": [ ... ]
}
```

#### Add Tracking Number

**Endpoint**: `POST /api/admin/orders/[id]/shipping`
**Authentication**: Admin JWT

**Request**:
```json
{
  "tracking_number": "9405511899223197651234",
  "carrier": "USPS"
}
```

**Response**:
```json
{
  "id": "uuid",
  "order_number": "WM-001",
  "status": "shipped",
  "tracking_number": "9405511899223197651234",
  "carrier": "USPS",
  "shipped_at": "2025-01-26T15:30:00Z",
  "items": [ ... ]
}
```

**Side Effects**:
- Updates order status to "shipped"
- Sets `shipped_at` timestamp
- Sends shipping notification email to customer via `sendOrderShippedEmail()`

### Email Notifications

**Order Shipped Email** (`sendOrderShippedEmail`):
- Sent automatically when tracking number added
- Includes:
  - Order number
  - Tracking number with carrier-specific link
  - Carrier name
  - Order items
  - Shipping address
  - Expected delivery (if available)

**Carrier Tracking URLs**:
```typescript
function getTrackingUrl(carrier: string | null, trackingNumber: string) {
  switch (carrier?.toUpperCase()) {
    case 'USPS':
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`;
    case 'UPS':
      return `https://www.ups.com/track?tracknum=${tracking}`;
    case 'FEDEX':
      return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`;
    case 'DHL':
      return `https://www.dhl.com/en/express/tracking.html?AWB=${tracking}`;
    default:
      return `https://www.google.com/search?q=${tracking}`;
  }
}
```

---

## Security Fixes

### CRITICAL: Admin Authentication Bypass Vulnerability

**Severity**: 🔴 **CRITICAL**
**Status**: ✅ **FIXED**

#### Vulnerability Details

**Issue**: All admin API routes were completely open to unauthenticated requests.

**Root Cause**: The `verifyAdminAuth()` function returns an object:
```typescript
{
  authenticated: boolean;
  session?: { username: string };
  response?: NextResponse;
}
```

But the code was checking:
```typescript
const isAdmin = await verifyAdminAuth(request);
if (!isAdmin) { // ❌ This always passes! Objects are truthy
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Because JavaScript objects are always truthy, the check `if (!isAdmin)` never executed the auth failure block. **Every request, even unauthenticated ones, bypassed security.**

#### Affected Routes

All of these were completely open:
- `GET /api/admin/orders/[id]` - View any order
- `PATCH /api/admin/orders/[id]` - Update any order
- `POST /api/admin/orders/[id]/shipping` - Add tracking to any order
- `POST /api/admin/discounts` - Create discount codes
- `PATCH /api/admin/discounts/[id]` - Update discount codes
- `DELETE /api/admin/discounts/[id]` - Delete discount codes

#### Fix Applied

Changed all instances from:
```typescript
// BEFORE (vulnerable):
const isAdmin = await verifyAdminAuth(request);
if (!isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

To:
```typescript
// AFTER (secure):
const authResult = await verifyAdminAuth(request);
if (!authResult.authenticated) {
  return authResult.response; // Returns redirect to /admin/login
}
```

**Files Fixed**:
- `/app/api/admin/orders/[id]/route.ts` (GET, PATCH)
- `/app/api/admin/orders/[id]/shipping/route.ts` (POST)
- `/app/api/admin/discounts/route.ts` (POST)
- `/app/api/admin/discounts/[id]/route.ts` (PATCH, DELETE)

#### Verification

To verify the fix:
```bash
# This should now return 401 or redirect to login:
curl -X PATCH http://localhost:3000/api/admin/orders/[some-id] \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

#### Prevention

**Recommendation**: Update TypeScript to make this error impossible:

```typescript
// In lib/admin-auth.ts, change return type to discriminated union:
export async function verifyAdminAuth(
  request: NextRequest
): Promise<
  | { authenticated: true; session: { username: string } }
  | { authenticated: false; response: NextResponse }
> {
  // ... implementation
}

// Now TypeScript forces you to check .authenticated first:
const result = await verifyAdminAuth(request);
if (result.authenticated) {
  // TypeScript knows result.session exists here
  const { session } = result;
} else {
  // TypeScript knows result.response exists here
  return result.response;
}
```

This makes it a compile-time error to forget the `.authenticated` check.

---

## Database Schema

### Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),

  -- Order Info
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Customer Info
  customer_email VARCHAR(255) NOT NULL,
  customer_first_name VARCHAR(100),
  customer_last_name VARCHAR(100),

  -- Shipping
  shipping_address JSONB,
  tracking_number VARCHAR(100),
  carrier VARCHAR(50),
  shipped_at TIMESTAMP,

  -- Payment
  payment_intent_id VARCHAR(100),
  payment_method VARCHAR(50),

  -- Admin
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Order Items Table

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_handle VARCHAR(255),
  variant_title VARCHAR(255),
  image_url TEXT,

  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

---

## Components

### Customer Components

#### `/app/account/orders/page.tsx`
- Client component (`'use client'`)
- Uses `useAuth()` hook for authentication
- Fetches orders from `/api/orders/my-orders`
- Status badge helper functions
- Responsive grid layout

#### `/app/account/orders/[id]/page.tsx`
- Client component
- Fetches single order by ID
- Full order details with sidebar
- Action buttons for support/reorder

### Admin Components

#### `/components/admin/order-detail-client.tsx`
- Interactive order management UI
- Status update buttons
- Tracking form
- Notes editor
- Print menu dropdown
- All state management

#### `/components/admin/packing-slip.tsx`
- Modal overlay
- Printable content
- Print styles
- Auto-print support

---

## Testing & Usage

### Manual Testing Checklist

#### Customer Order History
- [ ] Create test customer account
- [ ] Place test order via checkout
- [ ] Navigate to `/account/orders`
- [ ] Verify order appears in list
- [ ] Click "View Details"
- [ ] Verify all order information displays correctly
- [ ] Test "Order Again" button (for delivered orders)
- [ ] Test "Track Package" link (for shipped orders)
- [ ] Test empty state (new account with no orders)

#### Admin Order Management
- [ ] Login to admin at `/admin/login`
- [ ] Navigate to `/admin/orders`
- [ ] Verify order statistics are correct
- [ ] Click order to view details
- [ ] Test status update buttons (pending → processing → shipped)
- [ ] Add tracking number and carrier
- [ ] Verify email notification sent
- [ ] Verify tracking info displays after adding
- [ ] Click "Track Package" link
- [ ] Test print menu dropdown
- [ ] Test "Preview & Print" option
- [ ] Test "Quick Print" option
- [ ] Verify packing slip layout
- [ ] Print to PDF and verify formatting
- [ ] Add order notes and save
- [ ] Verify notes persist after refresh

#### Security Testing
- [ ] Logout from admin
- [ ] Try accessing `/api/admin/orders/[id]` without auth
- [ ] Verify receives 401 or redirect
- [ ] Try accessing admin pages without login
- [ ] Verify redirect to `/admin/login`
- [ ] Login as customer (not admin)
- [ ] Try accessing `/admin` routes
- [ ] Verify unauthorized

### Sample Test Data

```sql
-- Create test order
INSERT INTO orders (
  order_number,
  customer_id,
  status,
  payment_status,
  subtotal,
  shipping_cost,
  tax,
  total,
  customer_email,
  customer_first_name,
  customer_last_name,
  shipping_address
) VALUES (
  'WM-TEST-001',
  'customer-uuid-here',
  'pending',
  'paid',
  99.98,
  10.00,
  8.50,
  118.48,
  'test@example.com',
  'Test',
  'Customer',
  '{"first_name":"Test","last_name":"Customer","address_line1":"123 Test St","city":"Austin","state":"TX","postal_code":"78701","country":"USA"}'::jsonb
);

-- Add order items
INSERT INTO order_items (
  order_id,
  product_name,
  variant_title,
  quantity,
  unit_price,
  total_price
) VALUES
  ('order-uuid-here', 'Chicken & Sweet Potato Bowl', 'Medium (5 lbs)', 2, 49.99, 99.98);
```

---

## Future Enhancements

### Potential Improvements

1. **Order Filters & Search**
   - Filter by status, date range, customer
   - Search by order number or customer name
   - Export to CSV

2. **Bulk Actions**
   - Update multiple orders at once
   - Bulk print packing slips
   - Batch tracking number upload

3. **Analytics**
   - Order trends over time
   - Average order value
   - Top products
   - Fulfillment time metrics

4. **Notifications**
   - Real-time order notifications
   - Low inventory alerts
   - Failed payment alerts

5. **Returns & Refunds**
   - Return request workflow
   - Refund processing
   - Restocking automation

6. **Integration**
   - Shipping label generation (ShipStation, EasyPost)
   - Accounting sync (QuickBooks)
   - Inventory management

---

## Troubleshooting

### Common Issues

#### "Orders not loading for customer"
- Check Supabase auth is working: `const { user } = useAuth()`
- Verify API route is accessible: `/api/orders/my-orders`
- Check browser console for errors
- Verify customer has `customer_id` in database

#### "Admin can't update orders"
- Verify admin is logged in: Check cookies for `admin-session`
- Check API returns 200, not 401
- Verify Supabase service role key is set in `.env.local`

#### "Tracking email not sending"
- Check Resend API key is configured
- Verify email template exists
- Check server logs for email errors
- Verify customer email is valid

#### "Packing slip won't print"
- Try "Quick Print" option instead of "Preview & Print"
- Check browser print dialog isn't blocked
- Verify print styles are loading
- Try different browser (Chrome/Firefox work best)

---

## Maintenance

### Regular Tasks

- Monitor failed orders (payment_status = 'failed')
- Review stuck orders (status = 'processing' > 7 days)
- Clean up old tracking numbers
- Archive delivered orders after 90 days
- Monitor email delivery rates

### Database Maintenance

```sql
-- Find stuck orders
SELECT * FROM orders
WHERE status = 'processing'
  AND created_at < NOW() - INTERVAL '7 days';

-- Find failed payments
SELECT * FROM orders
WHERE payment_status = 'failed'
ORDER BY created_at DESC;

-- Order statistics
SELECT
  status,
  COUNT(*) as count,
  SUM(total) as revenue
FROM orders
GROUP BY status;
```

---

## Conclusion

The order management system provides a complete workflow for Waggin' Meals to manage customer orders from placement through delivery. The system includes:

✅ Customer order history with tracking
✅ Admin fulfillment workflow
✅ Print packing slips
✅ Email notifications
✅ Security fixes applied
✅ Comprehensive documentation

The system is production-ready and scalable to handle Christie's growing business needs.
