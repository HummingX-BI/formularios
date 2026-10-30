import { esperar } from '@/lib/esperar';
import { useDemoStore } from '@/store/useDemoStore';

export const ESPERA_PAGO_MS = 1200;

/** Tarjeta de prueba que siempre se rechaza. */
const TERMINACION_RECHAZADA = '0002';

export type ResultadoPago =
  | { ok: true; folio: string }
  | { ok: false; error: string };

/** Simula un cobro: espera 1.2 s, aprueba y registra el ingreso para el tablero (P15). */
export async function pagar(monto: number, concepto: string, tarjeta = ''): Promise<ResultadoPago> {
  await esperar(ESPERA_PAGO_MS);
  const digitos = tarjeta.replace(/\D/g, '');
  if (digitos.endsWith(TERMINACION_RECHAZADA)) {
    return { ok: false, error: 'Tu tarjeta fue rechazada. Revisa los datos o prueba con otra.' };
  }
  const tienda = useDemoStore.getState();
  tienda.registrarIngreso(concepto, monto);
  const folio = `TMX-${String(useDemoStore.getState().ingresos.length).padStart(5, '0')}`;
  return { ok: true, folio };
}
