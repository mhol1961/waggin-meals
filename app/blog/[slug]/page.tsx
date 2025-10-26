import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Calendar, Clock, Tag, Calculator, BookOpen, Award, Heart, ExternalLink } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Waggin Meals Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.published_date
    ? new Date(post.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
      {/* Beautiful Hero Section */}
      <div className="relative bg-gradient-to-br from-[#a5b5eb] via-[#c5d4f7] to-[#e8f4fb] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#bc2c2c] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#3c3a47] hover:text-[#bc2c2c] mb-6 transition-colors group"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#bc2c2c] px-4 py-2 rounded-full text-[14px] font-semibold shadow-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Tag className="w-4 h-4" />
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[42px] md:text-[56px] font-bold text-[#3c3a47] mb-6 leading-tight max-w-4xl" style={{ fontFamily: "'Abril Fatface', serif" }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-[20px] text-[#666666] mb-6 leading-relaxed max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#bc2c2c] to-[#d63447] flex items-center justify-center text-white font-bold">
                {post.author?.[0] || 'C'}
              </div>
              <span className="font-medium text-[#3c3a47]">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#a5b5eb]" />
              <span>{publishedDate}</span>
            </div>
            {post.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#a5b5eb]" />
                <span>{post.read_time} min read</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="container mx-auto px-4 -mt-12 mb-12 relative z-20">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover object-center"
              style={{ objectPosition: '50% 20%' }}
              priority
            />
          </div>
        </div>
      )}

      {/* Content with Sidebar */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-[#3c3a47] prose-headings:font-bold
                prose-h2:text-[32px] prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-[24px] prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-[#666666] prose-p:leading-relaxed prose-p:mb-6 prose-p:font-['Poppins']
                prose-a:text-[#bc2c2c] prose-a:no-underline prose-a:font-semibold hover:prose-a:text-[#d63447]
                prose-strong:text-[#3c3a47] prose-strong:font-bold
                prose-ul:text-[#666666] prose-ul:font-['Poppins']
                prose-ol:text-[#666666] prose-ol:font-['Poppins']
                prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-[#a5b5eb] prose-blockquote:bg-[#f8f9fa] prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t-2 border-[#e0e0e0]">
                <h3 className="text-[14px] font-bold text-[#666666] mb-4 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ARTICLE TAGS
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-[#a5b5eb]/10 to-[#c5d4f7]/10 text-[#3c3a47] rounded-full text-[14px] font-medium border border-[#a5b5eb]/20 hover:border-[#a5b5eb] transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - Related Resources */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Quick Resources Card */}
              <div className="bg-gradient-to-br from-[#e8f4fb] to-[#f0f4ff] rounded-2xl p-6 border-2 border-[#a5b5eb]/20 shadow-lg">
                <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4 flex items-center gap-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  <BookOpen className="w-6 h-6 text-[#bc2c2c]" />
                  Helpful Resources
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/feeding-calculator"
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-[#bc2c2c]" />
                      <span className="text-[14px] font-medium text-[#3c3a47] group-hover:text-[#bc2c2c] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Feeding Calculator
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#a5b5eb] group-hover:text-[#bc2c2c] transition-colors" />
                  </Link>

                  <Link
                    href="/case-studies"
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#bc2c2c]" />
                      <span className="text-[14px] font-medium text-[#3c3a47] group-hover:text-[#bc2c2c] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Success Stories
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#a5b5eb] group-hover:text-[#bc2c2c] transition-colors" />
                  </Link>

                  <Link
                    href="/guides/fresh-food-guide"
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-[#bc2c2c]" />
                      <span className="text-[14px] font-medium text-[#3c3a47] group-hover:text-[#bc2c2c] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Fresh Food Guide
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#a5b5eb] group-hover:text-[#bc2c2c] transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Consultation CTA */}
              <div className="bg-gradient-to-br from-[#bc2c2c] to-[#d63447] rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-6 h-6" />
                  <h3 className="text-[20px] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Need Expert Help?
                  </h3>
                </div>
                <p className="text-[14px] mb-4 text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Get a personalized nutrition plan from Christie, our board-certified canine nutritionist.
                </p>
                <Link
                  href="/nutrition-services"
                  className="block text-center bg-white text-[#bc2c2c] px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-[#f8f9fa] transition-colors shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Book Consultation →
                </Link>
              </div>

              {/* Category Link */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e0e0e0] hover:border-[#a5b5eb] transition-colors">
                <Link
                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                  className="flex items-center justify-between group"
                >
                  <span className="text-[14px] font-medium text-[#666666] group-hover:text-[#bc2c2c] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    More in <strong>{post.category}</strong>
                  </span>
                  <ExternalLink className="w-4 h-4 text-[#a5b5eb] group-hover:text-[#bc2c2c] transition-colors" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-br from-[#2f4b38] to-[#3a5a45] text-white py-16 mt-12">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-[36px] md:text-[42px] font-bold mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Transform Your Dog's Health?
          </h2>
          <p className="text-[18px] mb-8 text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Join hundreds of pet parents who have seen amazing results with personalized nutrition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/nutrition-services"
              className="inline-block bg-white text-[#2f4b38] px-8 py-4 rounded-full font-bold text-[16px] hover:bg-[#f8f9fa] transition-all hover:scale-105 shadow-xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Schedule Your Consultation
            </Link>
            <Link
              href="/case-studies"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-[16px] hover:bg-white hover:text-[#2f4b38] transition-all hover:scale-105"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Read Success Stories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
