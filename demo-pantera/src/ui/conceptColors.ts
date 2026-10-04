export const conceptColors = {
  ingresos: 'var(--color-blue-600)',
  ocupacion: 'var(--color-aqua-500)',
  retencion: 'var(--color-verde-agua)',
  prospectos: 'var(--color-periwinkle)',
  bajas: 'var(--color-coral)',
  cobranza: 'var(--color-ambar)',
  meta: 'var(--color-gris-azulado)',
  default: 'var(--color-blue-600)',

  // Paleta categórica fría para instructores, fuentes, niveles (buen contraste)
  paletaFria: [
    '#1E7FC0', // blue-600
    '#2FB6D4', // aqua-500
    '#6C8EF5', // periwinkle
    '#2BAE84', // verde-agua
    '#7CC4E8', // sky-400
    '#8AA3B8', // gris-azulado
    '#14507F', // blue-800
    '#4A6A85', // secundario
  ] as const,
} as const;

export type ConceptColorKey = keyof typeof conceptColors;
