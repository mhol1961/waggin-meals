import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * POST /api/consultations/questionnaire
 *
 * Saves paid consultation questionnaire data BEFORE payment.
 * Creates a paid_consultations record with status='questionnaire_pending'
 * Returns consultation ID for checkout process.
 */

interface DogInfo {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: 'male' | 'female';
  spayedNeutered: 'yes' | 'no' | 'unknown';
}

interface CurrentDiet {
  currentFood: string;
  durationOnDiet: string;
  portionSize: string;
  feedingFrequency: string;
}

interface HealthInfo {
  allergies?: string;
  sensitivities?: string;
  chronicConditions?: string;
  medications?: string;
  recentVetVisits?: string;
}

interface QuestionnaireRequest {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;

  // Dog Information (supports multiple dogs)
  dogs: DogInfo[];

  // Diet Information
  currentDiet: CurrentDiet;

  // Health Information
  healthInfo?: HealthInfo;

  // Goals & Preferences
  goals: string;
  preferredFormat: 'zoom' | 'facetime' | 'in-person' | '';
  specialRequests?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuestionnaireRequest = await request.json();
    const supabase = createServerClient();

    // =============================================
    // Validate Required Fields
    // =============================================
    const errors: string[] = [];

    if (!body.firstName) errors.push('First name is required');
    if (!body.lastName) errors.push('Last name is required');
    if (!body.email) errors.push('Email is required');
    if (!body.phone) errors.push('Phone is required');
    if (!body.dogs || body.dogs.length === 0) errors.push('At least one dog is required');
    if (!body.currentDiet?.currentFood) errors.push('Current diet information is required');
    if (!body.goals) errors.push('Goals are required');

    // Validate dog information
    if (body.dogs) {
      body.dogs.forEach((dog, index) => {
        if (!dog.name) errors.push(`Dog #${index + 1}: Name is required`);
        if (!dog.breed) errors.push(`Dog #${index + 1}: Breed is required`);
        if (!dog.age) errors.push(`Dog #${index + 1}: Age is required`);
        if (!dog.weight) errors.push(`Dog #${index + 1}: Weight is required`);
      });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // =============================================
    // Check if Customer Exists
    // =============================================
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', body.email)
      .single();

    const customerId = existingCustomer?.id || null;

    // =============================================
    // Save Paid Consultation to Database
    // =============================================
    const consultationData = {
      customer_id: customerId,
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      city: body.city || null,
      state: body.state || null,

      // JSONB fields
      dogs: body.dogs,
      current_diet: body.currentDiet,
      health_info: body.healthInfo || null,

      // Goals & preferences
      goals: body.goals,
      preferred_format: body.preferredFormat || '',
      special_requests: body.specialRequests || null,

      // Initial status
      status: 'questionnaire_pending',
      questionnaire_completed_at: new Date().toISOString(),
    };

    const { data: consultation, error: consultationError } = await supabase
      .from('paid_consultations')
      .insert([consultationData])
      .select('id, email, first_name, last_name')
      .single();

    if (consultationError) {
      console.error('Error saving paid consultation:', consultationError);
      return NextResponse.json(
        {
          error: 'Failed to save consultation questionnaire',
          details: consultationError.message
        },
        { status: 500 }
      );
    }

    console.log('✅ Paid consultation questionnaire saved:', {
      id: consultation.id,
      email: consultation.email,
      dogs: body.dogs.length,
      status: 'questionnaire_pending',
    });

    // =============================================
    // Return Success Response
    // =============================================
    return NextResponse.json({
      success: true,
      consultationId: consultation.id,
      message: 'Questionnaire saved successfully. Proceed to payment.',
      nextStep: {
        action: 'redirect_to_checkout',
        productHandle: 'nutrition-consultation-395',
        consultationId: consultation.id,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing paid consultation questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to process questionnaire' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/consultations/questionnaire?id={consultationId}
 *
 * Retrieves a consultation questionnaire by ID
 * Used for pre-filling data or checking status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const consultationId = searchParams.get('id');

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Consultation ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: consultation, error } = await supabase
      .from('paid_consultations')
      .select('*')
      .eq('id', consultationId)
      .single();

    if (error || !consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      consultation,
    }, { status: 200 });

  } catch (error) {
    console.error('Error retrieving consultation:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve consultation' },
      { status: 500 }
    );
  }
}
