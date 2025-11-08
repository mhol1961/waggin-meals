'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { ConditionPage } from '@/types/condition-page';

export default function EditConditionPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<ConditionPage | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const { data, error } = await supabase
          .from('condition_pages')
          .select('*')
          .eq('id', pageId)
          .single();

        if (error) throw error;
        setPage(data);
      } catch (error) {
        console.error('Error fetching page:', error);
        alert('Failed to load page');
        router.push('/admin/conditions');
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [pageId, router]);

  const handleSave = async () => {
    if (!page) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('condition_pages')
        .update({
          condition_name: page.condition_name,
          meta_title: page.meta_title,
          meta_description: page.meta_description,
          primary_keyword: page.primary_keyword,
          secondary_keywords: page.secondary_keywords,
          content: page.content,
          featured_image: page.featured_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId);

      if (error) throw error;

      alert('Page updated successfully!');
      router.push('/admin/conditions');
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'draft' | 'review' | 'published') => {
    if (!page) return;

    setSaving(true);
    try {
      const updates: any = { status: newStatus, updated_at: new Date().toISOString() };

      if (newStatus === 'published' && !page.published_at) {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('condition_pages')
        .update(updates)
        .eq('id', pageId);

      if (error) throw error;

      setPage({ ...page, ...updates });
      alert(`Page status changed to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    if (!page) return;
    setPage({
      ...page,
      content: {
        ...page.content,
        sections: [
          ...page.content.sections,
          { heading: '', content: '', layout: 'full-width', order: page.content.sections.length + 1 }
        ]
      }
    });
  };

  const removeSection = (index: number) => {
    if (!page) return;
    setPage({
      ...page,
      content: {
        ...page.content,
        sections: page.content.sections.filter((_, i) => i !== index)
      }
    });
  };

  const addFAQ = () => {
    if (!page) return;
    setPage({
      ...page,
      content: {
        ...page.content,
        faq: [
          ...page.content.faq,
          { question: '', answer: '', order: page.content.faq.length + 1 }
        ]
      }
    });
  };

  const removeFAQ = (index: number) => {
    if (!page) return;
    setPage({
      ...page,
      content: {
        ...page.content,
        faq: page.content.faq.filter((_, i) => i !== index)
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit: {page.condition_name}</h1>
              <p className="text-sm text-gray-600">Modify content and SEO settings</p>
            </div>
            <Link
              href="/admin/conditions"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to List
            </Link>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  page.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : page.status === 'review'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {page.status !== 'draft' && (
                <button
                  onClick={() => handleStatusChange('draft')}
                  disabled={saving}
                  className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Move to Draft
                </button>
              )}
              {page.status !== 'review' && (
                <button
                  onClick={() => handleStatusChange('review')}
                  disabled={saving}
                  className="text-xs px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  Send to Review
                </button>
              )}
              {page.status !== 'published' && (
                <button
                  onClick={() => handleStatusChange('published')}
                  disabled={saving}
                  className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Publish Live
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition Name
                  </label>
                  <input
                    type="text"
                    value={page.condition_name}
                    onChange={(e) => setPage({ ...page, condition_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Keyword
                  </label>
                  <input
                    type="text"
                    value={page.primary_keyword || ''}
                    onChange={(e) => setPage({ ...page, primary_keyword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Slug
                  </label>
                  <input
                    type="text"
                    value={page.slug}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Slug cannot be changed after creation
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Meta */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Meta Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title (30-60 characters)
                  </label>
                  <input
                    type="text"
                    value={page.meta_title || ''}
                    onChange={(e) => setPage({ ...page, meta_title: e.target.value })}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(page.meta_title || '').length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description (120-160 characters)
                  </label>
                  <textarea
                    value={page.meta_description || ''}
                    onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(page.meta_description || '').length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(page.secondary_keywords || []).join(', ')}
                    onChange={(e) => setPage({
                      ...page,
                      secondary_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    H1 Heading
                  </label>
                  <input
                    type="text"
                    value={page.content.h1}
                    onChange={(e) => setPage({
                      ...page,
                      content: { ...page.content, h1: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Subheading
                  </label>
                  <input
                    type="text"
                    value={page.content.hero_subheading}
                    onChange={(e) => setPage({
                      ...page,
                      content: { ...page.content, hero_subheading: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Content Sections</h2>
                <button
                  onClick={addSection}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Section
                </button>
              </div>

              {page.content.sections.map((section, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                    {page.content.sections.length > 1 && (
                      <button
                        onClick={() => removeSection(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => {
                        const newSections = [...page.content.sections];
                        newSections[index].heading = e.target.value;
                        setPage({
                          ...page,
                          content: { ...page.content, sections: newSections }
                        });
                      }}
                      placeholder="Section Heading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />

                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        const newSections = [...page.content.sections];
                        newSections[index].content = e.target.value;
                        setPage({
                          ...page,
                          content: { ...page.content, sections: newSections }
                        });
                      }}
                      placeholder="Section content (you can use basic HTML)"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">FAQ Section</h2>
                <button
                  onClick={addFAQ}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add FAQ
                </button>
              </div>

              {page.content.faq.map((item, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">FAQ {index + 1}</span>
                    {page.content.faq.length > 1 && (
                      <button
                        onClick={() => removeFAQ(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => {
                        const newFAQ = [...page.content.faq];
                        newFAQ[index].question = e.target.value;
                        setPage({
                          ...page,
                          content: { ...page.content, faq: newFAQ }
                        });
                      }}
                      placeholder="Question"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />

                    <textarea
                      value={item.answer}
                      onChange={(e) => {
                        const newFAQ = [...page.content.faq];
                        newFAQ[index].answer = e.target.value;
                        setPage({
                          ...page,
                          content: { ...page.content, faq: newFAQ }
                        });
                      }}
                      placeholder="Answer"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* SEO Score Display */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">SEO Score</h3>
                  <p className="text-sm text-gray-600">Current optimization level</p>
                </div>
                <div className={`text-3xl font-bold ${
                  page.seo_score >= 80 ? 'text-green-600' : page.seo_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {page.seo_score}/100
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/admin/conditions"
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
