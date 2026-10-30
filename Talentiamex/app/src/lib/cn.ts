type Clase = string | false | null | undefined;

/** Une clases de Tailwind ignorando los valores vacíos. */
export function cn(...clases: Clase[]): string {
  return clases.filter(Boolean).join(' ');
}
