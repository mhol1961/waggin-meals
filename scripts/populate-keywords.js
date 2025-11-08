const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const keywords = [
  {
    keyword: 'fresh food for dogs with allergies',
    search_volume: 110,
    cpc: 18.38,
    related_keywords: ['hypoallergenic dog food', 'allergy friendly', 'food sensitivity', 'elimination diet']
  },
  {
    keyword: 'best fresh food for dogs with allergies',
    search_volume: 320,
    cpc: 19.12,
    related_keywords: ['allergy relief', 'itch free dog food', 'skin health']
  },
  {
    keyword: 'fresh food for dogs with pancreatitis',
    search_volume: 70,
    cpc: 6.78,
    related_keywords: ['low fat dog food', 'pancreatitis diet', 'digestive enzymes', 'easily digestible']
  },
  {
    keyword: 'fresh food for dogs with kidney disease',
    search_volume: 50,
    cpc: 3.70,
    related_keywords: ['renal diet', 'kidney friendly dog food', 'low protein', 'phosphorus control']
  },
  {
    keyword: 'fresh food for dogs with sensitive stomachs',
    search_volume: 20,
    cpc: 18.63,
    related_keywords: ['digestive health', 'bland diet', 'probiotics', 'gentle on stomach']
  },
  {
    keyword: 'best fresh food for dogs with sensitive stomachs',
    search_volume: 20,
    cpc: 13.52,
    related_keywords: ['gut health', 'easy to digest', 'food sensitivities']
  },
  {
    keyword: 'fresh food for dogs near me',
    search_volume: 70,
    cpc: 14.04,
    related_keywords: ['local dog food', 'fresh delivery', 'fresh dog food asheville', 'dog food delivery']
  },
  {
    keyword: 'how to make fresh food for dogs',
    search_volume: 90,
    cpc: 3.97,
    related_keywords: ['homemade dog food', 'dog food recipes', 'diy dog food', 'fresh feeding']
  },
  {
    keyword: 'what fresh food is good for dogs',
    search_volume: 20,
    cpc: 3.90,
    related_keywords: ['healthy dog food', 'whole food', 'natural ingredients', 'human grade']
  },
  {
    keyword: 'how to cook fresh food for dogs',
    search_volume: 20,
    cpc: 5.68,
    related_keywords: ['preparing dog food', 'cooking for dogs', 'meal prep']
  }
];

async function populateKeywords() {
  console.log('🔑 Populating SEO keywords...\n');

  try {
    // Check existing count
    const { count: existingCount } = await supabase
      .from('seo_keywords')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Current keywords in database: ${existingCount || 0}\n`);

    if (existingCount && existingCount > 0) {
      console.log('⚠️  Keywords already exist. Do you want to:');
      console.log('   1. Skip (keep existing)');
      console.log('   2. Clear and repopulate');
      console.log('\n   Running option 2 (clear and repopulate)...\n');

      // Clear existing
      const { error: deleteError } = await supabase
        .from('seo_keywords')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        console.error('❌ Error clearing keywords:', deleteError);
      } else {
        console.log('✅ Cleared existing keywords\n');
      }
    }

    // Insert new keywords
    console.log(`📝 Inserting ${keywords.length} keywords...\n`);

    const { data, error } = await supabase
      .from('seo_keywords')
      .insert(keywords)
      .select();

    if (error) {
      console.error('❌ Error inserting keywords:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data.length} keywords!\n`);

    // Display summary
    console.log('📊 Keyword Summary:');
    console.log('━'.repeat(80));

    const totalVolume = keywords.reduce((sum, k) => sum + k.search_volume, 0);
    const avgCPC = keywords.reduce((sum, k) => sum + k.cpc, 0) / keywords.length;

    console.log(`Total Keywords:      ${keywords.length}`);
    console.log(`Total Search Volume: ${totalVolume.toLocaleString()}/month`);
    console.log(`Average CPC:         $${avgCPC.toFixed(2)}`);
    console.log(`Top Keyword:         "${keywords[1].keyword}" (${keywords[1].search_volume} searches/mo)`);

    console.log('\n✅ Keyword population complete!\n');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

populateKeywords();
