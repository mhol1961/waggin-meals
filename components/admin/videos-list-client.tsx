'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArchiveButton from './archive-button';

interface Video {
  id: string;
  title: string;
  duration: number | null;
  category: string | null;
  view_count: number;
  is_published: boolean;
  archived?: boolean;
}

interface VideosListClientProps {
  initialVideos: Video[];
}

export default function VideosListClient({ initialVideos }: VideosListClientProps) {
  const router = useRouter();
  const [videos, setVideos] = useState(initialVideos);

  // Filter out archived videos
  const activeVideos = videos.filter(video => !video.archived);

  const handleArchiveComplete = (videoId: string) => {
    setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
    router.refresh();
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {activeVideos.length} {activeVideos.length === 1 ? 'video' : 'videos'} total
        </div>
        <Link
          href="/admin/videos/new"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
        >
          + New Video
        </Link>
      </div>

      {activeVideos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No videos yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first video
          </p>
          <Link
            href="/admin/videos/new"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Add First Video
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeVideos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {video.title}
                    </div>
                    {video.duration && (
                      <div className="text-sm text-gray-500">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {video.category && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#8FAE8F]/10 text-[#5E8C8C]">
                        {video.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {video.is_published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {video.view_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/admin/videos/${video.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </Link>
                      <ArchiveButton
                        contentType="video"
                        contentId={video.id}
                        contentTitle={video.title}
                        onArchiveComplete={() => handleArchiveComplete(video.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
