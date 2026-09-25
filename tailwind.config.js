/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: {
          950: '#0E1116',
          900: '#141922',
          800: '#1B212C',
          700: '#242C39',
          600: '#333D4D',
          500: '#4A5568',
          400: '#6B7688',
          300: '#94A0B3',
          200: '#C3CBD8',
          100: '#E7EBF1',
          50: '#F5F7FA',
        },
        accent: {
          DEFAULT: '#7C6CF6',
          dim: '#5D4FD1',
          bright: '#9C8DFF',
        },
        signal: {
          high: '#F0546B',
          highBg: '#3A1E27',
          medium: '#E8933A',
          mediumBg: '#3A2C1A',
          low: '#39B87A',
          lowBg: '#183429',
          info: '#4B9CE8',
          infoBg: '#182B3A',
        },
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
