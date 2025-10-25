import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';
import VideoForm from '@/components/admin/video-form';
import Link from 'next/link';

export default async function NewVideoPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout title="New Video" username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/videos"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Videos
        </Link>
      </div>

      <VideoForm />
    </AdminLayout>
  );
}
