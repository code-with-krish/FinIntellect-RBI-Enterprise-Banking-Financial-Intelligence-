/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#FEFCE8',
          navy: '#0F2747',
          'navy-dark': '#091A30',
          'navy-light': '#183B6B',
          blue: '#2563EB',
          'blue-subtle': '#EFF6FF',
          success: '#0F9D76',
          'success-subtle': '#ECFDF5',
          warning: '#D99000',
          'warning-subtle': '#FFFBEB',
          danger: '#DC4C64',
          'danger-subtle': '#FEF2F2',
          purple: '#7C3AED',
          'purple-subtle': '#F5F3FF',
          text: '#172033',
          muted: '#64748B',
          border: '#E2E8F0',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'fintech-sm': '0 1px 2px 0 rgba(15, 39, 71, 0.05)',
        'fintech': '0 1px 3px 0 rgba(15, 39, 71, 0.08), 0 1px 2px -1px rgba(15, 39, 71, 0.08)',
        'fintech-md': '0 4px 6px -1px rgba(15, 39, 71, 0.07), 0 2px 4px -2px rgba(15, 39, 71, 0.07)',
        'fintech-lg': '0 10px 15px -3px rgba(15, 39, 71, 0.08), 0 4px 6px -4px rgba(15, 39, 71, 0.08)',
      }
    },
  },
  plugins: [],
}
