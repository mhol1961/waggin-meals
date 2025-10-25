/**
 * GHL All Customers Import Generator
 *
 * This script creates a GHL import CSV for ALL customers (not just subscribers):
 * 1. Reads customers_export.csv
 * 2. Reads shopify-subscribers.csv to identify subscribers
 * 3. Reads subscribers-with-tokens.json for portal URLs
 * 4. Tags customers appropriately based on:
 *    - Subscription status
 *    - Email preferences
 *    - Order history
 *    - Shopify tags
 * 5. Exports CSV for GHL import
 *
 * Run: node scripts/generate-ghl-all-customers.js
 */

const fs = require('fs');
const path = require('path');

// CSV parser
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
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
      values.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim().replace(/^"|"$/g, ''));
  return values;
}

function parseShopifyNumber(value) {
  if (!value) return 0;
  const cleaned = value.replace(/[$,]/g, '');
  return parseFloat(cleaned) || 0;
}

function determineCustomerTags(customer, isSubscriber, acceptsMarketing, orderCount, totalSpent) {
  const tags = [];

  // Subscription status
  if (isSubscriber) {
    tags.push('Active Subscriber');
    tags.push('Needs Re-Authorization');
  } else {
    tags.push('Customer');
  }

  // Email preferences
  if (acceptsMarketing) {
    tags.push('Newsletter Subscriber');
  } else {
    tags.push('No Marketing Emails');
  }

  // Customer tier based on order history
  if (orderCount === 0) {
    tags.push('New Customer');
  } else if (orderCount >= 10) {
    tags.push('VIP Customer');
  } else if (orderCount >= 5) {
    tags.push('Loyal Customer');
  } else {
    tags.push('Returning Customer');
  }

  // Spending tier
  if (totalSpent >= 500) {
    tags.push('High Value');
  } else if (totalSpent >= 200) {
    tags.push('Medium Value');
  } else if (totalSpent > 0) {
    tags.push('Low Value');
  }

  // Parse Shopify tags and add relevant ones
  const shopifyTags = customer.Tags || '';
  const tagsArray = shopifyTags.split(',').map(t => t.trim()).filter(t => t);

  // Add specific Shopify tags that are useful
  tagsArray.forEach(tag => {
    const upperTag = tag.toUpperCase();

    // Add frequency tags
    if (upperTag.includes('WEEKLY') || upperTag.includes('2 WEEK') ||
        upperTag.includes('3 WEEK') || upperTag.includes('4 WEEK') ||
        upperTag.includes('MONTHLY')) {
      tags.push(tag);
    }

    // Add preference tags
    if (upperTag.includes('CHICKEN') || upperTag.includes('BEEF') ||
        upperTag.includes('TURKEY') || upperTag.includes('FISH')) {
      tags.push(tag);
    }

    // Add dietary tags
    if (upperTag.includes('GRAIN FREE') || upperTag.includes('SENSITIVE') ||
        upperTag.includes('ALLERGY')) {
      tags.push(tag);
    }
  });

  return tags;
}

async function main() {
  console.log('🐾 Waggin\' Meals - Generate GHL Import for ALL Customers\n');
  console.log('='.repeat(60));

  // Read files
  const customersPath = path.join(__dirname, '../shopify-files/customers_export.csv');
  const subscribersPath = path.join(__dirname, '../shopify-files/shopify-subscribers.csv');
  const tokensPath = path.join(__dirname, '../shopify-files/subscribers-with-tokens.json');

  if (!fs.existsSync(customersPath)) {
    console.error('❌ customers_export.csv not found!');
    process.exit(1);
  }

  const customers = parseCSV(customersPath);
  console.log(`\n✅ Found ${customers.length} customers`);

  // Load subscribers if available
  let subscribers = [];
  if (fs.existsSync(subscribersPath)) {
    subscribers = parseCSV(subscribersPath);
    console.log(`✅ Found ${subscribers.length} subscribers`);
  }

  // Load subscriber tokens if available
  let subscriberTokens = [];
  if (fs.existsSync(tokensPath)) {
    subscriberTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
    console.log(`✅ Found ${subscriberTokens.length} subscriber tokens`);
  }

  // Create email-to-subscriber map
  const subscriberEmails = new Set();
  subscribers.forEach(sub => {
    const email = sub[''] || sub['Select customer'];
    if (email && email.includes('@')) {
      subscriberEmails.add(email.toLowerCase().trim());
    }
  });

  // Create email-to-token map
  const subscriberPortalUrls = {};
  subscriberTokens.forEach(sub => {
    if (sub.email && sub.portal_url) {
      subscriberPortalUrls[sub.email.toLowerCase().trim()] = sub.portal_url;
    }
  });

  console.log(`\n📊 Processing ${customers.length} customers for GHL import...\n`);

  const ghlImportData = [];

  for (const customer of customers) {
    const email = customer.Email?.trim();

    if (!email) {
      console.log('⚠️  Skipping customer with no email');
      continue;
    }

    const firstName = customer['First Name'] || '';
    const lastName = customer['Last Name'] || '';
    const phone = customer.Phone || customer['Default Address Phone'] || '';
    const orderCount = parseInt(customer['Orders Count']) || 0;
    const totalSpent = parseShopifyNumber(customer['Total Spent']);
    const acceptsMarketing = customer['Accepts Marketing']?.toLowerCase() === 'yes';

    // Check if this customer is a subscriber
    const isSubscriber = subscriberEmails.has(email.toLowerCase());
    const portalUrl = subscriberPortalUrls[email.toLowerCase()] || '';

    // Determine tags
    const tags = determineCustomerTags(
      customer,
      isSubscriber,
      acceptsMarketing,
      orderCount,
      totalSpent
    );

    // Create GHL import row
    const ghlRow = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      tags: tags.join(','),
      totalOrders: orderCount,
      totalSpent: totalSpent.toFixed(2),
      acceptsMarketing: acceptsMarketing ? 'Yes' : 'No',
      isSubscriber: isSubscriber ? 'Yes' : 'No',
      customerType: isSubscriber ? 'Subscriber' : 'Customer',
      source: 'Shopify Migration',
    };

    // Add portal URL for subscribers
    if (isSubscriber && portalUrl) {
      ghlRow.portalURL = portalUrl;
      ghlRow.subscriptionStatus = 'Pending Payment';
    }

    ghlImportData.push(ghlRow);
  }

  // Save GHL import CSV
  const ghlCsvPath = path.join(__dirname, '../shopify-files/ghl-all-customers-import.csv');
  const ghlHeaders = [
    'email',
    'firstName',
    'lastName',
    'phone',
    'tags',
    'totalOrders',
    'totalSpent',
    'acceptsMarketing',
    'isSubscriber',
    'customerType',
    'source',
    'portalURL',
    'subscriptionStatus',
  ];

  const ghlCsvContent = [
    ghlHeaders.join(','),
    ...ghlImportData.map(row =>
      ghlHeaders.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.toString().includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');

  fs.writeFileSync(ghlCsvPath, ghlCsvContent);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Total customers: ${ghlImportData.length}`);
  console.log(`   Subscribers: ${ghlImportData.filter(c => c.isSubscriber === 'Yes').length}`);
  console.log(`   Non-subscribers: ${ghlImportData.filter(c => c.isSubscriber === 'No').length}`);
  console.log(`   Newsletter opt-in: ${ghlImportData.filter(c => c.acceptsMarketing === 'Yes').length}`);
  console.log(`   Newsletter opt-out: ${ghlImportData.filter(c => c.acceptsMarketing === 'No').length}`);
  console.log(`   VIP customers (10+ orders): ${ghlImportData.filter(c => parseInt(c.totalOrders) >= 10).length}`);
  console.log(`   New customers (0 orders): ${ghlImportData.filter(c => parseInt(c.totalOrders) === 0).length}`);

  console.log(`\n💾 Saved GHL import CSV to: ${ghlCsvPath}`);

  console.log('\n✅ GHL import file generated!');
  console.log('\n📋 Next steps:');
  console.log('   1. Go to GoHighLevel > Contacts > Import');
  console.log('   2. Upload ghl-all-customers-import.csv');
  console.log('   3. Map all fields correctly');
  console.log('   4. Confirm import');
  console.log('   5. Verify tags are assigned correctly\n');

  // Tag breakdown
  console.log('\n🏷️  Tag Breakdown:');
  const tagCounts = {};
  ghlImportData.forEach(row => {
    const tags = row.tags.split(',');
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count}`);
    });

  console.log('\n');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
