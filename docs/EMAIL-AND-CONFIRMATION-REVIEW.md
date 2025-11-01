# Email System and Confirmation Page Review

**Date**: November 1, 2025
**Status**: Analysis Complete - Issues Identified

---

## Email System Analysis

### Architecture Overview

**Email Service Stack:**
1. **Primary**: GoHighLevel (GHL) - CRM + Email Platform
2. **Fallback**: Resend - Transactional Email Service
3. **Strategy**: Try GHL first, fall back to Resend if GHL fails or not configured

### Email Flow

```
API Endpoint (/api/send-email)
  ↓
Determine email type → Generate template
  ↓
Email Service (lib/email-service.ts)
  ↓
Try GHL → If fails/not configured → Try Resend
  ↓
Return success/failure
```

---

## ✅ Working Email Templates

### 1. Order Confirmation (`order_confirmation`)
- **Trigger**: After successful order creation (`app/api/checkout/create-order/route.ts:322`)
- **Template**: `generateOrderConfirmationEmail` (lib/email-templates.ts:33-286)
- **Data Required**:
  - `order_number`, `customer_first_name`, `customer_email`
  - `items[]` (product_name, variant_title, quantity, total_price)
  - `subtotal`, `shipping_cost`, `tax`, `total`
  - `shipping_address` (full address object)
  - `created_at`
- **Status**: ✅ Complete and functional

### 2. Order Processing (`order_processing`)
- **Template**: `generateOrderProcessingEmail` (lib/email-templates.ts:410-469)
- **Purpose**: Notify customer when order moves to processing status
- **Status**: ✅ Template exists, not currently used

### 3. Order Shipped (`order_shipped`)
- **Template**: `generateOrderShippedEmail` (lib/email-templates.ts:288-408)
- **Extra Fields**: `tracking_number`, `carrier`
- **Status**: ✅ Template exists, ready for fulfillment integration

### 4. Order Out for Delivery (`order_out_for_delivery`)
- **Template**: `generateOrderOutForDeliveryEmail` (lib/email-templates.ts:471-528)
- **Purpose**: Same-day delivery notification
- **Status**: ✅ Template exists

### 5. Order Delivered (`order_delivered`)
- **Template**: `generateOrderDeliveredEmail` (lib/email-templates.ts:530-604)
- **Extra Features**: Review request, reorder CTA
- **Status**: ✅ Template exists

---

## ❌ CRITICAL ISSUE: Missing Subscription Email

### Problem

**File**: `app/api/checkout/create-subscription/route.ts` (lines 326-348)

The subscription creation endpoint tries to send a `subscription_created` email:

```typescript
await fetch(`/api/send-email`, {
  method: 'POST',
  body: JSON.stringify({
    type: 'subscription_created',  // ❌ This template DOES NOT EXIST
    to: email,
    data: { /* subscription data */ }
  })
});
```

**But**: The email API only recognizes these types:
- `order_confirmation`
- `order_processing`
- `order_shipped`
- `order_out_for_delivery`
- `order_delivered`

**Result**: Subscription email will fail with 400 error:
```json
{ "error": "Unknown email type: subscription_created" }
```

### Impact

- ✅ Subscription creation still works (email failure is caught and logged)
- ❌ Customers don't receive subscription confirmation emails
- ❌ No record of subscription details sent to customer
- ❌ Poor customer experience

### Solution Required

**Option 1: Create Subscription Email Template** (Recommended)

1. Add `generateSubscriptionCreatedEmail` to `lib/email-templates.ts`
2. Add case to `app/api/send-email/route.ts` switch statement
3. Import and export the new function

**Option 2: Use Existing Order Template**

Change subscription endpoint to use `order_confirmation` type (not ideal - wrong messaging)

---

## Confirmation Page Issues

### File: `app/checkout/confirmation/page.tsx`

### Issue 1: Race Condition with Payment Data

**Lines 36-72**: useEffect fetches payment, then tries to create order from it:

```typescript
useEffect(() => {
  async function fetchOrderDetails() {
    // Fetch payment
    const paymentData = await fetch(`/api/payments?orderId=${orderId}`);
    setPayment(paymentData.payments[0]);

    // ❌ BUG: Uses payment state here, but it hasn't updated yet
    if (payment) {
      setOrder({ /* from payment data */ });
    }
  }
  fetchOrderDetails();
}, [orderId]);  // ❌ Missing 'payment' dependency
```

**Problem**: `setPayment()` doesn't update `payment` variable until next render. The `if (payment)` check will always be false on first run.

**Fix**: Create order object from the fetched data directly, not from state:

```typescript
if (paymentData.payments && paymentData.payments.length > 0) {
  const fetchedPayment = paymentData.payments[0];
  setPayment(fetchedPayment);

  // Create order from fetched payment (not state)
  setOrder({
    id: orderId,
    order_number: orderId.slice(0, 8).toUpperCase(),
    total: fetchedPayment.amount,
    status: 'processing',
    created_at: fetchedPayment.created_at,
  });
}
```

### Issue 2: Mock Order Data

**Lines 53-63**: Confirmation page creates a "mock" order instead of fetching actual order:

```typescript
// For now, create a mock order object from the payment
// In production, you'd fetch the actual order from /api/orders
```

**Problem**: Shows incomplete order data to customer

**Better Approach**: Fetch actual order from Supabase:

```typescript
const orderResponse = await fetch(`/api/orders/${orderId}`);
const orderData = await orderResponse.json();
setOrder(orderData);
```

**Note**: This requires creating `/api/orders/[id]/route.ts` endpoint

---

## Email Service Configuration

### Required Environment Variables

**GoHighLevel (Primary):**
- `GHL_API_KEY` - GoHighLevel API token
- `GHL_LOCATION_ID` - GHL location identifier

**Resend (Fallback):**
- `RESEND_API_KEY` - Resend transactional email API key

**Sender Info:**
- `EMAIL_FROM` - Sender email (defaults to `orders@wagginmeals.com`)
- `ADMIN_EMAIL` - Admin notification recipient

### Current Configuration Status

**Unknown** - Need to verify if these are set in:
- `.env.local` (local development)
- Netlify environment variables (production)

**Test**: Try creating an order and check server logs for:
```
[GHL] GHL_API_KEY or GHL_LOCATION_ID not configured. Skipping email.
[Email] No email service configured. Set GHL_API_KEY/GHL_LOCATION_ID or RESEND_API_KEY.
```

---

## Order Confirmation Email Data Mapping

### What Create-Order Sends

**File**: `app/api/checkout/create-order/route.ts` (lines 319-341)

```typescript
{
  type: 'order_confirmation',
  to: email,
  data: {
    order_number: orderNumber,         // ✅ Matches
    customer_name: "First Last",       // ⚠️ Template expects customer_first_name
    total: total,                      // ✅ Matches
    items: items,                      // ⚠️ Property names may not match
    shipping_address: shipping_address // ⚠️ Property names may not match
  }
}
```

### What Email Template Expects

**File**: `lib/email-templates.ts` (lines 20-31)

```typescript
interface OrderEmailData {
  order_number: string;              // ✅ Provided
  customer_first_name: string;       // ❌ Gets "First Last" instead
  customer_email: string;            // ❌ Not provided
  items: OrderItem[];                // ⚠️ Shape mismatch
  subtotal: number;                  // ❌ Not provided
  shipping_cost: number;             // ❌ Not provided
  tax: number;                       // ❌ Not provided
  total: number;                     // ✅ Provided
  shipping_address: ShippingAddress; // ⚠️ Property name mismatch
  created_at: string;                // ❌ Not provided
}
```

### Item Shape Mismatch

**Template expects** (`lib/email-templates.ts:1-7`):
```typescript
interface OrderItem {
  product_name: string;    // ❌ API sends 'title'
  variant_title: string;   // ✅ Matches
  quantity: number;        // ✅ Matches
  unit_price: number;      // ❌ API sends 'price'
  total_price: number;     // ❌ API calculates on-the-fly
}
```

**API sends**:
```typescript
{
  title: string,         // Should be product_name
  variant_title: string, // ✅ Matches
  quantity: number,      // ✅ Matches
  price: number          // Should be unit_price
}
```

### Address Shape Mismatch

**Template expects**:
```typescript
interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;   // ❌ API sends 'address'
  address_line2: string;   // ❌ API sends 'address2'
  city: string;
  state: string;
  postal_code: string;     // ❌ API sends 'zip'
  country: string;
}
```

---

## Critical Fixes Required

### Priority 1: Fix Order Email Data

**File**: `app/api/checkout/create-order/route.ts` (lines 328-335)

**Change from:**
```typescript
data: {
  order_number: orderNumber,
  customer_name: `${shipping_address.first_name} ${shipping_address.last_name}`,
  total: total,
  items: items,
  shipping_address: shipping_address,
}
```

**Change to:**
```typescript
data: {
  order_number: orderNumber,
  customer_first_name: shipping_address.first_name,
  customer_email: email,
  items: items.map(item => ({
    product_name: item.title,
    variant_title: item.variant_title || null,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  })),
  subtotal: subtotal,
  shipping_cost: shipping,
  tax: tax,
  total: total,
  shipping_address: {
    first_name: shipping_address.first_name,
    last_name: shipping_address.last_name,
    address_line1: shipping_address.address,
    address_line2: shipping_address.address2 || null,
    city: shipping_address.city,
    state: shipping_address.state,
    postal_code: shipping_address.zip,
    country: shipping_address.country || 'US',
  },
  created_at: new Date().toISOString(),
}
```

### Priority 2: Create Subscription Email Template

See "Missing Subscription Email" section above.

### Priority 3: Fix Confirmation Page

See "Confirmation Page Issues" section above.

---

## Testing Checklist

Once fixes are applied:

1. **Test Order Confirmation Email:**
   - [ ] Create test order
   - [ ] Verify email sent (check server logs)
   - [ ] Check email inbox
   - [ ] Verify all data displays correctly
   - [ ] Test both HTML and plain text versions

2. **Test Subscription Email:**
   - [ ] Create test subscription
   - [ ] Verify email sent
   - [ ] Check inbox
   - [ ] Verify subscription details correct

3. **Test Confirmation Page:**
   - [ ] Complete checkout
   - [ ] Verify redirect to `/checkout/confirmation?orderId=...`
   - [ ] Verify payment details display
   - [ ] Verify order summary displays
   - [ ] Test both one-time and subscription confirmations

4. **Test Email Fallback:**
   - [ ] Temporarily disable GHL (remove env vars)
   - [ ] Verify Resend is used
   - [ ] Re-enable GHL
   - [ ] Verify GHL is used again

---

## Recommendations

### Short Term
1. Fix order confirmation email data mapping (Priority 1)
2. Create subscription email template (Priority 2)
3. Verify email service configuration (check env vars)

### Medium Term
1. Fix confirmation page race condition
2. Create `/api/orders/[id]` endpoint for confirmation page
3. Add email preview functionality to admin dashboard
4. Add email sending status to order details page

### Long Term
1. Implement email templates for all order statuses
2. Add email notification preferences to customer account
3. Create email logs table for debugging
4. Add email retry logic for failed sends
5. Implement email queue for high-volume periods

---

**Status**: Ready for implementation when client prioritizes email improvements.
**Priority**: Medium (orders work without perfect emails, but customer experience is degraded)
