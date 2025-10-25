'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { DocumentUploader } from '@/components/admin/document-uploader';

type CreationMethod = 'upload' | 'manual';

export default function NewBlogPostPage() {
  const [method, setMethod] = useState<CreationMethod>('upload');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDocumentUpload = (html: string, extractedTitle?: string) => {
    setContent(html);
    if (extractedTitle && !title) {
      setTitle(extractedTitle);
      // Auto-generate slug from title
      setSlug(extractedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
    // Switch to manual mode to allow editing
    setMethod('manual');
  };

  const handleSave = async (publish: boolean) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          seoTitle: seoTitle || title,
          seoDescription: seoDescription || excerpt,
          published: publish,
        }),
      });

      if (response.ok) {
        alert(publish ? 'Post published successfully!' : 'Draft saved successfully!');
        // Redirect to blog management page
        window.location.href = '/admin/blog';
      } else {
        alert('Failed to save post');
      }
    } catch (error) {
      alert('Error saving post');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-8 border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/blog"
                className="text-white hover:text-gray-100 text-sm flex items-center gap-2 mb-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog Posts
              </Link>
              <h1 className="text-4xl font-normal text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Create New Blog Post
              </h1>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-white text-[#a5b5eb] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Column */}
          <div className="lg:col-span-2">
            {/* Method Selection */}
            <div className="mb-6">
              <div className="flex gap-2 bg-[#f8f9fa] p-2 rounded-lg">
                <button
                  onClick={() => setMethod('upload')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    method === 'upload'
                      ? 'bg-[#a5b5eb] text-white shadow-lg'
                      : 'bg-white text-[#666666] hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  📄 Upload Document
                </button>
                <button
                  onClick={() => setMethod('manual')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    method === 'manual'
                      ? 'bg-[#a5b5eb] text-white shadow-lg'
                      : 'bg-white text-[#666666] hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  ✍️ Write Manually
                </button>
              </div>
            </div>

            {/* Upload or Manual Editor */}
            {method === 'upload' ? (
              <DocumentUploader onContentExtracted={handleDocumentUpload} />
            ) : (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Post Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      // Auto-generate slug
                      if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    placeholder="Enter post title..."
                    className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent text-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Content *
                  </label>
                  <RichTextEditor content={content} onChange={setContent} />
                  <p className="text-xs text-[#999999] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    💡 Tip: Use the table button (📊) to create feeding charts, nutrition data, or comparison tables
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Details */}
            <div className="bg-white border-2 border-[#e0e0e0] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Post Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="post-url-slug"
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  <p className="text-xs text-[#999999] mt-1">
                    URL: /blog/{slug || 'post-slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Excerpt (Optional)
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary for blog list..."
                    rows={3}
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white border-2 border-[#e0e0e0] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                SEO Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'SEO Title...'}
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    maxLength={60}
                  />
                  <p className="text-xs text-[#999999] mt-1">
                    {seoTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Meta Description
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || 'Description for search engines...'}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    maxLength={160}
                  />
                  <p className="text-xs text-[#999999] mt-1">
                    {seoDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border-2 border-[#e0e0e0] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => handleSave(true)}
                  disabled={!title || !content || isSaving}
                  className="w-full bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isSaving ? 'Saving...' : '✓ Publish Post'}
                </button>

                <button
                  onClick={() => handleSave(false)}
                  disabled={!title || !content || isSaving}
                  className="w-full bg-white text-[#3c3a47] border-2 border-[#e0e0e0] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  💾 Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#f8f9fa] px-6 py-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Preview
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-[#666666] hover:text-[#3c3a47]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <h1 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {title || 'Untitled Post'}
              </h1>
              {excerpt && (
                <p className="text-lg text-[#666666] mb-6 italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {excerpt}
                </p>
              )}
              <div
                className="prose prose-lg max-w-none"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
