import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomerFromSession } from '@/lib/customer-auth';
import CustomerAddressesClient from '@/components/customer-addresses-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = {
  title: "Manage Addresses | Waggin' Meals",
  description: "Manage your shipping addresses",
};

export default async function CustomerAddressesPage() {
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

  // Get all addresses for this customer
  const { data: addresses, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', customer.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
  }

  return (
    <CustomerAddressesClient
      customer={customer}
      addresses={addresses || []}
    />
  );
}
