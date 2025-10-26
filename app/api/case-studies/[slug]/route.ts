import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Transform database row to frontend format
function transformCaseStudy(dbRow: any) {
  return {
    id: dbRow.id,
    slug: dbRow.slug,
    dogName: dbRow.dog_name,
    breed: dbRow.breed,
    age: dbRow.age,
    weight: dbRow.weight,
    sex: dbRow.sex,
    ownerName: dbRow.owner_name,
    location: dbRow.location,
    title: dbRow.title,
    summary: dbRow.summary,
    healthIssues: dbRow.health_issues || [],
    symptoms: dbRow.symptoms || [],
    diagnosis: dbRow.diagnosis,
    problemDuration: dbRow.problem_duration,
    timeToResults: dbRow.time_to_results,
    productsUsed: dbRow.products_used || [],
    servicesUsed: dbRow.services_used || [],
    customPlan: dbRow.custom_plan,
    resultsAchieved: dbRow.results_achieved || [],
    beforeMetrics: dbRow.before_metrics,
    afterMetrics: dbRow.after_metrics,
    fullStory: dbRow.full_story,
    ownerQuote: dbRow.owner_quote,
    christieNotes: dbRow.christie_notes,
    beforePhotos: dbRow.before_photos || [],
    afterPhotos: dbRow.after_photos || [],
    heroImage: dbRow.hero_image,
    category: dbRow.category,
    tags: dbRow.tags || [],
    featured: dbRow.featured,
    published: dbRow.published,
    publishedAt: dbRow.published_at,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
    seoTitle: dbRow.seo_title,
    seoDescription: dbRow.seo_description,
  };
}

// GET /api/case-studies/[slug] - Get single published case study by slug (public endpoint)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = createServerClient();
    const { slug } = await context.params;

    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching case study:', error);
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    const transformedData = transformCaseStudy(data);
    return NextResponse.json({ caseStudy: transformedData });

  } catch (error) {
    console.error('Error in GET /api/case-studies/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
