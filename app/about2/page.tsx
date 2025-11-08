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
  Award,
  Star,
  ChevronDown,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  PlayCircle,
  ArrowRight
} from 'lucide-react';

export default function About2() {
  const [scrollY, setScrollY] = useState(0);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetHeight;
        setIsHeroInView(window.scrollY < heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroOpacity = Math.max(1 - scrollY / 600, 0);
  const heroScale = 1 + scrollY / 2000;
  const heroParallax = scrollY * 0.5;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          scroll-behavior: smooth;
        }

        .cinematic-hero {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          transform: scale(${heroScale});
          transition: transform 0.1s ease-out;
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%);
        }

        .hero-content-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(${-heroParallax}px);
          opacity: ${heroOpacity};
        }

        .split-text-line {
          display: block;
          animation: fadeInUp 1s ease-out backwards;
        }

        .split-text-line:nth-child(1) {
          animation-delay: 0.2s;
          font-weight: 300;
        }

        .split-text-line:nth-child(2) {
          animation-delay: 0.4s;
          font-weight: 400;
        }

        .split-text-line:nth-child(3) {
          animation-delay: 0.6s;
          font-weight: 700;
          background: linear-gradient(135deg, #8FAE8F 0%, #5E8C8C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-paragraph {
          animation: fadeInUp 1s ease-out 0.8s backwards;
        }

        .scroll-indicator {
          animation: fadeInUp 1s ease-out 1s backwards, bounce 2s ease-in-out 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .magnetic-button {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .magnetic-button:hover {
          transform: scale(1.05);
        }

        .team-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .team-card:hover {
          transform: translateY(-12px);
        }

        .team-card:hover .team-card-image {
          transform: scale(1.05);
        }

        .team-card-image {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          grid-auto-rows: 200px;
        }

        .bento-item {
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          transition: transform 0.3s ease;
        }

        .bento-item:hover {
          transform: scale(1.02);
        }

        .bento-large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .bento-tall {
          grid-row: span 2;
        }

        .bento-wide {
          grid-column: span 2;
        }

        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          .bento-large, .bento-wide {
            grid-column: span 1;
          }
        }

        .testimonial-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .testimonial-card:hover {
          transform: scale(1.05);
        }

        .testimonial-card:hover .play-overlay {
          opacity: 1;
        }

        .play-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-number {
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .drop-cap::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 4.5rem;
          font-weight: 700;
          float: left;
          line-height: 0.8;
          margin: 0.1em 0.1em 0 0;
          color: #8FAE8F;
        }

        .gradient-text {
          background: linear-gradient(135deg, #8FAE8F 0%, #5E8C8C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .reveal-text {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .reveal-text.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }

        .floating-element:nth-child(2) {
          animation-delay: 2s;
        }

        .floating-element:nth-child(3) {
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>

      <main className="bg-white">
        {/* CINEMATIC HERO SECTION */}
        <section ref={heroRef} className="cinematic-hero">
          {/* Background Image with Parallax */}
          <div className="hero-background">
            <Image
              src="/images/2025/09/Canine-Nutrtion-Services.webp"
              alt="Blue Ridge Mountains"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </div>

          {/* Dark Gradient Overlay */}
          <div className="hero-gradient-overlay" />

          {/* Hero Content */}
          <div className="hero-content-wrapper">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto text-center">
                {/* Intro Text */}
                <div className="mb-8 opacity-90">
                  <span className="text-sm md:text-base uppercase tracking-[0.3em] text-[#8FAE8F]/70 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    A story of love, loss, and purpose
                  </span>
                </div>

                {/* Main Headline with Split Text Animation */}
                <h1 className="mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <span className="split-text-line text-5xl md:text-6xl lg:text-8xl text-white">When Grief</span>
                  <span className="split-text-line text-5xl md:text-6xl lg:text-8xl text-white">Became Our</span>
                  <span className="split-text-line text-5xl md:text-6xl lg:text-8xl">Greatest Teacher</span>
                </h1>

                {/* Hero Paragraph */}
                <div className="hero-paragraph max-w-2xl mx-auto mb-12 space-y-4">
                  <p className="text-lg md:text-xl lg:text-2xl text-white font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Christie Willett lost her mother and beloved dog Jack to the same disease.
                  </p>
                  <p className="text-lg md:text-xl lg:text-2xl text-[#8FAE8F]/80 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    What happened next would transform the lives of thousands of dogs.
                  </p>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator flex flex-col items-center gap-3 text-white/60">
                  <span className="text-sm uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Discover Our Journey
                  </span>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDITORIAL STORY SECTION */}
        <section className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-12">
                {/* Sidebar Chapter Navigation */}
                <div className="lg:col-span-2">
                  <div className="lg:sticky lg:top-24">
                    <span className="text-xs uppercase tracking-widest text-[#8FAE8F] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Chapter 01
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      The Beginning
                    </h3>
                    <div className="mt-6 flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#8FAE8F]" />
                      <div className="w-2 h-2 rounded-full bg-[#8FAE8F]/30" />
                      <div className="w-2 h-2 rounded-full bg-[#8FAE8F]/20" />
                    </div>
                  </div>
                </div>

                {/* Main Story Content */}
                <div className="lg:col-span-8">
                  <div className="prose prose-lg max-w-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="drop-cap">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        In November 2019, my world shattered when my mother lost her battle with NASH liver disease. The grief was overwhelming, but I didn't know it was only the beginning of a journey that would define the rest of my life.
                      </p>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg mt-6">
                      Just months later, my beloved dachshund Jack—my constant companion, my shadow, my heart—was diagnosed with the same devastating disease. I watched helplessly as he deteriorated, trying everything conventional veterinary medicine offered. Nothing worked.
                    </p>

                    {/* Pull Quote */}
                    <blockquote className="my-12 py-8 px-6 bg-[#F8F5F0] rounded-2xl border-l-4 border-[#8FAE8F]">
                      <p className="text-2xl md:text-3xl font-light text-gray-900 italic mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        "I knew there had to be a better way. Jack's memory became my mission."
                      </p>
                      <cite className="text-sm uppercase tracking-wider text-[#8FAE8F] font-semibold not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                        — Christie Willett, Founder
                      </cite>
                    </blockquote>

                    <p className="text-gray-700 leading-relaxed text-lg">
                      In my darkest moment, I made a promise: no other dog parent would feel this helpless. I would dedicate my life to understanding the power of nutrition as preventive medicine. With my Master's degrees in hand and a PhD program ahead of me, I dove into research that would eventually become Waggin Meals.
                    </p>

                    {/* Image Break */}
                    <figure className="my-12">
                      <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                          src="/images/Christy-holding-black-dog.webp"
                          alt="Christie with her dog"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="mt-4 text-center text-sm text-gray-500 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Christie with one of the hundreds of dogs whose lives have been transformed
                      </figcaption>
                    </figure>

                    <p className="text-gray-700 leading-relaxed text-lg">
                      Today, over 520 dogs have experienced the transformative power of scientifically-formulated, farm-fresh nutrition. Each meal we create honors Jack's memory and my mother's legacy. This isn't just a business—it's a mission born from loss and fueled by love.
                    </p>
                  </div>
                </div>

                {/* Timeline Sidebar */}
                <div className="lg:col-span-2">
                  <div className="lg:sticky lg:top-24">
                    <div className="space-y-6">
                      {[
                        { year: '2019', label: 'Loss' },
                        { year: '2020', label: 'Mission' },
                        { year: '2021', label: 'Growth' },
                        { year: '2025', label: 'Legacy' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8FAE8F]/10 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#8FAE8F]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#8FAE8F]" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {item.year}
                            </div>
                            <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {item.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* APPLE-STYLE TEAM SECTION */}
        <section className="py-24 md:py-32 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
                The Hearts Behind<br />the Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                Meet the passionate team dedicated to transforming canine nutrition
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Christie Card */}
              <article className="team-card bg-white rounded-3xl overflow-hidden shadow-xl">
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-4 py-2 bg-[#8FAE8F] text-white text-xs font-bold uppercase tracking-wider rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Founder
                    </span>
                  </div>
                  <Image
                    src="/images/Christy-holding-black-dog.webp"
                    alt="Christie Willett"
                    fill
                    className="team-card-image object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Christie Willett
                  </h3>
                  <p className="text-[#8FAE8F] font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    M.A., M.S. in Agriculture
                  </p>
                  <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Animal Nutritionist & Founder
                  </p>

                  <div className="flex gap-6 mb-6">
                    <div>
                      <div className="text-3xl font-bold text-[#8FAE8F]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        520+
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Dogs Helped
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#8FAE8F]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        5+
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Years Research
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Currently pursuing PhD in obesity, stress, and gerodietic nutrition in canines. Brings cutting-edge research to every meal formulated.
                  </p>

                  <button className="magnetic-button w-full px-6 py-3 bg-[#8FAE8F] text-white font-semibold rounded-full hover:bg-[#6d8c6d] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Read Full Story
                  </button>
                </div>
              </article>

              {/* Tres Card */}
              <article className="team-card bg-white rounded-3xl overflow-hidden shadow-xl">
                <div className="relative h-80 bg-[#8FAE8F] flex items-center justify-center">
                  <div className="text-8xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    TN
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Tres Naquin (CJ)
                  </h3>
                  <p className="text-[#8FAE8F] font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    CFO & Director of Operations
                  </p>
                  <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Operations & Business Management
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    The operational backbone of Waggin Meals. Manages finances, oversees production logistics, coordinates deliveries, and personally inspects every package. Famous for hand-rolling our best-selling meatballs!
                  </p>
                </div>
              </article>

              {/* Kristen Card */}
              <article className="team-card bg-white rounded-3xl overflow-hidden shadow-xl">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src="/images/executive-operations-coordinator.png"
                    alt="Kristen Peterson"
                    fill
                    className="team-card-image object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Kristen Peterson
                  </h3>
                  <p className="text-[#8FAE8F] font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Executive Operations Coordinator
                  </p>
                  <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Studying to become a Veterinary Technician
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Christie's right hand and the calm, capable heart that keeps everything moving. Born and raised in Western North Carolina, manages customer accounts and cares for her own farm full of animals.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* BENTO BOX VALUES SECTION */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
                What Sets Us Apart
              </h2>
            </div>

            <div className="max-w-7xl mx-auto bento-grid">
              {/* Large Video/Image Item */}
              <div className="bento-item bento-large relative group">
                <Image
                  src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                  alt="Farm to Bowl"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Farm to Bowl
                  </h3>
                  <p className="text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Every ingredient hand-selected from local Blue Ridge Mountain farms
                  </p>
                </div>
              </div>

              {/* Tall Purple Gradient */}
              <div className="bento-item bento-tall bg-[#8FAE8F] p-8 flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6">
                  <FlaskConical className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Science-Based
                </h3>
                <p className="text-white/90 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Formulated by credentialed nutritionists with advanced degrees
                </p>
              </div>

              {/* Regular Item */}
              <div className="bento-item bg-[#F8F5F0] p-8 flex flex-col justify-center">
                <HeartPulse className="w-12 h-12 text-[#8FAE8F] mb-4" />
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Personalized
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Custom meal plans for your dog's unique needs
                </p>
              </div>

              {/* Regular Item */}
              <div className="bento-item bg-[#F8F5F0] p-8 flex flex-col justify-center">
                <Gift className="w-12 h-12 text-[#8FAE8F] mb-4" />
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Compassionate
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Giving back through God's Paws and #4Jack Fund
                </p>
              </div>

              {/* Wide Item */}
              <div className="bento-item bento-wide relative">
                <Image
                  src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                  alt="Quality Meals"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    520+ Dogs Transformed
                  </h3>
                  <p className="text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Real results from real nutrition
                  </p>
                </div>
              </div>

              {/* Regular Item */}
              <div className="bento-item bg-[#8FAE8F] p-8 flex flex-col justify-center items-center text-center">
                <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  100%
                </div>
                <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  REAL INGREDIENTS
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NETFLIX-STYLE TESTIMONIALS */}
        <section className="py-24 md:py-32 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Stories That Matter
              </h2>
              <p className="text-xl text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Real transformations from real pet parents
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[
                {
                  name: 'Matt Wolfe',
                  dog: 'Maisy',
                  text: 'Our dog Maisy absolutely devours the fresh meals that Christie prepares. Can\'t recommend her enough.',
                  rating: 5
                },
                {
                  name: 'Elizabeth Joslin',
                  text: 'Christie is so helpful, kind & very knowledgeable. You can tell she genuinely cares about your dog\'s health.',
                  rating: 5
                },
                {
                  name: 'Amber Munoz',
                  text: 'My dogs love this food!! Both my girls look forward to meal times and jump for joy.',
                  rating: 5
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="testimonial-card relative rounded-3xl overflow-hidden bg-gray-800 shadow-2xl group">
                  <div className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#8FAE8F] flex items-center justify-center">
                        <span className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {testimonial.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {testimonial.name}
                        </div>
                        {testimonial.dog && (
                          <div className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            + {testimonial.dog}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Play Overlay */}
                  <div className="play-overlay absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIMENSIONAL CTA */}
        <section className="relative py-32 md:py-40 bg-[#5E8C8C] overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="floating-element absolute top-20 left-10 w-32 h-32 opacity-20">
              <Leaf className="w-full h-full text-white" />
            </div>
            <div className="floating-element absolute top-40 right-20 w-24 h-24 opacity-20">
              <HeartPulse className="w-full h-full text-white" />
            </div>
            <div className="floating-element absolute bottom-20 left-1/4 w-28 h-28 opacity-20">
              <FlaskConical className="w-full h-full text-white" />
            </div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif', lineHeight: '1.1' }}>
                <span className="block">Your Dog's Health</span>
                <span className="block gradient-text" style={{ background: 'linear-gradient(to right, #fbbf24, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Transformation Starts Today
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-white/90 mb-12" style={{ fontFamily: 'Inter, sans-serif' }}>
                Join hundreds of pet parents who've discovered the power of real nutrition
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/nutrition-services"
                  className="magnetic-button group px-10 py-5 bg-white text-[#5E8C8C] rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shop"
                  className="magnetic-button px-10 py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-3"
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
      </main>
    </>
  );
}
