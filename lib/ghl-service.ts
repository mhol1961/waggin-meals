/**
 * GoHighLevel (GHL) Integration Service
 *
 * Sends subscription events to GoHighLevel for customer communication automation
 * GHL workflows handle all email notifications, SMS, and marketing automation
 */

interface GHLWebhookPayload {
  event_type: string;
  customer: {
    email: string;
    first_name: string;
    last_name?: string;
    phone?: string;
  };
  subscription?: {
    id: string;
    status: string;
    frequency: string;
    amount: number;
    next_billing_date: string;
    items: Array<{
      product_name: string;
      variant_title?: string;
      quantity: number;
      price: number;
    }>;
  };
  payment?: {
    invoice_number: string;
    transaction_id?: string;
    amount: number;
    billing_date: string;
    attempt_count?: number;
    next_retry_date?: string;
    error_message?: string;
  };
  metadata?: Record<string, any>;
}

/**
 * Send webhook event to GoHighLevel
 */
async function sendGHLWebhook(payload: GHLWebhookPayload): Promise<boolean> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('GHL_WEBHOOK_URL not configured. Webhook not sent.');
    console.log('Event details:', payload.event_type, payload.customer.email);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add GHL API key if required
        ...(process.env.GHL_API_KEY ? { 'Authorization': `Bearer ${process.env.GHL_API_KEY}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send GHL webhook:', error);
      return false;
    }

    console.log(`GHL webhook sent successfully: ${payload.event_type} for ${payload.customer.email}`);
    return true;
  } catch (error) {
    console.error('Error sending GHL webhook:', error);
    return false;
  }
}

/**
 * Send subscription created event to GHL
 */
export async function notifySubscriptionCreated(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.created',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
  });
}

/**
 * Send subscription payment success event to GHL
 */
export async function notifySubscriptionPaymentSuccess(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  invoice_number: string;
  transaction_id?: string;
  billing_date: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.payment.success',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
    payment: {
      invoice_number: data.invoice_number,
      transaction_id: data.transaction_id,
      amount: data.amount,
      billing_date: data.billing_date,
    },
  });
}

/**
 * Send subscription payment failed event to GHL
 */
export async function notifySubscriptionPaymentFailed(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  invoice_number: string;
  attempt_count: number;
  next_retry_date: string;
  error_message?: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.payment.failed',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: data.attempt_count >= 3 ? 'past_due' : 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
    payment: {
      invoice_number: data.invoice_number,
      amount: data.amount,
      billing_date: new Date().toISOString().split('T')[0],
      attempt_count: data.attempt_count,
      next_retry_date: data.next_retry_date,
      error_message: data.error_message,
    },
  });
}

/**
 * Send subscription paused event to GHL
 */
export async function notifySubscriptionPaused(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  pause_reason?: string;
  resume_date?: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.paused',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'paused',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: '', // No next billing while paused
      items: data.items,
    },
    metadata: {
      pause_reason: data.pause_reason,
      resume_date: data.resume_date,
    },
  });
}

/**
 * Send subscription resumed event to GHL
 */
export async function notifySubscriptionResumed(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  next_billing_date: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.resumed',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: data.items,
    },
  });
}

/**
 * Send subscription cancelled event to GHL
 */
export async function notifySubscriptionCancelled(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  amount: number;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
  cancellation_reason?: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.cancelled',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'cancelled',
      frequency: data.frequency,
      amount: data.amount,
      next_billing_date: '', // No future billing
      items: data.items,
    },
    metadata: {
      cancellation_reason: data.cancellation_reason,
    },
  });
}

/**
 * Send delivery skipped event to GHL
 */
export async function notifyDeliverySkipped(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  frequency: string;
  old_delivery_date: string;
  new_delivery_date: string;
  skip_reason?: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.delivery_skipped',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.frequency,
      amount: 0, // Not relevant for skip event
      next_billing_date: data.new_delivery_date,
      items: [],
    },
    metadata: {
      old_delivery_date: data.old_delivery_date,
      new_delivery_date: data.new_delivery_date,
      skip_reason: data.skip_reason,
    },
  });
}

/**
 * Send subscription frequency changed event to GHL
 */
export async function notifySubscriptionFrequencyChanged(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  old_frequency: string;
  new_frequency: string;
  next_billing_date: string;
  amount: number;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.frequency_changed',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: data.new_frequency,
      amount: data.amount,
      next_billing_date: data.next_billing_date,
      items: [],
    },
    metadata: {
      old_frequency: data.old_frequency,
      new_frequency: data.new_frequency,
    },
  });
}

/**
 * Send subscription address changed event to GHL
 */
export async function notifySubscriptionAddressChanged(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  old_address: any;
  new_address: any;
  next_billing_date: string;
}): Promise<boolean> {
  return sendGHLWebhook({
    event_type: 'subscription.address_changed',
    customer: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      phone: data.customer_phone,
    },
    subscription: {
      id: data.subscription_id,
      status: 'active',
      frequency: '', // Not relevant for address change
      amount: 0,
      next_billing_date: data.next_billing_date,
      items: [],
    },
    metadata: {
      old_address: data.old_address,
      new_address: data.new_address,
    },
  });
}

/**
 * Check if GHL integration is configured
 */
export function isGHLConfigured(): boolean {
  return !!process.env.GHL_WEBHOOK_URL;
}

/**
 * =============================================================================
 * GHL DIRECT API INTEGRATION (for tag-based contact management)
 * =============================================================================
 *
 * The functions below use the GHL REST API to create/update contacts with tags.
 * This is used for newsletter signups, consultations, and customer lifecycle events.
 *
 * Key Principle: TAGS ACCUMULATE - never remove tags, only add them.
 * This allows sophisticated segmentation and multi-workflow automation.
 */

const GHL_API_BASE_URL = 'https://rest.gohighlevel.com/v1';

export interface GHLContact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}

export interface GHLSyncResult {
  success: boolean;
  contactId?: string;
  error?: string;
  addedTags?: string[];
}

/**
 * Get GHL API credentials from environment
 */
function getGHLConfig() {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.error('GHL credentials missing:', {
      hasApiKey: !!apiKey,
      hasLocationId: !!locationId
    });
  }

  return { apiKey, locationId };
}

/**
 * Make an API request to GHL with retry logic
 */
async function ghlRequest(
  endpoint: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  const { apiKey } = getGHLConfig();

  if (!apiKey) {
    throw new Error('GHL API key not configured');
  }

  const url = `${GHL_API_BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { ...options, headers });

      // If successful or client error (4xx), return immediately
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Server error (5xx), retry
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw new Error('GHL request failed after retries');
}

/**
 * Get an existing contact by email
 */
export async function getContactByEmail(email: string): Promise<any | null> {
  try {
    const response = await ghlRequest(`/contacts/?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Failed to get GHL contact:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    // GHL returns an array of contacts
    if (data.contacts && data.contacts.length > 0) {
      return data.contacts[0];
    }

    return null;
  } catch (error) {
    console.error('Error getting GHL contact:', error);
    return null;
  }
}

/**
 * Create a new contact in GHL
 */
async function createContact(contact: GHLContact): Promise<GHLSyncResult> {
  const { locationId } = getGHLConfig();

  if (!locationId) {
    return { success: false, error: 'GHL location ID not configured' };
  }

  try {
    const payload: any = {
      email: contact.email,
      locationId,
    };

    if (contact.firstName) payload.firstName = contact.firstName;
    if (contact.lastName) payload.lastName = contact.lastName;
    if (contact.phone) payload.phone = contact.phone;
    if (contact.tags && contact.tags.length > 0) payload.tags = contact.tags;
    if (contact.customFields) payload.customField = contact.customFields;

    const response = await ghlRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create GHL contact:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();

    return {
      success: true,
      contactId: data.contact?.id,
      addedTags: contact.tags || [],
    };
  } catch (error) {
    console.error('Error creating GHL contact:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update an existing contact in GHL
 * IMPORTANT: This ACCUMULATES tags - never removes existing tags
 */
async function updateContact(
  contactId: string,
  contact: GHLContact,
  existingTags: string[] = []
): Promise<GHLSyncResult> {
  try {
    const payload: any = {};

    if (contact.firstName) payload.firstName = contact.firstName;
    if (contact.lastName) payload.lastName = contact.lastName;
    if (contact.phone) payload.phone = contact.phone;
    if (contact.customFields) payload.customField = contact.customFields;

    // TAG ACCUMULATION: Combine existing tags with new tags
    if (contact.tags && contact.tags.length > 0) {
      const allTags = [...new Set([...existingTags, ...contact.tags])];
      payload.tags = allTags;
    }

    const response = await ghlRequest(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update GHL contact:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();

    return {
      success: true,
      contactId: data.contact?.id,
      addedTags: contact.tags || [],
    };
  } catch (error) {
    console.error('Error updating GHL contact:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Sync a contact to GHL (create or update with tag accumulation)
 *
 * This is the main function to use for all GHL contact syncs.
 * It handles creating new contacts or updating existing ones,
 * and ALWAYS accumulates tags rather than replacing them.
 *
 * @param contact - Contact data to sync
 * @returns Sync result with success status and contact ID
 */
export async function syncContactToGHL(contact: GHLContact): Promise<GHLSyncResult> {
  try {
    // Check if contact already exists
    const existingContact = await getContactByEmail(contact.email);

    if (existingContact) {
      // Update existing contact (tags will accumulate)
      const existingTags = existingContact.tags || [];
      return await updateContact(existingContact.id, contact, existingTags);
    } else {
      // Create new contact
      return await createContact(contact);
    }
  } catch (error) {
    console.error('Error syncing contact to GHL:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Add tags to an existing contact
 * This is a convenience function that only adds tags without updating other fields
 */
export async function addTagsToContact(
  email: string,
  tags: string[]
): Promise<GHLSyncResult> {
  return syncContactToGHL({
    email,
    tags,
  });
}

/**
 * Remove specific tags from a contact
 * USE WITH CAUTION: This goes against the tag accumulation principle.
 * Only use for special cases like subscription cancellation.
 */
export async function removeTagsFromContact(
  email: string,
  tagsToRemove: string[]
): Promise<GHLSyncResult> {
  try {
    const existingContact = await getContactByEmail(email);

    if (!existingContact) {
      return { success: false, error: 'Contact not found' };
    }

    const existingTags = existingContact.tags || [];
    const newTags = existingTags.filter((tag: string) => !tagsToRemove.includes(tag));

    const payload = { tags: newTags };

    const response = await ghlRequest(`/contacts/${existingContact.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    return { success: true, contactId: existingContact.id };
  } catch (error) {
    console.error('Error removing tags from GHL contact:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update custom fields for a contact
 */
export async function updateCustomFields(
  email: string,
  fields: Record<string, string>
): Promise<GHLSyncResult> {
  return syncContactToGHL({
    email,
    customFields: fields,
  });
}

/**
 * Log GHL sync attempt to database (for tracking/debugging)
 * This should be called by the API route after attempting a GHL sync
 */
export function logGHLSync(
  tableName: string,
  recordId: string,
  result: GHLSyncResult,
  supabase: any
) {
  const logData: any = {
    ghl_last_sync_at: new Date().toISOString(),
  };

  if (result.success && result.contactId) {
    logData.ghl_contact_id = result.contactId;
    if (result.addedTags && result.addedTags.length > 0) {
      logData.ghl_tags = result.addedTags;
    }
    logData.ghl_sync_error = null; // Clear any previous errors
  } else {
    logData.ghl_sync_error = result.error || 'Unknown error';
  }

  // Don't await - fire and forget to avoid blocking
  supabase
    .from(tableName)
    .update(logData)
    .eq('id', recordId)
    .then((response: any) => {
      if (response.error) {
        console.error('Failed to log GHL sync:', response.error);
      }
    });
}
