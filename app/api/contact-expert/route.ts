import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';

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

    // Build the email content
    const petSections = body.pets.map((pet, index) => `
      <div style="background-color: #e8f4fb; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #a5b5eb;">
        <h3 style="color: #3c3a47; margin-top: 0;">🐾 Pet #${index + 1}: ${pet.name || 'Not provided'}</h3>

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
        <div style="background: linear-gradient(to right, #a5b5eb, #c5d4f7); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-family: 'Abril Fatface', serif; font-size: 32px;">
            New Free Consultation Request
          </h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px;">

          <!-- Contact Information -->
          <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #a5b5eb;">
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
          <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #a5b5eb;">
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
            </ol>
          </div>

        </div>

        <div style="background-color: #3c3a47; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #ffffff; margin: 0; font-size: 14px;">
            Waggin Meals Pet Nutrition Co.<br/>
            <a href="mailto:info@wagginmeals.com" style="color: #a5b5eb;">info@wagginmeals.com</a>
          </p>
        </div>
      </div>
    `;

    // Send email to Christie
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@wagginmeals.com',
      subject: `New Free Consultation Request - ${body.firstName} ${body.lastName} (${body.pets.length} ${body.pets.length === 1 ? 'pet' : 'pets'})`,
      html: emailHtml,
    });

    // Send confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #a5b5eb, #c5d4f7); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
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

          <div style="background-color: #e8f4fb; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #a5b5eb;">
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
            <a href="mailto:info@wagginmeals.com" style="color: #a5b5eb;">info@wagginmeals.com</a>.
          </p>

          <p style="font-size: 16px; color: #3c3a47; margin-top: 30px;">
            Warm regards,<br/>
            <strong>Christie & The Waggin Meals Team</strong>
          </p>
        </div>

        <div style="background-color: #3c3a47; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #ffffff; margin: 0; font-size: 14px;">
            Waggin Meals Pet Nutrition Co.<br/>
            <a href="mailto:info@wagginmeals.com" style="color: #a5b5eb;">info@wagginmeals.com</a><br/>
            <a href="https://wagginmeals.com" style="color: #a5b5eb;">wagginmeals.com</a>
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: body.email,
      subject: 'Thank You for Your Consultation Request - Waggin Meals',
      html: customerEmailHtml,
    });

    return NextResponse.json(
      { message: 'Consultation request submitted successfully' },
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
