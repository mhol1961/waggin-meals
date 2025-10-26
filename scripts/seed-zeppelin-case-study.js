require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read the case study data
const caseStudyData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../case-study-zeppelin.json'), 'utf8')
);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedZeppelinCaseStudy() {
  console.log('Seeding Zeppelin case study...');

  // Map camelCase to snake_case for database
  const dbData = {
    dog_name: caseStudyData.dogName,
    breed: caseStudyData.breed,
    age: caseStudyData.age,
    weight: caseStudyData.weight,
    sex: caseStudyData.sex,
    owner_name: caseStudyData.ownerName,
    location: caseStudyData.location,
    title: caseStudyData.title,
    summary: caseStudyData.summary,
    slug: caseStudyData.slug,
    health_issues: caseStudyData.healthIssues,
    symptoms: caseStudyData.symptoms,
    diagnosis: caseStudyData.diagnosis,
    problem_duration: caseStudyData.problemDuration,
    time_to_results: caseStudyData.timeToResults,
    products_used: caseStudyData.productsUsed,
    services_used: caseStudyData.servicesUsed,
    custom_plan: caseStudyData.customPlan,
    results_achieved: caseStudyData.resultsAchieved,
    before_weight: caseStudyData.beforeWeight,
    after_weight: caseStudyData.afterWeight,
    before_energy: caseStudyData.beforeEnergy,
    after_energy: caseStudyData.afterEnergy,
    before_metrics: caseStudyData.beforeMetrics || null,
    after_metrics: caseStudyData.afterMetrics || null,
    full_story: caseStudyData.fullStory,
    owner_quote: caseStudyData.ownerQuote,
    christie_notes: caseStudyData.christieNotes,
    before_photos: caseStudyData.beforePhotos,
    after_photos: caseStudyData.afterPhotos,
    hero_image: caseStudyData.heroImage,
    category: caseStudyData.category,
    tags: caseStudyData.tags,
    featured: caseStudyData.featured,
    published: caseStudyData.published,
    seo_title: caseStudyData.seoTitle,
    seo_description: caseStudyData.seoDescription,
    published_at: caseStudyData.published ? new Date().toISOString() : null,
  };

  // Check if slug already exists
  const { data: existing } = await supabase
    .from('case_studies')
    .select('id, slug')
    .eq('slug', dbData.slug)
    .single();

  if (existing) {
    console.log(`Case study with slug "${dbData.slug}" already exists. Updating...`);

    const { data, error } = await supabase
      .from('case_studies')
      .update(dbData)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating case study:', error);
      process.exit(1);
    }

    console.log('✅ Successfully updated Zeppelin case study!');
    console.log(`   ID: ${data.id}`);
    console.log(`   Slug: ${data.slug}`);
    console.log(`   View at: /case-studies/${data.slug}`);
  } else {
    const { data, error } = await supabase
      .from('case_studies')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting case study:', error);
      process.exit(1);
    }

    console.log('✅ Successfully seeded Zeppelin case study!');
    console.log(`   ID: ${data.id}`);
    console.log(`   Slug: ${data.slug}`);
    console.log(`   View at: /case-studies/${data.slug}`);
  }
}

seedZeppelinCaseStudy()
  .then(() => {
    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
