'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './image-upload';
import type { Event } from '@/lib/supabase/client';

interface EventFormProps {
  event?: Event;
  isEdit?: boolean;
}

export default function EventForm({ event, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Format date for datetime-local input
  const formatDateForInput = (date?: string) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_type: event?.event_type || '',
    start_date: formatDateForInput(event?.start_date) || '',
    end_date: formatDateForInput(event?.end_date || undefined) || '',
    location: event?.location || '',
    registration_url: event?.registration_url || '',
    max_attendees: event?.max_attendees?.toString() || '',
    current_attendees: event?.current_attendees || 0,
    price: event?.price?.toString() || '',
    image_url: event?.image_url || '',
    is_published: event?.is_published || false,
  });

  const handleSubmit = async (e: FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type || null,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        location: formData.location || null,
        registration_url: formData.registration_url || null,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        current_attendees: formData.current_attendees,
        price: formData.price ? parseFloat(formData.price) : null,
        image_url: formData.image_url || null,
        is_published: publish || formData.is_published,
      };

      const url = isEdit ? `/api/admin/events/${event?.id}` : '/api/admin/events';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;

    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Asheville, NC or Online"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <input
                type="text"
                value={formData.event_type}
                onChange={(e) =>
                  setFormData({ ...formData, event_type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Workshop, Webinar, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration URL
            </label>
            <input
              type="url"
              value={formData.registration_url}
              onChange={(e) =>
                setFormData({ ...formData, registration_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="49.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                value={formData.max_attendees}
                onChange={(e) =>
                  setFormData({ ...formData, max_attendees: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Attendees
              </label>
              <input
                type="number"
                value={formData.current_attendees}
                onChange={(e) =>
                  setFormData({ ...formData, current_attendees: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isLoading}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Publishing...' : 'Publish'}
              </button>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ImageUpload
              bucket="event-images"
              currentImage={formData.image_url}
              onImageUploaded={(url) =>
                setFormData({ ...formData, image_url: url })
              }
              label="Event Image"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
