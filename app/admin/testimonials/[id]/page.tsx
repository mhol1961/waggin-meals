import { redirect, notFound } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/admin-layout';
import TestimonialForm from '@/components/admin/testimonial-form';
import Link from 'next/link';

interface EditTestimonialPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Await params in Next.js 15
  const { id } = await params;

  const supabase = createServerClient();
  const { data: testimonial, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !testimonial) {
    notFound();
  }

  return (
    <AdminLayout title={`Edit: ${testimonial.dog_name}`} username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Testimonials
        </Link>
      </div>

      <TestimonialForm testimonial={testimonial} isEdit />
    </AdminLayout>
  );
}
