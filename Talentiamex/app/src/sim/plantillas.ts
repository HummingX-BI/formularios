import type { AvisoDias, Candidato, Empresa, MensajeWhatsApp, Vacante } from '@/types';
import { fechaCorta } from '@/lib/formato';
import { aniosExperiencia } from '@/store/reglas';

/** Mensaje listo para agregarse al store (falta id, hora y estado de lectura). */
export type PlantillaMensaje = Pick<
  MensajeWhatsApp,
  'para' | 'destinatarioId' | 'regla' | 'texto' | 'boton'
>;

/** RN-07: la empresa recibe aviso de un postulante nuevo → P12. */
export function plantillaRN07(
  empresa: Empresa,
  vacante: Vacante,
  candidato: Candidato,
  hoy: string,
): PlantillaMensaje {
  const anios = aniosExperiencia(candidato, hoy);
  const experiencia = anios === 1 ? '1 año' : `${anios} años`;
  return {
    para: 'empresa',
    destinatarioId: empresa.id,
    regla: 'RN-07',
    texto: `👋 Hola, ${empresa.contacto}. Tienes un nuevo postulante para *${vacante.puesto}*: ${candidato.nombre}, ${experiencia} de experiencia.`,
    boton: { texto: 'Ver postulante', ruta: `/empresa/vacantes/${vacante.id}/postulantes` },
  };
}

/** RN-08: el candidato recibe aviso de una vacante que coincide → P07. */
export function plantillaRN08(
  candidato: Candidato,
  vacante: Vacante,
  empresa: Empresa,
): PlantillaMensaje {
  return {
    para: 'candidato',
    destinatarioId: candidato.id,
    regla: 'RN-08',
    texto: `Hola, ${candidato.nombre}. Hay una vacante que coincide contigo: *${vacante.puesto}* en ${empresa.nombre}, ${vacante.zona}.`,
    boton: { texto: 'Postularme', ruta: `/candidato/vacantes/${vacante.id}` },
  };
}

/** RN-06: recordatorio de vencimiento de vacante (5, 3 y 0 días) → P10. */
export function plantillaRN06(
  empresa: Empresa,
  vacante: Vacante,
  dias: AvisoDias,
): PlantillaMensaje {
  const cuando = dias === 0 ? 'vence hoy' : `vence en ${dias} días`;
  return {
    para: 'empresa',
    destinatarioId: empresa.id,
    regla: 'RN-06',
    texto: `⏰ Tu vacante *${vacante.puesto}* ${cuando}. Renuévala para seguir recibiendo candidatos.`,
    boton: { texto: 'Renovar', ruta: '/empresa' },
  };
}

/** RN-09: aviso de suscripción por vencer → P09. */
export function plantillaRN09(empresa: Empresa, nombrePlan: string): PlantillaMensaje {
  const tipo = empresa.plan.estado === 'prueba' ? 'prueba gratis' : `plan ${nombrePlan}`;
  return {
    para: 'empresa',
    destinatarioId: empresa.id,
    regla: 'RN-09',
    texto: `Tu ${tipo} vence el ${fechaCorta(empresa.plan.venceEl)}. Elige un plan para no perder tus vacantes.`,
    boton: { texto: 'Ver mi plan', ruta: '/empresa/planes' },
  };
}
