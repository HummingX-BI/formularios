import { describe, it, expect } from 'vitest';

/**
 * Calculates relative luminance of a color.
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '').match(/.{2}/g)?.map((val) => parseInt(val, 16)) || [0, 0, 0];
  const [R=0, G=0, B=0] = rgb.map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates contrast ratio between two colors.
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
}

describe('Design Tokens WCAG Contrast (RNF-16)', () => {
  const bgColors = {
    'ice-50': '#F5FAFD',
    'white': '#FFFFFF',
  };

  const textColors = {
    'text-primary': '#0B2A47',
    'text-secondary': '#4A6A85',
    'text-tenue': '#546E85',
    'state-coral': '#D33D30',
    'state-ambar': '#9C5500',
    'state-verde-agua': '#146336',
    'state-periwinkle': '#3654A6',
    'state-gris-azulado': '#465B6E',
  };

  it('All text colors must have at least 4.5:1 contrast against white', () => {
    for (const [name, hex] of Object.entries(textColors)) {
      const ratio = getContrastRatio(hex, bgColors.white);
      expect(ratio, `${name} (${hex}) against white (${bgColors.white}) has ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('Primary and secondary text must have at least 4.5:1 contrast against ice-50', () => {
    const ratioPrimary = getContrastRatio(textColors['text-primary'], bgColors['ice-50']);
    expect(ratioPrimary).toBeGreaterThanOrEqual(4.5);

    const ratioSecondary = getContrastRatio(textColors['text-secondary'], bgColors['ice-50']);
    expect(ratioSecondary).toBeGreaterThanOrEqual(4.5);
  });
});
