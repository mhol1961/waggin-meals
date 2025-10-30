import {
  generateOrderConfirmationEmail,
  generateOrderShippedEmail,
  generateOrderProcessingEmail,
  generateOrderOutForDeliveryEmail,
  generateOrderDeliveredEmail
} from './email-templates';

const GHL_API_BASE = 'https://services.leadconnectorhq.com';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Get or create a contact in GHL and return contact ID
 */
async function getOrCreateGHLContact(email: string, firstName?: string, lastName?: string, phone?: string): Promise<string | null> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!email || email.trim() === '') {
    console.error('[GHL] Cannot create contact without valid email');
    return null;
  }

  if (!apiKey || !locationId) {
    console.warn('[GHL] GHL_API_KEY or GHL_LOCATION_ID not configured. Skipping email.');
    console.log('[GHL] Email would be sent to:', email);
    return null;
  }

  try {
    // Search for existing contact
    const searchResponse = await fetch(
      `${GHL_API_BASE}/contacts/?locationId=${locationId}&email=${encodeURIComponent(email)}`,
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
        console.log(`[GHL] Found existing contact: ${searchData.contacts[0].id}`);
        return searchData.contacts[0].id;
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
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        tags: ['customer'],
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
 * Send email via GHL Conversations API
 */
export async function sendEmail({ to, subject, html, text, firstName, lastName, phone }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.warn('[GHL] GHL_API_KEY or GHL_LOCATION_ID not configured. Email not sent.');
    console.log('[GHL] Email details:', { to, subject });
    return false;
  }

  try {
    // Get or create contact
    const contactId = await getOrCreateGHLContact(to, firstName, lastName, phone);

    if (!contactId) {
      console.error('[GHL] Failed to get/create contact for email');
      return false;
    }

    // Send email via GHL
    const response = await fetch(`${GHL_API_BASE}/conversations/messages/email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        contactId,
        subject,
        html,
        emailFrom: process.env.EMAIL_FROM || 'orders@wagginmeals.com',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[GHL] Failed to send email:', error);
      return false;
    }

    console.log(`[GHL] Email sent successfully: ${subject} to ${to}`);
    return true;

  } catch (error) {
    console.error('[GHL] Error sending email:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(orderData: any): Promise<boolean> {
  const { subject, html, text } = generateOrderConfirmationEmail(orderData);

  return sendEmail({
    to: orderData.customer_email,
    subject,
    html,
    text,
    firstName: orderData.customer_first_name || orderData.shipping_address?.first_name,
    lastName: orderData.customer_last_name || orderData.shipping_address?.last_name,
    phone: orderData.shipping_address?.phone,
  });
}

export async function sendOrderShippedEmail(orderData: any): Promise<boolean> {
  const { subject, html, text } = generateOrderShippedEmail(orderData);

  return sendEmail({
    to: orderData.customer_email,
    subject,
    html,
    text,
    firstName: orderData.customer_first_name,
    lastName: orderData.customer_last_name,
  });
}

export async function sendAdminOrderNotification(orderData: any): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured. Admin notification not sent.');
    return false;
  }

  const subject = `New Order #${orderData.order_number} - Waggin Meals`;
  const html = `
    <h2>New Order Received</h2>
    <p><strong>Order Number:</strong> ${orderData.order_number}</p>
    <p><strong>Customer:</strong> ${orderData.customer_first_name} ${orderData.customer_last_name}</p>
    <p><strong>Email:</strong> ${orderData.customer_email}</p>
    <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
    <p><strong>Items:</strong></p>
    <ul>
      ${orderData.items.map((item: any) => `
        <li>${item.product_name} ${item.variant_title ? `(${item.variant_title})` : ''} - Qty: ${item.quantity}</li>
      `).join('')}
    </ul>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${orderData.id}">View Order Details</a></p>
  `;
  const text = `
New Order Received

Order Number: ${orderData.order_number}
Customer: ${orderData.customer_first_name} ${orderData.customer_last_name}
Email: ${orderData.customer_email}
Total: $${orderData.total.toFixed(2)}

View order: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${orderData.id}
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
    text,
  });
}
