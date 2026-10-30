const MS_DIA = 86_400_000;

function aUtc(iso: string): number {
  const [a = '1970', m = '1', d = '1'] = iso.slice(0, 10).split('-');
  return Date.UTC(Number(a), Number(m) - 1, Number(d));
}

/** Suma (o resta) días a una fecha AAAA-MM-DD. */
export function sumarDias(iso: string, dias: number): string {
  return new Date(aUtc(iso) + dias * MS_DIA).toISOString().slice(0, 10);
}

/** Días completos de `desde` a `hasta` (positivo si `hasta` es posterior). */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aUtc(hasta) - aUtc(desde)) / MS_DIA);
}
