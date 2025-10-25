import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';
import ResourceForm from '@/components/admin/resource-form';
import Link from 'next/link';

export default async function NewResourcePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout title="New Resource" username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/resources"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Resources
        </Link>
      </div>

      <ResourceForm />
    </AdminLayout>
  );
}
