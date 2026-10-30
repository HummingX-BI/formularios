import type { DatosVacante } from '@/store/useDemoStore';
import type { SectorId, Turno, Vacante } from '@/types';

export const MAX_PREGUNTAS = 5;
export const TOTAL_PASOS_VACANTE = 3;

export const PASOS_VACANTE = [
  { nombre: 'Datos', corto: 'Datos', ayuda: 'Cuéntanos qué puesto necesitas cubrir' },
  {
    nombre: 'Preguntas de descarte',
    corto: 'Preguntas',
    ayuda: 'Hasta 5 preguntas de Sí o No para ver quién cumple lo que necesitas',
  },
  { nombre: 'Revisar y publicar', corto: 'Publicar', ayuda: 'Así verán tu vacante los candidatos' },
] as const;

export interface PreguntaBorrador {
  clave: number;
  texto: string;
  respuestaEsperada: boolean;
}

/** Lo capturado en el formulario; el sueldo se guarda como texto mientras se escribe. */
export interface BorradorVacante {
  puesto: string;
  sector: SectorId;
  zona: string;
  sueldo: string;
  turno: Turno | '';
  contrato: string;
  descripcion: string;
  requisitos: string[];
  prestaciones: string[];
  preguntas: PreguntaBorrador[];
}

let contador = 0;
export function nuevaClave(): number {
  return ++contador;
}

export function borradorVacio(sector: SectorId): BorradorVacante {
  return {
    puesto: '',
    sector,
    zona: '',
    sueldo: '',
    turno: '',
    contrato: '',
    descripcion: '',
    requisitos: [],
    prestaciones: [],
    preguntas: [],
  };
}

export function borradorDesde(v: Vacante): BorradorVacante {
  return {
    puesto: v.puesto,
    sector: v.sector,
    zona: v.zona,
    sueldo: String(v.sueldo),
    turno: v.turno,
    contrato: v.contrato,
    descripcion: v.descripcion,
    requisitos: v.requisitos,
    prestaciones: v.prestaciones,
    preguntas: v.preguntas.map((p) => ({
      clave: nuevaClave(),
      texto: p.texto,
      respuestaEsperada: p.respuestaEsperada,
    })),
  };
}

export interface ErroresDatos {
  puesto?: string;
  sector?: string;
  zona?: string;
  sueldo?: string;
  turno?: string;
  contrato?: string;
  descripcion?: string;
}

export function validarDatos(b: BorradorVacante): ErroresDatos {
  const e: ErroresDatos = {};
  if (!b.puesto.trim()) e.puesto = 'Escribe el nombre del puesto';
  if (!b.sector) e.sector = 'Elige el sector';
  if (!b.zona) e.zona = 'Elige la alcaldía o municipio';
  if (!(Number(b.sueldo) > 0)) e.sueldo = 'Escribe el sueldo mensual';
  if (!b.turno) e.turno = 'Elige un turno';
  if (!b.contrato) e.contrato = 'Elige el tipo de contrato';
  if (!b.descripcion.trim()) e.descripcion = 'Describe brevemente el puesto';
  return e;
}

export function aDatosVacante(b: BorradorVacante): DatosVacante {
  return {
    puesto: b.puesto.trim(),
    sector: b.sector,
    zona: b.zona,
    sueldo: Number(b.sueldo),
    turno: b.turno === '' ? 'matutino' : b.turno,
    contrato: b.contrato,
    descripcion: b.descripcion.trim(),
    requisitos: b.requisitos,
    prestaciones: b.prestaciones,
    preguntas: b.preguntas
      .filter((p) => p.texto.trim() !== '')
      .map((p) => ({ texto: p.texto.trim(), respuestaEsperada: p.respuestaEsperada })),
  };
}
