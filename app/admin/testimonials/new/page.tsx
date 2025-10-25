import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';
import TestimonialForm from '@/components/admin/testimonial-form';
import Link from 'next/link';

export default async function NewTestimonialPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout title="New Testimonial" username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Testimonials
        </Link>
      </div>

      <TestimonialForm />
    </AdminLayout>
  );
}
