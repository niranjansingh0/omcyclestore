/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF6B35',
          'primary-dark': '#E55A2B',
          secondary: '#1E3A5F',
          accent: '#00D9A5',
          surface: '#F8FAFC',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
          dark: '#0F172A',
          'dark-surface': '#1E293B',
          'dark-muted': '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px -20px rgba(15, 23, 42, 0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
