import Link from 'next/link';
import { Check, X, AlertCircle, Heart, Bird, Sparkles } from 'lucide-react';

export default function ChickenProteinPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#5E8C8C] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bird className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Is Chicken Right for Your Dog?
          </h1>
          <p className="text-xl text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Understanding chicken as a protein source and when it's the best choice
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-[17px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong className="text-[#5E8C8C]">Chicken</strong> is the most commonly used protein in commercial dog food—and for good reason. It's lean, affordable, highly digestible, and packed with essential nutrients. However, it's also the #1 food allergen in dogs. Understanding when chicken is beneficial and when to avoid it is crucial for your dog's health.
            </p>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Benefits */}
            <div className="bg-[#F8F5F0] rounded-2xl p-8 border-2 border-[#5E8C8C]">
              <h3 className="text-2xl font-normal text-[#5E8C8C] mb-6 flex items-center gap-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <Check className="w-8 h-8" />
                Benefits of Chicken
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Lean & Low-Fat</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Ideal for weight management and pancreatitis-prone dogs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Highly Digestible</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Gentle on sensitive stomachs (when not allergic)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Rich in B Vitamins</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Especially niacin (B3) and B6 for metabolism</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Complete Amino Acid Profile</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>All essential amino acids for muscle health</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Affordability</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>More accessible than exotic proteins</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Phosphorus & Selenium</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Supports bone health and immune function</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Concerns */}
            <div className="bg-[#F8F5F0] rounded-2xl p-8 border-2 border-[#C97B63]">
              <h3 className="text-2xl font-normal text-[#C97B63] mb-6 flex items-center gap-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <AlertCircle className="w-8 h-8" />
                Potential Concerns
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>#1 Food Allergen in Dogs</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Most common cause of food-related skin and digestive issues</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Overexposure Risk</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Found in most kibbles, treats, and chews—dogs develop sensitivities over time</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Quality Varies Widely</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Factory-farmed chicken may contain antibiotics and hormones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Not a Novel Protein</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Nearly all dogs have been exposed - not useful for elimination diets</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Lower Omega-3 Content</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Less anti-inflammatory fatty acids compared to fish or duck</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nutritional Profile */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Nutritional Profile
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-4 gap-8 text-center mb-8">
              <div>
                <p className="text-4xl font-bold text-[#5E8C8C] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>28-34%</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Protein</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Dry matter basis)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#5E8C8C] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>5-10%</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Fat</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Very lean)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#5E8C8C] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>High</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Niacin</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Vitamin B3)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#5E8C8C] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>High</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Selenium</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Antioxidant)</p>
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] pt-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Key Nutrients in Chicken:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>Niacin (B3):</strong> Energy metabolism and DNA repair</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>Vitamin B6:</strong> Protein metabolism and brain function</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>Selenium:</strong> Thyroid health and antioxidant protection</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>Phosphorus:</strong> Bone development and energy production</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>B12:</strong> Nerve function and red blood cell formation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>Zinc:</strong> Immune system support and wound healing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>Tryptophan:</strong> Mood regulation and sleep quality</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#5E8C8C] mt-0.5" />
                  <span><strong>Choline:</strong> Liver function and brain health</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Chicken */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            When to Choose Chicken
          </h2>

          <div className="space-y-6">
            <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#5E8C8C]">
              <h3 className="text-lg font-semibold text-[#5E8C8C] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Heart className="w-5 h-5" />
                Chicken is Excellent For:
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <span><strong>Pancreatitis Recovery:</strong> Ultra-lean protein minimizes fat intake</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <span><strong>Weight Management:</strong> Low fat, high protein keeps dogs full longer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <span><strong>Senior Dogs:</strong> Easy to digest and gentle on aging digestive systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <span><strong>Puppies (With No Allergies):</strong> Provides lean protein for healthy growth</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <span><strong>Dogs with No Food Sensitivities:</strong> Budget-friendly, nutritious option</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <span><strong>Post-Surgery Recovery:</strong> Highly digestible protein supports healing</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#fff3cd] rounded-xl p-6 border-l-4 border-[#C97B63]">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <AlertCircle className="w-5 h-5" />
                Avoid Chicken If:
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Chronic Itching & Scratching:</strong> Chicken is the #1 allergen - switch immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Recurring Ear Infections:</strong> Often food-related - chicken is usually the culprit</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Hot Spots & Skin Rashes:</strong> Indicate food sensitivity - try novel proteins</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Chronic Diarrhea or Vomiting:</strong> May indicate chicken intolerance</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Elimination Diet Trials:</strong> Use truly novel proteins like venison or rabbit instead</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Red, Inflamed Paws:</strong> Common sign of chicken allergy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Chicken Allergy Signs */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Signs Your Dog May Be Allergic to Chicken
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <p className="text-[15px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Chicken allergies develop over time through repeated exposure. Watch for these symptoms:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#F8F5F0] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#C97B63] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Skin Symptoms
                </h3>
                <ul className="space-y-2 text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Constant scratching and itching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Red, inflamed skin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Hot spots and rashes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Hair loss from scratching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Chronic ear infections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Paw licking and chewing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#F8F5F0] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#C97B63] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Digestive Symptoms
                </h3>
                <ul className="space-y-2 text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Chronic diarrhea</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Soft, loose stools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Vomiting after meals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Excessive gas and bloating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Loss of appetite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Weight loss</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#F8F5F0] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#C97B63] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Behavioral Signs
                </h3>
                <ul className="space-y-2 text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Restlessness and discomfort</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Excessive licking and grooming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Rubbing face on carpet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Head shaking (ear issues)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Decreased activity level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Irritability</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-[#d1ecf1] border-l-4 border-[#5E8C8C] rounded-r-xl p-6">
              <p className="text-[14px] text-[#333333]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <strong>Important:</strong> If you see 3 or more of these symptoms, consider a 6-8 week elimination diet trial with a novel protein. Most dogs show improvement within 2-4 weeks when chicken is removed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Matters */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Source & Quality Matter
          </h2>

          <div className="bg-[#F8F5F0] rounded-2xl p-8">
            <p className="text-[15px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              If your dog tolerates chicken well, quality is crucial. Low-quality chicken can cause issues even in non-allergic dogs.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#5E8C8C] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ✅ Choose:
                </h3>
                <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5E8C8C]">•</span>
                    <span>Organic, free-range chicken</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5E8C8C]">•</span>
                    <span>Hormone and antibiotic-free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5E8C8C]">•</span>
                    <span>Human-grade quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5E8C8C]">•</span>
                    <span>US-sourced poultry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5E8C8C]">•</span>
                    <span>White meat (leaner)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#fff3cd] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ⚠️ Avoid:
                </h3>
                <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Chicken byproducts and meal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Conventional factory-farmed chicken</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Chicken skin (high fat)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Unknown or imported sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Seasoned or processed chicken</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Need Help Determining If Chicken Is Right?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our team can help you identify food sensitivities and create a personalized nutrition plan for your dog.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#5E8C8C] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#4a6e6e] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Chicken Meals
            </Link>
            <Link
              href="/resources/novel-proteins"
              className="bg-white text-[#5E8C8C] border-2 border-[#5E8C8C] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#5E8C8C] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Explore Novel Proteins
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
