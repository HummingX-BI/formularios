import { describe, it, expect } from 'vitest';

// Convert hex to rgb
const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
};

// Calculate relative luminance
const luminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * (rs||0) + 0.7152 * (gs||0) + 0.0722 * (bs||0);
};

// Calculate contrast ratio
const contrast = (hex1: string, hex2: string) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
};

// Extracted exactly from tokens.css
const colors = {
  'ice-50': '#F5FAFD',
  'ice-100': '#EAF4FA',
  'sky-200': '#CFE8F5',
  'sky-400': '#7CC4E8',
  'aqua-500': '#2FB6D4',
  'blue-600': '#16659A',
  'blue-800': '#14507F',
  'navy-900': '#0B2A47',
  'primario': '#0B2A47',
  'secundario': '#4A6A85',
  'tenue': '#7D95AA',
  'coral': '#C93B2D',
  'ambar': '#F2A93B',
  'verde-agua': '#2BAE84',
  'periwinkle': '#6C8EF5',
  'gris-azulado': '#8AA3B8',
  'white': '#FFFFFF'
};

const MIN_CONTRAST = 4.5;

describe('WCAG 2.1 Contrast Requirements (RNF-16)', () => {
  
  // Real world combinations used in components:
  const combinations = [
    { name: 'Texto Primario sobre Ice-50', fg: colors['primario'], bg: colors['ice-50'] },
    { name: 'Texto Primario sobre Blanco', fg: colors['primario'], bg: colors['white'] },
    { name: 'Texto Secundario sobre Blanco', fg: colors['secundario'], bg: colors['white'] },
    { name: 'Texto Secundario sobre Ice-50', fg: colors['secundario'], bg: colors['ice-50'] },
    // Notice that Tenue is used for non-essential UI (disabled, empty states), contrast requirement is 3.0
    
    // Primary buttons
    { name: 'Botón Primario (Blanco sobre Blue-600)', fg: colors['white'], bg: colors['blue-600'] },
    { name: 'Botón Peligro (Blanco sobre Coral)', fg: colors['white'], bg: colors['coral'] },
    
    // Badges / Pills
    { name: 'Pill Crítico (Blanco sobre Red-600)', fg: '#FFFFFF', bg: '#DC2626' }, // Tailwind red-600 aprox
    
    // Header/Sidebar elements (Navy bg)
    { name: 'Texto Blanco sobre Navy-900', fg: colors['white'], bg: colors['navy-900'] },
  ];

  combinations.forEach(combo => {
    it(`should have at least 4.5:1 contrast for ${combo.name}`, () => {
      const ratio = contrast(combo.fg, combo.bg);
      // Log for visibility
      console.log(`${combo.name}: ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
  });
  
  it('should have at least 3.0:1 contrast for Tenue text (Large or UI component)', () => {
    const ratio = contrast(colors['tenue'], colors['white']);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });
});
