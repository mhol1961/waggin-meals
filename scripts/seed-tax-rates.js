/**
 * Seed Tax Rates Script
 *
 * Populates the tax_rates table with state-level sales tax rates for all US states.
 * Rates are current as of 2025 and include only base state rates.
 *
 * Note: For more accurate calculations, you can add county/city/ZIP-specific rates later.
 *
 * Usage: node scripts/seed-tax-rates.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// US State Tax Rates (state-level only, 2025)
// Source: Tax Foundation + state revenue departments
const taxRates = [
  { state_code: 'AL', state_name: 'Alabama', tax_rate: 0.04 },
  { state_code: 'AK', state_name: 'Alaska', tax_rate: 0.0 }, // No state tax
  { state_code: 'AZ', state_name: 'Arizona', tax_rate: 0.056 },
  { state_code: 'AR', state_name: 'Arkansas', tax_rate: 0.065 },
  { state_code: 'CA', state_name: 'California', tax_rate: 0.0725 },
  { state_code: 'CO', state_name: 'Colorado', tax_rate: 0.029 },
  { state_code: 'CT', state_name: 'Connecticut', tax_rate: 0.0635 },
  { state_code: 'DE', state_name: 'Delaware', tax_rate: 0.0 }, // No state tax
  { state_code: 'FL', state_name: 'Florida', tax_rate: 0.06 },
  { state_code: 'GA', state_name: 'Georgia', tax_rate: 0.04 },
  { state_code: 'HI', state_name: 'Hawaii', tax_rate: 0.04 },
  { state_code: 'ID', state_name: 'Idaho', tax_rate: 0.06 },
  { state_code: 'IL', state_name: 'Illinois', tax_rate: 0.0625 },
  { state_code: 'IN', state_name: 'Indiana', tax_rate: 0.07 },
  { state_code: 'IA', state_name: 'Iowa', tax_rate: 0.06 },
  { state_code: 'KS', state_name: 'Kansas', tax_rate: 0.065 },
  { state_code: 'KY', state_name: 'Kentucky', tax_rate: 0.06 },
  { state_code: 'LA', state_name: 'Louisiana', tax_rate: 0.0445 }, // Christie's state
  { state_code: 'ME', state_name: 'Maine', tax_rate: 0.055 },
  { state_code: 'MD', state_name: 'Maryland', tax_rate: 0.06 },
  { state_code: 'MA', state_name: 'Massachusetts', tax_rate: 0.0625 },
  { state_code: 'MI', state_name: 'Michigan', tax_rate: 0.06 },
  { state_code: 'MN', state_name: 'Minnesota', tax_rate: 0.06875 },
  { state_code: 'MS', state_name: 'Mississippi', tax_rate: 0.07 },
  { state_code: 'MO', state_name: 'Missouri', tax_rate: 0.04225 },
  { state_code: 'MT', state_name: 'Montana', tax_rate: 0.0 }, // No state tax
  { state_code: 'NE', state_name: 'Nebraska', tax_rate: 0.055 },
  { state_code: 'NV', state_name: 'Nevada', tax_rate: 0.0685 },
  { state_code: 'NH', state_name: 'New Hampshire', tax_rate: 0.0 }, // No state tax
  { state_code: 'NJ', state_name: 'New Jersey', tax_rate: 0.06625 },
  { state_code: 'NM', state_name: 'New Mexico', tax_rate: 0.05125 },
  { state_code: 'NY', state_name: 'New York', tax_rate: 0.04 },
  { state_code: 'NC', state_name: 'North Carolina', tax_rate: 0.0475 },
  { state_code: 'ND', state_name: 'North Dakota', tax_rate: 0.05 },
  { state_code: 'OH', state_name: 'Ohio', tax_rate: 0.0575 },
  { state_code: 'OK', state_name: 'Oklahoma', tax_rate: 0.045 },
  { state_code: 'OR', state_name: 'Oregon', tax_rate: 0.0 }, // No state tax
  { state_code: 'PA', state_name: 'Pennsylvania', tax_rate: 0.06 },
  { state_code: 'RI', state_name: 'Rhode Island', tax_rate: 0.07 },
  { state_code: 'SC', state_name: 'South Carolina', tax_rate: 0.06 },
  { state_code: 'SD', state_name: 'South Dakota', tax_rate: 0.045 },
  { state_code: 'TN', state_name: 'Tennessee', tax_rate: 0.07 },
  { state_code: 'TX', state_name: 'Texas', tax_rate: 0.0625 },
  { state_code: 'UT', state_name: 'Utah', tax_rate: 0.0485 },
  { state_code: 'VT', state_name: 'Vermont', tax_rate: 0.06 },
  { state_code: 'VA', state_name: 'Virginia', tax_rate: 0.053 },
  { state_code: 'WA', state_name: 'Washington', tax_rate: 0.065 },
  { state_code: 'WV', state_name: 'West Virginia', tax_rate: 0.06 },
  { state_code: 'WI', state_name: 'Wisconsin', tax_rate: 0.05 },
  { state_code: 'WY', state_name: 'Wyoming', tax_rate: 0.04 },
  { state_code: 'DC', state_name: 'District of Columbia', tax_rate: 0.06 },
];

async function seedTaxRates() {
  console.log('🏛️  Seeding tax rates for all US states...\n');

  try {
    // Check if tax_collection_enabled setting exists
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (!settings) {
      console.log('⚠️  No site_settings found. Creating with tax_collection_enabled = true');
      await supabase
        .from('site_settings')
        .insert({ tax_collection_enabled: true });
    } else if (!settings.tax_collection_enabled) {
      console.log('⚠️  Tax collection is currently disabled in site_settings');
      console.log('   You can enable it later via admin panel or database update');
    }

    // Clear existing tax rates (optional - comment out to keep existing rates)
    console.log('🗑️  Clearing existing tax rates...');
    const { error: deleteError } = await supabase
      .from('tax_rates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('Warning deleting existing rates:', deleteError.message);
    }

    // Insert new tax rates
    console.log('📊 Inserting tax rates for 50 states + DC...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const rate of taxRates) {
      const { data, error } = await supabase
        .from('tax_rates')
        .insert([{
          state_code: rate.state_code,
          state_name: rate.state_name,
          tax_rate: rate.tax_rate,
          is_active: true,
          notes: 'State-level sales tax rate (2025)',
        }])
        .select();

      if (error) {
        console.error(`❌ Failed to insert ${rate.state_name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ ${rate.state_name} (${rate.state_code}): ${(rate.tax_rate * 100).toFixed(2)}%`);
        successCount++;
      }
    }

    console.log(`\n✨ Tax rate seeding complete!`);
    console.log(`   Successfully added: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`\n💡 Notes:`);
    console.log(`   - These are state-level base rates only`);
    console.log(`   - Local county/city taxes may apply on top`);
    console.log(`   - Five states have no state sales tax: AK, DE, MT, NH, OR`);
    console.log(`   - Louisiana (Christie's state): 4.45%`);
    console.log(`\n🔧 To add county/city rates:`);
    console.log(`   1. Go to /admin/tax-rates (future admin page)`);
    console.log(`   2. Or add manually to the tax_rates table in Supabase`);
    console.log(`   3. Include state_code, county/zip_code, and tax_rate`);

  } catch (error) {
    console.error('❌ Error seeding tax rates:', error);
    process.exit(1);
  }
}

// Run the seed script
seedTaxRates()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
