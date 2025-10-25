'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import type { StorageBucket } from '@/lib/supabase/storage';

interface ImageUploadProps {
  bucket: StorageBucket;
  currentImage?: string | null;
  onImageUploaded: (url: string) => void;
  label?: string;
  helpText?: string;
}

export default function ImageUpload({
  bucket,
  currentImage,
  onImageUploaded,
  label = 'Upload Image',
  helpText = 'Click or drag to upload (max 5MB)',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);

        // Upload to API
        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        // Set preview and notify parent
        setPreview(data.url);
        onImageUploaded(data.url);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
      } finally {
        setUploading(false);
      }
    },
    [bucket, onImageUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading,
  });

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {preview ? (
        /* Image Preview */
        <div className="relative group">
          <div className="relative h-48 rounded-lg overflow-hidden border-2 border-gray-300">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
          >
            Remove
          </button>

          <div className="mt-2 text-xs text-gray-600 truncate">
            {preview}
          </div>
        </div>
      ) : (
        /* Upload Zone */
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />

          <div className="space-y-2">
            {uploading ? (
              <>
                <div className="text-4xl">⏳</div>
                <p className="text-gray-600">Uploading...</p>
              </>
            ) : isDragActive ? (
              <>
                <div className="text-4xl">📤</div>
                <p className="text-gray-600">Drop the image here</p>
              </>
            ) : (
              <>
                <div className="text-4xl">🖼️</div>
                <p className="text-gray-700 font-medium">{helpText}</p>
                <p className="text-xs text-gray-500">
                  Supports: JPG, PNG, WebP, GIF
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
