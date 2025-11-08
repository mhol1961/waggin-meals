import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Waggin Meals Brand Colors - Clinical Farm-to-Table Theme
        primary: {
          sage: '#8FAE8F',       // Primary buttons & main actions
          'sage-dark': '#6d8c6d', // Hover state for sage
          'sage-light': '#d4e4d4', // Light sage backgrounds
          teal: '#5E8C8C',       // Secondary buttons
          'teal-dark': '#4a6e6e', // Hover state for teal
          cream: '#F8F5F0',      // Primary background
        },
        text: {
          heading: '#333333',    // Dark charcoal for headings
          body: '#4a4a4a',       // Slightly lighter for body text
          muted: '#757575',      // Muted gray for secondary text
          charcoal: '#333333',   // Alias for consistency
        },
        bg: {
          cream: '#F8F5F0',      // Main background (soft cream)
          'cream-light': '#fdfcfa', // Lighter cream for cards
          'cream-dark': '#f0ede8',  // Darker cream for contrast
          sage: '#d4e4d4',       // Sage tint for highlights
          teal: '#d4e0e0',       // Teal tint for accents
        },
        border: {
          light: '#e8e5e0',      // Light cream border
          medium: '#d4d1cc',     // Medium border
          dark: '#b8b5b0',       // Darker border
          sage: '#8FAE8F',       // Sage accent border
        },
        accent: {
          terracotta: '#C97B63', // Warm terracotta for highlights
          'terracotta-dark': '#b3664d', // Hover state
          'terracotta-light': '#e8bfb0', // Light terracotta
          sage: '#8FAE8F',       // Sage green accent
          teal: '#5E8C8C',       // Teal accent
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'Arial', 'sans-serif'],
        serif: ['var(--font-abril-fatface)', 'Abril Fatface', 'Georgia', 'serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '22px',
        '2xl': '26px',
        '3xl': '30px',
        '4xl': '36px',
      },
      fontWeight: {
        body: '500',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        relaxed: '1.7',
        loose: '2',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        btn: '3px',
        card: '8px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
