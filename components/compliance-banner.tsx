import { ShieldCheck, Stethoscope, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'FDA Pet Feed Program',
    detail: 'Licensed human-grade kitchen with documented batch tracking.',
  },
  {
    icon: Stethoscope,
    title: 'Christie Formulated',
    detail: 'Dual-master’s Canine Integrative Animal Nutritionist oversight.',
  },
  {
    icon: Leaf,
    title: 'AAFCO Complete',
    detail: 'Balanced for dogs of every life stage with whole-food ingredients.',
  },
];

type ComplianceBannerProps = {
  className?: string;
  variant?: 'default' | 'frost';
};

export function ComplianceBanner({ className, variant = 'default' }: ComplianceBannerProps) {
  const bgColor =
    variant === 'frost'
      ? 'bg-[#edf6ff]'
      : 'bg-[#f0f7ff]';

  return (
    <section className={cn('px-4 py-6', className)}>
      <div
        className={cn(
          'mx-auto max-w-6xl rounded-3xl border border-[#e6ddce] shadow-sm p-6',
          bgColor,
        )}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p
              className="text-xs font-semibold tracking-[0.4em] uppercase text-[#a4341f] mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Our Promise
            </p>
            <p
              className="text-sm text-[#4a443b]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              At Waggin Meals, we believe your dog deserves real food made with love. Our{' '}
              <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the{' '}
              <strong>FDA Pet Feed Program</strong> and scientifically formulated by an animal nutritionist to meet{' '}
              <strong>AAFCO standards for dogs of all ages</strong>.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 flex-1">
            {HIGHLIGHTS.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="rounded-2xl bg-white/70 border border-white/60 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-[#2f4b38]">
                  <Icon className="w-5 h-5" />
                  <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {title}
                  </p>
                </div>
                <p className="text-xs text-[#5f5a4f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p
          className="text-[12px] text-[#6b6458] text-center mt-5"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <strong>Important Info:</strong> Our meals are formulated exclusively for dogs and are not intended for human
          consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice.
          Always consult your veterinarian for health decisions about your dog.
        </p>
      </div>
    </section>
  );
}

