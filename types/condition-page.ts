// TypeScript interfaces for SEO Content Management System

export interface ConditionPage {
  id: string;

  // Basic Info
  condition_name: string;
  slug: string;

  // SEO Metadata
  meta_title?: string;
  meta_description?: string;
  primary_keyword?: string;
  secondary_keywords?: string[];

  // Content Structure
  content: ConditionPageContent;

  // Automatic SEO Data
  schema_markup?: SchemaMarkup;
  seo_score: number; // 0-100
  keyword_density?: Record<string, number>;
  internal_links?: string[];

  // Images
  featured_image?: string;
  image_alt_tags?: Record<string, string>;

  // Publishing Workflow
  status: 'draft' | 'review' | 'published';
  ai_generated: boolean;
  ai_draft?: ConditionPageContent;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ConditionPageContent {
  h1: string;
  hero_subheading: string;
  sections: ContentSection[];
  faq: FAQItem[];
  cta_placements: ('hero' | 'middle' | 'bottom')[];
}

export interface ContentSection {
  heading: string;
  content: string; // HTML content
  layout?: 'full-width' | 'two-column' | 'grid';
  order: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  order: number;
}

export interface SchemaMarkup {
  '@context': string;
  '@graph': Array<MedicalConditionSchema | FAQPageSchema | BreadcrumbSchema>;
}

export interface MedicalConditionSchema {
  '@type': 'MedicalCondition';
  name: string;
  possibleTreatment: {
    '@type': 'MedicalTherapy';
    name: string;
    description: string;
  };
}

export interface FAQPageSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface BreadcrumbSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// SEO Keywords
export interface SEOKeyword {
  id: string;
  keyword: string;
  search_volume?: number;
  cpc?: number;
  difficulty?: number; // 0-100
  related_keywords?: string[];
  target_page_id?: string;
  current_position?: number; // Google ranking
  last_checked?: string;
  created_at: string;
  updated_at: string;
}

// Site Settings
export interface SiteSetting {
  key: string;
  value?: string;
  description?: string;
  updated_at: string;
}

// Form Data for Creating New Page
export interface NewConditionPageForm {
  condition_name: string;
  primary_keyword: string;
  use_ai: boolean;
}

// AI Generation Request
export interface AIGenerationRequest {
  condition: string;
  primary_keyword: string;
  secondary_keywords?: string[];
}

// AI Generation Response
export interface AIGenerationResponse {
  meta_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string[];
  content: ConditionPageContent;
  schema_markup: SchemaMarkup;
  seo_score: number;
  internal_links: InternalLink[];
  suggested_images: string[];
}

export interface InternalLink {
  anchor_text: string;
  url: string;
  context?: string; // Where to place this link
}

// SEO Check Results
export interface SEOCheckResult {
  total: number; // 0-100
  checks: {
    keywordInTitle: boolean;
    keywordInIntro: boolean;
    wordCount: number;
    headingStructure: boolean;
    keywordDensity: number; // percentage
    internalLinks: number;
    faqCount: number;
    metaDescriptionLength: number;
    imagesWithAlt: boolean;
  };
}

// Keyword Suggestions
export interface KeywordSuggestion {
  keyword: string;
  search_volume?: number;
  cpc?: number;
  relevance_score?: number; // How relevant to current condition
  in_content: boolean; // Already used in content?
}
