import Image from 'next/image';
import Link from 'next/link';

export default function WeightManagementPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Weight Management
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Achieve and maintain your dog's ideal weight naturally
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Over 50% of dogs in the United States are overweight or obese. Excess weight contributes to diabetes,
              joint disease, heart problems, and shortened lifespan. Fresh, whole-food nutrition combined with
              portion control can help your dog achieve and maintain a healthy weight.
            </p>
          </div>
        </div>
      </section>

      {/* Why Weight Matters */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Health Impacts of Excess Weight
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">🦴</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Joint Stress
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Increased risk of arthritis, hip dysplasia, and cruciate ligament tears
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Heart Disease
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Higher blood pressure and increased cardiac workload
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">🍬</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Diabetes Risk
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Obesity leads to insulin resistance and Type 2 diabetes
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">⏳</div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Shorter Lifespan
              </h3>
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Overweight dogs may live up to 2.5 years less than healthy-weight dogs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessing Body Condition */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Assessing Your Dog's Body Condition
          </h2>

          <div className="bg-[#f8f9fa] rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Body Condition Score (BCS) 1-9 Scale
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-[#dc3545] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  1-3
                </div>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Too Thin</strong>
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Ribs, spine, and hip bones easily visible; no body fat; severe waist and abdominal tuck
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#28a745] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  4-5
                </div>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Ideal Weight</strong>
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Ribs easily felt without excess fat; visible waist behind ribs; abdominal tuck present
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#ffc107] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  6-7
                </div>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Overweight</strong>
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Ribs difficult to feel under fat layer; waist barely visible; slight abdominal tuck
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#dc3545] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  8-9
                </div>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Obese</strong>
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Ribs not palpable under heavy fat; no waist; no abdominal tuck; fat deposits on back and tail base
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weight Loss Strategy */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Healthy Weight Loss Strategy
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                1. Calculate Target Calories
              </h3>
              <p className="text-[15px] text-[#666666] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Determine your dog's ideal weight, then calculate daily calories for that weight. Typically reduce
                by 20-30% from maintenance needs.
              </p>
              <div className="bg-[#d1ecf1] border-l-4 border-[#17a2b8] p-3 rounded">
                <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Safe weight loss rate:</strong> 1-2% of body weight per week
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                2. Increase Protein Percentage
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                High-protein meals help preserve muscle mass during weight loss and increase satiety. Aim for 30-40%
                of calories from lean proteins.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                3. Add Low-Calorie Volume
              </h3>
              <p className="text-[15px] text-[#666666] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Incorporate high-fiber, low-calorie vegetables to add volume without excess calories.
              </p>
              <ul className="list-disc list-inside space-y-1 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>Green beans</li>
                <li>Broccoli</li>
                <li>Cauliflower</li>
                <li>Cucumber</li>
                <li>Zucchini</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                4. Control Treat Calories
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Treats should account for no more than 10% of daily calories. Use low-calorie options like carrot
                sticks, cucumber slices, or small pieces of lean meat.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                5. Increase Activity Gradually
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Start with gentle exercise and increase duration gradually. Swimming and walking are excellent
                low-impact options for overweight dogs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Meal Plan */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Sample Weight Loss Meal Framework
          </h2>

          <div className="bg-[#f8f9fa] rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Protein (50% of meal volume)
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Lean chicken breast, turkey, white fish, or 93% lean ground beef
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Vegetables (40% of meal volume)
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Green beans, broccoli, cauliflower, zucchini, carrots (steamed or raw)
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Healthy Fats (10% of meal volume)
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Small amount of fish oil, flaxseed oil, or coconut oil for essential fatty acids
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Supplements
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Balanced vitamin/mineral supplement to ensure nutritional completeness
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Common Weight Loss Mistakes
          </h2>

          <div className="space-y-4">
            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ Reducing Calories Too Drastically
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Severe restriction can slow metabolism and cause muscle loss. Gradual reduction is more sustainable
              </p>
            </div>

            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ Not Accounting for Treats
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Hidden calories from treats, table scraps, and training rewards can sabotage weight loss
              </p>
            </div>

            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ Inconsistent Portions
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Eyeballing portions leads to overfeeding. Use a kitchen scale for accuracy
              </p>
            </div>

            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ No Exercise Plan
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Diet alone is less effective. Combining nutrition with activity yields best results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Get a Personalized Weight Loss Plan
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Schedule a consultation to create a safe, effective weight loss plan tailored to your dog's needs,
            activity level, and health conditions.
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
