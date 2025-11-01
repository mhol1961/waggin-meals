'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { filterCaseStudies, sortCaseStudies, getDogSize, type CaseStudy, type CaseStudyFilters, type DogSize } from '@/types/case-study';

// Helper function to map database fields to frontend types
function mapDatabaseToFrontend(dbCase: any): CaseStudy {
  return {
    id: dbCase.id,
    slug: dbCase.slug,
    dogName: dbCase.dog_name,
    breed: dbCase.breed,
    age: dbCase.age,
    weight: parseFloat(dbCase.weight),
    sex: dbCase.sex,
    ownerName: dbCase.owner_name,
    location: dbCase.location,
    title: dbCase.title,
    summary: dbCase.summary,
    healthIssues: dbCase.health_issues || [],
    symptoms: dbCase.symptoms || [],
    diagnosis: dbCase.diagnosis || '',
    problemDuration: dbCase.problem_duration || '',
    timeToResults: dbCase.time_to_results || '',
    productsUsed: dbCase.products_used || [],
    servicesUsed: dbCase.services_used || [],
    customPlan: dbCase.custom_plan,
    resultsAchieved: dbCase.results_achieved || [],
    beforeMetrics: dbCase.before_metrics || { weight: dbCase.before_weight, energy: dbCase.before_energy },
    afterMetrics: dbCase.after_metrics || { weight: dbCase.after_weight, energy: dbCase.after_energy },
    fullStory: dbCase.full_story,
    ownerQuote: dbCase.owner_quote,
    christieNotes: dbCase.christie_notes,
    beforePhotos: dbCase.before_photos || [],
    afterPhotos: dbCase.after_photos || [],
    heroImage: dbCase.hero_image || '/images/woman-with-white-dog.webp',
    category: dbCase.category || '',
    tags: dbCase.tags || [],
    featured: dbCase.featured,
    published: dbCase.published,
    publishedAt: dbCase.published_at,
    createdAt: dbCase.created_at,
    updatedAt: dbCase.updated_at,
    seoTitle: dbCase.seo_title,
    seoDescription: dbCase.seo_description,
  };
}

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'featured' | 'name';

const HEALTH_ISSUE_OPTIONS = [
  'Digestive Issues',
  'Weight Management',
  'Skin & Coat',
  'Allergies',
  'Joint & Mobility',
  'Energy & Vitality',
  'Picky Eating',
  'Kidney Disease',
  'Senior Dog Care',
  'Puppy Development',
];

const DOG_SIZE_OPTIONS: DogSize[] = ['Toy', 'Small', 'Medium', 'Large', 'Giant'];

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHealthIssues, setSelectedHealthIssues] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<DogSize | ''>('');
  const [selectedAgeRange, setSelectedAgeRange] = useState<'puppy' | 'adult' | 'senior' | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch case studies from API
  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        setLoading(true);
        const response = await fetch('/api/case-studies?limit=100');
        if (!response.ok) throw new Error('Failed to fetch case studies');

        const data = await response.json();
        const mappedCases = (data.caseStudies || []).map(mapDatabaseToFrontend);
        setCaseStudies(mappedCases);
      } catch (error) {
        console.error('Error fetching case studies:', error);
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseStudies();
  }, []);

  // Filter and sort case studies
  const filteredAndSortedCases = useMemo(() => {
    const filters: CaseStudyFilters = {
      searchQuery,
      healthIssues: selectedHealthIssues.length > 0 ? selectedHealthIssues : undefined,
      size: selectedSize || undefined,
      ageRange: selectedAgeRange,
    };

    const filtered = filterCaseStudies(caseStudies, filters);
    return sortCaseStudies(filtered, sortBy);
  }, [caseStudies, searchQuery, selectedHealthIssues, selectedSize, selectedAgeRange, sortBy]);

  const toggleHealthIssue = (issue: string) => {
    setSelectedHealthIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedHealthIssues([]);
    setSelectedSize('');
    setSelectedAgeRange('all');
  };

  const activeFilterCount =
    selectedHealthIssues.length +
    (selectedSize ? 1 : 0) +
    (selectedAgeRange !== 'all' ? 1 : 0);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Case Studies & Success Stories
          </h1>
          <p className="text-lg text-white mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Detailed transformations from real dogs. Search by breed, health issue, or symptom to find stories like yours.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by breed, health issue, symptom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-full text-[#3c3a47] text-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#a5b5eb]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Filters Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-[#f8f9fa] border border-[#e0e0e0] rounded-lg hover:bg-gray-100 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-semibold">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#a5b5eb] text-white text-xs rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#a5b5eb] hover:text-[#8a9fd9] font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Center: Results Count */}
            <div className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Showing <strong>{filteredAndSortedCases.length}</strong> {filteredAndSortedCases.length === 1 ? 'case study' : 'case studies'}
            </div>

            {/* Right: Sort & View */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-[#e0e0e0] rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Dog Name A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-1 bg-[#f8f9fa] p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                  title="Grid view"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                  title="List view"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Dropdown */}
          {showFilters && (
            <div className="mt-4 p-6 bg-[#f8f9fa] rounded-lg border border-[#e0e0e0]">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Health Issues */}
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Health Issues
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {HEALTH_ISSUE_OPTIONS.map(issue => (
                      <label key={issue} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedHealthIssues.includes(issue)}
                          onChange={() => toggleHealthIssue(issue)}
                          className="w-4 h-4 text-[#a5b5eb] focus:ring-[#a5b5eb] rounded"
                        />
                        <span className="text-sm text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {issue}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dog Size */}
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Dog Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value as DogSize | '')}
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg bg-white focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <option value="">All Sizes</option>
                    {DOG_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Age Range
                  </label>
                  <div className="space-y-2">
                    {['all', 'puppy', 'adult', 'senior'].map(age => (
                      <label key={age} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                        <input
                          type="radio"
                          name="ageRange"
                          value={age}
                          checked={selectedAgeRange === age}
                          onChange={(e) => setSelectedAgeRange(e.target.value as any)}
                          className="w-4 h-4 text-[#a5b5eb] focus:ring-[#a5b5eb]"
                        />
                        <span className="text-sm text-[#3c3a47] capitalize" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {age === 'all' ? 'All Ages' : age}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies Grid/List */}
      <section className="bg-[#f8f9fa] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {filteredAndSortedCases.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-[#e0e0e0] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No case studies found
              </p>
              <p className="text-sm text-[#999999] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="inline-block bg-[#a5b5eb] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#8a9fd9] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredAndSortedCases.map((caseStudy) => (
                viewMode === 'grid' ? (
                  <CaseStudyCardGrid key={caseStudy.id} caseStudy={caseStudy} />
                ) : (
                  <CaseStudyCardList key={caseStudy.id} caseStudy={caseStudy} />
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Write Your Dog's Success Story?
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Book a FREE consultation with Christie to create a custom nutrition plan for your dog
          </p>
          <Link
            href="/nutrition-services"
            className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Free Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}

// Grid Card Component
function CaseStudyCardGrid({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="relative h-48">
        <Image
          src={caseStudy.heroImage}
          alt={`${caseStudy.dogName} - ${caseStudy.title}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {caseStudy.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-[#3c3a47] px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-[#a5b5eb] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {caseStudy.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#3c3a47] mb-2 group-hover:text-[#a5b5eb] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {caseStudy.dogName} - {caseStudy.breed}
        </h3>
        <p className="text-sm text-[#666666] mb-3 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {caseStudy.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {caseStudy.healthIssues.slice(0, 2).map(issue => (
            <span key={issue} className="text-xs bg-[#f8f9fa] text-[#666666] px-2 py-1 rounded-full">
              {issue}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-[#999999]">
          <span>Results in {caseStudy.timeToResults}</span>
          <span className="text-[#a5b5eb] font-semibold group-hover:text-[#8a9fd9]">
            Read Story →
          </span>
        </div>
      </div>
    </Link>
  );
}

// List Card Component
function CaseStudyCardList({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className="group flex flex-col sm:flex-row gap-6 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all p-6"
    >
      <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={caseStudy.heroImage}
          alt={`${caseStudy.dogName} - ${caseStudy.title}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-2xl font-semibold text-[#3c3a47] group-hover:text-[#a5b5eb] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {caseStudy.dogName} - {caseStudy.breed}
            </h3>
            <p className="text-sm text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {caseStudy.location} • {caseStudy.age} years old • {getDogSize(caseStudy.weight)}
            </p>
          </div>
          {caseStudy.featured && (
            <span className="bg-yellow-400 text-[#3c3a47] px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        <p className="text-[15px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {caseStudy.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm bg-[#a5b5eb] bg-opacity-10 text-[#a5b5eb] px-3 py-1 rounded-full font-semibold">
            {caseStudy.category}
          </span>
          {caseStudy.healthIssues.slice(0, 3).map(issue => (
            <span key={issue} className="text-xs bg-[#f8f9fa] text-[#666666] px-2 py-1 rounded-full">
              {issue}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Results in {caseStudy.timeToResults}
          </span>
          <span className="text-[#a5b5eb] font-semibold group-hover:text-[#8a9fd9] flex items-center gap-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Read Full Story
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
