import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Check, Star, Award, ChefHat, Heart, ShieldCheck, Stethoscope, Leaf, Mail, Phone } from 'lucide-react';

export default function MealToppersPage() {
  const toppers = [
    {
      name: 'Chicken Superfood Cakes',
      tagline: 'Nutrient-Dense Mini Meals or Toppers',
      price: 24,
      size: '12 cakes (2 oz each)',
      image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
      description: 'Packed with lean protein, vibrant superfoods, and essential nutrients—these cakes can be used as a complete meal for small dogs or a protein-rich topper for any size pup.',
      keyBenefits: [
        'High-quality lean chicken protein',
        'Superfood ingredients (kale, blueberries, sweet potato)',
        'Antioxidant-rich for immune support',
        'Perfect portion control',
        'Versatile: meal or topper'
      ],
      ingredients: 'Organic chicken breast, sweet potato, kale, blueberries, quinoa, flaxseed, turmeric, organic coconut oil',
      servingSize: '1-3 cakes per day (as topper) or 4-6 cakes per day (as complete meal for small dogs)',
      howToServe: [
        'Crumble over regular food as a topper',
        'Serve whole as a complete meal (small dogs)',
        'Break into training treats',
        'Warm slightly for enhanced aroma'
      ],
      color: 'green',
      featured: true
    },
    {
      name: 'Pup-a-Loaf',
      tagline: 'Hearty, Savory Meatloaf for Dogs',
      price: 28,
      size: '2 lb loaf (serves 8-12 meals)',
      image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
      description: 'A wholesome, home-style meatloaf made with grass-fed beef, vegetables, and nutrient-rich additions. Slice and serve as a topper or complete meal.',
      keyBenefits: [
        'Grass-fed beef for premium protein',
        'Easy to slice and portion',
        'Highly palatable for picky eaters',
        'Rich in B vitamins and iron',
        'Freezes well for meal prep'
      ],
      ingredients: 'Grass-fed ground beef, organic oats, carrots, spinach, eggs, bone broth, organic pumpkin, parsley',
      servingSize: '2-6 oz per day (depending on dog size)',
      howToServe: [
        'Slice and crumble over kibble',
        'Serve as standalone meal with veggies',
        'Cut into cubes for training treats',
        'Freeze portions for easy meal prep'
      ],
      color: 'amber'
    },
    {
      name: 'Dehydrated Meal Toppers',
      tagline: 'Convenient, Shelf-Stable Nutrition Boost',
      price: 18,
      size: '8 oz bag (makes 16-24 servings)',
      image: '/images/woman-with-white-dog.webp',
      description: 'Our dehydrated topper blends combine freeze-dried meats, vegetables, and superfoods. Just sprinkle on any meal for an instant nutrition and flavor upgrade.',
      keyBenefits: [
        'Long shelf life (no refrigeration needed)',
        'Lightweight and travel-friendly',
        'Concentrated nutrition',
        'Multiple flavor options',
        'Easy portion control'
      ],
      ingredients: 'Freeze-dried chicken OR beef, dehydrated sweet potato, carrots, green beans, blueberries, kelp, organic parsley',
      servingSize: '1-2 tablespoons per meal (rehydrate with water or sprinkle dry)',
      howToServe: [
        'Sprinkle dry over any food',
        'Rehydrate with warm water or broth',
        'Mix into homemade meals',
        'Perfect for travel or camping'
      ],
      color: 'blue'
    }
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#f0f9ff] via-[#fef7e8] to-[#f0fdf4] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-[#a5b5eb]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${15 + Math.random() * 15}px`,
                height: `${15 + Math.random() * 15}px`
              }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center bg-purple-50 border border-purple-200 rounded-full px-5 py-2 mb-6">
            <ChefHat className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-semibold text-purple-700">Flavor & Nutrition Enhancers</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Meal Toppers:{' '}
            <span className="text-[#a5b5eb]">Transform</span>
            <br />
            Every Meal Into a Feast
          </h1>

          <p className="text-xl text-[#666666] mb-10 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Elevate your dog's meals with our nutritionist-formulated toppers—<strong className="text-[#3c3a47]">adding flavor, nutrition, and variety</strong> to every bowl.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { icon: Star, text: 'Picky Eater Approved', color: 'amber' },
              { icon: Heart, text: 'Nutrient-Dense', color: 'red' },
              { icon: ChefHat, text: 'Multiple Options', color: 'blue' }
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

      {/* Products Grid */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {toppers.map((topper, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
                  topper.featured ? 'ring-4 ring-green-500' : ''
                }`}
              >
                {topper.featured && (
                  <div className="bg-green-500 text-white text-center py-2 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold">CUSTOMER FAVORITE</span>
                    </div>
                  </div>
                )}

                <div className="relative h-64">
                  <Image
                    src={topper.image}
                    alt={topper.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-2xl font-bold text-[#3c3a47]">${topper.price}</div>
                    <div className="text-xs text-[#666666]">{topper.size}</div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {topper.name}
                  </h3>
                  <p className={`text-${topper.color}-600 font-semibold text-sm mb-4`}>{topper.tagline}</p>

                  <p className="text-[15px] text-[#666666] mb-6 leading-relaxed">{topper.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-[#3c3a47] mb-3">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {topper.keyBenefits.map((benefit, j) => (
                        <li key={j} className="flex items-start">
                          <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#666666]">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/shop"
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors mb-4 ${
                      topper.featured
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-[#a5b5eb] text-white hover:bg-[#8a9fd9]'
                    }`}
                  >
                    Add to Cart
                  </Link>

                  <details className="group">
                    <summary className="cursor-pointer text-sm font-semibold text-[#a5b5eb] hover:text-[#8a9fd9] flex items-center justify-between">
                      <span>View Details</span>
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="text-xs font-semibold text-[#3c3a47] mb-2">Ingredients:</h5>
                        <p className="text-xs text-[#666666]">{topper.ingredients}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-[#3c3a47] mb-2">Serving Size:</h5>
                        <p className="text-xs text-[#666666]">{topper.servingSize}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-[#3c3a47] mb-2">How to Serve:</h5>
                        <ul className="space-y-1">
                          {topper.howToServe.map((method, k) => (
                            <li key={k} className="text-xs text-[#666666] flex items-start">
                              <span className="mr-2">•</span>
                              <span>{method}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use Meal Toppers */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Add Toppers to Your Dog's Meals?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Star,
                title: 'Entice Picky Eaters',
                desc: "Make meals irresistible—even the fussiest dogs can't resist the added flavor and aroma."
              },
              {
                icon: Heart,
                title: 'Boost Nutrition',
                desc: 'Add high-quality protein, vitamins, and minerals to any commercial or homemade diet.'
              },
              {
                icon: Sparkles,
                title: 'Add Variety',
                desc: 'Rotate toppers to keep meals interesting and prevent food boredom.'
              },
              {
                icon: ChefHat,
                title: 'Easy Transition',
                desc: 'Perfect for introducing fresh food gradually or enhancing kibble-based diets.'
              }
            ].map((reason, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-14 h-14 bg-[#a5b5eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="w-7 h-7 text-[#a5b5eb]" />
                </div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-3">{reason.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topper Tips */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Topper Tips from Christie
          </h2>

          <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-2xl shadow-xl p-10 border-l-4 border-[#a5b5eb]">
            <div className="space-y-6">
              {[
                {
                  tip: 'Start Small',
                  desc: 'Introduce toppers gradually—start with small amounts (1-2 tablespoons) and increase over 5-7 days to avoid digestive upset.'
                },
                {
                  tip: 'Rotate for Variety',
                  desc: 'Switch between different toppers weekly to provide diverse nutrients and prevent food boredom.'
                },
                {
                  tip: 'Account for Calories',
                  desc: 'Toppers add calories! Reduce base meal portions slightly (10-15%) when adding toppers to maintain healthy weight.'
                },
                {
                  tip: 'Storage Matters',
                  desc: 'Fresh toppers last 5 days refrigerated, 3 months frozen. Dehydrated toppers stay fresh for 6 months in a cool, dry place.'
                },
                {
                  tip: 'Warm for Appeal',
                  desc: 'Gently warming toppers enhances aroma and makes them extra appealing to picky eaters or senior dogs.'
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-8 h-8 bg-[#a5b5eb] rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#3c3a47] mb-2">{item.tip}</h3>
                    <p className="text-[15px] text-[#666666] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <h2 className="text-center text-[35px] font-semibold text-[#333333] mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Dogs (& Their Owners) Love Our Toppers
        </h2>
        <div className="mx-auto max-w-[1080px] grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: '"My picky Yorkie finally eats! The Chicken Superfood Cakes completely transformed mealtime. She actually gets excited now!"',
              author: 'Amanda R.',
              product: 'Chicken Superfood Cakes'
            },
            {
              quote: '"The Pup-a-Loaf is a game-changer. I slice it up for the week and my dogs go crazy for it. So much easier than cooking myself!"',
              author: 'Brian S.',
              product: 'Pup-a-Loaf'
            },
            {
              quote: '"Perfect for travel! The dehydrated toppers are lightweight and make any food taste amazing. My dog never refuses a meal on the road."',
              author: 'Lisa M.',
              product: 'Dehydrated Toppers'
            }
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 text-[15px] leading-relaxed text-[#3c3a47]">{t.quote}</p>
              <p className="text-[14px] font-semibold text-[#3c3a47]">{t.author}</p>
              <p className="text-xs text-[#a5b5eb]">{t.product}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-normal mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Make Every Meal Extraordinary?
          </h2>
          <p className="text-lg mb-8">
            Try our toppers risk-free—if your dog doesn't love them, we'll refund your purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-[#a5b5eb] px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Shop Meal Toppers
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#a5b5eb] transition-colors"
            >
              Get Feeding Advice
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-90">100% Satisfaction Guarantee • Made Fresh Daily</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#2f4b38] to-[#1f3324] text-white mt-16">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/logo-waggin-meals.png"
                  alt="Waggin Meals"
                  width={50}
                  height={50}
                  className="rounded-full border border-[#ded2bf]"
                />
                <div>
                  <p className="text-base font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Waggin Meals
                  </p>
                  <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Holistic Nutrition Studio
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Specialized nutrition tailored to your dog's unique needs. Every meal scientifically formulated by Christie Webb, Certified Canine Nutritionist.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 opacity-90">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@wagginmeals.com" className="hover:text-[#f6a723] transition-colors">
                    info@wagginmeals.com
                  </a>
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-[#f6a723] transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>
                  <Link href="/" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/nutrition-services" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Nutrition Services
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Pet Nutrition Insights
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Resources
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>
                  <Link href="/feeding-calculator" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Feeding Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/guides/fresh-food-guide" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Fresh Food Guide
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Free PDF Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Legal
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>
                  <Link href="/shipping" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="https://shopify.com/75736613077/account" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    My Account
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Compliance & Certifications */}
          <div className="border-t border-white/20 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    FDA Pet Feed Program
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Licensed human-grade kitchen with documented batch tracking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie Formulated
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Dual-master's Canine Integrative Animal Nutritionist oversight.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    AAFCO Complete
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Balanced for dogs of every life stage with whole-food ingredients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Disclaimer */}
          <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/20">
            <p className="text-xs text-center opacity-90 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Important Information:</strong> At Waggin Meals, we believe your dog deserves real food made with love. Our <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the <strong>FDA Pet Feed Program</strong> and scientifically formulated by an animal nutritionist to meet <strong>AAFCO standards for dogs of all ages</strong>. Our meals are formulated exclusively for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your veterinarian for health decisions about your dog.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p className="mb-2">
              © {new Date().getFullYear()} Waggin Meals Pet Nutrition Co. All rights reserved.
            </p>
            <p className="text-xs">
              Formulated by Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
