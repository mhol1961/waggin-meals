import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

// Lazy-initialize SMTP transporter to avoid build-time errors
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      throw new Error('SMTP_USER and SMTP_PASS environment variables are required');
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }
  return transporter;
}

/**
 * Send an email using SMTP (nodemailer)
 * @param options - Email options (to, subject, html, optional from/replyTo)
 * @returns Promise with send result
 */
export async function sendEmail(options: SendEmailOptions) {
  const {
    to,
    subject,
    html,
    from = process.env.SMTP_USER || 'wagginmeals@gmail.com',
    replyTo = 'info@wagginmeals.com',
  } = options;

  try {
    const smtp = getTransporter();
    const result = await smtp.sendMail({
      from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      replyTo,
    });

    console.log('Email sent successfully:', result.messageId);
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
