/**
 * ZAMMIR Design Tokens — HummingX BI
 * Fuente de verdad para colores, tipografia y espaciado.
 */

export const colors = {
  paper: '#F4F1EC',
  panel: '#ECE8E0',
  panelDark: '#E0DBD1',
  ink: '#26241F',
  inkSoft: '#57534A',
  inkMuted: '#8C8880',
  laton: '#9C7A3C',
  latonDark: '#7A5F2D',
  latonLight: '#C4A86A',
  oliva: '#5C6B4F',
  aluminio: '#7C8592',
  vidrio: '#B9C6CC',
  vidrioLight: '#D6E1E5',
  success: '#4A7C59',
  successBg: '#EBF4EE',
  warning: '#B07D2A',
  warningBg: '#FDF4E3',
  danger: '#8B3A3A',
  dangerBg: '#F9EBEB',
  info: '#3A6B8B',
  infoBg: '#EBF2F9',
  overlay: 'rgba(38,36,31,0.6)',
  overlayLight: 'rgba(38,36,31,0.15)',
  white: '#FFFFFF',
};

export const typography = {
  display: 'Fraunces', serif,
  body: 'Source Serif 4', serif,
  mono: 'IBM Plex Mono', monospace,
  sizes: {
    xs: '0.75rem', sm: '0.875rem', base: '1rem', md: '1.125rem',
    lg: '1.25rem', xl: '1.5rem', '2xl': '1.875rem', '3xl': '2.25rem',
    '4xl': '3rem', '5xl': '3.75rem', '6xl': '4.5rem',
  },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 900 },
  lineHeights: { tight: 1.1, snug: 1.25, normal: 1.5, relaxed: 1.65 },
};

export const shadows = {
  sm: '0 1px 3px rgba(38,36,31,0.08)',
  md: '0 4px 12px rgba(38,36,31,0.10)',
  lg: '0 8px 24px rgba(38,36,31,0.12)',
  xl: '0 16px 40px rgba(38,36,31,0.14)',
  laton: '0 4px 20px rgba(156,122,60,0.25)',
  glow: '0 0 40px rgba(185,198,204,0.4)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export default { colors, typography, shadows, transitions };
