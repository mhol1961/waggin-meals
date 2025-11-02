import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { getAllBlogPosts } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import BlogListClient from '@/components/admin/blog-list-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogListPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const posts = await getAllBlogPosts(false);

  return (
    <AdminLayout title="Blog Posts" username={session.username}>
      <BlogListClient initialPosts={posts || []} />
    </AdminLayout>
  );
}
