import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomerFromSession } from '@/lib/customer-auth';
import CustomerOrdersClient from '@/components/customer-orders-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = {
  title: "Order History | Waggin' Meals",
  description: "View your order history",
};

export default async function CustomerOrdersPage() {
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

  // Get all orders for this customer
  const { data: orders, error} = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_name,
        variant_title,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <CustomerOrdersClient
      customer={customer}
      orders={orders || []}
    />
  );
}
