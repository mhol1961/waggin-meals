# Supabase Storage Setup for Images

This guide will help you set up Supabase Storage buckets for managing images uploaded through the admin panel.

## Step 1: Create Storage Buckets

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv
2. Click on **Storage** in the left sidebar
3. Click **New Bucket**

Create the following buckets:

### 1. `blog-images` Bucket
- **Name**: `blog-images`
- **Public**: ✅ Yes (images need to be publicly accessible)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`
- **File size limit**: 5 MB
- **Purpose**: Featured images for blog posts

### 2. `video-thumbnails` Bucket
- **Name**: `video-thumbnails`
- **Public**: ✅ Yes
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- **File size limit**: 2 MB
- **Purpose**: Thumbnail images for videos

### 3. `testimonial-images` Bucket
- **Name**: `testimonial-images`
- **Public**: ✅ Yes
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- **File size limit**: 2 MB
- **Purpose**: Dog/owner photos for testimonials

### 4. `event-images` Bucket
- **Name**: `event-images`
- **Public**: ✅ Yes
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- **File size limit**: 3 MB
- **Purpose**: Event promotional images

### 5. `product-images` Bucket
- **Name**: `product-images`
- **Public**: ✅ Yes
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- **File size limit**: 3 MB
- **Purpose**: Product photos for e-commerce

### 6. `resource-thumbnails` Bucket
- **Name**: `resource-thumbnails`
- **Public**: ✅ Yes
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- **File size limit**: 1 MB
- **Purpose**: Thumbnail images for PDF/resource downloads

## Step 2: Configure Storage Policies

After creating the buckets, you need to set up RLS (Row Level Security) policies to allow:
- **Public read access** (anyone can view images)
- **Authenticated write access** (only admin can upload/delete)

For each bucket, run this SQL in the **SQL Editor**:

```sql
-- Allow public read access to all buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('blog-images', 'blog-images', true),
  ('video-thumbnails', 'video-thumbnails', true),
  ('testimonial-images', 'testimonial-images', true),
  ('event-images', 'event-images', true),
  ('product-images', 'product-images', true),
  ('resource-thumbnails', 'resource-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public to read all files
CREATE POLICY "Public can view all images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('blog-images', 'video-thumbnails', 'testimonial-images', 'event-images', 'product-images', 'resource-thumbnails'));

-- Allow service role (admin) to upload files
CREATE POLICY "Admin can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('blog-images', 'video-thumbnails', 'testimonial-images', 'event-images', 'product-images', 'resource-thumbnails'));

-- Allow service role (admin) to update files
CREATE POLICY "Admin can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id IN ('blog-images', 'video-thumbnails', 'testimonial-images', 'event-images', 'product-images', 'resource-thumbnails'));

-- Allow service role (admin) to delete files
CREATE POLICY "Admin can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('blog-images', 'video-thumbnails', 'testimonial-images', 'event-images', 'product-images', 'resource-thumbnails'));
```

## Step 3: Test Storage Access

After setup, you can test image uploads through the Supabase dashboard:

1. Go to **Storage** → Select a bucket
2. Click **Upload File**
3. Upload a test image
4. Copy the public URL
5. Paste in browser to verify it's accessible

## Storage URL Format

Images will be accessible at:
```
https://lpevubhnsicbbpzeqmmv.supabase.co/storage/v1/object/public/{bucket-name}/{file-path}
```

Example:
```
https://lpevubhnsicbbpzeqmmv.supabase.co/storage/v1/object/public/blog-images/2024/my-blog-post.jpg
```

## File Organization

The admin panel will organize files by year:
```
blog-images/
  2024/
    getting-started-fresh-food.jpg
    nutrition-basics.jpg
  2025/
    ...

testimonial-images/
  2024/
    bella-weight-loss.jpg
  2025/
    ...
```

## Next Steps

Once storage is configured:
1. The admin panel will use these buckets automatically
2. Images will be uploaded via the rich text editor and image manager
3. Public URLs will be saved in the database
4. Images will be displayed on the website

## Troubleshooting

### Upload fails
- Verify the bucket exists
- Check file size is within limits
- Ensure file type is allowed
- Verify service role key is set in `.env.local`

### Images don't display
- Check bucket is marked as **Public**
- Verify the public read policy exists
- Test the URL directly in a browser
- Check CORS settings in Supabase dashboard
