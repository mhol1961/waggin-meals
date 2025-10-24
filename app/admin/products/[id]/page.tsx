import { redirect, notFound } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import ProductForm from '@/components/admin/product-form';
import Link from 'next/link';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Await params in Next.js 15
  const { id } = await params;

  const supabase = createServerClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <AdminLayout title={`Edit: ${product.title}`} username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Products
        </Link>
      </div>

      <ProductForm product={product} isEdit />
    </AdminLayout>
  );
}
