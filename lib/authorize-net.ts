/**
 * Authorize.net CIM (Customer Information Manager) Service
 *
 * This service handles payment tokenization and recurring billing via Authorize.net
 *
 * Required environment variables:
 * - AUTHORIZENET_API_LOGIN_ID
 * - AUTHORIZENET_TRANSACTION_KEY
 * - AUTHORIZENET_ENVIRONMENT ('sandbox' or 'production')
 */

import type {
  AuthorizeNetCustomerProfile,
  AuthorizeNetTransactionResponse,
  BillingAddress,
} from '@/types/subscription';

const API_LOGIN_ID = process.env.AUTHORIZENET_API_LOGIN_ID;
const TRANSACTION_KEY = process.env.AUTHORIZENET_TRANSACTION_KEY;
const ENVIRONMENT = process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox';

const API_ENDPOINT =
  ENVIRONMENT === 'production'
    ? 'https://api.authoriz

enet.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api';

interface AuthorizeNetRequest {
  [key: string]: any;
}

/**
 * Make API request to Authorize.net
 */
async function makeRequest(requestType: string, requestData: AuthorizeNetRequest) {
  if (!API_LOGIN_ID || !TRANSACTION_KEY) {
    throw new Error('Authorize.net credentials not configured. Please add AUTHORIZENET_API_LOGIN_ID and AUTHORIZENET_TRANSACTION_KEY to environment variables.');
  }

  const request = {
    [requestType]: {
      merchantAuthentication: {
        name: API_LOGIN_ID,
        transactionKey: TRANSACTION_KEY,
      },
      ...requestData,
    },
  };

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Authorize.net API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Create a customer profile in Authorize.net CIM
 */
export async function createCustomerProfile(
  customerId: string,
  email: string,
  cardNumber: string,
  expirationDate: string, // Format: YYYY-MM
  cvv: string,
  billingAddress: BillingAddress
): Promise<AuthorizeNetCustomerProfile> {
  const response = await makeRequest('createCustomerProfileRequest', {
    profile: {
      merchantCustomerId: customerId,
      email: email,
      paymentProfiles: {
        customerType: 'individual',
        payment: {
          creditCard: {
            cardNumber: cardNumber,
            expirationDate: expirationDate,
            cardCode: cvv,
          },
        },
        billTo: {
          firstName: billingAddress.first_name,
          lastName: billingAddress.last_name,
          address: billingAddress.address,
          city: billingAddress.city,
          state: billingAddress.state,
          zip: billingAddress.zip,
          country: billingAddress.country || 'US',
        },
      },
    },
  });

  if (response.messages.resultCode !== 'Ok') {
    throw new Error(
      `Failed to create customer profile: ${response.messages.message[0].text}`
    );
  }

  return {
    customerProfileId: response.customerProfileId,
    paymentProfileId: response.customerPaymentProfileIdList[0],
    customerEmail: email,
  };
}

/**
 * Add a payment profile to an existing customer
 */
export async function addPaymentProfile(
  customerProfileId: string,
  cardNumber: string,
  expirationDate: string,
  cvv: string,
  billingAddress: BillingAddress
): Promise<string> {
  const response = await makeRequest('createCustomerPaymentProfileRequest', {
    customerProfileId: customerProfileId,
    paymentProfile: {
      customerType: 'individual',
      payment: {
        creditCard: {
          cardNumber: cardNumber,
          expirationDate: expirationDate,
          cardCode: cvv,
        },
      },
      billTo: {
        firstName: billingAddress.first_name,
        lastName: billingAddress.last_name,
        address: billingAddress.address,
        city: billingAddress.city,
        state: billingAddress.state,
        zip: billingAddress.zip,
        country: billingAddress.country || 'US',
      },
    },
  });

  if (response.messages.resultCode !== 'Ok') {
    throw new Error(
      `Failed to add payment profile: ${response.messages.message[0].text}`
    );
  }

  return response.customerPaymentProfileId;
}

/**
 * Charge a customer's payment profile
 */
export async function chargeCustomerProfile(
  customerProfileId: string,
  paymentProfileId: string,
  amount: number,
  invoiceNumber?: string,
  description?: string
): Promise<AuthorizeNetTransactionResponse> {
  const response = await makeRequest('createTransactionRequest', {
    transactionRequest: {
      transactionType: 'authCaptureTransaction',
      amount: amount.toFixed(2),
      profile: {
        customerProfileId: customerProfileId,
        paymentProfile: {
          paymentProfileId: paymentProfileId,
        },
      },
      order: invoiceNumber
        ? {
            invoiceNumber: invoiceNumber,
            description: description || 'Subscription payment',
          }
        : undefined,
    },
  });

  if (response.messages.resultCode !== 'Ok') {
    const errorMessage =
      response.transactionResponse?.errors?.[0]?.errorText ||
      response.messages.message[0].text;
    throw new Error(`Payment failed: ${errorMessage}`);
  }

  return {
    transactionId: response.transactionResponse.transId,
    responseCode: response.transactionResponse.responseCode,
    authCode: response.transactionResponse.authCode,
    avsResultCode: response.transactionResponse.avsResultCode,
    cvvResultCode: response.transactionResponse.cvvResultCode,
    accountNumber: response.transactionResponse.accountNumber,
    accountType: response.transactionResponse.accountType,
  };
}

/**
 * Get customer profile
 */
export async function getCustomerProfile(customerProfileId: string) {
  const response = await makeRequest('getCustomerProfileRequest', {
    customerProfileId: customerProfileId,
  });

  if (response.messages.resultCode !== 'Ok') {
    throw new Error(
      `Failed to get customer profile: ${response.messages.message[0].text}`
    );
  }

  return response.profile;
}

/**
 * Delete a payment profile
 */
export async function deletePaymentProfile(
  customerProfileId: string,
  paymentProfileId: string
): Promise<void> {
  const response = await makeRequest('deleteCustomerPaymentProfileRequest', {
    customerProfileId: customerProfileId,
    customerPaymentProfileId: paymentProfileId,
  });

  if (response.messages.resultCode !== 'Ok') {
    throw new Error(
      `Failed to delete payment profile: ${response.messages.message[0].text}`
    );
  }
}

/**
 * Refund a transaction
 */
export async function refundTransaction(
  transactionId: string,
  amount: number,
  last4: string
): Promise<string> {
  const response = await makeRequest('createTransactionRequest', {
    transactionRequest: {
      transactionType: 'refundTransaction',
      amount: amount.toFixed(2),
      payment: {
        creditCard: {
          cardNumber: last4,
          expirationDate: 'XXXX',
        },
      },
      refTransId: transactionId,
    },
  });

  if (response.messages.resultCode !== 'Ok') {
    throw new Error(
      `Refund failed: ${response.messages.message[0].text}`
    );
  }

  return response.transactionResponse.transId;
}

/**
 * Helper: Format expiration date for Authorize.net (YYYY-MM)
 */
export function formatExpirationDate(month: number, year: number): string {
  const paddedMonth = month.toString().padStart(2, '0');
  return `${year}-${paddedMonth}`;
}

/**
 * Helper: Parse card type from account number
 */
export function parseCardType(accountNumber?: string): string | undefined {
  if (!accountNumber) return undefined;

  const firstDigit = accountNumber[0];
  const firstTwoDigits = accountNumber.substring(0, 2);

  if (firstDigit === '4') return 'Visa';
  if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'Mastercard';
  if (['34', '37'].includes(firstTwoDigits)) return 'Amex';
  if (firstTwoDigits === '60' || accountNumber.startsWith('65')) return 'Discover';

  return undefined;
}

/**
 * Helper: Check if Authorize.net is configured
 */
export function isConfigured(): boolean {
  return !!(API_LOGIN_ID && TRANSACTION_KEY);
}
