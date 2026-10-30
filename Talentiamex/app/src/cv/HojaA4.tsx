import type { ReactNode } from 'react';
import { A4_ALTO, A4_ANCHO } from './utilCv';

/** Hoja A4 de 794 × 1123 px. Todo lo que se salga de la hoja se recorta. */
export function HojaA4({ children }: { children: ReactNode }) {
  return (
    <div
      data-cv-hoja
      className="overflow-hidden bg-superficie font-sans text-texto"
      style={{ width: A4_ANCHO, height: A4_ALTO }}
    >
      {children}
    </div>
  );
}
