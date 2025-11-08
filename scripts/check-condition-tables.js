const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 Checking for condition_pages tables...\n');

  const tables = [
    { name: 'condition_pages', description: 'Landing pages for dog health conditions' },
    { name: 'seo_keywords', description: 'Keyword research and tracking' },
    { name: 'site_settings', description: 'System settings (API keys, etc.)' }
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ ${table.name}: DOES NOT EXIST`);
          console.log(`   ${table.description}`);
        } else {
          console.log(`❌ ${table.name}: ERROR - ${error.message}`);
        }
      } else {
        console.log(`✅ ${table.name}: EXISTS (${count || 0} rows)`);
        console.log(`   ${table.description}`);
      }
    } catch (err) {
      console.log(`❌ ${table.name}: ERROR - ${err.message}`);
    }
    console.log('');
  }

  // If tables exist, show sample data
  console.log('\n📊 Sample data from condition_pages:');
  const { data: pages, error: pagesError } = await supabase
    .from('condition_pages')
    .select('condition_name, slug, status, seo_score')
    .limit(5);

  if (pagesError) {
    console.log('   No data or table does not exist');
  } else if (pages && pages.length > 0) {
    console.table(pages);
  } else {
    console.log('   Table exists but is empty');
  }
}

checkTables().catch(err => {
  console.error('💥 Check failed:', err);
  process.exit(1);
});
