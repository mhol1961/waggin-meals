'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What makes Waggin Meals different from other dog food brands?",
    answer: "Waggin Meals offers specialized nutrition formulated by Christie A. Willett, M.A., M.S., a Canine Integrative Animal Nutritionist. Unlike big box companies that use computer-generated responses, we listen to your dog's unique needs. Our meals are made with farm-fresh, sustainably sourced ingredients and are human-grade quality."
  },
  {
    question: "How do I know which meal is right for my dog?",
    answer: "Every dog is different! We recommend using our Feeding Calculator to determine the right portion sizes, and scheduling a nutrition consultation with Christie to discuss your dog's specific needs, health conditions, and dietary preferences. You can also contact us directly for personalized recommendations."
  },
  {
    question: "Are your meals nutritionally complete and balanced?",
    answer: "Yes! All of our fresh food meals are scientifically formulated to meet AAFCO nutritional standards for dogs. They contain the right balance of proteins, fats, carbohydrates, vitamins, and minerals your dog needs for optimal health."
  },
  {
    question: "How should I store Waggin Meals products?",
    answer: "Our fresh meals should be refrigerated immediately upon arrival and used within 4-5 days of opening. You can also freeze portions for up to 3 months. Always thaw frozen meals in the refrigerator, never at room temperature."
  },
  {
    question: "Can I mix Waggin Meals with my dog's current food?",
    answer: "Absolutely! Our meal toppers are specifically designed to enhance your dog's current diet. If you're switching to our complete meals, we recommend a gradual transition over 7-10 days, slowly increasing the amount of Waggin Meals while decreasing the old food."
  },
  {
    question: "Do you offer nutrition consultations?",
    answer: "Yes! Christie offers personalized nutrition consultations where she'll assess your dog's individual needs, health history, and lifestyle to create a customized nutrition plan. Visit our Nutrition Services page to learn more and book an appointment."
  },
  {
    question: "What if my dog has food allergies or sensitivities?",
    answer: "We can help! Many of our recipes are designed with common allergens in mind. Christie can work with you during a consultation to identify trigger ingredients and recommend appropriate meals. We offer various protein options including chicken, beef, and more."
  },
  {
    question: "How long do your products last?",
    answer: "Fresh meals: 4-5 days refrigerated, up to 3 months frozen. Treats and toppers vary by product - check the packaging for specific storage instructions. We always recommend checking the product date and following proper storage guidelines."
  },
  {
    question: "Can puppies eat Waggin Meals?",
    answer: "Yes! We have formulations appropriate for puppies and their unique nutritional needs. Puppies require more calories, protein, and specific nutrients for healthy growth. Contact us or schedule a consultation to ensure you're choosing the right meal for your puppy's age and breed."
  },
  {
    question: "How do I transition my dog to Waggin Meals?",
    answer: "Start slow! Begin by mixing 25% Waggin Meals with 75% of their current food for 2-3 days. Then move to 50/50 for 2-3 days, then 75% Waggin Meals for 2-3 days, and finally 100% Waggin Meals. This gradual transition helps prevent digestive upset."
  },
  {
    question: "Do you ship nationwide?",
    answer: "Shipping availability and details will be announced when our e-commerce platform launches in Phase 2. For now, please contact us directly to discuss order and delivery options for your area."
  },
  {
    question: "What is your return/refund policy?",
    answer: "We want your dog to love our food! If you're not satisfied with your purchase, please contact us within 14 days of delivery to discuss a return or refund. Because our products are perishable, we handle returns on a case-by-case basis."
  },
  {
    question: "Are your ingredients organic?",
    answer: "We use organic ingredients whenever possible and all ingredients are sustainably sourced. We prioritize human-grade, whole food ingredients without artificial preservatives, colors, or fillers."
  },
  {
    question: "Can senior dogs eat Waggin Meals?",
    answer: "Absolutely! In fact, fresh, whole food nutrition is especially beneficial for senior dogs. We can adjust recipes to support senior-specific needs like joint health, kidney function, and weight management. Schedule a consultation for personalized senior dog nutrition guidance."
  },
  {
    question: "How do I place an order?",
    answer: "Currently, orders are being taken through direct contact while our online shop is under development. You can reach out through our Contact page, and we'll help you place your order and arrange delivery or pickup."
  },
  {
    question: "Do you offer subscriptions or recurring delivery?",
    answer: "Subscription options will be available when our e-commerce platform launches in Phase 2. This will include customizable delivery schedules to ensure you never run out of fresh food for your pup!"
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Everything you need to know about Waggin Meals nutrition
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-2 border-[#e0e0e0] rounded-lg overflow-hidden hover:border-[#8FAE8F] transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-[#f8f9fa] transition-colors flex items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-[#3c3a47] pr-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-[#8FAE8F] flex-shrink-0 transition-transform ${
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
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="bg-[#f8f9fa] px-4 py-16">
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
              className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors shadow-lg inline-block"
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
