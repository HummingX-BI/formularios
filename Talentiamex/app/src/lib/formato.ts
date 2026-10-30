const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const MONEDA = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

/** $1,234 MXN */
export function moneda(monto: number): string {
  return `${MONEDA.format(monto)} MXN`;
}

/** 28 oct 2026 */
export function fechaCorta(iso: string): string {
  const [a = '', m = '1', d = '1'] = iso.slice(0, 10).split('-');
  return `${Number(d)} ${MESES[Number(m) - 1] ?? ''} ${a}`;
}

/** feb 2021 (a partir de AAAA-MM) */
export function mesAnio(valor: string): string {
  const [a = '', m = '1'] = valor.split('-');
  return `${MESES[Number(m) - 1] ?? ''} ${a}`.trim();
}

/** 55 1234 5678 */
export function telefono(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(-10);
  if (digitos.length !== 10) return valor;
  return `${digitos.slice(0, 2)} ${digitos.slice(2, 6)} ${digitos.slice(6)}`;
}
