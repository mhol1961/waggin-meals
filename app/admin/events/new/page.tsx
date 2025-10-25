import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLayout from '@/components/admin/admin-layout';
import EventForm from '@/components/admin/event-form';
import Link from 'next/link';

export default async function NewEventPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout title="New Event" username={session.username}>
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Events
        </Link>
      </div>

      <EventForm />
    </AdminLayout>
  );
}
