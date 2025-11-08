'use client';

import Image from 'next/image';
import Link from 'next/link';
import FoodCalculator from '@/components/food-calculator';

export default function FreshFoodGuidePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Fresh Food Guide for Your Dog's Bowl
          </h1>
          <p className="text-lg text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Everything you need to know about feeding fresh, wholesome foods to your canine companion
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#safe-foods"
              className="bg-white text-[#8FAE8F] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Safe Foods
            </a>
            <a
              href="#toxic-foods"
              className="bg-[#ff6b6b] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ff5252] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Foods to Avoid
            </a>
            <a
              href="#proteins"
              className="bg-white text-[#8FAE8F] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Protein Sources
            </a>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-[#f8f9fa] px-4 py-12 border-b-2 border-[#e0e0e0]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Quick Navigation
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="#calculator" className="bg-[#8FAE8F] text-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">🧮</div>
              <h3 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feeding Calculator
              </h3>
            </a>
            <a href="#produce" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">🥕</div>
              <h3 className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Garden Goodies
              </h3>
            </a>
            <a href="#proteins" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">🍗</div>
              <h3 className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Proteins
              </h3>
            </a>
            <a href="#carbs" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">🍠</div>
              <h3 className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Carbohydrates
              </h3>
            </a>
            <a href="#cheese" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">🧀</div>
              <h3 className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Safe Cheeses
              </h3>
            </a>
            <a href="#power-ups" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Power-Ups
              </h3>
            </a>
            <a href="#toxic-foods" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Toxic Foods
              </h3>
            </a>
          </div>
        </div>
      </section>

      {/* Food Calculator Section */}
      <section id="calculator" className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-normal text-[#333333] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Fresh Food Feeding Calculator
          </h2>
          <p className="text-center text-[16px] text-[#666666] mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Calculate the perfect portion sizes for your dog based on their weight, activity level, and life stage.
          </p>
          <FoodCalculator />
        </div>
      </section>

      {/* Garden Goodies Section */}
      <section id="produce" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Garden Goodies: Fresh Produce for Dogs
          </h2>
          <p className="text-center text-[16px] text-[#666666] mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            These fruits and veggies are nutrient-rich and safe to add to your dog's meals.
          </p>
          <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 mb-8">
            <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Note:</strong> Never use canned products with sodium preservatives.
            </p>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-[#8FAE8F]">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Ingredient
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Key Nutrients
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Benefits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Spinach</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamins A, K, Iron</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Eye health, digestion, red blood cells</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Carrots</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Beta-carotene, Vitamin C</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vision, immunity, heart health</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Green Beans</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Fiber, Vitamin K</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Weight control, heart support</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Apples (no seeds)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamin C, Fiber</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Digestion, heart health</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Blueberries / Cranberries</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Antioxidants</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Urinary tract, anti-aging</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Sweet Potatoes</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Fiber, Vitamins A, C</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Energy, gut regularity</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Pumpkin</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Beta-carotene, Potassium</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Bowel health, immunity</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Zucchini</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamin C, Potassium</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Hydration, digestion</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Bananas (moderate)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Potassium, B6</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Muscle and energy support</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Mango (peeled/pitted)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamins A, C</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Immunity, vision</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Cucumber</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamin K, Potassium</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Cooling, vascular health</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Strawberries</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamin C, Fiber</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Immunity, anti-aging</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Kale (small amounts)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamins A, C, Calcium</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Anti-inflammatory, detox</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Red Potatoes (cooked)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>B6, Fiber</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Energy, digestion</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Pears (no seeds)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamin C, Fiber</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Gut and immune health</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Parsley (flat leaf)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamins C, A</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Kidney support, fresh breath</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Peppers Section */}
          <div className="mt-12 bg-[#e8f4fb] rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Safe Peppers for Dogs: Bell Peppers Only
            </h3>
            <p className="text-[15px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Dogs can safely eat <strong>bell peppers</strong> in moderation. These include:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">🫑</span>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Red Bell Peppers</strong>
                  <span className="text-[#666666] text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}> – Most nutritious; highest in vitamins A and C, beta-carotene, and antioxidants like lycopene.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">🫑</span>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Orange Bell Peppers</strong>
                  <span className="text-[#666666] text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}> – Rich in vitamin A and beta-carotene; supports skin and eye health.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">🫑</span>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Yellow Bell Peppers</strong>
                  <span className="text-[#666666] text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}> – Good source of vitamin C and lutein; supports immune and eye health.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">🫑</span>
                <div>
                  <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Green Bell Peppers</strong>
                  <span className="text-[#666666] text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}> – Least sweet but still beneficial; high in fiber and vitamin C.</span>
                </div>
              </li>
            </ul>
            <div className="bg-red-100 border-l-4 border-red-500 p-4">
              <p className="text-[14px] text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <strong>Avoid spicy peppers</strong> like jalapeños, chili peppers, and habaneros. These contain capsaicin, which can cause digestive upset and even toxicity in dogs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pantry Power-Ups Section */}
      <section id="power-ups" className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Pantry Power-Ups: Functional Additions
          </h2>
          <p className="text-center text-[16px] text-[#666666] mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Add these in small amounts for extra health benefits
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Whole Grains</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Energy and gut health</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Flaxseed</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Omega-3s, anti-inflammatory</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Turmeric</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Joint and heart support</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Thyme / Oregano</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Antimicrobial, immune boost</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Ginger</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Nausea relief, joint health</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Coconut / Olive Oil</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Skin, coat, brain health</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Apple Cider Vinegar (diluted)</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Digestion, immunity</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Calcium Phosphate</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Bone health (vet-approved dosage)</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Vitamin E (sunflower oil)</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Heart and cancer protection</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Eggs (cooked)</h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Muscle and coat support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Cheeses Section */}
      <section id="cheese" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Safe Cheeses for Dogs
          </h2>
          <p className="text-center text-[16px] text-[#666666] mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            In moderation, small amounts
          </p>

          <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
            <table className="w-full bg-white">
              <thead className="bg-[#8FAE8F]">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Cheese Type</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Benefits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Cottage Cheese</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Low in fat and sodium; contains probiotics for gut health.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Mozzarella (plain)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Lower in fat; good source of calcium and protein.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Soft Goat Cheese</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Easier to digest; rich in essential fatty acids.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Cream Cheese (plain)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Good for hiding medication; soft and palatable.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Ricotta</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Mild and lower in salt; contains calcium and protein.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Cheddar (small amounts)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>High-value training treat; rich in calcium and vitamin A.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="text-lg font-semibold text-red-700 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Cheeses to Avoid</h3>
              <ul className="space-y-2 text-[14px] text-red-700">
                <li>• Blue cheese – Contains mold and roquefortine, which can be toxic</li>
                <li>• Cheeses with garlic, onion, or chives – These ingredients are toxic to dogs</li>
                <li>• High-fat or salty cheeses – Can lead to obesity, pancreatitis, or kidney issues</li>
                <li>• Processed cheese slices or spreads – Often contain additives and preservatives</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Benefits of Cheese for Dogs</h3>
              <ul className="space-y-2 text-[14px] text-green-700">
                <li>• <strong>Protein & Calcium</strong> – Supports muscle and bone health</li>
                <li>• <strong>Vitamin A & B12</strong> – Boosts immunity, skin, and nerve function</li>
                <li>• <strong>Training Tool</strong> – High-value reward for obedience training</li>
                <li>• <strong>Medication Helper</strong> – Great for hiding pills</li>
              </ul>
              <p className="text-[13px] text-green-700 mt-4 italic">
                Tip: Always feed cheese in small amounts and watch for signs of lactose intolerance (gas, diarrhea, bloating).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proteins Section */}
      <section id="proteins" className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Animal-Based Proteins
          </h2>
          <p className="text-center text-[16px] text-[#666666] mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Most recommended protein sources for your dog
          </p>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-[#8FAE8F]">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Protein</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Benefits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Chicken</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Lean, digestible, muscle support</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Beef</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Iron-rich, energy boost</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Turkey</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Low-fat, gentle on stomach</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Lamb</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Great for poultry allergies</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Fish (Salmon, Sardines, Mackerel)</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Omega-3s, skin and joints</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Eggs</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Complete protein, coat health</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Duck</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Novel protein for sensitivities</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Venison</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Hypoallergenic, lean</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Rabbit</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Easy to digest</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Pork</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Not recommended</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Carbohydrates Section */}
      <section id="carbs" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Safe Carbohydrates for Dogs
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#8FAE8F] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Starchy Veggies</h3>
              <ul className="space-y-2 text-[14px] text-[#666666]">
                <li>• Sweet potatoes</li>
                <li>• Pumpkin</li>
                <li>• Butternut squash</li>
                <li>• Carrots</li>
              </ul>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#8FAE8F] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Grains (if tolerated)</h3>
              <ul className="space-y-2 text-[14px] text-[#666666]">
                <li>• Brown rice</li>
                <li>• White rice</li>
                <li>• Oatmeal</li>
                <li>• Quinoa</li>
                <li>• Barley</li>
              </ul>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#8FAE8F] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Other Options</h3>
              <ul className="space-y-2 text-[14px] text-[#666666]">
                <li>• Whole wheat pasta (small amounts)</li>
                <li>• Cooked lentils or chickpeas (watch for gas)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Carbs & Veggies to Avoid</h3>
            <p className="text-[14px] text-yellow-800 mb-2">These may cause gas or are unsafe:</p>
            <ul className="grid md:grid-cols-2 gap-2 text-[14px] text-yellow-800">
              <li>• Corn</li>
              <li>• Bread</li>
              <li>• Sugary/Processed Carbs</li>
              <li>• Broccoli</li>
              <li>• Cauliflower</li>
              <li>• Cabbage</li>
              <li>• Brussels Sprouts</li>
              <li>• Peas</li>
              <li>• Black Beans</li>
            </ul>
            <div className="mt-4 bg-white rounded p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Tips to Reduce Gas:</h4>
              <ul className="space-y-1 text-[13px] text-yellow-700">
                <li>✓ Cook veggies (steam or boil)</li>
                <li>✓ Serve small portions</li>
                <li>✓ Introduce gradually</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Toxic Foods Section */}
      <section id="toxic-foods" className="bg-red-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-red-700 mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            ⚠️ Toxic Foods to Avoid
          </h2>
          <p className="text-center text-[16px] text-red-600 mb-8 max-w-3xl mx-auto font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            These are dangerous and should NEVER be fed to your dog
          </p>

          <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
            <table className="w-full bg-white">
              <thead className="bg-red-600">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Food</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Toxin</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Chocolate</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Theobromine</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Seizures, death</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Grapes/Raisins</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Unknown</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Kidney failure</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Onions/Garlic</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Thiosulfates</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Anemia</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Avocado</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Persin</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>GI upset</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Macadamia Nuts</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Unknown</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Vomiting, tremors</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Xylitol</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Sugar alcohol</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Liver failure</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Alcohol</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Ethanol</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Coma</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Cooked Bones</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Physical hazard</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>GI perforation</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Caffeine</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Methylxanthines</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Seizures</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Yeast Dough</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Ethanol, gas</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Gastric rupture</td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Moldy Foods</td>
                  <td className="px-6 py-4 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Mycotoxins</td>
                  <td className="px-6 py-4 text-red-700 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Organ damage</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Important Safety Disclaimer
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <p className="text-[15px] text-[#666666] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feeding a <strong>homemade raw diet</strong> may carry risks, including foodborne illness and bacterial contamination.
                Raw meats can contain harmful pathogens such as <strong>Salmonella</strong>, <strong>E. coli</strong>, and <strong>Listeria</strong>,
                which pose health risks to both pets and humans. To ensure safety and nutritional balance, always consult a qualified nutritionist
                before preparing or feeding raw meals at home.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Pet owners are increasingly drawn to making their own dog food, but doing so without expert guidance can be risky. If you're committed to feeding a homemade diet for your dog(s):
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-[#8FAE8F] mr-2 font-bold">✓</span>
                  <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Work with a nutritionist</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8FAE8F] mr-2 font-bold">✓</span>
                  <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Use recipes that have been professionally formulated and tested</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8FAE8F] mr-2 font-bold">✓</span>
                  <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Include proper supplements to meet all nutrient needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8FAE8F] mr-2 font-bold">✓</span>
                  <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Practice safe food handling to avoid contamination</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Cook for Your Dog?
          </h2>
          <p className="text-lg text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We'll help you design <strong>balanced meals</strong> based on your dog's breed, age, weight, medical needs, and dietary restrictions.
          </p>
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2 text-white text-[15px] mb-6">
              <span className="flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Nationwide service</span>
              <span className="flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Ingredient sourcing guidance</span>
              <span className="flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Personalized meal prep plans</span>
            </div>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#8FAE8F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Book Your Appointment Today
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
