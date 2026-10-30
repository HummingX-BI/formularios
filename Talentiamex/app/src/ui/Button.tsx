import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'peligro';

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-boton px-5 text-base font-semibold ' +
  'transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-marca disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'bg-accion text-white hover:bg-accion-hover',
  secundario: 'border border-marca bg-superficie text-marca hover:bg-marca-suave',
  fantasma: 'text-marca hover:bg-marca-suave',
  peligro: 'bg-error text-white hover:opacity-90',
};

interface ComunProps {
  variante?: VarianteBoton;
  icono?: LucideIcon;
  /** Muestra un spinner y bloquea el botón. */
  cargando?: boolean;
  anchoCompleto?: boolean;
  children: ReactNode;
  className?: string;
}

type BotonProps = ComunProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ComunProps | 'to'> & { to?: undefined };
type EnlaceProps = ComunProps & { to: string; onClick?: () => void };

interface ContenidoProps {
  cargando: boolean | undefined;
  icono: LucideIcon | undefined;
  children: ReactNode;
}

function Contenido({ cargando, icono: Icono, children }: ContenidoProps) {
  return (
    <>
      {cargando ? (
        <Loader2 className="animate-spin" size={20} aria-hidden="true" />
      ) : (
        Icono && <Icono size={20} className="shrink-0" aria-hidden="true" />
      )}
      {children}
    </>
  );
}

/** Botón de la plataforma. Con `to` se comporta como enlace con el mismo aspecto. */
export const Button = forwardRef<HTMLButtonElement, BotonProps | EnlaceProps>(
  function Button(props, ref) {
    const { variante = 'primario', icono, cargando, anchoCompleto, children, className } = props;
    const clases = cn(BASE, VARIANTES[variante], anchoCompleto && 'w-full', className);

    if (props.to !== undefined) {
      return (
        <Link to={props.to} className={clases} onClick={props.onClick}>
          <Contenido cargando={cargando} icono={icono}>
            {children}
          </Contenido>
        </Link>
      );
    }

    const {
      variante: _v,
      icono: _i,
      cargando: _c,
      anchoCompleto: _a,
      className: _cn,
      children: _ch,
      to: _to,
      type = 'button',
      disabled,
      ...resto
    } = props;
    return (
      <button
        ref={ref}
        type={type}
        className={clases}
        disabled={disabled === true || cargando === true}
        aria-busy={cargando}
        {...resto}
      >
        <Contenido cargando={cargando} icono={icono}>
          {children}
        </Contenido>
      </button>
    );
  },
);
