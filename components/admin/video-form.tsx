'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './image-upload';
import type { Video } from '@/lib/supabase/client';

interface VideoFormProps {
  video?: Video;
  isEdit?: boolean;
}

export default function VideoForm({ video, isEdit = false }: VideoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    video_url: video?.video_url || '',
    thumbnail_url: video?.thumbnail_url || '',
    duration: video?.duration?.toString() || '',
    category: video?.category || '',
    tags: video?.tags?.join(', ') || '',
    transcript: video?.transcript || '',
    is_published: video?.is_published || false,
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
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        category: formData.category || null,
        tags: tagsArray,
        transcript: formData.transcript || null,
        is_published: publish || formData.is_published,
      };

      const url = isEdit ? `/api/admin/videos/${video?.id}` : '/api/admin/videos';
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
        throw new Error(data.error || 'Failed to save video');
      }

      router.push('/admin/videos');
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!video?.id) return;

    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      router.push('/admin/videos');
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
              placeholder="Enter video title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL * (YouTube or hosted)
            </label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) =>
                setFormData({ ...formData, video_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
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
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe your video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transcript
            </label>
            <textarea
              value={formData.transcript}
              onChange={(e) =>
                setFormData({ ...formData, transcript: e.target.value })
              }
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              placeholder="Video transcript for accessibility"
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
                  Delete Video
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ImageUpload
              bucket="video-thumbnails"
              currentImage={formData.thumbnail_url}
              onImageUploaded={(url) =>
                setFormData({ ...formData, thumbnail_url: url })
              }
              label="Thumbnail"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              placeholder="e.g., Training Tips"
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="300"
              min="0"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
