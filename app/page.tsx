"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, CheckCircle2, Award, FlaskConical, UtensilsCrossed, HeartPulse, Calculator, ClipboardList, MessageCircle, ChevronDown, Menu, ShieldCheck, Stethoscope, Leaf, Mail, Phone, Star, ArrowRight, Gift } from 'lucide-react';

const rotatingProblems = [
  'Dog Allergies & Sensitivities',
  'Dog Digestive Problems',
  'Dog Weight Management',
  'Dog Chronic Conditions',
  'Dog Picky Eating & Feeding Behaviors',
];

const heroBullets = [
  'Education That Empowers: Discover expert insights most dog owners never learn—like how to manage feeding behaviors and make meals irresistible for selective eaters.',
  'Expertly Formulated Diets: Choose from our carefully designed whole-food collections for optimal health and flavor.',
  'Custom Solutions for Special Needs: Custom diet plans based on health conditions and feeding habits.',
];

const quickAssessmentQuestions = [
  {
    id: 'primary_concern',
    question: 'What is your primary concern?',
    options: ['Digestive health', 'Skin/coat issues', 'Weight management', 'Energy levels', 'Food allergies', 'Other'],
  },
  {
    id: 'current_diet',
    question: 'What does your dog currently eat?',
    options: ['Kibble only', 'Wet food', 'Mix of kibble & wet', 'Raw diet', 'Home-cooked', 'Not sure'],
  },
  {
    id: 'vet_diagnosis',
    question: 'Has your vet diagnosed any conditions?',
    options: ['Yes, diagnosed', 'Tests done, no answers', 'No diagnosis yet', 'Not applicable'],
  },
  {
    id: 'tried_solutions',
    question: 'What have you already tried?',
    options: ['Changed food brands', 'Medications', 'Supplements', 'Special diet', 'Nothing yet', 'Multiple things'],
  },
  {
    id: 'urgency',
    question: 'How urgent is your need?',
    options: ['Very urgent', 'Moderately urgent', 'Looking to improve', 'Just exploring'],
  },
];

const services = [
  {
    icon: FlaskConical,
    tag: 'Testing',
    title: 'Microbiome Analysis',
    description: 'Comprehensive gut health testing with visual palette reports you can share with your vet.',
    cta: 'Learn More',
    href: '/nutrition-services',
    accent: '#8FAE8F',
  },
  {
    icon: UtensilsCrossed,
    tag: 'Meals',
    title: 'Custom Fresh Food',
    description: 'Small-batch, chef-crafted meals tailored to your dog\'s unique nutritional needs.',
    cta: 'Browse Menu',
    href: '/shop',
    accent: '#5E8C8C',
  },
  {
    icon: HeartPulse,
    tag: 'Consulting',
    title: 'Expert Consultation',
    description: 'Personalized nutrition plans with ongoing support from our dual-degreed nutrition specialist.',
    cta: 'Book Now',
    href: '/contact-expert',
    accent: '#C97B63',
  },
];

const testimonials = [
  {
    name: 'Dawn H.',
    dogName: 'Kane',
    dogPhoto: '/images/Kane.jpg',
    text: 'Christie, thank you for everything you\'ve done! Before you, we had tried everything—even spent thousands at the vet and worked with another online company where we only talked to a computer. You personally spoke with us, explained a clear step-by-step process, and even answered our call while on vacation in Ireland! Now Kane is thriving—no more diarrhea or vomiting—and he absolutely loves mealtime!',
  },
  {
    name: 'Jason H.',
    dogName: 'Mango',
    dogPhoto: '/images/Mango.jpg',
    text: 'Mango gets excited every time a Waggin\' Meals box arrives—and loves the surprises inside! We appreciate being able to speak directly with the team and make adjustments as needed. Knowing that as Mango grows, Christie and her staff will customize his diet to match his changing needs gives us complete peace of mind.',
  },
  {
    name: 'Cathy & Nicole',
    dogName: 'Imagie',
    dogPhoto: '/images/Rewivew 3 image.jpg',
    text: 'Your food and professional guidance have made a world of difference for our pups! They absolutely love every meal, and your expert advice has been invaluable. We\'re so grateful we met you and could benefit from your knowledge and experience. Thank you for sharing your expertise and creating such an amazing product!',
  },
  {
    name: 'Michael & Lois',
    dogName: null,
    dogPhoto: null,
    text: 'We booked a personal consultation with Christie to learn how to cook for our dog. She took the time to review everything—recommended specific tests, analyzed lab results, and even assessed photos of her skin and stool. Christie discovered that our dog\'s current food and shampoo were causing severe skin issues and designed a limited, hypoallergenic diet tailored to her needs. Thanks to her expertise, we finally have hope.',
  },
];

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Pet Nutrition Services',
    dropdown: [
      { label: 'Nutrition Consultation ($395)', href: '/nutrition-services' },
      { label: 'Food Sensitivity Testing', href: '/food-sensitivities' },
      { label: 'Supplementation Guide', href: '/supplementation' },
    ]
  },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Fresh Food Feeding Guide', href: '/guides/fresh-food-guide' },
      { label: 'Feeding Calculator', href: '/feeding-calculator' },
      { label: 'Free PDF Guides', href: '/resources' },
      { label: 'Feeding Made Simple', href: '/feeding-made-simple' },
      { label: 'Recommended Products', href: '/recommended-products' },
      { label: 'Pet Nutrition Insights', href: '/blog' },
      { label: 'Events Calendar', href: '/events' },
    ]
  },
  {
    label: 'Nutrition Topics',
    dropdown: [
      { label: 'Puppies', href: '/puppies' },
      { label: 'Weight Management', href: '/weight-management' },
      { label: 'Kidney Health', href: '/kidney-health' },
      { label: 'Digestive Health', href: '/digestive-health' },
    ]
  },
  {
    label: 'Shop',
    dropdown: [
      { label: 'Shop All Products', href: '/shop' },
      { label: 'Bundles & Save', href: '/bundles' },
      { label: 'Collections', href: '/collections' },
    ]
  },
  {
    label: 'Success Stories',
    dropdown: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Testimonials', href: '/testimonials' },
    ]
  },
];

const faqs = [
  { question: 'What is included in a consultation?', answer: 'Comprehensive health assessment, custom meal plan, supplement recommendations, and ongoing support.' },
  { question: 'How does microbiome testing work?', answer: 'Simple at-home sample collection, lab analysis, and detailed palette visualization of your dog\'s gut health.' },
  { question: 'Do you ship nationwide?', answer: 'Yes! Fresh meals ship weekly. Local delivery available in Portland metro area.' },
  { question: 'Can you work with my vet?', answer: 'Absolutely! We provide vet-ready documentation and collaborate with your veterinary team.' },
];

export default function LavenderLuxeHomepage() {
  const [showModal, setShowModal] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);

  // Calculator state
  const [dogWeight, setDogWeight] = useState('');
  const [dogAge, setDogAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);
  const [feedingGuide, setFeedingGuide] = useState<{
    weightRange: string;
    cupsPerDay: { min: number; max: number };
    cupsPerMeal: { min: number; max: number };
    packsPerWeek: { min: number; max: number };
  } | null>(null);
  const [mealsPerDay, setMealsPerDay] = useState(2);

  // Rotating text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProblem((prev) => (prev + 1) % rotatingProblems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Newsletter modal
  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
    if (quizStep < quickAssessmentQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz complete, redirect to calculator page
      window.location.href = '/feeding-calculator';
    }
  };

  // Feeding guide data based on Waggin Meals feeding guide chart
  const feedingGuideData = [
    { weightRange: '5-10 lbs', minWeight: 5, maxWeight: 10, cupsPerDay: { min: 0.5, max: 1 }, cupsPerMeal: { min: 0.25, max: 0.5 }, packsPerWeek: { min: 1, max: 2 } },
    { weightRange: '11-20 lbs', minWeight: 11, maxWeight: 20, cupsPerDay: { min: 1, max: 1.5 }, cupsPerMeal: { min: 0.5, max: 0.75 }, packsPerWeek: { min: 2, max: 3 } },
    { weightRange: '21-30 lbs', minWeight: 21, maxWeight: 30, cupsPerDay: { min: 1.5, max: 2.25 }, cupsPerMeal: { min: 0.75, max: 1.125 }, packsPerWeek: { min: 3, max: 4 } },
    { weightRange: '31-50 lbs', minWeight: 31, maxWeight: 50, cupsPerDay: { min: 2.25, max: 3.75 }, cupsPerMeal: { min: 1.125, max: 1.875 }, packsPerWeek: { min: 4, max: 7 } },
    { weightRange: '51-75 lbs', minWeight: 51, maxWeight: 75, cupsPerDay: { min: 3.75, max: 5.5 }, cupsPerMeal: { min: 1.875, max: 2.75 }, packsPerWeek: { min: 7, max: 10 } },
    { weightRange: '76-100 lbs', minWeight: 76, maxWeight: 100, cupsPerDay: { min: 5.5, max: 7.5 }, cupsPerMeal: { min: 2.75, max: 3.75 }, packsPerWeek: { min: 10, max: 14 } },
  ];

  const getFeedingGuide = (weight: number) => {
    const guide = feedingGuideData.find(g => weight >= g.minWeight && weight <= g.maxWeight);
    return guide ? {
      weightRange: guide.weightRange,
      cupsPerDay: guide.cupsPerDay,
      cupsPerMeal: guide.cupsPerMeal,
      packsPerWeek: guide.packsPerWeek,
    } : null;
  };

  const formatFraction = (num: number): string => {
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
  };

  const calculateCalories = () => {
    if (!dogWeight || !dogAge) return;

    const weight = parseFloat(dogWeight);
    const age = parseFloat(dogAge);

    // Basic RER calculation: 70 * (weight in kg)^0.75
    const weightKg = weight / 2.205; // Convert lbs to kg
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Activity multipliers
    const multipliers = {
      low: 1.2,
      moderate: 1.6,
      high: 2.0,
    };

    let dailyCalories = rer * multipliers[activityLevel as keyof typeof multipliers];

    // Age adjustments
    if (age < 1) dailyCalories *= 1.5; // Puppies need more
    if (age > 7) dailyCalories *= 0.9; // Seniors need slightly less

    setCalculatedCalories(Math.round(dailyCalories));

    // Calculate feeding guide based on weight
    const guide = getFeedingGuide(weight);
    setFeedingGuide(guide);
  };

  return (
    <main className="bg-[#F8F5F0] min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-2 overflow-hidden">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 -left-24 w-96 h-96 bg-[#5E8C8C]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-[#8FAE8F]/8 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-start">
          {/* Left Column: Copy & CTA */}
            <div>
              {/* Main H1 Headline */}
              <h1 className="text-[40px] leading-[1.1] text-[#8FAE8F] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Waggin Meals Pet Nutrition
              </h1>
              <p className="text-[20px] text-[#5E8C8C] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Healthy Gut = Clean Butt
              </p>

              <div className="inline-flex items-center gap-2 bg-white border border-[#F8F5F0] rounded-full px-3 py-1.5 mb-3 shadow-sm">
                <Award className="w-4 h-4 text-[#5E8C8C]" />
                <span className="text-xs font-semibold text-[#8FAE8F] uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Dog Nutrition & Feeding Behavior Specialists
                </span>
              </div>

              {/* Value Statement with rotating text */}
              <h2 className="text-[26px] leading-[1.2] text-[#333333] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                When You've Tried Everything,
                <br />
                We Find Answers—Rooted in Science{' '}
                <span className="block text-[22px] text-[#5E8C8C] mt-1.5">
                  for {rotatingProblems[currentProblem]}
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-sm text-[#333333] mb-3 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Our approach combines advanced research and nutritional science to create customized whole-food diets for dogs. Led by Christie Willett—Master's in Animal Feed & Nutrition and certified in feeding behavior—we ensure precision in diet formulation and empower pet owners with clinically validated knowledge for sustained health.
              </p>

            {/* Bullets */}
            <div className="space-y-1.5 mb-3">
              {heroBullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-sm text-[#8FAE8F]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <CheckCircle2 className="w-4 h-4 text-[#5E8C8C] mt-0.5 flex-shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-3">
              <Link
                href="/shop"
                className="bg-[#8FAE8F] text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg hover:bg-[#6d8c6d] transition-all hover:shadow-xl inline-flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                title="Explore our curated whole-food collections designed for optimal health and taste"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Shop Our Meals
              </Link>
              <Link
                href="/nutrition-services"
                className="border-2 border-[#8FAE8F] text-[#8FAE8F] px-6 py-3 rounded-full text-base font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                title="Book a one-on-one consultation for a custom nutrition plan tailored to your dog's unique needs"
              >
                Need Special Attention?
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-2 border-t border-[#F8F5F0]">
              <div>
                <p className="text-xl text-[#8FAE8F] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  520+
                </p>
                <p className="text-[10px] uppercase tracking-wide text-[#333333] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Dogs Thriving
                </p>
              </div>
              <div>
                <p className="text-xl text-[#8FAE8F] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  17 days
                </p>
                <p className="text-[10px] uppercase tracking-wide text-[#333333] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Avg. Relief
                </p>
              </div>
              <div>
                <p className="text-xl text-[#8FAE8F] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  94%
                </p>
                <p className="text-[10px] uppercase tracking-wide text-[#333333] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Success Rate
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg border border-[#F8F5F0] p-2 hover:shadow-xl transition-shadow">
              <div className="grid gap-1.5">
                {/* Christie photo - Personal touch */}
                <div className="rounded-lg overflow-hidden border border-[#F8F5F0]">
                  <Image
                    src="/images/Christie 7 16 25-8 - Copy.jpg"
                    alt="Christie Willett - Board-Certified Canine Nutritionist"
                    width={400}
                    height={280}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                <div className="rounded-lg overflow-hidden border border-[#F8F5F0]">
                  <Image
                    src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                    alt="Chicken superfood board"
                    width={400}
                    height={280}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* CTA within card */}
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#C97B63] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    See What's New
                  </p>
                  <p className="text-sm font-semibold text-[#333333] mt-0.5" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Explore Smart Bundles
                  </p>
                  <p className="text-[10px] text-[#333333]">Fresh meals + expert guidance</p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 bg-[#5E8C8C] text-white px-3 py-1.5 rounded-full font-semibold hover:bg-[#5E8C8C] transition-colors whitespace-nowrap text-[11px]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Waggin Rewards Button */}
        <div className="absolute bottom-6 left-6 z-50">
          <Link
            href="/monthly-wag-box"
            className="flex items-center gap-2 bg-[#5E8C8C] text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold hover:bg-[#5E8C8C] transition-all hover:scale-105"
          >
            <Gift className="w-4 h-4" />
            Waggin Rewards
          </Link>
        </div>

        {/* Floating Chat Widget */}
        {chatWidgetOpen ? (
          <div className="absolute bottom-6 right-6 z-50 w-96 bg-white border border-[#F8F5F0] rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#d4e4d4] bg-gradient-to-r from-[#F8F5F0] to-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#8FAE8F]" />
                <span className="text-sm font-semibold text-[#8FAE8F]">How can we help?</span>
              </div>
              <button
                onClick={() => setChatWidgetOpen(false)}
                className="text-[#333333] hover:text-[#8FAE8F] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#F8F5F0]">
              <button
                className={`flex-1 text-sm font-semibold py-3 transition-colors ${
                  !showChatView
                    ? 'border-b-2 border-[#8FAE8F] text-[#8FAE8F]'
                    : 'text-[#a0a0a0] hover:text-[#8FAE8F]'
                }`}
                onClick={() => setShowChatView(false)}
              >
                Quick Answers
              </button>
              <button
                className={`flex-1 text-sm font-semibold py-3 transition-colors ${
                  showChatView
                    ? 'border-b-2 border-[#8FAE8F] text-[#8FAE8F]'
                    : 'text-[#a0a0a0] hover:text-[#8FAE8F]'
                }`}
                onClick={() => setShowChatView(true)}
              >
                Chat / Voice
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {!showChatView ? (
                <div className="space-y-4">
                  <p className="text-xs text-[#333333] mb-3">Select a question below or start a chat</p>
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-start justify-between gap-3 p-3 bg-[#f8f9fa] hover:bg-[#f0f1f2] rounded-xl transition-colors">
                          <p className="text-sm font-semibold text-[#8FAE8F] flex-1">{faq.question}</p>
                          <ChevronDown className="w-4 h-4 text-[#8FAE8F] group-open:rotate-180 transition-transform flex-shrink-0 mt-0.5" />
                        </div>
                      </summary>
                      <div className="mt-2 px-3 pb-2">
                        <p className="text-xs text-[#333333] leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-[#8FAE8F] text-white py-3 rounded-2xl font-semibold hover:bg-[#6d8c6d] transition-colors mt-2"
                  >
                    Ask a Different Question
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageCircle className="w-10 h-10 text-[#8FAE8F] mx-auto mb-4" />
                  <p className="font-semibold text-base mb-2">Ready to Chat?</p>
                  <p className="text-sm text-[#333333] mb-4">
                    We're here to help answer your questions and discuss your pet's nutrition needs.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-[#8FAE8F] text-white py-3 rounded-2xl font-semibold hover:bg-[#6d8c6d] transition-colors"
                  >
                    Contact Us Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatWidgetOpen(true)}
            className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-[#8FAE8F] text-white px-5 py-3 rounded-full shadow-xl hover:bg-[#6d8c6d] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Need Help?</span>
          </button>
        )}
      </section>

      {/* Features Badges Section */}
      <section className="px-4 py-8 bg-[#F8F5F0] border-y border-[#e0e0e0]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Human Grade & Gently Cooked */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#8FAE8F]/10 flex items-center justify-center mb-3">
                <ShieldCheck className="w-7 h-7 text-[#8FAE8F]" />
              </div>
              <h3 className="text-sm font-bold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Human Grade &<br />Gently Cooked
              </h3>
            </div>

            {/* Small Batch Scratch Kitchen */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#5E8C8C]/10 flex items-center justify-center mb-3">
                <UtensilsCrossed className="w-7 h-7 text-[#5E8C8C]" />
              </div>
              <h3 className="text-sm font-bold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Small Batch<br />Scratch Kitchen
              </h3>
            </div>

            {/* Sustainably Sourced */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#8FAE8F]/10 flex items-center justify-center mb-3">
                <Leaf className="w-7 h-7 text-[#8FAE8F]" />
              </div>
              <h3 className="text-sm font-bold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Sustainably<br />Sourced
              </h3>
            </div>

            {/* Developed by Animal Nutritionist */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#C97B63]/10 flex items-center justify-center mb-3">
                <Stethoscope className="w-7 h-7 text-[#C97B63]" />
              </div>
              <h3 className="text-sm font-bold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Developed by<br />Animal Nutritionist
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Three Services Section */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#5E8C8C] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Three-Part Approach
            </p>
            <h2 className="text-4xl text-[#333333] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Test. Feed. Thrive.
            </h2>
            <p className="text-base text-[#333333] max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              We combine science, fresh food, and personalized support to give your dog the health breakthrough they deserve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-2xl border-2 border-[#F8F5F0] bg-[#fdfbf7] shadow-md p-6 hover:shadow-xl hover:border-[#5E8C8C]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: service.accent }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: service.accent, fontFamily: "'Poppins', sans-serif" }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-xl text-[#333333] mb-3 group-hover:text-[#5E8C8C] transition-colors" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#333333] mb-5 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-semibold text-[#8FAE8F] hover:text-[#5E8C8C] transition-colors group-hover:gap-2 gap-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {service.cta}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Start Your Dog's Transformation Section */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="bg-[#8FAE8F] rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
              {/* Left: Content */}
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Start Your Dog's Transformation
                </h2>
                <p className="text-lg mb-4 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Struggling to find the right meals? We're here to help.
                </p>
                <p className="mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Unlike big-box companies, we believe in personalized care—not computer-generated responses. Our experts guide you every step of the way.
                </p>
                <Link
                  href="/feeding-calculator"
                  className="inline-flex items-center gap-2 bg-white text-[#8FAE8F] px-6 py-3 rounded-full font-semibold hover:bg-[#F8F5F0] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Calculator className="w-5 h-5" />
                  Learn More & Try the Feeding Calculator
                </Link>
              </div>

              {/* Right: Image */}
              <div className="relative">
                <Image
                  src="/images/Copy of Westie+and+plate+Waggin+Meals logo.jpg"
                  alt="Happy Westie with fresh food"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Diet Solutions Section */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Special Diet Solutions
            </h2>
            <p className="text-lg text-[#4a4a4a] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              For dogs with unique health needs, our experts craft customized meals aligned with veterinary recommendations.
            </p>
          </div>

          {/* 3 Blocks */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Block 1: 5-Strands Testing */}
            <a
              href="https://5strands.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F8F5F0] rounded-2xl p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-[#8FAE8F]"
            >
              <div className="aspect-square relative mb-4 rounded-xl overflow-hidden">
                <Image
                  src="/images/5 Strands (1).webp"
                  alt="5-Strands Testing"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                5-Strands Testing
              </h3>
              <p className="text-[#4a4a4a] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Comprehensive intolerance testing to identify food sensitivities
              </p>
            </a>

            {/* Block 2: Custom Prepared Diet Meals */}
            <Link
              href="/contact"
              className="group bg-[#F8F5F0] rounded-2xl p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-[#5E8C8C]"
            >
              <div className="aspect-square relative mb-4 rounded-xl overflow-hidden">
                <Image
                  src="/images/Tres Naquin.png"
                  alt="Custom Prepared Meals"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Custom Prepared Diet Meals
              </h3>
              <p className="text-[#4a4a4a] text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Personalized meal prep for dogs with special dietary needs
              </p>
              <span className="inline-flex items-center gap-2 bg-[#5E8C8C] text-white px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-[#4a6e6e] transition-colors">
                Contact Us Now
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Block 3: Expert Consultation */}
            <Link
              href="/nutrition-services"
              className="group bg-[#F8F5F0] rounded-2xl p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-[#C97B63]"
            >
              <div className="aspect-square relative mb-4 rounded-xl overflow-hidden">
                <Image
                  src="/images/Expert Consultation.jpg"
                  alt="Expert Consultation"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Expert Consultation
              </h3>
              <p className="text-[#4a4a4a] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Cook with confidence using whole foods! Our experts create tailored recipes for dogs with special health requirements—always backed by veterinary science.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Your Expert Section */}
      <section className="px-4 py-16 bg-[#d4e4d4]">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl border-2 border-[#8FAE8F]/30 shadow-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/images/Christie 7 16 25-8 - Copy.jpg"
                    alt="Christie Willett - Board-Certified Canine Nutritionist"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm font-semibold text-[#8FAE8F] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Meet Your Expert
                </p>
                <h2 className="text-3xl text-[#333333] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Christie Willett, M.A., M.S.
                </h2>
                <p className="text-sm font-semibold text-[#5E8C8C] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Integrative Animal Nutrition<br />
                  Canine Specialist in Feeding Behavior | Owner of Waggin Meals
                </p>
                <p className="text-base text-[#333333] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Since 2019, Christie has been transforming dogs' lives through personalized, whole-food nutrition. She specializes in gut and behavioral health, stress and anxiety management, gestation, and complex dietary restrictions. Christie collaborates closely with veterinarians and specialists to ensure every plan is science-based and tailored to each dog's unique needs. Her approach combines animal science with attentive listening to pet owners, creating nutrition strategies that truly work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
