const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Use service role key for direct database access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testPage = {
  condition_name: 'Pancreatitis',
  slug: 'fresh-food-for-dogs-with-pancreatitis',
  meta_title: 'Fresh Food for Dogs with Pancreatitis | Waggin Meals',
  meta_description: 'Board-certified nutritionist creates custom low-fat fresh food plans for dogs with pancreatitis. Science-based nutrition to support pancreatic health.',
  primary_keyword: 'fresh food for dogs with pancreatitis',
  secondary_keywords: ['low fat dog food', 'pancreatitis diet', 'digestive enzymes', 'easily digestible food'],
  content: {
    h1: 'Fresh Food for Dogs with Pancreatitis',
    hero_subheading: 'Science-Based, Low-Fat Meal Plans from a Board-Certified Canine Nutritionist',
    sections: [
      {
        heading: 'Why Pancreatitis Requires Specialized Nutrition',
        content: '<p>Pancreatitis in dogs is an inflammatory condition of the pancreas that requires careful dietary management. The pancreas plays a crucial role in digestion by producing enzymes that break down fats, proteins, and carbohydrates. When inflamed, the pancreas becomes sensitive to dietary fat, making it essential to provide meals that are both nutritious and easy to digest.</p><p>Fresh food diets formulated specifically for dogs with pancreatitis focus on high-quality, easily digestible proteins and minimal fat content. Unlike commercial kibble, which often contains excessive fats and hard-to-digest ingredients, fresh food allows for precise control over nutritional content while providing the gentle nutrition your dog needs to heal.</p>',
        layout: 'full-width',
        order: 1
      },
      {
        heading: 'Key Nutritional Requirements',
        content: '<p><strong>Low-Fat Content:</strong> Dogs with pancreatitis need diets with significantly reduced fat (typically under 10% on a dry matter basis) to prevent flare-ups and allow the pancreas to rest.</p><p><strong>High-Quality Protein:</strong> Lean proteins like skinless chicken, turkey breast, and white fish provide essential amino acids without excess fat.</p><p><strong>Easily Digestible Carbohydrates:</strong> Sweet potatoes, white rice, and oatmeal offer energy without stressing the digestive system.</p><p><strong>Anti-Inflammatory Nutrients:</strong> Omega-3 fatty acids (in controlled amounts), antioxidants, and specific vitamins help reduce inflammation and support healing.</p>',
        layout: 'full-width',
        order: 2
      },
      {
        heading: 'Benefits of Fresh Food for Pancreatitis',
        content: '<ul><li><strong>Precise Fat Control:</strong> Custom formulations ensure fat levels stay within safe limits</li><li><strong>Better Digestibility:</strong> Fresh, whole ingredients are easier on the digestive system</li><li><strong>Reduced Additives:</strong> No artificial preservatives or fillers that can irritate the pancreas</li><li><strong>Improved Palatability:</strong> Dogs recovering from pancreatitis often have reduced appetite - fresh food is more appealing</li><li><strong>Tailored Nutrition:</strong> Meals can be adjusted based on your dog\'s response and recovery progress</li></ul>',
        layout: 'full-width',
        order: 3
      },
      {
        heading: 'Working with a Board-Certified Nutritionist',
        content: '<p>Managing pancreatitis through diet requires expert guidance. A board-certified canine nutritionist will:</p><ul><li>Assess your dog\'s specific nutritional needs based on their condition severity, weight, and overall health</li><li>Create a customized meal plan with precise macro and micronutrient ratios</li><li>Recommend appropriate supplements to support pancreatic health</li><li>Monitor your dog\'s progress and adjust the plan as needed</li><li>Provide recipes you can prepare at home or recommend appropriate fresh food delivery services</li></ul><p>At Waggin\' Meals, Christie brings board-certified expertise specifically in canine nutrition, ensuring your dog receives the most current, evidence-based dietary support for managing pancreatitis.</p>',
        layout: 'full-width',
        order: 4
      }
    ],
    faq: [
      {
        question: 'How quickly will I see improvement with a fresh food diet?',
        answer: 'Most dogs show improvement within 1-2 weeks of transitioning to a properly formulated low-fat fresh food diet. However, recovery time varies depending on the severity of the pancreatitis and your dog\'s overall health. Some dogs may show reduced symptoms within days, while others require several weeks. Consistent adherence to the diet plan is crucial for success.',
        order: 1
      },
      {
        question: 'Can I prepare fresh food at home for my dog with pancreatitis?',
        answer: 'Yes, home-prepared fresh food can be excellent for dogs with pancreatitis, but it must be properly formulated by a qualified nutritionist. The diet needs precise fat control, appropriate protein sources, and complete micronutrient balance. A board-certified nutritionist will provide you with specific recipes and preparation guidelines to ensure safety and nutritional adequacy.',
        order: 2
      },
      {
        question: 'What foods should I absolutely avoid?',
        answer: 'Avoid high-fat foods including: fatty cuts of meat, lamb, pork, beef with visible fat, salmon, sardines, cheese, egg yolks, oils, butter, and commercial treats. Also avoid foods that can trigger digestive upset like onions, garlic, grapes, raisins, chocolate, and artificial sweeteners. Stick to the prescribed low-fat proteins and easily digestible carbohydrates.',
        order: 3
      },
      {
        question: 'Is fresh food better than prescription kibble for pancreatitis?',
        answer: 'Fresh food offers several advantages over prescription kibble: better digestibility, no artificial preservatives, higher moisture content, and the ability to customize fat levels precisely. However, the best choice depends on your dog\'s specific needs, your ability to prepare meals correctly, and your veterinarian\'s recommendations. Many dogs do best with professionally formulated fresh food diets.',
        order: 4
      },
      {
        question: 'How much does a custom nutrition plan cost?',
        answer: 'Our comprehensive nutrition consultation for pancreatitis management is $395 and includes: initial assessment, complete custom meal plan with recipes, supplement recommendations, and follow-up support for plan adjustments. This one-time investment provides you with everything needed to manage your dog\'s pancreatitis through proper nutrition.',
        order: 5
      }
    ],
    cta_placements: ['hero', 'middle', 'bottom']
  },
  schema_markup: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalCondition',
        name: 'Pancreatitis in Dogs',
        possibleTreatment: {
          '@type': 'MedicalTherapy',
          name: 'Low-Fat Fresh Food Diet',
          description: 'Specialized low-fat fresh food nutrition plan formulated by board-certified nutritionist'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How quickly will I see improvement with a fresh food diet?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most dogs show improvement within 1-2 weeks of transitioning to a properly formulated low-fat fresh food diet.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I prepare fresh food at home for my dog with pancreatitis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, home-prepared fresh food can be excellent for dogs with pancreatitis, but it must be properly formulated by a qualified nutritionist.'
            }
          }
        ]
      }
    ]
  },
  seo_score: 85,
  status: 'published',
  ai_generated: false,
  published_at: new Date().toISOString()
};

async function createTestPage() {
  console.log('📄 Creating test condition page: Pancreatitis\n');

  try {
    // Check if it already exists
    const { data: existing } = await supabase
      .from('condition_pages')
      .select('id, condition_name, status')
      .eq('slug', testPage.slug)
      .maybeSingle();

    if (existing) {
      console.log('⚠️  Page already exists:');
      console.log(`   Condition: ${existing.condition_name}`);
      console.log(`   Status: ${existing.status}`);
      console.log(`   ID: ${existing.id}\n`);
      console.log('   Skipping creation.\n');
      return;
    }

    // Insert the page
    const { data, error } = await supabase
      .from('condition_pages')
      .insert([testPage])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating page:', error);
      console.error('\n   This might be due to:');
      console.error('   1. Tables not created yet (run migration first)');
      console.error('   2. RLS policies blocking access');
      console.error('   3. Schema cache not refreshed\n');
      console.error('   Try refreshing schema cache at:');
      console.error('   https://supabase.com/dashboard/project/lpevubhnsicbbpzeqmmv/api');
      process.exit(1);
    }

    console.log('✅ Test page created successfully!\n');
    console.log('📊 Page Details:');
    console.log('━'.repeat(60));
    console.log(`ID:            ${data.id}`);
    console.log(`Condition:     ${data.condition_name}`);
    console.log(`Slug:          ${data.slug}`);
    console.log(`Status:        ${data.status}`);
    console.log(`SEO Score:     ${data.seo_score}/100`);
    console.log(`Sections:      ${data.content.sections.length}`);
    console.log(`FAQs:          ${data.content.faq.length}`);
    console.log('━'.repeat(60));

    console.log('\n🔗 URLs:');
    console.log(`   Admin Edit: http://localhost:3000/admin/conditions/${data.id}/edit`);
    console.log(`   Public:     http://localhost:3000/conditions/${data.slug}`);

    console.log('\n✅ Next Steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Visit admin dashboard: http://localhost:3000/admin/conditions');
    console.log('   3. Add OpenRouter API key in Settings');
    console.log('   4. Create more pages using the wizard!\n');

  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

createTestPage();
