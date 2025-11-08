import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MapPin, Scale, Ruler, Heart, Clock, CheckCircle2, Quote } from 'lucide-react';
import { getDogSize } from '@/types/case-study';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side data fetching
async function getCaseStudy(slug: string) {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;

  // Map database fields to frontend format
  return {
    id: data.id,
    slug: data.slug,
    dogName: data.dog_name,
    breed: data.breed,
    age: data.age,
    weight: parseFloat(data.weight),
    sex: data.sex,
    ownerName: data.owner_name,
    location: data.location,
    title: data.title,
    summary: data.summary,
    healthIssues: data.health_issues || [],
    symptoms: data.symptoms || [],
    diagnosis: data.diagnosis || '',
    problemDuration: data.problem_duration || '',
    timeToResults: data.time_to_results || '',
    productsUsed: data.products_used || [],
    servicesUsed: data.services_used || [],
    customPlan: data.custom_plan,
    resultsAchieved: data.results_achieved || [],
    beforeMetrics: data.before_metrics || { weight: data.before_weight, energy: data.before_energy },
    afterMetrics: data.after_metrics || { weight: data.after_weight, energy: data.after_energy },
    fullStory: data.full_story,
    ownerQuote: data.owner_quote,
    christieNotes: data.christie_notes,
    beforePhotos: data.before_photos || [],
    afterPhotos: data.after_photos || [],
    heroImage: data.hero_image || '/images/woman-with-white-dog.webp',
    category: data.category || '',
    tags: data.tags || [],
    featured: data.featured,
    published: data.published,
    publishedAt: data.published_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Waggin Meals',
    };
  }

  return {
    title: caseStudy.seoTitle || `${caseStudy.dogName}'s Success Story: ${caseStudy.title} | Waggin Meals`,
    description: caseStudy.seoDescription || caseStudy.summary,
    keywords: `dog nutrition success story, ${caseStudy.healthIssues.join(', ')}, ${caseStudy.breed}, fresh dog food results, ${caseStudy.location}`,
    openGraph: {
      title: `${caseStudy.dogName}'s Transformation - ${caseStudy.title}`,
      description: caseStudy.summary,
      type: 'article',
      url: `https://wagginmeals.com/case-studies/${caseStudy.slug}`,
      publishedTime: caseStudy.publishedAt,
      modifiedTime: caseStudy.updatedAt,
      images: [
        {
          url: caseStudy.heroImage,
          width: 1200,
          height: 630,
          alt: `${caseStudy.dogName} - ${caseStudy.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${caseStudy.dogName}'s Success Story`,
      description: caseStudy.summary,
      images: [caseStudy.heroImage],
    },
  };
}

// Generate Article schema
function generateArticleSchema(caseStudy: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${caseStudy.dogName}'s Success Story: ${caseStudy.title}`,
    description: caseStudy.summary,
    image: caseStudy.heroImage,
    author: {
      '@type': 'Person',
      name: 'Christie Naquin',
      jobTitle: 'Board-Certified Canine Nutritionist',
    },
    publisher: {
      '@type': 'Organization',
      name: "Waggin' Meals",
      logo: {
        '@type': 'ImageObject',
        url: 'https://wagginmeals.com/images/logo-waggin-meals.png',
      },
    },
    datePublished: caseStudy.publishedAt,
    dateModified: caseStudy.updatedAt,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const articleSchema = generateArticleSchema(caseStudy);

  return (
    <>
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[400px] bg-[#8FAE8F]">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              {caseStudy.featured && (
                <span className="inline-block bg-yellow-400 text-[#3c3a47] text-[12px] px-3 py-1 rounded-full mb-4 font-medium">
                  ⭐ Featured Success Story
                </span>
              )}
              <h1 className="text-[48px] font-bold mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {caseStudy.title}
              </h1>
              <p className="text-[20px] opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {caseStudy.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-[#8FAE8F] hover:text-[#8fa3d9] transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Case Studies
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Dog Quick Facts */}
              <div className="bg-[#e8f4fb] rounded-2xl p-8 mb-8 border-l-4 border-[#8FAE8F]">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                    <Image
                      src={caseStudy.heroImage}
                      alt={caseStudy.dogName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[32px] font-bold text-[#3c3a47] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      Meet {caseStudy.dogName}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-[#8FAE8F]" />
                        <span className="text-[#666666]"><strong>Breed:</strong> {caseStudy.breed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8FAE8F]" />
                        <span className="text-[#666666]"><strong>Age:</strong> {caseStudy.age} years old</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-[#8FAE8F]" />
                        <span className="text-[#666666]"><strong>Weight:</strong> {caseStudy.weight} lbs ({getDogSize(caseStudy.weight)})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#8FAE8F]" />
                        <span className="text-[#666666]"><strong>Location:</strong> {caseStudy.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Issues */}
              <div className="mb-8">
                <h3 className="text-[24px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Health Challenges Addressed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.healthIssues.map((issue: string, index: number) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-[14px] font-medium"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#fff3cd] rounded-xl p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-700" />
                    <h4 className="text-[18px] font-bold text-yellow-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Problem Duration
                    </h4>
                  </div>
                  <p className="text-[24px] font-bold text-yellow-800" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {caseStudy.problemDuration}
                  </p>
                </div>
                <div className="bg-[#d4edda] rounded-xl p-6 border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                    <h4 className="text-[18px] font-bold text-green-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Time to Results
                    </h4>
                  </div>
                  <p className="text-[24px] font-bold text-green-800" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {caseStudy.timeToResults}
                  </p>
                </div>
              </div>

              {/* Before/After Metrics */}
              {(caseStudy.beforeMetrics || caseStudy.afterMetrics) && (
                <div className="bg-white border-2 border-[#8FAE8F] rounded-2xl p-8 mb-8">
                  <h3 className="text-[24px] font-bold text-[#3c3a47] mb-6 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Measurable Results
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>BEFORE</p>
                      {caseStudy.beforeMetrics?.weight && (
                        <div className="mb-3">
                          <p className="text-[32px] font-bold text-red-600" style={{ fontFamily: "'Abril Fatface', serif" }}>
                            {caseStudy.beforeMetrics.weight} lbs
                          </p>
                        </div>
                      )}
                      {caseStudy.beforeMetrics?.energy && (
                        <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Energy: {caseStudy.beforeMetrics.energy}
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>AFTER</p>
                      {caseStudy.afterMetrics?.weight && (
                        <div className="mb-3">
                          <p className="text-[32px] font-bold text-green-600" style={{ fontFamily: "'Abril Fatface', serif" }}>
                            {caseStudy.afterMetrics.weight} lbs
                          </p>
                        </div>
                      )}
                      {caseStudy.afterMetrics?.energy && (
                        <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Energy: {caseStudy.afterMetrics.energy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Full Story */}
              <div className="prose prose-lg max-w-none mb-8">
                <div
                  className="text-[16px] leading-relaxed text-[#666666]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: caseStudy.fullStory }}
                />
              </div>

              {/* Owner Quote */}
              <div className="bg-[#8FAE8F]/10 rounded-2xl p-8 mb-8 border-l-4 border-[#8FAE8F]">
                <Quote className="w-12 h-12 text-[#8FAE8F] mb-4" />
                <p className="text-[18px] italic text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  &ldquo;{caseStudy.ownerQuote}&rdquo;
                </p>
                <p className="text-[14px] font-medium text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  — {caseStudy.ownerName}, {caseStudy.location}
                </p>
              </div>

              {/* Christie's Professional Notes */}
              {caseStudy.christieNotes && (
                <div className="bg-[#f8f9fa] rounded-2xl p-8 border-l-4 border-[#3c3a47]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#8FAE8F] flex items-center justify-center flex-shrink-0 text-white text-[24px] font-bold">
                      C
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Christie&apos;s Professional Notes
                      </h3>
                      <p className="text-[16px] text-[#666666] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {caseStudy.christieNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Results Achieved */}
                <div className="bg-white border-2 border-[#d4edda] rounded-2xl p-6">
                  <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    🎯 Results Achieved
                  </h3>
                  <ul className="space-y-3">
                    {caseStudy.resultsAchieved.map((result: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {result}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Products Used */}
                <div className="bg-white border-2 border-[#8FAE8F] rounded-2xl p-6">
                  <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    🥘 Products Used
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.productsUsed.map((product: string, index: number) => (
                      <li key={index} className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        • {product}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services Used */}
                <div className="bg-white border-2 border-[#8FAE8F] rounded-2xl p-6">
                  <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    💼 Services Provided
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.servicesUsed.map((service: string, index: number) => (
                      <li key={index} className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        • {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="bg-[#8FAE8F] rounded-2xl p-6 text-center text-white">
                  <Heart className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-[24px] font-bold mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Get Similar Results
                  </h3>
                  <p className="text-[14px] mb-6 opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Book your free consultation and get a custom nutrition plan for your dog
                  </p>
                  <Link
                    href="/contact"
                    className="block bg-white text-[#8FAE8F] px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Book Free Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
