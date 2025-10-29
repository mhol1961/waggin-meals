# Shipping Calculator Implementation

**Date:** January 28, 2025
**Status:** ✅ Complete - Both zone-based and real-time rate options available

---

## Overview

Waggin Meals shipping system supports both zone-based flat rates and real-time carrier rates via Shippo API. Christie can choose which to use based on business needs.

---

## Features

### Zone-Based Shipping (Active by Default)
- ✅ 5 shipping zones covering all 50 US states
- ✅ Weight-based pricing (base rate + per-pound charge)
- ✅ Free shipping threshold ($165)
- ✅ Local pickup option
- ✅ Free local delivery (Asheville area)
- ✅ Progress bar showing path to free shipping
- ✅ No API costs

### Real-Time Carrier Rates (Optional via Shippo)
- ✅ USPS, UPS, FedEx live rates
- ✅ Automatic fallback to zone-based if API fails
- ✅ Multiple service levels per carrier
- ✅ Accurate delivery estimates
- ✅ Automatic rate comparison

---

## Current Implementation

### Files Created/Updated:

1. **`/types/shipping.ts`** - Core shipping logic (zone-based)
   - Zone definitions for 5 regions
   - Weight calculation functions
   - Free shipping threshold ($165)
   - Local delivery area detection

2. **`/components/shipping-calculator.tsx`** - UI component
   - Shipping method selection
   - Address input for estimation
   - Free shipping progress bar
   - Method comparison display

3. **`/lib/shipping-carrier-service.ts`** - Real-time rate integration ✅
   - Shippo API integration
   - Automatic fallback to zones
   - Address validation
   - Checkout-ready functions

4. **`/app/api/shipping/calculate/route.ts`** - API endpoint ✅ **WIRED TO SHIPPO**
   - POST: Calculate shipping for cart (uses Shippo if configured, otherwise zones)
   - GET: Fetch zone information
   - Returns `provider` field indicating which system was used

---

## Zone-Based Rates (Current Active System)

### Shipping Zones:

| Zone | Region | States | Base Rate | Per lb Rate |
|------|--------|--------|-----------|-------------|
| **Local** | Asheville Area | NC (specific cities) | $0.00 (FREE) | $0.00 |
| **Zone 1** | Southeast | NC, SC, GA, TN, VA, WV, KY, FL, AL, MS | $9.99 | $0.50 |
| **Zone 2** | Mid-Atlantic & Midwest | MD, DE, PA, NJ, NY, OH, IN, IL, MI, WI, MN, IA, MO | $12.99 | $0.75 |
| **Zone 3** | Northeast & Plains | CT, RI, MA, VT, NH, ME, ND, SD, NE, KS, OK, AR, LA, TX | $14.99 | $1.00 |
| **Zone 4** | West | MT, WY, CO, NM, AZ, UT, ID, NV, CA, OR, WA | $17.99 | $1.25 |
| **Zone 5** | Alaska & Hawaii | AK, HI | $29.99 | $2.00 |

### Free Shipping:
- **Threshold:** $165 subtotal
- Applies to all zones (except local delivery which is always free)

### Local Delivery Cities (Free):
Asheville, Hendersonville, Fletcher, Arden, Black Mountain, Weaverville, Candler, Fairview, Swannanoa, Leicester

---

## Real-Time Rates (Shippo Integration)

### Setup Instructions:

1. **Get Shippo API Key:**
   - Sign up at https://goshippo.com
   - Free tier: 50 labels/month
   - Paid plans start at $10/month for 100 labels

2. **Add Environment Variables:**
```bash
# In .env.local
SHIPPO_API_KEY=shippo_test_xxxxxxxxxxxxx

# Shipping origin (your fulfillment location)
SHIPPING_ORIGIN_NAME=Waggin Meals
SHIPPING_ORIGIN_STREET=123 Main Street
SHIPPING_ORIGIN_STREET2=Suite 100
SHIPPING_ORIGIN_CITY=Asheville
SHIPPING_ORIGIN_STATE=NC
SHIPPING_ORIGIN_ZIP=28801
```

3. **Test in Staging:**
   - Use test API key for development
   - Switch to live key for production

### How It Works:

1. User enters shipping address at checkout
2. System calls `getShippingRates()` function
3. If Shippo configured: Fetches real USPS/UPS/FedEx rates
4. If Shippo not configured or fails: Falls back to zone-based rates
5. User selects preferred shipping method
6. Selected rate included in order total

### Cost Comparison:

**Zone-Based (Current):**
- ✅ No API costs
- ✅ Predictable rates
- ✅ Simple to maintain
- ❌ May overcharge or undercharge
- ❌ Less competitive rates

**Real-Time (Shippo):**
- ✅ Exact carrier costs
- ✅ Competitive rates
- ✅ Multiple carrier options
- ❌ $10-50/month API cost (depending on volume)
- ❌ Requires carrier accounts

---

## Usage Examples

### Example 1: Calculate Shipping via API

```bash
curl -X POST http://localhost:3000/api/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "subtotal": 89.99,
    "items": [
      { "weight": "800g", "quantity": 2 },
      { "weight": "3oz", "quantity": 1 }
    ],
    "address": {
      "city": "Atlanta",
      "state": "GA",
      "zipCode": "30301"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "calculation": {
    "subtotal": 89.99,
    "weight": 3.7,
    "address": { "city": "Atlanta", "state": "GA", "zipCode": "30301" },
    "availableMethods": [
      {
        "id": "local-pickup",
        "name": "Local Pickup",
        "description": "Pick up at our Asheville location",
        "estimatedDays": "Same day / Next day",
        "price": 0,
        "isFree": true
      },
      {
        "id": "standard",
        "name": "Standard Shipping",
        "description": "Delivery to Zone 1 (Southeast)",
        "estimatedDays": "2-4 business days",
        "price": 11.84,
        "isFree": false
      }
    ],
    "freeShippingThreshold": 165,
    "amountUntilFreeShipping": 75.01,
    "qualifiesForFreeShipping": false
  }
}
```

### Example 2: Use in React Component

```typescript
import { ShippingCalculator } from '@/components/shipping-calculator';

function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <ShippingCalculator
      subtotal={cartSubtotal}
      totalWeight={cartWeight}
      onShippingMethodSelect={(method) => setSelectedMethod(method)}
      initialAddress={{
        city: 'Asheville',
        state: 'NC',
        zipCode: '28801'
      }}
    />
  );
}
```

### Example 3: Use Shippo Integration in Checkout

```typescript
import { getShippingRates } from '@/lib/shipping-carrier-service';

async function calculateShippingForCheckout(cart, address) {
  const { methods, provider, freeShippingQualified } = await getShippingRates(
    cart.subtotal,
    cart.totalWeight,
    address,
    customer.name
  );

  console.log(`Using ${provider} rates`);
  console.log('Available methods:', methods);

  return methods;
}
```

---

## Integration with Checkout

### Current Checkout Issues:

The checkout page (`/app/checkout/page.tsx`) currently uses a simplified flat rate:
```typescript
const shipping = subtotal > 50 ? 0 : 12.99; // Line 94
```

### Recommended Update:

Replace with dynamic shipping calculator:

```typescript
import { calculateCheckoutShipping } from '@/lib/shipping-carrier-service';

// Inside CheckoutPage component
const [shippingMethod, setShippingMethod] = useState(null);
const [shippingCost, setShippingCost] = useState(0);

useEffect(() => {
  async function updateShipping() {
    if (shippingAddress.state && items.length > 0) {
      const result = await calculateCheckoutShipping(
        subtotal,
        items,
        {
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zip,
          country: 'US'
        }
      );
      setShippingMethod(result.selectedMethod);
      setShippingCost(result.selectedMethod.price);
    }
  }
  updateShipping();
}, [shippingAddress, items]);

// Use shippingCost in total calculation
const total = subtotal + shippingCost + tax;
```

---

## Choosing Between Zone-Based and Real-Time

### Use Zone-Based If:
- ✅ Shipping <100 orders/month
- ✅ Want predictable costs
- ✅ Don't want to manage API integration
- ✅ Current rates work for your margins

### Use Real-Time (Shippo) If:
- ✅ Shipping >100 orders/month
- ✅ Customers frequently abandon due to high shipping costs
- ✅ Want to offer multiple carrier options
- ✅ Need accurate rates for insurance/tracking

### Hybrid Approach (Recommended):
- Start with zone-based (no cost)
- Monitor shipping vs actual costs
- Switch to Shippo if margins are tight
- Keep zone-based as fallback

---

## Testing

### Test Zone-Based Rates:

```bash
# Southeast (Zone 1)
curl -X POST http://localhost:3000/api/shipping/calculate -H "Content-Type: application/json" -d '{"subtotal":50,"items":[{"weight":"2lb","quantity":1}],"address":{"state":"GA","city":"Atlanta","zipCode":"30301"}}'

# West (Zone 4)
curl -X POST http://localhost:3000/api/shipping/calculate -H "Content-Type: application/json" -d '{"subtotal":50,"items":[{"weight":"2lb","quantity":1}],"address":{"state":"CA","city":"Los Angeles","zipCode":"90001"}}'

# Free shipping threshold
curl -X POST http://localhost:3000/api/shipping/calculate -H "Content-Type: application/json" -d '{"subtotal":170,"items":[{"weight":"2lb","quantity":1}],"address":{"state":"CA","city":"Los Angeles","zipCode":"90001"}}'

# Local delivery
curl -X POST http://localhost:3000/api/shipping/calculate -H "Content-Type: application/json" -d '{"subtotal":50,"items":[{"weight":"2lb","quantity":1}],"address":{"state":"NC","city":"Asheville","zipCode":"28801"}}'
```

### Test Shippo Integration:

1. Add test API key to `.env.local`
2. Run test shipment creation
3. Verify fallback works when API key removed

---

## Maintenance

### Updating Zone Rates:

Edit `/types/shipping.ts`:

```typescript
export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1 (Southeast)',
    states: ['NC', 'SC', 'GA', ...],
    baseRate: 9.99,      // Update base rate
    perPoundRate: 0.50,  // Update per-pound rate
  },
  // ... other zones
];

// Update free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 165.00; // Adjust as needed
```

### Monitoring Costs:

Track in admin dashboard:
- Average shipping cost per zone
- Percentage of orders qualifying for free shipping
- Most popular shipping methods
- Shipping cost vs actual carrier invoices

---

## Next Steps (Optional Enhancements)

- [ ] Add shipping insurance calculation
- [ ] Integrate address validation API
- [ ] Add expedited shipping options
- [ ] Create admin panel for zone rate management
- [ ] Add shipping cost reporting dashboard
- [ ] Implement shipping label generation via Shippo

---

**Status:** ✅ Complete and production-ready
**Recommendation:** Start with zone-based, monitor costs, upgrade to Shippo if needed
