import { describe, expect, it } from 'vitest';
import { generarSemilla } from './semilla';
import { HOY_INICIAL } from './config';
import { diasEntre, sumarDias } from '@/lib/fechas';

describe('generarSemilla', () => {
  const s = generarSemilla();

  it('respeta el volumen', () => {
    expect(s.empresas).toHaveLength(6);
    expect(s.vacantes).toHaveLength(14);
    expect(s.candidatos).toHaveLength(46);
    expect(s.postulaciones).toHaveLength(60);
    expect(s.solicitudes).toHaveLength(2);
    expect(s.mensajes).toHaveLength(3);
  });

  it('es determinista', () => {
    expect(generarSemilla()).toEqual(s);
  });

  it('incluye las empresas del guion y no a Mariana ni a Clínica San Rafael', () => {
    const nombres = s.empresas.map((e) => e.nombre);
    expect(nombres).toContain('Hospital Santa Fe Norte');
    expect(nombres).toContain('La Cocina de Doña Tere');
    expect(nombres).toContain('Colegio Monte Albán');
    expect(nombres).not.toContain('Clínica San Rafael');
    expect(s.candidatos.some((c) => c.nombre.startsWith('Mariana López'))).toBe(false);
  });

  it('arranca con 2 empresas con plan activo', () => {
    expect(s.empresas.filter((e) => e.plan.estado === 'activo')).toHaveLength(2);
  });

  it('tiene 2 vacantes que vencen en 5 días o menos y 1 pausada', () => {
    const vencen = s.vacantes.filter(
      (v) => v.estado === 'activa' && diasEntre(HOY_INICIAL, sumarDias(v.publicadaEl, 30)) <= 5,
    );
    expect(vencen.length).toBeGreaterThanOrEqual(2);
    expect(s.vacantes.filter((v) => v.estado === 'pausada')).toHaveLength(1);
  });

  it('las postulaciones son de los últimos 14 días y sin duplicados', () => {
    for (const p of s.postulaciones) {
      const dias = diasEntre(p.fecha, HOY_INICIAL);
      expect(dias).toBeGreaterThanOrEqual(0);
      expect(dias).toBeLessThan(14);
    }
    expect(new Set(s.postulaciones.map((p) => `${p.vacanteId}|${p.candidatoId}`)).size).toBe(60);
  });
});
