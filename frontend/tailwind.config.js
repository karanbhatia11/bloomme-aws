/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          'gold': 'var(--color-primary-sacred-gold)',
          'copper': 'var(--color-primary-warm-copper)',
          'brown': 'var(--color-primary-deep-brown)',
        },
        'accent': {
          'pink': 'var(--color-accent-soft-pink)',
          'green': 'var(--color-accent-sage-green)',
          'red': 'var(--color-accent-rose-red)',
        },
        'neutral': {
          'off-white': 'var(--color-neutral-off-white)',
          'cream': 'var(--color-neutral-cream)',
          'light-gray': 'var(--color-neutral-light-gray)',
          'dark-gray': 'var(--color-neutral-dark-gray)',
          'black': 'var(--color-neutral-black)',
        },
        'semantic': {
          'success': 'var(--color-success)',
          'error': 'var(--color-error)',
          'warning': 'var(--color-warning)',
          'info': 'var(--color-info)',
        },
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        'md': 'var(--border-radius-md)',
        'lg': 'var(--border-radius-lg)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Lora', 'serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      lineHeight: {
        'tight': 'var(--line-height-tight)',
        'normal': 'var(--line-height-normal)',
        'relaxed': 'var(--line-height-relaxed)',
      },
      zIndex: {
        'sticky': 10,
        'dropdown': 15,
        'modal': 20,
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInDown: {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
