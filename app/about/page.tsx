'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  Leaf,
  FlaskConical,
  HeartPulse,
  Gift,
  CheckCircle2,
  UtensilsCrossed,
  ShieldCheck,
  Truck,
  X as XIcon,
  Award,
  Star,
  ChevronDown,
  MapPin,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

// Timeline data
const timeline = [
  {
    year: '2019',
    title: 'A Devastating Loss',
    description: 'Christie lost her mother to NASH liver disease, beginning a journey that would change countless dogs\' lives.'
  },
  {
    year: '2020',
    title: 'Jack & The Mission',
    description: 'Lost beloved dachshund Jack to the same liver disease. Founded Waggin Meals to transform pet nutrition through food as medicine.'
  },
  {
    year: '2020',
    title: 'Farm Shop Opens',
    description: 'Opened commercial farm kitchen in Alexander, NC, bringing fresh, scientifically-formulated meals to Western North Carolina.'
  },
  {
    year: '2021-2023',
    title: 'Nationwide Expansion',
    description: 'Expanded shipping nationwide, bringing farm-fresh nutrition to dogs across America, including our Florida friends!'
  },
  {
    year: '2025',
    title: 'Holistic Sanctuary',
    description: 'Building a holistic pet sanctuary, continuing the mission of healing through nutrition and compassionate care.'
  }
];

// Values data
const values = [
  {
    icon: Leaf,
    title: 'Farm Fresh',
    description: 'Ingredients sourced from local Blue Ridge Mountain farms and trusted partners.',
    color: '#5E3B76'
  },
  {
    icon: FlaskConical,
    title: 'Science-Based',
    description: 'Formulated by credentialed animal nutritionists with advanced degrees.',
    color: '#9657EE'
  },
  {
    icon: HeartPulse,
    title: 'Personalized',
    description: 'Custom meal plans based on your dog\'s unique needs and health goals.',
    color: '#C26AF0'
  },
  {
    icon: Gift,
    title: 'Compassionate',
    description: 'Giving back through God\'s Paws for a Cause and the #4Jack Fund.',
    color: '#7e43c4'
  }
];

// Process steps
const processSteps = [
  { icon: Leaf, title: 'Local Farm Sourcing', description: 'From Blue Ridge Mountain farms' },
  { icon: CheckCircle2, title: 'Hand-Selected Ingredients', description: 'Quality inspected' },
  { icon: UtensilsCrossed, title: 'Small-Batch Cooking', description: 'Gently cooked in our kitchen' },
  { icon: ShieldCheck, title: 'Quality Inspection', description: 'Every batch tested' },
  { icon: Truck, title: 'Delivered Fresh', description: 'Frozen for freshness' }
];

// Team members
const team = [
  {
    name: 'Christie Willett',
    title: 'Founder & Animal Nutritionist',
    credentials: 'M.A., M.S. in Agriculture',
    image: '/images/Christy-holding-black-dog.webp',
    bio: 'With M.A. and M.S. degrees in Animal Science, Christie is currently pursuing her PhD in the chemistry of obesity, stress, and gerodietic nutrition in canines. She brings cutting-edge research and evidence-based practices to every meal she formulates.',
    quote: '"I believe food should be the first step toward healing—not the last."'
  },
  {
    name: 'Tres Naquin (CJ)',
    title: 'CFO & Director of Operations',
    credentials: 'Operations & Business Management',
    image: null,
    initials: 'TN',
    bio: 'The operational backbone of Waggin Meals. Tres manages finances, oversees production logistics, coordinates deliveries, and personally inspects every package. Famous for hand-rolling our best-selling meatballs!',
    quote: null
  },
  {
    name: 'Kristen Peterson',
    title: 'Executive Operations Coordinator',
    credentials: 'Studying to become a Veterinary Technician',
    image: '/images/executive-operations-coordinator.png',
    bio: 'Kristen is Christie\'s right hand and the calm, capable heart that keeps everything moving. Born and raised in Western North Carolina, she manages customer accounts, supports daily operations, and cares for her own farm full of animals.',
    quote: '"She\'s not only my right hand—she\'s the calm, capable heart that keeps everything moving. Kristen is loyal and dependable." — Christie Willett'
  }
];

// Testimonials
const testimonials = [
  {
    name: 'Matt Wolfe + Maisy',
    text: 'Our dog Maisy absolutely devours the fresh meals that Christie prepares. And it\'s satisfying to know the food is prepared by a pet nutritionist. Can\'t recommend her enough.',
    image: null
  },
  {
    name: 'Elizabeth Joslin',
    text: 'Our large pup loves their food and broth! Christie is so helpful, kind & very knowledgeable about canine nutrition! You can tell she genuinely cares about your dog\'s health and not just selling products.',
    image: null
  },
  {
    name: 'Amber Munoz',
    text: 'My dogs love this food!! I love the convenience and nutritional value this company provides. I know both of my dogs are getting the best quality ingredients. Both my girls look forward to meal times as they love the taste of the food and jump for joy.',
    image: null
  },
  {
    name: 'Thom Slater',
    text: 'Top notch, prepared fresh on-site healthiest possible dog meals and treats! Certified and experienced owners & staff who care about your pets and you!! The new location is fantastic!!',
    image: null
  }
];

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null);

  return (
    <main className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 py-20 md:py-28 overflow-hidden">
        {/* Purple gradient background with pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#9657EE] via-[#7e43c4] to-[#5E3B76]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-white rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
            From Our Family Farm
            <br />
            to Your Dog's Bowl
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Handcrafted nutrition rooted in science, driven by love, and inspired by loss turned to purpose
          </p>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white mx-auto" />
          </div>
        </div>
      </section>

      {/* 2. FOUNDER'S STORY SECTION */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left - Christie's Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#ead9ff]">
                <Image
                  src="/images/Christy-holding-black-dog.webp"
                  alt="Christie Willett with dog"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#5E3B76] to-[#9657EE] text-white px-6 py-4 rounded-2xl shadow-xl">
                <p className="text-2xl font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>520+</p>
                <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Dogs Transformed</p>
              </div>
            </div>

            {/* Right - Story Content */}
            <div>
              <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Our Founder's Journey
              </p>
              <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Meet Christie Willett, M.A., M.S.
              </h2>
              <h3 className="text-xl text-[#9657EE] mb-6 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Founder, Animal Nutritionist, & Your Dog's Wellness Advocate
              </h3>

              <div className="space-y-4 text-[15px] text-[#6e5c8f] leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <p>
                  When I lost both my mother and my beloved dachshund Jack to the same liver disease, I knew there had to be a better way. That devastating loss became my purpose: <strong>creating real, wholesome nutrition that treats dogs as the family members they are.</strong>
                </p>

                <p>
                  Christie holds dual <strong>Master of Arts (M.A.)</strong> and <strong>Master of Science (M.S.)</strong> degrees in Agriculture, specializing in Animal Nutrition. Currently pursuing her <strong>PhD in the chemistry of obesity, stress, and gerodietic nutrition in canines</strong>, she brings cutting-edge research and evidence-based practices to every meal she formulates.
                </p>

                <p>
                  What sets Christie apart is her personalized approach. She doesn't believe in one-size-fits-all solutions. Instead, she takes the time to understand each dog's unique needs—considering breed, age, weight, activity level, allergies, and medical conditions—to create <strong>customized meal plans that truly make a difference</strong>.
                </p>
              </div>

              {/* Quote box */}
              <div className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] rounded-2xl p-6 border-l-4 border-[#5E3B76]">
                <p className="text-lg italic text-[#2b1d3b] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  "I believe food should be the first step toward healing—not the last."
                </p>
                <p className="text-sm font-semibold text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  — Christie Willett, M.A., M.S.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. JOURNEY TIMELINE */}
      <section className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b]" style={{ fontFamily: "'Abril Fatface', serif" }}>
              From Loss to Purpose
            </h2>
          </div>

          <div className="relative">
            {/* Vertical gradient line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5E3B76] via-[#9657EE] to-[#C26AF0] transform md:-translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-start md:items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  onMouseEnter={() => setActiveTimeline(index)}
                  onMouseLeave={() => setActiveTimeline(null)}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#5E3B76] rounded-full transform md:-translate-x-1/2 border-4 border-white shadow-lg z-10" />

                  {/* Content card */}
                  <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-[#ead9ff] transition-all duration-300 ${
                      activeTimeline === index ? 'shadow-2xl border-[#9657EE] scale-105' : ''
                    }`}>
                      <p className="text-3xl font-bold text-[#9657EE] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        {item.year}
                      </p>
                      <h3 className="text-xl font-semibold text-[#2b1d3b] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#6e5c8f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET OUR TEAM */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              The People Behind the Bowls
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b]" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Meet Our Team
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#fdfbf7] to-white rounded-3xl border-2 border-[#ead9ff] shadow-lg p-6 hover:shadow-2xl hover:border-[#9657EE] transition-all duration-300 group"
              >
                {/* Team member image or initials */}
                <div className="mb-6">
                  {member.image ? (
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center">
                      <span className="text-6xl font-bold text-white" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        {member.initials}
                      </span>
                    </div>
                  )}
                </div>

                {/* Team member info */}
                <h3 className="text-2xl font-semibold text-[#2b1d3b] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-[#9657EE] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {member.title}
                </p>
                <p className="text-xs text-[#8a7ba8] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {member.credentials}
                </p>
                <p className="text-sm text-[#6e5c8f] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {member.bio}
                </p>

                {member.quote && (
                  <div className="border-l-3 border-[#9657EE] pl-4 bg-[#d8c6ff]/20 rounded-r-xl p-3">
                    <p className="text-xs italic text-[#2b1d3b]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {member.quote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR VALUES */}
      <section className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What We Stand For
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b]" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: value.color }}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2b1d3b] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#6e5c8f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FARM-TO-BOWL PROCESS */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Process
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Farm-to-Bowl Journey
            </h2>
            <p className="text-lg text-[#6e5c8f] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Every meal follows a rigorous process from local farms to your dog's bowl
            </p>
          </div>

          {/* Process flow */}
          <div className="relative mb-16">
            {/* Horizontal connecting line (hidden on mobile) */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-[#5E3B76] via-[#9657EE] to-[#C26AF0]" style={{ top: '2rem' }} />

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative text-center">
                    {/* Icon circle */}
                    <div className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white shadow-xl">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2b1d3b] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product images */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#ead9ff]">
              <Image
                src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                alt="Fresh beef and sweet potato bowl"
                width={800}
                height={600}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#ead9ff]">
              <Image
                src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                alt="Chicken superfood board"
                width={800}
                height={600}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR DIFFERENCE - Comparison */}
      <section className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Why Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b]" style={{ fontFamily: "'Abril Fatface', serif" }}>
              The Waggin Meals Difference
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Traditional Pet Food */}
              <div className="p-8 bg-gray-50">
                <h3 className="text-2xl font-semibold text-gray-600 mb-8 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Traditional Pet Food
                </h3>
                <div className="space-y-4">
                  {[
                    'Mass produced in factories',
                    'Unknown ingredient sourcing',
                    'One-size-fits-all formulas',
                    'Processed "feed" with fillers',
                    'Corporate distance from customers'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <XIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waggin Meals */}
              <div className="p-8 bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff]">
                <h3 className="text-2xl font-semibold text-[#5E3B76] mb-8 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Waggin Meals
                </h3>
                <div className="space-y-4">
                  {[
                    'Small batch crafted with care',
                    'Local farm partners we know personally',
                    'Personalized nutrition plans',
                    'Real, whole foods your dog will love',
                    'Direct nutritionist access & support'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#5E3B76] flex-shrink-0 mt-1" />
                      <p className="text-sm text-[#2b1d3b] font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CERTIFICATIONS & EXPERTISE */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Trust & Expertise
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b]" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Certifications & Recognition
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'FDA Approved', description: 'Pet Food Program certified' },
              { icon: Award, title: 'AAFCO Standards', description: 'Complete nutrition for all life stages' },
              { icon: FlaskConical, title: 'Advanced Degrees', description: 'M.A. & M.S. in Agriculture' },
              { icon: HeartPulse, title: '520+ Dogs', description: 'Successfully transformed' }
            ].map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] rounded-2xl p-6 text-center shadow-lg border-2 border-[#ead9ff] hover:shadow-2xl hover:border-[#9657EE] transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white shadow-lg">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2b1d3b] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {cert.title}
                  </h3>
                  <p className="text-sm text-[#6e5c8f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {cert.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. LOCATION & SERVICE AREA */}
      <section className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/images/2025/09/Canine-Nutrtion-Services.webp"
                alt="Waggin Meals Farm Shop"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Right - Location Details */}
            <div>
              <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Visit Us
              </p>
              <h2 className="text-4xl font-normal text-[#2b1d3b] mb-8" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Find Our Farm Shop
              </h2>

              <div className="space-y-6">
                {/* Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2b1d3b] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Farm Shop Hours
                      </h3>
                      <p className="text-sm text-[#6e5c8f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM<br />
                        <strong>Saturday:</strong> 10:00 AM - 3:00 PM<br />
                        <strong>Sunday:</strong> Closed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2b1d3b] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Our Location
                      </h3>
                      <p className="text-sm text-[#6e5c8f] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <strong>768 Alexander Road</strong><br />
                        Alexander, NC 28701
                      </p>
                      <p className="text-xs text-[#8a7ba8] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        By appointment recommended
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Area */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white flex-shrink-0">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2b1d3b] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        We Deliver
                      </h3>
                      <p className="text-sm text-[#6e5c8f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <strong>Local delivery</strong> throughout Western North Carolina<br />
                        <strong>Nationwide shipping</strong> - Fresh frozen meals delivered to your door<br />
                        <span className="text-[#9657EE] font-semibold">Free shipping on orders over $165!</span>
                      </p>
                      <p className="text-sm text-[#9657EE] font-semibold mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Proudly serving our Florida friends from NC! 🌴
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <Link
                  href="/contact"
                  className="block w-full bg-gradient-to-r from-[#5E3B76] to-[#9657EE] text-white px-8 py-4 rounded-full text-center font-semibold hover:shadow-2xl transition-all duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Get Directions & Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. COMMUNITY IMPACT */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Giving Back
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b]" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Community Impact
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* God's Paws for a Cause */}
            <div className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white mb-6 shadow-lg">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-[#2b1d3b] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                God's Paws for a Cause
              </h3>
              <p className="text-sm text-[#6e5c8f] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Our non-profit initiative sending care packages nationwide to dogs in need. Through community partnerships and generous donors, we're nourishing dogs who might otherwise go hungry.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#5E3B76]" style={{ fontFamily: "'Abril Fatface', serif" }}>520+</p>
                  <p className="text-xs text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>Dogs Helped</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#5E3B76]" style={{ fontFamily: "'Abril Fatface', serif" }}>12</p>
                  <p className="text-xs text-[#8a7ba8]" style={{ fontFamily: "'Poppins', sans-serif" }}>States Reached</p>
                </div>
              </div>
            </div>

            {/* #4Jack Fund */}
            <div className="bg-gradient-to-br from-[#e9dcff] to-[#d8c6ff] rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9657EE] to-[#C26AF0] flex items-center justify-center text-white mb-6 shadow-lg">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-[#2b1d3b] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                The #4Jack Fund
              </h3>
              <p className="text-sm text-[#6e5c8f] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Named in honor of Christie's beloved dachshund Jack, this fund helps families facing unexpected veterinary expenses. Because no pet parent should have to choose between their dog's health and financial hardship.
              </p>
              <p className="text-sm font-semibold text-[#5E3B76]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                In memory of Jack, who taught us that love is the best medicine 💜
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section className="bg-gradient-to-br from-[#d8c6ff] to-[#e9dcff] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What Pet Parents Say
            </p>
            <h2 className="text-4xl md:text-5xl font-normal text-[#2b1d3b] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Happy Customers & Waggin Tails
            </h2>
            <p className="text-lg text-[#6e5c8f] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Real stories from real pet parents who trusted us with their dog's health
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Quote mark */}
                <div className="text-6xl text-[#9657EE] opacity-20 leading-none mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  "
                </div>

                {/* Testimonial text */}
                <p className="text-sm text-[#6e5c8f] leading-relaxed mb-6 italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {testimonial.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white font-bold shadow-md">
                    <span style={{ fontFamily: "'Abril Fatface', serif" }}>
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2b1d3b]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {testimonial.name}
                    </p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#9657EE] fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View all testimonials */}
          <div className="text-center mt-12">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5E3B76] to-[#9657EE] text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-300"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Read More Success Stories
              <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 12. CONSULTATION CTA */}
      <section className="relative px-4 py-20 overflow-hidden">
        {/* Purple gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5E3B76] via-[#9657EE] to-[#C26AF0]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Your Dog's Health Transformation Starts Here
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Book a personalized nutrition consultation with Christie
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: FlaskConical, text: 'Bloodwork analysis' },
              { icon: UtensilsCrossed, text: 'Custom meal plans' },
              { icon: HeartPulse, text: 'One-on-one guidance' },
              { icon: Gift, text: 'Ongoing support' }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nutrition-services"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#5E3B76] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Schedule Consultation
              <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Fresh Meals
            </Link>
          </div>

          {/* Contact info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <a href="tel:+1234567890" className="text-sm hover:text-white transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Contact Us
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <a href="mailto:wagginmeals@gmail.com" className="text-sm hover:text-white transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                wagginmeals@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
