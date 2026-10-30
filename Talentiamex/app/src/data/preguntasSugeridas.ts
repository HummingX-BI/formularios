import type { SectorId } from '@/types';

export interface PreguntaSugerida {
  texto: string;
  respuestaEsperada: boolean;
}

export const PREGUNTAS_SUGERIDAS: Record<string, PreguntaSugerida[]> = {
  salud: [
    { texto: '¿Cuentas con cédula profesional vigente?', respuestaEsperada: true },
    { texto: '¿Tienes disponibilidad para turno nocturno?', respuestaEsperada: true },
  ],
  restaurantes: [
    { texto: '¿Tienes constancia de manejo higiénico de alimentos?', respuestaEsperada: true },
    { texto: '¿Puedes trabajar fines de semana?', respuestaEsperada: true },
  ],
  escuelas: [
    { texto: '¿Cuentas con título o cédula docente?', respuestaEsperada: true },
    { texto: '¿Tienes experiencia frente a grupo?', respuestaEsperada: true },
  ],
};

export function preguntasPorSector(sector: SectorId): PreguntaSugerida[] {
  return PREGUNTAS_SUGERIDAS[sector] ?? [];
}
