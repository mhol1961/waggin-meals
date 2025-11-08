import Image from 'next/image';
import Link from 'next/link';

export default function DigestiveHealthPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Digestive Health
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Support your dog's gut health through targeted nutrition
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Digestive issues are among the most common health concerns in dogs. From occasional upset stomachs
              to chronic conditions like inflammatory bowel disease (IBD), proper nutrition plays a critical role
              in maintaining digestive health and managing gastrointestinal problems.
            </p>
          </div>
        </div>
      </section>

      {/* Common Digestive Issues */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Common Digestive Issues
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Acute Diarrhea
              </h3>
              <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Sudden onset, often due to dietary indiscretion or stress
              </p>
              <p className="text-[13px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Usually resolves within 24-48 hours with bland diet
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Chronic Diarrhea
              </h3>
              <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Persistent loose stools lasting weeks or months
              </p>
              <p className="text-[13px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                May indicate IBD, parasites, or food sensitivities
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Vomiting
              </h3>
              <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Can be acute or chronic, often food-related
              </p>
              <p className="text-[13px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                May signal food intolerance or gastritis
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                IBD (Inflammatory Bowel Disease)
              </h3>
              <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Chronic inflammation of the GI tract
              </p>
              <p className="text-[13px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Requires long-term dietary management
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Food Sensitivities
              </h3>
              <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Adverse reactions to specific ingredients
              </p>
              <p className="text-[13px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Often protein-based (chicken, beef, dairy)
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Constipation
              </h3>
              <p className="text-[14px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Difficulty or infrequent bowel movements
              </p>
              <p className="text-[13px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Often related to low fiber or dehydration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dietary Strategies */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Nutritional Strategies for Digestive Health
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                High Digestibility
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Choose easily digestible proteins and carbohydrates to reduce GI workload.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Best: Eggs, white fish, chicken breast, turkey, white rice, sweet potato
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Appropriate Fiber
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Balance soluble and insoluble fiber for optimal stool quality.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Soluble fiber (pumpkin, oats) for diarrhea; Insoluble fiber (green beans) for constipation
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Probiotics & Prebiotics
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Support healthy gut microbiome and immune function.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Sources: Plain yogurt, kefir, goat's milk, prebiotic fiber supplements
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Limited Ingredients
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Identify and eliminate trigger foods through elimination diets.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Start with single protein and carb source, gradually add ingredients
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Anti-Inflammatory Foods
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Reduce inflammation in the GI tract with omega-3s and antioxidants.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fish oil, turmeric, ginger, blueberries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bland Diet Protocol */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Bland Diet Protocol for Upset Stomach
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Day 1: Fasting & Hydration
                </h3>
                <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  For mild upset stomach, withhold food for 12-24 hours (water always available)
                </p>
                <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Offer bone broth for hydration and nutrients
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Days 2-3: Simple Bland Diet
                </h3>
                <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  50% lean protein (boiled chicken or turkey) + 50% plain white rice or sweet potato
                </p>
                <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Feed small meals 3-4 times per day
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Days 4-7: Gradual Transition
                </h3>
                <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Slowly reintroduce normal diet by mixing 25% regular food with 75% bland diet, gradually
                  increasing over 5-7 days
                </p>
              </div>

              <div className="bg-[#d1ecf1] border-l-4 border-[#17a2b8] p-4 rounded">
                <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>When to see a vet:</strong> Blood in stool, persistent vomiting, lethargy, loss of appetite
                  for more than 24 hours, or signs of dehydration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gut-Supporting Ingredients */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Gut-Supporting Ingredients
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <div className="text-3xl mb-3">🎃</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Pumpkin
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Soluble fiber regulates digestion; helps with both diarrhea and constipation
              </p>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <div className="text-3xl mb-3">🫚</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Ginger
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Natural anti-nausea properties; reduces inflammation and supports motility
              </p>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <div className="text-3xl mb-3">🍖</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Bone Broth
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Gelatin and collagen support gut lining repair and reduce inflammation
              </p>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <div className="text-3xl mb-3">🥛</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Goat's Milk
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Natural probiotics; easier to digest than cow's milk
              </p>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <div className="text-3xl mb-3">🫒</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Slippery Elm
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Soothes and coats digestive tract; reduces irritation
              </p>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <div className="text-3xl mb-3">🐟</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fish Oil
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Omega-3 fatty acids reduce GI inflammation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Foods to Avoid */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Foods That May Worsen Digestive Issues
          </h2>

          <div className="space-y-4">
            <div className="bg-white border-l-4 border-[#dc3545] p-4 rounded shadow">
              <h3 className="font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ High-Fat Foods
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fatty meats, fried foods, and excessive oils can trigger pancreatitis and diarrhea
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#dc3545] p-4 rounded shadow">
              <h3 className="font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ Dairy Products
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Many dogs are lactose intolerant; cow's milk can cause diarrhea and gas
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#dc3545] p-4 rounded shadow">
              <h3 className="font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ Spicy or Seasoned Foods
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Garlic, onions, and heavy spices can irritate the GI tract
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#dc3545] p-4 rounded shadow">
              <h3 className="font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ Raw Bones (for sensitive dogs)
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Can cause constipation or compaction in dogs with digestive sensitivities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Get Customized Digestive Support
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Schedule a consultation to identify your dog's digestive triggers and create a meal plan that
            supports optimal gut health and digestive function.
          </p>
          <Link
            href="/nutrition-services"
            className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg inline-block"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
