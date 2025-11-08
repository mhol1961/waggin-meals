"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, CheckCircle2, Award, FlaskConical, UtensilsCrossed, HeartPulse, Gift, MessageCircle, CalendarDays, Sparkles, Star, ChevronDown, Menu, ShieldCheck, Stethoscope, Leaf, Mail, Phone, MapPin } from 'lucide-react';

const heroBullets = [
  'Microbiome testing with visual palette reports',
  'Chef-crafted fresh meals, toppers & broths',
  'Expert nutrition consulting & concierge support',
];

const services = [
  {
    icon: FlaskConical,
    tag: 'Testing',
    title: 'Gut Health Analysis',
    description: 'Comprehensive microbiome testing with easy-to-understand color palette visuals you can share with your vet.',
    cta: 'Learn About Testing',
    href: '/nutrition-services',
    accent: '#2f4b38',
  },
  {
    icon: UtensilsCrossed,
    tag: 'Meals',
    title: 'Custom Fresh Food',
    description: 'Small-batch, seasonally rotated bowls, toppers, and bone broths tailored to your dog\'s unique needs.',
    cta: 'Browse Menu',
    href: '/shop',
    accent: '#bc2c2c',
  },
  {
    icon: HeartPulse,
    tag: 'Consulting',
    title: 'Nutrition Concierge',
    description: 'Personalized plans, ongoing support, and vet-ready documentation from certified nutrition specialists.',
    cta: 'Book Consultation',
    href: '/contact-expert',
    accent: '#a4341f',
  },
];

const stats = [
  { label: 'Dogs Thriving', value: '520+' },
  { label: 'Avg. Symptom Relief', value: '17 days' },
  { label: 'Success Rate', value: '94%' },
];

const paletteColors = [
  { name: 'Protein', color: '#bc2c2c', description: 'Muscle & energy' },
  { name: 'Greens', color: '#2f4b38', description: 'Gut flora support' },
  { name: 'Carbs', color: '#f6a723', description: 'Sustained energy' },
  { name: 'Fats', color: '#8a5a26', description: 'Coat & brain health' },
];

const faqs = [
  { question: 'What is included in a consultation?', answer: 'Comprehensive health assessment, custom meal plan, supplement recommendations, and ongoing support.' },
  { question: 'How does microbiome testing work?', answer: 'Simple at-home sample collection, lab analysis, and detailed palette visualization of your dog\'s gut health.' },
  { question: 'Do you ship nationwide?', answer: 'Yes! Fresh meals ship weekly. Local delivery available in Portland metro area.' },
  { question: 'Can you work with my vet?', answer: 'Absolutely! We provide vet-ready documentation and collaborate with your veterinary team.' },
];

const floatingTestimonials = [
  { name: 'Matt Wolfe', text: 'Our dog Maisy absolutely devours the fresh meals!' },
  { name: 'Elizabeth Joslin', text: 'Christie is so helpful & knowledgeable!' },
  { name: 'Amber Munoz', text: 'My dogs love this food!! Best quality ingredients.' },
];

const fullTestimonials = [
  {
    name: 'Matt Wolfe + Maisy',
    text: 'Our dog Maisy absolutely devours the fresh meals that Christie prepares. And it\'s satisfying to know the food is prepared by a pet nutritionist. Can\'t recommend her enough.',
  },
  {
    name: 'Elizabeth Joslin',
    text: 'Our large pup loves their food and broth! Christie is so helpful, kind & very knowledgeable about canine nutrition! You can tell she genuinely cares about your dog\'s health and not just selling products. They also offer a private dog park that you can rent hourly! We recently rented the park for our pups birthday and had a blast.',
  },
  {
    name: 'Amber Munoz',
    text: 'My dogs love this food!! I love the convenience and nutritional value this company provides. I know both of my dogs are getting the best quality ingredients. Both my girls look forward to meal times as they love the taste of the food and jump for joy.',
  },
  {
    name: 'Thom Slater',
    text: 'Top notch, prepared fresh on-site healthiest possible dog meals and treats! Certified and experienced owners & staff who care about your pets and you!! The new location is fantastic!!',
  },
];

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Pet Nutrition Services',
    dropdown: [
      { label: 'Nutrition Consultation ($395)', href: '/nutrition-services' },
      { label: 'Schedule Free 15-Min Consultation', href: 'mailto:wagginmeals@gmail.com?subject=Free%2015-Minute%20Consultation%20Request' },
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
  { label: 'Shop', href: '/shop' },
  {
    label: 'Success Stories',
    dropdown: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Testimonials', href: '/testimonials' },
    ]
  },
];

export default function UltimateHomepage() {
  const [showModal, setShowModal] = useState(false);
  const [showChatView, setShowChatView] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [testimonialVisible, setTestimonialVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentFloatingTestimonial, setCurrentFloatingTestimonial] = useState(0);
  const [showFloatingTestimonial, setShowFloatingTestimonial] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide testimonial after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setTestimonialVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Floating testimonials cycle
  useEffect(() => {
    const showTestimonial = () => {
      setShowFloatingTestimonial(true);
      setTimeout(() => {
        setShowFloatingTestimonial(false);
      }, 4500); // Show for 4.5 seconds
    };

    // Show first testimonial after 2 seconds
    const initialTimer = setTimeout(showTestimonial, 2000);

    // Cycle through testimonials
    const interval = setInterval(() => {
      setCurrentFloatingTestimonial((prev) => (prev + 1) % floatingTestimonials.length);
      showTestimonial();
    }, 7000); // New testimonial every 7 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="bg-[#f5f1ea] min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-[#2f4b38] text-white text-center text-sm py-3 px-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Free insulated tote on local delivery · Weekly Nutrition Workshops · Complimentary vet-ready lab summaries
      </div>

      {/* Custom Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#ded2bf] px-4 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/images/logo-waggin-meals.png"
                alt="Waggin Meals"
                width={120}
                height={120}
                className="rounded-full border border-[#ded2bf] shadow-lg"
              />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#a4341f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Waggin Meals
                </p>
                <p className="text-2xl text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Holistic Nutrition Studio
                </p>
                <p className="text-xs text-[#5c5549] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Founded by Christie Webb, Certified Canine Nutritionist
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
                      <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#2f4b38] px-3 py-2 hover:text-[#bc2c2c] transition-colors">
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#ded2bf] py-2 z-50">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-xs text-[#2f4b38] hover:bg-[#f5f1ea] transition-colors"
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
                      className="text-xs font-semibold uppercase tracking-wide text-[#2f4b38] px-3 py-2 hover:text-[#bc2c2c] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="bg-[#bc2c2c] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#90211b] transition-colors ml-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2f4b38] hover:bg-[#f5f1ea] rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-[#ded2bf] pt-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  {'dropdown' in item ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-[#2f4b38] px-4 py-2 hover:bg-[#f5f1ea] rounded-md"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="pl-4 space-y-1 mt-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[#5c5549] hover:bg-[#f5f1ea] rounded-md"
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
                      className="block text-sm font-semibold text-[#2f4b38] px-4 py-2 hover:bg-[#f5f1ea] rounded-md"
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
                className="block text-center bg-[#bc2c2c] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-[#90211b] transition-colors mt-4 mx-4"
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
      <section className="relative px-4 py-16 overflow-hidden bg-gradient-to-br from-[#9b8bb3] via-[#8b7ba8] to-[#7b6b98]">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-40 -left-24 w-96 h-96 bg-[#8FAE8F]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-[#5E8C8C]/20 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
          {/* Left Column: Copy & CTA */}
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-white border border-[#ded2bf] rounded-full px-4 py-2 shadow-sm">
                <Award className="w-4 h-4 text-[#bc2c2c]" />
                <span className="text-xs font-semibold text-[#2f4b38] uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Certified Nutrition Specialists
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#bc2c2c] text-white border border-[#bc2c2c] rounded-full px-4 py-2 shadow-md">
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  As Served at Twisted Laurel Restaurant
                </span>
              </div>
            </div>

            <h1 className="text-[58px] leading-[1.1] text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              When veterinarians can't find answers,
              <br />
              <span className="text-[#ffd700]">we dig deeper.</span>
            </h1>

            <p className="text-lg text-white/90 mb-8 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Combine cutting-edge microbiome testing, custom fresh-food plans, and expert guidance to transform your dog's health—starting with their gut.
            </p>

            {/* Palette Preview */}
            <div className="bg-white rounded-2xl border border-[#ded2bf] p-6 mb-8 shadow-md">
              <p className="text-xs uppercase tracking-[0.4em] text-[#a4341f] font-semibold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Our Palette System
              </p>
              <p className="text-sm text-[#4a443b] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Every meal is balanced across four key nutrient categories—visualized with our signature color palette:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {paletteColors.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full shadow-inner border-2 border-white"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1f1a16]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {item.name}
                      </p>
                      <p className="text-xs text-[#5c5549]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bullets */}
            <div className="space-y-3 mb-8">
              {heroBullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <CheckCircle2 className="w-5 h-5 text-[#ffd700] mt-0.5 flex-shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/contact-expert"
                className="bg-[#2f4b38] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#1f3324] transition-all hover:shadow-xl"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Book Free Consultation
              </Link>
              <Link
                href="/case-studies"
                className="border-2 border-[#2f4b38] text-[#2f4b38] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2f4b38] hover:text-white transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                View Success Stories
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-6 border-t border-white/30">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl text-white font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-white/80 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="relative">
            <div className="bg-white rounded-[32px] shadow-2xl border border-[#ded2bf] p-6 hover:shadow-3xl transition-shadow">
              <div className="grid gap-4">
                {/* Featured meal images */}
                <div className="rounded-2xl overflow-hidden border border-[#e5d9c7]">
                  <Image
                    src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                    alt="Beef and sweet potato bowl"
                    width={1200}
                    height={800}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#e5d9c7]">
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
                  <p className="text-xs uppercase tracking-[0.4em] text-[#a4341f] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Featured This Week
                  </p>
                  <p className="text-2xl font-semibold text-[#1f1a16] mt-1" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Better Belly Bundle
                  </p>
                  <p className="text-sm text-[#5c5549]">Fresh meals + bone broth + palette guide</p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#bc2c2c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#90211b] transition-colors whitespace-nowrap"
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
            className="flex items-center gap-2 bg-[#1b2d21] text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold hover:bg-[#2f4b38] transition-all hover:scale-105"
          >
            <Gift className="w-4 h-4" />
            Waggin Rewards
          </Link>
        </div>

        {/* Floating Testimonial Pop-ins */}
        {showFloatingTestimonial && (
          <div
            className={`absolute top-1/2 z-40 transform -translate-y-1/2 transition-all duration-700 ${
              currentFloatingTestimonial % 2 === 0
                ? 'left-4 animate-in slide-in-from-left-8 fade-in'
                : 'right-4 animate-in slide-in-from-right-8 fade-in'
            }`}
            style={{
              animation: showFloatingTestimonial
                ? 'slideIn 0.5s ease-out, fadeOut 0.5s ease-in 4s'
                : 'none'
            }}
          >
            <div className="bg-white border-2 border-[#ded2bf] rounded-2xl shadow-2xl p-4 max-w-xs backdrop-blur-sm bg-white/95">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2f4b38] to-[#1f3324] flex items-center justify-center text-white font-bold text-sm" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  {floatingTestimonials[currentFloatingTestimonial].name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2f4b38]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {floatingTestimonials[currentFloatingTestimonial].name}
                  </p>
                  <div className="flex text-[#f6a723]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#4a443b] italic leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                "{floatingTestimonials[currentFloatingTestimonial].text}"
              </p>
            </div>
          </div>
        )}

        {/* Floating Chat Widget */}
        {chatWidgetOpen ? (
          <div className="absolute bottom-6 right-6 z-50 w-96 bg-white border border-[#eadfce] rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0e5d6] bg-gradient-to-r from-[#f5f1ea] to-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#2f4b38]" />
                <span className="text-sm font-semibold text-[#2f4b38]">How can we help?</span>
              </div>
              <button
                onClick={() => setChatWidgetOpen(false)}
                className="text-[#5c5549] hover:text-[#2f4b38] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#f0e5d6]">
              <button
                className={`flex-1 text-sm font-semibold py-3 transition-colors ${
                  !showChatView
                    ? 'border-b-2 border-[#2f4b38] text-[#2f4b38]'
                    : 'text-[#a0a0a0] hover:text-[#2f4b38]'
                }`}
                onClick={() => setShowChatView(false)}
              >
                Quick Answers
              </button>
              <button
                className={`flex-1 text-sm font-semibold py-3 transition-colors ${
                  showChatView
                    ? 'border-b-2 border-[#2f4b38] text-[#2f4b38]'
                    : 'text-[#a0a0a0] hover:text-[#2f4b38]'
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
                  <p className="text-xs text-[#756b5d] mb-3">Select a question below or start a chat</p>
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-start justify-between gap-3 p-3 bg-[#f8f9fa] hover:bg-[#f0f1f2] rounded-xl transition-colors">
                          <p className="text-sm font-semibold text-[#2f4b38] flex-1">{faq.question}</p>
                          <ChevronDown className="w-4 h-4 text-[#2f4b38] group-open:rotate-180 transition-transform flex-shrink-0 mt-0.5" />
                        </div>
                      </summary>
                      <div className="mt-2 px-3 pb-2">
                        <p className="text-xs text-[#4a443b] leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-[#2f4b38] text-white py-3 rounded-2xl font-semibold hover:bg-[#1f3324] transition-colors mt-2"
                  >
                    Ask a Different Question
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageCircle className="w-10 h-10 text-[#2f4b38] mx-auto mb-4" />
                  <p className="font-semibold text-base mb-2">Ready to Chat?</p>
                  <p className="text-sm text-[#756b5d] mb-4">
                    We're here to help answer your questions and discuss your pet's nutrition needs.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-[#2f4b38] text-white py-3 rounded-2xl font-semibold hover:bg-[#1f3324] transition-colors"
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
            className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-[#2f4b38] text-white px-5 py-3 rounded-full shadow-xl hover:bg-[#1f3324] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Need Help?</span>
          </button>
        )}

        {/* Floating Testimonial - positioned to avoid overlap, animates in and auto-hides */}
        {testimonialVisible && (
          <div className="hidden lg:block absolute left-1/4 -translate-x-1/2 bottom-12 z-40 bg-white border-2 border-[#ded2bf] rounded-2xl shadow-xl p-4 w-64 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/woman-with-white-dog.webp"
                alt="Happy customer"
                width={54}
                height={54}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#2f4b38]">Leah + Augie</p>
                <div className="flex text-[#f6a723]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#4a443b]">
              "Palette visuals made it easy to brief our vet. Christie&apos;s concierge support kept us on track every step."
            </p>
          </div>
        )}
      </section>

      {/* Three Services Section */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#bc2c2c] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Three-Part Approach
            </p>
            <h2 className="text-[42px] text-[#1f1a16] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Test. Feed. Thrive.
            </h2>
            <p className="text-lg text-[#4a443b] max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              We combine science, fresh food, and personalized support to give your dog the health breakthrough they deserve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-3xl border-2 border-[#ded2bf] bg-[#fdfbf7] shadow-md p-8 hover:shadow-2xl hover:border-[#bc2c2c]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: service.accent }}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: service.accent, fontFamily: "'Poppins', sans-serif" }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl text-[#1f1a16] mb-3 group-hover:text-[#bc2c2c] transition-colors" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#4a443b] mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-semibold text-[#2f4b38] hover:text-[#bc2c2c] transition-colors group-hover:gap-2 gap-1"
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
      <section className="px-4 py-20 bg-gradient-to-br from-[#f5f1ea] to-[#e8e3dc]">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-[32px] border-2 border-[#ded2bf] shadow-2xl p-10 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#2f4b38] to-[#1f3324] flex items-center justify-center text-white shadow-xl border-4 border-white">
                  <span className="text-6xl font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>C</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm font-semibold text-[#bc2c2c] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Meet Your Expert
                </p>
                <h2 className="text-4xl text-[#1f1a16] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Christie Webb
                </h2>
                <p className="text-base text-[#4a443b] mb-4 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Certified Canine Nutritionist with over 8 years of experience transforming dogs' lives through personalized nutrition. Christie specializes in gut health, microbiome optimization, and working with dogs who haven't responded to traditional veterinary approaches.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-[#2f4b38]/10 text-[#2f4b38] px-4 py-2 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Certified Nutritionist
                  </span>
                  <span className="bg-[#2f4b38]/10 text-[#2f4b38] px-4 py-2 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    520+ Success Stories
                  </span>
                  <span className="bg-[#2f4b38]/10 text-[#2f4b38] px-4 py-2 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Gut Health Specialist
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Happy Customers & Waggin Tails Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-white to-[#f5f1ea]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#bc2c2c] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What Pet Parents Say
            </p>
            <h2 className="text-[42px] text-[#1f1a16] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Happy Customers & Waggin Tails
            </h2>
            <p className="text-lg text-[#4a443b] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Real stories from real pet parents who trusted us with their dog's health and nutrition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {fullTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#ded2bf] rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:border-[#bc2c2c]/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2f4b38] to-[#1f3324] flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {testimonial.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#2f4b38]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {testimonial.name}
                    </p>
                    <div className="flex text-[#f6a723]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#4a443b] leading-relaxed italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          {/* View All Testimonials CTA */}
          <div className="text-center mt-12">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 bg-[#2f4b38] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#1f3324] transition-all shadow-lg hover:shadow-xl"
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
          <div className="bg-white rounded-[32px] shadow-2xl max-w-xl w-full p-8 md:p-10 relative border-2 border-[#ded2bf] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              aria-label="Close modal"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#5c5549] hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Image
                src="/images/waggin-logos.png"
                alt="Waggin Meals logo"
                width={140}
                height={140}
                className="rounded-full border-2 border-[#ded2bf] shadow-lg bg-[#f5f1ea]"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#bc2c2c] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Save $25 Today
                </p>
                <h3 className="text-3xl text-[#1f1a16] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Join Our Nutrition Newsletter
                </h3>
                <p className="text-sm text-[#4a443b] mb-5 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Get weekly meal prep tips, palette inspiration, exclusive recipes, and VIP-only discounts delivered to your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-full border-2 border-[#ded2bf] px-5 py-3 text-sm focus:outline-none focus:border-[#bc2c2c] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  <button
                    type="submit"
                    className="bg-[#2f4b38] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1d3425] transition-colors shadow-lg hover:shadow-xl"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Claim My $25
                  </button>
                </form>
                <p className="text-xs text-[#666666] mt-3 text-center sm:text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Note: Newsletter signup will be connected to your email system when ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Section */}
      <section className="bg-[#f5f1ea] border-t border-[#ded2bf] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#2f4b38] p-8 shadow-lg">
            <div className="text-center mb-6">
              <ShieldCheck className="w-12 h-12 text-[#2f4b38] mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-[#2f4b38] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Our Promise
              </h3>
            </div>

            <p className="text-base text-[#1f1a16] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              At Waggin Meals, we believe your dog deserves real food made with love. Our Gently Cooked Human Grade Food for Dogs is approved through the FDA Pet Feed Program and scientifically formulated by an Animal Nutritionist to meet AAFCO standards for dog(s) of all ages.
            </p>

            <div className="border-t border-[#ded2bf] pt-6">
              <h4 className="text-lg font-semibold text-[#2f4b38] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Important Info
              </h4>
              <p className="text-sm text-[#4a443b] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Please note: Our meals are specially formulated for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your vet for any health-related decisions about your dog.
              </p>
            </div>

            <div className="mt-6 text-center">
              <a
                href="mailto:wagginmeals@gmail.com?subject=Schedule%20Free%2015-Minute%20Consultation"
                className="inline-flex items-center gap-2 bg-[#bc2c2c] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#90211b] transition-colors shadow-md"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <CalendarDays className="w-4 h-4" />
                Schedule Your Free 15-Minute Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#2f4b38] to-[#1f3324] text-white mt-0">
        {/* Main Footer Content */}
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
                  className="rounded-full border border-[#ded2bf]"
                />
                <div>
                  <p className="text-base font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Waggin Meals
                  </p>
                  <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Holistic Nutrition Studio
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Specialized nutrition tailored to your dog's unique needs. Every meal scientifically formulated by Christie Webb, Certified Canine Nutritionist.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 opacity-90">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@wagginmeals.com" className="hover:text-[#f6a723] transition-colors">
                    info@wagginmeals.com
                  </a>
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-[#f6a723] transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>
                  <Link href="/" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/nutrition-services" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Pet Nutrition Services
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Pet Nutrition Insights
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Resources
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>
                  <Link href="/feeding-calculator" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Feeding Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/guides/fresh-food-guide" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Fresh Food Guide
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Free PDF Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Legal
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>
                  <Link href="/shipping" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="https://shopify.com/75736613077/account" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">
                    My Account
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Compliance & Certifications */}
          <div className="border-t border-white/20 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    FDA Pet Feed Program
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Licensed human-grade kitchen with documented batch tracking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie Formulated
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Dual-master's Canine Integrative Animal Nutritionist oversight.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
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

          {/* Twisted Laurel Restaurant Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 shadow-lg">
              <UtensilsCrossed className="w-5 h-5 text-[#f6a723]" />
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  As Served At
                </p>
                <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Twisted Laurel Restaurant · Asheville, NC
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
