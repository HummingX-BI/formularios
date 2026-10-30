import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ItemNav {
  to: string;
  texto: string;
  icono: LucideIcon;
  /** Solo se marca activo con la ruta exacta (para "Panel", "Tablero"). */
  exacto?: boolean;
}

const FOCO =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca';

/** Alto de la barra inferior; StickyAction se coloca encima de ella. */
export const ALTO_NAV_INFERIOR = '4rem';

/** Menú inferior de móvil. */
export function BarraInferior({ items, oscura = false }: { items: ItemNav[]; oscura?: boolean }) {
  return (
    <nav
      aria-label="Menú principal"
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 flex h-16 border-t md:hidden',
        oscura ? 'border-white/10 bg-admin' : 'border-borde bg-superficie',
      )}
    >
      {items.map(({ to, texto, icono: Icono, exacto }) => (
        <NavLink
          key={to}
          to={to}
          end={exacto === true}
          className={({ isActive }) =>
            cn(
              'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 text-[11px] font-medium',
              FOCO,
              oscura
                ? isActive
                  ? 'text-white'
                  : 'text-texto-3'
                : isActive
                  ? 'text-marca'
                  : 'text-texto-2',
            )
          }
        >
          <Icono size={22} aria-hidden="true" />
          <span className="max-w-full truncate">{texto}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/** Enlaces en fila (barra superior de escritorio). */
export function NavSuperior({ items }: { items: ItemNav[] }) {
  return (
    <nav aria-label="Menú principal" className="hidden items-center gap-1 md:flex">
      {items.map(({ to, texto, icono: Icono, exacto }) => (
        <NavLink
          key={to}
          to={to}
          end={exacto === true}
          className={({ isActive }) =>
            cn(
              'flex min-h-11 items-center gap-2 rounded-boton px-3 text-base font-medium',
              FOCO,
              isActive ? 'bg-marca-suave text-marca' : 'text-texto-2 hover:bg-fondo',
            )
          }
        >
          <Icono size={20} aria-hidden="true" />
          {texto}
        </NavLink>
      ))}
    </nav>
  );
}

/** Enlaces en columna (barra lateral de escritorio). */
export function NavLateral({ items, oscura = false }: { items: ItemNav[]; oscura?: boolean }) {
  return (
    <nav aria-label="Menú principal" className="flex flex-col gap-1">
      {items.map(({ to, texto, icono: Icono, exacto }) => (
        <NavLink
          key={to}
          to={to}
          end={exacto === true}
          className={({ isActive }) =>
            cn(
              'flex min-h-12 items-center gap-3 rounded-boton px-3 text-base font-medium',
              FOCO,
              oscura
                ? isActive
                  ? 'bg-white/15 text-white'
                  : 'text-texto-3 hover:bg-white/10 hover:text-white'
                : isActive
                  ? 'bg-marca-suave text-marca'
                  : 'text-texto-2 hover:bg-fondo',
            )
          }
        >
          <Icono size={20} aria-hidden="true" />
          {texto}
        </NavLink>
      ))}
    </nav>
  );
}
