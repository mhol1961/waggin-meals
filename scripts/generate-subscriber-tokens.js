/**
 * Subscriber Token Generation Script
 *
 * This script:
 * 1. Reads shopify-subscribers.csv and customers_export.csv
 * 2. Generates unique secure tokens for each subscriber
 * 3. Creates subscriptions in Supabase
 * 4. Exports CSV for GHL import
 *
 * Run: node scripts/generate-subscriber-tokens.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// CSV parser
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      rows.push(row);
    }
  }

  return rows;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function generateSecureToken() {
  return crypto.randomUUID();
}

function determineFrequency(tags, notes) {
  const combined = `${tags} ${notes}`.toUpperCase();

  if (combined.includes('2 WEEK')) return 'biweekly';
  if (combined.includes('3 WEEK')) return '3week';
  if (combined.includes('4 WEEK')) return 'monthly';
  if (combined.includes('WEEKLY')) return 'weekly';

  // Default to monthly if not specified
  return 'monthly';
}

function estimateSubscriptionPrice(totalSpent, orderCount) {
  if (orderCount === 0) return 0;

  // Average order value
  const avgOrderValue = totalSpent / orderCount;

  // Estimate monthly subscription (most subscriptions are around $60-100)
  return Math.round(avgOrderValue * 100) / 100;
}

async function main() {
  console.log('🐾 Waggin\' Meals Subscriber Token Generation\n');

  // Read CSV files
  console.log('Reading subscriber data...');
  const subscribersPath = path.join(__dirname, '../shopify-files/shopify-subscribers.csv');
  const customersPath = path.join(__dirname, '../shopify-files/customers_export.csv');

  if (!fs.existsSync(subscribersPath)) {
    console.error('❌ shopify-subscribers.csv not found!');
    process.exit(1);
  }

  if (!fs.existsSync(customersPath)) {
    console.error('❌ customers_export.csv not found!');
    process.exit(1);
  }

  const subscribers = parseCSV(subscribersPath);
  const customers = parseCSV(customersPath);

  console.log(`✅ Found ${subscribers.length} subscribers`);
  console.log(`✅ Found ${customers.length} customers\n`);

  // Filter to only subscribed customers
  const activeSubscribers = subscribers.filter(sub =>
    sub['Subscribed'] && sub['Subscribed'].toLowerCase().includes('subscribed')
  );

  console.log(`📊 Active subscribers: ${activeSubscribers.length}\n`);

  // Generate tokens and prepare data
  const processedSubscribers = [];
  const ghlImportData = [];

  for (const subscriber of activeSubscribers) {
    // Extract name and email
    const customerName = subscriber['Select customer'] || '';
    let email = subscriber[''] || ''; // Email is in unnamed column

    // If no email in first column, try to find in customer name
    if (!email && customerName.includes('@')) {
      email = customerName;
    }

    // Find full customer data
    const fullCustomer = customers.find(c =>
      c.Email === email || c['First Name'] === customerName.split(' ')[0]
    );

    if (!email && !fullCustomer) {
      console.log(`⚠️  Skipping subscriber with no email: ${customerName}`);
      continue;
    }

    const actualEmail = email || fullCustomer?.Email || '';
    if (!actualEmail) {
      console.log(`⚠️  Skipping subscriber with no valid email: ${customerName}`);
      continue;
    }

    // Generate secure token
    const secureToken = generateSecureToken();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 90); // 90 days from now

    // Parse data
    const location = subscriber['United States'] || '';
    const orderInfo = subscriber['orders'] || '0 orders';
    const spentInfo = subscriber['$0.00 '] || '$0.00';

    const orderCount = parseInt(orderInfo.match(/\d+/)?.[0] || '0');
    const totalSpent = parseFloat(spentInfo.replace(/[$,]/g, ''));

    // Determine frequency
    const tags = fullCustomer?.Tags || '';
    const notes = fullCustomer?.Note || '';
    const frequency = determineFrequency(tags, notes);

    // Estimate subscription price
    const subscriptionPrice = estimateSubscriptionPrice(totalSpent, orderCount);

    // Determine status
    const status = subscriptionPrice > 0 ? 'pending_payment' : 'pending_payment';

    // Calculate next billing date (30 days from now for initial setup)
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + 30);

    const processed = {
      email: actualEmail,
      first_name: fullCustomer?.['First Name'] || customerName.split(' ')[0] || '',
      last_name: fullCustomer?.['Last Name'] || customerName.split(' ').slice(1).join(' ') || '',
      phone: fullCustomer?.['Default Address Phone'] || fullCustomer?.Phone || '',
      address_line1: fullCustomer?.['Default Address Address1'] || '',
      address_line2: fullCustomer?.['Default Address Address2'] || '',
      city: fullCustomer?.['Default Address City'] || '',
      state: fullCustomer?.['Default Address Province Code'] || '',
      zip_code: fullCustomer?.['Default Address Zip'] || '',
      country: 'US',
      secure_token: secureToken,
      token_expires_at: tokenExpiresAt.toISOString(),
      status: status,
      frequency: frequency,
      subscription_price: subscriptionPrice,
      next_billing_date: nextBillingDate.toISOString().split('T')[0],
      total_spent: totalSpent,
      order_count: orderCount,
      tags: tags,
      portal_url: `https://wagginmeals.com/account/${secureToken}`
    };

    processedSubscribers.push(processed);

    // Prepare for GHL import
    ghlImportData.push({
      email: processed.email,
      firstName: processed.first_name,
      lastName: processed.last_name,
      phone: processed.phone,
      tags: 'Active Subscriber,Needs Re-Authorization',
      subscriptionStatus: 'Pending Payment',
      subscriptionFrequency: frequency.charAt(0).toUpperCase() + frequency.slice(1),
      subscriptionPrice: subscriptionPrice.toFixed(2),
      nextBillingDate: processed.next_billing_date,
      securePortalToken: secureToken,
      portalURL: processed.portal_url
    });
  }

  console.log(`\n✅ Processed ${processedSubscribers.length} subscribers with tokens\n`);

  // Save to JSON for Supabase import
  const jsonPath = path.join(__dirname, '../shopify-files/subscribers-with-tokens.json');
  fs.writeFileSync(jsonPath, JSON.stringify(processedSubscribers, null, 2));
  console.log(`💾 Saved subscriber data to: ${jsonPath}`);

  // Save GHL subscribers import CSV (only for subscribers with tokens)
  const ghlCsvPath = path.join(__dirname, '../shopify-files/ghl-subscribers-import.csv');
  const ghlHeaders = Object.keys(ghlImportData[0]);
  const ghlCsvContent = [
    ghlHeaders.join(','),
    ...ghlImportData.map(row =>
      ghlHeaders.map(header => `"${row[header]}"`).join(',')
    )
  ].join('\n');

  fs.writeFileSync(ghlCsvPath, ghlCsvContent);
  console.log(`💾 Saved GHL import CSV to: ${ghlCsvPath}`);

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`   Total subscribers: ${processedSubscribers.length}`);
  console.log(`   With order history: ${processedSubscribers.filter(s => s.order_count > 0).length}`);
  console.log(`   Average subscription: $${(processedSubscribers.reduce((sum, s) => sum + s.subscription_price, 0) / processedSubscribers.length).toFixed(2)}`);
  console.log(`   Estimated MRR: $${processedSubscribers.reduce((sum, s) => sum + s.subscription_price, 0).toFixed(2)}`);

  console.log('\n✅ Token generation complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run subscriber import script to add to Supabase');
  console.log('   2. Import ghl-import.csv into GoHighLevel');
  console.log('   3. Tag all subscribers "Needs Re-Authorization" in GHL');
  console.log('   4. Launch re-authorization campaign\n');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
