import { cargaSimulada } from '@/lib/esperar';
import { useDemoStore, type Rol, type Sesion } from '@/store/useDemoStore';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_CONTRASENA = 6;

export function correoValido(correo: string): boolean {
  return CORREO.test(correo.trim());
}

export function contrasenaValida(contrasena: string): boolean {
  return contrasena.length >= MIN_CONTRASENA;
}

export type ResultadoAuth =
  | { ok: true; sesion: Sesion }
  | { ok: false; error: 'correo' | 'contrasena' };

/**
 * Cualquier correo y contraseña válidos entran. Si el correo coincide con una cuenta
 * del rol, entra a ella; si no, entra a la primera cuenta de ese rol.
 */
export async function entrar(correo: string, contrasena: string, rol: Rol): Promise<ResultadoAuth> {
  if (!correoValido(correo)) return { ok: false, error: 'correo' };
  if (!contrasenaValida(contrasena)) return { ok: false, error: 'contrasena' };
  await cargaSimulada();

  const s = useDemoStore.getState();
  const buscado = correo.trim().toLowerCase();
  let id = 'admin';
  if (rol === 'candidato') {
    id = (s.candidatos.find((c) => c.correo.toLowerCase() === buscado) ?? s.candidatos[0])?.id ?? '';
  } else if (rol === 'empresa') {
    id = (s.empresas.find((e) => e.correo.toLowerCase() === buscado) ?? s.empresas[0])?.id ?? '';
  }
  s.entrarComo(rol, id);
  return { ok: true, sesion: { rol, id } };
}

export function cerrarSesion(): void {
  useDemoStore.getState().salir();
}
