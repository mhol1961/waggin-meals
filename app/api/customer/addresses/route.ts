import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomerFromSession } from '@/lib/customer-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create new address
export async function POST(request: NextRequest) {
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
    const {
      first_name,
      last_name,
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
      country,
      phone,
      is_default,
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !address_line1 || !city || !state || !zip_code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If this is being set as default, unset other defaults
    if (is_default) {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customer.id);
    }

    // Create address
    const { data: address, error } = await supabase
      .from('customer_addresses')
      .insert({
        customer_id: customer.id,
        first_name,
        last_name,
        address_line1,
        address_line2: address_line2 || null,
        city,
        state,
        zip_code,
        country: country || 'US',
        phone: phone || null,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating address:', error);
      return NextResponse.json(
        { error: 'Failed to create address' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, address });

  } catch (error) {
    console.error('Address creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
