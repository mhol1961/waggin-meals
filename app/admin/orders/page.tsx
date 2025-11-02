import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import OrdersClient from '@/components/admin/orders-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrdersListPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const supabase = createServerClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <AdminLayout title="Orders Management" username={session.username}>
      <OrdersClient initialOrders={orders || []} />
    </AdminLayout>
  );
}
