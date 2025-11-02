import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { getAllProducts } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import ProductsListClient from '@/components/admin/products-list-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductsListPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const products = await getAllProducts(false);

  return (
    <AdminLayout title="Products" username={session.username}>
      <ProductsListClient initialProducts={products || []} />
    </AdminLayout>
  );
}
