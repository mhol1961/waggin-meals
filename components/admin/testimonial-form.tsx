'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './image-upload';
import type { Testimonial } from '@/lib/supabase/client';

interface TestimonialFormProps {
  testimonial?: Testimonial;
  isEdit?: boolean;
}

export default function TestimonialForm({ testimonial, isEdit = false }: TestimonialFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    dog_name: testimonial?.dog_name || '',
    owner_name: testimonial?.owner_name || '',
    location: testimonial?.location || '',
    category: testimonial?.category || '',
    problem: testimonial?.problem || '',
    result: testimonial?.result || '',
    quote: testimonial?.quote || '',
    service: testimonial?.service || '',
    rating: testimonial?.rating || 5,
    image_url: testimonial?.image_url || '',
    is_featured: testimonial?.is_featured || false,
    is_published: testimonial?.is_published || false,
  });

  const handleSubmit = async (e: FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        is_published: publish || formData.is_published,
        location: formData.location || null,
        service: formData.service || null,
        image_url: formData.image_url || null,
      };

      const url = isEdit ? `/api/admin/testimonials/${testimonial?.id}` : '/api/admin/testimonials';
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
        throw new Error(data.error || 'Failed to save testimonial');
      }

      router.push('/admin/testimonials');
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!testimonial?.id) return;

    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      router.push('/admin/testimonials');
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dog Name *
              </label>
              <input
                type="text"
                value={formData.dog_name}
                onChange={(e) =>
                  setFormData({ ...formData, dog_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.owner_name}
                onChange={(e) =>
                  setFormData({ ...formData, owner_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
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
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <input
                type="text"
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="3-Month Custom Meal Plan"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem *
            </label>
            <textarea
              value={formData.problem}
              onChange={(e) =>
                setFormData({ ...formData, problem: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="What was the problem before?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result *
            </label>
            <textarea
              value={formData.result}
              onChange={(e) =>
                setFormData({ ...formData, result: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="What was the outcome?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote *
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) =>
                setFormData({ ...formData, quote: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Client's testimonial quote"
              required
            />
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
                  Delete Testimonial
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ImageUpload
              bucket="testimonial-images"
              currentImage={formData.image_url}
              onImageUploaded={(url) =>
                setFormData({ ...formData, image_url: url })
              }
              label="Dog Photo"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Weight Loss, Allergies, etc."
              required
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
              <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
              <option value={3}>⭐⭐⭐ (3 stars)</option>
              <option value={2}>⭐⭐ (2 stars)</option>
              <option value={1}>⭐ (1 star)</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Mark as Featured
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
