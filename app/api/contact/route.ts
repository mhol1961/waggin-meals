import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter
    // Note: For production, configure SMTP credentials in environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });

    // Email content to send to Waggin Meals
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to: 'wagginmeals@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3c3a47;">New Contact Form Submission</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #8FAE8F; margin: 20px 0;">
            <h3 style="color: #3c3a47; margin-top: 0;">Message:</h3>
            <p style="color: #666666; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="color: #999999; font-size: 12px; margin-top: 20px;">
            <p>This message was sent from the Waggin Meals contact form.</p>
          </div>
        </div>
      `,
    };

    // Auto-reply to the sender
    const autoReplyOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Waggin Meals!',
      text: `
Hi ${name},

Thank you for reaching out to Waggin Meals Pet Nutrition Co.!

We've received your message and one of our team members will get back to you within 24 hours.

In the meantime, feel free to explore:
- Our Fresh Meals: https://wagginmeals.com/shop
- Nutrition Services: https://wagginmeals.com/nutrition-services
- Free Resources: https://wagginmeals.com/blog

Best regards,
The Waggin Meals Team

---
This is an automated response. Please do not reply to this email.
      `,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(to right, #8FAE8F, #F8F5F0); padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; font-family: 'Abril Fatface', serif; margin: 0;">Waggin Meals</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0;">Pet Nutrition Co.</p>
          </div>

          <div style="padding: 40px;">
            <h2 style="color: #3c3a47; font-family: 'Abril Fatface', serif;">Thank You for Contacting Us!</h2>

            <p style="color: #666666; line-height: 1.6;">Hi ${name},</p>

            <p style="color: #666666; line-height: 1.6;">
              Thank you for reaching out to Waggin Meals Pet Nutrition Co.! We've received your message and one of our team members will get back to you within <strong>24 hours</strong>.
            </p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #3c3a47; margin-top: 0;">In the meantime, feel free to explore:</h3>
              <ul style="color: #666666; line-height: 1.8;">
                <li><a href="https://wagginmeals.com/shop" style="color: #8FAE8F; text-decoration: none;">Our Fresh Meals</a></li>
                <li><a href="https://wagginmeals.com/nutrition-services" style="color: #8FAE8F; text-decoration: none;">Nutrition Services with Christie</a></li>
                <li><a href="https://wagginmeals.com/blog" style="color: #8FAE8F; text-decoration: none;">Free Resources & Blog</a></li>
              </ul>
            </div>

            <p style="color: #666666; line-height: 1.6;">
              Best regards,<br>
              <strong>The Waggin Meals Team</strong>
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 2px solid #8FAE8F;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER && !process.env.EMAIL_USER) {
      console.log('📧 Contact form submission received (Email not sent - SMTP not configured):');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);

      return NextResponse.json({
        success: true,
        message: 'Message received! (Note: Email delivery requires SMTP configuration)',
      });
    }

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again or email us directly at wagginmeals@gmail.com',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
