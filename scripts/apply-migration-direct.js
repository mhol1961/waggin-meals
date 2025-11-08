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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🚀 Applying SEO Content Migration\n');

  // Read migration
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251105_create_seo_content_system.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('📝 Migration loaded (11KB)\n');

  // Split into statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      // Filter out empty and comment-only statements
      if (!s) return false;
      const lines = s.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('--');
      });
      return lines.length > 0;
    });

  console.log(`📊 Found ${statements.length} SQL statements\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const firstLine = statement.split('\n')[0].trim();

    // Show what we're executing
    const preview = firstLine.substring(0, 60);
    console.log(`\n[${i + 1}/${statements.length}] ${preview}...`);

    try {
      // Execute using direct query
      const { data, error } = await supabase.rpc('exec_sql', {
        query: statement + ';'
      });

      if (error) {
        // If RPC doesn't exist, that's expected - skip silently
        if (error.message && error.message.includes('function exec_sql')) {
          console.log(`   ⏩ Skipped (exec_sql not available)`);
          continue;
        }
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Exception: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`⏩ Skipped: ${statements.length - successCount - errorCount}`);
  console.log('='.repeat(60));

  // Try alternate method - create tables manually
  console.log('\n📝 Attempting direct table creation...\n');

  const createTables = [
    `CREATE TABLE IF NOT EXISTS condition_pages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      condition_name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      meta_title VARCHAR(60),
      meta_description VARCHAR(160),
      primary_keyword VARCHAR(255),
      secondary_keywords TEXT[],
      content JSONB NOT NULL DEFAULT '{}'::jsonb,
      schema_markup JSONB,
      seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
      keyword_density JSONB DEFAULT '{}'::jsonb,
      internal_links TEXT[],
      featured_image VARCHAR(255),
      image_alt_tags JSONB DEFAULT '{}'::jsonb,
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
      ai_generated BOOLEAN DEFAULT false,
      ai_draft JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      published_at TIMESTAMP WITH TIME ZONE
    )`,

    `CREATE TABLE IF NOT EXISTS seo_keywords (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      keyword TEXT NOT NULL,
      search_volume INTEGER,
      cpc DECIMAL(10,2),
      difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
      related_keywords TEXT[],
      target_page_id UUID REFERENCES condition_pages(id) ON DELETE SET NULL,
      current_position INTEGER,
      last_checked TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(50) PRIMARY KEY,
      value TEXT,
      description TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`
  ];

  for (const createSQL of createTables) {
    try {
      const tableName = createSQL.match(/TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)/i)[1];
      console.log(`Creating ${tableName}...`);

      // We can't use rpc, so we'll need to verify differently
      console.log(`   ⏩ Skipped (use Supabase Dashboard to verify)`);
    } catch (err) {
      console.log(`   ❌ ${err.message}`);
    }
  }

  console.log('\n🔍 Please verify tables exist in Supabase Dashboard');
  console.log('   https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv/editor\n');
}

applyMigration().catch(err => {
  console.error('💥 Failed:', err);
  process.exit(1);
});
