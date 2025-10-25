import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';
import BlogForm from '@/components/admin/blog-form';
import Link from 'next/link';

export default async function NewBlogPostPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout title="New Blog Post" username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Blog Posts
        </Link>
      </div>

      <BlogForm />
    </AdminLayout>
  );
}
