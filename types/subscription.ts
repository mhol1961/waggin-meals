export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due' | 'expired';
export type SubscriptionType = 'bundle' | 'product';
export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly' | '4-weeks' | '6-weeks' | '8-weeks';

export interface SubscriptionItem {
  product_id?: string;
  bundle_id?: string;
  quantity: number;
  price: number;
  name: string;
  customization?: Record<string, any>;
}

export interface Subscription {
  id: string;
  customer_id: string;
  order_id?: string;

  // Subscription details
  status: SubscriptionStatus;
  type: SubscriptionType;

  // Billing schedule
  frequency: SubscriptionFrequency;
  interval_count: number;
  next_billing_date: string;
  last_billing_date?: string;
  started_at: string;
  cancelled_at?: string;
  paused_at?: string;

  // Pricing
  amount: number;
  currency: string;
  discount_percentage: number;

  // Items
  items: SubscriptionItem[];

  // Payment
  payment_method_id?: string;

  // Metadata
  notes?: string;
  metadata: Record<string, any>;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type CardType = 'Visa' | 'Mastercard' | 'Amex' | 'Discover';

export interface BillingAddress {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  customer_id: string;

  // Authorize.net CIM
  authorize_net_profile_id?: string;
  authorize_net_payment_profile_id?: string;

  // Card details (masked)
  // These fields are optional because Accept.js doesn't provide them
  card_type?: CardType;
  last_four?: string;
  expiration_month?: number;
  expiration_year?: number;

  // Billing address
  billing_address?: BillingAddress;

  // Status
  is_default: boolean;
  is_active: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface SubscriptionInvoice {
  id: string;
  subscription_id: string;
  order_id?: string;

  // Invoice details
  invoice_number: string;
  status: InvoiceStatus;

  // Amounts
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;

  // Payment
  payment_method_id?: string;
  transaction_id?: string;

  // Dates
  billing_date: string;
  due_date: string;
  paid_at?: string;

  // Retry tracking
  attempt_count: number;
  last_attempt_at?: string;
  next_retry_at?: string;

  // Metadata
  metadata: Record<string, any>;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type SubscriptionAction =
  | 'created'
  | 'updated'
  | 'paused'
  | 'resumed'
  | 'cancelled'
  | 'payment_failed'
  | 'payment_succeeded'
  | 'items_changed'
  | 'frequency_changed'
  | 'payment_method_changed';

export type ActorType = 'customer' | 'admin' | 'system';

export interface SubscriptionHistory {
  id: string;
  subscription_id: string;

  // Change details
  action: SubscriptionAction;
  old_status?: SubscriptionStatus;
  new_status?: SubscriptionStatus;
  changed_fields?: Record<string, any>;

  // Actor
  actor_type: ActorType;
  actor_id?: string;

  // Notes
  notes?: string;

  // Timestamp
  created_at: string;
}

// API Request/Response types
export interface CreateSubscriptionRequest {
  customer_id: string;
  type: SubscriptionType;
  frequency: SubscriptionFrequency;
  items: SubscriptionItem[];
  payment_method_id?: string;
  discount_percentage?: number;
  start_date?: string;
}

export interface UpdateSubscriptionRequest {
  frequency?: SubscriptionFrequency;
  items?: SubscriptionItem[];
  payment_method_id?: string;
  next_billing_date?: string;
}

export interface PauseSubscriptionRequest {
  reason?: string;
  resume_date?: string;
}

export interface CreatePaymentMethodRequest {
  customer_id: string;
  card_number: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
  billing_address: BillingAddress;
  is_default?: boolean;
}

export interface AuthorizeNetCustomerProfile {
  customerProfileId: string;
  paymentProfileId: string;
  customerEmail: string;
}

export interface AuthorizeNetTransactionResponse {
  transactionId: string;
  responseCode: string;
  authCode?: string;
  avsResultCode?: string;
  cvvResultCode?: string;
  accountNumber?: string;
  accountType?: string;
}
