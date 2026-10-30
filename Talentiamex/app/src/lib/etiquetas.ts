import type { Disponibilidad, Turno } from '@/types';

export const ETIQUETA_TURNO: Record<Turno, string> = {
  matutino: 'Matutino',
  vespertino: 'Vespertino',
  nocturno: 'Nocturno',
  mixto: 'Mixto',
  rotativo: 'Rotativo',
};

export const ETIQUETA_DISPONIBILIDAD: Record<Disponibilidad, string> = {
  inmediata: 'Inmediata',
  quince_dias: 'En 15 días',
  un_mes: 'En 1 mes',
};

/** Turnos que elige el candidato (docs/06 §P03). */
export const TURNOS_CANDIDATO: Turno[] = ['matutino', 'vespertino', 'nocturno', 'mixto'];

export const DISPONIBILIDADES: Disponibilidad[] = ['inmediata', 'quince_dias', 'un_mes'];
