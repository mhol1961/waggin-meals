'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArchiveButton from './archive-button';

interface Event {
  id: string;
  title: string;
  event_type: string | null;
  start_date: string;
  location: string | null;
  max_attendees: number | null;
  current_attendees: number;
  is_published: boolean;
  archived?: boolean;
}

interface EventsListClientProps {
  initialEvents: Event[];
}

export default function EventsListClient({ initialEvents }: EventsListClientProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);

  // Filter out archived events
  const activeEvents = events.filter(event => !event.archived);

  const handleArchiveComplete = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    router.refresh();
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {activeEvents.length} {activeEvents.length === 1 ? 'event' : 'events'} total
        </div>
        <Link
          href="/admin/events/new"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
        >
          + New Event
        </Link>
      </div>

      {activeEvents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No events yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start scheduling workshops and classes
          </p>
          <Link
            href="/admin/events/new"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    {event.event_type && (
                      <div className="text-sm text-gray-500">{event.event_type}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location || 'TBD'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.max_attendees
                      ? `${event.current_attendees}/${event.max_attendees}`
                      : event.current_attendees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.is_published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </Link>
                      <ArchiveButton
                        contentType="event"
                        contentId={event.id}
                        contentTitle={event.title}
                        onArchiveComplete={() => handleArchiveComplete(event.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
