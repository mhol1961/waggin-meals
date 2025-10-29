# Authorize.net Integration - Implementation Guide

**Date:** January 28, 2025
**Status:** Ready for Implementation (Waiting for API Credentials)

---

## Overview

The subscription billing system is **fully implemented** and ready for production, with one critical dependency: **Authorize.net CIM (Customer Information Manager) integration** for payment processing. All placeholder functions are in place and documented - they just need the actual API calls implemented.

---

## Current Status

### ✅ What's Already Complete

**Database Schema:**
- `payment_methods` table with CIM fields (`customer_profile_id`, `payment_profile_id`)
- Proper tokenization structure for PCI compliance
- Card metadata storage (last 4 digits, brand, expiration)

**Cron Job Infrastructure:**
- `/app/api/cron/process-subscriptions/route.ts` - Daily billing automation
- `/app/api/cron/retry-failed-payments/route.ts` - Failed payment recovery
- Both crons properly join customer data for emails/orders
- Enhanced error logging with safety guards
- Duplicate invoice prevention
- Subscription history audit trail

**Email Integration:**
- GoHighLevel email service fully integrated
- All email templates created (receipt, failed payment, retry success, cancellation)
- Safety guards to prevent silent failures
- Detailed error logging with customer context

**Customer Portal:**
- Payment method management UI (`/app/account/payment-methods/`)
- Add/remove/set default payment methods
- Frontend tokenization flow ready

### ⚠️ What Needs Implementation

Three placeholder functions need real Authorize.net API calls:

1. **Payment Method Tokenization** (`/app/api/payment-methods/route.ts`)
2. **Charge Payment Method** (`process-subscriptions/route.ts:288`)
3. **Charge Payment Method** (`retry-failed-payments/route.ts:331`)

---

## Required Environment Variables

Add these to your production environment (Netlify, Vercel, etc.):

```bash
# Authorize.net API Credentials
AUTHORIZENET_API_LOGIN_ID=your_api_login_id
AUTHORIZENET_TRANSACTION_KEY=your_transaction_key
AUTHORIZENET_ENVIRONMENT=sandbox  # or 'production'
```

**Testing:**
- Get **Sandbox credentials** from https://sandbox.authorize.net
- Use test card numbers from Authorize.net docs

**Production:**
- Get **Production credentials** from your Authorize.net account
- Switch `AUTHORIZENET_ENVIRONMENT=production`

---

## Implementation Tasks

### Task 1: Install Authorize.net SDK

```bash
npm install authorizenet
```

### Task 2: Implement Payment Tokenization

**File:** `/app/api/payment-methods/route.ts`

**Current Placeholder (lines 1-50):**
```typescript
// TODO: Implement Authorize.net CIM tokenization
```

**What It Needs:**
```typescript
import ApiContracts from 'authorizenet/lib/apicontracts';
import ApiControllers from 'authorizenet/lib/apicontrollers';
import { SDKConstants } from 'authorizenet/lib/constants';

export async function POST(request: NextRequest) {
  // ... existing validation code ...

  // Create customer profile in Authorize.net CIM
  const merchantAuth = new ApiContracts.MerchantAuthenticationType();
  merchantAuth.setName(process.env.AUTHORIZENET_API_LOGIN_ID!);
  merchantAuth.setTransactionKey(process.env.AUTHORIZENET_TRANSACTION_KEY!);

  const creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(cardNumber);
  creditCard.setExpirationDate(expiryMonth + expiryYear);
  creditCard.setCardCode(cvv);

  const paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const customerPaymentProfile = new ApiContracts.CustomerPaymentProfileType();
  customerPaymentProfile.setPayment(paymentType);

  // Set billing address
  const billTo = new ApiContracts.CustomerAddressType();
  billTo.setFirstName(billingAddress.firstName);
  billTo.setLastName(billingAddress.lastName);
  billTo.setAddress(billingAddress.address1);
  billTo.setCity(billingAddress.city);
  billTo.setState(billingAddress.state);
  billTo.setZip(billingAddress.zip);
  billTo.setCountry(billingAddress.country);
  customerPaymentProfile.setBillTo(billTo);

  // Check if customer profile exists
  let customerProfileId = existingCustomer?.authorizenet_customer_profile_id;

  if (!customerProfileId) {
    // Create new customer profile
    const profile = new ApiContracts.CustomerProfileType();
    profile.setMerchantCustomerId(`CUSTOMER-${customerId}`);
    profile.setEmail(email);
    profile.setPaymentProfiles([customerPaymentProfile]);

    const createRequest = new ApiContracts.CreateCustomerProfileRequest();
    createRequest.setMerchantAuthentication(merchantAuth);
    createRequest.setProfile(profile);
    createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);

    const ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());

    // Set environment
    if (process.env.AUTHORIZENET_ENVIRONMENT === 'production') {
      ctrl.setEnvironment(SDKConstants.endpoint.production);
    }

    const response = await new Promise((resolve, reject) => {
      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

        if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
          resolve({
            customerProfileId: response.getCustomerProfileId(),
            paymentProfileId: response.getCustomerPaymentProfileIdList().getNumericString()[0]
          });
        } else {
          reject(new Error(response.getMessages().getMessage()[0].getText()));
        }
      });
    });

    customerProfileId = response.customerProfileId;
    paymentProfileId = response.paymentProfileId;

    // Update customer record with profile ID
    await supabase
      .from('customers')
      .update({ authorizenet_customer_profile_id: customerProfileId })
      .eq('id', customerId);

  } else {
    // Add payment profile to existing customer
    const createPaymentProfileRequest = new ApiContracts.CreateCustomerPaymentProfileRequest();
    createPaymentProfileRequest.setMerchantAuthentication(merchantAuth);
    createPaymentProfileRequest.setCustomerProfileId(customerProfileId);
    createPaymentProfileRequest.setPaymentProfile(customerPaymentProfile);
    createPaymentProfileRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);

    const ctrl = new ApiControllers.CreateCustomerPaymentProfileController(createPaymentProfileRequest.getJSON());

    if (process.env.AUTHORIZENET_ENVIRONMENT === 'production') {
      ctrl.setEnvironment(SDKConstants.endpoint.production);
    }

    paymentProfileId = await new Promise((resolve, reject) => {
      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new ApiContracts.CreateCustomerPaymentProfileResponse(apiResponse);

        if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
          resolve(response.getCustomerPaymentProfileId());
        } else {
          reject(new Error(response.getMessages().getMessage()[0].getText()));
        }
      });
    });
  }

  // Save to database
  const { data: paymentMethod, error } = await supabase
    .from('payment_methods')
    .insert({
      customer_id: customerId,
      type: 'card',
      customer_profile_id: customerProfileId,
      payment_profile_id: paymentProfileId,
      last_four: cardNumber.slice(-4),
      card_brand: detectCardBrand(cardNumber),
      expiry_month: expiryMonth,
      expiry_year: expiryYear,
      is_default: isDefault,
    })
    .select()
    .single();

  return NextResponse.json({ success: true, paymentMethod });
}
```

### Task 3: Implement Charge Payment Method (Daily Billing)

**File:** `/app/api/cron/process-subscriptions/route.ts` (lines 288-311)

**Current Placeholder:**
```typescript
async function chargePaymentMethod(
  paymentMethod: any,
  amount: number,
  invoiceNumber: string
): Promise<string> {
  if (!process.env.AUTHORIZENET_API_LOGIN_ID || !process.env.AUTHORIZENET_TRANSACTION_KEY) {
    console.warn('[Payment] Authorize.net credentials not configured - simulating successful payment');
    return `SIM-${Date.now()}`;
  }

  throw new Error('Authorize.net integration not yet implemented');
}
```

**What It Needs:**
```typescript
import ApiContracts from 'authorizenet/lib/apicontracts';
import ApiControllers from 'authorizenet/lib/apicontrollers';
import { SDKConstants } from 'authorizenet/lib/constants';

async function chargePaymentMethod(
  paymentMethod: any,
  amount: number,
  invoiceNumber: string
): Promise<string> {
  if (!process.env.AUTHORIZENET_API_LOGIN_ID || !process.env.AUTHORIZENET_TRANSACTION_KEY) {
    throw new Error('Authorize.net credentials not configured');
  }

  const merchantAuth = new ApiContracts.MerchantAuthenticationType();
  merchantAuth.setName(process.env.AUTHORIZENET_API_LOGIN_ID);
  merchantAuth.setTransactionKey(process.env.AUTHORIZENET_TRANSACTION_KEY);

  const profileToCharge = new ApiContracts.CustomerProfilePaymentType();
  profileToCharge.setCustomerProfileId(paymentMethod.customer_profile_id);

  const paymentProfile = new ApiContracts.PaymentProfile();
  paymentProfile.setPaymentProfileId(paymentMethod.payment_profile_id);
  profileToCharge.setPaymentProfile(paymentProfile);

  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequestType.setProfile(profileToCharge);
  transactionRequestType.setAmount(amount);
  transactionRequestType.setOrder({
    invoiceNumber: invoiceNumber,
    description: 'Waggin Meals Subscription'
  });

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuth);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

  if (process.env.AUTHORIZENET_ENVIRONMENT === 'production') {
    ctrl.setEnvironment(SDKConstants.endpoint.production);
  }

  return new Promise((resolve, reject) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.CreateTransactionResponse(apiResponse);

      if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
        const transResponse = response.getTransactionResponse();

        if (transResponse.getMessages() != null) {
          resolve(transResponse.getTransId());
        } else {
          const errorCode = transResponse.getErrors().getError()[0].getErrorCode();
          const errorText = transResponse.getErrors().getError()[0].getErrorText();
          reject(new Error(`${errorCode}: ${errorText}`));
        }
      } else {
        const errorText = response.getMessages().getMessage()[0].getText();
        reject(new Error(errorText));
      }
    });
  });
}
```

### Task 4: Implement Charge Payment Method (Retry Cron)

**File:** `/app/api/cron/retry-failed-payments/route.ts` (lines 331-345)

**Implementation:** Same as Task 3 - just copy the `chargePaymentMethod` function from Task 3 into this file.

---

## Testing Checklist

### Sandbox Testing

1. **Setup:**
   - [ ] Create Authorize.net Sandbox account
   - [ ] Get API Login ID and Transaction Key
   - [ ] Add credentials to `.env.local`
   - [ ] Set `AUTHORIZENET_ENVIRONMENT=sandbox`

2. **Payment Tokenization:**
   - [ ] Test with valid test card (4111111111111111)
   - [ ] Test with invalid card (4000000000000002)
   - [ ] Test with expired card
   - [ ] Verify customer profile created in Authorize.net dashboard
   - [ ] Verify payment profile created
   - [ ] Check database record saved correctly

3. **Daily Billing Cron:**
   - [ ] Create test subscription in database
   - [ ] Set `next_billing_date` to today
   - [ ] Run cron manually: `curl -X POST http://localhost:3000/api/cron/process-subscriptions -H "Authorization: Bearer YOUR_CRON_SECRET"`
   - [ ] Verify invoice created
   - [ ] Verify payment charged successfully
   - [ ] Verify transaction ID saved
   - [ ] Verify receipt email sent via GHL
   - [ ] Verify order created for fulfillment
   - [ ] Check Authorize.net dashboard for transaction

4. **Failed Payment Retry:**
   - [ ] Use test card that declines (4000000000000341)
   - [ ] Verify invoice marked as failed
   - [ ] Verify subscription marked as past_due
   - [ ] Verify payment failed email sent
   - [ ] Verify `next_retry_at` date set correctly
   - [ ] Wait for retry date and run retry cron
   - [ ] Verify retry attempts work correctly
   - [ ] Verify cancellation after 3 failed attempts

5. **Error Handling:**
   - [ ] Test with missing customer data (should log CRITICAL error)
   - [ ] Test with invalid payment profile ID
   - [ ] Test with deleted payment method
   - [ ] Verify all errors logged with full context

### Production Readiness

- [ ] Switch to production API credentials
- [ ] Set `AUTHORIZENET_ENVIRONMENT=production`
- [ ] Test with real credit card (your own)
- [ ] Verify SSL certificate valid
- [ ] Verify PCI compliance (no card numbers stored in logs)
- [ ] Set up monitoring/alerting for failed payments
- [ ] Document rollback plan

---

## Error Handling

All three functions should handle these errors:

**Common Errors:**
- `E00027` - Invalid credentials
- `E00040` - Card declined
- `E00041` - Insufficient funds
- `E00042` - Expired card
- `E00051` - Duplicate transaction

**Error Response Pattern:**
```typescript
try {
  const transactionId = await chargePaymentMethod(...);
  // Success handling
} catch (error: any) {
  console.error('[Payment] Failed:', error.message);

  // Parse Authorize.net error codes
  if (error.message.includes('E00040')) {
    throw new Error('Card declined - please update your payment method');
  } else if (error.message.includes('E00041')) {
    throw new Error('Insufficient funds');
  } else if (error.message.includes('E00042')) {
    throw new Error('Card expired - please update your payment method');
  } else {
    throw new Error(`Payment failed: ${error.message}`);
  }
}
```

---

## Database Migration Needed

Add this column to the `customers` table:

```sql
-- Add Authorize.net customer profile ID to customers table
ALTER TABLE customers
ADD COLUMN authorizenet_customer_profile_id VARCHAR(50);

-- Index for faster lookups
CREATE INDEX idx_customers_authorizenet_profile
ON customers(authorizenet_customer_profile_id);
```

---

## Security Considerations

**PCI Compliance:**
- ✅ Never store full card numbers
- ✅ Never log CVV codes
- ✅ Use Authorize.net CIM tokenization
- ✅ HTTPS only (enforced by Netlify/Vercel)
- ✅ Environment variables for credentials

**API Security:**
- ✅ Cron endpoints protected with CRON_SECRET
- ✅ Customer portal requires authentication
- ✅ Payment method creation requires valid customer session

---

## Useful Resources

- **Authorize.net CIM Guide:** https://developer.authorize.net/api/reference/features/customer_profiles.html
- **Node.js SDK Docs:** https://github.com/AuthorizeNet/sdk-node
- **Test Card Numbers:** https://developer.authorize.net/hello_world/testing_guide/
- **Error Codes:** https://developer.authorize.net/api/reference/responseCodes.html

---

## Timeline Estimate

**Day 1: Setup & Tokenization (4-6 hours)**
- Install SDK
- Implement payment tokenization
- Test with sandbox
- Add database migration

**Day 2: Billing Automation (3-4 hours)**
- Implement daily billing charge function
- Implement retry charge function
- Test both crons end-to-end

**Day 3: Testing & Debugging (4-6 hours)**
- Full end-to-end testing
- Error handling verification
- Edge cases
- Documentation updates

**Total: 11-16 hours over 3 days**

---

## Next Steps After Implementation

1. **Test Thoroughly:**
   - Run through entire testing checklist
   - Verify all emails sent correctly
   - Check database records accurate
   - Monitor for any errors

2. **Production Deploy:**
   - Add production credentials to hosting environment
   - Set `AUTHORIZENET_ENVIRONMENT=production`
   - Deploy to production
   - Test with real card (small amount)

3. **Migration:**
   - Migrate Shopify subscribers to new system
   - Import existing payment methods (if possible)
   - Set up first billing dates
   - Notify customers of migration

4. **Monitor:**
   - Watch cron job logs daily for first week
   - Check Authorize.net dashboard for transactions
   - Monitor email delivery (GHL)
   - Track failed payment rate

---

**Last Updated:** January 28, 2025
**Status:** Ready for Implementation
**Blocker:** Waiting for Authorize.net API credentials
