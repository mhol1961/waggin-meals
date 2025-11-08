'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MapPin, Scale, Ruler, Heart, Clock, CheckCircle2, Quote } from 'lucide-react';
import type { CaseStudy } from '@/types/case-study';
import { getDogSize } from '@/types/case-study';

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCaseStudy() {
      try {
        setLoading(true);
        const response = await fetch(`/api/case-studies/${slug}`);

        if (!response.ok) {
          setCaseStudy(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setCaseStudy(data.caseStudy);
      } catch (error) {
        console.error('Error fetching case study:', error);
        setCaseStudy(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseStudy();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FAE8F] mx-auto"></div>
          <p className="mt-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading case study...</p>
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[32px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Case Study Not Found
          </h1>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            The case study you\'re looking for doesn\'t exist or has been removed.
          </p>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 bg-[#8FAE8F] text-white px-6 py-3 rounded-full hover:bg-[#8fa3d9] transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  return (
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
                {caseStudy.healthIssues.map((issue, index) => (
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
                      Christie\'s Professional Notes
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
                  {caseStudy.resultsAchieved.map((result, index) => (
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
                  {caseStudy.productsUsed.map((product, index) => (
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
                  {caseStudy.servicesUsed.map((service, index) => (
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
  );
}
