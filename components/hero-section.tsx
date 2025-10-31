import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative h-[500px] w-full bg-gradient-to-br from-bg-light-blue to-white md:h-[600px]">
      {/* Background image removed during optimization - placeholder not needed */}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-text-heading md:text-5xl lg:text-6xl">
            Waggin Meals Pet Nutrition Co.
          </h1>
          <p className="mb-2 text-xl text-text-body md:text-2xl">
            High-Grade & Freshly Cooked Dog Food
          </p>
          <p className="mb-8 text-lg text-text-muted md:text-xl">
            Small Batch Kitchen • Canine Nutritionist
          </p>
          <p className="mb-10 text-base text-text-body">
            Scientifically Formulated by an Integrative Animal Nutritionist
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" asChild>
              <Link href="/shop">Shop Waggin Meals</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
