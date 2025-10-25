import { redirect, notFound } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import BlogForm from '@/components/admin/blog-form';
import Link from 'next/link';

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Await params in Next.js 15
  const { id } = await params;

  // Fetch the blog post
  const supabase = createServerClient();
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <AdminLayout title={`Edit: ${post.title}`} username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Blog Posts
        </Link>
      </div>

      <BlogForm post={post} isEdit />
    </AdminLayout>
  );
}
