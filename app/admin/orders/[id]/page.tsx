import { redirect, notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';
import OrderDetailClient from '@/components/admin/order-detail-client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getOrder(id: string) {
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (!order) return null;

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', order.customer_id)
    .single();

  return { ...order, items: items || [], customer };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <AdminLayout title={`Order ${order.order_number}`}>
      <OrderDetailClient order={order} />
    </AdminLayout>
  );
}
