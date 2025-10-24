'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from './rich-text-editor';
import ImageUpload from './image-upload';
import type { BlogPost } from '@/lib/supabase/client';

interface BlogFormProps {
  post?: BlogPost;
  isEdit?: boolean;
}

export default function BlogForm({ post, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedSlug, setSavedSlug] = useState('');

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    category: post?.category || '',
    tags: post?.tags?.join(', ') || '',
    read_time: post?.read_time || '',
    is_published: post?.is_published || false,
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: isEdit ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: FormEvent, explicitPublishState?: boolean) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // Use explicit publish state if provided, otherwise use formData
      const shouldPublish = explicitPublishState !== undefined ? explicitPublishState : formData.is_published;

      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image || null,
        category: formData.category,
        tags: tagsArray,
        read_time: formData.read_time ? formData.read_time : null,
        is_published: shouldPublish,
        published_date: shouldPublish ? (post?.published_date || new Date().toISOString()) : null,
      };

      const url = isEdit ? `/api/admin/blog/${post?.id}` : '/api/admin/blog';
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
        throw new Error(data.error || 'Failed to save post');
      }

      // Show success message with options
      setSavedSlug(payload.slug);
      setSuccess(shouldPublish ? 'Post published successfully!' : 'Draft saved successfully!');
      setIsLoading(false);

      // Update form data to reflect published state
      setFormData({ ...formData, is_published: shouldPublish });

      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post?.id) return;

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      router.push('/admin/blog');
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

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg space-y-3">
          <p className="font-medium">{success}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ← Back to Blog List
            </button>
            {formData.is_published && savedSlug && (
              <a
                href={`/blog/${savedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition inline-block"
              >
                View Published Post →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /blog/{formData.slug || 'your-slug'}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Brief description for previews and SEO"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) =>
                setFormData({ ...formData, content })
              }
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>

            <div className="space-y-3">
              {formData.is_published ? (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={isLoading}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 font-medium"
                >
                  {isLoading ? 'Unpublishing...' : 'Unpublish'}
                </button>
              ) : (
                <>
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
                </>
              )}

              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
                >
                  Delete Post
                </button>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ImageUpload
              bucket="blog-images"
              currentImage={formData.featured_image}
              onImageUploaded={(url) =>
                setFormData({ ...formData, featured_image: url })
              }
              label="Featured Image"
            />
          </div>

          {/* Category */}
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
              placeholder="e.g., Nutrition Basics"
              required
            />
          </div>

          {/* Tags */}
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
              placeholder="Comma separated: nutrition, tips"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Read Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Read Time (minutes)
            </label>
            <input
              type="number"
              value={formData.read_time}
              onChange={(e) =>
                setFormData({ ...formData, read_time: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="5"
              min="1"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
