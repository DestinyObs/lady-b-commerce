import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary palette — luxury neutrals
        ivory: {
          50: '#FDFCF8',
          100: '#FAF8F2',
          200: '#F5F0E6',
          300: '#EDE5D3',
          400: '#E0D5BC',
          DEFAULT: '#F5F0E6',
        },
        charcoal: {
          50: '#F5F5F4',
          100: '#E7E5E4',
          200: '#D6D3D1',
          400: '#A8A29E',
          600: '#57534E',
          800: '#292524',
          900: '#1C1917',
          DEFAULT: '#1C1917',
        },
        emerald: {
          luxury: '#1B4332',
          deep: '#14532D',
          mid: '#166534',
          light: '#15803D',
          pale: '#BBF7D0',
          DEFAULT: '#1B4332',
        },
        gold: {
          champagne: '#D4AF72',
          light: '#E8C98A',
          deep: '#B8960C',
          DEFAULT: '#D4AF72',
        },
        // Secondary palette
        pearl: '#F0EDE8',
        sand: '#DDD0BB',
        beige: '#C8B69A',
        cocoa: '#4A3728',
        blush: '#E8D5CC',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        hero: ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.5rem, 4vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-lg': ['clamp(2rem, 3vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        widest: '0.25em',
        luxury: '0.15em',
        editorial: '0.08em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'luxury': '1440px',
      },
      screens: {
        xs: '375px',
        '3xl': '1920px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        luxury: '0 4px 24px -2px rgba(28, 25, 23, 0.08), 0 1px 4px rgba(28, 25, 23, 0.04)',
        'luxury-lg': '0 8px 48px -4px rgba(28, 25, 23, 0.12), 0 2px 8px rgba(28, 25, 23, 0.06)',
        'luxury-xl': '0 24px 80px -8px rgba(28, 25, 23, 0.16)',
        product: '0 2px 16px rgba(28, 25, 23, 0.06)',
        'product-hover': '0 8px 32px rgba(28, 25, 23, 0.12)',
        'cart-drawer': '-8px 0 48px rgba(28, 25, 23, 0.12)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
