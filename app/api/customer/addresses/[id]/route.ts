import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomerFromSession } from '@/lib/customer-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// Update address
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('customer_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = await getCustomerFromSession(sessionToken);

    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify address belongs to customer
    const { data: existingAddress } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('id', id)
      .eq('customer_id', customer.id)
      .single();

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
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

    // If this is being set as default, unset other defaults
    if (is_default) {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customer.id);
    }

    // Update address
    const { data: address, error } = await supabase
      .from('customer_addresses')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('customer_id', customer.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating address:', error);
      return NextResponse.json(
        { error: 'Failed to update address' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, address });

  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete address
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('customer_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = await getCustomerFromSession(sessionToken);

    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify address belongs to customer
    const { data: existingAddress } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('id', id)
      .eq('customer_id', customer.id)
      .single();

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Delete address
    const { error } = await supabase
      .from('customer_addresses')
      .delete()
      .eq('id', id)
      .eq('customer_id', customer.id);

    if (error) {
      console.error('Error deleting address:', error);
      return NextResponse.json(
        { error: 'Failed to delete address' },
        { status: 500 }
      );
    }

    // If the deleted address was default, set another as default
    if (existingAddress.is_default) {
      const { data: otherAddresses } = await supabase
        .from('customer_addresses')
        .select('id')
        .eq('customer_id', customer.id)
        .limit(1);

      if (otherAddresses && otherAddresses.length > 0) {
        await supabase
          .from('customer_addresses')
          .update({ is_default: true })
          .eq('id', otherAddresses[0].id);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Address deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
