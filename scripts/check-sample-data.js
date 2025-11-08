const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSampleData() {
  console.log('📊 Checking sample data...\n');

  // Check keywords
  console.log('🔑 SEO Keywords:');
  const { data: keywords, error: keywordError } = await supabase
    .from('seo_keywords')
    .select('keyword, search_volume, cpc')
    .order('search_volume', { ascending: false })
    .limit(10);

  if (keywordError) {
    console.log('   ❌ Error:', keywordError.message);
  } else if (keywords && keywords.length > 0) {
    console.table(keywords);
  } else {
    console.log('   ⚠️ No keywords found - run migration to populate');
  }

  // Check settings
  console.log('\n⚙️ Site Settings:');
  const { data: settings, error: settingsError } = await supabase
    .from('site_settings')
    .select('*');

  if (settingsError) {
    console.log('   ❌ Error:', settingsError.message);
  } else if (settings && settings.length > 0) {
    console.table(settings.map(s => ({ key: s.key, value: s.value ? '***SET***' : 'null', description: s.description })));
  } else {
    console.log('   ⚠️ No settings found');
  }

  // Check for sample pancreatitis page
  console.log('\n📄 Sample Pages:');
  const { data: pages, error: pagesError } = await supabase
    .from('condition_pages')
    .select('condition_name, slug, status, seo_score, ai_generated')
    .limit(5);

  if (pagesError) {
    console.log('   ❌ Error:', pagesError.message);
  } else if (pages && pages.length > 0) {
    console.table(pages);
  } else {
    console.log('   ⚠️ No pages found yet');
  }
}

checkSampleData().catch(err => {
  console.error('💥 Check failed:', err);
  process.exit(1);
});
