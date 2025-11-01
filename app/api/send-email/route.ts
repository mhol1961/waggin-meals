import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import {
  generateOrderConfirmationEmail,
  generateOrderShippedEmail,
  generateOrderProcessingEmail,
  generateOrderOutForDeliveryEmail,
  generateOrderDeliveredEmail,
  generateSubscriptionCreatedEmail
} from '@/lib/email-templates';

/**
 * POST /api/send-email
 * Send transactional emails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    if (!type || !to || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, to, data' },
        { status: 400 }
      );
    }

    let emailContent: { subject: string; html: string; text: string };

    switch (type) {
      case 'order_confirmation':
        emailContent = generateOrderConfirmationEmail(data);
        break;

      case 'order_processing':
        emailContent = generateOrderProcessingEmail(data);
        break;

      case 'order_shipped':
        emailContent = generateOrderShippedEmail(data);
        break;

      case 'order_out_for_delivery':
        emailContent = generateOrderOutForDeliveryEmail(data);
        break;

      case 'order_delivered':
        emailContent = generateOrderDeliveredEmail(data);
        break;

      case 'subscription_created':
        emailContent = generateSubscriptionCreatedEmail(data);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    const success = await sendEmail({
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      firstName: data.customer_first_name || data.shipping_address?.first_name,
      lastName: data.customer_last_name || data.shipping_address?.last_name,
      phone: data.shipping_address?.phone,
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in POST /api/send-email:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
