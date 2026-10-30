import type { Experiencia } from '@/types';
import { mesAnio } from '@/lib/formato';

/** Medidas de la hoja A4 a 96 dpi. */
export const A4_ANCHO = 794;
export const A4_ALTO = 1123;

/** Corta un texto largo para que la hoja no se desborde. */
export function recortar(texto: string, maximo: number): string {
  const limpio = texto.trim();
  return limpio.length <= maximo ? limpio : `${limpio.slice(0, maximo - 1).trimEnd()}…`;
}

export function rangoFechas(e: Experiencia): string {
  const fin = e.hasta ? mesAnio(e.hasta) : 'Actual';
  return `${mesAnio(e.desde)} – ${fin}`;
}

export function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

/** Límites para que los datos largos quepan en una hoja. */
export const LIMITES = {
  experiencias: 4,
  descripcion: 150,
  resumen: 280,
  habilidades: 12,
  documentos: 6,
} as const;
