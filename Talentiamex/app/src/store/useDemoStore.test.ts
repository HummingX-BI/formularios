import { beforeEach, describe, expect, it } from 'vitest';
import { useDemoStore } from './useDemoStore';
import { kpisAdmin, kpisEmpresa, postulacionesPorDia } from './selectors';

const acciones = () => useDemoStore.getState();

beforeEach(() => {
  acciones().resetDemo();
});

describe('estado inicial', () => {
  it('arranca con la semilla y la fecha base', () => {
    const s = acciones();
    expect(s.hoy).toBe('2026-10-30');
    expect(s.empresas).toHaveLength(6);
    expect(s.candidatos).toHaveLength(46);
  });

  it('kpisAdmin arranca en 2 de 3 empresas y 46 de 50 candidatos', () => {
    const k = kpisAdmin(acciones());
    expect([k.empresasActivas, k.metaEmpresas]).toEqual([2, 3]);
    expect([k.candidatosActivos, k.metaCandidatos]).toEqual([46, 50]);
    expect(postulacionesPorDia(acciones())).toHaveLength(14);
  });
});

describe('flujo del guion', () => {
  it('Mariana y la clínica: registro, vacante, aviso y postulación', () => {
    const a = acciones();
    const mariana = a.registrarCandidato({
      nombre: 'Mariana López',
      celular: '55 1234 5678',
      correo: 'mariana@correo.mx',
    });
    acciones().guardarPasoCv(1, {
      zona: 'Iztapalapa',
      sector: 'salud',
      puestoDeseado: 'Enfermera(o) general',
      experiencias: [{ puesto: 'Enfermera', empresa: 'Clínica', desde: '2022-01' }],
    });

    const clinica = acciones().registrarEmpresa({
      nombre: 'Clínica San Rafael',
      sector: 'salud',
      tipo: 'hospital',
      contacto: 'Dra. Laura Méndez',
      celular: '55 9999 0000',
      correo: 'laura@sanrafael.mx',
    });
    expect(acciones().publicarVacante).toBeDefined();
    expect(
      acciones().publicarVacante({
        puesto: 'Enfermera general — turno nocturno',
        sector: 'salud',
        zona: 'Iztapalapa',
        sueldo: 14500,
        turno: 'nocturno',
        contrato: '',
        descripcion: '',
        requisitos: [],
        prestaciones: [],
        preguntas: [{ texto: '¿Cédula?', respuestaEsperada: true }],
      }),
    ).toBeNull(); // RD-04: sin plan no publica

    expect(acciones().iniciarPrueba('basico')).toBe(true);
    const vacanteId = acciones().publicarVacante({
      puesto: 'Enfermera general — turno nocturno',
      sector: 'salud',
      zona: 'Iztapalapa',
      sueldo: 14500,
      turno: 'nocturno',
      contrato: '',
      descripcion: '',
      requisitos: [],
      prestaciones: [],
      preguntas: [{ texto: '¿Cédula?', respuestaEsperada: true }],
    });
    expect(vacanteId).not.toBeNull();
    expect(
      acciones().mensajes.some((m) => m.regla === 'RN-08' && m.destinatarioId === mariana),
    ).toBe(true);

    acciones().entrarComo('candidato', mariana);
    const vacante = acciones().vacantes.find((v) => v.id === vacanteId);
    const q = vacante?.preguntas[0]?.id ?? '';
    const r = acciones().postularse(vacanteId ?? '', { [q]: true });
    expect(r.ok).toBe(true);
    expect(acciones().postularse(vacanteId ?? '', { [q]: true })).toEqual({
      ok: false,
      motivo: 'duplicada',
    });
    expect(
      acciones().mensajes.filter((m) => m.regla === 'RN-07' && m.destinatarioId === clinica),
    ).toHaveLength(1);

    acciones().entrarComo('empresa', clinica);
    expect(kpisEmpresa(acciones(), clinica).postulantesNuevos).toBe(1);
  });

  it('no se postula con CV incompleto', () => {
    const id = acciones().registrarCandidato({
      nombre: 'Ana',
      celular: '55 0000 0000',
      correo: 'a@a.mx',
    });
    expect(id).toBeTruthy();
    const vacante = acciones().vacantes.find((v) => v.estado === 'activa');
    expect(acciones().postularse(vacante?.id ?? '', {})).toEqual({
      ok: false,
      motivo: 'cv_incompleto',
    });
  });
});

describe('avanzarDias', () => {
  it('avanza la fecha y no duplica avisos al repetir', () => {
    acciones().avanzarDias(30);
    expect(acciones().hoy).toBe('2026-11-29');
    const total = acciones().mensajes.length;
    acciones().avanzarDias(0);
    expect(acciones().mensajes).toHaveLength(total);
  });

  it('resetDemo regresa al estado inicial', () => {
    acciones().avanzarDias(5);
    acciones().resetDemo();
    expect(acciones().hoy).toBe('2026-10-30');
    expect(acciones().mensajes).toHaveLength(3);
  });
});
