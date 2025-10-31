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
 *
 * ⚠️ TEMPORARILY DISABLED - PCI COMPLIANCE
 * This endpoint accepted raw card data (card_number, cvv, etc.) which violates PCI DSS standards.
 * It will be rebuilt to use Accept.js opaque data tokens for secure payment processing.
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Adding payment methods is temporarily disabled while we upgrade to a more secure payment system.',
      detail: 'Raw card data handling has been disabled for PCI compliance. Payment method management will be restored with Accept.js token integration.'
    },
    { status: 503 }
  );

  // NOTE: Old payment method creation code removed for PCI compliance.
  // This endpoint is disabled until rebuilt with Accept.js + Authorize.net CIM integration.
}
