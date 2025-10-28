import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hero Section Variations | Waggin Meals',
  description: 'Compare different hero section designs for the Waggin Meals homepage',
};

export default function HeroVariationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body > header,
          body > footer {
            display: none !important;
          }
        `
      }} />
      {children}
    </>
  );
}
