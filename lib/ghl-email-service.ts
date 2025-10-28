/**
 * GoHighLevel Email Service
 *
 * Uses GHL API to send transactional and marketing emails
 * Integrates with GHL workflows for automated follow-ups
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com';

interface GHLContact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

interface GHLEmailParams {
  contactId: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Get or create a contact in GHL
 */
async function getOrCreateContact(contactData: GHLContact): Promise<string | null> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.error('GHL_API_KEY or GHL_LOCATION_ID not configured');
    return null;
  }

  try {
    // First, search for existing contact by email
    const searchResponse = await fetch(
      `${GHL_API_BASE}/contacts/?locationId=${locationId}&email=${encodeURIComponent(contactData.email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
      }
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.contacts && searchData.contacts.length > 0) {
        const existingContact = searchData.contacts[0];
        console.log(`[GHL] Found existing contact: ${existingContact.id}`);

        // Update contact with new data
        await updateContact(existingContact.id, contactData);
        return existingContact.id;
      }
    }

    // Create new contact
    const createResponse = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        email: contactData.email,
        firstName: contactData.firstName || '',
        lastName: contactData.lastName || '',
        phone: contactData.phone || '',
        tags: contactData.tags || [],
        customFields: contactData.customFields || {},
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('[GHL] Failed to create contact:', error);
      return null;
    }

    const createData = await createResponse.json();
    console.log(`[GHL] Created new contact: ${createData.contact.id}`);
    return createData.contact.id;

  } catch (error) {
    console.error('[GHL] Error getting/creating contact:', error);
    return null;
  }
}

/**
 * Update an existing contact in GHL
 */
async function updateContact(contactId: string, contactData: Partial<GHLContact>): Promise<boolean> {
  const apiKey = process.env.GHL_API_KEY;

  if (!apiKey) {
    console.error('GHL_API_KEY not configured');
    return false;
  }

  try {
    const updatePayload: any = {};

    if (contactData.firstName) updatePayload.firstName = contactData.firstName;
    if (contactData.lastName) updatePayload.lastName = contactData.lastName;
    if (contactData.phone) updatePayload.phone = contactData.phone;
    if (contactData.tags) updatePayload.tags = contactData.tags;
    if (contactData.customFields) updatePayload.customFields = contactData.customFields;

    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[GHL] Failed to update contact:', error);
      return false;
    }

    console.log(`[GHL] Updated contact: ${contactId}`);
    return true;

  } catch (error) {
    console.error('[GHL] Error updating contact:', error);
    return false;
  }
}

/**
 * Send an email via GHL Conversations API
 */
async function sendGHLEmail(params: GHLEmailParams): Promise<boolean> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.error('GHL_API_KEY or GHL_LOCATION_ID not configured');
    return false;
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/conversations/messages/email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        contactId: params.contactId,
        subject: params.subject,
        html: params.html,
        emailFrom: params.from || process.env.EMAIL_FROM || 'orders@wagginmeals.com',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[GHL] Failed to send email:', error);
      return false;
    }

    const data = await response.json();
    console.log(`[GHL] Email sent successfully: ${params.subject}`);
    return true;

  } catch (error) {
    console.error('[GHL] Error sending email:', error);
    return false;
  }
}

/**
 * Add tags to a contact to trigger workflows
 */
async function addContactTags(contactId: string, tags: string[]): Promise<boolean> {
  const apiKey = process.env.GHL_API_KEY;

  if (!apiKey) {
    console.error('GHL_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[GHL] Failed to add tags:', error);
      return false;
    }

    console.log(`[GHL] Added tags to contact ${contactId}:`, tags);
    return true;

  } catch (error) {
    console.error('[GHL] Error adding tags:', error);
    return false;
  }
}

/**
 * Send subscription receipt email
 */
export async function sendSubscriptionReceiptEmail(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  invoice_number: string;
  transaction_id: string;
  amount: number;
  billing_date: string;
  items: Array<{
    product_name: string;
    variant_title?: string;
    quantity: number;
    price: number;
  }>;
}): Promise<boolean> {
  // Get or create contact
  const contactId = await getOrCreateContact({
    email: data.customer_email,
    firstName: data.customer_first_name,
    lastName: data.customer_last_name,
    phone: data.customer_phone,
    tags: ['subscriber', 'active-subscription'],
  });

  if (!contactId) {
    console.error('[GHL] Failed to get/create contact for receipt email');
    return false;
  }

  // Generate email HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2c5f2d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .invoice-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .items-table th { background-color: #2c5f2d; color: white; padding: 10px; text-align: left; }
        .items-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 15px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Order!</h1>
          <p>Your subscription payment has been processed</p>
        </div>

        <div class="content">
          <p>Hi ${data.customer_first_name},</p>
          <p>Your subscription payment has been successfully processed. Here are the details:</p>

          <div class="invoice-details">
            <p><strong>Invoice Number:</strong> ${data.invoice_number}</p>
            <p><strong>Transaction ID:</strong> ${data.transaction_id}</p>
            <p><strong>Billing Date:</strong> ${data.billing_date}</p>
            <p><strong>Subscription ID:</strong> ${data.subscription_id}</p>
          </div>

          <h3>Order Items:</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.product_name}${item.variant_title ? ` (${item.variant_title})` : ''}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total: $${data.amount.toFixed(2)}</p>
          </div>

          <p>Your order will be prepared and shipped soon. You'll receive a shipping notification when it's on the way!</p>

          <p>If you have any questions, feel free to reply to this email or contact us at support@wagginmeals.com.</p>

          <p>Thank you for choosing Waggin' Meals!</p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Waggin' Meals Pet Nutrition Co. All rights reserved.</p>
          <p>You're receiving this email because you have an active subscription with us.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendGHLEmail({
    contactId,
    subject: `Receipt for your Waggin' Meals subscription - ${data.invoice_number}`,
    html,
  });
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedEmail(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  invoice_number: string;
  error_message: string;
  next_retry_date?: string;
}): Promise<boolean> {
  const contactId = await getOrCreateContact({
    email: data.customer_email,
    firstName: data.customer_first_name,
    lastName: data.customer_last_name,
    phone: data.customer_phone,
    tags: ['subscriber', 'payment-failed'],
  });

  if (!contactId) {
    return false;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2c5f2d; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Action Required: Payment Issue</h1>
        </div>

        <div class="content">
          <p>Hi ${data.customer_first_name},</p>

          <div class="alert">
            <strong>We were unable to process your subscription payment.</strong>
          </div>

          <p>We attempted to charge your payment method for invoice <strong>${data.invoice_number}</strong>, but the payment failed.</p>

          ${data.next_retry_date ? `
            <p>Don't worry - we'll automatically try again on <strong>${data.next_retry_date}</strong>.</p>
          ` : ''}

          <p>To avoid any interruption to your subscription, please update your payment method:</p>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/subscriptions" class="button">Update Payment Method</a>

          <p><strong>Error details:</strong> ${data.error_message}</p>

          <p>If you have any questions or need assistance, please contact us at support@wagginmeals.com or reply to this email.</p>

          <p>Thank you,<br>The Waggin' Meals Team</p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Waggin' Meals Pet Nutrition Co.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendGHLEmail({
    contactId,
    subject: 'Action Required: Update your payment method - Waggin\' Meals',
    html,
  });
}

/**
 * Send payment retry success email
 */
export async function sendPaymentRetrySuccessEmail(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  invoice_number: string;
  transaction_id: string;
  amount: number;
  attempt_number: number;
}): Promise<boolean> {
  const contactId = await getOrCreateContact({
    email: data.customer_email,
    firstName: data.customer_first_name,
    lastName: data.customer_last_name,
    phone: data.customer_phone,
    tags: ['subscriber', 'active-subscription'],
  });

  if (!contactId) {
    return false;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .success { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Successful!</h1>
        </div>

        <div class="content">
          <p>Hi ${data.customer_first_name},</p>

          <div class="success">
            <strong>Great news! Your payment has been processed successfully.</strong>
          </div>

          <p>Your subscription is now active and your order will be prepared for shipping.</p>

          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Invoice: ${data.invoice_number}</li>
            <li>Transaction ID: ${data.transaction_id}</li>
            <li>Amount: $${data.amount.toFixed(2)}</li>
          </ul>

          <p>Thank you for your patience. Your subscription will continue as scheduled!</p>

          <p>Best regards,<br>The Waggin' Meals Team</p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Waggin' Meals Pet Nutrition Co.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendGHLEmail({
    contactId,
    subject: 'Payment Successful - Your subscription is active! - Waggin\' Meals',
    html,
  });
}

/**
 * Send subscription cancelled email
 */
export async function sendSubscriptionCancelledEmail(data: {
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  subscription_id: string;
  total_attempts: number;
}): Promise<boolean> {
  const contactId = await getOrCreateContact({
    email: data.customer_email,
    firstName: data.customer_first_name,
    lastName: data.customer_last_name,
    phone: data.customer_phone,
    tags: ['subscriber', 'subscription-cancelled'],
  });

  if (!contactId) {
    return false;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6c757d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .info { background-color: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2c5f2d; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Subscription Cancelled</h1>
        </div>

        <div class="content">
          <p>Hi ${data.customer_first_name},</p>

          <div class="info">
            <p>Your subscription (ID: ${data.subscription_id}) has been cancelled due to payment issues.</p>
          </div>

          <p>After ${data.total_attempts} unsuccessful payment attempts, we've had to cancel your subscription to prevent further issues.</p>

          <p><strong>Want to reactivate your subscription?</strong></p>
          <p>We'd love to have you back! Simply update your payment method and restart your subscription:</p>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" class="button">Restart Subscription</a>

          <p>If you have any questions or need assistance, please don't hesitate to contact us at support@wagginmeals.com.</p>

          <p>We hope to see you again soon!</p>

          <p>Best regards,<br>The Waggin' Meals Team</p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Waggin' Meals Pet Nutrition Co.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendGHLEmail({
    contactId,
    subject: 'Subscription Cancelled - We\'d love to have you back - Waggin\' Meals',
    html,
  });
}

/**
 * Check if GHL is properly configured
 */
export function isGHLConfigured(): boolean {
  return !!(process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID);
}
