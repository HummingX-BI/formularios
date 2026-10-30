import type { Candidato, Empresa } from '@/types';

/** Datos que se capturan en vivo durante el guion (docs/10 §Datos que se teclean en vivo). */

export const MARIANA = {
  nombre: 'Mariana López',
  celular: '55 2345 6789',
  correo: 'mariana.lopez@correo.mx',
  contrasena: 'Talentia2026',
  cv: {
    zona: 'Iztapalapa',
    sector: 'salud',
    puestoDeseado: 'Enfermera(o) general',
    sueldoEsperado: 14000,
    turno: 'nocturno',
    disponibilidad: 'inmediata',
    experiencias: [
      {
        puesto: 'Auxiliar de enfermería',
        empresa: 'Hospital General de Zona',
        desde: '2021-02',
        hasta: '2023-02',
        descripcion: 'Apoyo en cuidados básicos, toma de signos y atención a pacientes.',
      },
      {
        puesto: 'Enfermera general',
        empresa: 'Clínica del Valle',
        desde: '2023-03',
        descripcion:
          'Aplicación de tratamientos, seguimiento de expedientes y atención en turno nocturno.',
      },
    ],
    sinExperiencia: false,
    estudios: { nivel: 'Licenciatura', institucion: 'Licenciatura en Enfermería' },
    documentos: ['Cédula profesional'],
    habilidades: ['Toma de signos vitales', 'Aplicación de inyectables', 'Atención al paciente'],
    resumen:
      'Enfermera general con experiencia en turno nocturno, enfocada en la atención cercana y cuidadosa al paciente.',
  } satisfies Partial<Candidato>,
};

export const CLINICA = {
  nombre: 'Clínica San Rafael',
  sector: 'salud',
  tipo: 'hospital',
  contacto: 'Dra. Laura Méndez',
  celular: '55 8765 4321',
  correo: 'contacto@clinicasanrafael.mx',
  contrasena: 'Talentia2026',
} satisfies Omit<Empresa, 'id' | 'plan'> & { contrasena: string };

export const VACANTE_GUION = {
  puesto: 'Enfermera general — turno nocturno',
  zona: 'Iztapalapa',
  sueldo: 14500,
  turno: 'nocturno',
  contrato: 'Contrato indeterminado',
  preguntas: [
    { texto: '¿Cuentas con cédula profesional vigente?', respuestaEsperada: true },
    { texto: '¿Tienes disponibilidad para turno nocturno?', respuestaEsperada: true },
  ],
} as const;

export const HEADHUNTING_GUION = {
  puesto: 'Jefa de enfermería',
  sector: 'salud',
  vacantes: 1,
  urgencia: '2 semanas',
  sueldoRango: '$28,000–$32,000',
  detalle: 'Se requiere experiencia en gestión de turnos',
} as const;
