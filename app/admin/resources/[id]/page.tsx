import { redirect, notFound } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import ResourceForm from '@/components/admin/resource-form';
import Link from 'next/link';

interface EditResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Await params in Next.js 15
  const { id } = await params;

  const supabase = createServerClient();
  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !resource) {
    notFound();
  }

  return (
    <AdminLayout title={`Edit: ${resource.title}`} username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/resources"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Resources
        </Link>
      </div>

      <ResourceForm resource={resource} isEdit />
    </AdminLayout>
  );
}
