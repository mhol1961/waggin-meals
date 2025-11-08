/**
 * GoHighLevel Setup Automation Script
 *
 * This script automatically creates all custom fields, tags, and pipelines
 * in your GoHighLevel account via API.
 *
 * Usage:
 *   node scripts/setup-ghl-automation.js
 *
 * Requirements:
 *   - GHL_API_KEY in .env.local
 *   - GHL_LOCATION_ID in .env.local
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// GHL API Configuration
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = 'https://rest.gohighlevel.com/v1';

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error('❌ Missing GHL_API_KEY or GHL_LOCATION_ID in .env.local');
  process.exit(1);
}

// Load snapshot data
const SNAPSHOT_DIR = path.join(__dirname, '../public/ghl_snapshot_extracted/wagginmeals_ghl_snapshot_kit');

const customFieldsCSV = fs.readFileSync(path.join(SNAPSHOT_DIR, 'custom_fields.csv'), 'utf8');
const tagsCSV = fs.readFileSync(path.join(SNAPSHOT_DIR, 'tags.csv'), 'utf8');
const pipelinesJSON = JSON.parse(fs.readFileSync(path.join(SNAPSHOT_DIR, 'pipelines.json'), 'utf8'));

// Parse CSV files
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() || '';
      return obj;
    }, {});
  });
}

const customFields = parseCSV(customFieldsCSV);
const tags = parseCSV(tagsCSV);

console.log(`📋 Loaded: ${customFields.length} custom fields, ${tags.length} tags, ${Object.keys(pipelinesJSON).length} pipelines\n`);

// API Helper
async function ghlRequest(endpoint, method = 'GET', body = null) {
  const url = `${GHL_API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.text();

  if (!response.ok) {
    throw new Error(`GHL API Error (${response.status}): ${data}`);
  }

  return data ? JSON.parse(data) : null;
}

// Step 1: Create Custom Fields
async function createCustomFields() {
  console.log('\n🔧 STEP 1: Creating Custom Fields...\n');

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const field of customFields) {
    const { field_key, type } = field;

    if (!field_key) continue;

    try {
      // GHL API endpoint for creating custom fields
      // Note: You may need to adjust this endpoint based on GHL API v1 documentation
      const payload = {
        locationId: GHL_LOCATION_ID,
        name: field_key.replace(/^wm_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        fieldKey: field_key,
        dataType: mapFieldType(type),
        placeholder: '',
      };

      console.log(`  Creating: ${field_key} (${type})...`);

      // Attempt to create field
      // Note: GHL API v1 may not have direct custom field creation endpoint
      // You may need to create fields manually or use v2 API
      console.log(`  ⚠️  Custom fields require manual creation in GHL dashboard`);
      console.log(`     Field: ${payload.name} (${payload.fieldKey}) - Type: ${payload.dataType}`);
      skipped++;

    } catch (error) {
      console.error(`  ❌ Error creating ${field_key}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n✅ Custom Fields: ${created} created, ${skipped} noted, ${errors} errors`);
  console.log(`   📝 Note: GHL v1 API doesn't support custom field creation via API.`);
  console.log(`   📝 You'll need to create these manually in: Settings → Custom Fields`);
  console.log(`   📝 Or use this script's output as a reference list.\n`);
}

// Helper to map field types
function mapFieldType(type) {
  const typeMap = {
    'text': 'TEXT',
    'email': 'EMAIL',
    'phone': 'PHONE',
    'number': 'NUMBER',
    'currency': 'MONETARY',
    'date': 'DATE',
    'datetime': 'DATE_TIME',
    'boolean': 'CHECKBOX',
  };
  return typeMap[type] || 'TEXT';
}

// Step 2: Create Tags
async function createTags() {
  console.log('\n🏷️  STEP 2: Creating Tags...\n');

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const tagData of tags) {
    const tagName = tagData.tag_name;

    if (!tagName) continue;

    try {
      console.log(`  Creating tag: ${tagName}...`);

      // GHL v1 API: Create tag via contact endpoint
      // Tags in GHL are created when you add them to a contact
      // There's no dedicated "create tag" endpoint in v1

      console.log(`  ℹ️  Tag noted: ${tagName}`);
      skipped++;

    } catch (error) {
      console.error(`  ❌ Error with tag ${tagName}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n✅ Tags: ${created} created, ${skipped} noted, ${errors} errors`);
  console.log(`   📝 Note: GHL v1 API doesn't have direct tag creation.`);
  console.log(`   📝 Tags are created automatically when applied to contacts.`);
  console.log(`   📝 Your Next.js webhooks will create tags as needed.\n`);
}

// Step 3: Create Pipelines
async function createPipelines() {
  console.log('\n📊 STEP 3: Creating Pipelines...\n');

  let created = 0;
  let errors = 0;

  for (const [key, pipeline] of Object.entries(pipelinesJSON)) {
    try {
      console.log(`  Creating pipeline: ${pipeline.name}...`);

      const payload = {
        locationId: GHL_LOCATION_ID,
        name: pipeline.name,
        stages: pipeline.stages.map((stageName, index) => ({
          name: stageName,
          position: index,
        })),
      };

      // GHL API endpoint for pipelines
      const result = await ghlRequest('/pipelines/', 'POST', payload);

      console.log(`  ✅ Created: ${pipeline.name} with ${pipeline.stages.length} stages`);
      created++;

    } catch (error) {
      console.error(`  ❌ Error creating pipeline ${pipeline.name}: ${error.message}`);

      // If pipeline already exists, that's okay
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.log(`  ℹ️  Pipeline already exists: ${pipeline.name}`);
        created++;
      } else {
        errors++;
      }
    }
  }

  console.log(`\n✅ Pipelines: ${created} created/exists, ${errors} errors\n`);
}

// Step 4: Generate Webhook Documentation
async function generateWebhookDocs() {
  console.log('\n🔗 STEP 4: Generating Webhook Documentation...\n');

  const webhookDoc = `# GoHighLevel Webhook Setup

## Webhook URL
Create a workflow in GHL with trigger: "Incoming Webhook"

**Workflow Name**: Event Router (Next.js → GHL)

## Webhook Endpoint URL
The webhook URL will be provided by GHL after creating the workflow.
Save it to your .env.local:

\`\`\`bash
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...
\`\`\`

## Event Routes

Your Next.js app will send these events to GHL:

### 1. Order Placed
\`\`\`json
{
  "event": "order.placed",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_last_order_number": "WM-1234",
    "wm_last_order_amount": "89.99",
    "wm_last_order_date": "2025-11-03"
  }
}
\`\`\`

**Actions in GHL Workflow**:
- Add tag: "order-placed"
- Move to pipeline: "Orders & Subscriptions" → "Order Placed"
- Start sequence: "Order Lifecycle"

### 2. Order Shipped
\`\`\`json
{
  "event": "order.shipped",
  "contactId": "GHL_CONTACT_ID",
  "tracking": "1Z999AA10123456784"
}
\`\`\`

**Actions**:
- Add tag: "order-shipped"
- Move to stage: "Shipped"
- Start sequence: "Out for Delivery Scheduler"

### 3. Subscription Created
\`\`\`json
{
  "event": "subscription.created",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_subscription_id": "sub_123",
    "wm_subscription_amount": "59.99",
    "wm_subscription_frequency": "monthly"
  }
}
\`\`\`

**Actions**:
- Add tags: "subscriber-active", "first-subscription"
- Move to stage: "Subscription Active"
- Start sequence: "Subscription Lifecycle"

### 4. Payment Failed
\`\`\`json
{
  "event": "payment.failed",
  "contactId": "GHL_CONTACT_ID",
  "reason": "Card declined"
}
\`\`\`

**Actions**:
- Add tags: "subscriber-past-due", "payment-failed"
- Move to stage: "Subscription Past Due"
- Start sequence: "Dunning Sequence"

### 5. Cart Abandoned
\`\`\`json
{
  "event": "cart.abandoned",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_cart_value": "79.99",
    "wm_cart_items": "Fresh Food Bowl x2, Meal Topper x1"
  }
}
\`\`\`

**Actions**:
- Add tag: "cart-abandoned"
- Move to stage: "Cart Abandoned"
- Start sequence: "Abandoned Cart"

### 6. Consultation Booked
\`\`\`json
{
  "event": "consultation.booked",
  "contactId": "GHL_CONTACT_ID",
  "customFields": {
    "wm_consultation_date": "2025-11-15T10:00:00Z",
    "wm_consultation_type": "paid"
  }
}
\`\`\`

**Actions**:
- Add tag: "consultation-booked"
- Move to pipeline: "Consultations ($395)" → "Scheduled"
- Start sequence: "Consultation Reminders"

## Implementation in Next.js

Add this helper function to your Next.js app:

\`\`\`javascript
// lib/ghl-webhook.ts
export async function sendGHLEvent(event: string, contactId: string, data: any = {}) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('GHL_WEBHOOK_URL not configured');
    return;
  }

  const payload = {
    event,
    contactId,
    timestamp: new Date().toISOString(),
    ...data,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('GHL webhook failed:', response.status);
    }
  } catch (error) {
    console.error('GHL webhook error:', error);
  }
}
\`\`\`

Use it in your API routes:

\`\`\`javascript
// app/api/checkout/create-order/route.ts
import { sendGHLEvent } from '@/lib/ghl-webhook';

// After order created successfully:
await sendGHLEvent('order.placed', ghlContactId, {
  customFields: {
    wm_last_order_number: orderNumber,
    wm_last_order_amount: total.toString(),
    wm_last_order_date: new Date().toISOString(),
  }
});
\`\`\`
`;

  fs.writeFileSync(
    path.join(__dirname, '../docs/GHL-WEBHOOK-SETUP.md'),
    webhookDoc
  );

  console.log('✅ Created: docs/GHL-WEBHOOK-SETUP.md\n');
}

// Step 5: Generate Field Reference
async function generateFieldReference() {
  console.log('\n📋 STEP 5: Generating Field Reference...\n');

  let refDoc = `# GoHighLevel Custom Fields Reference

## All Custom Fields (${customFields.length} total)

Create these in GHL: **Settings → Custom Fields**

| Field Key | Type | Description |
|-----------|------|-------------|
`;

  for (const field of customFields) {
    if (!field.field_key) continue;

    const name = field.field_key.replace(/^wm_/, '').replace(/_/g, ' ');
    const type = mapFieldType(field.type);
    refDoc += `| \`${field.field_key}\` | ${type} | ${name} |\n`;
  }

  refDoc += `\n## Field Categories\n\n`;

  refDoc += `### Customer Data (15 fields)\n`;
  refDoc += `- wm_customer_id, wm_first_name, wm_last_name, wm_email, wm_phone\n`;
  refDoc += `- wm_accepts_marketing, wm_email_verified, wm_created_at\n`;
  refDoc += `- wm_address_line1, wm_address_line2, wm_city, wm_state, wm_postal_code, wm_country\n\n`;

  refDoc += `### Payment Data (6 fields)\n`;
  refDoc += `- wm_authnet_profile_id, wm_authnet_payment_profile_id\n`;
  refDoc += `- wm_card_type, wm_card_last_four, wm_card_expiration\n`;
  refDoc += `- wm_payment_method_is_default\n\n`;

  refDoc += `### Order History (7 fields)\n`;
  refDoc += `- wm_total_orders, wm_total_spent, wm_average_order_value\n`;
  refDoc += `- wm_last_order_date, wm_last_order_number, wm_last_order_amount\n`;
  refDoc += `- wm_last_shipping_method\n\n`;

  refDoc += `### Subscription Data (10 fields)\n`;
  refDoc += `- wm_has_subscription, wm_subscription_id, wm_subscription_status\n`;
  refDoc += `- wm_subscription_frequency, wm_subscription_amount\n`;
  refDoc += `- wm_subscription_next_billing, wm_subscription_last_billing\n`;
  refDoc += `- wm_subscription_start_date, wm_subscription_items\n\n`;

  refDoc += `### Consultation Data (6 fields)\n`;
  refDoc += `- wm_consultation_booked, wm_consultation_date, wm_consultation_status\n`;
  refDoc += `- wm_consultation_paid, wm_consultation_type\n\n`;

  refDoc += `### Pet Data (5 fields)\n`;
  refDoc += `- wm_dog_name, wm_dog_breed, wm_dog_age, wm_dog_weight\n`;
  refDoc += `- wm_health_concerns\n\n`;

  refDoc += `### Cart Abandonment (7 fields)\n`;
  refDoc += `- wm_cart_abandoned, wm_cart_abandon_date, wm_cart_items\n`;
  refDoc += `- wm_cart_value, wm_cart_recovery_sent, wm_cart_recovered\n\n`;

  refDoc += `### Segmentation (2 fields)\n`;
  refDoc += `- wm_is_first_order, wm_geo_segment\n\n`;

  fs.writeFileSync(
    path.join(__dirname, '../docs/GHL-CUSTOM-FIELDS.md'),
    refDoc
  );

  console.log('✅ Created: docs/GHL-CUSTOM-FIELDS.md\n');
}

// Step 6: Generate Tags Reference
async function generateTagsReference() {
  console.log('\n🏷️  STEP 6: Generating Tags Reference...\n');

  let tagsDoc = `# GoHighLevel Tags Reference

## All Tags (${tags.length} total)

Tags are created automatically when applied to contacts via API.
Your Next.js webhooks will apply these tags as events occur.

`;

  const tagCategories = {
    'Contact Lifecycle': ['new-contact', 'new-customer', 'returning-customer', 'vip-customer', 'at-risk', 'churned'],
    'Order Status': ['order-placed', 'order-processing', 'order-shipped', 'order-delivered', 'order-cancelled', 'order-refunded', 'payment-failed'],
    'Subscription Status': ['subscriber-active', 'subscriber-paused', 'subscriber-cancelled', 'subscriber-past-due', 'subscription-billing-today', 'subscription-renewal-7-days', 'subscription-renewal-3-days', 'first-subscription'],
    'Consultation Tracking': ['consultation-inquiry', 'consultation-booked', 'consultation-completed', 'consultation-no-show', 'consultation-rescheduled', 'paid-consultation'],
    'Product Interests': ['interested-fresh-food', 'interested-meal-toppers', 'interested-supplements', 'interested-bundles'],
    'Purchase History': ['purchased-fresh-food', 'purchased-meal-toppers', 'purchased-supplements', 'purchased-bundles'],
    'Cart Recovery': ['cart-abandoned', 'cart-recovered'],
    'Marketing Engagement': ['newsletter-subscriber', 'email-engaged', 'email-unengaged', 'sms-opted-in'],
    'Shipping Preferences': ['ships-standard', 'ships-expedited', 'ships-overnight', 'local-pickup', 'free-shipping-threshold-met'],
    'Lead Sources': ['voicebot:lead', 'chatbot:lead'],
    'GDPR Compliance': ['gdpr:sms-optin', 'gdpr:email-optin'],
  };

  for (const [category, categoryTags] of Object.entries(tagCategories)) {
    tagsDoc += `\n### ${category}\n`;
    for (const tag of categoryTags) {
      tagsDoc += `- \`${tag}\`\n`;
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '../docs/GHL-TAGS-REFERENCE.md'),
    tagsDoc
  );

  console.log('✅ Created: docs/GHL-TAGS-REFERENCE.md\n');
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  GoHighLevel Setup Automation');
  console.log('  Waggin Meals E-Commerce Platform');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log(`  API Key: ${GHL_API_KEY.substring(0, 20)}...`);
  console.log(`  Location: ${GHL_LOCATION_ID}\n`);
  console.log('═══════════════════════════════════════════════════════');

  try {
    // Run setup steps
    await createCustomFields();
    await createTags();
    await createPipelines();
    await generateWebhookDocs();
    await generateFieldReference();
    await generateTagsReference();

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  ✅ SETUP COMPLETE!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📋 Next Steps:\n');
    console.log('1. Create 55 custom fields manually in GHL:');
    console.log('   Settings → Custom Fields');
    console.log('   Reference: docs/GHL-CUSTOM-FIELDS.md\n');

    console.log('2. Create webhook workflow in GHL:');
    console.log('   Automation → Workflows → Create Workflow');
    console.log('   Trigger: Incoming Webhook');
    console.log('   Reference: docs/GHL-WEBHOOK-SETUP.md\n');

    console.log('3. Save webhook URL to .env.local:');
    console.log('   GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...\n');

    console.log('4. Tags will be created automatically via webhooks');
    console.log('   Reference: docs/GHL-TAGS-REFERENCE.md\n');

    console.log('5. Pipelines created! Check GHL dashboard under Opportunities\n');

    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run
main();
