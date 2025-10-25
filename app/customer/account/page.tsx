import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomerFromSession } from '@/lib/customer-auth';
import CustomerAccountClient from '@/components/customer-account-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = {
  title: "My Account | Waggin' Meals",
  description: "Manage your Waggin' Meals account",
};

export default async function CustomerAccountPage() {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('customer_session')?.value;

  if (!sessionToken) {
    redirect('/login');
  }

  const customer = await getCustomerFromSession(sessionToken);

  if (!customer) {
    redirect('/login');
  }

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get subscription if exists
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('customer_id', customer.id)
    .single();

  // Get addresses
  const { data: addresses } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', customer.id)
    .order('is_default', { ascending: false });

  return (
    <CustomerAccountClient
      customer={customer}
      recentOrders={recentOrders || []}
      subscription={subscription}
      addresses={addresses || []}
    />
  );
}
