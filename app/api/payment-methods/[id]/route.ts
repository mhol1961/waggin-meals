import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as AuthorizeNet from '@/lib/authorize-net';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * DELETE /api/payment-methods/[id]
 * Delete a payment method
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get payment method
    const { data: paymentMethod, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // Check if it's being used by any active subscriptions
    const { data: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('payment_method_id', params.id)
      .in('status', ['active', 'past_due']);

    if (activeSubscriptions && activeSubscriptions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete payment method that is being used by active subscriptions' },
        { status: 400 }
      );
    }

    // Delete from Authorize.net if configured
    if (AuthorizeNet.isConfigured() && paymentMethod.customer_profile_id && paymentMethod.payment_profile_id) {
      try {
        await AuthorizeNet.deletePaymentProfile(
          paymentMethod.customer_profile_id,
          paymentMethod.payment_profile_id
        );
      } catch (error) {
        console.error('Error deleting from Authorize.net:', error);
        // Continue with database deletion even if Authorize.net fails
      }
    }

    // Mark as inactive in database (don't actually delete for audit trail)
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({ is_active: false })
      .eq('id', params.id);

    if (updateError) {
      console.error('Error deleting payment method:', updateError);
      return NextResponse.json(
        { error: 'Failed to delete payment method' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/payment-methods/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/payment-methods/[id]
 * Update payment method (e.g., set as default)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();

    // Get payment method
    const { data: paymentMethod, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults for this customer
    if (body.is_default === true) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('customer_id', paymentMethod.customer_id);
    }

    // Update payment method
    const { data: updated, error: updateError } = await supabase
      .from('payment_methods')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating payment method:', updateError);
      return NextResponse.json(
        { error: 'Failed to update payment method' },
        { status: 500 }
      );
    }

    return NextResponse.json({ payment_method: updated });
  } catch (error) {
    console.error('Error in PATCH /api/payment-methods/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
