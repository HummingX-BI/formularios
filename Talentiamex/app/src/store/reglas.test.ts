import { describe, expect, it } from 'vitest';
import type { Candidato, Empresa, Vacante } from '@/types';
import {
  avisosPendientes,
  coincide,
  cumpleDescarte,
  cvCompleto,
  diasRestantes,
  estadoVigencia,
  puedePublicar,
} from './reglas';

const HOY = '2026-10-30';

const candidato: Candidato = {
  id: 'c1',
  nombre: 'Ana Pérez',
  celular: '55 1234 5678',
  correo: 'ana@correo.mx',
  zona: 'Iztapalapa',
  sector: 'salud',
  puestoDeseado: 'Enfermera(o) general',
  sueldoEsperado: 14000,
  turno: 'nocturno',
  disponibilidad: 'inmediata',
  experiencias: [{ puesto: 'Enfermera', empresa: 'Clínica', desde: '2022-01' }],
  sinExperiencia: false,
  estudios: { nivel: 'Licenciatura' },
  documentos: [],
  habilidades: [],
  resumen: '',
  plantilla: 'clasica',
  perfilVisible: true,
  cvPagado: false,
  creadoEl: HOY,
};

const vacante: Vacante = {
  id: 'v1',
  empresaId: 'e1',
  puesto: 'Enfermera',
  sector: 'salud',
  zona: 'Iztapalapa',
  sueldo: 14500,
  turno: 'nocturno',
  contrato: '',
  descripcion: '',
  requisitos: [],
  prestaciones: [],
  preguntas: [
    { id: 'q1', texto: '¿Cédula?', respuestaEsperada: true },
    { id: 'q2', texto: '¿Nocturno?', respuestaEsperada: true },
  ],
  publicadaEl: HOY,
  estado: 'activa',
  avisosEnviados: [],
};

const empresa: Empresa = {
  id: 'e1',
  nombre: 'Clínica',
  sector: 'salud',
  tipo: 'hospital',
  contacto: 'Laura',
  celular: '55 0000 0000',
  correo: 'c@c.mx',
  plan: { id: 'basico', estado: 'prueba', venceEl: '2026-11-13' },
};

describe('cvCompleto', () => {
  it('es verdadero con todos los datos', () => {
    expect(cvCompleto(candidato)).toBe(true);
  });
  it('acepta "sin experiencia" en lugar de experiencias', () => {
    expect(cvCompleto({ ...candidato, experiencias: [], sinExperiencia: true })).toBe(true);
  });
  it('falla sin experiencia ni casilla', () => {
    expect(cvCompleto({ ...candidato, experiencias: [] })).toBe(false);
  });
  it('falla sin zona, sector o datos personales', () => {
    expect(cvCompleto({ ...candidato, zona: '' })).toBe(false);
    expect(cvCompleto({ ...candidato, sector: '' })).toBe(false);
    expect(cvCompleto({ ...candidato, celular: '  ' })).toBe(false);
  });
});

describe('coincide', () => {
  it('requiere mismo sector y zona', () => {
    expect(coincide(candidato, vacante)).toBe(true);
    expect(coincide(candidato, { ...vacante, zona: 'Coyoacán' })).toBe(false);
    expect(coincide(candidato, { ...vacante, sector: 'escuelas' })).toBe(false);
  });
});

describe('diasRestantes', () => {
  it('cuenta 30 días desde la publicación', () => {
    expect(diasRestantes(vacante, HOY)).toBe(30);
    expect(diasRestantes(vacante, '2026-11-25')).toBe(4);
    expect(diasRestantes(vacante, '2026-11-29')).toBe(0);
    expect(diasRestantes(vacante, '2026-12-01')).toBe(-2);
  });
});

describe('estadoVigencia', () => {
  it('verde, ámbar y rojo', () => {
    expect(estadoVigencia(30)).toBe('verde');
    expect(estadoVigencia(6)).toBe('verde');
    expect(estadoVigencia(5)).toBe('ambar');
    expect(estadoVigencia(1)).toBe('ambar');
    expect(estadoVigencia(0)).toBe('rojo');
    expect(estadoVigencia(-3)).toBe('rojo');
  });
});

describe('avisosPendientes', () => {
  it('no avisa mientras faltan más de 5 días', () => {
    expect(avisosPendientes(vacante, '2026-11-20')).toEqual([]);
  });
  it('avisa 5, 3 y 0 en su día', () => {
    expect(avisosPendientes(vacante, '2026-11-24')).toEqual([5]);
    expect(avisosPendientes({ ...vacante, avisosEnviados: [5] }, '2026-11-26')).toEqual([3]);
    expect(avisosPendientes({ ...vacante, avisosEnviados: [5, 3] }, '2026-11-29')).toEqual([0]);
  });
  it('no duplica los ya enviados', () => {
    expect(avisosPendientes({ ...vacante, avisosEnviados: [5, 3, 0] }, '2026-12-05')).toEqual([]);
  });
  it('junta los atrasados si se saltaron días', () => {
    expect(avisosPendientes(vacante, '2026-11-26')).toEqual([5, 3]);
  });
  it('ignora vacantes que no están activas', () => {
    expect(avisosPendientes({ ...vacante, estado: 'pausada' }, '2026-11-29')).toEqual([]);
  });
});

describe('cumpleDescarte', () => {
  it('exige todas las respuestas esperadas', () => {
    expect(cumpleDescarte(vacante.preguntas, { q1: true, q2: true })).toBe(true);
    expect(cumpleDescarte(vacante.preguntas, { q1: true, q2: false })).toBe(false);
  });
  it('una pregunta sin respuesta no cumple; sin preguntas sí', () => {
    expect(cumpleDescarte(vacante.preguntas, { q1: true })).toBe(false);
    expect(cumpleDescarte([], {})).toBe(true);
  });
});

describe('puedePublicar', () => {
  it('permite con prueba o plan vigentes', () => {
    expect(puedePublicar(empresa, HOY)).toBe(true);
    expect(
      puedePublicar({ ...empresa, plan: { id: 'pro', estado: 'activo', venceEl: HOY } }, HOY),
    ).toBe(true);
  });
  it('bloquea si el plan está vencido o la fecha ya pasó', () => {
    expect(puedePublicar({ ...empresa, plan: { ...empresa.plan, estado: 'vencido' } }, HOY)).toBe(
      false,
    );
    expect(puedePublicar(empresa, '2026-11-14')).toBe(false);
  });
});
