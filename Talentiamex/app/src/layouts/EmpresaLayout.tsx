import type { CSSProperties } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Megaphone,
  PlusCircle,
  Target,
  UserSearch,
} from 'lucide-react';
import { cerrarSesion } from '@/sim/auth';
import { useDemoStore } from '@/store/useDemoStore';
import { Logo } from '@/ui/Logo';
import { TransicionPantalla } from '@/ui/TransicionPantalla';
import { ChipPlan } from './ChipPlan';
import { ALTO_NAV_INFERIOR, BarraInferior, NavLateral, type ItemNav } from './nav';

const ITEMS: ItemNav[] = [
  { to: '/empresa', texto: 'Panel', icono: LayoutDashboard, exacto: true },
  { to: '/empresa/vacantes/nueva', texto: 'Vacantes', icono: PlusCircle },
  { to: '/empresa/perfiles', texto: 'Perfiles', icono: UserSearch },
  { to: '/empresa/headhunting', texto: 'Headhunting', icono: Target },
  { to: '/empresa/planes', texto: 'Plan', icono: CreditCard },
];

/** Empresa: barra lateral en escritorio con chip de plan y días de prueba; menú inferior en móvil. */
export function EmpresaLayout() {
  const navigate = useNavigate();
  const empresa = useDemoStore((s) =>
    s.sesion?.rol === 'empresa' ? s.empresas.find((e) => e.id === s.sesion?.id) : undefined,
  );

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen md:flex"
      style={{ '--alto-nav-inferior': ALTO_NAV_INFERIOR } as CSSProperties}
    >
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-borde bg-superficie p-4 pb-20 md:flex">
        <Logo to="/empresa" />
        {empresa && (
          <div className="rounded-tarjeta bg-fondo p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-texto">
              <Megaphone size={16} aria-hidden="true" />
              <span className="truncate">{empresa.nombre}</span>
            </p>
            <div className="mt-2">
              <ChipPlan empresaId={empresa.id} />
            </div>
          </div>
        )}
        <NavLateral items={ITEMS} />
        <button
          type="button"
          onClick={salir}
          className="mt-auto flex min-h-12 items-center gap-3 rounded-boton px-3 text-base font-medium text-texto-2 hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
        >
          <LogOut size={20} aria-hidden="true" />
          Salir
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-borde bg-superficie px-4 md:hidden">
          <Logo to="/empresa" />
          <div className="flex items-center gap-2">
            {empresa && <ChipPlan empresaId={empresa.id} />}
            <button
              type="button"
              onClick={salir}
              aria-label="Salir"
              className="flex h-11 w-11 items-center justify-center rounded-boton text-texto-2 hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
            >
              <LogOut size={20} aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
          <TransicionPantalla>
            <Outlet />
          </TransicionPantalla>
        </main>
      </div>
      <BarraInferior items={ITEMS} />
    </div>
  );
}
