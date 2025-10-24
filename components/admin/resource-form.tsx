'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './image-upload';
import type { Resource } from '@/lib/supabase/client';

interface ResourceFormProps {
  resource?: Resource;
  isEdit?: boolean;
}

export default function ResourceForm({ resource, isEdit = false }: ResourceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    resource_type: resource?.resource_type || '',
    file_url: resource?.file_url || '',
    thumbnail_url: resource?.thumbnail_url || '',
    category: resource?.category || '',
    tags: resource?.tags?.join(', ') || '',
    is_free: resource?.is_free !== undefined ? resource.is_free : true,
    price: resource?.price?.toString() || '',
    is_published: resource?.is_published || false,
  });

  const handleSubmit = async (e: FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const payload = {
        title: formData.title,
        description: formData.description || null,
        resource_type: formData.resource_type,
        file_url: formData.file_url,
        thumbnail_url: formData.thumbnail_url || null,
        category: formData.category || null,
        tags: tagsArray,
        is_free: formData.is_free,
        price: !formData.is_free && formData.price ? parseFloat(formData.price) : null,
        is_published: publish || formData.is_published,
      };

      const url = isEdit ? `/api/admin/resources/${resource?.id}` : '/api/admin/resources';
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
        throw new Error(data.error || 'Failed to save resource');
      }

      router.push('/admin/resources');
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!resource?.id) return;

    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      router.push('/admin/resources');
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
              File URL *
            </label>
            <input
              type="url"
              value={formData.file_url}
              onChange={(e) =>
                setFormData({ ...formData, file_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Direct link to PDF or downloadable file
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type *
              </label>
              <input
                type="text"
                value={formData.resource_type}
                onChange={(e) =>
                  setFormData({ ...formData, resource_type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="PDF, Guide, Checklist, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={formData.is_free}
                onChange={(e) =>
                  setFormData({ ...formData, is_free: e.target.checked })
                }
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                This is a free resource
              </span>
            </label>

            {!formData.is_free && (
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
                  placeholder="9.99"
                />
              </div>
            )}
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
                  Delete Resource
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ImageUpload
              bucket="resource-thumbnails"
              currentImage={formData.thumbnail_url}
              onImageUploaded={(url) =>
                setFormData({ ...formData, thumbnail_url: url })
              }
              label="Thumbnail"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Comma separated"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
