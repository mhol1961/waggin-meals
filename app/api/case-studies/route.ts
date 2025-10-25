import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/case-studies - Get published case studies (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

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
    console.error('Error in GET /api/case-studies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
