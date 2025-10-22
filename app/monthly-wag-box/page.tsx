import Link from 'next/link';
import Image from 'next/image';
import { Gift, Calendar, Heart, Star, Check, Sparkles, TrendingUp, X } from 'lucide-react';

export default function MonthlyWagBoxPage() {
  const boxTiers = [
    {
      name: 'Tail Wagger Box',
      price: 39,
      priceInterval: '/month',
      image: '/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg',
      description: 'Perfect introduction to fresh, wholesome nutrition for your pup.',
      includes: [
        '4-6 Fresh Meal Portions (rotating recipes)',
        '2 Dehydrated Meal Toppers',
        '1 Surprise Treat',
        'Monthly Nutrition Tip Card',
        'Free shipping'
      ],
      bestFor: 'Small to medium dogs (up to 30 lbs)',
      value: '$50+ value',
      color: 'blue'
    },
    {
      name: 'Waggin\' Supreme Box',
      price: 69,
      priceInterval: '/month',
      popular: true,
      image: '/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg',
      description: 'Our most popular box—complete nutrition plus exclusive wellness products.',
      includes: [
        '8-10 Fresh Meal Portions (rotating recipes)',
        '4 Dehydrated Meal Toppers',
        '2 oz Bone Broth OR Prince Jax Healing Stew',
        '2-3 Premium Treats',
        'Exclusive Wellness Product',
        'Monthly Nutrition Newsletter',
        'Free shipping + priority delivery'
      ],
      bestFor: 'Medium to large dogs (30-70 lbs)',
      value: '$95+ value',
      color: 'green'
    },
    {
      name: 'VIP Wellness Box',
      price: 129,
      priceInterval: '/month',
      image: '/images/woman-with-white-dog.webp',
      description: 'Ultimate care package with personalized nutrition guidance from Christie.',
      includes: [
        '14-16 Fresh Meal Portions (customizable recipes)',
        '6 Dehydrated Meal Toppers',
        '8 oz Bone Broth + 8 oz Prince Jax Healing Stew',
        '4-5 Premium Treats & Chews',
        'Exclusive Supplement Sample',
        'Monthly 15-min Check-in with Christie',
        'Quarterly Health Progress Report',
        'Priority customer support',
        'Free shipping + VIP delivery'
      ],
      bestFor: 'Dogs with special needs or health goals',
      value: '$180+ value',
      color: 'purple'
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
      <section className="relative bg-gradient-to-br from-[#fef3c7] via-[#fef7e8] to-[#f0f9ff] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-[#f59e0b]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 20}px`,
                height: `${20 + Math.random() * 20}px`
              }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center bg-amber-50 border border-amber-300 rounded-full px-5 py-2 mb-6">
            <Gift className="w-4 h-4 text-amber-600 mr-2" />
            <span className="text-sm font-semibold text-amber-700">Monthly Subscription Box</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
            The Monthly{' '}
            <span className="text-[#f59e0b]">Wag Box:</span>
            <br />
            <span className="text-[#a5b5eb]">Fresh Meals</span> Delivered Monthly
          </h1>

          <p className="text-xl text-[#666666] mb-10 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            A curated box of nutritionist-formulated meals, treats, and wellness products—<strong className="text-[#3c3a47]">delivered to your door every month.</strong> Never run out of fresh, wholesome food again!
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { icon: Calendar, text: 'Cancel Anytime', color: 'blue' },
              { icon: Heart, text: 'Save Up to 25%', color: 'green' },
              { icon: Sparkles, text: 'Surprise Goodies', color: 'amber' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <span className="text-sm font-semibold text-[#3c3a47]">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center bg-green-50 border border-green-300 rounded-lg px-6 py-3">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700">Over 200 happy subscribers!</span>
          </div>
        </div>
      </section>

      {/* Box Tiers */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Choose Your Monthly Wag Box
            </h2>
            <p className="text-lg text-[#666666]">Select the perfect subscription for your dog's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {boxTiers.map((box, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
                  box.popular ? 'ring-4 ring-green-500 scale-105' : ''
                }`}
              >
                {box.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="relative h-64">
                  <Image
                    src={box.image}
                    alt={box.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-xs text-[#666666] mb-1">Starting at</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#3c3a47]">${box.price}</span>
                      <span className="text-sm text-[#666666]">{box.priceInterval}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {box.name}
                  </h3>

                  <div className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {box.value}
                  </div>

                  <p className="text-[15px] text-[#666666] mb-6 leading-relaxed">{box.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-[#3c3a47] mb-3">What's Inside Each Month:</h4>
                    <ul className="space-y-2">
                      {box.includes.map((item, j) => (
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
                    <p className="text-sm text-[#3c3a47]">{box.bestFor}</p>
                  </div>

                  <Link
                    href="/shop"
                    className={`block w-full text-center py-4 rounded-lg font-semibold transition-colors ${
                      box.popular
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-[#a5b5eb] text-white hover:bg-[#8a9fd9]'
                    }`}
                  >
                    Subscribe Now
                  </Link>

                  <p className="text-xs text-center text-[#666666] mt-3">Cancel anytime • No commitment</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: Gift, title: 'Choose Your Box', desc: 'Select the subscription tier that fits your dog's needs.' },
              { step: '2', icon: Calendar, title: 'Set Your Schedule', desc: 'Choose monthly, bi-monthly, or customize your delivery frequency.' },
              { step: '3', icon: Heart, title: 'We Prepare & Pack', desc: 'Christie's team hand-packs your box with fresh meals and goodies.' },
              { step: '4', icon: Sparkles, title: 'Enjoy & Repeat', desc: 'Boxes arrive on schedule. Your dog loves it, every single time!' }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{step.step}</span>
                </div>
                <div className="w-12 h-12 bg-[#a5b5eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-[#a5b5eb]" />
                </div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-3">{step.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Subscribe */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Wag Box Subscribers Love Us
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Never Run Out',
                desc: 'Automatic deliveries mean fresh, nutritious meals are always on hand—no last-minute runs to the store.'
              },
              {
                icon: TrendingUp,
                title: 'Better Value',
                desc: 'Subscribers save up to 25% compared to one-time purchases. The longer you subscribe, the more you save!'
              },
              {
                icon: Sparkles,
                title: 'Surprise & Delight',
                desc: 'Every box includes curated surprises—new treats, samples, or exclusive products not available elsewhere.'
              },
              {
                icon: Calendar,
                title: 'Total Flexibility',
                desc: 'Skip a month, change your plan, or cancel anytime. No contracts, no hassle—just fresh food on your schedule.'
              },
              {
                icon: Check,
                title: 'Nutritionist-Approved',
                desc: 'Every meal is formulated by Christie Willett, M.S., to meet AAFCO standards for complete & balanced nutrition.'
              },
              {
                icon: Gift,
                title: 'Priority Support',
                desc: 'Subscribers get priority access to Christie's expertise, exclusive content, and VIP customer support.'
              }
            ].map((benefit, i) => (
              <div key={i} className="bg-[#f5f5f5] rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-[#a5b5eb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-3">{benefit.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <h2 className="text-center text-[35px] font-semibold text-[#333333] mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
          What Wag Box Subscribers Say
        </h2>
        <div className="mx-auto max-w-[1080px] grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: '"Best decision ever! My dog gets so excited when the Wag Box arrives. The variety keeps mealtime interesting and his health has improved dramatically."',
              author: 'Rachel T.',
              plan: 'Waggin\' Supreme Box'
            },
            {
              quote: '"I love that I never have to worry about running out of food. The surprise treats are always a hit, and Christie's monthly tips are so helpful!"',
              author: 'Michael P.',
              plan: 'Tail Wagger Box'
            },
            {
              quote: '"Worth every penny for the VIP box. The personalized check-ins with Christie have been invaluable for managing my dog's allergies."',
              author: 'Linda S.',
              plan: 'VIP Wellness Box'
            }
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 text-[15px] leading-relaxed text-[#3c3a47]">{t.quote}</p>
              <p className="text-[14px] font-semibold text-[#3c3a47] mb-1">{t.author}</p>
              <p className="text-xs text-[#a5b5eb]">{t.plan} Subscriber</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes! There are no contracts or commitments. You can cancel, pause, or modify your subscription at any time through your account dashboard or by contacting us.'
              },
              {
                q: 'When will my box ship?',
                a: 'Boxes ship on the 15th of each month. Your first box ships within 3-5 business days of subscribing, then monthly thereafter.'
              },
              {
                q: 'Can I customize what's in my box?',
                a: 'VIP Wellness Box subscribers can customize their meal recipes. All subscribers can note dietary restrictions or preferences in their account settings.'
              },
              {
                q: 'What if my dog doesn't like something in the box?',
                a: 'We offer a 100% satisfaction guarantee. If your dog doesn't love any item, contact us and we'll replace it or credit your account—no questions asked.'
              },
              {
                q: 'How do I store the fresh meals?',
                a: 'Fresh meals stay good in the refrigerator for up to 5 days, or freeze them for up to 3 months. We recommend thawing frozen meals in the fridge overnight.'
              },
              {
                q: 'Can I add extra items to my monthly box?',
                a: 'Absolutely! Subscribers get exclusive access to add-on items at discounted prices. Shop add-ons when your box ships.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-[#f5f5f5] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-3">{faq.q}</h3>
                <p className="text-[15px] text-[#666666] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-normal mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Start Your Dog's Monthly Surprise?
          </h2>
          <p className="text-lg mb-8">
            Join 200+ happy subscribers giving their dogs fresh, nutritionist-formulated meals every month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-[#f59e0b] px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Choose Your Wag Box
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#f59e0b] transition-colors"
            >
              Talk to Christie First
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-90">Cancel anytime • No commitment • 100% Satisfaction Guarantee</p>
        </div>
      </section>
    </main>
  );
}
