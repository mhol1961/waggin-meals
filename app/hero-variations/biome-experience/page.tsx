import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ChevronDown,
  Gift,
  Star,
  MessageCircle,
  BadgePercent,
  ShoppingCart,
  Award,
  ShieldCheck,
  Droplets,
} from 'lucide-react';
import { ComplianceBanner } from '@/components/compliance-banner';

const navLinks = [
  'Diarrhea Solutions',
  'Skin Solutions',
  'Microbiome Tests',
  'All Products',
  'Learn More',
];

const solutionCards = [
  {
    title: 'Gut Restore Program',
    pill: 'Best Seller',
    description: 'FMT capsules + à la carte meals to balance sensitive tummies fast.',
    stats: ['Clinician-guided', 'Ships weekly', '95% satisfaction'],
    cta: 'Shop Gut Restore',
    href: '/products',
  },
  {
    title: 'Skin + Microbiome Lab Kit',
    pill: 'New',
    description: 'Dual swab kit with color-coded palette translation for itchy pups.',
    stats: ['48 hr lab', 'Palette PDF', 'Vet-ready report'],
    cta: 'Schedule Kit Consult',
    href: '/nutrition-services',
  },
  {
    title: 'Rewards Pantry',
    pill: 'Members',
    description: 'Exclusive toppers, broths, and probiotic treats only for insiders.',
    stats: ['Earn points', 'Seasonal drops', 'VIP support'],
    cta: 'Join Better Biome Club',
    href: '/monthly-wag-box',
  },
];

const perkHighlights = [
  {
    icon: ShieldCheck,
    title: 'FDA Feed Program',
    detail: 'Human-grade kitchen meets regulatory guardrails.',
  },
  {
    icon: Droplets,
    title: 'Hydration Science',
    detail: 'Electrolyte gels + broth cubes tailored to palette gaps.',
  },
  {
    icon: Award,
    title: 'Dual Master’s Nutritionist',
    detail: 'Christie Willett M.A., M.S. oversees each microbatch.',
  },
];

export default function BiomeInspiredVariation() {
  return (
    <main className="bg-[#f5f2eb] min-h-screen">
      {/* Top Announcement */}
      <div className="bg-[#2f4b38] text-white text-center text-sm py-2">
        Free insulated tote on local deliveries over $165 · Palette workshop enrollment now open
      </div>

      {/* Navigation */}
      <nav className="bg-[#f7f4ee] border-b border-[#e3ddd0] px-4 py-4">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image src="/images/logo-waggin-meals.png" alt="Waggin Meals" width={72} height={72} className="rounded-full" />
            </Link>
            <div>
              <p className="text-sm uppercase tracking-wide text-[#8a5a26]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Waggin Meals
              </p>
              <p className="text-lg font-semibold text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Microbiome Studio
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex gap-6 text-sm text-[#2f4b38]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {navLinks.map((link) => (
                <button key={link} className="inline-flex items-center gap-1 hover:text-[#bc2c2c] transition-colors">
                  {link}
                  <ChevronDown className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-inner border border-[#e7dfcf]">
                <Search className="w-4 h-4 text-[#8fa08e]" />
                <input
                  type="text"
                  placeholder="Search for solutions"
                  className="bg-transparent text-sm ml-2 focus:outline-none placeholder:text-[#b3b3b3]"
                />
              </div>
              <button className="text-[#2f4b38] font-semibold flex items-center gap-1 hover:text-[#bc2c2c]">
                <ShoppingCart className="w-5 h-5" /> Cart
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ComplianceBanner />

      {/* Hero */}
      <section className="relative px-4 py-16 overflow-hidden bg-gradient-to-br from-[#f8f5ee] to-[#ecf4ee]">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#bc2c2c]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-[#205542]/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-[#bc2c2c] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              AnimalBiome inspired · Waggin-made
            </p>
            <h1 className="text-5xl lg:text-[58px] font-normal leading-tight text-[#1f2c24] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Transform Gut Data
              <br />
              Into Gorgeous Plates
            </h1>
            <p className="text-lg text-[#4b4f4b] leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Microbiome swabs, palette-based meal plans, and concierge nutrition coaching delivered with the refined greens and creams clients love
              from AnimalBiome—only tailored to the Waggin Meals brand and menu.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/nutrition-services"
                className="bg-[#2f4b38] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#203626] transition-colors shadow-lg"
              >
                Book Microbiome Consult
              </Link>
              <Link
                href="/shop"
                className="border-2 border-[#2f4b38] text-[#2f4b38] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2f4b38] hover:text-white transition-colors"
              >
                Shop Balanced Meals
              </Link>
            </div>

            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-3xl font-semibold text-[#bc2c2c]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  40% OFF
                </p>
                <p className="text-sm text-[#4b4f4b]">Palette Starter Kits</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  500+
                </p>
                <p className="text-sm text-[#4b4f4b]">Dogs reset since 2012</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  5.0★
                </p>
                <p className="text-sm text-[#4b4f4b]">Community reviews</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-[32px] shadow-2xl border border-[#e5dfd1] overflow-hidden">
              <div className="px-8 py-6 bg-[#f8f5ee] flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#9c7a4a]">Featured Formula</p>
                  <h3 className="text-2xl font-semibold text-[#1f2c24]">Gut Restore Capsules</h3>
                </div>
                <BadgePercent className="w-10 h-10 text-[#bc2c2c]" />
              </div>
              <div className="p-6">
                <Image
                  src="/images/biome-example-hero-homepage.png"
                  alt="AnimalBiome inspiration board"
                  width={900}
                  height={630}
                  className="rounded-2xl border border-[#eee5d7]"
                />
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#647064]">Ships weekly · Vet portal ready</p>
                    <p className="text-lg font-semibold text-[#2f4b38]">$129 signature kit</p>
                  </div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#bc2c2c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a02424]"
                  >
                    Add to plan <ShoppingCart className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Testimonial Pop */}
            <div className="absolute -left-10 -bottom-10 bg-white rounded-2xl shadow-xl border border-[#e7dfcf] p-4 w-64">
              <div className="flex items-center gap-3 mb-3">
                <Image src="/images/woman-with-white-dog.webp" alt="Client & dog" width={54} height={54} className="rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-[#1f2c24]">Augie + Leah</p>
                  <div className="flex text-[#f6a723]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#4b4f4b]">
                “IBD flare dropped in 2 weeks. The palette PDF helped our vet stay aligned with every ingredient swap.”
              </p>
            </div>
          </div>
        </div>

        {/* Rewards + Chat badges */}
        <div className="absolute left-6 bottom-6 flex items-center gap-4">
          <button className="flex items-center gap-2 bg-[#1f2c24] text-white px-4 py-3 rounded-full shadow-xl">
            <Gift className="w-5 h-5" />
            Rewards
          </button>
          <button className="bg-white text-[#2f4b38] px-3 py-3 rounded-full shadow-xl border border-[#dcd3c3]">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Concierge Programs</p>
              <h2 className="text-[38px] font-normal text-[#1f2c24]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Designed around the AnimalBiome experience, customized for Waggin Meals.
              </h2>
            </div>
            <Link href="/hero-variations" className="text-sm font-semibold text-[#2f4b38] hover:underline">
              View all hero experiments →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutionCards.map((card) => (
              <div key={card.title} className="bg-[#f8f5ee] rounded-3xl border border-[#ebe1cf] p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wide bg-white px-3 py-1 rounded-full text-[#bc2c2c] font-semibold">{card.pill}</span>
                  <Star className="w-5 h-5 text-[#f6a723]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1f2c24] mb-3">{card.title}</h3>
                <p className="text-sm text-[#4b4f4b] mb-4">{card.description}</p>
                <ul className="space-y-2 mb-5">
                  {card.stats.map((stat) => (
                    <li key={stat} className="text-sm text-[#2f4b38] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#bc2c2c]" />
                      {stat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f4b38] hover:text-[#bc2c2c]"
                >
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-4 py-16 bg-[#f8f5ee]">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#ece2d1]">
            <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Palette Perks</p>
            <h3 className="text-[34px] font-normal text-[#1f2c24] mb-5" style={{ fontFamily: "'Abril Fatface', serif" }}>
              A creamy, grounded palette aligned with the Waggin Meals wagon + produce colors.
            </h3>
            <div className="space-y-4">
              {perkHighlights.map((perk) => (
                <div key={perk.title} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-[#2f4b38]">
                    <perk.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#1f2c24]">{perk.title}</p>
                    <p className="text-sm text-[#4b4f4b]">{perk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#ece2d1]">
            <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Palette At-A-Glance</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Cream Canvas', color: '#f5f2eb' },
                { label: 'Garden Pine', color: '#2f4b38' },
                { label: 'Harvest Carrot', color: '#d4542b' },
                { label: 'Heritage Wagon', color: '#a12323' },
              ].map((swatch) => (
                <div key={swatch.label} className="text-center">
                  <div className="w-full h-20 rounded-2xl border border-[#dcd3c3]" style={{ backgroundColor: swatch.color }} />
                  <p className="text-xs mt-2 text-[#4b4f4b]">{swatch.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#4b4f4b] mt-6">
              Colors mirror the Waggin Meals logo (cream field, evergreen typography, red wagon slats, and produce pops) while nodding to AnimalBiome’s
              modern apothecary vibe.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Biome-inspired hero</p>
          <h2 className="text-[40px] font-normal text-[#1f2c24] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Want this aesthetic on the live homepage?
          </h2>
          <p className="text-[15px] text-[#4b4f4b] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Mix this variant with other experiments or cherry-pick the rewards/chat/testimonial flourishes. Colors remain true to Waggin Meals while
            channeling AnimalBiome’s calm medical confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#bc2c2c] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8f1c1c] transition-colors shadow-lg"
            >
              Request Implementation
            </Link>
            <Link
              href="/events"
              className="border-2 border-[#bc2c2c] text-[#bc2c2c] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#bc2c2c] hover:text-white transition-colors"
            >
              Join Palette Workshop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
