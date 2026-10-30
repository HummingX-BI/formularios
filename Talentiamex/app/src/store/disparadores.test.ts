import { beforeEach, describe, expect, it } from 'vitest';
import { CLINICA, MARIANA, VACANTE_GUION } from '@/data/personajes';
import { useDemoStore } from './useDemoStore';

const tienda = () => useDemoStore.getState();

function crearClinicaConVacante(): { empresaId: string; vacanteId: string } {
  const { contrasena: _c, ...datos } = CLINICA;
  const empresaId = tienda().registrarEmpresa(datos);
  expect(tienda().iniciarPrueba('pro')).toBe(true);
  const vacanteId = tienda().publicarVacante({
    ...VACANTE_GUION,
    sector: CLINICA.sector,
    contrato: VACANTE_GUION.contrato,
    descripcion: 'Atención de pacientes.',
    requisitos: [],
    prestaciones: [],
    preguntas: VACANTE_GUION.preguntas.map((p) => ({ ...p })),
  });
  expect(vacanteId).not.toBeNull();
  return { empresaId, vacanteId: vacanteId ?? '' };
}

const delDestinatario = (id: string) => tienda().mensajes.filter((m) => m.destinatarioId === id);

beforeEach(() => {
  tienda().resetDemo();
});

describe('disparadores de WhatsApp desde las acciones reales', () => {
  it('RN-08: publicar avisa a cada candidato que coincide, una sola vez', () => {
    const idMariana = tienda().registrarCandidato({
      nombre: MARIANA.nombre,
      celular: MARIANA.celular,
      correo: MARIANA.correo,
    });
    tienda().guardarPasoCv(5, MARIANA.cv);
    crearClinicaConVacante();

    const avisos = delDestinatario(idMariana).filter((m) => m.regla === 'RN-08');
    expect(avisos).toHaveLength(1);
    expect(avisos[0]?.boton?.ruta).toMatch(/^\/candidato\/vacantes\/vac-/);
  });

  it('RN-07: postularse avisa a la empresa y no se duplica', () => {
    const idMariana = tienda().registrarCandidato({
      nombre: MARIANA.nombre,
      celular: MARIANA.celular,
      correo: MARIANA.correo,
    });
    tienda().guardarPasoCv(5, MARIANA.cv);
    const { empresaId, vacanteId } = crearClinicaConVacante();

    tienda().entrarComo('candidato', idMariana);
    const vacante = tienda().vacantes.find((v) => v.id === vacanteId);
    const respuestas = Object.fromEntries((vacante?.preguntas ?? []).map((p) => [p.id, true]));
    expect(tienda().postularse(vacanteId, respuestas).ok).toBe(true);
    expect(tienda().postularse(vacanteId, respuestas)).toEqual({ ok: false, motivo: 'duplicada' });

    const avisos = delDestinatario(empresaId).filter((m) => m.regla === 'RN-07');
    expect(avisos).toHaveLength(1);
    expect(avisos[0]?.boton?.ruta).toBe(`/empresa/vacantes/${vacanteId}/postulantes`);
  });

  it('RN-06 y RN-09: avanzar 30 días da los avisos de 5, 3 y 0 días y uno de prueba, sin duplicar', () => {
    const { empresaId } = crearClinicaConVacante();

    tienda().avanzarDias(30);
    const regla = (r: 'RN-06' | 'RN-09') => delDestinatario(empresaId).filter((m) => m.regla === r);

    const vencimiento = regla('RN-06').map((m) => m.texto);
    expect(vencimiento).toHaveLength(3);
    expect(vencimiento[0]).toContain('vence en 5 días');
    expect(vencimiento[1]).toContain('vence en 3 días');
    expect(vencimiento[2]).toContain('vence hoy');
    expect(regla('RN-09')).toHaveLength(1);

    // RNF-07: avanzar otra vez no repite ningún aviso.
    const total = tienda().mensajes.length;
    tienda().avanzarDias(1);
    tienda().avanzarDias(10);
    expect(tienda().mensajes.length).toBe(total);
    expect(regla('RN-06')).toHaveLength(3);
    expect(regla('RN-09')).toHaveLength(1);
  });

  it('el aviso de prueba por vencer llega antes que los de la vacante', () => {
    const { empresaId } = crearClinicaConVacante();
    tienda().avanzarDias(30);
    const orden = delDestinatario(empresaId).map((m) => m.regla);
    expect(orden.indexOf('RN-09')).toBeLessThan(orden.indexOf('RN-06'));
  });

  it('renovar la vacante vuelve a armar sus avisos', () => {
    const { empresaId, vacanteId } = crearClinicaConVacante();
    tienda().iniciarPrueba('pro');
    tienda().contratarPlan('pro');
    tienda().avanzarDias(25);
    expect(delDestinatario(empresaId).filter((m) => m.regla === 'RN-06')).toHaveLength(1);
    expect(tienda().renovarVacante(vacanteId)).toBe(true);
    tienda().avanzarDias(25);
    expect(delDestinatario(empresaId).filter((m) => m.regla === 'RN-06')).toHaveLength(2);
  });
});
