import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** Si se indica, el logo es un enlace. */
  to?: string;
  /** Versión clara para fondos oscuros. */
  claro?: boolean;
  className?: string;
}

/** Wordmark provisional: "Talentiamex" con un punto verde. Se reemplaza sin tocar los componentes. */
export function Logo({ to, claro = false, className }: LogoProps) {
  const contenido = (
    <span
      className={cn(
        'inline-flex items-baseline font-titulo text-2xl font-bold',
        claro ? 'text-white' : 'text-marca',
        className,
      )}
    >
      Talentiamex
      <span className="ml-0.5 inline-block h-2 w-2 rounded-chip bg-accion" aria-hidden="true" />
    </span>
  );
  if (!to) return contenido;
  return (
    <Link
      to={to}
      aria-label="Talentiamex, ir al inicio"
      className="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
    >
      {contenido}
    </Link>
  );
}
