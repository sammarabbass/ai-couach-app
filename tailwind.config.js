/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F4EF',
        surface: '#FFFFFF',
        ink: '#181B18',
        muted: '#5C6259',
        line: '#DAD8CD',
        turf: {
          DEFAULT: '#2B6E4F',
          50: '#E4EEE8',
          100: '#C7DED0',
          600: '#2B6E4F',
          700: '#20543B',
        },
        ember: {
          DEFAULT: '#FF5A36',
          50: '#FFE8E1',
          600: '#FF5A36',
          700: '#E23F1D',
        },
        amber: {
          DEFAULT: '#E8AA3D',
          50: '#FBF0DA',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        tightish: '-0.01em',
      },
    },
  },
  plugins: [],
}
