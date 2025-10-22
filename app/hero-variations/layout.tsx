'use client';

import { useEffect } from 'react';

export default function HeroVariationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide the main site navigation and footer for clean preview
  useEffect(() => {
    // Find and hide the main navigation
    const nav = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';

    // Clean up when component unmounts
    return () => {
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  return <>{children}</>;
}
