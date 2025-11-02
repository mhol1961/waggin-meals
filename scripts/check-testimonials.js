/**
 * Check testimonials in database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTestimonials() {
  console.log('📋 Checking testimonials in database...\n');

  // Check main testimonials table
  const { data: testimonials, error: testimonialsError } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (testimonialsError) {
    console.error('❌ Error fetching testimonials:', testimonialsError);
  } else {
    console.log(`✅ Found ${testimonials.length} testimonials in main table:\n`);
    testimonials.forEach((t, i) => {
      console.log(`${i + 1}. ${t.dog_name} (${t.owner_name})`);
      console.log(`   Category: ${t.category}`);
      console.log(`   Published: ${t.is_published}`);
      console.log(`   Featured: ${t.is_featured}`);
      console.log(`   ID: ${t.id}`);
      console.log('');
    });
  }

  // Check archived_content table for archived testimonials
  const { data: archivedTestimonials, error: archivedError } = await supabase
    .from('archived_content')
    .select('*')
    .eq('content_type', 'testimonial')
    .order('archived_at', { ascending: false });

  if (archivedError) {
    console.error('❌ Error fetching archived testimonials:', archivedError);
  } else {
    console.log(`\n📦 Found ${archivedTestimonials.length} archived testimonials:\n`);
    archivedTestimonials.forEach((a, i) => {
      const data = a.content_data;
      console.log(`${i + 1}. ${data.dog_name || 'Unknown'} (${data.owner_name || 'Unknown'})`);
      console.log(`   Archived at: ${new Date(a.archived_at).toLocaleString()}`);
      console.log(`   Reason: ${a.reason || 'None'}`);
      console.log('');
    });
  }

  console.log('\n📊 Summary:');
  console.log(`Active testimonials: ${testimonials?.length || 0}`);
  console.log(`Archived testimonials: ${archivedTestimonials?.length || 0}`);
  console.log(`Total: ${(testimonials?.length || 0) + (archivedTestimonials?.length || 0)}`);
}

checkTestimonials().catch(console.error);
