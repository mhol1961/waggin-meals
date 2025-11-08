const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function applyMigration() {
  console.log('🚀 Applying SEO Content Migration\n');

  // Read migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251105_create_seo_content_system.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log('📝 Migration loaded (11KB)\n');
  console.log('⏳ Executing SQL via REST API...\n');

  // We'll execute via REST API endpoint
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: migrationSQL
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Migration failed');
      console.error('Status:', response.status);
      console.error('Response:', errorText);
      console.log('\n💡 Alternative: Copy migration to Supabase SQL Editor\n');
      console.log('   1. Go to: https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv/sql/new');
      console.log('   2. Copy contents of: supabase/migrations/20251105_create_seo_content_system.sql');
      console.log('   3. Paste and click "Run"\n');
      process.exit(1);
    }

    console.log('✅ Migration executed successfully!\n');

    // Verify tables were created
    console.log('🔍 Verifying tables...\n');

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const tables = ['condition_pages', 'seo_keywords', 'site_settings'];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ ${table}: NOT FOUND (${error.message})`);
        } else {
          console.log(`✅ ${table}: EXISTS (${count || 0} rows)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ERROR`);
      }
    }

    console.log('\n🎉 Migration complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Run: node scripts/populate-keywords.js');
    console.log('   2. Run: node scripts/create-test-page.js');
    console.log('   3. Visit: /admin/conditions\n');

  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Alternative: Use Supabase SQL Editor (see above)\n');
    process.exit(1);
  }
}

applyMigration();
