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
    apiLoginId: process.env.AUTHORIZE_NET_API_LOGIN_ID || '',
    transactionKey: process.env.AUTHORIZE_NET_TRANSACTION_KEY || '',
    clientKey: process.env.AUTHORIZE_NET_CLIENT_KEY || '',
    environment: (process.env.AUTHORIZE_NET_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
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

// Export type for convenience
export type { TransactionRequest, TransactionResponse, RefundRequest, CardValidation };
