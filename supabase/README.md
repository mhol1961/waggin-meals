# Waggin Meals Supabase CMS Setup

This directory contains everything you need to set up your custom CMS using Supabase.

## Step 1: Run the Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv
2. Click on the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the `schema.sql` file in this directory
5. Copy the entire contents and paste into the SQL Editor
6. Click **Run** to execute the script

This will create:
- 6 database tables (blog_posts, videos, testimonials, events, resources, products)
- Indexes for fast queries
- Row Level Security (RLS) policies
- Auto-updating timestamp triggers
- Sample data for testing

## Step 2: Verify Tables Were Created

1. Click on **Table Editor** in the left sidebar
2. You should see all 6 tables listed
3. Click on each table to see the sample data

## Step 3: Get Your Service Role Key (For Admin Panel)

The Service Role key allows the admin panel to bypass Row Level Security and manage all content.

1. Go to **Project Settings** → **API**
2. Find the **service_role** secret key
3. Copy it
4. Add it to your `.env.local` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

**IMPORTANT:** Never commit the service role key to Git! It's already in `.gitignore`.

## Database Structure

### blog_posts
- Stores all blog articles
- Fields: title, slug, content, category, tags, published_date, is_published
- Sample: "Getting Started with Fresh Food for Dogs"

### videos
- Christie's video library
- Fields: title, description, video_url, thumbnail_url, duration, category, tags
- Supports YouTube URLs or self-hosted videos

### testimonials
- Client success stories
- Fields: dog_name, owner_name, problem, result, quote, rating, category
- Sample: Bella's weight loss story

### events
- Workshops, webinars, classes
- Fields: title, description, start_date, location, price, registration_url
- Sample: "Fresh Food Basics Workshop"

### resources
- PDF guides and downloads
- Fields: title, description, file_url, resource_type, is_free, price
- For the free guides section

### products
- E-commerce products (Phase 2)
- Fields: title, handle, price, inventory_count, images, category
- For the shop page

## Using the Database in Your App

### Client-Side (Public Read Access)

```typescript
import { supabase } from '@/lib/supabase/client';

// Get all published blog posts
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('is_published', true)
  .order('published_date', { ascending: false });
```

### Server-Side (Admin Access)

```typescript
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/supabase/server';

// In a server component or API route
const posts = await getAllBlogPosts(); // All posts
const post = await getBlogPostBySlug('getting-started-fresh-food');
```

## Next Steps

1. **Run the SQL schema** (instructions above)
2. **Add Service Role Key** to `.env.local`
3. **Access the admin panel** at `/admin` (once built)
4. **Start adding content** through the admin interface

## Troubleshooting

### Tables don't appear
- Make sure you ran the entire SQL script
- Check the SQL Editor for errors (red text)
- Try running sections one at a time

### Permission errors
- Ensure Row Level Security policies were created
- Check that `is_published = true` for content you want visible
- Verify your anon key and service role key are correct

### Sample data not showing
- The INSERT statements are at the bottom of the schema.sql
- Make sure those ran successfully
- You can always add more data through the Table Editor

## Security Notes

- **Public Content**: Only items with `is_published = true` are visible to website visitors
- **Admin Access**: Service role key bypasses all security - keep it secret!
- **RLS Policies**: Automatically filter content based on published status
- **No Auth Required**: Public can read published content without signing in

## Database Management

You can manage your database in three ways:

1. **Supabase Table Editor** (GUI) - Best for quick edits
2. **SQL Editor** - For complex queries and bulk operations
3. **Admin Panel** (Coming soon) - User-friendly CMS interface
