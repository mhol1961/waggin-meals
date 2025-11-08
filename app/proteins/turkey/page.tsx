import Link from 'next/link';
import { Check, Bird, Sparkles, Heart, AlertCircle } from 'lucide-react';

export default function TurkeyProteinPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#C97B63] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bird className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Turkey?
          </h1>
          <p className="text-xl text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            The lean, hypoallergenic alternative to chicken
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-[17px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong className="text-[#C97B63]">Turkey</strong> offers all the benefits of chicken—lean protein, easy digestibility, and complete nutrition—without being as common of an allergen. For dogs who can't tolerate chicken but need a lean, affordable protein source, turkey is often the perfect solution. It's especially valuable for dogs with food sensitivities who still need a gentle, low-fat protein.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="bg-[#F8F5F0] rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-normal text-[#C97B63] mb-6 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Why Choose Turkey Over Chicken?
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C97B63]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#C97B63]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Less Allergenic</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Dogs develop fewer allergies to turkey than chicken</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C97B63]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#C97B63]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Less Common Exposure</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Not found in as many treats and kibbles as chicken</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C97B63]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#C97B63]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Similar Benefits to Chicken</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Lean, digestible, and nutritious—without the allergy risk</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C97B63]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#C97B63]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Rich in Tryptophan</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Natural calming amino acid for anxious dogs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C97B63]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#C97B63]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Higher in Certain B Vitamins</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>More B3 and B6 than chicken per serving</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C97B63]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#C97B63]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Good Alternative Protein</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Great for protein rotation diets</p>
                  </div>
                </div>
              </div>
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
                <p className="text-4xl font-bold text-[#C97B63] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>29-35%</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Protein</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Dry matter basis)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#C97B63] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>5-8%</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Fat</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Very lean)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#C97B63] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>High</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Niacin</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Vitamin B3)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#C97B63] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>High</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Tryptophan</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Calming amino)</p>
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] pt-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Key Nutrients in Turkey:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>Tryptophan:</strong> Promotes calmness and better sleep</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>Niacin (B3):</strong> Energy metabolism and skin health</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>Vitamin B6:</strong> Immune function and brain health</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>Selenium:</strong> Antioxidant and thyroid support</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>Phosphorus:</strong> Bone health and energy production</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>Zinc:</strong> Skin health and immune support</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>B12:</strong> Nerve health and red blood cells</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C97B63] mt-0.5" />
                  <span><strong>Iron:</strong> Oxygen transport and energy levels</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#d1ecf1] border-l-4 border-[#C97B63] rounded-r-xl p-6">
              <p className="text-[14px] text-[#333333]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <strong>Tryptophan Highlight:</strong> Turkey contains higher levels of tryptophan than most meats, which converts to serotonin in the body—helping anxious, reactive, or hyperactive dogs feel calmer and more balanced.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Benefits */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Complete Benefits of Turkey
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Digestive Health */}
            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Heart className="w-5 h-5" />
                Digestive Health
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Highly digestible lean protein</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Gentle on sensitive stomachs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Less likely to cause digestive upset</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Low-fat content ideal for pancreatitis</span>
                </li>
              </ul>
            </div>

            {/* Weight Management */}
            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Sparkles className="w-5 h-5" />
                Weight Management
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Very low in fat (5-8%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>High protein keeps dogs satisfied</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Supports lean muscle mass</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Excellent for overweight dogs</span>
                </li>
              </ul>
            </div>

            {/* Allergy Management */}
            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <AlertCircle className="w-5 h-5" />
                Allergy Management
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Less allergenic than chicken</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Good for protein rotation diets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Lower exposure risk than beef/chicken</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Alternative for chicken-sensitive dogs</span>
                </li>
              </ul>
            </div>

            {/* Mental Health & Behavior */}
            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Bird className="w-5 h-5" />
                Mental Health & Behavior
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Tryptophan promotes calmness</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Helps anxious and reactive dogs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Supports better sleep quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span>Natural mood stabilization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Turkey */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            When Turkey Is the Perfect Choice
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="border-l-4 border-[#C97B63] pl-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Dogs with Chicken Allergies
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Turkey provides the same lean, digestible benefits as chicken without triggering allergic reactions. Most chicken-allergic dogs tolerate turkey beautifully.
                </p>
              </div>

              <div className="border-l-4 border-[#C97B63] pl-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Anxious & Reactive Dogs
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  The high tryptophan content makes turkey excellent for dogs with anxiety, reactivity, hyperactivity, or stress-related behaviors. Many owners report calmer, more balanced dogs within 2-3 weeks.
                </p>
              </div>

              <div className="border-l-4 border-[#C97B63] pl-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Pancreatitis-Prone Dogs
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  With only 5-8% fat content, turkey is one of the leanest proteins available. It's perfect for dogs recovering from pancreatitis or managing chronic pancreatic sensitivity.
                </p>
              </div>

              <div className="border-l-4 border-[#C97B63] pl-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Weight Management Programs
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  The combination of low fat and high protein makes turkey ideal for overweight dogs. It provides satiety without excess calories, supporting healthy weight loss.
                </p>
              </div>

              <div className="border-l-4 border-[#C97B63] pl-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Senior Dogs
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Easy to digest, gentle on aging digestive systems, and the tryptophan helps senior dogs rest better. The B vitamins support cognitive function.
                </p>
              </div>

              <div className="border-l-4 border-[#C97B63] pl-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Protein Rotation Diets
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  For dogs on rotation protocols, turkey is an excellent alternative protein to prevent overexposure to any single protein source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turkey vs Chicken Comparison */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Turkey vs. Chicken: Side by Side
          </h2>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#C97B63] text-white">
                    <th className="px-6 py-4 text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>Feature</th>
                    <th className="px-6 py-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Turkey</th>
                    <th className="px-6 py-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Chicken</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Allergy Risk</td>
                    <td className="px-6 py-4 text-center text-[#8FAE8F] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Lower</td>
                    <td className="px-6 py-4 text-center text-[#C97B63] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Higher (#1 allergen)</td>
                  </tr>
                  <tr className="border-b border-[#e0e0e0] bg-[#f8f9fa]">
                    <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Protein Content</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>29-35%</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>28-34%</td>
                  </tr>
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Fat Content</td>
                    <td className="px-6 py-4 text-center text-[#8FAE8F] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>5-8% (leaner)</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>5-10%</td>
                  </tr>
                  <tr className="border-b border-[#e0e0e0] bg-[#f8f9fa]">
                    <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Tryptophan</td>
                    <td className="px-6 py-4 text-center text-[#8FAE8F] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Higher</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Moderate</td>
                  </tr>
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Market Exposure</td>
                    <td className="px-6 py-4 text-center text-[#8FAE8F] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Less common</td>
                    <td className="px-6 py-4 text-center text-[#C97B63] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Very common</td>
                  </tr>
                  <tr className="border-b border-[#e0e0e0] bg-[#f8f9fa]">
                    <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Digestibility</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Excellent</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Excellent</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Best For</td>
                    <td className="px-6 py-4 text-center text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Allergies, anxiety, pancreatitis, weight loss
                    </td>
                    <td className="px-6 py-4 text-center text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Dogs with no allergies, budget-conscious
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Try Turkey for Your Dog?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our turkey meals use human-grade, hormone-free turkey from US farms. Gently cooked and perfectly balanced for optimal nutrition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#C97B63] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#b3664d] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Turkey Meals
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#C97B63] border-2 border-[#C97B63] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#C97B63] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Get Custom Plan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
