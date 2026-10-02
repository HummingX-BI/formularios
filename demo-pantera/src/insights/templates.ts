/**
 * Template engine for natural language generation.
 * NEVER hardcode digits in string literals used for insights.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars


export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function agreeGender(isFeminine: boolean, masculine: string, feminine: string): string {
  return isFeminine ? feminine : masculine;
}

export function joinList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(', ')} y ${last}`;
}

export function relativeComparative(value: number, baseline: number, _isPositiveGood: boolean): string {
  const diff = value - baseline;
  const absDiff = Math.abs(diff);
  if (absDiff < 0.001) return 'similar a';

  const direction = diff > 0 ? 'por arriba de' : 'por debajo de';
  return `${direction}`;
}

export function intensityLevel(value: number, thresholds: [number, number]): string {
  if (value < thresholds[0]) return 'leve';
  if (value < thresholds[1]) return 'moderado';
  return 'severo';
}

export function formatNum(n: number, decimals: number = 0): string {
  // We use Intl.NumberFormat to avoid hardcoding digits
  return new Intl.NumberFormat('es-MX', { 
    maximumFractionDigits: decimals, 
    minimumFractionDigits: decimals 
  }).format(n);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN', 
    maximumFractionDigits: 0 
  }).format(n);
}

export function formatPercent(n: number, decimals: number = 1): string {
  return new Intl.NumberFormat('es-MX', { 
    style: 'percent', 
    maximumFractionDigits: decimals 
  }).format(n / 100);
}
