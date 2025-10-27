'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

type ConsultationType = 'comprehensive' | 'free';

interface FormData {
  // Step 1: Your Information
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  state: string;

  // Step 2: About Your Dog
  dogName: string;
  breed: string;
  age: string;
  weight: string;
  gender: 'male' | 'female' | '';
  spayedNeutered: 'yes' | 'no' | '';

  // Step 3: Current Diet
  currentFood: string;
  durationOnDiet: string;
  portionSize: string;
  feedingFrequency: string;

  // Step 4: Health Concerns
  allergies: string;
  sensitivities: string;
  chronicConditions: string;
  medications: string;
  recentVetVisits: string;

  // Step 5: Goals & Preferences
  goals: string;
  consultationType: ConsultationType;
  specialRequests: string;
  preferredFormat: 'zoom' | 'facetime' | 'in-person' | '';
}

export default function NutritionServices() {
  const [candyStoryOpen, setCandyStoryOpen] = useState(false);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [consultationType, setConsultationType] = useState<ConsultationType>('comprehensive');
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    dogName: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    spayedNeutered: '',
    currentFood: '',
    durationOnDiet: '',
    portionSize: '',
    feedingFrequency: '',
    allergies: '',
    sensitivities: '',
    chronicConditions: '',
    medications: '',
    recentVetVisits: '',
    goals: '',
    consultationType: 'comprehensive',
    specialRequests: '',
    preferredFormat: ''
  });

  const openQuestionnaire = (type: ConsultationType) => {
    setConsultationType(type);
    setFormData({ ...formData, consultationType: type });
    setQuestionnaireOpen(true);
    setShowSuccess(false);
  };

  const closeQuestionnaire = () => {
    setQuestionnaireOpen(false);
    setShowSuccess(false);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = (): boolean => {
    // Required fields validation
    return !!(
      formData.ownerName &&
      formData.email &&
      formData.phone &&
      formData.city &&
      formData.state &&
      formData.dogName &&
      formData.breed &&
      formData.age &&
      formData.weight &&
      formData.gender &&
      formData.spayedNeutered &&
      formData.currentFood &&
      formData.durationOnDiet &&
      formData.portionSize &&
      formData.feedingFrequency &&
      formData.goals &&
      formData.preferredFormat
    );
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setShowSuccess(true);
      // TODO: Send to database/email
    }
  };

  return (
    <main className="bg-white">
      {/* Hero Section - Redesigned with Darker Gradient */}
      <section className="relative bg-gradient-to-br from-[#4c51bf] via-[#5a3a8f] to-[#6b46c1] px-4 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-left">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-6">
                <svg className="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-white">Trusted by 500+ Pet Parents</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Expert Canine Nutrition Consultations
              </h1>

              <p className="text-2xl text-white/90 mb-8 font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Personalized, evidence-based dietary support for dogs of all ages and health conditions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="#services"
                  className="inline-flex items-center justify-center bg-white text-[#667eea] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Book Your Consultation →
                </Link>
                <Link
                  href="#meet-christie"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#667eea] transition-all"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Meet Christie
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">M.A., M.S. Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">AAFCO Standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Science-Backed</span>
                </div>
              </div>
            </div>

            {/* Right Side - Image with Floating Cards */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/2025/09/Canine-Nutrtion-Services.webp"
                  alt="Happy healthy dog with fresh food"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 transform hover:scale-110 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#3c3a47]" style={{ fontFamily: "'Abril Fatface', serif" }}>95%</p>
                    <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Success Rate</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-2xl p-6 transform hover:scale-110 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#3c3a47]" style={{ fontFamily: "'Abril Fatface', serif" }}>500+</p>
                    <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Dogs Helped</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section - Redesigned with Colorful Blocks */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Main Intro Block */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-10 mb-12 border border-indigo-100">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Confused About Your Dog's Diet? You're Not Alone.
              </h2>

              <p className="text-lg text-[#3c3a47] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Choosing the right diet for your dog can feel overwhelming. With countless brands, conflicting advice, and complex health needs, it's easy to make mistakes that impact your pet's well-being.
              </p>

              <p className="text-lg text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                At <strong className="text-[#5a3a8f]">WGM Pet Nutrition Co.</strong>, we provide science-backed, personalized nutrition consultations to help you make confident decisions for your dog's health—whether you're managing allergies, chronic conditions, or simply want the best for your furry friend.
              </p>
            </div>
          </div>

          {/* Problem/Solution Grid - Colorful Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🤔', title: 'Conflicting Advice', desc: 'Too many opinions, not enough facts', gradient: 'from-orange-500 to-orange-600' },
              { icon: '⚠️', title: 'Health Concerns', desc: 'Allergies, sensitivities, chronic issues', gradient: 'from-red-500 to-red-600' },
              { icon: '📦', title: 'Brand Confusion', desc: 'Which commercial food is actually good?', gradient: 'from-blue-500 to-blue-600' },
              { icon: '💡', title: 'Need Guidance', desc: 'Want an expert to create a plan', gradient: 'from-green-500 to-green-600' }
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all`}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="#services"
              className="inline-flex items-center bg-[#5a3a8f] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#4c51bf] transition-all hover:scale-105 shadow-lg group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Explore Our Services
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Options */}
      <section id="services" className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Our Consultation Services
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Service Option 1: Comprehensive Consultation */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#6b46c1]">
              <div className="bg-gradient-to-r from-[#5a3a8f] to-[#6b46c1] px-8 py-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-normal text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Comprehensive Canine<br />Nutrition Consultation
                  </h3>
                  <div className="bg-white text-[#5a3a8f] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    MOST POPULAR
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>$395</span>
                  <span className="text-white/90 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>| Zoom, Facetime or In-Person</span>
                </div>
              </div>

              <div className="p-8">
                <p className="text-[15px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  This premium consultation is designed for pet owners who want targeted, evidence-based strategies to optimize their dog's health. Ideal for dogs with chronic conditions, allergies, weight concerns, or those transitioning to a new life stage or feeding protocol.
                </p>

                <h4 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>What's Included:</h4>

                <ul className="space-y-3 mb-6">
                  {[
                    { title: 'Full Nutritional Assessment', desc: 'Evaluation of up to two dogs, including breed-specific needs, age, weight, medical history, and dietary restrictions.' },
                    { title: 'Custom Meal Plan & Recipe Formulation', desc: "Science-based formulation tailored to your dog's unique health profile." },
                    { title: 'Supplement Protocol', desc: 'Evidence-supported supplement recommendations with sourcing guidance.' },
                    { title: 'Meal Preparation Guidance', desc: 'Instructions for cooked, or hybrid diets, including recommended tools and techniques.' },
                    { title: 'Ongoing Support', desc: 'Two follow-up consultations (including a 3-month milestone evaluation) plus continuous email/phone support.' },
                    { title: 'Educational Resources', desc: 'Access to curated recipes, supplement ordering guides, and canine nutrition education materials.' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#6b46c1] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-[#3c3a47] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.title}</p>
                        <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Pre-Consultation Requirements:</p>
                  <ul className="text-xs text-[#666666] space-y-1 list-disc list-inside" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <li>Complete a detailed intake questionnaire</li>
                    <li>Submit relevant veterinary records (allergy testing, labs, photos if applicable)</li>
                    <li>For dogs with complex sensitivities, we recommend the Pet Food & Environmental Intolerance & Imbalances Test</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-amber-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Scheduling & Format:</p>
                  <p className="text-xs text-amber-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Duration: Up to 2 hours for the initial consultation<br />
                    Available: Zoom / Facetime or in-person in Asheville, NC (travel options available)
                  </p>
                  <p className="text-xs font-semibold text-amber-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Optional Travel Fees:</p>
                  <ul className="text-xs text-amber-900 space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <li>• Buncombe & Madison Counties: $50</li>
                    <li>• Hendersonville & Yancey Counties: $75</li>
                    <li>• Macon & Swain Counties: $115</li>
                  </ul>
                </div>

                <button
                  onClick={() => openQuestionnaire('comprehensive')}
                  className="w-full bg-[#5a3a8f] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#6b46c1] transition-colors shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Schedule Now →
                </button>
                <p className="text-center text-xs text-[#999999] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Complete intake quiz to get started
                </p>
              </div>
            </div>

            {/* Service Option 2: Group Class */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#10b981] to-[#34d058] px-8 py-6">
                <h3 className="text-2xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Canine Nutrition<br />Group Class
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>$400</span>
                  <span className="text-white/90 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>4-20 guests | $450 for 21+</span>
                </div>
              </div>

              <div className="p-8">
                <p className="text-[15px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  A fun, educational experience for families, businesses, or community groups. Led by Christie Willett, M.A., M.S., Animal Nutritionist & Integrative Medicine Canine Specialist, this class covers everything from basic diet selection to managing complex health issues.
                </p>

                <h4 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Benefits:</h4>

                <ul className="space-y-2 mb-8">
                  {[
                    'Professional guidance on canine nutrition',
                    'Optional cooking demonstration for a general maintenance diet',
                    'Weight management strategies',
                    'Specialized diets for allergies, kidney disease, or sensitivities',
                    'Life stage nutrition (puppies, seniors, pregnant/nursing dogs)',
                    'Label navigation: Learn to read pet food labels and understand AAFCO standards'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="block w-full text-center bg-[#10b981] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#059669] transition-colors shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Click Here for Inquiries & Quotes →
                </Link>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Service Option 3: Free 15-Minute Consultation */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#fbbf24] to-[#fcd34d] px-8 py-6">
                <h3 className="text-2xl font-normal text-[#3c3a47] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Start Your Dog's Nutrition Journey
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#3c3a47]" style={{ fontFamily: "'Abril Fatface', serif" }}>FREE</span>
                  <span className="text-[#3c3a47]/80 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>15-Minute Session</span>
                </div>
              </div>

              <div className="p-8">
                <p className="text-[15px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Choosing the right fresh food for your dog doesn't have to be overwhelming. Get peace of mind by consulting a qualified nutritionist. Our experts provide personalized guidance based on your dog's unique needs, health history, and your lifestyle.
                </p>

                <h4 className="text-lg font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Why Work with an Animal Nutritionist?</h4>

                <ul className="space-y-2 mb-8">
                  {[
                    "Identify your dog's specific needs",
                    'Evaluate commercial fresh food and cut through marketing claims',
                    'Manage health issues with specialized diet plans',
                    'Ensure a smooth transition to avoid digestive upset'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#fbbf24] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openQuestionnaire('free')}
                  className="w-full bg-[#fbbf24] text-[#3c3a47] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#f59e0b] transition-colors shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Schedule Your Free Session →
                </button>
                <p className="text-center text-xs text-[#999999] mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Complete intake quiz to get started
                </p>
              </div>
            </div>

            {/* Service Option 4: Online Classes (Coming Soon) */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden opacity-75">
              <div className="bg-gradient-to-r from-[#6b7280] to-[#9ca3af] px-8 py-6 relative">
                <div className="absolute top-2 right-2 bg-white text-[#6b7280] px-3 py-1 rounded-full text-xs font-bold">
                  COMING SOON
                </div>
                <h3 className="text-2xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Online Classes
                </h3>
                <p className="text-white/90 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Interactive Learning Platform
                </p>
              </div>

              <div className="p-8">
                <p className="text-[15px] text-[#666666] leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Stay tuned for interactive online courses on canine nutrition and meal prep. Our comprehensive digital learning platform will provide you with expert knowledge at your own pace.
                </p>

                <div className="bg-[#f8f9fa] rounded-lg p-6 mb-8 text-center">
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Be the first to know when our online courses launch!
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="block w-full text-center bg-[#6b7280] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#4b5563] transition-colors shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Join Waitlist →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Christie Section */}
      <section id="meet-christie" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <Image
                src="/images/Christy-holding-black-dog.jpg"
                alt="Christie Willett with dog"
                width={600}
                height={800}
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>

            <div>
              <h2 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Meet Christie Willett
              </h2>
              <p className="text-sm text-[#a5b5eb] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                M.A., M.S. | Animal Nutritionist & Integrative Medicine Canine Specialist
              </p>
              <p className="text-[15px] text-[#666666] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Christie, the heart behind <strong>Waggin Meals Pet Nutrition Co.</strong>, is a professionally trained nutritionist with advanced degrees, including a <strong>Master of Arts (M.A.) in Animal Nutrition and Animal Feed</strong>.
              </p>
              <p className="text-[15px] text-[#666666] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                With a deep commitment to animal well-being, she provides personalized meal planning and delivers science-backed nutrition guidance to adoption agencies and pet parents to create customized meal plans that truly make a difference.
              </p>
              <p className="text-[15px] text-[#666666] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Christie is currently pursuing her PhD on the chemistry of obesity, stress, gerodietic, and animal feed in canines. Her Waggin Meals brand of products is formulated in our farm kitchen using evidence-based canine nutrition practices.
              </p>
              <p className="text-[15px] text-[#666666] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                She continues to fuel Waggin' Meals with innovation, compassion, and a mission to nourish every bowl, one pet at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-8" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Real Results: Candy's Journey to Better Health
          </h2>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => setCandyStoryOpen(!candyStoryOpen)}
              className="w-full px-8 py-6 flex items-center justify-between bg-gradient-to-r from-[#5a3a8f] to-[#6b46c1] hover:from-[#4c51bf] hover:to-[#5a3a8f] transition-colors"
            >
              <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Read Candy's Success Story
              </h3>
              {candyStoryOpen ? (
                <ChevronUp className="w-6 h-6 text-white" />
              ) : (
                <ChevronDown className="w-6 h-6 text-white" />
              )}
            </button>

            {candyStoryOpen && (
              <div className="px-8 py-8 space-y-6">
                {/* Before Photo */}
                <div className="mb-6">
                  <div className="relative rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/Candy Before Photo.jpg"
                      alt="Candy before nutrition consultation"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Before
                    </div>
                  </div>
                  <p className="text-sm text-[#666666] italic mt-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Candy struggled with chronic digestive issues, low energy, and a dull coat before her consultation with Christie.
                  </p>
                </div>

                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-[15px] text-[#666666] leading-relaxed italic border-l-4 border-[#6b46c1] pl-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  "Christie's expertise transformed Candy's health completely. Within just a few weeks on the customized meal plan, we saw dramatic improvements in her energy levels, coat quality, and digestive health. I can't thank Christie enough for her knowledge and ongoing support!"
                </blockquote>

                <div className="bg-[#f8f9fa] rounded-lg p-6">
                  <h4 className="font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Clinical Summary:</h4>
                  <ul className="space-y-2 text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <li>• <strong>Before:</strong> Chronic digestive issues, low energy, dull coat</li>
                    <li>• <strong>Intervention:</strong> Custom meal plan with targeted supplements</li>
                    <li>• <strong>Results:</strong> 90% reduction in digestive issues within 3 weeks</li>
                    <li>• <strong>Long-term:</strong> Sustained health improvements, increased vitality, shiny coat</li>
                  </ul>
                </div>

                <div className="bg-[#e8f4fb] rounded-lg p-6">
                  <h4 className="font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Candy's Safe Food List:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div>
                      <p className="font-semibold text-[#3c3a47] mb-2">Proteins:</p>
                      <ul className="space-y-1">
                        <li>• Grass-fed beef</li>
                        <li>• Wild-caught salmon</li>
                        <li>• Organic turkey</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-[#3c3a47] mb-2">Vegetables & Grains:</p>
                      <ul className="space-y-1">
                        <li>• Sweet potatoes</li>
                        <li>• Organic spinach</li>
                        <li>• Quinoa</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-[#4c51bf] via-[#5a3a8f] to-[#6b46c1] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Give Your Dog the Nutrition They Deserve?
          </h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Take the first step toward optimal health for your furry companion. Our expert nutritionists are here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#services"
              className="bg-white text-[#5a3a8f] px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Book Now →
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#5a3a8f] transition-colors inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us for Details →
            </Link>
          </div>
        </div>
      </section>

      {/* Consultation Questionnaire Modal */}
      {questionnaireOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 relative">
            {/* Close Button */}
            <button
              onClick={closeQuestionnaire}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close questionnaire"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#5a3a8f] to-[#6b46c1] px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {consultationType === 'comprehensive'
                  ? 'Comprehensive Consultation Questionnaire'
                  : 'Free 15-Minute Consultation Questionnaire'}
              </h2>
              <p className="text-white/90 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Please complete all required fields below
              </p>
            </div>

            {/* Success Message */}
            {showSuccess ? (
              <div className="px-8 py-12 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Thank You!
                  </h3>
                  <p className="text-[15px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Your consultation request has been submitted successfully. Christie will review your information and reach out within 24-48 hours to schedule your appointment.
                  </p>
                  <button
                    onClick={closeQuestionnaire}
                    className="bg-[#5a3a8f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6b46c1] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Form Content - Single Scrollable Page */}
                <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-8">

                    {/* Section 1: Your Information */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-300 pb-3">
                        <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Your Information
                        </h3>
                        <p className="text-sm text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Let's start with your contact details so we can reach out to schedule your consultation.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Your Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.ownerName}
                          onChange={(e) => updateFormData('ownerName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="John Smith"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="john@example.com"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="(555) 123-4567"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                            placeholder="Asheville"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => updateFormData('state', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                            placeholder="NC"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: About Your Dog */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-300 pb-3">
                        <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          About Your Dog
                        </h3>
                        <p className="text-sm text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Tell us about your furry friend so we can create the perfect nutrition plan.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Dog's Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.dogName}
                          onChange={(e) => updateFormData('dogName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="Max"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Breed <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.breed}
                          onChange={(e) => updateFormData('breed', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="Golden Retriever (or Mixed)"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Age <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.age}
                            onChange={(e) => updateFormData('age', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                            placeholder="5 years"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Weight <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.weight}
                            onChange={(e) => updateFormData('weight', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                            placeholder="60 lbs"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              value="male"
                              checked={formData.gender === 'male'}
                              onChange={(e) => updateFormData('gender', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Male</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              value="female"
                              checked={formData.gender === 'female'}
                              onChange={(e) => updateFormData('gender', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Female</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Spayed/Neutered? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              value="yes"
                              checked={formData.spayedNeutered === 'yes'}
                              onChange={(e) => updateFormData('spayedNeutered', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Yes</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              value="no"
                              checked={formData.spayedNeutered === 'no'}
                              onChange={(e) => updateFormData('spayedNeutered', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>No</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Current Diet */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-300 pb-3">
                        <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Current Diet
                        </h3>
                        <p className="text-sm text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Understanding your dog's current diet helps us create a better nutrition plan.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Current Food Brand & Type <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.currentFood}
                          onChange={(e) => updateFormData('currentFood', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={3}
                          placeholder="e.g., Blue Buffalo Chicken & Brown Rice, homemade meals, raw diet, etc."
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          How Long on Current Diet? <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.durationOnDiet}
                          onChange={(e) => updateFormData('durationOnDiet', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="e.g., 6 months, 2 years"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Portion Size Per Meal <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.portionSize}
                          onChange={(e) => updateFormData('portionSize', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="e.g., 2 cups, 1.5 cups"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Feeding Frequency <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.feedingFrequency}
                          onChange={(e) => updateFormData('feedingFrequency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          placeholder="e.g., Twice daily (morning and evening)"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>
                    </div>

                    {/* Section 4: Health Concerns */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-300 pb-3">
                        <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Health Concerns
                        </h3>
                        <p className="text-sm text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Share any health issues or concerns. This information helps us provide the best recommendations.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Known Allergies
                        </label>
                        <textarea
                          value={formData.allergies}
                          onChange={(e) => updateFormData('allergies', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={2}
                          placeholder="e.g., chicken, wheat, environmental allergens"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Food Sensitivities or Intolerances
                        </label>
                        <textarea
                          value={formData.sensitivities}
                          onChange={(e) => updateFormData('sensitivities', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={2}
                          placeholder="e.g., upset stomach with beef, gas with dairy"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Chronic Health Conditions
                        </label>
                        <textarea
                          value={formData.chronicConditions}
                          onChange={(e) => updateFormData('chronicConditions', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={2}
                          placeholder="e.g., arthritis, kidney disease, diabetes, obesity"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Current Medications & Supplements
                        </label>
                        <textarea
                          value={formData.medications}
                          onChange={(e) => updateFormData('medications', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={2}
                          placeholder="List all medications, supplements, and dosages"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Recent Veterinary Visits
                        </label>
                        <textarea
                          value={formData.recentVetVisits}
                          onChange={(e) => updateFormData('recentVetVisits', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={2}
                          placeholder="e.g., Annual checkup last month - all clear"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>
                    </div>

                    {/* Section 5: Goals & Preferences */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-300 pb-3">
                        <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Goals & Preferences
                        </h3>
                        <p className="text-sm text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Tell us what you hope to achieve and how you'd like to schedule your consultation.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          What Are Your Main Goals? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.goals}
                          onChange={(e) => updateFormData('goals', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={4}
                          placeholder="e.g., Improve digestion, manage weight, switch to fresh food, address allergies, optimize overall health"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Preferred Consultation Format <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-[#5a3a8f] hover:bg-purple-50 transition-colors">
                            <input
                              type="radio"
                              value="zoom"
                              checked={formData.preferredFormat === 'zoom'}
                              onChange={(e) => updateFormData('preferredFormat', e.target.value)}
                              className="mr-3"
                            />
                            <span className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Zoom</span>
                          </label>
                          <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-[#5a3a8f] hover:bg-purple-50 transition-colors">
                            <input
                              type="radio"
                              value="facetime"
                              checked={formData.preferredFormat === 'facetime'}
                              onChange={(e) => updateFormData('preferredFormat', e.target.value)}
                              className="mr-3"
                            />
                            <span className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>FaceTime</span>
                          </label>
                          <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-[#5a3a8f] hover:bg-purple-50 transition-colors">
                            <input
                              type="radio"
                              value="in-person"
                              checked={formData.preferredFormat === 'in-person'}
                              onChange={(e) => updateFormData('preferredFormat', e.target.value)}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <span className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>In-Person (Asheville, NC area)</span>
                              <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Travel fees may apply based on location
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Any Special Requests or Additional Information?
                        </label>
                        <textarea
                          value={formData.specialRequests}
                          onChange={(e) => updateFormData('specialRequests', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5a3a8f] focus:ring-2 focus:ring-[#5a3a8f]/20"
                          rows={3}
                          placeholder="Any additional details you'd like Christie to know before your consultation..."
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Submit Button */}
                <div className="px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={!validateForm()}
                    className={`w-full px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
                      validateForm()
                        ? 'bg-[#5a3a8f] text-white hover:bg-[#6b46c1] shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Submit Consultation Request
                  </button>
                  {!validateForm() && (
                    <p className="text-xs text-red-500 text-center mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Please fill in all required fields marked with *
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
