/**
 * Configuración de TailwindCSS para el proyecto UCC Prácticas
 *
 * Configuración personalizada con:
 * - Tema oscuro/claro por clase
 * - Colores amigables para niños (tonos suaves y alegres)
 * - Paleta "fun" con nombres descriptivos
 * - Animaciones personalizadas (float, glow, etc.)
 * - Sombras y efectos visuales
 * - Tipografía optimizada
 */
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores amigables para niños - tonos suaves y alegres
        primary: {
          50: '#fef3f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        fun: {
          candy: '#ff6b9d',
          bubblegum: '#ff9ff3',
          sky: '#74b9ff',
          mint: '#00d2d3',
          sunshine: '#ffeaa7',
          tangerine: '#fdcb6e',
          raspberry: '#e84393',
          lavender: '#a29bfe',
          ocean: '#00cec9',
          lemonade: '#fdff8f',
        },
        // Gradientes amigables para niños
        gradient: {
          primary: 'linear-gradient(135deg, #ff69b4 0%, #87ceeb 100%)',
          secondary: 'linear-gradient(135deg, #98fb98 0%, #ffff99 100%)',
          rainbow: 'linear-gradient(135deg, #ff69b4 0%, #9370db 25%, #87ceeb 50%, #98fb98 75%, #ffff99 100%)',
          happy: 'linear-gradient(135deg, #ffa500 0%, #ff69b4 100%)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-blue': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(34, 197, 94, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config



