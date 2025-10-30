/**
 * Authorize.net Payment Processing Service
 * Handles credit card transactions, refunds, and CIM integration
 */

import type {
  TransactionRequest,
  TransactionResponse,
  RefundRequest,
  CardValidation,
  CardType,
  PaymentValidationError,
  AuthorizeNetConfig,
} from '@/types/payment';

// API endpoints
const SANDBOX_URL = 'https://apitest.authorize.net/xml/v1/request.api';
const PRODUCTION_URL = 'https://api.authorize.net/xml/v1/request.api';

/**
 * Get Authorize.net configuration from environment
 */
export function getAuthorizeNetConfig(): AuthorizeNetConfig {
  const config = {
    apiLoginId: process.env.AUTHORIZENET_API_LOGIN_ID || '',
    transactionKey: process.env.AUTHORIZENET_TRANSACTION_KEY || '',
    clientKey: process.env.AUTHORIZENET_PUBLIC_CLIENT_KEY || '',
    environment: (process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
  };

  if (!config.apiLoginId || !config.transactionKey) {
    throw new Error('Authorize.net credentials not configured. Check environment variables.');
  }

  return config;
}

/**
 * Get API endpoint based on environment
 */
function getApiUrl(): string {
  const config = getAuthorizeNetConfig();
  return config.environment === 'production' ? PRODUCTION_URL : SANDBOX_URL;
}

/**
 * Create merchant authentication object
 */
function getMerchantAuthentication() {
  const config = getAuthorizeNetConfig();
  return {
    name: config.apiLoginId,
    transactionKey: config.transactionKey,
  };
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Detect card type from card number
 */
export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\D/g, '');

  // Visa: starts with 4
  if (/^4/.test(cleaned)) {
    return 'visa';
  }

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleaned) || /^(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/.test(cleaned)) {
    return 'mastercard';
  }

  // Amex: starts with 34 or 37
  if (/^3[47]/.test(cleaned)) {
    return 'amex';
  }

  // Discover: starts with 6011, 622126-622925, 644-649, or 65
  if (/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-2][0-9]|92[0-5])|64[4-9]|65)/.test(cleaned)) {
    return 'discover';
  }

  return 'other';
}

/**
 * Validate expiration date
 */
export function validateExpirationDate(month: string, year: string): boolean {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (yearNum < currentYear) {
    return false;
  }

  if (yearNum === currentYear && monthNum < currentMonth) {
    return false;
  }

  if (yearNum > currentYear + 20) {
    return false;
  }

  return true;
}

/**
 * Validate CVV code
 */
export function validateCVV(cvv: string, cardType?: CardType): boolean {
  const cleaned = cvv.replace(/\D/g, '');
  if (cardType === 'amex') {
    return cleaned.length === 4;
  }
  return cleaned.length === 3;
}

/**
 * Comprehensive card validation
 */
export function validateCard(
  cardNumber: string,
  expirationMonth: string,
  expirationYear: string,
  cvv: string
): CardValidation {
  const errors: PaymentValidationError[] = [];

  if (!validateCardNumber(cardNumber)) {
    errors.push({
      field: 'cardNumber',
      message: 'Invalid credit card number',
    });
  }

  const cardType = detectCardType(cardNumber);

  if (!validateExpirationDate(expirationMonth, expirationYear)) {
    errors.push({
      field: 'expiration',
      message: 'Card has expired or invalid date',
    });
  }

  if (!validateCVV(cvv, cardType)) {
    const expectedLength = cardType === 'amex' ? 4 : 3;
    errors.push({
      field: 'cvv',
      message: `CVV must be ${expectedLength} digits`,
    });
  }

  return {
    isValid: errors.length === 0,
    cardType,
    errors,
  };
}

/**
 * Process a payment transaction
 */
export async function processPayment(
  request: TransactionRequest
): Promise<TransactionResponse> {
  try {
    const merchantAuth = getMerchantAuthentication();
    const apiUrl = getApiUrl();

    const transactionRequestBody: any = {
      createTransactionRequest: {
        merchantAuthentication: merchantAuth,
        refId: request.orderId || `WM${Date.now()}`,
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: request.amount.toFixed(2),
          payment: {},
          order: {
            invoiceNumber: request.invoiceNumber || request.orderId,
            description: request.description || 'Waggin Meals Purchase',
          },
        },
      },
    };

    // Add payment method
    if (request.paymentToken) {
      transactionRequestBody.createTransactionRequest.transactionRequest.payment.opaqueData = {
        dataDescriptor: request.paymentToken.opaqueData.dataDescriptor,
        dataValue: request.paymentToken.opaqueData.dataValue,
      };
    } else {
      throw new Error('Payment token is required');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionRequestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const transactionResponse = data.transactionResponse;
    const messages = data.messages;

    if (messages.resultCode === 'Ok' && transactionResponse?.responseCode === '1') {
      return {
        success: true,
        transactionId: transactionResponse.transId,
        authCode: transactionResponse.authCode,
        responseCode: transactionResponse.responseCode,
        responseText: 'Transaction successful',
        accountNumber: transactionResponse.accountNumber,
      };
    } else {
      const errors = transactionResponse?.errors || messages.message;
      return {
        success: false,
        responseCode: transactionResponse?.responseCode || '3',
        responseText: transactionResponse?.messages?.[0]?.description || 'Transaction failed',
        errors: Array.isArray(errors) ? errors.map((err: any) => ({
          errorCode: err.errorCode,
          errorText: err.errorText || err.text,
        })) : [{ errorCode: '0', errorText: 'Unknown error' }],
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      responseCode: '0',
      responseText: error instanceof Error ? error.message : 'Payment failed',
      errors: [{ errorCode: '0', errorText: error instanceof Error ? error.message : 'Unknown error' }],
    };
  }
}

/**
 * Process a refund
 */
export async function processRefund(
  refundRequest: RefundRequest
): Promise<TransactionResponse> {
  try {
    const merchantAuth = getMerchantAuthentication();
    const apiUrl = getApiUrl();

    const transactionRequestBody = {
      createTransactionRequest: {
        merchantAuthentication: merchantAuth,
        refId: `RF${Date.now()}`,
        transactionRequest: {
          transactionType: 'refundTransaction',
          amount: refundRequest.amount.toFixed(2),
          payment: {
            creditCard: {
              cardNumber: refundRequest.lastFourDigits,
              expirationDate: 'XXXX',
            },
          },
          refTransId: refundRequest.transactionId,
        },
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionRequestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const transactionResponse = data.transactionResponse;
    const messages = data.messages;

    if (messages.resultCode === 'Ok' && transactionResponse?.responseCode === '1') {
      return {
        success: true,
        transactionId: transactionResponse.transId,
        responseCode: transactionResponse.responseCode,
        responseText: 'Refund processed successfully',
      };
    } else {
      return {
        success: false,
        responseCode: transactionResponse?.responseCode || '3',
        responseText: 'Refund failed',
        errors: [{ errorCode: '0', errorText: 'Refund failed' }],
      };
    }
  } catch (error) {
    console.error('Refund processing error:', error);
    return {
      success: false,
      responseCode: '0',
      responseText: error instanceof Error ? error.message : 'Refund failed',
      errors: [{ errorCode: '0', errorText: error instanceof Error ? error.message : 'Unknown error' }],
    };
  }
}

// Export types for convenience
export type { TransactionRequest, TransactionResponse, RefundRequest, CardValidation };
