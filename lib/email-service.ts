import { generateOrderConfirmationEmail, generateOrderShippedEmail } from './email-templates';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email not sent.');
    console.log('Email details:', { to, subject });
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Waggin Meals <orders@wagginmeals.com>',
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', error);
      return false;
    }

    const data = await response.json();
    console.log('Email sent successfully:', data.id);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
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
  });
}

export async function sendOrderShippedEmail(orderData: any): Promise<boolean> {
  const { subject, html, text } = generateOrderShippedEmail(orderData);

  return sendEmail({
    to: orderData.customer_email,
    subject,
    html,
    text,
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
