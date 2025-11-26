/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E8D5FF', // Light lavender
          DEFAULT: '#B794F6', // Soft lavender
          dark: '#9F7AEA',
        },
        accent: {
          teal: '#B2F5EA', // Soft teal
          warm: '#FED7AA', // Warm neutral
        },
        calm: {
          bg: '#FEF7FF', // Very light lavender background
          surface: '#FFFFFF',
          text: '#4A5568',
          textLight: '#718096',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Nunito', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 1.5s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(183, 148, 246, 0.1)',
        'soft-lg': '0 4px 25px rgba(183, 148, 246, 0.15)',
      },
    },
  },
  plugins: [],
}

