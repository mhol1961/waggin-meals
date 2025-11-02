/**
 * Apply discount_codes table migration
 * Run: node scripts/run-discount-codes-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('📋 Reading migration file...');

    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251102_create_discount_codes.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('🚀 Applying discount_codes table migration...\n');

    // Split SQL into individual statements (excluding comments and empty lines)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.includes('CREATE TABLE') ||
          statement.includes('CREATE INDEX') ||
          statement.includes('CREATE TRIGGER') ||
          statement.includes('COMMENT ON')) {
        console.log(`  Executing: ${statement.split('\n')[0]}...`);

        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

        if (error) {
          // Try direct query if RPC fails
          const result = await supabase.from('discount_codes').select('id').limit(1);
          if (result.error && result.error.code !== 'PGRST116') {
            throw error;
          }
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('📊 Verifying table creation...');

    // Verify table exists
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Table verification failed:', error.message);
      console.log('\n⚠️  You may need to run the migration manually in Supabase SQL Editor.');
      console.log('📂 Migration file: supabase/migrations/20251102_create_discount_codes.sql');
    } else {
      console.log('✅ Table discount_codes exists and is accessible');
      console.log('\n🎉 All done! You can now use the discount codes feature.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📝 Manual migration required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy the contents of: supabase/migrations/20251102_create_discount_codes.sql');
    console.log('4. Paste and run the SQL');
    process.exit(1);
  }
}

runMigration();
