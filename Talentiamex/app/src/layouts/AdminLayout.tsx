import type { CSSProperties } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListChecks, LogOut, Users } from 'lucide-react';
import { cerrarSesion } from '@/sim/auth';
import { Logo } from '@/ui/Logo';
import { TransicionPantalla } from '@/ui/TransicionPantalla';
import { ALTO_NAV_INFERIOR, BarraInferior, NavLateral, type ItemNav } from './nav';

const ITEMS: ItemNav[] = [
  { to: '/admin', texto: 'Tablero', icono: LayoutDashboard, exacto: true },
  { to: '/admin/gestion', texto: 'Gestión', icono: Users },
  { to: '/admin/catalogos', texto: 'Catálogos', icono: ListChecks },
];

/** Administrador: barra lateral oscura (navy) para distinguirlo de la empresa. */
export function AdminLayout() {
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen md:flex"
      style={{ '--alto-nav-inferior': ALTO_NAV_INFERIOR } as CSSProperties}
    >
      <aside className="hidden w-64 shrink-0 flex-col gap-6 bg-admin p-4 md:flex">
        <div>
          <Logo to="/admin" claro />
          <p className="mt-1 text-sm font-medium text-texto-3">Administración</p>
        </div>
        <NavLateral items={ITEMS} oscura />
        <button
          type="button"
          onClick={salir}
          className="mt-auto flex min-h-12 items-center gap-3 rounded-boton px-3 text-base font-medium text-texto-3 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <LogOut size={20} aria-hidden="true" />
          Salir
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between bg-admin px-4 md:hidden">
          <Logo to="/admin" claro />
          <button
            type="button"
            onClick={salir}
            aria-label="Salir"
            className="flex h-11 w-11 items-center justify-center rounded-boton text-texto-3 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <LogOut size={20} aria-hidden="true" />
          </button>
        </header>
        <main className="w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
          <TransicionPantalla>
            <Outlet />
          </TransicionPantalla>
        </main>
      </div>
      <BarraInferior items={ITEMS} oscura />
    </div>
  );
}
