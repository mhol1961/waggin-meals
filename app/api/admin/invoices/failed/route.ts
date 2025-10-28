import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/auth-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/invoices/failed
 * Get all failed invoices with subscription and customer data (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin();

    // Fetch failed invoices with subscription and customer data
    const { data, error } = await supabase
      .from('subscription_invoices')
      .select(`
        *,
        subscription:subscriptions!subscription_invoices_subscription_id_fkey (
          id,
          type,
          frequency,
          amount,
          status,
          customer:customers!subscriptions_customer_id_fkey (
            id,
            email,
            first_name,
            last_name,
            phone
          )
        )
      `)
      .eq('status', 'failed')
      .order('next_retry_at', { ascending: true });

    if (error) {
      console.error('Error fetching failed invoices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      );
    }

    // Flatten the nested customer data for easier access in the UI
    const invoices = data.map(invoice => ({
      ...invoice,
      customer: invoice.subscription?.customer,
      subscription_id: invoice.subscription?.id,
    }));

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Error in GET /api/admin/invoices/failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
