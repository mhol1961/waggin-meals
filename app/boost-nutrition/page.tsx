import Link from 'next/link';
import Image from 'next/image';
import { Heart, Shield, Zap, Droplets, Check, Sparkles, Award } from 'lucide-react';

export default function BoostNutritionPage() {
  const products = [
    {
      name: 'Bone Broth',
      tagline: 'Liquid Gold for Joint & Immune Health',
      price: 18,
      size: '16 oz',
      image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
      description: 'Our slow-simmered bone broth is packed with collagen, amino acids, and minerals that support joint health, digestion, and immune function.',
      keyBenefits: [
        'Supports joint health & mobility',
        'Boosts immune system function',
        'Improves digestion & gut health',
        'Promotes healthy skin & coat',
        'Aids in hydration & appetite'
      ],
      ingredients: 'Grass-fed beef bones, filtered water, organic apple cider vinegar, organic celery, organic carrots, organic parsley',
      servingSize: '1-4 oz per day (depending on dog size)',
      perfectFor: [
        'Senior dogs with joint stiffness',
        'Dogs recovering from illness or surgery',
        'Picky eaters who need appetite stimulation',
        'Dogs with digestive sensitivities',
        'Any dog needing nutritional boost'
      ],
      color: 'amber'
    },
    {
      name: 'Prince Jax Healing Stew',
      tagline: 'Therapeutic Recipe for Gentle Healing',
      price: 22,
      size: '16 oz',
      image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
      description: "Named after Christie's own rescued dog, this gentle, easy-to-digest stew was formulated to help dogs heal from illness, surgery, or digestive upset.",
      keyBenefits: [
        'Gentle on sensitive stomachs',
        'Supports recovery & healing',
        'High in lean protein & antioxidants',
        'Anti-inflammatory ingredients',
        'Easy to digest & nutrient-dense'
      ],
      ingredients: 'Organic chicken, sweet potato, pumpkin, bone broth, turmeric, ginger, organic spinach, blueberries',
      servingSize: '2-6 oz per day (can be used as meal or topper)',
      perfectFor: [
        'Dogs recovering from illness or surgery',
        'Dogs with digestive upset or diarrhea',
        'Dogs with inflammatory conditions',
        'Dogs needing weight gain',
        'Post-dental procedure recovery'
      ],
      color: 'green',
      featured: true
    }
  ];

  return (
    <main className="bg-white">
      {/* FDA Disclaimer */}
      <section className="bg-[#f0f7ff] border-b-2 border-[#a5b5eb] px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-[16px] font-semibold text-[#3c3a47] mb-2 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our Promise
          </h3>
          <p className="text-[14px] text-[#666666] leading-relaxed mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            At Waggin Meals, we believe your dog deserves real food made with love. Our <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the <strong>FDA Pet Feed Program</strong> and scientifically formulated by an Animal Nutritionist to meet <strong>AAFCO standards for dog(s) of all ages</strong>.
          </p>
          <p className="text-[13px] text-[#666666] leading-relaxed text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <strong>Important Info:</strong> Our meals are specially formulated for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your vet for any health-related decisions about your dog.
          </p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#fef3c7] via-white to-[#f0f9ff] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-5 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700">Therapeutic Nutrition Supplements</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
            <span className="text-[#f59e0b]">Boost Nutrition:</span>
            <br />
            Healing Support for Your Dog
          </h1>

          <p className="text-xl text-[#666666] mb-10 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Premium bone broth and therapeutic stew formulated by Christie Willett, M.S., to support{' '}
            <strong className="text-[#3c3a47]">recovery, healing, and optimal wellness</strong> for dogs of all ages.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { icon: Shield, text: 'Immune Support', color: 'blue' },
              { icon: Heart, text: 'Joint Health', color: 'red' },
              { icon: Zap, text: 'Digestive Wellness', color: 'green' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <span className="text-sm font-semibold text-[#3c3a47]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-16">
            {products.map((product, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${
                  product.featured ? 'ring-4 ring-green-500' : ''
                }`}
              >
                {product.featured && (
                  <div className="bg-green-500 text-white text-center py-2 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-bold">CHRISTIE'S SIGNATURE RECIPE</span>
                    </div>
                  </div>
                )}

                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-96 lg:h-auto">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {product.name}
                        </h2>
                        <p className={`text-${product.color}-600 font-semibold text-lg mb-2`}>{product.tagline}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-[#3c3a47]">${product.price}</div>
                        <div className="text-sm text-[#666666]">{product.size}</div>
                      </div>
                    </div>

                    <p className="text-[15px] text-[#666666] mb-6 leading-relaxed">{product.description}</p>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-[#3c3a47] mb-3 flex items-center gap-2">
                        <Sparkles className={`w-5 h-5 text-${product.color}-600`} />
                        Key Benefits
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {product.keyBenefits.map((benefit, j) => (
                          <li key={j} className="flex items-start">
                            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#666666]">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-[#3c3a47] mb-2">Ingredients</h4>
                      <p className="text-sm text-[#666666]">{product.ingredients}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-[#3c3a47] mb-2">Serving Size</h4>
                      <p className="text-sm text-[#666666]">{product.servingSize}</p>
                    </div>

                    <Link
                      href="/shop"
                      className={`block w-full text-center py-4 rounded-lg font-semibold transition-colors mb-4 ${
                        product.featured
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      Add to Cart
                    </Link>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Perfect For:</p>
                      <ul className="space-y-1">
                        {product.perfectFor.map((use, j) => (
                          <li key={j} className="text-sm text-blue-800 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How to Use Boost Nutrition
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Droplets,
                title: 'As a Meal Topper',
                desc: "Pour 1-4 oz over your dog's regular meals to add flavor, moisture, and nutrition.",
                color: 'blue'
              },
              {
                icon: Heart,
                title: 'As a Standalone Treat',
                desc: 'Serve in a bowl as a special treat or reward—dogs absolutely love the taste!',
                color: 'red'
              },
              {
                icon: Shield,
                title: 'For Recovery Support',
                desc: 'Use during illness, post-surgery, or digestive upset to support gentle healing.',
                color: 'green'
              }
            ].map((method, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className={`w-16 h-16 bg-${method.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <method.icon className={`w-8 h-8 text-${method.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3">{method.title}</h3>
                <p className="text-[15px] text-[#666666] leading-relaxed">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story Behind Prince Jax */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-2xl shadow-xl p-10 border-t-4 border-green-500">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-normal text-[#3c3a47] text-center mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              The Story Behind Prince Jax Healing Stew
            </h2>

            <div className="mb-6 text-[60px] leading-none text-green-500 opacity-30 text-center">&quot;</div>

            <blockquote className="text-lg text-[#3c3a47] leading-relaxed mb-6 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Prince Jax was a rescue dog who came to me with severe health issues. Through careful nutrition and gentle healing foods, I watched him transform into a happy, thriving companion. This stew is formulated with the same principles that helped him heal—<strong>real, wholesome ingredients that nourish the body and support recovery.</strong>
            </blockquote>

            <p className="text-center text-[15px] font-semibold text-[#3c3a47]">
              – Christie A. Willett, M.A., M.S.<br />
              Canine Integrative Animal Nutritionist
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Boost Nutrition */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Boost Nutrition Products Are Different
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Award,
                title: 'Formulated by a Nutritionist',
                desc: 'Not just recipes—these are scientifically formulated therapeutic foods designed to support specific health needs.'
              },
              {
                icon: Shield,
                title: 'Human-Grade Ingredients',
                desc: 'Every ingredient meets FDA standards for human consumption—because we believe your dog deserves the best.'
              },
              {
                icon: Sparkles,
                title: 'Small-Batch Production',
                desc: 'Made fresh in our farm kitchen in small batches to ensure quality, freshness, and maximum nutritional value.'
              },
              {
                icon: Heart,
                title: 'No Fillers or Additives',
                desc: 'Just pure, whole-food ingredients. No preservatives, artificial flavors, or unnecessary additives—ever.'
              }
            ].map((reason, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 flex items-start">
                <div className="w-14 h-14 bg-[#a5b5eb]/10 rounded-full flex items-center justify-center flex-shrink-0 mr-6">
                  <reason.icon className="w-7 h-7 text-[#a5b5eb]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#3c3a47] mb-3">{reason.title}</h3>
                  <p className="text-[15px] text-[#666666] leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-4 py-16">
        <h2 className="text-center text-[35px] font-semibold text-[#333333] mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
          What Pet Parents Are Saying
        </h2>
        <div className="mx-auto max-w-[1080px] grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: "\"The bone broth helped my senior Lab so much with his arthritis. He's moving better and seems much more comfortable!\"",
              author: 'Karen R.',
              product: 'Bone Broth'
            },
            {
              quote: "\"Prince Jax Stew was a lifesaver after my dog's surgery. She couldn't keep anything down, but this stew was gentle and helped her recover.\"",
              author: 'Tom M.',
              product: 'Prince Jax Healing Stew'
            },
            {
              quote: '"I add bone broth to every meal now. My picky eater actually gets excited for dinner, and his coat has never looked better!"',
              author: 'Jessica L.',
              product: 'Bone Broth'
            }
          ].map((t, i) => (
            <div key={i} className="bg-[#f5f5f5] p-6 rounded-lg">
              <div className="mb-4 text-[48px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
              <p className="mb-4 text-[15px] leading-relaxed text-[#3c3a47]">{t.quote}</p>
              <p className="text-[14px] font-semibold text-[#3c3a47]">{t.author}</p>
              <p className="text-xs text-[#a5b5eb]">{t.product}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#10b981] to-[#34d399] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-normal mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Give Your Dog the Gift of Healing Nutrition
          </h2>
          <p className="text-lg mb-8">
            Whether supporting recovery, boosting immunity, or just adding extra nutrition, Boost products deliver real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Shop Boost Nutrition
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Ask Christie
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
