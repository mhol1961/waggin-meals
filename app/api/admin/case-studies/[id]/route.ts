import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin-auth';

// GET /api/admin/case-studies/[id] - Get single case study
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { id } = await context.params;

    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching case study:', error);
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    return NextResponse.json({ caseStudy: data });

  } catch (error) {
    console.error('Error in GET /api/admin/case-studies/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/case-studies/[id] - Update case study
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { id } = await context.params;
    const body = await request.json();

    // Check if case study exists
    const { data: existing, error: fetchError } = await supabase
      .from('case_studies')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    if (body.dogName) updateData.dog_name = body.dogName;
    if (body.breed) updateData.breed = body.breed;
    if (body.age) updateData.age = body.age;
    if (body.weight) updateData.weight = body.weight;
    if (body.sex) updateData.sex = body.sex;
    if (body.ownerName) updateData.owner_name = body.ownerName;
    if (body.location) updateData.location = body.location;
    if (body.title) updateData.title = body.title;
    if (body.summary) updateData.summary = body.summary;
    if (body.slug) updateData.slug = body.slug;
    if (body.healthIssues) updateData.health_issues = body.healthIssues;
    if (body.symptoms) updateData.symptoms = body.symptoms;
    if (body.diagnosis !== undefined) updateData.diagnosis = body.diagnosis;
    if (body.problemDuration !== undefined) updateData.problem_duration = body.problemDuration;
    if (body.timeToResults !== undefined) updateData.time_to_results = body.timeToResults;
    if (body.productsUsed) updateData.products_used = body.productsUsed;
    if (body.servicesUsed) updateData.services_used = body.servicesUsed;
    if (body.customPlan !== undefined) updateData.custom_plan = body.customPlan;
    if (body.resultsAchieved) updateData.results_achieved = body.resultsAchieved;
    if (body.beforeMetrics) {
      if (body.beforeMetrics.weight !== undefined) updateData.before_weight = body.beforeMetrics.weight;
      if (body.beforeMetrics.energy !== undefined) updateData.before_energy = body.beforeMetrics.energy;
      updateData.before_metrics = body.beforeMetrics;
    }
    if (body.afterMetrics) {
      if (body.afterMetrics.weight !== undefined) updateData.after_weight = body.afterMetrics.weight;
      if (body.afterMetrics.energy !== undefined) updateData.after_energy = body.afterMetrics.energy;
      updateData.after_metrics = body.afterMetrics;
    }
    if (body.fullStory) updateData.full_story = body.fullStory;
    if (body.ownerQuote) updateData.owner_quote = body.ownerQuote;
    if (body.christieNotes !== undefined) updateData.christie_notes = body.christieNotes;
    if (body.beforePhotos) updateData.before_photos = body.beforePhotos;
    if (body.afterPhotos) updateData.after_photos = body.afterPhotos;
    if (body.heroImage !== undefined) updateData.hero_image = body.heroImage;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags) updateData.tags = body.tags;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.published !== undefined) {
      updateData.published = body.published;
      if (body.published && !existing.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (body.seoTitle !== undefined) updateData.seo_title = body.seoTitle;
    if (body.seoDescription !== undefined) updateData.seo_description = body.seoDescription;

    const { data, error } = await supabase
      .from('case_studies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating case study:', error);
      return NextResponse.json({ error: 'Failed to update case study' }, { status: 500 });
    }

    return NextResponse.json({ caseStudy: data });

  } catch (error) {
    console.error('Error in PUT /api/admin/case-studies/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/case-studies/[id] - Delete case study
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { id } = await context.params;

    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting case study:', error);
      return NextResponse.json({ error: 'Failed to delete case study' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in DELETE /api/admin/case-studies/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
