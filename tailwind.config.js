/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          bg: '#FAF6EE',
          card: '#FFFFFF',
          border: '#1E293B',
          pink: '#FF7675',
          mint: '#55E6C1',
          lavender: '#A29BFE',
          amber: '#FDCB6E',
          sky: '#74B9FF',
          rose: '#FAB1A0',
          peach: '#FFEAA7',
          matcha: '#81ECEC'
        }
      },
      fontFamily: {
        sans: ['Fredoka', 'Outfit', 'Quicksand', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'chunky': '4px 4px 0px 0px rgba(30, 41, 59, 1)',
        'chunky-lg': '6px 6px 0px 0px rgba(30, 41, 59, 1)',
        'chunky-sm': '2px 2px 0px 0px rgba(30, 41, 59, 1)',
        'btn': '0px 4px 0px 0px #1E293B',
        'btn-active': '0px 0px 0px 0px #1E293B',
      },
      animation: {
        'wobble': 'wobble 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 16px rgba(251, 191, 36, 1))' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
