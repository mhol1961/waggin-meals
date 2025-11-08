'use client';

import { useState } from 'react';

interface FeedingGuide {
  weightRange: string;
  cupsPerDay: { min: number; max: number };
  cupsPerMeal: { min: number; max: number };
  packsPerWeek: { min: number; max: number };
}

const feedingGuides: FeedingGuide[] = [
  {
    weightRange: '5-10 lbs',
    cupsPerDay: { min: 0.5, max: 1 },
    cupsPerMeal: { min: 0.25, max: 0.5 },
    packsPerWeek: { min: 1, max: 2 },
  },
  {
    weightRange: '11-20 lbs',
    cupsPerDay: { min: 1, max: 1.5 },
    cupsPerMeal: { min: 0.5, max: 0.75 },
    packsPerWeek: { min: 2, max: 3 },
  },
  {
    weightRange: '21-30 lbs',
    cupsPerDay: { min: 1.5, max: 2.25 },
    cupsPerMeal: { min: 0.75, max: 1.125 },
    packsPerWeek: { min: 3, max: 4 },
  },
  {
    weightRange: '31-50 lbs',
    cupsPerDay: { min: 2.25, max: 3.75 },
    cupsPerMeal: { min: 1.125, max: 1.875 },
    packsPerWeek: { min: 4, max: 7 },
  },
  {
    weightRange: '51-75 lbs',
    cupsPerDay: { min: 3.75, max: 5.5 },
    cupsPerMeal: { min: 1.875, max: 2.75 },
    packsPerWeek: { min: 7, max: 10 },
  },
  {
    weightRange: '76-100 lbs',
    cupsPerDay: { min: 5.5, max: 7.5 },
    cupsPerMeal: { min: 2.75, max: 3.75 },
    packsPerWeek: { min: 10, max: 14 },
  },
];

function getFeedingGuide(weight: number): FeedingGuide | null {
  if (weight >= 5 && weight <= 10) return feedingGuides[0];
  if (weight >= 11 && weight <= 20) return feedingGuides[1];
  if (weight >= 21 && weight <= 30) return feedingGuides[2];
  if (weight >= 31 && weight <= 50) return feedingGuides[3];
  if (weight >= 51 && weight <= 75) return feedingGuides[4];
  if (weight >= 76 && weight <= 100) return feedingGuides[5];
  return null;
}

function formatFraction(num: number): string {
  if (num === Math.floor(num)) return num.toString();

  const whole = Math.floor(num);
  const decimal = num - whole;

  // Common fractions
  if (Math.abs(decimal - 0.25) < 0.01) return whole > 0 ? `${whole} 1/4` : '1/4';
  if (Math.abs(decimal - 0.33) < 0.01) return whole > 0 ? `${whole} 1/3` : '1/3';
  if (Math.abs(decimal - 0.5) < 0.01) return whole > 0 ? `${whole} 1/2` : '1/2';
  if (Math.abs(decimal - 0.66) < 0.01) return whole > 0 ? `${whole} 2/3` : '2/3';
  if (Math.abs(decimal - 0.75) < 0.01) return whole > 0 ? `${whole} 3/4` : '3/4';
  if (Math.abs(decimal - 0.125) < 0.01) return whole > 0 ? `${whole} 1/8` : '1/8';
  if (Math.abs(decimal - 0.875) < 0.01) return whole > 0 ? `${whole} 7/8` : '7/8';

  return num.toFixed(2);
}

export default function FoodCalculator() {
  const [weight, setWeight] = useState<string>('');
  const [mealsPerDay, setMealsPerDay] = useState<number>(2);
  const [result, setResult] = useState<FeedingGuide | null>(null);

  const handleCalculate = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 5 || weightNum > 100) {
      alert('Please enter a valid weight between 5 and 100 lbs');
      return;
    }

    const guide = getFeedingGuide(weightNum);
    setResult(guide);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-['Abril_Fatface'] text-[#3c3a47] mb-6 text-center">
        Dog Food Calculator
      </h2>

      <div className="space-y-6">
        {/* Weight Input */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
            Dog&apos;s Weight (lbs)
          </label>
          <input
            type="number"
            id="weight"
            min="5"
            max="100"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
            placeholder="Enter weight (5-100 lbs)"
          />
        </div>

        {/* Meals Per Day */}
        <div>
          <label htmlFor="meals" className="block text-sm font-medium text-gray-700 mb-2">
            Meals Per Day
          </label>
          <select
            id="meals"
            value={mealsPerDay}
            onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8F] focus:border-transparent"
          >
            <option value="1">1 meal per day</option>
            <option value="2">2 meals per day</option>
            <option value="3">3 meals per day</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-[#8FAE8F] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#8fa3e3] transition-colors"
        >
          Calculate Feeding Amount
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 p-6 bg-[#e8f4fb] rounded-lg border-2 border-[#8FAE8F]">
            <h3 className="text-xl font-bold text-[#3c3a47] mb-4">
              Feeding Guide for {result.weightRange}
            </h3>

            <div className="space-y-4">
              {/* Cups Per Day */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Cups Per Day:</span>
                  <span className="text-lg font-bold text-[#8FAE8F]">
                    {formatFraction(result.cupsPerDay.min)} - {formatFraction(result.cupsPerDay.max)} cups
                  </span>
                </div>
              </div>

              {/* Cups Per Meal */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Cups Per Meal ({mealsPerDay} meals/day):</span>
                  <span className="text-lg font-bold text-[#8FAE8F]">
                    {formatFraction(result.cupsPerDay.min / mealsPerDay)} - {formatFraction(result.cupsPerDay.max / mealsPerDay)} cups
                  </span>
                </div>
              </div>

              {/* Packs Per Week */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Packs Per Week:</span>
                  <span className="text-lg font-bold text-[#8FAE8F]">
                    {result.packsPerWeek.min} - {result.packsPerWeek.max} packs
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a general guide. Adjust portions based on your dog&apos;s activity level, age, and metabolism. Consult with a veterinary nutritionist for personalized recommendations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reference Image */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-3">Reference Feeding Guide:</p>
        <img
          src="/Feeding Guide.jpg"
          alt="Feeding Guide Chart"
          className="mx-auto rounded-lg shadow-md max-w-full"
        />
      </div>
    </div>
  );
}
