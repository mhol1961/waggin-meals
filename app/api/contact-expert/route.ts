import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { createServerClient } from '@/lib/supabase/server';

interface PetInfo {
  name: string;
  breed: string;
  weight: string;
  bodyCondition: string;
  recentHealthIssues: string;
  allergies: string;
  currentFeeding: string;
  activityLevel: string;
  healthGoals: string;
  supplements: string;
  behavioralChanges: string;
  proteinPreferences: string;
  includeBoneBroth: string;
  mealType: string;
}

interface ConsultationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  currentSpending: string;
  deliveryFrequency: string;
  additionalNotes: string;
  pets: PetInfo[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationRequest = await request.json();
    const supabase = createServerClient();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required contact information' },
        { status: 400 }
      );
    }

    if (!body.pets || body.pets.length === 0 || !body.pets[0].name) {
      return NextResponse.json(
        { error: 'At least one pet name is required' },
        { status: 400 }
      );
    }

    // =============================================
    // STEP 1: Check if customer exists by email
    // =============================================
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', body.email)
      .single();

    const customerId = existingCustomer?.id || null;

    // =============================================
    // STEP 2: Save pet profiles to database
    // =============================================
    const petProfileIds: string[] = [];

    for (const pet of body.pets) {
      const petData = {
        customer_id: customerId,
        name: pet.name || '',
        breed: pet.breed || '',
        weight: pet.weight || '',
        body_condition: pet.bodyCondition || '',
        recent_health_issues: pet.recentHealthIssues || '',
        allergies: pet.allergies || '',
        current_feeding: pet.currentFeeding || '',
        activity_level: pet.activityLevel || '',
        health_goals: pet.healthGoals || '',
        supplements: pet.supplements || '',
        behavioral_changes: pet.behavioralChanges || '',
        protein_preferences: pet.proteinPreferences || '',
        include_bone_broth: pet.includeBoneBroth || '',
        meal_type: pet.mealType || '',
      };

      const { data: petProfile, error: petError } = await supabase
        .from('pet_profiles')
        .insert([petData])
        .select('id')
        .single();

      if (petError) {
        console.error('Error saving pet profile:', petError);
        // Continue even if one pet fails - we'll still process the consultation
      } else if (petProfile) {
        petProfileIds.push(petProfile.id);
      }
    }

    // =============================================
    // STEP 3: Save consultation request to database
    // =============================================
    const consultationData = {
      customer_id: customerId,
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      zip_code: body.zipCode || '',
      current_spending: body.currentSpending ? parseFloat(body.currentSpending) : null,
      delivery_frequency: body.deliveryFrequency || '',
      additional_notes: body.additionalNotes || '',
      pet_profile_ids: petProfileIds,
      status: 'pending',
    };

    const { data: consultationRequest, error: consultationError } = await supabase
      .from('consultation_requests')
      .insert([consultationData])
      .select('id')
      .single();

    if (consultationError) {
      console.error('Error saving consultation request:', consultationError);
      return NextResponse.json(
        { error: 'Failed to save consultation request', details: consultationError.message },
        { status: 500 }
      );
    }

    // =============================================
    // STEP 4: Send to GoHighLevel CRM for automation
    // =============================================
    let ghlSyncStatus = 'not_configured';
    let ghlSyncError = null;

    if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
      try {
        // Build custom fields object (only if field IDs are configured)
        const customField: Record<string, string> = {};
        if (process.env.GHL_CUSTOM_FIELD_CONSULTATION_ID) {
          customField[process.env.GHL_CUSTOM_FIELD_CONSULTATION_ID] = consultationRequest.id;
        }
        if (process.env.GHL_CUSTOM_FIELD_PET_COUNT) {
          customField[process.env.GHL_CUSTOM_FIELD_PET_COUNT] = body.pets.length.toString();
        }
        if (process.env.GHL_CUSTOM_FIELD_SPENDING) {
          customField[process.env.GHL_CUSTOM_FIELD_SPENDING] = body.currentSpending || '';
        }
        if (process.env.GHL_CUSTOM_FIELD_FREQUENCY) {
          customField[process.env.GHL_CUSTOM_FIELD_FREQUENCY] = body.deliveryFrequency || '';
        }

        const ghlPayload = {
          locationId: process.env.GHL_LOCATION_ID,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          address1: body.address || '',
          city: body.city || '',
          state: body.state || '',
          postalCode: body.zipCode || '',
          tags: ['free-consultation', 'contact-expert-form'],
          ...(Object.keys(customField).length > 0 && { customField }),
        };

        console.log('🔄 Syncing to GoHighLevel CRM...', { email: body.email, locationId: process.env.GHL_LOCATION_ID });

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

          // Update consultation request with GHL contact ID and success status
          await supabase
            .from('consultation_requests')
            .update({
              ghl_contact_id: ghlData.contact?.id || ghlData.id,
              ghl_synced_at: new Date().toISOString(),
            })
            .eq('id', consultationRequest.id);

          ghlSyncStatus = 'success';
          console.log('✅ Successfully synced to GoHighLevel CRM', { contactId: ghlData.contact?.id || ghlData.id });
        } else {
          ghlSyncStatus = 'failed';
          ghlSyncError = `HTTP ${ghlResponse.status}: ${ghlResponseText}`;
          console.error('❌ GoHighLevel API error:', {
            status: ghlResponse.status,
            statusText: ghlResponse.statusText,
            response: ghlResponseText,
          });

          // Store error in database for admin visibility
          await supabase
            .from('consultation_requests')
            .update({
              admin_notes: `GHL Sync Failed: ${ghlSyncError}`,
            })
            .eq('id', consultationRequest.id);
        }
      } catch (ghlError) {
        ghlSyncStatus = 'error';
        ghlSyncError = ghlError instanceof Error ? ghlError.message : 'Unknown error';
        console.error('❌ Error syncing to GoHighLevel:', ghlError);

        // Store error in database
        await supabase
          .from('consultation_requests')
          .update({
            admin_notes: `GHL Sync Error: ${ghlSyncError}`,
          })
          .eq('id', consultationRequest.id);
      }
    } else {
      const missingVars = [];
      if (!process.env.GHL_API_KEY) missingVars.push('GHL_API_KEY');
      if (!process.env.GHL_LOCATION_ID) missingVars.push('GHL_LOCATION_ID');
      console.warn(`⚠️ GHL sync disabled - missing: ${missingVars.join(', ')}`);
    }

    // =============================================
    // STEP 5: Send email notifications
    // =============================================

    // Build pet sections for email
    const petSections = body.pets.map((pet, index) => `
      <div style="background-color: #e8f4fb; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #8FAE8F;">
        <h3 style="color: #3c3a47; margin-top: 0;">Pet #${index + 1}: ${pet.name || 'Not provided'}</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; width: 40%;"><strong>Breed:</strong></td>
            <td style="padding: 8px 0;">${pet.breed || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Weight:</strong></td>
            <td style="padding: 8px 0;">${pet.weight || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Body Condition:</strong></td>
            <td style="padding: 8px 0;">${pet.bodyCondition || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Activity Level:</strong></td>
            <td style="padding: 8px 0;">${pet.activityLevel || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Meal Type:</strong></td>
            <td style="padding: 8px 0;">${pet.mealType || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Include Bone Broth:</strong></td>
            <td style="padding: 8px 0;">${pet.includeBoneBroth || 'Not provided'}</td>
          </tr>
        </table>

        ${pet.recentHealthIssues ? `
          <div style="margin-top: 15px;">
            <strong>Recent Health Issues/Surgeries:</strong><br/>
            ${pet.recentHealthIssues}
          </div>
        ` : ''}

        ${pet.allergies ? `
          <div style="margin-top: 15px;">
            <strong>Food Allergies/Sensitivities:</strong><br/>
            ${pet.allergies}
          </div>
        ` : ''}

        ${pet.currentFeeding ? `
          <div style="margin-top: 15px;">
            <strong>Current Feeding Routine:</strong><br/>
            ${pet.currentFeeding}
          </div>
        ` : ''}

        ${pet.healthGoals ? `
          <div style="margin-top: 15px;">
            <strong>Health Goals:</strong><br/>
            ${pet.healthGoals}
          </div>
        ` : ''}

        ${pet.supplements ? `
          <div style="margin-top: 15px;">
            <strong>Current Supplements/Medications:</strong><br/>
            ${pet.supplements}
          </div>
        ` : ''}

        ${pet.behavioralChanges ? `
          <div style="margin-top: 15px;">
            <strong>Behavioral/Appetite Changes:</strong><br/>
            ${pet.behavioralChanges}
          </div>
        ` : ''}

        ${pet.proteinPreferences ? `
          <div style="margin-top: 15px;">
            <strong>Protein Preferences:</strong><br/>
            ${pet.proteinPreferences}
          </div>
        ` : ''}
      </div>
    `).join('');

    const emailHtml = `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #8FAE8F, #F8F5F0); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-family: 'Abril Fatface', serif; font-size: 32px;">
            New Free Consultation Request
          </h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px;">

          <!-- Consultation ID -->
          <div style="background-color: #fff3cd; padding: 15px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              <strong>Consultation ID:</strong> ${consultationRequest.id}<br/>
              <strong>Database:</strong> [SAVED] consultation_requests table<br/>
              <strong>Pet Profiles:</strong> [SAVED] ${petProfileIds.length} pet(s) saved to pet_profiles table
            </p>
          </div>

          <!-- Contact Information -->
          <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #8FAE8F;">
            <h2 style="color: #3c3a47; margin-top: 0;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 30%;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${body.firstName} ${body.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${body.email}">${body.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0;"><a href="tel:${body.phone}">${body.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Address:</strong></td>
                <td style="padding: 8px 0;">
                  ${body.address}<br/>
                  ${body.city}, ${body.state} ${body.zipCode}
                </td>
              </tr>
            </table>
          </div>

          <!-- Pet Information -->
          <h2 style="color: #3c3a47;">Pet Information (${body.pets.length} ${body.pets.length === 1 ? 'Pet' : 'Pets'})</h2>
          ${petSections}

          <!-- Budget & Delivery Preferences -->
          <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #8FAE8F;">
            <h2 style="color: #3c3a47; margin-top: 0;">Budget & Delivery Preferences</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 40%;"><strong>Current Weekly Spending:</strong></td>
                <td style="padding: 8px 0;">${body.currentSpending || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Preferred Delivery Frequency:</strong></td>
                <td style="padding: 8px 0;">${body.deliveryFrequency || 'Not provided'}</td>
              </tr>
            </table>
          </div>

          ${body.additionalNotes ? `
            <div style="background-color: #fff3cd; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h2 style="color: #3c3a47; margin-top: 0;">Additional Notes</h2>
              <p style="margin: 0; white-space: pre-wrap;">${body.additionalNotes}</p>
            </div>
          ` : ''}

          <!-- Action Items -->
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">Next Steps</h3>
            <ol style="color: #155724; margin: 0; padding-left: 20px;">
              <li>Review the pet information and health concerns</li>
              <li>Contact the client within 24-48 hours</li>
              <li>Schedule the free consultation</li>
              <li>Prepare personalized nutrition recommendations</li>
              <li>View in admin dashboard: <a href="https://wagginmeals.com/admin/consultations">Admin Consultations</a></li>
            </ol>
          </div>

        </div>

        <div style="background-color: #3c3a47; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #ffffff; margin: 0; font-size: 14px;">
            Waggin Meals Pet Nutrition Co.<br/>
            <a href="mailto:info@wagginmeals.com" style="color: #8FAE8F;">info@wagginmeals.com</a>
          </p>
        </div>
      </div>
    `;

    // Plain-text version
    const emailText = `NEW FREE CONSULTATION REQUEST

DATABASE SAVED
Consultation ID: ${consultationRequest.id}
Pet Profiles: ${petProfileIds.length} pet(s) saved

CONTACT INFORMATION
Name: ${body.firstName} ${body.lastName}
Email: ${body.email}
Phone: ${body.phone}
Address: ${body.address}, ${body.city}, ${body.state} ${body.zipCode}

PET INFORMATION (${body.pets.length} ${body.pets.length === 1 ? 'Pet' : 'Pets'})
${body.pets.map((pet: any, index: number) => `
Pet ${index + 1}: ${pet.name}
- Breed: ${pet.breed}
- Weight: ${pet.weight}
- Body Condition: ${pet.bodyCondition}
- Activity Level: ${pet.activityLevel}
- Meal Type: ${pet.mealType}
${pet.recentHealthIssues ? `- Health Issues: ${pet.recentHealthIssues}` : ''}
${pet.allergies ? `- Allergies: ${pet.allergies}` : ''}
${pet.currentFeeding ? `- Current Feeding: ${pet.currentFeeding}` : ''}
${pet.healthGoals ? `- Health Goals: ${pet.healthGoals}` : ''}
${pet.supplements ? `- Supplements: ${pet.supplements}` : ''}
${pet.behavioralChanges ? `- Behavioral Changes: ${pet.behavioralChanges}` : ''}
${pet.proteinPreferences ? `- Protein Preferences: ${pet.proteinPreferences}` : ''}
`).join('\n')}

BUDGET & DELIVERY PREFERENCES
Current Weekly Spending: ${body.currentSpending || 'Not provided'}
Preferred Delivery Frequency: ${body.deliveryFrequency || 'Not provided'}
${body.additionalNotes ? `\nADDITIONAL NOTES\n${body.additionalNotes}` : ''}

NEXT STEPS
1. Review the pet information and health concerns
2. Contact the client within 24-48 hours
3. Schedule the free consultation
4. Prepare personalized nutrition recommendations

---
Waggin Meals Pet Nutrition Co.
info@wagginmeals.com`;

    // Send email to Christie
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@wagginmeals.com',
      subject: `New Free Consultation Request - ${body.firstName} ${body.lastName} (${body.pets.length} ${body.pets.length === 1 ? 'pet' : 'pets'})`,
      html: emailHtml,
      text: emailText,
    });

    // Send confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #8FAE8F, #F8F5F0); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-family: 'Abril Fatface', serif; font-size: 32px;">
            Thank You!
          </h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px;">
          <p style="font-size: 16px; color: #3c3a47;">Hi ${body.firstName},</p>

          <p style="font-size: 16px; color: #3c3a47;">
            Thank you for requesting a free nutrition consultation for ${body.pets.map(p => p.name).filter(n => n).join(', ')}!
          </p>

          <p style="font-size: 16px; color: #3c3a47;">
            We've received your information and are excited to help create a personalized nutrition plan tailored to your pet's unique needs.
          </p>

          <div style="background-color: #e8f4fb; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #8FAE8F;">
            <h3 style="color: #3c3a47; margin-top: 0;">What Happens Next?</h3>
            <ul style="color: #3c3a47; line-height: 1.8;">
              <li>We'll review your pet's information within 24-48 hours</li>
              <li>One of our certified nutritionists will contact you to schedule your consultation</li>
              <li>You'll receive a personalized nutrition plan and product recommendations</li>
              <li>We'll answer all your questions and provide ongoing support</li>
            </ul>
          </div>

          <p style="font-size: 16px; color: #3c3a47;">
            If you have any immediate questions, please don't hesitate to reach out at
            <a href="mailto:info@wagginmeals.com" style="color: #8FAE8F;">info@wagginmeals.com</a>.
          </p>

          <p style="font-size: 16px; color: #3c3a47; margin-top: 30px;">
            Warm regards,<br/>
            <strong>Christie & The Waggin Meals Team</strong>
          </p>
        </div>

        <div style="background-color: #3c3a47; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #ffffff; margin: 0; font-size: 14px;">
            Waggin Meals Pet Nutrition Co.<br/>
            <a href="mailto:info@wagginmeals.com" style="color: #8FAE8F;">info@wagginmeals.com</a><br/>
            <a href="https://wagginmeals.com" style="color: #8FAE8F;">wagginmeals.com</a>
          </p>
        </div>
      </div>
    `;

    const customerEmailText = `Thank You!

Hi ${body.firstName},

Thank you for requesting a free nutrition consultation for ${body.pets.map(p => p.name).filter(n => n).join(', ')}!

We've received your information and are excited to help create a personalized nutrition plan tailored to your pet's unique needs.

WHAT HAPPENS NEXT?

- We'll review your pet's information within 24-48 hours
- One of our certified nutritionists will contact you to schedule your consultation
- You'll receive a personalized nutrition plan and product recommendations
- We'll answer all your questions and provide ongoing support

If you have any immediate questions, please don't hesitate to reach out at info@wagginmeals.com.

Warm regards,
Christie & The Waggin Meals Team

---
Waggin Meals Pet Nutrition Co.
info@wagginmeals.com
wagginmeals.com`;

    await sendEmail({
      to: body.email,
      subject: 'Thank You for Your Consultation Request - Waggin Meals',
      html: customerEmailHtml,
      text: customerEmailText,
    });

    return NextResponse.json(
      {
        message: 'Consultation request submitted successfully',
        consultationId: consultationRequest.id,
        petProfileCount: petProfileIds.length,
        ghlSyncStatus,
        ...(ghlSyncError && { ghlSyncError }),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing consultation request:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation request' },
      { status: 500 }
    );
  }
}
