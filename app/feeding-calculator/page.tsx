'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FeedingCalculator() {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bodyCondition, setBodyCondition] = useState('ideal');
  const [age, setAge] = useState('adult');
  const [result, setResult] = useState<{
    cupsPerDay: number;
    caloriesPerDay: number;
    feedingSchedule: string;
  } | null>(null);

  const calculateFeeding = () => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    // RER (Resting Energy Requirement) = 70 * (body weight in kg)^0.75
    const weightInKg = weightNum / 2.205;
    const rer = 70 * Math.pow(weightInKg, 0.75);

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      low: 1.2,
      moderate: 1.6,
      high: 2.0,
      veryHigh: 2.5
    };

    // Body condition adjustments
    const bodyConditionMultipliers: { [key: string]: number } = {
      underweight: 1.2,
      ideal: 1.0,
      overweight: 0.8,
      obese: 0.7
    };

    // Age adjustments
    const ageMultipliers: { [key: string]: number } = {
      puppy: 2.0,
      adult: 1.0,
      senior: 0.8
    };

    const totalMultiplier =
      activityMultipliers[activityLevel] *
      bodyConditionMultipliers[bodyCondition] *
      ageMultipliers[age];

    const dailyCalories = Math.round(rer * totalMultiplier);

    // Waggin Meals is approximately 120 calories per cup (estimate)
    const caloriesPerCup = 120;
    const cupsPerDay = dailyCalories / caloriesPerCup;

    // Determine feeding schedule
    let feedingSchedule = '';
    if (weightNum < 20) {
      feedingSchedule = '2-3 times per day';
    } else if (weightNum < 50) {
      feedingSchedule = '2 times per day';
    } else {
      feedingSchedule = '1-2 times per day';
    }

    setResult({
      cupsPerDay: Math.round(cupsPerDay * 10) / 10,
      caloriesPerDay: dailyCalories,
      feedingSchedule
    });
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Feeding Calculator
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Determine the perfect portion size for your dog's unique needs
          </p>
        </div>
      </section>

      {/* Body Condition Guide */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Body Condition Score Guide
          </h2>
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/feeding-guide-weight-managment.png"
              alt="Dog body condition score guide"
              width={699}
              height={692}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-normal text-[#3c3a47] mb-8" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Calculate Your Dog's Daily Feeding Amount
            </h2>

            <div className="space-y-6">
              {/* Weight Input */}
              <div>
                <label htmlFor="weight" className="block text-[15px] font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Your Dog's Current Weight (lbs)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight in pounds"
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#a5b5eb] text-[15px]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>

              {/* Age Selection */}
              <div>
                <label htmlFor="age" className="block text-[15px] font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Life Stage
                </label>
                <select
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#a5b5eb] text-[15px]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="puppy">Puppy (Under 1 year)</option>
                  <option value="adult">Adult (1-7 years)</option>
                  <option value="senior">Senior (7+ years)</option>
                </select>
              </div>

              {/* Body Condition */}
              <div>
                <label htmlFor="bodyCondition" className="block text-[15px] font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Body Condition (See guide above)
                </label>
                <select
                  id="bodyCondition"
                  value={bodyCondition}
                  onChange={(e) => setBodyCondition(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#a5b5eb] text-[15px]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="underweight">Underweight - Ribs, waist, and spine easily visible</option>
                  <option value="ideal">Ideal Weight - Layer of fat covers ribs, slight tuck in waist</option>
                  <option value="overweight">Overweight - Ribs not easily felt, rounded waistline</option>
                  <option value="obese">Obese - Ribs cannot be felt, distended stomach</option>
                </select>
              </div>

              {/* Activity Level */}
              <div>
                <label htmlFor="activityLevel" className="block text-[15px] font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#a5b5eb] text-[15px]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="low">Low - Mostly inactive, little exercise</option>
                  <option value="moderate">Moderate - 30-60 min exercise per day</option>
                  <option value="high">High - 1-2 hours vigorous exercise per day</option>
                  <option value="veryHigh">Very High - Working/sporting dog, 3+ hours per day</option>
                </select>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateFeeding}
                className="w-full bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Calculate Feeding Amount
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-10 p-6 bg-[#f8f9fa] rounded-lg border-2 border-[#a5b5eb]">
                <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Recommended Daily Feeding
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-4xl font-bold text-[#a5b5eb] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      {result.cupsPerDay}
                    </div>
                    <div className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Cups per Day
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-4xl font-bold text-[#a5b5eb] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      {result.caloriesPerDay}
                    </div>
                    <div className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Calories per Day
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-lg font-semibold text-[#a5b5eb] mb-2 mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {result.feedingSchedule}
                    </div>
                    <div className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Feeding Frequency
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <strong className="text-[#3c3a47]">Important:</strong> This is a general guideline. Every dog is unique.
                    Monitor your dog's weight and adjust portions as needed. For personalized nutrition advice,{' '}
                    <a href="/nutrition-services" className="text-[#a5b5eb] underline hover:text-[#8a9fd9]">
                      schedule a consultation
                    </a>{' '}
                    with Christie, our Canine Integrative Animal Nutritionist.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Feeding Tips from Our Nutritionist
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-xl font-semibold text-[#a5b5eb] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Transitioning to Fresh Food
              </h3>
              <p className="text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                When switching to Waggin Meals, gradually transition over 7-10 days. Start with 25% fresh food mixed with current food, increasing by 25% every 2-3 days.
              </p>
            </div>

            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-xl font-semibold text-[#a5b5eb] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Monitoring Your Dog
              </h3>
              <p className="text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Watch for healthy signs: 2-3 firm stools per day, good energy levels, shiny coat, and maintaining ideal body condition. Adjust portions if needed.
              </p>
            </div>

            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-xl font-semibold text-[#a5b5eb] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Storage Guidelines
              </h3>
              <p className="text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Keep Waggin Meals frozen until ready to use. Thaw in refrigerator for 24 hours. Once thawed, use within 3-4 days.
              </p>
            </div>

            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-xl font-semibold text-[#a5b5eb] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Need Personalized Help?
              </h3>
              <p className="text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Every dog is different. For a customized meal plan tailored to your dog's specific needs, book a consultation with Christie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Fresh Food Products */}
      <section className="bg-[#f8f9fa] px-4 py-16 border-t-2 border-[#e0e0e0]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Feed Your Dog Waggin Meals
            </h2>
            <p className="text-[16px] text-[#666666] max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Now that you know how much to feed, try our farm-fresh meals made with human-grade ingredients and expert formulation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Chicken & Sweet Potato */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/products/ChickenandSweetPotatoBowl.jpg"
                  alt="Chicken & Sweet Potato Farm Meal"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Chicken & Sweet Potato Farm Meal
                </h3>
                <p className="text-sm text-[#999999] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  $15.99 | 800g (4 cups)
                </p>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Fresh chicken with sweet potatoes, organic superfoods, and essential supplements for complete nutrition.
                </p>
                <div className="bg-[#f8f9fa] rounded-lg p-3 mb-4">
                  <p className="text-xs text-[#666666] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Why Christie Loves It:
                  </p>
                  <p className="text-[13px] text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "Our most popular meal! Chicken is highly digestible and sweet potatoes provide slow-release energy. Perfect for most dogs."
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="block w-full text-center bg-[#a5b5eb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#8a9fd9] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  View Product →
                </Link>
              </div>
            </div>

            {/* Beef & Sweet Potato */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/products/BeefandSweetPotatoBowl.jpg"
                  alt="Beef & Sweet Potato Farm Meal"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Beef & Sweet Potato Farm Meal
                </h3>
                <p className="text-sm text-[#999999] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  $16.99 | 750g (4 cups)
                </p>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Rich beef protein with sweet potatoes for active dogs. Higher protein and fat for sustained energy.
                </p>
                <div className="bg-[#f8f9fa] rounded-lg p-3 mb-4">
                  <p className="text-xs text-[#666666] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Why Christie Loves It:
                  </p>
                  <p className="text-[13px] text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "Great for active dogs, working breeds, and picky eaters. The beef flavor is irresistible and provides 11% protein."
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="block w-full text-center bg-[#a5b5eb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#8a9fd9] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  View Product →
                </Link>
              </div>
            </div>

            {/* Pup-a-loaf */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/products/PupALoafBoard72res.jpg"
                  alt="Pup-a-loaf"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Pup-a-loaf
                  <span className="ml-2 text-xs bg-[#ffc107] text-[#856404] px-2 py-1 rounded-full">Best Seller</span>
                </h3>
                <p className="text-sm text-[#999999] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  $14.00 | 390g (6 slices)
                </p>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Our best seller! A dog-friendly meatloaf perfect for training or special treats. Easy to slice and portion.
                </p>
                <div className="bg-[#f8f9fa] rounded-lg p-3 mb-4">
                  <p className="text-xs text-[#666666] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Why Christie Loves It:
                  </p>
                  <p className="text-[13px] text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "Perfect for dogs who need smaller portions or as high-value training treats. The loaf format makes portioning a breeze!"
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="block w-full text-center bg-[#a5b5eb] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#8a9fd9] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  View Product →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              View all our fresh food products
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
