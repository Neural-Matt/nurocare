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
        // Primary: NuroCare deep navy — #0A2540
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
        // Accent: NuroCare teal — #14B8A6
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
        // Warning / CTA: NuroCare orange — #F97316
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
        // Surface/background — #F5F7FA
        surface: {
          50:  '#F5F7FA',  // ← brand background
          100: '#edf0f5',
          200: '#dde3ed',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:       '0 1px 4px rgba(10,37,64,0.06), 0 0 0 1px rgba(10,37,64,0.04)',
        'card-hover':'0 6px 24px rgba(10,37,64,0.10), 0 0 0 1px rgba(10,37,64,0.05)',
        'nav':      '0 -1px 0 rgba(10,37,64,0.06)',
      },
    },
  },
  plugins: [],
};
