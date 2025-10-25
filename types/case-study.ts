// Case Study Types

export interface CaseStudy {
  id: string;
  slug: string;

  // Dog Information
  dogName: string;
  breed: string;
  age: number; // in years
  weight: number; // in pounds
  sex: 'male' | 'female' | 'neutered-male' | 'spayed-female';

  // Owner Information
  ownerName: string;
  location: string; // City, State

  // Case Details
  title: string; // e.g., "How Fresh Food Cured Bella's Digestive Issues"
  summary: string; // Short 1-2 sentence summary

  // Health Information
  healthIssues: string[]; // Primary health issues addressed
  symptoms: string[]; // Symptoms before treatment
  diagnosis?: string; // Official vet diagnosis if applicable

  // Timeline
  problemDuration: string; // e.g., "2 years", "6 months"
  timeToResults: string; // e.g., "2 weeks", "3 months"

  // Treatment
  productsUsed: string[]; // Waggin Meals products
  servicesUsed: string[]; // Consultation types
  customPlan?: string; // Description of custom plan

  // Results
  resultsAchieved: string[]; // List of improvements
  beforeMetrics?: {
    weight?: number;
    energy?: string;
    symptoms?: string[];
    [key: string]: any;
  };
  afterMetrics?: {
    weight?: number;
    energy?: string;
    symptoms?: string[];
    [key: string]: any;
  };

  // Content
  fullStory: string; // HTML content (rich text editor)
  ownerQuote: string; // Main testimonial quote
  christieNotes?: string; // Professional insights from Christie

  // Media
  beforePhotos: string[]; // Image URLs
  afterPhotos: string[]; // Image URLs
  heroImage: string; // Main featured image

  // Metadata
  category: string; // Primary category for filtering
  tags: string[]; // Additional tags for search
  featured: boolean; // Show in featured section
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
}

export type HealthIssueCategory =
  | 'Digestive Issues'
  | 'Weight Management'
  | 'Skin & Coat'
  | 'Allergies'
  | 'Joint & Mobility'
  | 'Energy & Vitality'
  | 'Picky Eating'
  | 'Kidney Disease'
  | 'Liver Disease'
  | 'Heart Health'
  | 'Dental Health'
  | 'Behavioral Issues'
  | 'Senior Dog Care'
  | 'Puppy Development'
  | 'Other';

export type DogSize = 'Toy' | 'Small' | 'Medium' | 'Large' | 'Giant';

export interface CaseStudyFilters {
  searchQuery?: string;
  healthIssues?: string[];
  breed?: string;
  size?: DogSize;
  ageRange?: 'puppy' | 'adult' | 'senior' | 'all';
  timeToResults?: 'quick' | 'moderate' | 'long-term' | 'all';
  category?: string;
  tags?: string[];
}

export interface CaseStudySummary {
  id: string;
  slug: string;
  dogName: string;
  breed: string;
  title: string;
  summary: string;
  healthIssues: string[];
  heroImage: string;
  category: string;
  timeToResults: string;
  featured: boolean;
}

// Helper functions
export function getDogSize(weight: number): DogSize {
  if (weight < 10) return 'Toy';
  if (weight < 25) return 'Small';
  if (weight < 50) return 'Medium';
  if (weight < 100) return 'Large';
  return 'Giant';
}

export function getAgeCategory(age: number): 'puppy' | 'adult' | 'senior' {
  if (age < 1) return 'puppy';
  if (age < 7) return 'adult';
  return 'senior';
}

export function filterCaseStudies(
  caseStudies: CaseStudy[],
  filters: CaseStudyFilters
): CaseStudy[] {
  let filtered = caseStudies;

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (cs) =>
        cs.dogName.toLowerCase().includes(query) ||
        cs.breed.toLowerCase().includes(query) ||
        cs.title.toLowerCase().includes(query) ||
        cs.summary.toLowerCase().includes(query) ||
        cs.healthIssues.some((h) => h.toLowerCase().includes(query)) ||
        cs.symptoms.some((s) => s.toLowerCase().includes(query)) ||
        cs.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // Health issues
  if (filters.healthIssues && filters.healthIssues.length > 0) {
    filtered = filtered.filter((cs) =>
      filters.healthIssues!.some((issue) => cs.healthIssues.includes(issue))
    );
  }

  // Breed
  if (filters.breed) {
    filtered = filtered.filter((cs) =>
      cs.breed.toLowerCase().includes(filters.breed!.toLowerCase())
    );
  }

  // Size
  if (filters.size) {
    filtered = filtered.filter((cs) => getDogSize(cs.weight) === filters.size);
  }

  // Age range
  if (filters.ageRange && filters.ageRange !== 'all') {
    filtered = filtered.filter((cs) => getAgeCategory(cs.age) === filters.ageRange);
  }

  // Category
  if (filters.category) {
    filtered = filtered.filter((cs) => cs.category === filters.category);
  }

  // Tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((cs) =>
      filters.tags!.some((tag) => cs.tags.includes(tag))
    );
  }

  return filtered;
}

export function sortCaseStudies(
  caseStudies: CaseStudy[],
  sortBy: 'newest' | 'oldest' | 'featured' | 'name'
): CaseStudy[] {
  const sorted = [...caseStudies];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime()
      );
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    case 'name':
      return sorted.sort((a, b) => a.dogName.localeCompare(b.dogName));
    default:
      return sorted;
  }
}
