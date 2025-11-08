import Image from 'next/image';
import Link from 'next/link';

export default function KidneyHealthPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Kidney Health Nutrition
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Supporting kidney function through thoughtful nutrition
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Kidney disease is one of the most common conditions affecting senior dogs. Proper nutrition plays a
              crucial role in managing kidney disease and supporting remaining kidney function. A thoughtfully
              designed diet can help reduce the workload on the kidneys while providing essential nutrients.
            </p>
          </div>
        </div>
      </section>

      {/* Understanding Kidney Disease */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Understanding Kidney Function
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                🔄
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Filter Waste
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Kidneys remove metabolic waste products from the blood, including urea and creatinine
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                💧
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Maintain Balance
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Regulate electrolytes, blood pressure, and acid-base balance in the body
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                ⚗️
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Produce Hormones
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Create hormones that regulate blood pressure and red blood cell production
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dietary Principles */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Kidney-Friendly Dietary Principles
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Moderate, High-Quality Protein
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Use highly digestible proteins to minimize waste production. Quality over quantity is key.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Best sources: Eggs, fish, lean poultry, small amounts of lean beef
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Reduced Phosphorus
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                High phosphorus can accelerate kidney damage. Limit phosphorus-rich foods.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Avoid: Organ meats, dairy, bone meal, whole grains in large amounts
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Controlled Sodium
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Moderate sodium intake helps manage blood pressure and reduce kidney workload.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Avoid: Processed meats, cheese, high-sodium treats
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Omega-3 Fatty Acids
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Anti-inflammatory properties help protect kidney tissue and reduce progression.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Sources: Fish oil, sardines, salmon
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Increased Hydration
              </h3>
              <p className="text-[15px] text-[#666666] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Moisture is critical. Fresh food provides natural hydration.
              </p>
              <p className="text-[14px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Add: Bone broth, goat's milk, additional water to meals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Meal Components */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Kidney-Supportive Meal Components
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#3c3a47] mb-6 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Recommended Proteins
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Eggs (highly bioavailable, low phosphorus)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    White fish (cod, tilapia)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Chicken breast (skinless, lean)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Turkey (lean, ground or breast)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Rabbit (novel protein, lean)
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#3c3a47] mb-6 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Beneficial Vegetables
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Green beans (low phosphorus, filling)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Cauliflower (vitamin C, low phosphorus)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Bell peppers (antioxidants, low protein)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Cabbage (fiber, low calorie)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#8FAE8F] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Cucumber (hydrating, low nutrient density)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Foods to Avoid */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Foods to Limit or Avoid
          </h2>

          <div className="space-y-4">
            <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 rounded">
              <h3 className="font-semibold text-[#721c24] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ Organ Meats
              </h3>
              <p className="text-[14px] text-[#721c24]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Liver, kidney, and other organs are very high in phosphorus
              </p>
            </div>

            <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 rounded">
              <h3 className="font-semibold text-[#721c24] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ Dairy Products
              </h3>
              <p className="text-[14px] text-[#721c24]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Cheese, milk, and yogurt contain high phosphorus levels
              </p>
            </div>

            <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 rounded">
              <h3 className="font-semibold text-[#721c24] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ Processed Meats & Treats
              </h3>
              <p className="text-[14px] text-[#721c24]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                High sodium content can worsen kidney function and increase blood pressure
              </p>
            </div>

            <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 rounded">
              <h3 className="font-semibold text-[#721c24] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❌ Whole Grains in Large Amounts
              </h3>
              <p className="text-[14px] text-[#721c24]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Brown rice, whole wheat, and oats contain more phosphorus than white rice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="bg-[#d1ecf1] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start">
            <svg className="h-8 w-8 text-[#0c5460] mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-xl font-semibold text-[#0c5460] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Important: Work with a Professional
              </h3>
              <p className="text-[15px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Kidney disease management requires careful monitoring and individualized nutrition plans. Bloodwork
                values (BUN, creatinine, phosphorus, potassium) must guide dietary adjustments. Always work with
                a veterinary nutritionist when managing kidney disease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Get Expert Kidney Disease Support
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Schedule a consultation to create a customized kidney-supportive meal plan based on your dog's current
            bloodwork, stage of disease, and individual needs.
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
