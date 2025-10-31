"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, CheckCircle2, Award, FlaskConical, UtensilsCrossed, HeartPulse, Calculator, ClipboardList, MessageCircle, ChevronDown, Menu, ShieldCheck, Stethoscope, Leaf, Mail, Phone, Star, ArrowRight, Gift } from 'lucide-react';

const rotatingProblems = [
  'Digestive Issues',
  'Skin Problems',
  'Weight Management',
  'Food Sensitivities',
  'Low Energy',
];

const heroBullets = [
  'Dual Master\'s Degrees in Animal Science & Food Science',
  'Over 520 Dogs Thriving on Tailored Nutrition Plans',
  'Personal Chef Service with Concierge-Level Support',
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
    accent: '#5E3B76',
  },
  {
    icon: UtensilsCrossed,
    tag: 'Meals',
    title: 'Custom Fresh Food',
    description: 'Small-batch, chef-crafted meals tailored to your dog\'s unique nutritional needs.',
    cta: 'Browse Menu',
    href: '/shop',
    accent: '#9657EE',
  },
  {
    icon: HeartPulse,
    tag: 'Consulting',
    title: 'Expert Consultation',
    description: 'Personalized nutrition plans with ongoing support from our dual-degreed nutrition specialist.',
    cta: 'Book Now',
    href: '/contact-expert',
    accent: '#C26AF0',
  },
];

const testimonials = [
  {
    name: 'Matt Wolfe',
    text: 'Our dog Maisy absolutely devours the fresh meals that Christie prepares. Can\'t recommend her enough.',
  },
  {
    name: 'Elizabeth Joslin',
    text: 'Christie is so helpful, kind & very knowledgeable about canine nutrition! She genuinely cares about your dog\'s health.',
  },
  {
    name: 'Amber Munoz',
    text: 'My dogs love this food!! I know both of my dogs are getting the best quality ingredients.',
  },
  {
    name: 'Thom Slater',
    text: 'Top notch, prepared fresh on-site healthiest possible dog meals! Knowledgeable and experienced owners who care!',
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
      { label: 'Feeding Calculator', href: '#calculator' },
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

  // Rotating text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProblem((prev) => (prev + 1) % rotatingProblems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Newsletter modal
  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
    if (quizStep < quickAssessmentQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz complete, show calculator
      setShowQuiz(false);
      // Scroll to calculator
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    }
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
  };

  return (
    <main className="bg-[#d8c6ff] min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-[#5E3B76] text-white text-center text-xs py-2.5 px-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Free insulated tote on local delivery · Weekly Nutrition Workshops · Complimentary vet-ready reports
      </div>

      {/* Compact Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#ead9ff] px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-waggin-meals.png"
                alt="Waggin Meals"
                width={72}
                height={72}
                className="rounded-full border border-[#ead9ff] shadow-md"
              />
              <div>
                <p className="text-[8.4px] uppercase tracking-[0.25em] text-[#C26AF0]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Waggin Meals
                </p>
                <p className="text-[14.4px] leading-tight text-[#5E3B76]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Healthy Gut = Clean Butt
                </p>
                <p className="text-[7.2px] text-[#8a7ba8] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Christie Webb, M.S. Animal Nutrition & M.A. Food Science
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {'dropdown' in item ? (
                    <>
                      <button
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#5E3B76] px-3 py-2 hover:text-[#9657EE] transition-colors"
                        suppressHydrationWarning
                      >
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#ead9ff] py-2 z-50">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[#5E3B76] hover:bg-[#d8c6ff] transition-colors"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-xs font-semibold uppercase tracking-wide text-[#5E3B76] px-3 py-2 hover:text-[#9657EE] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="bg-[#9657EE] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#7e43c4] transition-colors ml-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5E3B76] hover:bg-[#d8c6ff] rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pb-3 border-t border-[#ead9ff] pt-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {'dropdown' in item ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-[#5E3B76] px-3 py-2 hover:bg-[#d8c6ff] rounded-md"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        suppressHydrationWarning
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="pl-3 space-y-1 mt-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[#8a7ba8] hover:bg-[#d8c6ff] rounded-md"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-sm font-semibold text-[#5E3B76] px-3 py-2 hover:bg-[#d8c6ff] rounded-md"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="block text-center bg-[#9657EE] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#7e43c4] transition-colors mt-3 mx-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-16 overflow-hidden">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 -left-24 w-96 h-96 bg-[#9657EE]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-[#5E3B76]/8 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
          {/* Left Column: Copy & CTA */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-[#ead9ff] rounded-full px-4 py-2 mb-6 shadow-sm">
                <Award className="w-4 h-4 text-[#9657EE]" />
                <span className="text-xs font-semibold text-[#5E3B76] uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Nutrition Science Specialist
                </span>
              </div>

              {/* H1 with rotating text */}
              <h1 className="text-[48px] leading-[1.1] text-[#2b1d3b] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Dual-Degreed Nutrition Specialist
                <br />
                Solving{' '}
                <span className="text-[#9657EE]">
                  {rotatingProblems[currentProblem]}
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg text-[#6e5c8f] mb-8 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                When your vet can't find answers, our dual-degreed nutrition specialist digs deeper into gut health, custom meal plans, and lasting results. <strong>520+ dogs transformed</strong> with concierge-level care.
              </p>

            {/* Bullets */}
            <div className="space-y-3 mb-8">
              {heroBullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <CheckCircle2 className="w-5 h-5 text-[#9657EE] mt-0.5 flex-shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="#calculator"
                className="bg-[#5E3B76] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#452a6d] transition-all hover:shadow-xl inline-flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Calculator className="w-5 h-5" />
                Calculate Your Dog's Needs
              </Link>
              <Link
                href="/contact-expert"
                className="border-2 border-[#5E3B76] text-[#5E3B76] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#5E3B76] hover:text-white transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Book Free Consultation
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-6 border-t border-[#ead9ff]">
              <div>
                <p className="text-4xl text-[#5E3B76] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  520+
                </p>
                <p className="text-xs uppercase tracking-wide text-[#8a7ba8] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Dogs Thriving
                </p>
              </div>
              <div>
                <p className="text-4xl text-[#5E3B76] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  17 days
                </p>
                <p className="text-xs uppercase tracking-wide text-[#8a7ba8] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Avg. Relief
                </p>
              </div>
              <div>
                <p className="text-4xl text-[#5E3B76] font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  94%
                </p>
                <p className="text-xs uppercase tracking-wide text-[#8a7ba8] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Success Rate
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="relative">
            <div className="bg-white rounded-[32px] shadow-2xl border border-[#ead9ff] p-6 hover:shadow-3xl transition-shadow">
              <div className="grid gap-4">
                {/* Featured meal images */}
                <div className="rounded-2xl overflow-hidden border border-[#e8ddff]">
                  <Image
                    src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                    alt="Beef and sweet potato bowl"
                    width={1200}
                    height={800}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#e8ddff]">
                  <Image
                    src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                    alt="Chicken superfood board"
                    width={1200}
                    height={800}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* CTA within card */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#C26AF0] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Featured This Week
                  </p>
                  <p className="text-2xl font-semibold text-[#2b1d3b] mt-1" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Better Belly Bundle
                  </p>
                  <p className="text-sm text-[#8a7ba8]">Fresh meals + bone broth</p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#9657EE] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7e43c4] transition-colors whitespace-nowrap"
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
            className="flex items-center gap-2 bg-[#9657EE] text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold hover:bg-[#7e43c4] transition-all hover:scale-105"
          >
            <Gift className="w-4 h-4" />
            Waggin Rewards
          </Link>
        </div>

        {/* Floating Chat Widget */}
        {chatWidgetOpen ? (
          <div className="absolute bottom-6 right-6 z-50 w-96 bg-white border border-[#e8ddff] rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#d5c1ff] bg-gradient-to-r from-[#d8c6ff] to-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#5E3B76]" />
                <span className="text-sm font-semibold text-[#5E3B76]">How can we help?</span>
              </div>
              <button
                onClick={() => setChatWidgetOpen(false)}
                className="text-[#8a7ba8] hover:text-[#5E3B76] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#e8ddff]">
              <button
                className={`flex-1 text-sm font-semibold py-3 transition-colors ${
                  !showChatView
                    ? 'border-b-2 border-[#5E3B76] text-[#5E3B76]'
                    : 'text-[#a0a0a0] hover:text-[#5E3B76]'
                }`}
                onClick={() => setShowChatView(false)}
              >
                Quick Answers
              </button>
              <button
                className={`flex-1 text-sm font-semibold py-3 transition-colors ${
                  showChatView
                    ? 'border-b-2 border-[#5E3B76] text-[#5E3B76]'
                    : 'text-[#a0a0a0] hover:text-[#5E3B76]'
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
                  <p className="text-xs text-[#8a7ba8] mb-3">Select a question below or start a chat</p>
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-start justify-between gap-3 p-3 bg-[#f8f9fa] hover:bg-[#f0f1f2] rounded-xl transition-colors">
                          <p className="text-sm font-semibold text-[#5E3B76] flex-1">{faq.question}</p>
                          <ChevronDown className="w-4 h-4 text-[#5E3B76] group-open:rotate-180 transition-transform flex-shrink-0 mt-0.5" />
                        </div>
                      </summary>
                      <div className="mt-2 px-3 pb-2">
                        <p className="text-xs text-[#6e5c8f] leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-[#5E3B76] text-white py-3 rounded-2xl font-semibold hover:bg-[#452a6d] transition-colors mt-2"
                  >
                    Ask a Different Question
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageCircle className="w-10 h-10 text-[#5E3B76] mx-auto mb-4" />
                  <p className="font-semibold text-base mb-2">Ready to Chat?</p>
                  <p className="text-sm text-[#8a7ba8] mb-4">
                    We're here to help answer your questions and discuss your pet's nutrition needs.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-[#5E3B76] text-white py-3 rounded-2xl font-semibold hover:bg-[#452a6d] transition-colors"
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
            className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-[#5E3B76] text-white px-5 py-3 rounded-full shadow-xl hover:bg-[#452a6d] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Need Help?</span>
          </button>
        )}
      </section>

      {/* Stunning Quiz + Calculator Section */}
      <section id="calculator" className="px-4 py-16 bg-gradient-to-br from-white to-[#d8c6ff]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Personalized Nutrition Planning
            </p>
            <h2 className="text-4xl text-[#2b1d3b] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Start Your Dog's Transformation
            </h2>
            <p className="text-base text-[#6e5c8f] max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Answer a few quick questions to get personalized feeding recommendations, or jump straight to our calculator.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#ead9ff] shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#ead9ff]">
              <button
                onClick={() => setShowQuiz(true)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  showQuiz
                    ? 'border-b-2 border-[#5E3B76] text-[#5E3B76] bg-[#d8c6ff]'
                    : 'text-[#888] hover:text-[#5E3B76]'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <ClipboardList className="w-5 h-5 inline-block mr-2" />
                Quick Assessment
              </button>
              <button
                onClick={() => setShowQuiz(false)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  !showQuiz
                    ? 'border-b-2 border-[#5E3B76] text-[#5E3B76] bg-[#d8c6ff]'
                    : 'text-[#888] hover:text-[#5E3B76]'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Calculator className="w-5 h-5 inline-block mr-2" />
                Feeding Calculator
              </button>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10">
              {showQuiz ? (
                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Question {quizStep + 1} of {quickAssessmentQuestions.length}
                      </p>
                      <div className="flex gap-1">
                        {quickAssessmentQuestions.map((_, index) => (
                          <div
                            key={index}
                            className={`w-8 h-1 rounded-full ${
                              index <= quizStep ? 'bg-[#5E3B76]' : 'bg-[#ead9ff]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-2xl text-[#2b1d3b] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      {quickAssessmentQuestions[quizStep].question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickAssessmentQuestions[quizStep].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleQuizAnswer(quickAssessmentQuestions[quizStep].id, option)}
                        className="border-2 border-[#d3baff] rounded-xl p-4 text-left hover:border-[#5E3B76] hover:bg-[#d8c6ff] transition-all text-sm font-medium"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {quizStep > 0 && (
                    <button
                      onClick={() => setQuizStep(quizStep - 1)}
                      className="mt-6 text-sm text-[#5E3B76] hover:text-[#9657EE] font-semibold"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      ← Back
                    </button>
                  )}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#5E3B76] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Dog's Weight (lbs)
                      </label>
                      <input
                        type="number"
                        value={dogWeight}
                        onChange={(e) => setDogWeight(e.target.value)}
                        placeholder="e.g., 45"
                        className="w-full px-4 py-3 border-2 border-[#ead9ff] rounded-xl focus:outline-none focus:border-[#5E3B76] transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#5E3B76] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Dog's Age (years)
                      </label>
                      <input
                        type="number"
                        value={dogAge}
                        onChange={(e) => setDogAge(e.target.value)}
                        placeholder="e.g., 5"
                        className="w-full px-4 py-3 border-2 border-[#ead9ff] rounded-xl focus:outline-none focus:border-[#5E3B76] transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#5E3B76] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Activity Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['low', 'moderate', 'high'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setActivityLevel(level)}
                          className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                            activityLevel === level
                              ? 'bg-[#5E3B76] text-white'
                              : 'border-2 border-[#ead9ff] text-[#8a7ba8] hover:border-[#5E3B76]'
                          }`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={calculateCalories}
                    className="w-full bg-[#5E3B76] text-white py-4 rounded-xl text-base font-semibold hover:bg-[#452a6d] transition-colors shadow-lg hover:shadow-xl"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Calculate Daily Calories
                  </button>

                  {calculatedCalories && (
                    <div className="mt-8 bg-gradient-to-br from-[#5E3B76] to-[#452a6d] rounded-2xl p-8 text-white">
                      <div className="text-center mb-6">
                        <p className="text-sm opacity-90 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Recommended Daily Calories
                        </p>
                        <p className="text-5xl font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                          {calculatedCalories}
                        </p>
                        <p className="text-sm opacity-90 mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          calories per day
                        </p>
                      </div>

                      <div className="border-t border-white/20 pt-6 space-y-3 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <p className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>This is a baseline estimate. Actual needs vary by metabolism, health conditions, and lifestyle.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>For a personalized meal plan tailored to your dog's unique needs, book a consultation.</span>
                        </p>
                      </div>

                      <Link
                        href="/contact-expert"
                        className="mt-6 w-full bg-white text-[#5E3B76] py-3 rounded-xl text-base font-semibold hover:bg-[#d8c6ff] transition-colors inline-flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Get Personalized Plan
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  )}

                  <p className="mt-6 text-xs text-center text-[#888]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Note: This calculator provides general estimates. For precise nutrition planning based on your dog's health history and goals, we recommend a consultation with Christie.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8">
            <p className="text-sm text-[#8a7ba8] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Want a complete nutrition analysis with microbiome testing and custom meal plans?
            </p>
            <Link
              href="/nutrition-services"
              className="inline-flex items-center gap-2 bg-[#9657EE] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#7e43c4] transition-colors shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Book Expert Consultation ($395)
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Three Services Section */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Three-Part Approach
            </p>
            <h2 className="text-4xl text-[#2b1d3b] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Test. Feed. Thrive.
            </h2>
            <p className="text-base text-[#6e5c8f] max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              We combine science, fresh food, and personalized support to give your dog the health breakthrough they deserve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-2xl border-2 border-[#ead9ff] bg-[#fdfbf7] shadow-md p-6 hover:shadow-xl hover:border-[#9657EE]/30 transition-all group"
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

                  <h3 className="text-xl text-[#2b1d3b] mb-3 group-hover:text-[#9657EE] transition-colors" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#6e5c8f] mb-5 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-semibold text-[#5E3B76] hover:text-[#9657EE] transition-colors group-hover:gap-2 gap-1"
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

      {/* Christie's Credentials Section */}
      <section className="px-4 py-16 bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff]">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl border-2 border-[#ead9ff] shadow-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#5E3B76] to-[#452a6d] flex items-center justify-center text-white shadow-xl border-4 border-white">
                  <span className="text-5xl font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>C</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm font-semibold text-[#9657EE] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Meet Your Expert
                </p>
                <h2 className="text-3xl text-[#2b1d3b] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Christie Webb, M.A., M.S.
                </h2>
                <p className="text-sm text-[#6e5c8f] mb-4 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Christie holds dual master&rsquo;s degrees in animal nutrition and food science with over 8 years transforming dogs&rsquo; lives through personalized nutrition. She specializes in gut health, microbiome optimization, and partnering with families whose dogs haven&rsquo;t responded to traditional veterinary approaches.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-[#5E3B76]/10 text-[#5E3B76] px-3 py-1.5 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Dual Master&apos;s Degrees
                  </span>
                  <span className="bg-[#5E3B76]/10 text-[#5E3B76] px-3 py-1.5 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    M.S. Animal Nutrition
                  </span>
                  <span className="bg-[#5E3B76]/10 text-[#5E3B76] px-3 py-1.5 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    M.A. Food Science
                  </span>
                  <span className="bg-[#5E3B76]/10 text-[#5E3B76] px-3 py-1.5 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    520+ Success Stories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16 bg-gradient-to-b from-white to-[#d8c6ff]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What Pet Parents Say
            </p>
            <h2 className="text-4xl text-[#2b1d3b] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Happy Customers & Waggin Tails
            </h2>
            <p className="text-base text-[#6e5c8f] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Real stories from real pet parents who trusted us with their dog's health and nutrition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#ead9ff] rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:border-[#9657EE]/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5E3B76] to-[#452a6d] flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {testimonial.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {testimonial.name}
                    </p>
                    <div className="flex text-[#e6b4ff]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#6e5c8f] leading-relaxed italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 bg-[#5E3B76] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#452a6d] transition-all shadow-lg hover:shadow-xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Read More Success Stories
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 md:p-10 relative border-2 border-[#ead9ff] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              aria-label="Close modal"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#8a7ba8] hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Image
                src="/images/waggin-logos.png"
                alt="Waggin Meals logo"
                width={120}
                height={120}
                className="rounded-full border-2 border-[#d3baff] shadow-lg bg-[#d8c6ff]"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#9657EE] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Save $25 Today
                </p>
                <h3 className="text-2xl text-[#2b1d3b] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Join Our Nutrition Newsletter
                </h3>
                <p className="text-sm text-[#6e5c8f] mb-5 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Get weekly meal prep tips, exclusive recipes, and VIP-only discounts delivered to your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-full border-2 border-[#ead9ff] px-5 py-3 text-sm focus:outline-none focus:border-[#9657EE] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  <button
                    type="submit"
                    className="bg-[#5E3B76] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#472d70] transition-colors shadow-lg hover:shadow-xl"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Claim My $25
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#5E3B76] to-[#452a6d] text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/logo-waggin-meals.png"
                  alt="Waggin Meals"
                  width={50}
                  height={50}
                  className="rounded-full border border-[#ead9ff]"
                />
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Waggin Meals
                  </p>
                    <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Healthy Gut = Clean Butt
                  </p>
                </div>
              </div>
                <p className="text-xs leading-relaxed opacity-90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Specialized nutrition tailored to your dog's unique needs. Every meal scientifically formulated by Christie Webb, M.S. Animal Nutrition & M.A. Food Science.
                </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 opacity-90">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@wagginmeals.com" className="hover:text-[#e6b4ff] transition-colors">
                    info@wagginmeals.com
                  </a>
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-[#e6b4ff] transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li><Link href="/" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Home</Link></li>
                <li><Link href="/shop" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Shop</Link></li>
                <li><Link href="/nutrition-services" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Nutrition Services</Link></li>
                <li><Link href="/case-studies" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Success Stories</Link></li>
                <li><Link href="/blog" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Pet Nutrition Insights</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Resources
              </h3>
              <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li><Link href="/feeding-calculator" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Feeding Calculator</Link></li>
                <li><Link href="/guides/fresh-food-guide" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Fresh Food Guide</Link></li>
                <li><Link href="/resources" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Free PDF Guides</Link></li>
                <li><Link href="/faq" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">FAQs</Link></li>
                <li><Link href="/contact" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Contact Us</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Legal
              </h3>
              <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li><Link href="/shipping" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Shipping & Delivery</Link></li>
                <li><Link href="/privacy" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Privacy Policy</Link></li>
                <li><Link href="/terms" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Compliance & Certifications */}
          <div className="border-t border-white/20 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#e6b4ff] flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    FDA Pet Feed Program
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Licensed human-grade kitchen with documented batch tracking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-[#e6b4ff] flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie Formulated
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Oversight from a dual master&rsquo;s-degreed canine integrative animal nutritionist.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-[#e6b4ff] flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    AAFCO Complete
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Balanced for dogs of every life stage with whole-food ingredients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Disclaimer */}
          <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/20">
            <p className="text-xs text-center opacity-90 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Important Information:</strong> At Waggin Meals, we believe your dog deserves real food made with love. Our <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the <strong>FDA Pet Feed Program</strong> and scientifically formulated by an animal nutritionist to meet <strong>AAFCO standards for dogs of all ages</strong>. Our meals are formulated exclusively for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your veterinarian for health decisions about your dog.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p className="mb-2">
              © {new Date().getFullYear()} Waggin Meals Pet Nutrition Co. All rights reserved.
            </p>
            <p className="text-xs">
              Formulated by Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
