const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function applyMigration() {
  console.log('🚀 Applying SEO Content System Migration\n');

  // Read migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251105_create_seo_content_system.sql');
  const fullSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log('📝 Loaded migration file (11KB)\n');
  console.log('⏳ Executing SQL...\n');

  try {
    // Use the REST API to execute raw SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: fullSQL
      })
    });

    if (!response.ok) {
      console.error('❌ Migration failed');
      console.error('Status:', response.status);
      const text = await response.text();
      console.error('Response:', text);
      process.exit(1);
    }

    console.log('✅ Migration executed successfully!\n');

    // Verify tables
    console.log('🔍 Verifying tables...\n');

    const { data: pages, error: pagesError } = await supabase
      .from('condition_pages')
      .select('count');

    const { data: keywords, error: keywordsError } = await supabase
      .from('seo_keywords')
      .select('count');

    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('count');

    console.log('condition_pages:', pagesError ? '❌' : '✅');
    console.log('seo_keywords:', keywordsError ? '❌' : '✅');
    console.log('site_settings:', settingsError ? '❌' : '✅');

    console.log('\n🎉 Migration complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyMigration();
