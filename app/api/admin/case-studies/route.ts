import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin-auth';

// GET /api/admin/case-studies - List all case studies
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status'); // 'published', 'draft', or 'all'
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('case_studies')
      .select('*', { count: 'exact' });

    // Filter by status
    if (status === 'published') {
      query = query.eq('published', true);
    } else if (status === 'draft') {
      query = query.eq('published', false);
    }

    // Order by created date
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching case studies:', error);
      return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
    }

    return NextResponse.json({
      caseStudies: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/admin/case-studies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/case-studies - Create new case study
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['dogName', 'breed', 'age', 'weight', 'sex', 'ownerName', 'location', 'title', 'summary', 'fullStory', 'ownerQuote'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Generate slug if not provided
    let slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('case_studies')
      .select('id')
      .eq('slug', slug)
      .single();

    // If slug exists, append a number
    if (existing) {
      let counter = 1;
      let newSlug = `${slug}-${counter}`;
      while (true) {
        const { data: check } = await supabase
          .from('case_studies')
          .select('id')
          .eq('slug', newSlug)
          .single();

        if (!check) {
          slug = newSlug;
          break;
        }
        counter++;
        newSlug = `${slug}-${counter}`;
      }
    }

    // Prepare data for insertion
    const caseStudyData = {
      dog_name: body.dogName,
      breed: body.breed,
      age: body.age,
      weight: body.weight,
      sex: body.sex,
      owner_name: body.ownerName,
      location: body.location,
      title: body.title,
      summary: body.summary,
      slug: slug,
      health_issues: body.healthIssues || [],
      symptoms: body.symptoms || [],
      diagnosis: body.diagnosis || null,
      problem_duration: body.problemDuration || null,
      time_to_results: body.timeToResults || null,
      products_used: body.productsUsed || [],
      services_used: body.servicesUsed || [],
      custom_plan: body.customPlan || null,
      results_achieved: body.resultsAchieved || [],
      before_weight: body.beforeMetrics?.weight || null,
      after_weight: body.afterMetrics?.weight || null,
      before_energy: body.beforeMetrics?.energy || null,
      after_energy: body.afterMetrics?.energy || null,
      before_metrics: body.beforeMetrics || null,
      after_metrics: body.afterMetrics || null,
      full_story: body.fullStory,
      owner_quote: body.ownerQuote,
      christie_notes: body.christieNotes || null,
      before_photos: body.beforePhotos || [],
      after_photos: body.afterPhotos || [],
      hero_image: body.heroImage || null,
      category: body.category || null,
      tags: body.tags || [],
      featured: body.featured || false,
      published: body.published || false,
      published_at: body.published ? new Date().toISOString() : null,
      seo_title: body.seoTitle || null,
      seo_description: body.seoDescription || null,
    };

    const { data, error } = await supabase
      .from('case_studies')
      .insert([caseStudyData])
      .select()
      .single();

    if (error) {
      console.error('Error creating case study:', error);
      return NextResponse.json({ error: 'Failed to create case study' }, { status: 500 });
    }

    return NextResponse.json({ caseStudy: data }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/case-studies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
