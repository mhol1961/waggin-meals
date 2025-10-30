/**
 * Payment Types for Authorize.net Integration
 * Waggin Meals - E-Commerce Platform
 */

// Payment method types
export type PaymentMethod = 'credit_card' | 'saved_card';
export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

// Transaction status
export type TransactionStatus =
  | 'authorized'
  | 'captured'
  | 'settled'
  | 'voided'
  | 'declined'
  | 'error'
  | 'refunded'
  | 'partially_refunded';

// Card information (never store full card numbers!)
export interface CreditCardInfo {
  cardNumber: string;      // Full number (only for tokenization, never stored)
  expirationMonth: string; // MM format
  expirationYear: string;  // YYYY format
  cardCode: string;        // CVV (never stored)
  cardType?: CardType;
}

// Billing address
export interface BillingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  phone?: string;
  email?: string;
}

// Payment token from Accept.js
export interface PaymentToken {
  opaqueData: {
    dataDescriptor: string; // "COMMON.ACCEPT.INAPP.PAYMENT"
    dataValue: string;      // Tokenized payment data
  };
}

// Transaction request
export interface TransactionRequest {
  amount: number;
  paymentToken?: PaymentToken;
  customerProfileId?: string;     // For CIM saved cards
  customerPaymentProfileId?: string; // For CIM saved cards
  orderId?: string;
  description?: string;
  customerId?: string;
  customerEmail?: string;
  billingAddress?: BillingAddress;
  shippingAddress?: BillingAddress;
  taxAmount?: number;
  shippingAmount?: number;
  invoiceNumber?: string;
}

// Transaction response from Authorize.net
export interface TransactionResponse {
  success: boolean;
  transactionId?: string;
  authCode?: string;
  responseCode: string;
  responseText: string;
  avsResultCode?: string;
  cvvResultCode?: string;
  accountNumber?: string; // Last 4 digits
  accountType?: string;
  errors?: Array<{
    errorCode: string;
    errorText: string;
  }>;
}

// Refund request
export interface RefundRequest {
  transactionId: string;
  amount: number;
  lastFourDigits: string;
  reason?: string;
}

// Payment record in database
export interface Payment {
  id: string;
  order_id: string;
  customer_id?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  transaction_id?: string;
  auth_code?: string;
  payment_method: PaymentMethod;
  card_type?: CardType;
  last_four?: string;
  response_code?: string;
  response_text?: string;
  avs_result?: string;
  cvv_result?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Transaction log in database
export interface Transaction {
  id: string;
  payment_id: string;
  transaction_type: 'authorize' | 'capture' | 'refund' | 'void';
  amount: number;
  status: TransactionStatus;
  transaction_id?: string;
  auth_code?: string;
  response_code?: string;
  response_text?: string;
  error_message?: string;
  request_data?: Record<string, any>;
  response_data?: Record<string, any>;
  created_at: string;
}

// Customer payment profile (CIM)
export interface CustomerPaymentProfile {
  id: string;
  customer_id: string;
  authorize_net_profile_id: string;
  authorize_net_payment_profile_id: string;
  card_type?: CardType;
  last_four: string;
  expiration_month: string;
  expiration_year: string;
  billing_address?: BillingAddress;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Accept.js response (client-side tokenization)
export interface AcceptJsResponse {
  messages: {
    resultCode: 'Ok' | 'Error';
    message: Array<{
      code: string;
      text: string;
    }>;
  };
  opaqueData?: {
    dataDescriptor: string;
    dataValue: string;
  };
}

// Payment validation errors
export interface PaymentValidationError {
  field: string;
  message: string;
}

// Payment form state
export interface PaymentFormData {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cardCode: string;
  billingAddress: BillingAddress;
  saveCard?: boolean;
}

// API response types
export interface PaymentApiResponse {
  success: boolean;
  payment?: Payment;
  transaction?: Transaction;
  error?: string;
  validationErrors?: PaymentValidationError[];
}

export interface RefundApiResponse {
  success: boolean;
  refund?: Transaction;
  error?: string;
}

// Environment configuration
export interface AuthorizeNetConfig {
  apiLoginId: string;
  transactionKey: string;
  clientKey: string;
  environment: 'sandbox' | 'production';
}

// Card validation
export interface CardValidation {
  isValid: boolean;
  cardType?: CardType;
  errors: PaymentValidationError[];
}

// Payment intent (for tracking)
export interface PaymentIntent {
  id: string;
  order_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  customer_id?: string;
  payment_method?: PaymentMethod;
  error_message?: string;
  created_at: string;
  updated_at: string;
}
