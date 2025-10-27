import Link from 'next/link';
import Image from 'next/image';
import { Check, Package, Truck, Heart, Clock, Shield, ShieldCheck, Stethoscope, Leaf, Mail, Phone } from 'lucide-react';

export default function SmartBundlesPage() {
  const bundles = [
    {
      name: 'Starter Bundle',
      tagline: 'Perfect for First-Time Fresh Feeders',
      price: 89,
      savings: 15,
      image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
      servings: '14 meals',
      description: 'Try fresh feeding with a variety of our most popular recipes—ideal for transitioning your dog to real food.',
      includes: [
        '7 Beef & Sweet Potato Bowls (1 lb each)',
        '7 Chicken Superfood Boards (1 lb each)',
        'Fresh Food Feeding Guide (PDF)',
        'Portion calculator access',
        'Free shipping on first order'
      ],
      bestFor: 'Dogs 20-40 lbs or first-time customers',
      color: 'blue'
    },
    {
      name: 'Wellness Bundle',
      tagline: 'Complete Nutrition for Everyday Health',
      price: 159,
      savings: 30,
      image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
      servings: '28 meals',
      popular: true,
      description: 'Our most popular option—a full month of balanced, nutritionist-formulated meals delivered to your door.',
      includes: [
        '14 Beef & Sweet Potato Bowls (1 lb each)',
        '14 Chicken Superfood Boards (1 lb each)',
        '4 Dehydrated Meal Toppers (variety pack)',
        'Monthly nutrition newsletter',
        'Free shipping',
        'Priority customer support'
      ],
      bestFor: 'Dogs of all ages seeking complete nutrition',
      color: 'green'
    },
    {
      name: 'Premium Bundle',
      tagline: 'Ultimate Care Package',
      price: 249,
      savings: 60,
      image: '/images/woman-with-white-dog.webp',
      servings: '42 meals + supplements',
      description: "The complete package—meals, supplements, and exclusive access to Christie's expertise for optimal health.",
      includes: [
        '21 Beef & Sweet Potato Bowls (1 lb each)',
        '21 Chicken Superfood Boards (1 lb each)',
        '8 oz Bone Broth (immune support)',
        '8 oz Prince Jax Healing Stew',
        'Dehydrated Meal Toppers (variety pack)',
        'Free 30-min nutrition consultation ($100 value)',
        'Quarterly health check-in',
        'Free shipping + priority delivery'
      ],
      bestFor: 'Dogs with special needs or health goals',
      color: 'purple'
    }
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8f4fb] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#a5b5eb] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#10b981] rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-5 py-2 mb-6">
            <Package className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700">Curated Meal Bundles</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Smart Bundles:{' '}
            <span className="text-[#a5b5eb]">Complete Nutrition</span>
            <br />
            Made Simple
          </h1>

          <p className="text-xl text-[#666666] mb-10 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Save time and money with our expertly curated meal bundles—featuring nutritionist-formulated recipes, premium ingredients, and{' '}
            <strong className="text-[#3c3a47]">everything your dog needs to thrive.</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { icon: Truck, text: 'Free Shipping', color: 'blue' },
              { icon: Heart, text: 'Save Up to $60', color: 'green' },
              { icon: Shield, text: 'Money-Back Guarantee', color: 'purple' }
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

      {/* Bundles Grid */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {bundles.map((bundle, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
                  bundle.popular ? 'ring-4 ring-green-500 scale-105' : ''
                }`}
              >
                {bundle.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="relative h-64">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {bundle.name}
                  </h3>
                  <p className="text-sm text-[#a5b5eb] font-semibold mb-4">{bundle.tagline}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-[#3c3a47]">${bundle.price}</span>
                      <span className="text-sm text-[#666666]">{bundle.servings}</span>
                    </div>
                    <p className="text-sm text-green-600 font-semibold">Save ${bundle.savings} vs. individual purchase</p>
                  </div>

                  <p className="text-[15px] text-[#666666] mb-6 leading-relaxed">{bundle.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-[#3c3a47] mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {bundle.includes.map((item, j) => (
                        <li key={j} className="flex items-start">
                          <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#666666]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-[#666666] mb-1">
                      <strong>Best For:</strong>
                    </p>
                    <p className="text-sm text-[#3c3a47]">{bundle.bestFor}</p>
                  </div>

                  <Link
                    href="/shop"
                    className={`block w-full text-center py-4 rounded-lg font-semibold transition-colors ${
                      bundle.popular
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-[#a5b5eb] text-white hover:bg-[#8a9fd9]'
                    }`}
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Smart Bundles */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Choose Smart Bundles?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Clock,
                title: 'Save Time & Effort',
                desc: 'No more meal planning, shopping, or prep work. Just thaw, serve, and watch your dog thrive.'
              },
              {
                icon: Heart,
                title: 'Better Value',
                desc: 'Bundles are priced lower than individual meals—you get premium nutrition without the premium price tag.'
              },
              {
                icon: Shield,
                title: 'Nutritionist-Approved',
                desc: 'Every bundle is formulated by Christie Willett, M.S., to meet AAFCO standards for complete & balanced nutrition.'
              },
              {
                icon: Package,
                title: 'Convenient Delivery',
                desc: 'Free shipping directly to your door. Meals arrive fresh, never frozen, and ready to serve.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 flex items-start">
                <div className="w-14 h-14 bg-[#a5b5eb]/10 rounded-full flex items-center justify-center flex-shrink-0 mr-6">
                  <feature.icon className="w-7 h-7 text-[#a5b5eb]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#3c3a47] mb-3">{feature.title}</h3>
                  <p className="text-[15px] text-[#666666] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Your Bundle', desc: "Select the bundle that fits your dog's needs and your lifestyle." },
              { step: '2', title: 'We Prepare & Deliver', desc: 'Meals are freshly prepared in our farm kitchen and delivered to your door.' },
              { step: '3', title: 'Serve & Enjoy', desc: 'Simply thaw, portion, and serve. Watch your dog love every bite!' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3">{step.title}</h3>
                <p className="text-[15px] text-[#666666] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'How long do the meals stay fresh?',
                a: 'Our meals stay fresh in the refrigerator for up to 5 days, or you can freeze them for up to 3 months. We recommend thawing in the fridge overnight.'
              },
              {
                q: 'Can I customize my bundle?',
                a: "Absolutely! Contact us at shopwagginmeals@gmail.com and Christie can help create a custom bundle tailored to your dog's specific needs."
              },
              {
                q: "What if my dog doesn't like it?",
                a: "We offer a 100% satisfaction guarantee. If your dog doesn't love our food within the first 14 days, we'll provide a full refund—no questions asked."
              },
              {
                q: "How do I know which bundle is right for my dog?",
                a: "Bundle selection depends on your dog's weight, activity level, and health status. Use our feeding calculator or book a free 15-minute consultation with Christie for personalized guidance."
              },
              {
                q: 'Do you ship nationwide?',
                a: 'Yes! We ship fresh meals nationwide. Local customers in our service area receive priority delivery and additional perks.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-3">{faq.q}</h3>
                <p className="text-[15px] text-[#666666] leading-relaxed">{faq.a}</p>
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
              quote: "\"The Wellness Bundle has been a game-changer! My dog's energy levels are through the roof, and his coat has never looked better.\"",
              author: 'Sarah M.'
            },
            {
              quote: "\"I love that I don't have to think about meal prep anymore. The bundles make it so easy to give my dog real, nutritious food.\"",
              author: 'David K.'
            },
            {
              quote: "\"Worth every penny! The Premium Bundle with the consultation helped us address my dog's allergies. Christie is amazing!\"",
              author: 'Jennifer L.'
            }
          ].map((t, i) => (
            <div key={i} className="bg-[#f5f5f5] p-6 rounded-lg">
              <div className="mb-4 text-[48px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
              <p className="mb-4 text-[15px] leading-relaxed text-[#3c3a47]">{t.quote}</p>
              <p className="text-[14px] font-semibold text-[#3c3a47]">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-normal mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Give Your Dog the Gift of Real Food?
          </h2>
          <p className="text-lg mb-8">
            Choose a Smart Bundle and start your dog's journey to better health today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-[#a5b5eb] px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Shop Smart Bundles
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#a5b5eb] transition-colors"
            >
              Book Free Consultation
            </Link>
          </div>
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
