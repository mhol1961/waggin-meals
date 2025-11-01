'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FeedingCalculator() {
  const [dogName, setDogName] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bodyCondition, setBodyCondition] = useState('ideal');
  const [age, setAge] = useState('adult');
  const [showBodyConditionGuide, setShowBodyConditionGuide] = useState(false);
  const [result, setResult] = useState<{
    cupsPerDay: number;
    caloriesPerDay: number;
    feedingSchedule: string;
    personalizedMessage: string;
  } | null>(null);

  // Real-time calculation with useEffect
  useEffect(() => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      setResult(null);
      return;
    }

    // Debounce the calculation slightly for slider movements
    const timeoutId = setTimeout(() => {
      calculateFeeding();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [weight, activityLevel, bodyCondition, age, dogName]);

  const calculateFeeding = () => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
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

    // Generate personalized message
    const name = dogName || 'Your pup';
    let personalizedMessage = '';

    if (bodyCondition === 'ideal' && activityLevel === 'moderate') {
      personalizedMessage = `Great! ${name} is at an ideal weight with moderate activity. This plan will help maintain that perfect balance!`;
    } else if (bodyCondition === 'ideal' && activityLevel === 'high') {
      personalizedMessage = `Awesome! ${name} is in great shape and super active. This high-energy plan will keep ${dogName ? 'them' : 'your pup'} fueled for all those adventures!`;
    } else if (bodyCondition === 'ideal' && activityLevel === 'veryHigh') {
      personalizedMessage = `Wow! ${name} is a true athlete! This plan provides the extra calories needed for working dogs and intense activity.`;
    } else if (bodyCondition === 'overweight' || bodyCondition === 'obese') {
      personalizedMessage = `${name} needs gentle weight management. This reduced-calorie plan will help achieve a healthy weight safely. Monitor progress weekly!`;
    } else if (bodyCondition === 'underweight') {
      personalizedMessage = `${name} needs to gain weight. This plan includes extra calories to help reach a healthy body condition. Consider a vet check too!`;
    } else if (age === 'puppy') {
      personalizedMessage = `Growing ${name} needs lots of nutrition! Puppies require double the calories of adults. Feed frequently throughout the day.`;
    } else if (age === 'senior') {
      personalizedMessage = `Senior dogs like ${name} have different nutritional needs. This plan accounts for reduced metabolism and activity in golden years.`;
    } else if (activityLevel === 'low') {
      personalizedMessage = `${name} has a relaxed lifestyle. This plan provides proper nutrition without excess calories for low-activity dogs.`;
    } else {
      personalizedMessage = `This personalized plan is calculated for ${name}'s unique needs. Monitor weight and adjust as needed!`;
    }

    setResult({
      cupsPerDay: Math.round(cupsPerDay * 10) / 10,
      caloriesPerDay: dailyCalories,
      feedingSchedule,
      personalizedMessage
    });
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Interactive Feeding Calculator
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Answer a few questions and watch as we calculate the perfect meal plan in real-time
          </p>
        </div>
      </section>

      {/* Side-by-Side Quiz + Calculator */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[45%_55%] gap-8">

            {/* LEFT SIDE: Quiz Questions */}
            <div className="space-y-6">
              {/* Question 1: Dog's Name */}
              <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-[#a5b5eb] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    What's your dog's name?
                  </h3>
                </div>
                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Enter your pup's name"
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#a5b5eb] text-[15px] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
                <p className="text-xs text-[#999999] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Let's make this personal!
                </p>
              </div>

              {/* Question 2: Weight */}
              <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-[#a5b5eb] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    How much does {dogName || 'your dog'} weigh?
                  </h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="5"
                    max="150"
                    value={weight || 50}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full h-2 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer accent-[#a5b5eb]"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="50"
                      className="w-24 px-4 py-3 border-2 border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#a5b5eb] text-[15px] text-center font-bold"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    <span className="text-lg text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      pounds
                    </span>
                  </div>
                </div>
              </div>

              {/* Question 3: Life Stage */}
              <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-[#a5b5eb] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    What's {dogName || 'your dog'}'s life stage?
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setAge('puppy')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      age === 'puppy'
                        ? 'border-[#a5b5eb] bg-[#a5b5eb] text-white'
                        : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                    }`}
                  >
                    <div className="text-3xl mb-2">🐕</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Puppy
                    </div>
                    <div className="text-xs mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Under 1 year
                    </div>
                  </button>
                  <button
                    onClick={() => setAge('adult')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      age === 'adult'
                        ? 'border-[#a5b5eb] bg-[#a5b5eb] text-white'
                        : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                    }`}
                  >
                    <div className="text-3xl mb-2">🐶</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Adult
                    </div>
                    <div className="text-xs mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      1-7 years
                    </div>
                  </button>
                  <button
                    onClick={() => setAge('senior')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      age === 'senior'
                        ? 'border-[#a5b5eb] bg-[#a5b5eb] text-white'
                        : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                    }`}
                  >
                    <div className="text-3xl mb-2">🦮</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Senior
                    </div>
                    <div className="text-xs mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      7+ years
                    </div>
                  </button>
                </div>
              </div>

              {/* Question 4: Body Condition */}
              <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-[#a5b5eb] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      4
                    </div>
                    <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Body condition?
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowBodyConditionGuide(!showBodyConditionGuide)}
                    className="text-xs text-[#a5b5eb] underline hover:text-[#8a9fd9]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {showBodyConditionGuide ? 'Hide' : 'View'} Guide
                  </button>
                </div>

                {showBodyConditionGuide && (
                  <div className="mb-4 rounded-lg overflow-hidden border-2 border-[#e0e0e0]">
                    <Image
                      src="/feeding-guide-weight-managment.png"
                      alt="Body condition score guide"
                      width={400}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBodyCondition('underweight')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      bodyCondition === 'underweight'
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-[#e0e0e0] hover:border-orange-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">⚠️</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Underweight
                    </div>
                    <div className="text-xs mt-1 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Ribs easily visible
                    </div>
                  </button>
                  <button
                    onClick={() => setBodyCondition('ideal')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      bodyCondition === 'ideal'
                        ? 'border-green-400 bg-green-50'
                        : 'border-[#e0e0e0] hover:border-green-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">✅</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Ideal Weight
                    </div>
                    <div className="text-xs mt-1 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Slight waist tuck
                    </div>
                  </button>
                  <button
                    onClick={() => setBodyCondition('overweight')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      bodyCondition === 'overweight'
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-[#e0e0e0] hover:border-yellow-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">⚖️</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Overweight
                    </div>
                    <div className="text-xs mt-1 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Rounded waistline
                    </div>
                  </button>
                  <button
                    onClick={() => setBodyCondition('obese')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      bodyCondition === 'obese'
                        ? 'border-red-400 bg-red-50'
                        : 'border-[#e0e0e0] hover:border-red-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">🔴</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Obese
                    </div>
                    <div className="text-xs mt-1 text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      No waist visible
                    </div>
                  </button>
                </div>
              </div>

              {/* Question 5: Activity Level */}
              <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-[#a5b5eb] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    5
                  </div>
                  <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Activity level?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActivityLevel('low')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      activityLevel === 'low'
                        ? 'border-[#a5b5eb] bg-[#a5b5eb] text-white'
                        : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                    }`}
                  >
                    <div className="text-2xl mb-2">🛋️</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Low Activity
                    </div>
                    <div className="text-xs mt-1 opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Mostly relaxing
                    </div>
                  </button>
                  <button
                    onClick={() => setActivityLevel('moderate')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      activityLevel === 'moderate'
                        ? 'border-[#a5b5eb] bg-[#a5b5eb] text-white'
                        : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                    }`}
                  >
                    <div className="text-2xl mb-2">🚶</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Moderate
                    </div>
                    <div className="text-xs mt-1 opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      30-60 min/day
                    </div>
                  </button>
                  <button
                    onClick={() => setActivityLevel('high')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      activityLevel === 'high'
                        ? 'border-[#a5b5eb] bg-[#a5b5eb] text-white'
                        : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏃</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      High Activity
                    </div>
                    <div className="text-xs mt-1 opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      1-2 hours/day
                    </div>
                  </button>
                  <button
                    onClick={() => setActivityLevel('veryHigh')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      activityLevel === 'veryHigh'
                        ? 'border-[#a5b5eb] bg-[#a5b5eb] text-white'
                        : 'border-[#e0e0e0] hover:border-[#a5b5eb]'
                    }`}
                  >
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Very High
                    </div>
                    <div className="text-xs mt-1 opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Working dog 3+ hrs
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Live Results Panel */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {!result ? (
                  // Welcome state
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-6">🐾</div>
                    <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      Let's Calculate!
                    </h3>
                    <p className="text-[15px] text-[#666666] max-w-md mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Answer the questions on the left and watch as we calculate the perfect meal plan for {dogName || 'your pup'} in real-time!
                    </p>
                    <div className="mt-8 p-4 bg-[#f8f9fa] rounded-lg">
                      <p className="text-sm text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Need help? Use the "View Guide" link in question 4 to see body condition examples.
                      </p>
                    </div>
                  </div>
                ) : (
                  // Results view with animation
                  <div className="animate-fadeIn">
                    {/* Personalized Header */}
                    <div className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] p-8">
                      <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        {dogName ? `${dogName}'s` : 'Your Dog\'s'} Meal Plan
                      </h3>
                      <p className="text-sm text-white opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {result.personalizedMessage}
                      </p>
                    </div>

                    {/* Main Results */}
                    <div className="p-8 space-y-6">
                      {/* Cups per Day - Large Display */}
                      <div className="text-center p-6 bg-gradient-to-br from-[#a5b5eb] to-[#c5d4f7] rounded-xl shadow-lg">
                        <div className="text-6xl font-bold text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                          {result.cupsPerDay}
                        </div>
                        <div className="text-lg text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Cups per Day
                        </div>
                        <div className="mt-4 flex justify-center gap-1">
                          {Array.from({ length: Math.ceil(result.cupsPerDay) }).map((_, i) => (
                            <div key={i} className="text-2xl opacity-80">🥘</div>
                          ))}
                        </div>
                      </div>

                      {/* Calories & Schedule Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-[#f8f9fa] rounded-lg">
                          <div className="text-3xl font-bold text-[#a5b5eb] mb-1" style={{ fontFamily: "'Abril Fatface', serif" }}>
                            {result.caloriesPerDay}
                          </div>
                          <div className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Daily Calories
                          </div>
                          {/* Calorie Bar Visualization */}
                          <div className="mt-3 bg-[#e0e0e0] rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] h-full transition-all duration-500"
                              style={{ width: `${Math.min((result.caloriesPerDay / 2000) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-center p-4 bg-[#f8f9fa] rounded-lg">
                          <div className="text-lg font-bold text-[#a5b5eb] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {result.feedingSchedule}
                          </div>
                          <div className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Feeding Frequency
                          </div>
                          <div className="mt-2 text-2xl">⏰</div>
                        </div>
                      </div>

                      {/* Additional Tips based on inputs */}
                      <div className="p-4 bg-blue-50 border-l-4 border-[#a5b5eb] rounded">
                        <p className="text-xs font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Pro Tip:
                        </p>
                        <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {age === 'puppy' && 'Puppies grow fast! Re-check this calculator every 2-3 weeks as their needs change.'}
                          {age === 'senior' && 'Senior dogs may benefit from joint supplements. Consider adding our Mobility Topper!'}
                          {age === 'adult' && bodyCondition === 'ideal' && 'Great job maintaining ideal weight! Monitor weekly and adjust if needed.'}
                          {bodyCondition === 'overweight' && 'Gradual weight loss is safest - aim for 1-2% body weight per week maximum.'}
                          {bodyCondition === 'underweight' && 'Rule out medical causes first. Increase calories gradually over 2-3 weeks.'}
                          {activityLevel === 'veryHigh' && 'Working dogs need extra hydration too! Ensure fresh water is always available.'}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <div className="pt-4 border-t-2 border-[#e0e0e0]">
                        <Link
                          href="/shop"
                          className="block w-full text-center bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] text-white px-6 py-4 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Shop Waggin Meals →
                        </Link>
                        <Link
                          href="/nutrition-services"
                          className="block w-full text-center mt-3 bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#a5b5eb] hover:text-white transition-all"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Get Personalized Consultation
                        </Link>
                      </div>

                      {/* Disclaimer */}
                      <div className="p-3 bg-yellow-50 rounded text-center">
                        <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          <strong>Important:</strong> This is a general guideline. Monitor your dog's weight and adjust as needed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
