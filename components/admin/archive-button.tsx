'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ArchiveButtonProps {
  contentType: 'blog_post' | 'product' | 'video' | 'testimonial' | 'case_study' | 'event';
  contentId: string;
  contentTitle?: string;
  onArchiveComplete?: () => void;
}

export default function ArchiveButton({
  contentType,
  contentId,
  contentTitle,
  onArchiveComplete
}: ArchiveButtonProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      const response = await fetch('/api/admin/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          reason: reason || undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to archive');
      }

      setShowConfirm(false);
      if (onArchiveComplete) {
        onArchiveComplete();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error archiving content:', error);
      alert(`Failed to archive: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        Archive
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Archive {contentTitle ? `"${contentTitle}"` : 'Content'}?
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  This will hide the content from public view
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                placeholder="Why are you archiving this content?"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <strong>Note:</strong> Archived content can be restored later from the Archive page.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleArchive}
                disabled={isArchiving}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isArchiving ? 'Archiving...' : 'Archive'}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setReason('');
                }}
                disabled={isArchiving}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
