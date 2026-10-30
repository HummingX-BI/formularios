import type { Plan } from '@/types';

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
