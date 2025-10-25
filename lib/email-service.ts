import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email using Resend
 * @param options - Email options (to, subject, html, optional from/replyTo)
 * @returns Promise with send result
 */
export async function sendEmail(options: SendEmailOptions) {
  const {
    to,
    subject,
    html,
    from = 'Waggin Meals <noreply@wagginmeals.com>',
    replyTo = 'info@wagginmeals.com',
  } = options;

  try {
    const result = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    });

    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Send multiple emails in batch
 * @param emails - Array of email options
 * @returns Promise with batch send results
 */
export async function sendBatchEmails(emails: SendEmailOptions[]) {
  try {
    const results = await Promise.allSettled(
      emails.map((email) => sendEmail(email))
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Batch email send complete: ${successful} successful, ${failed} failed`);

    return results;
  } catch (error) {
    console.error('Failed to send batch emails:', error);
    throw error;
  }
}
