import { contrasenaValida, correoValido } from '@/sim/auth';

export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

/** Da formato "55 1234 5678" mientras la persona escribe (máximo 10 dígitos). */
export function formatearCelularEscribiendo(valor: string): string {
  const d = soloDigitos(valor).slice(0, 10);
  return [d.slice(0, 2), d.slice(2, 6), d.slice(6)].filter(Boolean).join(' ');
}

export function errorRequerido(valor: string, nombre: string): string | undefined {
  return valor.trim() === '' ? `Escribe ${nombre}` : undefined;
}

export function errorCelular(valor: string): string | undefined {
  if (soloDigitos(valor).length === 0) return 'Escribe tu celular';
  return soloDigitos(valor).length === 10 ? undefined : 'El celular debe tener 10 dígitos';
}

export function errorCorreo(valor: string): string | undefined {
  if (valor.trim() === '') return 'Escribe tu correo';
  return correoValido(valor) ? undefined : 'Revisa tu correo, parece que le falta algo';
}

export function errorContrasena(valor: string): string | undefined {
  if (valor === '') return 'Escribe una contraseña';
  return contrasenaValida(valor) ? undefined : 'Usa al menos 6 caracteres';
}
