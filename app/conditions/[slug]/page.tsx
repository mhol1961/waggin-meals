import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { ConditionPage } from '@/types/condition-page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getConditionPage(slug: string): Promise<ConditionPage | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('condition_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data as ConditionPage;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getConditionPage(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.meta_title || page.content.h1,
    description: page.meta_description || page.content.hero_subheading,
    keywords: [page.primary_keyword || '', ...(page.secondary_keywords || [])].join(', '),
    openGraph: {
      title: page.meta_title || page.content.h1,
      description: page.meta_description || page.content.hero_subheading,
      type: 'article',
      url: `https://wagginmeals.com/conditions/${slug}`,
    },
  };
}

export default async function ConditionPageTemplate({ params }: PageProps) {
  const { slug } = await params;
  const page = await getConditionPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD Schema Markup */}
      {page.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema_markup) }}
        />
      )}

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-[#8FAE8F]/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center gap-2 text-gray-600">
                <li><Link href="/" className="hover:text-[#5E8C8C]">Home</Link></li>
                <li>/</li>
                <li><Link href="/conditions" className="hover:text-[#5E8C8C]">Conditions</Link></li>
                <li>/</li>
                <li className="text-gray-900 font-medium">{page.condition_name}</li>
              </ol>
            </nav>

            {/* Hero Content */}
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {page.content.h1}
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                {page.content.hero_subheading}
              </p>

              {/* Hero CTA */}
              {page.content.cta_placements.includes('hero') && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/nutrition-services"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#8FAE8F]/600 text-white font-semibold rounded-lg hover:bg-[#8FAE8F]/700 transition-colors"
                  >
                    Get Your Custom Nutrition Plan
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#5E8C8C] font-semibold rounded-lg border-2 border-[#8FAE8F] hover:bg-[#F8F5F0] transition-colors"
                  >
                    Browse Fresh Meals
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Content Sections */}
            <div className="lg:col-span-2 space-y-12">
              {page.content.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {section.heading}
                  </h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />

                  {/* Middle CTA */}
                  {index === Math.floor(page.content.sections.length / 2) &&
                   page.content.cta_placements.includes('middle') && (
                    <div className="mt-8 p-6 bg-[#F8F5F0] border border-[#8FAE8F]/20 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Ready to Help Your Dog Thrive?
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Get a personalized nutrition plan from our board-certified canine nutritionist.
                      </p>
                      <Link
                        href="/nutrition-services"
                        className="inline-flex items-center px-6 py-3 bg-[#8FAE8F]/600 text-white font-semibold rounded-lg hover:bg-[#8FAE8F]/700 transition-colors"
                      >
                        Book Your Consultation
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Consultation CTA Card */}
                <div className="bg-[#8FAE8F] text-white rounded-xl p-6 shadow-lg">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#5E8C8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Expert Help Available</h3>
                    <p className="text-sm opacity-90">
                      Board-Certified Canine Nutritionist
                    </p>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Custom meal plans for your dog's specific needs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Science-based nutrition recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Ongoing support and recipe adjustments</span>
                    </li>
                  </ul>
                  <Link
                    href="/nutrition-services"
                    className="block w-full text-center px-6 py-3 bg-white text-[#5E8C8C] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Schedule Consultation
                  </Link>
                </div>

                {/* Related Resources */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/blog" className="text-[#5E8C8C] hover:text-[#6d8c6d] text-sm font-medium">
                        → Read Our Blog Posts
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop" className="text-[#5E8C8C] hover:text-[#6d8c6d] text-sm font-medium">
                        → Browse Fresh Meals
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources" className="text-[#5E8C8C] hover:text-[#6d8c6d] text-sm font-medium">
                        → Free Resources
                      </Link>
                    </li>
                    <li>
                      <Link href="/case-studies" className="text-[#5E8C8C] hover:text-[#6d8c6d] text-sm font-medium">
                        → Success Stories
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* FAQ Section */}
        {page.content.faq.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {page.content.faq.map((item, index) => (
                  <details
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                      {item.question}
                    </summary>
                    <p className="mt-4 text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        {page.content.cta_placements.includes('bottom') && (
          <section className="bg-[#8FAE8F] py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Give Your Dog the Nutrition They Deserve
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Work with a board-certified nutritionist to create a custom meal plan for your dog's health needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/nutrition-services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#5E8C8C] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Schedule Your Consultation
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#8FAE8F]/700 text-white font-semibold rounded-lg hover:bg-[#8FAE8F]/800 transition-colors"
                >
                  Shop Fresh Meals
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
