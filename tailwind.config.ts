/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Neutral scale — Apple-style off-white → near-black.
        // This is the primary surface/text/border scale for the whole app;
        // `slate` remains available but new work should use this.
        neutral: {
          25:  '#FBFBFC',
          50:  '#F5F5F7',
          100: '#F0F0F2',
          150: '#E8E8EB',
          200: '#E2E2E5',
          300: '#D1D1D6',
          400: '#AEAEB2',
          500: '#8E8E93',
          600: '#636366',
          700: '#48484A',
          800: '#3A3A3C',
          900: '#1D1D1F',
          950: '#0F0F10',
        },
        // Primary: NuroCare deep navy — #0A2540. Sparing accent: primary
        // actions, active nav states, one or two featured surfaces.
        primary: {
          50:  '#e8eef5',
          100: '#c6d4e8',
          200: '#a0b9db',
          300: '#779ecf',
          400: '#5183c2',
          500: '#2d68b5',
          600: '#1a50a0',
          700: '#0d3980',
          800: '#0A2540',  // ← brand primary
          900: '#061525',
        },
        // Accent: NuroCare teal — #14B8A6. Sparing accent: icon chips,
        // secondary CTAs, focus rings, positive/active state.
        accent: {
          50:  '#e6f8f6',
          100: '#b3edea',
          200: '#80e2dc',
          300: '#4dd7ce',
          400: '#26ccbe',
          500: '#14B8A6',  // ← brand teal
          600: '#0f9b8c',
          700: '#0b7d72',
          800: '#075f58',
          900: '#03403e',
        },
        // Warning: NuroCare orange — #F97316. Status-only (rejected claim,
        // policy expiring). Never decorative or used as a CTA color.
        warning: {
          50:  '#fff4ed',
          100: '#fee9d6',
          200: '#fdd1ab',
          300: '#fbb87e',
          400: '#fa9f52',
          500: '#F97316',  // ← brand orange
          600: '#ea6100',
          700: '#c45000',
          800: '#9e4000',
          900: '#783100',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Flat, barely-there depth — no color tint, no glow.
        card:        '0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 16px rgba(0,0,0,0.08)',
        'nav':       '0 -1px 0 rgba(0,0,0,0.06)',
        'inset-sm':  'inset 0 1px 2px rgba(0,0,0,0.04)',
        'elevated':  '0 24px 48px -12px rgba(0,0,0,0.18)',
      },
      backgroundImage: {
        // Rare, single-use only — not a default card/button treatment.
        'gradient-primary-accent': 'linear-gradient(135deg, #0A2540 0%, #14B8A6 100%)',
      },
    },
  },
  plugins: [],
};
