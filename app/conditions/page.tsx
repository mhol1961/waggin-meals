import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { ConditionPage } from '@/types/condition-page';

export const metadata: Metadata = {
  title: 'Dog Health Conditions - Fresh Food Nutrition Plans | Waggin Meals',
  description: 'Explore custom fresh food nutrition plans for dogs with specific health conditions. Board-certified nutritionist guidance for allergies, pancreatitis, kidney disease, and more.',
};

async function getPublishedPages(): Promise<ConditionPage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('condition_pages')
    .select('*')
    .eq('status', 'published')
    .order('condition_name', { ascending: true });

  if (error || !data) return [];
  return data as ConditionPage[];
}

export default async function ConditionsIndex() {
  const pages = await getPublishedPages();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#F8F5F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fresh Food for Dogs with Health Conditions
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Science-based nutrition plans from a board-certified canine nutritionist. Find guidance for your dog's specific health needs.
            </p>
            <Link
              href="/nutrition-services"
              className="inline-flex items-center px-8 py-4 bg-[#8FAE8F] text-white font-semibold rounded-lg hover:bg-[#6d8c6d] transition-colors"
            >
              Get a Custom Nutrition Plan
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No condition pages published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/conditions/${page.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#8FAE8F]/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#8FAE8F] transition-colors">
                      {page.condition_name}
                    </h2>
                    <svg
                      className="w-5 h-5 text-[#8FAE8F] transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {page.meta_description || page.content.hero_subheading}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {page.seo_score >= 80 && (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">SEO Optimized</span>
                      </span>
                    )}
                    {page.content.faq.length > 0 && (
                      <span>{page.content.faq.length} FAQs</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8FAE8F] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Don't See Your Dog's Condition?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our board-certified nutritionist can help with any health condition. Get a personalized plan today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nutrition-services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#8FAE8F] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Schedule a Consultation
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#6d8c6d] text-white font-semibold rounded-lg hover:bg-[#5E8C8C] transition-colors"
            >
              Browse Fresh Meals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
