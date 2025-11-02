'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ArchiveButton from '@/components/admin/archive-button';

interface CaseStudy {
  id: string;
  dog_name: string;
  breed: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  published_at?: string;
}

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchCaseStudies();
  }, [filter]);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const url = filter === 'all'
        ? '/api/admin/case-studies'
        : `/api/admin/case-studies?status=${filter}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch case studies');

      const data = await response.json();
      setCaseStudies(data.caseStudies || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      alert('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, dogName: string) => {
    if (!confirm(`Are you sure you want to delete the case study for ${dogName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/case-studies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete case study');

      alert('Case study deleted successfully');
      fetchCaseStudies();
    } catch (error) {
      console.error('Error deleting case study:', error);
      alert('Failed to delete case study');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[36px] font-bold text-[#3c3a47] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Case Studies
            </h1>
            <p className="text-[16px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Manage success stories and testimonials
            </p>
          </div>
          <Link
            href="/admin/case-studies/new"
            className="flex items-center gap-2 bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8fa3d9] transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Plus className="w-5 h-5" />
            New Case Study
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[#a5b5eb] text-white'
                  : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              All ({caseStudies.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'published'
                  ? 'bg-[#a5b5eb] text-white'
                  : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'draft'
                  ? 'bg-[#a5b5eb] text-white'
                  : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Case Studies List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#666666]">Loading case studies...</p>
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-[#666666] mb-4">No case studies found</p>
            <Link
              href="/admin/case-studies/new"
              className="inline-flex items-center gap-2 bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8fa3d9] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Plus className="w-5 h-5" />
              Create Your First Case Study
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Dog
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Case Title
                  </th>
                  <th className="px-6 py-4 text-center text-[14px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-[14px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Featured
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-[14px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {caseStudies.map((caseStudy) => (
                  <tr key={caseStudy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {caseStudy.dog_name}
                        </p>
                        <p className="text-sm text-[#666666]">{caseStudy.breed}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {caseStudy.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        caseStudy.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {caseStudy.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {caseStudy.featured && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          ⭐ Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#666666]">
                        {new Date(caseStudy.published_at || caseStudy.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {caseStudy.published && (
                          <Link
                            href={`/case-studies/${caseStudy.slug}`}
                            target="_blank"
                            className="p-2 text-[#666666] hover:text-[#a5b5eb] transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/case-studies/${caseStudy.id}`}
                          className="p-2 text-[#666666] hover:text-[#a5b5eb] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <ArchiveButton
                          contentType="case_study"
                          contentId={caseStudy.id}
                          contentTitle={caseStudy.title}
                          onArchiveComplete={fetchCaseStudies}
                        />
                        <button
                          onClick={() => handleDelete(caseStudy.id, caseStudy.dog_name)}
                          className="p-2 text-[#666666] hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
