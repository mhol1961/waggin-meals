'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

type CategoryType = 'All' | 'Fresh Food & Feeding' | 'Storage & Safety' | 'Ingredients & Nutrition' | 'Shipping & Delivery' | 'Subscriptions & Orders' | 'Nutrition Services' | 'General';

const faqs: FAQItem[] = [
  // Fresh Food & Feeding
  {
    category: "Fresh Food & Feeding",
    question: "What makes Waggin Meals different from other dog food brands?",
    answer: "Waggin Meals offers specialized nutrition formulated by Christie A. Willett, M.A., M.S., a Canine Integrative Animal Nutritionist. Unlike big box companies that use computer-generated responses, we listen to your dog's unique needs. Our meals are made with farm-fresh, sustainably sourced ingredients and are human-grade quality."
  },
  {
    category: "Fresh Food & Feeding",
    question: "How do I know which meal is right for my dog?",
    answer: "Every dog is different! We recommend using our Feeding Calculator to determine the right portion sizes, and scheduling a nutrition consultation with Christie to discuss your dog's specific needs, health conditions, and dietary preferences. You can also contact us directly for personalized recommendations."
  },
  {
    category: "Fresh Food & Feeding",
    question: "Are your meals nutritionally complete and balanced?",
    answer: "Yes! All of our fresh food meals are scientifically formulated to meet AAFCO nutritional standards for dogs. They contain the right balance of proteins, fats, carbohydrates, vitamins, and minerals your dog needs for optimal health."
  },
  {
    category: "Fresh Food & Feeding",
    question: "Can I mix Waggin Meals with my dog's current food?",
    answer: "Absolutely! Our meal toppers are specifically designed to enhance your dog's current diet. If you're switching to our complete meals, we recommend a gradual transition over 7-10 days, slowly increasing the amount of Waggin Meals while decreasing the old food."
  },
  {
    category: "Fresh Food & Feeding",
    question: "How do I transition my dog to Waggin Meals?",
    answer: "Start slow! Begin by mixing 25% Waggin Meals with 75% of their current food for 2-3 days. Then move to 50/50 for 2-3 days, then 75% Waggin Meals for 2-3 days, and finally 100% Waggin Meals. This gradual transition helps prevent digestive upset."
  },
  {
    category: "Fresh Food & Feeding",
    question: "How much should I feed my dog?",
    answer: "Feeding amounts depend on your dog's weight, age, activity level, and metabolism. As a general guideline, dogs need about 2-3% of their body weight in fresh food daily. Our product pages include feeding calculators, and Christie can provide personalized recommendations during a consultation."
  },
  {
    category: "Fresh Food & Feeding",
    question: "Can I feed Waggin Meals exclusively, or do I need to supplement?",
    answer: "Our complete fresh meals are nutritionally balanced and designed to be fed as a dog's sole diet. However, meal toppers are supplements meant to enhance your dog's existing food. If you have questions about your dog's specific needs, schedule a consultation with Christie."
  },
  {
    category: "Fresh Food & Feeding",
    question: "What's the difference between complete meals and meal toppers?",
    answer: "Complete meals are nutritionally balanced and provide all the nutrients your dog needs as a standalone diet. Meal toppers are nutrient-dense supplements designed to be added to kibble or other base diets to boost nutrition, palatability, and variety."
  },
  {
    category: "Fresh Food & Feeding",
    question: "Will my picky eater like Waggin Meals?",
    answer: "Most dogs love the taste of fresh, real food! Many customers tell us their picky eaters devour Waggin Meals. The aroma and texture of fresh ingredients are far more appealing than processed kibble. If your dog doesn't love it, contact us within 14 days—we want every dog to be happy!"
  },

  // Storage & Safety
  {
    category: "Storage & Safety",
    question: "How should I store Waggin Meals products?",
    answer: "Our fresh meals should be refrigerated immediately upon arrival and used within 4-5 days of opening. You can also freeze portions for up to 3 months. Always thaw frozen meals in the refrigerator, never at room temperature."
  },
  {
    category: "Storage & Safety",
    question: "How long do your products last?",
    answer: "Fresh meals: 4-5 days refrigerated, up to 3 months frozen. Treats and toppers vary by product - check the packaging for specific storage instructions. We always recommend checking the product date and following proper storage guidelines."
  },
  {
    category: "Storage & Safety",
    question: "Is it safe to refreeze thawed meals?",
    answer: "We do not recommend refreezing meals once they've been thawed. Instead, thaw only what your dog will eat within 4-5 days. You can portion meals before freezing to make thawing more convenient."
  },
  {
    category: "Storage & Safety",
    question: "How do I know if the food has gone bad?",
    answer: "Fresh food should smell pleasant and look fresh. Discard any food that has an off smell, visible mold, or discoloration. Always check the use-by date on packaging and follow proper refrigeration guidelines."
  },
  {
    category: "Storage & Safety",
    question: "Are your meals safe for dogs with sensitive stomachs?",
    answer: "Yes! Fresh, whole food ingredients are often easier to digest than heavily processed kibble. Many dogs with sensitive stomachs thrive on our meals. For severe sensitivities, schedule a consultation so Christie can recommend the best options and ensure a smooth transition."
  },

  // Ingredients & Nutrition
  {
    category: "Ingredients & Nutrition",
    question: "What if my dog has food allergies or sensitivities?",
    answer: "We can help! Many of our recipes are designed with common allergens in mind. Christie can work with you during a consultation to identify trigger ingredients and recommend appropriate meals. We offer various protein options including chicken, beef, and more."
  },
  {
    category: "Ingredients & Nutrition",
    question: "Are your ingredients organic?",
    answer: "We use organic ingredients whenever possible and all ingredients are sustainably sourced. We prioritize human-grade, whole food ingredients without artificial preservatives, colors, or fillers."
  },
  {
    category: "Ingredients & Nutrition",
    question: "Where do your ingredients come from?",
    answer: "We source ingredients from trusted local farms and suppliers in the Blue Ridge Mountains whenever possible. All proteins are USDA-inspected, human-grade quality. We believe in supporting local agriculture and providing complete transparency about what goes into your dog's bowl."
  },
  {
    category: "Ingredients & Nutrition",
    question: "Do your meals contain grains?",
    answer: "We offer both grain-free and grain-inclusive options. Some recipes include wholesome grains like brown rice or oats, which provide valuable nutrients and fiber. Others are grain-free for dogs with sensitivities. Check individual product descriptions or contact us for guidance."
  },
  {
    category: "Ingredients & Nutrition",
    question: "What protein sources do you use?",
    answer: "We use high-quality, human-grade proteins including chicken, beef, turkey, and fish. All proteins are sustainably sourced and USDA-inspected. We can help you choose the right protein for your dog's preferences and health needs."
  },
  {
    category: "Ingredients & Nutrition",
    question: "Do you use any artificial preservatives or additives?",
    answer: "Absolutely not! We never use artificial preservatives, colors, flavors, or fillers. Our meals are preserved naturally through proper handling, refrigeration, and freezing. What you see is what your dog gets—real, whole food ingredients."
  },

  // Shipping & Delivery
  {
    category: "Shipping & Delivery",
    question: "Do you ship nationwide?",
    answer: "Yes! We ship fresh, frozen meals nationwide. Orders are carefully packed with eco-friendly insulation and ice packs to ensure freshness. Free shipping on orders over $165!"
  },
  {
    category: "Shipping & Delivery",
    question: "How is fresh food shipped safely?",
    answer: "We ship all fresh meals frozen in insulated packaging with ice packs. Meals are shipped via overnight or 2-day shipping (depending on your zone) to ensure they arrive fresh. Upon arrival, transfer meals immediately to your refrigerator or freezer."
  },
  {
    category: "Shipping & Delivery",
    question: "What if my order arrives thawed?",
    answer: "Our meals are shipped frozen with sufficient ice packs to stay cold during transit. If your package arrives cool to the touch (not warm), the meals are safe to refrigerate and use. If anything arrives warm or you have concerns, contact us immediately—we'll make it right!"
  },
  {
    category: "Shipping & Delivery",
    question: "Do you offer local pickup or delivery?",
    answer: "Yes! Local customers in the Asheville, NC area can enjoy free local pickup at our farm shop or free local delivery. Visit our contact page for pickup hours and delivery zones."
  },
  {
    category: "Shipping & Delivery",
    question: "How much does shipping cost?",
    answer: "Shipping costs vary by location and weight. We offer free shipping on all orders over $165! Use our shipping calculator at checkout to see exact costs for your area. Local Asheville pickup is always free."
  },

  // Subscriptions & Orders
  {
    category: "Subscriptions & Orders",
    question: "Do you offer subscriptions or recurring delivery?",
    answer: "Yes! Our subscription service allows you to schedule automatic deliveries weekly, bi-weekly, or monthly. Subscriptions include free shipping (on orders $165+), flexible delivery schedules, and easy management through your customer portal. Never run out of fresh food for your pup!"
  },
  {
    category: "Subscriptions & Orders",
    question: "How do I place an order?",
    answer: "You can shop directly on our website! Browse our products, add items to your cart, and checkout securely. You can also contact us directly if you need assistance or have questions about which products are right for your dog."
  },
  {
    category: "Subscriptions & Orders",
    question: "Can I modify or cancel my subscription?",
    answer: "Absolutely! You have full control. Log into your customer portal to skip deliveries, change frequency, swap products, or cancel anytime—no questions asked. We want subscriptions to work for you and your dog."
  },
  {
    category: "Subscriptions & Orders",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) processed securely through our payment system. Subscription customers can save payment information for automatic billing."
  },
  {
    category: "Subscriptions & Orders",
    question: "What is your return/refund policy?",
    answer: "We want your dog to love our food! If you're not satisfied with your purchase, please contact us within 14 days of delivery to discuss a return or refund. Because our products are perishable, we handle returns on a case-by-case basis."
  },

  // Nutrition Services
  {
    category: "Nutrition Services",
    question: "Do you offer nutrition consultations?",
    answer: "Yes! Christie offers personalized nutrition consultations where she'll assess your dog's individual needs, health history, and lifestyle to create a customized nutrition plan. Visit our Nutrition Services page to learn more and book an appointment."
  },
  {
    category: "Nutrition Services",
    question: "What happens during a nutrition consultation?",
    answer: "During a consultation, Christie will review your dog's health history, current diet, activity level, and any concerns you have. She'll provide personalized feeding recommendations, meal plans, and answer all your nutrition questions. Consultations are available via phone, video call, or in-person at our farm shop."
  },
  {
    category: "Nutrition Services",
    question: "How much does a nutrition consultation cost?",
    answer: "We offer a FREE initial consultation to discuss your dog's needs and determine how we can help! Extended consultations and customized meal planning services are also available. Visit our Nutrition Services page for details."
  },
  {
    category: "Nutrition Services",
    question: "Can Christie help with specific health conditions?",
    answer: "Yes! Christie specializes in nutrition for dogs with various health conditions including allergies, digestive issues, obesity, joint problems, kidney disease, and more. While nutrition cannot replace veterinary care, it plays a crucial role in managing many conditions. Christie works alongside your veterinarian to support your dog's health."
  },

  // General
  {
    category: "General",
    question: "Can puppies eat Waggin Meals?",
    answer: "Yes! We have formulations appropriate for puppies and their unique nutritional needs. Puppies require more calories, protein, and specific nutrients for healthy growth. Contact us or schedule a consultation to ensure you're choosing the right meal for your puppy's age and breed."
  },
  {
    category: "General",
    question: "Can senior dogs eat Waggin Meals?",
    answer: "Absolutely! In fact, fresh, whole food nutrition is especially beneficial for senior dogs. We can adjust recipes to support senior-specific needs like joint health, kidney function, and weight management. Schedule a consultation for personalized senior dog nutrition guidance."
  },
  {
    category: "General",
    question: "Are Waggin Meals suitable for all dog breeds?",
    answer: "Yes! Our meals are formulated for dogs of all breeds and sizes. Feeding amounts and specific formulations may vary based on breed size, activity level, and individual needs. We're happy to provide personalized recommendations."
  },
  {
    category: "General",
    question: "How do I contact customer service?",
    answer: "You can reach us through our Contact page, email us directly, or call during business hours. We typically respond within 24 hours. For urgent issues with orders or deliveries, please call us directly for immediate assistance."
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Get unique categories
  const categories: CategoryType[] = ['All', 'Fresh Food & Feeding', 'Storage & Safety', 'Ingredients & Nutrition', 'Shipping & Delivery', 'Subscriptions & Orders', 'Nutrition Services', 'General'];

  // Filter FAQs by category and search
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Everything you need to know about Waggin Meals nutrition
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-full text-[#3c3a47] text-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#a5b5eb]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-[#f8f9fa] px-4 py-8 border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenIndex(null); // Close any open FAQ when switching categories
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-[#a5b5eb] text-white shadow-lg'
                    : 'bg-white text-[#3c3a47] border-2 border-[#e0e0e0] hover:border-[#a5b5eb]'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {category}
                {category !== 'All' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({faqs.filter(faq => faq.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Showing {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
              {searchQuery && <span> matching "{searchQuery}"</span>}
            </p>
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-[#e0e0e0] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No questions found
              </p>
              <p className="text-sm text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Try a different search term or category
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="border-2 border-[#e0e0e0] rounded-lg overflow-hidden hover:border-[#a5b5eb] transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left bg-white hover:bg-[#f8f9fa] transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-[#a5b5eb] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-[#a5b5eb] flex-shrink-0 transition-transform ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#e0e0e0]">
                      <p className="text-[15px] text-[#666666] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Still Have Questions?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We're here to help! Reach out to us directly or schedule a personalized nutrition consultation with Christie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
