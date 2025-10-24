import { NextRequest, NextResponse } from 'next/server';

/**
 * GoHighLevel Appointment Booking Handler
 *
 * This endpoint handles appointment bookings for nutrition consultations
 * and syncs them with GoHighLevel's calendar system.
 *
 * SETUP INSTRUCTIONS:
 * 1. Get your GHL API key from: Settings > API Keys
 * 2. Get your Calendar ID from: Settings > Calendars
 * 3. Get your Location ID from: Settings > Business Profile
 * 4. Add these to your .env.local file:
 *    - GHL_API_KEY=your_api_key_here
 *    - GHL_CALENDAR_ID=your_calendar_id_here
 *    - GHL_LOCATION_ID=your_location_id_here
 * 5. Optional: Set GHL_ENABLED=true when ready to activate
 *
 * API Documentation: https://highlevel.stoplight.io/docs/integrations/
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      appointmentType,
      selectedDate,
      selectedTime,
      timezone,
      notes
    } = body;

    // Validate required fields
    if (!email || !firstName || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: 'Email, name, date, and time are required' },
        { status: 400 }
      );
    }

    // Check if GHL integration is enabled
    const ghlEnabled = process.env.GHL_ENABLED === 'true';
    const ghlApiKey = process.env.GHL_API_KEY;
    const ghlCalendarId = process.env.GHL_CALENDAR_ID;
    const ghlLocationId = process.env.GHL_LOCATION_ID;

    // Combine date and time into ISO format
    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);

    if (!ghlEnabled) {
      console.log('[GHL Placeholder] Would create appointment in GoHighLevel:', {
        firstName,
        lastName,
        email,
        phone,
        appointmentType: appointmentType || 'Nutrition Consultation',
        dateTime: appointmentDateTime.toISOString(),
        timezone: timezone || 'America/New_York',
        notes
      });

      return NextResponse.json({
        success: true,
        message: 'Appointment request received (GHL integration not yet configured)',
        placeholder: true,
        appointmentDetails: {
          dateTime: appointmentDateTime.toISOString(),
          type: appointmentType || 'Nutrition Consultation'
        }
      });
    }

    if (!ghlApiKey || !ghlCalendarId || !ghlLocationId) {
      console.error('[GHL Error] Missing API credentials or calendar configuration');
      return NextResponse.json(
        { error: 'GHL integration not properly configured' },
        { status: 500 }
      );
    }

    // Step 1: Create or update contact in GHL
    const contactResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
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
        source: 'website-booking',
        tags: ['website-lead', 'consultation-requested']
      })
    });

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text();
      console.error('[GHL Contact Error]', errorText);
      throw new Error(`Failed to create contact: ${contactResponse.status}`);
    }

    const contactData = await contactResponse.json();
    const contactId = contactData.contact?.id;

    // Step 2: Create appointment in GHL calendar
    const appointmentResponse = await fetch('https://rest.gohighlevel.com/v1/appointments/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        calendarId: ghlCalendarId,
        locationId: ghlLocationId,
        contactId: contactId,
        startTime: appointmentDateTime.toISOString(),
        title: appointmentType || 'Nutrition Consultation - $395',
        appointmentStatus: 'confirmed',
        assignedUserId: undefined, // Will use calendar default
        notes: notes || undefined,
        ignoreDateRange: false
      })
    });

    if (!appointmentResponse.ok) {
      const errorText = await appointmentResponse.text();
      console.error('[GHL Appointment Error]', errorText);
      throw new Error(`Failed to create appointment: ${appointmentResponse.status}`);
    }

    const appointmentData = await appointmentResponse.json();

    // Step 3: Add tags for automation triggers
    if (contactId) {
      await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tags: ['appointment-booked', 'nutrition-consultation']
        })
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointmentId: appointmentData.appointment?.id,
      contactId: contactId,
      confirmationEmail: 'sent' // GHL will automatically send confirmation
    });

  } catch (error) {
    console.error('[GHL Booking Error]', error);
    return NextResponse.json(
      {
        error: 'Failed to process appointment booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch available time slots
 * This will query GHL calendar availability
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const timezone = searchParams.get('timezone') || 'America/New_York';

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const ghlEnabled = process.env.GHL_ENABLED === 'true';
    const ghlApiKey = process.env.GHL_API_KEY;
    const ghlCalendarId = process.env.GHL_CALENDAR_ID;

    if (!ghlEnabled) {
      // Return placeholder time slots
      return NextResponse.json({
        success: true,
        placeholder: true,
        availableSlots: [
          '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
        ],
        message: 'GHL integration not configured - showing sample slots'
      });
    }

    if (!ghlApiKey || !ghlCalendarId) {
      return NextResponse.json(
        { error: 'GHL calendar not configured' },
        { status: 500 }
      );
    }

    // Fetch available slots from GHL
    const slotsResponse = await fetch(
      `https://rest.gohighlevel.com/v1/calendars/${ghlCalendarId}/free-slots?date=${date}&timezone=${timezone}`,
      {
        headers: {
          'Authorization': `Bearer ${ghlApiKey}`,
          'Version': '2021-07-28'
        }
      }
    );

    if (!slotsResponse.ok) {
      throw new Error(`Failed to fetch slots: ${slotsResponse.status}`);
    }

    const slotsData = await slotsResponse.json();

    return NextResponse.json({
      success: true,
      availableSlots: slotsData.slots || [],
      date,
      timezone
    });

  } catch (error) {
    console.error('[GHL Slots Error]', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch available time slots',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
