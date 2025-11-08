import Link from 'next/link';
import Image from 'next/image';
import { Fish, Rabbit as RabbitIcon, Bird, Beef as BeefIcon, Sparkles, Check, AlertCircle, Heart } from 'lucide-react';

export default function NovelProteinsPage() {
  const proteins = [
    {
      name: 'Venison',
      icon: BeefIcon,
      image: '/images/proteins/venison.jpg',
      tagline: 'Wild-sourced, lean protein for sensitive stomachs',
      description: 'Venison is a highly digestible, lean protein that most dogs have never been exposed to, making it an excellent choice for dogs with food sensitivities.',
      benefits: [
        'Exceptionally lean (only 2-3% fat)',
        'Rich in B vitamins (B6, B12, niacin)',
        'High in iron and zinc for immune support',
        'Low allergen potential',
        'Easily digestible protein source'
      ],
      healthConditions: [
        'Food allergies and intolerances',
        'Inflammatory bowel disease (IBD)',
        'Chronic skin issues',
        'Weight management (due to low fat content)',
        'Pancreatitis recovery (low fat)'
      ],
      nutritionalHighlights: {
        protein: '30-34%',
        fat: '2-4%',
        keyNutrients: 'B12, B6, iron, zinc, selenium'
      },
      color: '#8FAE8F'
    },
    {
      name: 'Rabbit',
      icon: RabbitIcon,
      image: '/images/proteins/rabbit.jpg',
      tagline: 'Ultra-lean, hypoallergenic protein',
      description: 'Rabbit is one of the most hypoallergenic proteins available, with a mild flavor and exceptional digestibility. It\'s ideal for dogs with severe food sensitivities.',
      benefits: [
        'Highest protein-to-fat ratio of all meats',
        'Hypoallergenic - rarely causes reactions',
        'Rich in essential amino acids',
        'High in vitamin B12 and selenium',
        'Gentle on sensitive digestive systems'
      ],
      healthConditions: [
        'Multiple food allergies',
        'Severe skin allergies and itching',
        'Chronic ear infections',
        'Elimination diet trials',
        'Pancreatitis (ultra-low fat)',
        'Weight management'
      ],
      nutritionalHighlights: {
        protein: '33-36%',
        fat: '2-3%',
        keyNutrients: 'B12, selenium, phosphorus, niacin'
      },
      color: '#5E8C8C'
    },
    {
      name: 'Duck',
      icon: Bird,
      image: '/images/proteins/duck.jpg',
      tagline: 'Rich in omega-3s for skin & coat health',
      description: 'Duck provides a unique protein source with naturally high omega-3 fatty acids, supporting skin health, coat quality, and reducing inflammation.',
      benefits: [
        'High in omega-3 fatty acids',
        'Supports skin and coat health',
        'Anti-inflammatory properties',
        'Rich in iron and B vitamins',
        'Highly palatable for picky eaters'
      ],
      healthConditions: [
        'Dry, flaky skin',
        'Dull coat condition',
        'Chronic inflammation',
        'Joint issues (anti-inflammatory)',
        'Food sensitivities to common proteins'
      ],
      nutritionalHighlights: {
        protein: '28-32%',
        fat: '10-14%',
        keyNutrients: 'Omega-3, iron, selenium, B vitamins'
      },
      color: '#C97B63'
    },
    {
      name: 'Salmon',
      icon: Fish,
      image: '/images/proteins/salmon.jpg',
      tagline: 'Omega-3 powerhouse for brain & heart health',
      description: 'Salmon is packed with omega-3 DHA and EPA, essential for brain development, heart health, and fighting inflammation throughout the body.',
      benefits: [
        'Highest omega-3 content (DHA & EPA)',
        'Supports cognitive function',
        'Promotes heart health',
        'Reduces inflammation',
        'Supports joint health',
        'Boosts immune system'
      ],
      healthConditions: [
        'Arthritis and joint pain',
        'Cognitive decline in senior dogs',
        'Heart disease',
        'Chronic inflammation',
        'Autoimmune conditions',
        'Skin allergies'
      ],
      nutritionalHighlights: {
        protein: '25-29%',
        fat: '10-15%',
        keyNutrients: 'Omega-3 (DHA/EPA), vitamin D, B12, selenium'
      },
      color: '#8FAE8F'
    },
    {
      name: 'Alligator',
      icon: Sparkles,
      image: '/images/proteins/alligator.jpg',
      tagline: 'Exotic, hypoallergenic protein for severe cases',
      description: 'Alligator is an extremely rare protein source that few dogs have encountered, making it ideal for severe allergies and elimination diets. It\'s lean, nutritious, and highly digestible.',
      benefits: [
        'Extremely rare protein - minimal exposure',
        'Lean and easily digestible',
        'High in omega-3 fatty acids',
        'Rich in essential amino acids',
        'Low cholesterol',
        'Novel flavor dogs love'
      ],
      healthConditions: [
        'Severe multiple food allergies',
        'Failed elimination diets',
        'Chronic skin conditions',
        'Environmental allergies requiring protein rotation',
        'Inflammatory bowel disease (IBD)',
        'Novel protein trials'
      ],
      nutritionalHighlights: {
        protein: '32-35%',
        fat: '2-4%',
        keyNutrients: 'Omega-3, potassium, vitamin B12, phosphorus'
      },
      color: '#5E8C8C'
    },
    {
      name: 'Wild Boar',
      icon: BeefIcon,
      image: '/images/proteins/wild-boar.jpg',
      tagline: 'Rich, gamey protein with exceptional nutrition',
      description: 'Wild boar offers a rich, flavorful alternative to common proteins. It\'s packed with nutrients, highly digestible, and rarely causes allergic reactions in dogs.',
      benefits: [
        'Rich in thiamine (vitamin B1)',
        'High in zinc and selenium',
        'Excellent iron content',
        'Low in saturated fat',
        'Rich, palatable flavor',
        'Supports muscle development'
      ],
      healthConditions: [
        'Food allergies to common proteins',
        'Picky eaters refusing other proteins',
        'Anemia (high iron content)',
        'Muscle wasting conditions',
        'Chronic digestive issues',
        'Protein rotation diets'
      ],
      nutritionalHighlights: {
        protein: '28-31%',
        fat: '6-9%',
        keyNutrients: 'Thiamine (B1), zinc, selenium, iron, niacin'
      },
      color: '#C97B63'
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Novel Proteins for Dogs
          </h1>
          <p className="text-xl text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Alternative protein sources for dogs with food sensitivities, allergies, and special dietary needs
          </p>
          <p className="text-lg text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            When traditional proteins aren't working, novel proteins can provide relief and optimal nutrition.
          </p>
        </div>
      </section>

      {/* Why Novel Proteins */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Novel Proteins?
          </h2>

          <div className="prose prose-lg max-w-none mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p className="text-[16px] text-[#666666] leading-relaxed mb-6">
              <strong className="text-[#8FAE8F]">Novel proteins</strong> are protein sources that your dog has likely never been exposed to before. When dogs develop food allergies or sensitivities to common proteins like chicken, beef, or lamb, their immune system overreacts, causing symptoms like:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#8FAE8F]">
                <h3 className="text-lg font-semibold text-[#8FAE8F] mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Skin Symptoms
                </h3>
                <ul className="space-y-2 text-[14px] text-[#666666]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                    <span>Chronic itching and scratching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                    <span>Hot spots and rashes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                    <span>Recurring ear infections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                    <span>Red, inflamed paws</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#5E8C8C]">
                <h3 className="text-lg font-semibold text-[#5E8C8C] mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Digestive Symptoms
                </h3>
                <ul className="space-y-2 text-[14px] text-[#666666]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                    <span>Chronic diarrhea or loose stools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                    <span>Vomiting or regurgitation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                    <span>Excessive gas and bloating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                    <span>Loss of appetite or weight loss</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[#d1ecf1] border-l-4 border-[#5E8C8C] rounded-r-xl p-6 mb-8">
              <p className="text-[15px] text-[#333333] leading-relaxed mb-3">
                <strong>The Solution:</strong> By switching to a protein your dog has never eaten before, you eliminate the trigger for their allergic reaction. Novel proteins give their immune system a "reset" and their body a chance to heal.
              </p>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                Most dogs show improvement within 2-6 weeks of switching to a novel protein diet. Combined with proper elimination diet protocols, novel proteins can identify exact food triggers and provide long-term relief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Protein Deep Dives */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Our Novel Protein Options
          </h2>
          <p className="text-center text-[#666666] mb-12 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Each protein offers unique benefits and nutritional profiles. Choose based on your dog's specific needs and health conditions.
          </p>

          <div className="space-y-12">
            {proteins.map((protein, index) => (
              <div
                key={protein.name}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#e0e0e0] hover:border-[#8FAE8F] transition-all"
              >
                <div className={`h-3`} style={{ backgroundColor: protein.color }}></div>

                <div className="p-8 md:p-10">
                  {/* Header */}
                  <div className="flex items-start gap-6 mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: protein.color }}
                    >
                      <protein.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-normal mb-2" style={{ fontFamily: "'Abril Fatface', serif", color: protein.color }}>
                        {protein.name}
                      </h3>
                      <p className="text-lg text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {protein.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[15px] text-[#666666] leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {protein.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Key Benefits */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif", color: protein.color }}>
                        <Sparkles className="w-5 h-5" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {protein.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: protein.color }} />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Health Conditions */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif", color: protein.color }}>
                        <Heart className="w-5 h-5" />
                        Helps With
                      </h4>
                      <ul className="space-y-2">
                        {protein.healthConditions.map((condition, i) => (
                          <li key={i} className="flex items-start gap-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: protein.color }} />
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Nutritional Highlights */}
                  <div className="bg-[#F8F5F0] rounded-xl p-6">
                    <h4 className="text-base font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: protein.color }}>
                      Nutritional Highlights (Dry Matter Basis)
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Abril Fatface', serif", color: protein.color }}>
                          {protein.nutritionalHighlights.protein}
                        </p>
                        <p className="text-xs text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Protein
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Abril Fatface', serif", color: protein.color }}>
                          {protein.nutritionalHighlights.fat}
                        </p>
                        <p className="text-xs text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Fat
                        </p>
                      </div>
                      <div className="col-span-3 md:col-span-1">
                        <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: protein.color }}>
                          Key Nutrients
                        </p>
                        <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {protein.nutritionalHighlights.keyNutrients}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How to Choose the Right Novel Protein
          </h2>

          <div className="space-y-6 mb-12">
            <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#8FAE8F]">
              <h3 className="text-lg font-semibold text-[#8FAE8F] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Step 1: Identify Past Protein Exposure
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                List every protein your dog has eaten - in kibble, treats, chews, and table scraps. The goal is to find a protein they've NEVER had before.
              </p>
            </div>

            <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#5E8C8C]">
              <h3 className="text-lg font-semibold text-[#5E8C8C] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Step 2: Consider Your Dog's Health Conditions
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Use our protein profiles above to match proteins with your dog's specific health needs. For example, choose ultra-lean proteins like rabbit or venison for pancreatitis.
              </p>
            </div>

            <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#C97B63]">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Step 3: Start a Proper Elimination Diet
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feed ONLY the novel protein and a single carbohydrate source for 8-12 weeks. No treats, no table scraps, nothing else. This identifies if food is the trigger.
              </p>
            </div>

            <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#8FAE8F]">
              <h3 className="text-lg font-semibold text-[#8FAE8F] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Step 4: Work with a Nutrition Expert
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Novel protein diets must be properly balanced for long-term feeding. Our team ensures your dog gets complete nutrition while managing their food sensitivities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Try Novel Proteins?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our team can help you select the right novel protein and create a complete, balanced elimination diet tailored to your dog's needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Novel Protein Meals
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
