const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyTables() {
  console.log('🔍 Verifying SEO Content System tables...\n');

  const tables = ['condition_pages', 'seo_keywords', 'seo_settings'];
  let allExist = true;

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: NOT FOUND (${error.message})`);
        allExist = false;
      } else {
        console.log(`✅ ${table}: EXISTS (${count || 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR (${err.message})`);
      allExist = false;
    }
  }

  console.log('');

  if (allExist) {
    console.log('🎉 All tables exist! Migration was applied successfully.\n');
    console.log('📝 Next steps:');
    console.log('   1. Run: node scripts/create-test-page.js');
    console.log('   2. Visit: /admin/conditions');
    console.log('   3. Visit: /admin/conditions/settings (add OpenRouter API key)\n');
  } else {
    console.log('⚠️  Some tables are missing. Please apply the migration:\n');
    console.log('   1. Go to: https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv/sql/new');
    console.log('   2. Copy contents of: supabase/migrations/20251105_create_seo_content_system_FIXED.sql');
    console.log('   3. Paste and click "Run"\n');
  }
}

verifyTables();
