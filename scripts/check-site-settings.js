const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSiteSettings() {
  console.log('🔍 Checking site_settings table...\n');

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(5);

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('\nTable might not exist yet.');
    } else {
      console.log('✅ site_settings table exists');
      console.log('\n📊 Current data:');
      console.table(data);

      if (data && data.length > 0) {
        console.log('\n📋 Column names:');
        console.log(Object.keys(data[0]).join(', '));
      }
    }
  } catch (err) {
    console.error('💥 Error:', err.message);
  }
}

checkSiteSettings();
