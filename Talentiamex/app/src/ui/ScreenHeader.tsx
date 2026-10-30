import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Miga {
  texto: string;
  to?: string;
}

interface ScreenHeaderProps {
  titulo: string;
  /** Dice qué sigue o qué puede hacer la persona aquí. */
  subtitulo?: string | undefined;
  migas?: Miga[];
  paso?: { actual: number; total: number };
  /** Contenido a la derecha del título (por ejemplo, un botón secundario). */
  acciones?: ReactNode;
}

export function ScreenHeader({ titulo, subtitulo, migas, paso, acciones }: ScreenHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
      <div className="min-w-0">
        {migas && migas.length > 0 && (
          <nav aria-label="Dónde estás" className="mb-1">
            <ol className="flex flex-wrap items-center gap-1 text-sm font-medium text-texto-2">
              {migas.map((m, i) => (
                <li key={m.texto} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
                  {m.to ? (
                    <Link
                      to={m.to}
                      className="rounded hover:text-marca focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
                    >
                      {m.texto}
                    </Link>
                  ) : (
                    <span aria-current="page">{m.texto}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {paso && (
          <p className="mb-1 text-sm font-medium text-texto-2">
            Paso {paso.actual} de {paso.total}
          </p>
        )}
        <h1 className="font-titulo text-[28px] font-bold leading-tight text-texto md:text-4xl">
          {titulo}
        </h1>
        {subtitulo && <p className="mt-2 text-base text-texto-2">{subtitulo}</p>}
      </div>
      {acciones && <div className="shrink-0">{acciones}</div>}
    </header>
  );
}
