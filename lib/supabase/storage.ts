import { createServerClient } from './server';

/**
 * Supabase Storage Utilities for Image Management
 *
 * Handles uploading, deleting, and managing images across all storage buckets
 */

export type StorageBucket =
  | 'blog-images'
  | 'video-thumbnails'
  | 'testimonial-images'
  | 'event-images'
  | 'product-images'
  | 'resource-thumbnails';

/**
 * Upload an image to Supabase Storage
 *
 * @param bucket - The storage bucket name
 * @param file - The file to upload (File or Blob)
 * @param fileName - Optional custom file name (auto-generated if not provided)
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
  bucket: StorageBucket,
  file: File | Blob,
  fileName?: string
): Promise<{ url: string; path: string } | null> {
  try {
    const supabase = createServerClient();

    // Generate file path with year organization
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    const extension = file instanceof File
      ? file.name.split('.').pop()
      : 'jpg';

    const sanitizedFileName = fileName
      ? fileName.replace(/[^a-z0-9-_.]/gi, '-').toLowerCase()
      : `upload-${timestamp}`;

    const filePath = `${year}/${sanitizedFileName}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase Storage
 *
 * @param bucket - The storage bucket name
 * @param filePath - The file path (e.g., "2024/my-image.jpg")
 * @returns Success boolean
 */
export async function deleteImage(
  bucket: StorageBucket,
  filePath: string
): Promise<boolean> {
  try {
    const supabase = createServerClient();

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * List all images in a bucket
 *
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path (e.g., "2024")
 * @returns Array of file objects with URLs
 */
export async function listImages(
  bucket: StorageBucket,
  folder?: string
): Promise<Array<{ name: string; url: string; path: string }>> {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error listing images:', error);
      return [];
    }

    // Generate public URLs for each file
    const imagesWithUrls = data.map((file) => {
      const filePath = folder ? `${folder}/${file.name}` : file.name;
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        name: file.name,
        url: publicUrl,
        path: filePath,
      };
    });

    return imagesWithUrls;
  } catch (error) {
    console.error('Error in listImages:', error);
    return [];
  }
}

/**
 * Get public URL for an existing image
 *
 * @param bucket - The storage bucket name
 * @param filePath - The file path (e.g., "2024/my-image.jpg")
 * @returns Public URL string
 */
export function getPublicUrl(bucket: StorageBucket, filePath: string): string {
  const supabase = createServerClient();

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Upload multiple images at once
 *
 * @param bucket - The storage bucket name
 * @param files - Array of files to upload
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  bucket: StorageBucket,
  files: File[]
): Promise<Array<{ url: string; path: string } | null>> {
  const uploadPromises = files.map((file) => uploadImage(bucket, file));
  return Promise.all(uploadPromises);
}

/**
 * Validate image file before upload
 *
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(
  file: File,
  maxSizeMB = 5
): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.',
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB. Please choose a smaller image.`,
    };
  }

  return { valid: true };
}

/**
 * Extract file path from full Supabase storage URL
 *
 * @param url - Full Supabase storage URL
 * @returns File path or null if invalid
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    // URL format: https://lpevubhnsicbbpzeqmmv.supabase.co/storage/v1/object/public/{bucket}/{path}
    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) return null;

    const pathWithBucket = urlParts[1];
    const pathParts = pathWithBucket.split('/');

    // Remove bucket name (first part) to get just the file path
    pathParts.shift();

    return pathParts.join('/');
  } catch (error) {
    console.error('Error extracting file path:', error);
    return null;
  }
}
