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
        // Waggin Meals Brand Colors
        primary: {
          blue: '#2ea3f2',
          dark: '#32373c',
        },
        text: {
          heading: '#333333',
          body: '#666666',
          muted: '#999999',
        },
        bg: {
          'light-blue': '#e8f4fb',
          'light-gray': '#f5f5f5',
          'green-accent': '#4CAF50',
        },
        border: {
          light: '#e2e2e2',
          medium: '#dddddd',
          dark: '#bbbbbb',
        },
        accent: {
          lavender: '#9b7fc5',
          sage: '#a8c5a8',
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
    },
  },
  plugins: [],
};

export default config;
