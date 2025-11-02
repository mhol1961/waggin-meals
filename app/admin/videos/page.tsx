import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { getAllVideos } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import VideosListClient from '@/components/admin/videos-list-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VideosListPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const videos = await getAllVideos(false);

  return (
    <AdminLayout title="Videos" username={session.username}>
      <VideosListClient initialVideos={videos || []} />
    </AdminLayout>
  );
}
