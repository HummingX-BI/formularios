import type { Plan, PlanId } from '@/types';

export const PLANES: Plan[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    precioMensual: 499,
    vacantesActivas: 2,
    incluye: [
      'Hasta 2 vacantes activas',
      'Recibe postulaciones con preguntas de descarte',
      'Avisos por WhatsApp',
    ],
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precioMensual: 999,
    vacantesActivas: 5,
    recomendado: true,
    incluye: [
      'Hasta 5 vacantes activas',
      'Búsqueda de perfiles visibles',
      'Contacto directo por WhatsApp',
      'Avisos por WhatsApp',
    ],
  },
  {
    id: 'empresa',
    nombre: 'Empresa',
    precioMensual: 1999,
    vacantesActivas: 'ilimitadas',
    incluye: [
      'Vacantes activas ilimitadas',
      'Búsqueda de perfiles visibles',
      'Contacto directo por WhatsApp',
      'Avisos por WhatsApp',
      'Atención prioritaria',
    ],
  },
];

/**
 * Filas de la tabla comparativa de P09 (provisional: depende de la pregunta abierta Q2).
 * La fila de vacantes activas sale del límite de cada plan.
 */
export const COMPARATIVA: { etiqueta: string; incluido: Record<PlanId, boolean> }[] = [
  { etiqueta: 'Búsqueda de perfiles', incluido: { basico: false, pro: true, empresa: true } },
  { etiqueta: 'Preguntas de descarte', incluido: { basico: true, pro: true, empresa: true } },
  { etiqueta: 'Avisos por WhatsApp', incluido: { basico: true, pro: true, empresa: true } },
  { etiqueta: 'Headhunting con descuento', incluido: { basico: false, pro: false, empresa: true } },
];
