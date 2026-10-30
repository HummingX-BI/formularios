import { contrasenaValida, correoValido } from '@/sim/auth';

export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

/** Da formato "55 1234 5678" mientras la persona escribe (máximo 10 dígitos). */
export function formatearCelularEscribiendo(valor: string): string {
  const d = soloDigitos(valor).slice(0, 10);
  return [d.slice(0, 2), d.slice(2, 6), d.slice(6)].filter(Boolean).join(' ');
}

/** 1234 5678 9012 3456 */
export function formatearTarjeta(valor: string): string {
  return (
    soloDigitos(valor)
      .slice(0, 16)
      .match(/.{1,4}/g)
      ?.join(' ') ?? ''
  );
}

/** MM/AA */
export function formatearVencimiento(valor: string): string {
  const d = soloDigitos(valor).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function errorTarjeta(valor: string): string | undefined {
  if (soloDigitos(valor).length === 0) return 'Escribe el número de tu tarjeta';
  return soloDigitos(valor).length === 16 ? undefined : 'El número debe tener 16 dígitos';
}

export function errorVencimiento(valor: string): string | undefined {
  const d = soloDigitos(valor);
  if (d.length === 0) return 'Escribe la fecha de vencimiento';
  const mes = Number(d.slice(0, 2));
  return d.length === 4 && mes >= 1 && mes <= 12 ? undefined : 'Usa el formato MM/AA';
}

export function errorCvv(valor: string): string | undefined {
  const largo = soloDigitos(valor).length;
  if (largo === 0) return 'Escribe el código de seguridad';
  return largo === 3 || largo === 4 ? undefined : 'Son 3 o 4 dígitos';
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
