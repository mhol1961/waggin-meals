import { redirect, notFound } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import VideoForm from '@/components/admin/video-form';
import Link from 'next/link';

interface EditVideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Await params in Next.js 15
  const { id } = await params;

  const supabase = createServerClient();
  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !video) {
    notFound();
  }

  return (
    <AdminLayout title={`Edit: ${video.title}`} username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/videos"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Videos
        </Link>
      </div>

      <VideoForm video={video} isEdit />
    </AdminLayout>
  );
}
