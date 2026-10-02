export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ice-50': 'var(--color-ice-50)',
        'ice-100': 'var(--color-ice-100)',
        'sky-200': 'var(--color-sky-200)',
        'sky-400': 'var(--color-sky-400)',
        'aqua-500': 'var(--color-aqua-500)',
        'blue-600': 'var(--color-blue-600)',
        'blue-800': 'var(--color-blue-800)',
        'navy-900': 'var(--color-navy-900)',
        
        'primario': 'var(--color-primario)',
        'secundario': 'var(--color-secundario)',
        'tenue': 'var(--color-tenue)',
        
        'coral': 'var(--color-coral)',
        'ambar': 'var(--color-ambar)',
        'verde-agua': 'var(--color-verde-agua)',
        'periwinkle': 'var(--color-periwinkle)',
        'gris-azulado': 'var(--color-gris-azulado)',
      },
      fontFamily: {
        'inter': ['"Inter Variable"', '"Inter"', 'sans-serif'],
        'jakarta': ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'aquatic': 'var(--shadow-aquatic)',
        'aquatic-sm': 'var(--shadow-aquatic-sm)',
      },
      borderRadius: {
        'base': 'var(--radius-base)',
        'lg': 'var(--radius-lg)',
      }
    },
  },
  plugins: [],
};
