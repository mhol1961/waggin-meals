import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { CreatePaymentMethodRequest } from '@/types/subscription';
import * as AuthorizeNet from '@/lib/authorize-net';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/payment-methods
 * Get payment methods for a customer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json(
        { error: 'customer_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment methods:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payment methods' },
        { status: 500 }
      );
    }

    return NextResponse.json({ payment_methods: data });
  } catch (error) {
    console.error('Error in GET /api/payment-methods:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payment-methods
 * Add a new payment method
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentMethodRequest = await request.json();

    const {
      customer_id,
      card_number,
      expiration_month,
      expiration_year,
      cvv,
      billing_address,
      is_default = false,
    } = body;

    // Validate required fields
    if (!customer_id || !card_number || !expiration_month || !expiration_year || !cvv || !billing_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Authorize.net is configured
    if (!AuthorizeNet.isConfigured()) {
      return NextResponse.json(
        { error: 'Payment processor not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Get customer email (you'll need to add this to your customers table or pass it in)
    const { data: customer } = await supabase
      .from('customers')
      .select('email')
      .eq('id', customer_id)
      .single();

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if customer already has a profile
    const { data: existingPaymentMethod } = await supabase
      .from('payment_methods')
      .select('customer_profile_id')
      .eq('customer_id', customer_id)
      .limit(1)
      .single();

    let customerProfileId: string;
    let paymentProfileId: string;

    if (existingPaymentMethod?.customer_profile_id) {
      // Add payment profile to existing customer
      const expirationDate = AuthorizeNet.formatExpirationDate(expiration_month, expiration_year);
      paymentProfileId = await AuthorizeNet.addPaymentProfile(
        existingPaymentMethod.customer_profile_id,
        card_number,
        expirationDate,
        cvv,
        billing_address
      );
      customerProfileId = existingPaymentMethod.customer_profile_id;
    } else {
      // Create new customer profile
      const expirationDate = AuthorizeNet.formatExpirationDate(expiration_month, expiration_year);
      const profile = await AuthorizeNet.createCustomerProfile(
        customer_id,
        customer.email,
        card_number,
        expirationDate,
        cvv,
        billing_address
      );
      customerProfileId = profile.customerProfileId;
      paymentProfileId = profile.paymentProfileId;
    }

    // If this is set as default, unset other default methods
    if (is_default) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('customer_id', customer_id);
    }

    // Save payment method to database
    const last_four = card_number.slice(-4);
    const card_type = AuthorizeNet.parseCardType(card_number);

    const { data: paymentMethod, error } = await supabase
      .from('payment_methods')
      .insert([
        {
          customer_id,
          customer_profile_id: customerProfileId,
          payment_profile_id: paymentProfileId,
          card_type,
          last_four,
          expiration_month,
          expiration_year,
          billing_address,
          is_default,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving payment method:', error);
      return NextResponse.json(
        { error: 'Failed to save payment method' },
        { status: 500 }
      );
    }

    return NextResponse.json({ payment_method: paymentMethod }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/payment-methods:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
