'use client';

import { useState, useCallback } from 'react';

interface DocumentUploaderProps {
  onContentExtracted: (html: string, title?: string) => void;
}

export function DocumentUploader({ onContentExtracted }: DocumentUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/parse-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const data = await response.json();
      onContentExtracted(data.html, data.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  }, [onContentExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileUpload({ target: input } as any);
    }
  }, [handleFileUpload]);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-[#a5b5eb] rounded-lg p-8 text-center bg-[#f8f9fa] hover:bg-[#e8f4fb] transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept=".docx,.pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="document-upload"
          disabled={isProcessing}
        />
        <label htmlFor="document-upload" className="cursor-pointer">
          {isProcessing ? (
            <div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5b5eb] mx-auto mb-4"></div>
              <p className="text-[#3c3a47] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Processing document...
              </p>
            </div>
          ) : (
            <div>
              <svg className="w-16 h-16 text-[#a5b5eb] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Upload Word Document or PDF
              </p>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-[#999999] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Supports: .docx, .pdf
              </p>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p className="font-semibold mb-1">Tips for best results:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use .docx format (Word) for best formatting preservation</li>
              <li>Tables, images, and headings will be preserved</li>
              <li>You can edit the content after upload</li>
              <li>PDF text will be extracted but formatting may need adjustment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
