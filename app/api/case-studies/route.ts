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

// GET /api/case-studies - Get published case studies (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const healthIssues = searchParams.get('healthIssues')?.split(',').filter(Boolean) || [];
    const size = searchParams.get('size') || '';
    const ageRange = searchParams.get('ageRange') || 'all';
    const sortBy = searchParams.get('sortBy') || 'featured';
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('case_studies')
      .select('*', { count: 'exact' })
      .eq('published', true);

    // Search by dog name, breed, or title
    if (search) {
      query = query.or(`dog_name.ilike.%${search}%,breed.ilike.%${search}%,title.ilike.%${search}%`);
    }

    // Filter by health issues
    if (healthIssues.length > 0) {
      query = query.contains('health_issues', healthIssues);
    }

    // Filter by dog size (based on weight)
    if (size) {
      switch (size.toLowerCase()) {
        case 'toy':
          query = query.lte('weight', 10);
          break;
        case 'small':
          query = query.gte('weight', 11).lte('weight', 25);
          break;
        case 'medium':
          query = query.gte('weight', 26).lte('weight', 60);
          break;
        case 'large':
          query = query.gte('weight', 61).lte('weight', 100);
          break;
        case 'giant':
          query = query.gte('weight', 101);
          break;
      }
    }

    // Filter by age range
    if (ageRange !== 'all') {
      switch (ageRange) {
        case 'puppy':
          query = query.lte('age', 1);
          break;
        case 'adult':
          query = query.gte('age', 2).lte('age', 7);
          break;
        case 'senior':
          query = query.gte('age', 8);
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        query = query.order('published_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('published_at', { ascending: true });
        break;
      case 'name':
        query = query.order('dog_name', { ascending: true });
        break;
      case 'featured':
      default:
        query = query.order('featured', { ascending: false }).order('published_at', { ascending: false });
        break;
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching case studies:', error);
      return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
    }

    // Transform all case studies to frontend format
    const transformedData = (data || []).map(transformCaseStudy);

    return NextResponse.json({
      caseStudies: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/case-studies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
