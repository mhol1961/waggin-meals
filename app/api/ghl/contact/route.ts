import { NextRequest, NextResponse } from 'next/server';

/**
 * GoHighLevel Contact Webhook Handler
 *
 * This endpoint receives contact form submissions and sends them to GoHighLevel CRM.
 *
 * SETUP INSTRUCTIONS:
 * 1. Get your GHL API key from: Settings > API Keys in your GoHighLevel account
 * 2. Get your Location ID from: Settings > Business Profile
 * 3. Add these to your .env.local file:
 *    - GHL_API_KEY=your_api_key_here
 *    - GHL_LOCATION_ID=your_location_id_here
 * 4. Optional: Set GHL_ENABLED=true when ready to activate
 *
 * API Documentation: https://highlevel.stoplight.io/docs/integrations/
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message, source } = body;

    // Validate required fields
    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    // Check if GHL integration is enabled
    const ghlEnabled = process.env.GHL_ENABLED === 'true';
    const ghlApiKey = process.env.GHL_API_KEY;
    const ghlLocationId = process.env.GHL_LOCATION_ID;

    if (!ghlEnabled) {
      console.log('[GHL Placeholder] Would send contact to GoHighLevel:', {
        firstName,
        lastName,
        email,
        phone,
        source: source || 'website-contact-form'
      });

      return NextResponse.json({
        success: true,
        message: 'Contact received (GHL integration not yet configured)',
        placeholder: true
      });
    }

    if (!ghlApiKey || !ghlLocationId) {
      console.error('[GHL Error] Missing API credentials');
      return NextResponse.json(
        { error: 'GHL integration not properly configured' },
        { status: 500 }
      );
    }

    // Send to GoHighLevel
    const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        locationId: ghlLocationId,
        firstName,
        lastName,
        email,
        phone,
        source: source || 'website-contact-form',
        tags: ['website-lead', 'contact-form'],
        customFields: message ? [
          {
            key: 'message',
            value: message
          }
        ] : undefined
      })
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('[GHL Error]', errorText);
      throw new Error(`GHL API error: ${ghlResponse.status}`);
    }

    const ghlData = await ghlResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Contact added to GoHighLevel',
      contactId: ghlData.contact?.id
    });

  } catch (error) {
    console.error('[GHL Contact Error]', error);
    return NextResponse.json(
      {
        error: 'Failed to process contact',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
