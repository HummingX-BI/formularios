export const CLASE_CONTROL =
  'min-h-12 w-full rounded-boton border bg-superficie px-3.5 text-base text-texto placeholder:text-texto-3 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marca ' +
  'disabled:cursor-not-allowed disabled:bg-fondo disabled:text-texto-3';

export function describedBy(id: string, ayuda?: string, error?: string): string | undefined {
  if (error) return `${id}-error`;
  return ayuda ? `${id}-ayuda` : undefined;
}
