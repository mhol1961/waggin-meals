import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import NewsletterSignupForm from '@/components/newsletter-signup-form';
import { generateMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = generateMetadata({
  title: 'Blog - Dog Nutrition Tips & Advice',
  description: 'Expert canine nutrition advice, tips, and insights from board-certified nutritionist Christie Naquin. Learn about fresh dog food, gut health, and natural pet care.',
  keywords: ['dog nutrition blog', 'pet health tips', 'canine wellness', 'fresh dog food advice', 'dog gut health'],
  url: '/blog',
});

async function getBlogPosts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_date', { ascending: false });

  if (error || !data || data.length === 0) {
    return [];
  }

  // Transform database posts to match original format
  return data.map(post => ({
    title: post.title,
    excerpt: post.excerpt || '',
    image: post.featured_image || '/images/woman-with-white-dog.webp',
    category: post.category,
    date: new Date(post.published_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    readTime: post.read_time ? `${post.read_time} min read` : '',
    slug: post.slug,
  }));
}

async function getCategories() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('is_published', true);

  if (!data) return ["All Posts", "Nutrition Basics", "Feeding Tips", "Ingredient Insights", "Success Stories", "Seasonal Tips", "Health Conditions"];

  const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
  return ["All Posts", ...uniqueCategories];
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category: selectedCategory } = await searchParams;
  const allPosts = await getBlogPosts();
  const categories = await getCategories();

  // Filter posts by category if one is selected
  const filteredPosts = selectedCategory && selectedCategory !== 'All Posts'
    ? allPosts.filter(post => post.category === selectedCategory)
    : allPosts;

  // Featured post is the most recent from filtered results
  const featuredPost = filteredPosts[0] || null;
  const blogPosts = filteredPosts.slice(1);
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Pet Nutrition Insights
          </h1>
          <p className="text-lg text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Expert advice, practical tips, and science-backed guidance for feeding your dog better
          </p>
          <p className="text-sm text-white opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            By Christie, Certified Pet Nutritionist
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const isActive = category === 'All Posts'
                ? !selectedCategory || selectedCategory === 'All Posts'
                : selectedCategory === category;

              const href = category === 'All Posts' ? '/blog' : `/blog?category=${encodeURIComponent(category)}`;

              return (
                <Link
                  key={category}
                  href={href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#8FAE8F] text-white"
                      : "bg-gray-100 text-[#666666] hover:bg-gray-200"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="bg-[#f8f9fa] px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#8FAE8F] text-white px-4 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-[#8FAE8F] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {featuredPost.category}
                    </span>
                    <span className="text-xs text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {featuredPost.date} · {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {featuredPost.title}
                  </h2>
                  <p className="text-[15px] text-[#666666] mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-block bg-[#8FAE8F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            {selectedCategory && selectedCategory !== 'All Posts'
              ? `${selectedCategory} Articles`
              : 'Latest Articles'}
          </h2>

          {blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No articles found in this category yet.
              </p>
              <Link
                href="/blog"
                className="inline-block text-[#8FAE8F] hover:text-[#6d8c6d] font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                ← View all articles
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
              <article key={post.slug} className="bg-[#f8f9fa] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-[#8FAE8F] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {post.category}
                    </span>
                    <span className="text-xs text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 hover:text-[#8FAE8F] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-[14px] text-[#666666] mb-4 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {post.date}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-semibold text-[#8FAE8F] hover:text-[#6d8c6d] transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {blogPosts.length > 0 && (
            <div className="text-center mt-12">
              <button
                className="bg-white border-2 border-[#8FAE8F] text-[#8FAE8F] px-8 py-3 rounded-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Never Miss a Post
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Get weekly nutrition tips, recipes, and exclusive insights delivered to your inbox
          </p>
          <NewsletterSignupForm source="blog" variant="blog" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready for Personalized Guidance?
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Reading articles is a great start, but nothing beats a custom meal plan designed specifically for your dog's unique needs.
          </p>
          <Link
            href="/nutrition-services"
            className="inline-block bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Your Consultation - $395
          </Link>
        </div>
      </section>

      {/* Development Note */}
      <section className="bg-[#d1ecf1] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start">
            <svg className="h-8 w-8 text-[#0c5460] mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-[#0c5460] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Blog Content Management
              </h3>
              <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                This blog page structure is ready for content. You can either:
              </p>
              <ul className="list-disc list-inside mt-2 text-[13px] text-[#0c5460] space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>Add blog posts as individual MDX files in <code className="bg-[#0c5460] bg-opacity-10 px-2 py-1 rounded">/app/blog/[slug]/page.tsx</code></li>
                <li>Integrate a headless CMS (Sanity, Contentful, or Strapi)</li>
                <li>Use a Markdown-based solution like Contentlayer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
