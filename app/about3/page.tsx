'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  Facebook,
  Instagram,
  ArrowRight
} from 'lucide-react';

// Team member data with full bios
const teamData = {
  christie: {
    name: 'Christie Willett, M.A., M.S.',
    role: 'Founder & Animal Nutritionist',
    image: '/images/Christy-holding-black-dog.webp',
    shortBio: 'With dual master\'s degrees in Animal Science and pursuing her PhD in obesity, stress, and gerodietic nutrition in canines.',
    fullBio: `Christie A. Willett holds a Master's degree in Animal Science with a focus on nutrition from the University of Tennessee and is currently pursuing her PhD. Raised in the mountains of Western North Carolina, she grew up traveling with her minister father and gospel singer mother.

The catalyst for Waggin Meals came through devastating loss: her father died in 2016, followed by her mother's death from NASH liver disease in November 2019. Just two months later, her beloved dachshund Jack was diagnosed with the same disease.

"After many tears and a trip to the farmers market, I set out to create a simple yet wholesome alternative to store-bought dog food," she explains. Today, she's a Certified Pet Nutrition Coach and Integrative Animal Nutritionist who has helped transform over 520 dogs' lives through personalized nutrition.

Beyond Waggin Meals, Christie operates God's Paws for a Cause, a non-profit that ships surprise boxes to people in need, and established the #4Jack Fund to assist families with unforeseen veterinary expenses.`,
    credentials: ['M.A. Animal Science', 'M.S. Animal Science', 'PhD in Progress (Canine Obesity & Nutrition)', 'Certified Pet Nutrition Coach', 'Integrative Animal Nutritionist'],
    stats: { number: '520+', label: 'Dogs Transformed' },
    badge: 'Founder'
  },
  tres: {
    name: 'Tres Naquin (CJ)',
    role: 'CFO & Director of Operations',
    image: null,
    initials: 'TN',
    shortBio: 'The operational backbone of Waggin Meals. Manages finances, oversees production logistics, and personally inspects every package.',
    fullBio: `Tres "CJ" Naquin is the CFO and Director of Operations at Waggin Meals, bringing years of business management and operational expertise to ensure every aspect of the company runs smoothly.

As the operational backbone, Tres manages all financial operations, oversees production logistics, coordinates deliveries, and personally inspects every package before it ships to ensure it meets Waggin Meals' exacting standards.

Famous among the team for hand-rolling our best-selling meatballs, Tres brings a hands-on approach to leadership. His attention to detail and commitment to quality control ensures that every customer receives the highest quality products.

Beyond the numbers and logistics, Tres is passionate about building sustainable systems that allow Waggin Meals to scale while maintaining the personal touch and quality that makes the company special.`,
    credentials: ['Business Management', 'Financial Operations', 'Production Logistics', 'Quality Control'],
    badge: 'CFO'
  },
  kristen: {
    name: 'Kristen Peterson',
    role: 'Executive Operations Coordinator',
    image: '/images/executive-operations-coordinator.png',
    shortBio: 'Christie\'s right hand and the calm, capable heart that keeps everything moving. Manages customer accounts and supports daily operations.',
    fullBio: `Kristen Peterson is Christie's right hand and the calm, capable heart that keeps Waggin Meals running smoothly every single day. Born and raised in Western North Carolina, Kristen brings local knowledge and genuine care to every interaction.

Currently studying to become a Veterinary Technician, Kristen manages customer accounts, coordinates between the farm kitchen and customers, handles order fulfillment, and ensures that every customer receives personalized attention and support.

Beyond her day-to-day coordination role, Kristen manages her own farm full of animals, giving her firsthand understanding of the care and attention that goes into raising healthy, happy pets. Her empathy and organizational skills make her an invaluable member of the team.

As Christie says: "She's not only my right hand—she's the calm, capable heart that keeps everything moving. Kristen is loyal, dependable, and genuinely cares about every dog we serve."`,
    credentials: ['Veterinary Technician (In Progress)', 'Customer Account Management', 'Operations Coordination', 'Farm Management'],
    badge: 'Operations'
  },
  tina: {
    name: 'Tina Smith',
    role: 'Production & HR Director',
    image: null,
    initials: 'TS',
    shortBio: 'Oversees ingredient sourcing, FDA compliance, small-batch production, and manages our growing team.',
    fullBio: `Tina Smith serves as the Production and HR Director at Waggin Meals, ensuring that every meal meets the highest standards of quality and safety while building and nurturing our team.

With extensive experience in food production and regulatory compliance, Tina oversees all aspects of ingredient sourcing, working directly with local Blue Ridge Mountain farmers to secure the freshest, highest-quality ingredients. She ensures every batch meets FDA standards and AAFCO guidelines.

As HR Director, Tina is responsible for recruiting, training, and supporting our team members, creating a work environment that reflects Waggin Meals' values of compassion, excellence, and community.

Her dual role uniquely positions her to ensure that our production processes not only meet regulatory requirements but also maintain the handcrafted, small-batch quality that makes Waggin Meals special. Tina's commitment to both product excellence and team development ensures Waggin Meals can grow while maintaining its core values.`,
    credentials: ['Food Safety & Compliance', 'Small-Batch Production Management', 'Human Resources', 'Supply Chain Management'],
    badge: 'Production'
  }
};

export default function About3() {
  const [scrollY, setScrollY] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeModal]);

  const heroOpacity = Math.max(1 - scrollY / 600, 0);
  const heroScale = 1 + scrollY / 2000;
  const heroParallax = scrollY * 0.5;

  const timeline = [
    { year: '2016', title: 'A Father\'s Loss', description: 'Christie\'s father passes away, beginning a journey of grief and transformation.' },
    { year: '2019', title: 'Mother\'s Battle', description: 'Lost her mother to NASH liver disease in November.' },
    { year: '2020', title: 'Jack & The Mission', description: 'Beloved dachshund Jack diagnosed with same disease. Founded Waggin Meals.' },
    { year: '2020-2023', title: 'Growth & Impact', description: 'Opened farm kitchen, expanded nationwide, helped hundreds of dogs.' },
    { year: '2025', title: 'Today', description: '520+ dogs transformed. Building holistic pet sanctuary.' }
  ];

  return (
    <>
      <main className="bg-white scroll-smooth">
        {/* CINEMATIC HERO */}
        <section ref={heroRef} className="relative h-screen overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-100"
            style={{ transform: `scale(${heroScale})` }}
          >
            <Image
              src="/images/2025/09/Canine-Nutrtion-Services.webp"
              alt="Blue Ridge Mountains"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translateY(${-heroParallax}px)`,
              opacity: heroOpacity
            }}
          >
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto text-center">
                <div className="mb-8">
                  <span className="text-sm md:text-base uppercase tracking-[0.3em] text-purple-300 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    A story of love, loss, and purpose
                  </span>
                </div>

                <h1 className="mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <span className="block text-5xl md:text-6xl lg:text-8xl text-white font-light">When Grief</span>
                  <span className="block text-5xl md:text-6xl lg:text-8xl text-white font-normal">Became Our</span>
                  <span className="block text-5xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Greatest Teacher</span>
                </h1>

                <div className="max-w-2xl mx-auto mb-12 space-y-4">
                  <p className="text-lg md:text-xl lg:text-2xl text-white font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Christie Willett lost her mother and beloved dog Jack to the same disease.
                  </p>
                  <p className="text-lg md:text-xl lg:text-2xl text-purple-200 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    What happened next would transform the lives of thousands of dogs.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 text-white/60 animate-bounce">
                  <span className="text-sm uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Discover Our Journey
                  </span>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHRISTIE'S STORY */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-100">
                    <Image
                      src="/images/Christy-holding-black-dog.webp"
                      alt="Christie Willett"
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-xl">
                    <p className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>520+</p>
                    <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Dogs Transformed</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-[0.3em] mb-3 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Our Founder's Journey
                  </span>
                  <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Meet Christie Willett, M.A., M.S.
                  </h2>
                  <h3 className="text-xl text-purple-600 mb-6 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Founder, Animal Nutritionist, & Your Dog's Wellness Advocate
                  </h3>

                  <div className="space-y-4 text-gray-700 leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-purple-600 first-letter:float-left first-letter:mr-2 first-letter:leading-[0.8]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      When I lost both my mother and my beloved dachshund Jack to the same liver disease, I knew there had to be a better way. That devastating loss became my purpose: creating real, wholesome nutrition that treats dogs as the family members they are.
                    </p>

                    <p>
                      Christie holds dual Master of Arts (M.A.) and Master of Science (M.S.) degrees in Agriculture, specializing in Animal Nutrition. Currently pursuing her PhD in the chemistry of obesity, stress, and gerodietic nutrition in canines, she brings cutting-edge research and evidence-based practices to every meal she formulates.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-600 mb-6">
                    <p className="text-lg italic text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      "I believe food should be the first step toward healing—not the last."
                    </p>
                    <p className="text-sm font-semibold text-purple-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      — Christie Willett, M.A., M.S.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveModal('christie')}
                    className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all hover:scale-105"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Read Christie's Full Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-[0.3em] mb-3 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Our Journey
                </span>
                <h2 className="text-4xl md:text-5xl font-normal text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  From Loss to Purpose
                </h2>
              </div>

              <div className="relative">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 via-purple-400 to-pink-400 transform md:-translate-x-1/2" />

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
                      <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-purple-600 rounded-full transform md:-translate-x-1/2 border-4 border-white shadow-lg z-10" />

                      <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                        <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 transition-all duration-300 ${
                          activeTimeline === index ? 'shadow-2xl border-purple-400 scale-105' : ''
                        }`}>
                          <p className="text-3xl font-bold text-purple-600 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {item.year}
                          </p>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION - ALL 4 MEMBERS */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                The Hearts Behind<br />the Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                Meet the passionate team dedicated to transforming canine nutrition
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {Object.entries(teamData).map(([key, member]) => (
                <div
                  key={key}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() => setActiveModal(key)}
                >
                  <div className="relative h-80 overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <span className="text-7xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {member.initials}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {member.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {member.shortBio}
                    </p>
                    <button className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Read Full Bio
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT SETS US APART - BENTO GRID */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                What Sets Us Apart
              </h2>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Featured Item - Farm to Bowl */}
              <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-96 md:h-auto">
                <Image
                  src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                  alt="Farm to Bowl"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Farm to Bowl
                  </h3>
                  <p className="text-white/90 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Every ingredient hand-selected from local Blue Ridge Mountain farms
                  </p>
                </div>
              </div>

              {/* Science-Based Card */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6">
                  <FlaskConical className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Science-Based
                </h3>
                <p className="text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Formulated by credentialed nutritionists with advanced degrees
                </p>
              </div>

              {/* Personalized Card */}
              <div className="bg-purple-50 p-8 rounded-3xl flex flex-col justify-center shadow-xl hover:shadow-2xl transition-all duration-300">
                <HeartPulse className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Personalized
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Custom meal plans for your dog's unique needs
                </p>
              </div>

              {/* Compassionate Card */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-3xl flex flex-col justify-center shadow-xl hover:shadow-2xl transition-all duration-300">
                <Gift className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Compassionate
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Giving back through God's Paws and #4Jack Fund
                </p>
              </div>

              {/* 520+ Dogs Transformed - Wide Featured */}
              <div className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-64">
                <Image
                  src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                  alt="Quality Meals"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-center">
                  <h3 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    520+ Dogs Transformed
                  </h3>
                  <p className="text-white/90 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Real results from real nutrition
                  </p>
                </div>
              </div>

              {/* 100% Real Ingredients */}
              <div className="bg-purple-600 p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  100%
                </div>
                <p className="text-white/90 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  REAL INGREDIENTS
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What We Stand For
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Core Values
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {[
                { icon: Leaf, title: 'Farm Fresh', description: 'Local Blue Ridge Mountain farms', color: '#9657EE' },
                { icon: FlaskConical, title: 'Science-Based', description: 'Credentialed nutritionists', color: '#A855F7' },
                { icon: HeartPulse, title: 'Personalized', description: 'Custom meal plans', color: '#C26AF0' },
                { icon: Gift, title: 'Compassionate', description: 'Giving back to community', color: '#EC4899' }
              ].map((value, idx) => {
                const IconComponent = value.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg" style={{ backgroundColor: value.color }}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FARM TO BOWL PROGRESSION */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Farm-to-Bowl Journey
              </h2>
              <p className="text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Every meal follows a rigorous process from local farms to your dog's bowl
              </p>
            </div>

            <div className="relative mb-16">
              <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-400 to-pink-400" style={{ top: '2rem' }} />

              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
                {[
                  { icon: Leaf, title: 'Local Farm Sourcing', description: 'Blue Ridge Mountain farms' },
                  { icon: CheckCircle2, title: 'Hand-Selected', description: 'Quality inspected' },
                  { icon: UtensilsCrossed, title: 'Small-Batch Cooking', description: 'Gently cooked' },
                  { icon: ShieldCheck, title: 'Quality Testing', description: 'Every batch tested' },
                  { icon: Truck, title: 'Delivered Fresh', description: 'Frozen for freshness' }
                ].map((step, idx) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={idx} className="relative text-center">
                      <div className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                  alt="Fresh beef and sweet potato bowl"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
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

        {/* CERTIFICATIONS */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Certifications & Recognition
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { icon: ShieldCheck, title: 'FDA Approved', description: 'Pet Food Program certified' },
                { icon: Award, title: 'AAFCO Standards', description: 'Complete nutrition certified' },
                { icon: FlaskConical, title: 'Advanced Degrees', description: 'M.A. & M.S. in Agriculture' },
                { icon: HeartPulse, title: '520+ Dogs', description: 'Successfully transformed' }
              ].map((cert, idx) => {
                const IconComponent = cert.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {cert.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMMUNITY IMPACT */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Community Impact
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white mb-6 shadow-lg">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  God's Paws for a Cause
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Our non-profit initiative sending care packages nationwide to dogs in need. Through community partnerships and generous donors, we're nourishing dogs who might otherwise go hungry.
                </p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Playfair Display, serif' }}>520+</p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Dogs Helped</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Playfair Display, serif' }}>12</p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>States Reached</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-10 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  The #4Jack Fund
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Named in honor of Christie's beloved dachshund Jack, this fund helps families facing unexpected veterinary expenses. Because no pet parent should have to choose between their dog's health and financial hardship.
                </p>
                <p className="text-purple-600 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  In memory of Jack, who taught us that love is the best medicine 💜
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Stories That Matter
              </h2>
              <p className="text-xl text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Real transformations from real pet parents
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                { name: 'Matt Wolfe + Maisy', text: 'Our dog Maisy absolutely devours the fresh meals that Christie prepares. Can\'t recommend her enough.' },
                { name: 'Elizabeth Joslin', text: 'Christie is so helpful, kind & very knowledgeable. You can tell she genuinely cares about your dog\'s health.' },
                { name: 'Amber Munoz', text: 'My dogs love this food!! Both my girls look forward to meal times and jump for joy.' }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-200 text-lg mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {testimonial.name[0]}
                      </span>
                    </div>
                    <div className="text-white font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {testimonial.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US - COMPARISON */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Why Choose Us
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                The Waggin Meals Difference
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
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

        {/* VISIT US - FARM SHOP */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
              {/* Left - Image */}
              <div className="relative h-96 lg:h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/2025/09/Canine-Nutrtion-Services.webp"
                  alt="Waggin Meals Farm Shop"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right - Location Details */}
              <div>
                <p className="text-sm font-semibold text-[#9657EE] mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Visit Us
                </p>
                <h2 className="text-4xl font-bold text-[#2b1d3b] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Find Our Farm Shop
                </h2>

                <div className="space-y-6">
                  {/* Hours */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
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
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
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
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5E3B76] to-[#9657EE] flex items-center justify-center text-white flex-shrink-0">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#2b1d3b] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          We Deliver
                        </h3>
                        <p className="text-sm text-[#6e5c8f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Shipping nationwide with fresh meals delivered right to your door
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-32 md:py-40 bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Dog's Health<br />
                <span className="text-emerald-100">Transformation Starts Today</span>
              </h2>

              <p className="text-xl md:text-2xl text-white mb-12" style={{ fontFamily: 'Inter, sans-serif' }}>
                Join hundreds of pet parents who've discovered the power of real nutrition
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/nutrition-services"
                  className="group px-10 py-5 bg-white text-teal-700 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shop"
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Explore Meals</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Personal Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:wagginmeals@gmail.com" className="hover:text-white transition-colors">
                    wagginmeals@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Alexander, NC</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER - VARIATION K STYLE */}
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
                  <Award className="w-5 h-5 text-[#e6b4ff] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Christie Formulated
                    </p>
                    <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Oversight from a dual master's-degreed canine integrative animal nutritionist.
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

      {/* MODAL SYSTEM */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-3xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                {teamData[activeModal as keyof typeof teamData].name}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  {teamData[activeModal as keyof typeof teamData].image ? (
                    <div className="relative h-80 rounded-2xl overflow-hidden">
                      <Image
                        src={teamData[activeModal as keyof typeof teamData].image!}
                        alt={teamData[activeModal as keyof typeof teamData].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                      <span className="text-8xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {teamData[activeModal as keyof typeof teamData].initials}
                      </span>
                    </div>
                  )}

                  <div className="mt-6">
                    <p className="text-purple-600 font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {teamData[activeModal as keyof typeof teamData].role}
                    </p>
                    <div className="space-y-2">
                      {teamData[activeModal as keyof typeof teamData].credentials.map((cred, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>{cred}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="prose prose-lg max-w-none">
                    {teamData[activeModal as keyof typeof teamData].fullBio.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {teamData[activeModal as keyof typeof teamData].stats && (
                    <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                      <p className="text-5xl font-bold text-purple-600 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {teamData[activeModal as keyof typeof teamData].stats?.number}
                      </p>
                      <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {teamData[activeModal as keyof typeof teamData].stats?.label}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
