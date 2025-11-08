'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { ConditionPage, SEOKeyword } from '@/types/condition-page';

export default function SEODashboard() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<ConditionPage[]>([]);
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'pages' | 'keywords'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch all published pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('condition_pages')
        .select('*')
        .eq('status', 'published')
        .order('seo_score', { ascending: false });

      if (pagesError) throw pagesError;
      setPages(pagesData || []);

      // Fetch all keywords
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('seo_keywords')
        .select('*')
        .order('search_volume', { ascending: false });

      if (keywordsError) throw keywordsError;
      setKeywords(keywordsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate stats
  const avgSEOScore = pages.length > 0
    ? Math.round(pages.reduce((sum, p) => sum + p.seo_score, 0) / pages.length)
    : 0;

  const totalSearchVolume = keywords.reduce((sum, k) => sum + (k.search_volume || 0), 0);

  const topKeywords = keywords
    .filter(k => k.search_volume && k.search_volume > 0)
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Dashboard</h1>
              <p className="text-sm text-gray-600">Monitor keyword rankings and page performance</p>
            </div>
            <Link
              href="/admin/conditions"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Condition Pages
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published Pages</p>
                <p className="text-3xl font-bold text-gray-900">{pages.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg SEO Score</p>
                <p className={`text-3xl font-bold ${
                  avgSEOScore >= 80 ? 'text-green-600' : avgSEOScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>{avgSEOScore}/100</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                avgSEOScore >= 80 ? 'bg-green-100' : avgSEOScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  avgSEOScore >= 80 ? 'text-green-600' : avgSEOScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Target Keywords</p>
                <p className="text-3xl font-bold text-gray-900">{keywords.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#8FAE8F]/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#5E8C8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Search Volume</p>
                <p className="text-3xl font-bold text-gray-900">{totalSearchVolume.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(['overview', 'pages', 'keywords'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    selectedView === view
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {view}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview View */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Pages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Pages</h3>
              {pages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No published pages yet</p>
              ) : (
                <div className="space-y-3">
                  {pages.slice(0, 5).map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{page.condition_name}</p>
                        <p className="text-xs text-gray-500 truncate">{page.primary_keyword}</p>
                      </div>
                      <div className={`ml-4 text-xl font-bold ${
                        page.seo_score >= 80 ? 'text-green-600' : page.seo_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {page.seo_score}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* High-Value Keywords */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">High-Value Keywords</h3>
              {topKeywords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No keywords tracked yet</p>
              ) : (
                <div className="space-y-3">
                  {topKeywords.slice(0, 5).map((keyword) => (
                    <div key={keyword.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{keyword.keyword}</p>
                        <p className="text-xs text-gray-500">
                          {keyword.search_volume?.toLocaleString()} searches/mo
                          {keyword.cpc && ` • $${keyword.cpc.toFixed(2)} CPC`}
                        </p>
                      </div>
                      {keyword.current_position && (
                        <div className="ml-4 text-sm font-semibold text-[#5E8C8C]">
                          #{keyword.current_position}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pages View */}
        {selectedView === 'pages' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {pages.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-4">No published pages yet</p>
                <Link
                  href="/admin/conditions/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create First Page
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Keyword</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SEO Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{page.condition_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">{page.primary_keyword}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          page.seo_score >= 80 ? 'text-green-600' : page.seo_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {page.seo_score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.published_at ? new Date(page.published_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/conditions/${page.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/conditions/${page.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Keywords View */}
        {selectedView === 'keywords' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {keywords.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">No keywords tracked yet</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Search Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywords.map((keyword) => (
                    <tr key={keyword.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                        {keyword.related_keywords && keyword.related_keywords.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Related: {keyword.related_keywords.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {keyword.search_volume?.toLocaleString() || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {keyword.cpc ? `$${keyword.cpc.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {keyword.difficulty ? (
                          <span className={`text-sm font-semibold ${
                            keyword.difficulty >= 70 ? 'text-red-600' : keyword.difficulty >= 40 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {keyword.difficulty}/100
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {keyword.current_position ? (
                          <span className="font-semibold text-[#5E8C8C]">#{keyword.current_position}</span>
                        ) : (
                          <span className="text-gray-400">Not ranking</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/admin/conditions/new"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Create New Page
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/admin/conditions/settings"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ⚙️ Settings
          </Link>
        </div>
      </main>
    </div>
  );
}
