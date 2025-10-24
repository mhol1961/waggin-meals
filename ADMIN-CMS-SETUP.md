# Waggin Meals Admin CMS - Setup Guide

## Overview

Complete admin CMS system for managing all website content including blog posts, videos, testimonials, events, resources, and products.

## What's Been Built

### 🔐 Authentication System
- JWT-based admin authentication with HTTP-only cookies
- Session management (24-hour sessions)
- Login/logout functionality
- Protected admin routes

### 📊 Dashboard
- Overview of all content types with statistics
- Quick actions for creating new content
- Navigation to all content management sections

### ✍️ Content Management

#### Blog Posts
- List view with search/filter
- Rich text editor with formatting toolbar
- Featured image upload
- Category and tags support
- Publish/draft status
- SEO fields (slug, excerpt)

#### Videos
- YouTube or self-hosted video support
- Thumbnail upload
- Duration tracking
- View count
- Transcript support
- Category and tags

#### Testimonials
- Before/after problem-result format
- Dog and owner information
- Star ratings (1-5)
- Featured testimonial flag
- Category-based organization
- Optional photo upload

#### Events
- Workshop/webinar scheduling
- Date and time management
- Location (physical or online)
- Registration URL integration
- Attendee tracking (current/max)
- Pricing support
- Event images

#### Resources
- PDF guides and downloads
- Free or paid resources
- Download tracking
- Category and tags
- Thumbnail support
- File URL management

#### Products (E-commerce Ready)
- Full product catalog
- Pricing with compare-at pricing
- Inventory management
- Multiple images support
- Product variants (weight, SKU)
- Featured products
- Category and tags

## Setup Instructions

### 1. Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to SQL Editor
4. Run the schema from `supabase/schema.sql`
5. This will create:
   - All 6 content tables (blog_posts, videos, testimonials, events, resources, products)
   - Row Level Security (RLS) policies
   - Auto-update triggers
   - Sample data (optional)

### 2. Storage Buckets

Create the following storage buckets in Supabase (Storage > Create Bucket):
- `blog-images` (Public)
- `video-thumbnails` (Public)
- `testimonial-images` (Public)
- `event-images` (Public)
- `product-images` (Public)
- `resource-thumbnails` (Public)

For detailed instructions, see `supabase/STORAGE-SETUP.md`

### 3. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in the Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Set admin credentials:
   ```bash
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_password
   ```

4. Generate and set session secret:
   ```bash
   # Generate a random secret
   openssl rand -base64 32

   # Add to .env.local
   SESSION_SECRET=your_generated_secret
   ```

### 4. Install Dependencies

```bash
npm install
```

All required packages are already in package.json:
- @tiptap/react (Rich text editor)
- react-dropzone (File uploads)
- @supabase/supabase-js (Database)
- jose (JWT auth)

### 5. Run Development Server

```bash
npm run dev
```

Visit:
- Admin login: http://localhost:3000/admin/login
- Admin dashboard: http://localhost:3000/admin

## Admin Panel Structure

### Routes

```
/admin
  /login                    - Login page
  /                         - Dashboard
  /blog
    /                       - List all posts
    /new                    - Create new post
    /[id]                   - Edit post
  /videos
    /                       - List all videos
    /new                    - Create new video
    /[id]                   - Edit video
  /testimonials
    /                       - List all testimonials
    /new                    - Create new testimonial
    /[id]                   - Edit testimonial
  /events
    /                       - List all events
    /new                    - Create new event
    /[id]                   - Edit event
  /resources
    /                       - List all resources
    /new                    - Create new resource
    /[id]                   - Edit resource
  /products
    /                       - List all products
    /new                    - Create new product
    /[id]                   - Edit product
```

### API Endpoints

All endpoints require admin authentication:

```
# Blog
GET    /api/admin/blog
POST   /api/admin/blog
GET    /api/admin/blog/[id]
PATCH  /api/admin/blog/[id]
DELETE /api/admin/blog/[id]

# Videos
GET    /api/admin/videos
POST   /api/admin/videos
GET    /api/admin/videos/[id]
PATCH  /api/admin/videos/[id]
DELETE /api/admin/videos/[id]

# Testimonials
GET    /api/admin/testimonials
POST   /api/admin/testimonials
GET    /api/admin/testimonials/[id]
PATCH  /api/admin/testimonials/[id]
DELETE /api/admin/testimonials/[id]

# Events
GET    /api/admin/events
POST   /api/admin/events
GET    /api/admin/events/[id]
PATCH  /api/admin/events/[id]
DELETE /api/admin/events/[id]

# Resources
GET    /api/admin/resources
POST   /api/admin/resources
GET    /api/admin/resources/[id]
PATCH  /api/admin/resources/[id]
DELETE /api/admin/resources/[id]

# Products
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/[id]
PATCH  /api/admin/products/[id]
DELETE /api/admin/products/[id]

# Auth
POST   /api/admin/login
POST   /api/admin/logout

# Media
POST   /api/admin/upload-image
```

## Components

### Reusable Admin Components

Located in `components/admin/`:

- `admin-layout.tsx` - Shared layout with nav and header
- `blog-form.tsx` - Blog post creation/editing form
- `video-form.tsx` - Video creation/editing form
- `testimonial-form.tsx` - Testimonial creation/editing form
- `event-form.tsx` - Event creation/editing form
- `resource-form.tsx` - Resource creation/editing form
- `product-form.tsx` - Product creation/editing form
- `rich-text-editor.tsx` - WYSIWYG editor for blog posts
- `image-upload.tsx` - Drag-and-drop image upload component

## Features

### Rich Text Editor
- Bold, italic, strikethrough
- Headings (H1, H2, H3)
- Bullet and numbered lists
- Blockquotes and code blocks
- Links and images
- Undo/redo
- Character count

### Image Upload
- Drag and drop interface
- File type validation (JPG, PNG, WebP, GIF)
- 5MB file size limit
- Preview before upload
- Automatic upload to Supabase Storage
- Remove and replace functionality

### Publishing Workflow
- Save as draft
- Publish immediately
- Edit published content
- Unpublish/archive
- Delete with confirmation

## Security

### ✅ Implemented Security Features

- **Middleware Protection**: All `/admin` and `/api/admin` routes protected via `middleware.ts`
- **JWT Authentication**: Tokens stored in HTTP-only cookies (24h expiration)
- **Image Upload Auth**: Upload endpoint requires authentication
- **Required SESSION_SECRET**: App throws error if not configured (no fallback)
- **Service Role Key**: Used server-side only for admin operations
- **RLS Policies**: Row Level Security on all Supabase tables
- **CSRF Protection**: SameSite cookies prevent CSRF attacks
- **Bucket Validation**: Image uploads validate bucket names
- **File Validation**: Type and size validation before upload

### ⚠️ Security Considerations for Production

**IMPORTANT**: Before deploying to production, review `SECURITY-FIXES.md` for:
- Plain text password comparison (needs bcrypt)
- Rate limiting on login (needs implementation)
- Additional hardening recommendations

See `PRODUCTION-CHECKLIST.md` for complete deployment checklist.

## Next Steps

### Optional Enhancements

1. **Add TipTap Extensions**
   - Tables
   - Color picker
   - Text alignment
   - More formatting options

2. **Multiple Image Upload**
   - Batch upload for products
   - Image gallery management
   - Image editing/cropping

3. **Content Scheduling**
   - Schedule publish dates
   - Auto-publish at specified time

4. **User Roles**
   - Admin vs Editor permissions
   - Content approval workflow

5. **Analytics Integration**
   - View counts
   - Popular content
   - User engagement metrics

6. **Search & Filter**
   - Full-text search
   - Advanced filtering
   - Bulk actions

7. **Revision History**
   - Track content changes
   - Restore previous versions
   - Audit log

## Troubleshooting

### Can't Login
- Check ADMIN_USERNAME and ADMIN_PASSWORD in .env.local
- Verify SESSION_SECRET is set
- Clear browser cookies and try again

### Images Won't Upload
- Verify Supabase storage buckets are created and public
- Check SUPABASE_SERVICE_ROLE_KEY is correct
- Ensure file size is under 5MB

### Content Not Saving
- Check Supabase connection
- Verify API keys are correct
- Check browser console for errors
- Verify database schema was run correctly

### RLS Errors
- Ensure RLS policies were created via schema.sql
- Verify service role key is being used server-side
- Check that anon key is being used client-side

## Files Structure

```
app/
  admin/
    login/page.tsx
    page.tsx (dashboard)
    blog/
    videos/
    testimonials/
    events/
    resources/
    products/
  api/admin/
    login/route.ts
    logout/route.ts
    upload-image/route.ts
    blog/
    videos/
    testimonials/
    events/
    resources/
    products/

components/admin/
  admin-layout.tsx
  blog-form.tsx
  video-form.tsx
  testimonial-form.tsx
  event-form.tsx
  resource-form.tsx
  product-form.tsx
  rich-text-editor.tsx
  image-upload.tsx

lib/
  admin-auth.ts
  supabase/
    client.ts
    server.ts
    storage.ts

supabase/
  schema.sql
  README.md
  STORAGE-SETUP.md
```

## Support

For questions or issues with the admin CMS:
1. Check the Supabase logs for errors
2. Review browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure database schema has been applied

## License

Built for Waggin Meals by Claude Code
