-- Populate Sample Data for Condition Pages System
-- Run this after creating tables with 20251105_create_seo_content_system_FIXED.sql

-- =====================================================
-- POPULATE SEO KEYWORDS (from CSV)
-- =====================================================
INSERT INTO seo_keywords (keyword, search_volume, cpc, related_keywords) VALUES
  ('fresh food for dogs with allergies', 110, 18.38, ARRAY['hypoallergenic dog food', 'allergy friendly', 'food sensitivity', 'elimination diet']),
  ('best fresh food for dogs with allergies', 320, 19.12, ARRAY['allergy relief', 'itch free dog food', 'skin health']),
  ('fresh food for dogs with pancreatitis', 70, 6.78, ARRAY['low fat dog food', 'pancreatitis diet', 'digestive enzymes', 'easily digestible']),
  ('fresh food for dogs with kidney disease', 50, 3.70, ARRAY['renal diet', 'kidney friendly dog food', 'low protein', 'phosphorus control']),
  ('fresh food for dogs with sensitive stomachs', 20, 18.63, ARRAY['digestive health', 'bland diet', 'probiotics', 'gentle on stomach']),
  ('best fresh food for dogs with sensitive stomachs', 20, 13.52, ARRAY['gut health', 'easy to digest', 'food sensitivities']),
  ('fresh food for dogs near me', 70, 14.04, ARRAY['local dog food', 'fresh delivery', 'fresh dog food asheville', 'dog food delivery']),
  ('how to make fresh food for dogs', 90, 3.97, ARRAY['homemade dog food', 'dog food recipes', 'diy dog food', 'fresh feeding']),
  ('what fresh food is good for dogs', 20, 3.90, ARRAY['healthy dog food', 'whole food', 'natural ingredients', 'human grade']),
  ('how to cook fresh food for dogs', 20, 5.68, ARRAY['preparing dog food', 'cooking for dogs', 'meal prep'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE SAMPLE PANCREATITIS PAGE
-- =====================================================
INSERT INTO condition_pages (
  condition_name,
  slug,
  meta_title,
  meta_description,
  primary_keyword,
  secondary_keywords,
  content,
  schema_markup,
  seo_score,
  status,
  ai_generated,
  published_at
) VALUES (
  'Pancreatitis',
  'fresh-food-for-dogs-with-pancreatitis',
  'Fresh Food for Dogs with Pancreatitis | Waggin Meals',
  'Board-certified nutritionist creates custom low-fat fresh food plans for dogs with pancreatitis. Science-based nutrition to support pancreatic health.',
  'fresh food for dogs with pancreatitis',
  ARRAY['low fat dog food', 'pancreatitis diet', 'digestive enzymes', 'easily digestible food'],
  jsonb_build_object(
    'h1', 'Fresh Food for Dogs with Pancreatitis',
    'hero_subheading', 'Science-Based, Low-Fat Meal Plans from a Board-Certified Canine Nutritionist',
    'sections', jsonb_build_array(
      jsonb_build_object(
        'heading', 'Why Pancreatitis Requires Specialized Nutrition',
        'content', '<p>Pancreatitis in dogs is an inflammatory condition of the pancreas that requires careful dietary management. The pancreas plays a crucial role in digestion by producing enzymes that break down fats, proteins, and carbohydrates. When inflamed, the pancreas becomes sensitive to dietary fat, making it essential to provide meals that are both nutritious and easy to digest.</p><p>Fresh food diets formulated specifically for dogs with pancreatitis focus on high-quality, easily digestible proteins and minimal fat content. Unlike commercial kibble, which often contains excessive fats and hard-to-digest ingredients, fresh food allows for precise control over nutritional content while providing the gentle nutrition your dog needs to heal.</p>',
        'layout', 'full-width',
        'order', 1
      ),
      jsonb_build_object(
        'heading', 'Key Nutritional Requirements',
        'content', '<p><strong>Low-Fat Content:</strong> Dogs with pancreatitis need diets with significantly reduced fat (typically under 10% on a dry matter basis) to prevent flare-ups and allow the pancreas to rest.</p><p><strong>High-Quality Protein:</strong> Lean proteins like skinless chicken, turkey breast, and white fish provide essential amino acids without excess fat.</p><p><strong>Easily Digestible Carbohydrates:</strong> Sweet potatoes, white rice, and oatmeal offer energy without stressing the digestive system.</p><p><strong>Anti-Inflammatory Nutrients:</strong> Omega-3 fatty acids (in controlled amounts), antioxidants, and specific vitamins help reduce inflammation and support healing.</p>',
        'layout', 'full-width',
        'order', 2
      ),
      jsonb_build_object(
        'heading', 'Benefits of Fresh Food for Pancreatitis',
        'content', '<ul><li><strong>Precise Fat Control:</strong> Custom formulations ensure fat levels stay within safe limits</li><li><strong>Better Digestibility:</strong> Fresh, whole ingredients are easier on the digestive system</li><li><strong>Reduced Additives:</strong> No artificial preservatives or fillers that can irritate the pancreas</li><li><strong>Improved Palatability:</strong> Dogs recovering from pancreatitis often have reduced appetite - fresh food is more appealing</li><li><strong>Tailored Nutrition:</strong> Meals can be adjusted based on your dog''s response and recovery progress</li></ul>',
        'layout', 'full-width',
        'order', 3
      ),
      jsonb_build_object(
        'heading', 'Working with a Board-Certified Nutritionist',
        'content', '<p>Managing pancreatitis through diet requires expert guidance. A board-certified canine nutritionist will:</p><ul><li>Assess your dog''s specific nutritional needs based on their condition severity, weight, and overall health</li><li>Create a customized meal plan with precise macro and micronutrient ratios</li><li>Recommend appropriate supplements to support pancreatic health</li><li>Monitor your dog''s progress and adjust the plan as needed</li><li>Provide recipes you can prepare at home or recommend appropriate fresh food delivery services</li></ul><p>At Waggin'' Meals, Christie brings board-certified expertise specifically in canine nutrition, ensuring your dog receives the most current, evidence-based dietary support for managing pancreatitis.</p>',
        'layout', 'full-width',
        'order', 4
      )
    ),
    'faq', jsonb_build_array(
      jsonb_build_object(
        'question', 'How quickly will I see improvement with a fresh food diet?',
        'answer', 'Most dogs show improvement within 1-2 weeks of transitioning to a properly formulated low-fat fresh food diet. However, recovery time varies depending on the severity of the pancreatitis and your dog''s overall health. Some dogs may show reduced symptoms within days, while others require several weeks. Consistent adherence to the diet plan is crucial for success.',
        'order', 1
      ),
      jsonb_build_object(
        'question', 'Can I prepare fresh food at home for my dog with pancreatitis?',
        'answer', 'Yes, home-prepared fresh food can be excellent for dogs with pancreatitis, but it must be properly formulated by a qualified nutritionist. The diet needs precise fat control, appropriate protein sources, and complete micronutrient balance. A board-certified nutritionist will provide you with specific recipes and preparation guidelines to ensure safety and nutritional adequacy.',
        'order', 2
      ),
      jsonb_build_object(
        'question', 'What foods should I absolutely avoid?',
        'answer', 'Avoid high-fat foods including: fatty cuts of meat, lamb, pork, beef with visible fat, salmon, sardines, cheese, egg yolks, oils, butter, and commercial treats. Also avoid foods that can trigger digestive upset like onions, garlic, grapes, raisins, chocolate, and artificial sweeteners. Stick to the prescribed low-fat proteins and easily digestible carbohydrates.',
        'order', 3
      ),
      jsonb_build_object(
        'question', 'Is fresh food better than prescription kibble for pancreatitis?',
        'answer', 'Fresh food offers several advantages over prescription kibble: better digestibility, no artificial preservatives, higher moisture content, and the ability to customize fat levels precisely. However, the best choice depends on your dog''s specific needs, your ability to prepare meals correctly, and your veterinarian''s recommendations. Many dogs do best with professionally formulated fresh food diets.',
        'order', 4
      ),
      jsonb_build_object(
        'question', 'How much does a custom nutrition plan cost?',
        'answer', 'Our comprehensive nutrition consultation for pancreatitis management is $395 and includes: initial assessment, complete custom meal plan with recipes, supplement recommendations, and follow-up support for plan adjustments. This one-time investment provides you with everything needed to manage your dog''s pancreatitis through proper nutrition.',
        'order', 5
      )
    ),
    'cta_placements', jsonb_build_array('hero', 'middle', 'bottom')
  ),
  jsonb_build_object(
    '@context', 'https://schema.org',
    '@graph', jsonb_build_array(
      jsonb_build_object(
        '@type', 'MedicalCondition',
        'name', 'Pancreatitis in Dogs',
        'possibleTreatment', jsonb_build_object(
          '@type', 'MedicalTherapy',
          'name', 'Low-Fat Fresh Food Diet',
          'description', 'Specialized low-fat fresh food nutrition plan formulated by board-certified nutritionist'
        )
      ),
      jsonb_build_object(
        '@type', 'FAQPage',
        'mainEntity', jsonb_build_array(
          jsonb_build_object(
            '@type', 'Question',
            'name', 'How quickly will I see improvement with a fresh food diet?',
            'acceptedAnswer', jsonb_build_object(
              '@type', 'Answer',
              'text', 'Most dogs show improvement within 1-2 weeks of transitioning to a properly formulated low-fat fresh food diet.'
            )
          ),
          jsonb_build_object(
            '@type', 'Question',
            'name', 'Can I prepare fresh food at home for my dog with pancreatitis?',
            'acceptedAnswer', jsonb_build_object(
              '@type', 'Answer',
              'text', 'Yes, home-prepared fresh food can be excellent for dogs with pancreatitis, but it must be properly formulated by a qualified nutritionist.'
            )
          )
        )
      )
    )
  ),
  85, -- seo_score
  'published', -- status
  false, -- ai_generated
  NOW() -- published_at
) ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VERIFY POPULATION
-- =====================================================
SELECT 'Keywords inserted:' as info, COUNT(*) as count FROM seo_keywords;
SELECT 'Condition pages created:' as info, COUNT(*) as count FROM condition_pages;

-- Show the created page
SELECT
  id,
  condition_name,
  slug,
  status,
  seo_score,
  (content->'sections') as section_count,
  (content->'faq') as faq_count
FROM condition_pages
WHERE slug = 'fresh-food-for-dogs-with-pancreatitis';
