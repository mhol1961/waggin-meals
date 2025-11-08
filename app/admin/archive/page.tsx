'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';

interface ArchivedItem {
  id: string;
  content_type: string;
  content_id: string;
  content_data: any;
  archived_at: string;
  archived_by: string;
  reason: string | null;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  blog_post: 'Blog Post',
  product: 'Product',
  video: 'Video',
  testimonial: 'Testimonial',
  case_study: 'Case Study',
  event: 'Event'
};

const CONTENT_TYPE_COLORS: Record<string, string> = {
  blog_post: 'bg-blue-100 text-blue-800',
  product: 'bg-[#C97B63]/10 text-[#C97B63]',
  video: 'bg-[#8FAE8F]/100 text-[#5E8C8C]',
  testimonial: 'bg-green-100 text-green-800',
  case_study: 'bg-orange-100 text-orange-800',
  event: 'bg-[#5E8C8C]/10 text-[#5E8C8C]'
};

export default function ArchivePage() {
  const router = useRouter();
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedItems();
  }, [filter]);

  const fetchArchivedItems = async () => {
    try {
      setLoading(true);
      const url = filter === 'all'
        ? '/api/admin/archive'
        : `/api/admin/archive?content_type=${filter}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch archived items');

      const data = await response.json();
      setArchivedItems(data.archivedItems || []);
    } catch (error) {
      console.error('Error fetching archived items:', error);
      alert('Failed to load archived items');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item: ArchivedItem) => {
    if (!confirm(`Restore this ${CONTENT_TYPE_LABELS[item.content_type]}?`)) {
      return;
    }

    try {
      setRestoring(item.id);
      const response = await fetch('/api/admin/archive/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archive_id: item.id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to restore');
      }

      alert('Content restored successfully!');
      fetchArchivedItems();
    } catch (error) {
      console.error('Error restoring content:', error);
      alert(`Failed to restore: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setRestoring(null);
    }
  };

  const handlePermanentDelete = async (item: ArchivedItem) => {
    const title = getContentTitle(item);
    if (!confirm(`PERMANENTLY DELETE this ${CONTENT_TYPE_LABELS[item.content_type]}?\n\n"${title}"\n\nThis action cannot be undone!`)) {
      return;
    }

    try {
      setDeleting(item.id);
      const response = await fetch(`/api/admin/archive?id=${item.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }

      alert('Content permanently deleted');
      fetchArchivedItems();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(null);
    }
  };

  const getContentTitle = (item: ArchivedItem): string => {
    const data = item.content_data;
    return data.title || data.dog_name || data.name || 'Untitled';
  };

  const getContentCount = (type: string): number => {
    if (type === 'all') return archivedItems.length;
    return archivedItems.filter(item => item.content_type === type).length;
  };

  return (
    <AdminLayout title="Archive" username="Admin">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Archived Content</h2>
        <p className="text-gray-600">View and restore archived content</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({getContentCount('all')})
          </button>
          {Object.keys(CONTENT_TYPE_LABELS).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {CONTENT_TYPE_LABELS[type]} ({getContentCount(type)})
            </button>
          ))}
        </div>
      </div>

      {/* Archive List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading archived content...</p>
        </div>
      ) : archivedItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No archived content
          </h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'Archive is empty'
              : `No archived ${CONTENT_TYPE_LABELS[filter].toLowerCase()}s`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archived By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archived Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {archivedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${CONTENT_TYPE_COLORS[item.content_type]}`}>
                      {CONTENT_TYPE_LABELS[item.content_type]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {getContentTitle(item)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.archived_by || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.archived_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">
                      {item.reason || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => handleRestore(item)}
                        disabled={restoring === item.id}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        {restoring === item.id ? 'Restoring...' : 'Restore'}
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item)}
                        disabled={deleting === item.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Box */}
      {archivedItems.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Restoring content will make it visible again in the admin and on the public site.
            Permanently deleting cannot be undone.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}
