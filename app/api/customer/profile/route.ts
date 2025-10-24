import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomerFromSession } from '@/lib/customer-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('customer_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = await getCustomerFromSession(sessionToken);

    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, phone, email } = body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it's already in use
    if (email !== customer.email) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .single();

      if (existingCustomer && existingCustomer.id !== customer.id) {
        return NextResponse.json(
          { error: 'Email address is already in use' },
          { status: 400 }
        );
      }
    }

    // Update profile
    const { data: updatedCustomer, error } = await supabase
      .from('customers')
      .update({
        first_name,
        last_name,
        email,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, customer: updatedCustomer });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
