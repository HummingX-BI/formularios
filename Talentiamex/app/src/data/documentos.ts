import type { SectorId } from '@/types';

/** Documentos o certificaciones sugeridos por sector (docs/06 §P03 paso 4). */
const POR_SECTOR: Record<string, string[]> = {
  salud: [
    'Cédula profesional',
    'Título de enfermería',
    'Certificado de RCP',
    'Cartilla de vacunación',
  ],
  restaurantes: [
    'Constancia de manejo higiénico de alimentos',
    'Certificado de estudios',
    'Tarjeta de salud',
  ],
  escuelas: [
    'Título o cédula docente',
    'Certificado de inglés',
    'Carta de no antecedentes penales',
  ],
};

const GENERALES = ['Comprobante de estudios', 'Constancia de curso o capacitación'];

export function documentosSugeridos(sector: SectorId): string[] {
  return POR_SECTOR[sector] ?? GENERALES;
}

export const NIVELES_ESTUDIO = [
  'Primaria',
  'Secundaria',
  'Preparatoria',
  'Carrera técnica',
  'Licenciatura',
  'Posgrado',
];
