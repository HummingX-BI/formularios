import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDemoStore } from '@/store/useDemoStore';
import { entrar } from './auth';
import { pagar } from './pagos';
import { avanzarDias } from './reloj';
import { plantillaRN06, plantillaRN08, plantillaRN09 } from './plantillas';

beforeEach(() => {
  useDemoStore.getState().resetDemo();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('pagos', () => {
  it('aprueba tras 1.2 s y registra el ingreso', async () => {
    const promesa = pagar(49, 'CV en PDF', '4242 4242 4242 4242');
    await vi.advanceTimersByTimeAsync(1199);
    expect(useDemoStore.getState().ingresos).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);
    const r = await promesa;
    expect(r.ok).toBe(true);
    expect(useDemoStore.getState().ingresos).toEqual([
      expect.objectContaining({ concepto: 'CV en PDF', monto: 49 }),
    ]);
  });

  it('rechaza la tarjeta terminada en 0002 sin registrar ingreso', async () => {
    const promesa = pagar(49, 'CV en PDF', '4000 0000 0000 0002');
    await vi.advanceTimersByTimeAsync(1200);
    const r = await promesa;
    expect(r.ok).toBe(false);
    expect(useDemoStore.getState().ingresos).toHaveLength(0);
  });
});

describe('auth', () => {
  it('rechaza correo o contraseña inválidos', async () => {
    expect(await entrar('no-es-correo', '123456', 'candidato')).toEqual({ ok: false, error: 'correo' });
    expect(await entrar('a@b.mx', '123', 'candidato')).toEqual({ ok: false, error: 'contrasena' });
  });

  it('entra y guarda la sesión', async () => {
    const promesa = entrar('alguien@correo.mx', 'secreto1', 'admin');
    await vi.advanceTimersByTimeAsync(700);
    const r = await promesa;
    expect(r.ok).toBe(true);
    expect(useDemoStore.getState().sesion).toEqual({ rol: 'admin', id: 'admin' });
  });
});

describe('reloj', () => {
  it('avanza día por día y dispara 5, 3 y 0 una sola vez por vacante', () => {
    const s = useDemoStore.getState();
    const base = { hoy: s.hoy, vacantes: s.vacantes, empresas: s.empresas, avisosPlan: s.avisosPlan };
    const r = avanzarDias(base, 30);
    const deVacante = r.eventos.filter((e) => e.regla === 'RN-06' && e.vacanteId === 'vac-01');
    expect(deVacante.map((e) => (e.regla === 'RN-06' ? e.dias : -1))).toEqual([5, 3, 0]);
    const otraVez = avanzarDias(r.estado, 5);
    expect(otraVez.eventos.filter((e) => e.regla === 'RN-06')).toHaveLength(0);
  });
});

describe('plantillas', () => {
  it('arman texto, botón y ruta', () => {
    const s = useDemoStore.getState();
    const empresa = s.empresas[2];
    const vacante = s.vacantes[5];
    const candidato = s.candidatos[0];
    if (!empresa || !vacante || !candidato) throw new Error('semilla');
    expect(plantillaRN06(empresa, vacante, 0).texto).toContain('vence hoy');
    expect(plantillaRN06(empresa, vacante, 3).texto).toContain('vence en 3 días');
    expect(plantillaRN08(candidato, vacante, empresa).boton?.ruta).toBe(`/candidato/vacantes/${vacante.id}`);
    expect(plantillaRN09(empresa, 'Básico').boton?.ruta).toBe('/empresa/planes');
  });
});
