import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, validateImageFile, type StorageBucket } from '@/lib/supabase/storage';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * POST /api/admin/upload-image
 *
 * Handles image uploads for the admin panel
 * Uploads to appropriate Supabase Storage bucket
 *
 * Request body (multipart/form-data):
 * - file: The image file
 * - bucket: The storage bucket name
 * - fileName: Optional custom file name
 */
export async function POST(request: NextRequest) {
  try {
    // CRITICAL SECURITY: Check authentication before allowing uploads
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as StorageBucket;
    const fileName = formData.get('fileName') as string | undefined;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!bucket) {
      return NextResponse.json(
        { error: 'No bucket specified' },
        { status: 400 }
      );
    }

    // Validate bucket name
    const validBuckets: StorageBucket[] = [
      'blog-images',
      'video-thumbnails',
      'testimonial-images',
      'event-images',
      'product-images',
      'resource-thumbnails',
    ];

    if (!validBuckets.includes(bucket)) {
      return NextResponse.json(
        { error: 'Invalid bucket name' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const result = await uploadImage(bucket, file, fileName);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path,
    });
  } catch (error) {
    console.error('Error in upload-image API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
