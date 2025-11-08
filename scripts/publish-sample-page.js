const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function publishSamplePage() {
  console.log('📝 Publishing sample page...\n');

  try {
    // Update the sample page to published status
    const { data, error } = await supabase
      .from('condition_pages')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('slug', 'sample-fresh-food-for-dogs-with-pancreatitis')
      .select();

    if (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('⚠️  Sample page not found. It may have a different slug.');
      process.exit(1);
    }

    console.log('✅ Sample page published!\n');
    console.log('📊 Page Details:');
    console.log('━'.repeat(60));
    console.log(`ID:            ${data[0].id}`);
    console.log(`Condition:     ${data[0].condition_name}`);
    console.log(`Slug:          ${data[0].slug}`);
    console.log(`Status:        ${data[0].status}`);
    console.log(`SEO Score:     ${data[0].seo_score}/100`);
    console.log('━'.repeat(60));

    console.log('\n🔗 URLs:');
    console.log(`   Admin: http://localhost:3000/admin/conditions`);
    console.log(`   Edit:  http://localhost:3000/admin/conditions/${data[0].id}/edit`);
    console.log(`   Public: http://localhost:3000/conditions/${data[0].slug}`);
    console.log('');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

publishSamplePage();
