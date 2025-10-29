import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as GHL from '@/lib/ghl-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

/**
 * POST /api/subscriptions/[id]/update-address
 * Update the shipping address for a subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { shipping_address }: { shipping_address: ShippingAddress } = body;

    // Validate required fields
    if (!shipping_address) {
      return NextResponse.json(
        { error: 'shipping_address is required' },
        { status: 400 }
      );
    }

    const requiredFields = ['first_name', 'last_name', 'address', 'city', 'state', 'zip', 'country'];
    for (const field of requiredFields) {
      if (!shipping_address[field as keyof ShippingAddress]) {
        return NextResponse.json(
          { error: `${field} is required in shipping_address` },
          { status: 400 }
        );
      }
    }

    // Get current subscription
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentSub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update subscription with new address
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        shipping_address,
        metadata: {
          ...currentSub.metadata,
          last_address_update: new Date().toISOString(),
          address_change_count: (currentSub.metadata?.address_change_count || 0) + 1,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating address:', updateError);
      return NextResponse.json(
        { error: 'Failed to update address' },
        { status: 500 }
      );
    }

    // Log history
    await supabase.from('subscription_history').insert([
      {
        subscription_id: params.id,
        action: 'address_updated',
        old_status: currentSub.status,
        new_status: currentSub.status,
        notes: 'Shipping address updated by customer',
        actor_type: 'customer',
        metadata: {
          old_address: currentSub.shipping_address,
          new_address: shipping_address,
        },
      },
    ]);

    // Send notification to GoHighLevel
    const { data: customer } = await supabase
      .from('customers')
      .select('email, first_name, last_name, phone')
      .eq('id', subscription.customer_id)
      .single();

    if (customer) {
      await GHL.notifySubscriptionAddressChanged({
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        subscription_id: subscription.id,
        old_address: currentSub.shipping_address,
        new_address: shipping_address,
        next_billing_date: subscription.next_billing_date,
      });
    }

    return NextResponse.json({
      subscription,
      message: 'Shipping address updated successfully.',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in POST /api/subscriptions/[id]/update-address:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
