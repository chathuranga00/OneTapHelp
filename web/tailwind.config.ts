import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#CC0000',
          'red-dark': '#990000',
          'red-glow': '#FF3333',
          black: '#0A0A0A',
          surface: '#141414',
          card: '#1A1A1A',
          border: '#2A2A2A',
          muted: '#888888',
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.35)', opacity: '0.35' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
