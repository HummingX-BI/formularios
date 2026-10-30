import type { AvisoDias, Candidato, Empresa, PreguntaDescarte, Vacante } from '@/types';
import { VIGENCIA_VACANTE_DIAS } from '@/data/config';
import { diasEntre, sumarDias } from '@/lib/fechas';

export type Vigencia = 'verde' | 'ambar' | 'rojo';

/** Días de aviso antes del vencimiento (RN-06), del más lejano al más cercano. */
const UMBRALES_AVISO: readonly AvisoDias[] = [5, 3, 0];

/** RD-01: datos personales, 1 experiencia o "sin experiencia", sector y zona. */
export function cvCompleto(c: Candidato): boolean {
  const datosPersonales = [c.nombre, c.celular, c.correo].every((t) => t.trim() !== '');
  const experiencia = c.experiencias.length > 0 || c.sinExperiencia;
  return datosPersonales && experiencia && c.sector.trim() !== '' && c.zona.trim() !== '';
}

/** RD-02: una vacante coincide si comparte sector y zona. */
export function coincide(c: Candidato, v: Vacante): boolean {
  return c.sector === v.sector && c.zona === v.zona;
}

/** RN-05: días que le quedan a la vacante (0 = vence hoy, negativo = ya venció). */
export function diasRestantes(v: Vacante, hoy: string): number {
  return diasEntre(hoy, sumarDias(v.publicadaEl, VIGENCIA_VACANTE_DIAS));
}

/** Color de la barra de vigencia: rojo si vence hoy o ya venció, ámbar de 1 a 5 días. */
export function estadoVigencia(dias: number): Vigencia {
  if (dias <= 0) return 'rojo';
  if (dias <= 5) return 'ambar';
  return 'verde';
}

/** RN-06 + RNF-07: avisos de 5, 3 y 0 días que ya tocan y todavía no se envían. */
export function avisosPendientes(v: Vacante, hoy: string): AvisoDias[] {
  if (v.estado !== 'activa') return [];
  const dias = diasRestantes(v, hoy);
  return UMBRALES_AVISO.filter((u) => dias <= u && !v.avisosEnviados.includes(u));
}

/** RD-03: cumple si coincide con la respuesta esperada de todas las preguntas. */
export function cumpleDescarte(
  preguntas: readonly PreguntaDescarte[],
  respuestas: Readonly<Record<string, boolean>>,
): boolean {
  return preguntas.every((p) => respuestas[p.id] === p.respuestaEsperada);
}

/** RD-04: se puede publicar con prueba o plan activos y sin vencer. */
export function puedePublicar(e: Empresa, hoy: string): boolean {
  if (e.plan.estado !== 'prueba' && e.plan.estado !== 'activo') return false;
  return diasEntre(hoy, e.plan.venceEl) >= 0;
}

/** Años completos de experiencia sumando todos los empleos (hasta `hoy` si siguen vigentes). */
export function aniosExperiencia(c: Candidato, hoy: string): number {
  const meses = (fecha: string): number => {
    const [a = '0', m = '1'] = fecha.split('-');
    return Number(a) * 12 + Number(m);
  };
  const total = c.experiencias.reduce(
    (suma, x) => suma + Math.max(0, meses(x.hasta ?? hoy) - meses(x.desde)),
    0,
  );
  return Math.floor(total / 12);
}
