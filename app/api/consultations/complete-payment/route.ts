import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generatePaidConsultationConfirmedEmail, generateAdminNewPaidConsultationEmail } from '@/lib/consultation-email-templates';

/**
 * POST /api/consultations/complete-payment
 *
 * Called after successful payment for a paid consultation.
 * Updates consultation status from 'questionnaire_pending' to 'paid'
 * Links consultation to order
 * Triggers email notifications
 * Syncs to GoHighLevel CRM
 */

interface PaymentCompletionRequest {
  consultationId: string;
  orderId: string;
  paymentId: string;
  customerId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentCompletionRequest = await request.json();
    const supabase = createServerClient();

    // =============================================
    // Validate Required Fields
    // =============================================
    if (!body.consultationId || !body.orderId) {
      return NextResponse.json(
        { error: 'Consultation ID and Order ID are required' },
        { status: 400 }
      );
    }

    // =============================================
    // Get Consultation Record
    // =============================================
    const { data: consultation, error: consultationError } = await supabase
      .from('paid_consultations')
      .select('*')
      .eq('id', body.consultationId)
      .single();

    if (consultationError || !consultation) {
      console.error('Consultation not found:', body.consultationId, consultationError);
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // =============================================
    // Update Consultation Status
    // =============================================
    const updateData: any = {
      status: 'paid',
      order_id: body.orderId,
      payment_completed_at: new Date().toISOString(),
    };

    // If customer ID is provided, link it
    if (body.customerId) {
      updateData.customer_id = body.customerId;
    }

    const { error: updateError } = await supabase
      .from('paid_consultations')
      .update(updateData)
      .eq('id', body.consultationId);

    if (updateError) {
      console.error('Error updating consultation:', updateError);
      return NextResponse.json(
        { error: 'Failed to update consultation status', details: updateError.message },
        { status: 500 }
      );
    }

    console.log('✅ Consultation payment completed:', {
      consultationId: body.consultationId,
      orderId: body.orderId,
      status: 'paid',
    });

    // =============================================
    // Update Order with Consultation Link
    // =============================================
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({
        is_consultation: true,
        consultation_id: body.consultationId,
      })
      .eq('id', body.orderId);

    if (orderUpdateError) {
      console.error('Error updating order:', orderUpdateError);
      // Don't fail the request, just log the error
    }

    // =============================================
    // Send Confirmation Email
    // =============================================
    try {
      const emailTemplate = generatePaidConsultationConfirmedEmail({
        consultationId: consultation.id,
        customerName: `${consultation.first_name} ${consultation.last_name}`,
        email: consultation.email,
        phone: consultation.phone,
        dogs: consultation.dogs,
        preferredFormat: consultation.preferred_format,
      });

      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: consultation.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send consultation confirmation email');
      } else {
        console.log('✅ Sent consultation confirmation email to:', consultation.email);
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // =============================================
    // Send Admin Notification Email
    // =============================================
    try {
      const adminEmailTemplate = generateAdminNewPaidConsultationEmail({
        consultationId: consultation.id,
        customerName: `${consultation.first_name} ${consultation.last_name}`,
        email: consultation.email,
        phone: consultation.phone,
        dogs: consultation.dogs,
        currentDiet: consultation.current_diet,
        goals: consultation.goals,
        preferredFormat: consultation.preferred_format,
        orderId: body.orderId,
        amount: 395.00,
      });

      const adminEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL || 'info@wagginmeals.com',
          subject: adminEmailTemplate.subject,
          html: adminEmailTemplate.html,
          text: adminEmailTemplate.text,
        }),
      });

      if (!adminEmailResponse.ok) {
        console.error('Failed to send admin notification email');
      } else {
        console.log('✅ Sent admin notification email');
      }
    } catch (adminEmailError) {
      console.error('Error sending admin email:', adminEmailError);
      // Don't fail the request if email fails
    }

    // =============================================
    // Sync to GoHighLevel CRM
    // =============================================
    let ghlSyncStatus = 'not_configured';

    if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
      try {
        // Build custom fields
        const customField: Record<string, string> = {};
        if (process.env.GHL_CUSTOM_FIELD_CONSULTATION_ID) {
          customField[process.env.GHL_CUSTOM_FIELD_CONSULTATION_ID] = consultation.id;
        }

        const ghlPayload = {
          locationId: process.env.GHL_LOCATION_ID,
          firstName: consultation.first_name,
          lastName: consultation.last_name,
          email: consultation.email,
          phone: consultation.phone,
          city: consultation.city || '',
          state: consultation.state || '',
          tags: ['paid-consultation-395', 'consultation-paid'],
          ...(Object.keys(customField).length > 0 && { customField }),
        };

        console.log('🔄 Syncing paid consultation to GoHighLevel CRM...');

        const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ghlPayload),
        });

        const ghlResponseText = await ghlResponse.text();

        if (ghlResponse.ok) {
          const ghlData = JSON.parse(ghlResponseText);

          // Update consultation with GHL contact ID
          await supabase
            .from('paid_consultations')
            .update({
              ghl_contact_id: ghlData.contact?.id || ghlData.id,
              ghl_synced_at: new Date().toISOString(),
              ghl_tags: ['paid-consultation-395', 'consultation-paid'],
            })
            .eq('id', consultation.id);

          ghlSyncStatus = 'success';
          console.log('✅ Successfully synced to GoHighLevel CRM');
        } else {
          ghlSyncStatus = 'failed';
          console.error('❌ GoHighLevel API error:', ghlResponseText);

          // Store error in admin_notes
          await supabase
            .from('paid_consultations')
            .update({
              admin_notes: `GHL Sync Failed: HTTP ${ghlResponse.status}`,
            })
            .eq('id', consultation.id);
        }
      } catch (ghlError) {
        ghlSyncStatus = 'error';
        console.error('❌ Error syncing to GoHighLevel:', ghlError);

        // Store error in admin_notes
        await supabase
          .from('paid_consultations')
          .update({
            admin_notes: `GHL Sync Error: ${ghlError instanceof Error ? ghlError.message : 'Unknown error'}`,
          })
          .eq('id', consultation.id);
      }
    } else {
      console.warn('⚠️ GHL sync disabled - missing API credentials');
    }

    // =============================================
    // Return Success Response
    // =============================================
    return NextResponse.json({
      success: true,
      message: 'Consultation payment completed successfully',
      consultationId: consultation.id,
      status: 'paid',
      ghlSyncStatus,
      nextSteps: [
        'Christie will review your consultation within 24-48 hours',
        'You will receive a call to schedule your consultation',
        'Check your email for confirmation and next steps',
      ],
    }, { status: 200 });

  } catch (error) {
    console.error('Error completing consultation payment:', error);
    return NextResponse.json(
      { error: 'Failed to complete payment process' },
      { status: 500 }
    );
  }
}
