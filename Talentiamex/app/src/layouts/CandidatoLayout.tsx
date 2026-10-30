import type { CSSProperties } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, FileText, LogOut, Send, UserRound } from 'lucide-react';
import { cerrarSesion } from '@/sim/auth';
import { useDemoStore } from '@/store/useDemoStore';
import { Avatar } from '@/ui/Avatar';
import { Logo } from '@/ui/Logo';
import { TransicionPantalla } from '@/ui/TransicionPantalla';
import { ALTO_NAV_INFERIOR, BarraInferior, NavSuperior, type ItemNav } from './nav';

const ITEMS: ItemNav[] = [
  { to: '/candidato/vacantes', texto: 'Vacantes', icono: Briefcase },
  { to: '/candidato/cv', texto: 'Mi CV', icono: FileText, exacto: true },
  { to: '/candidato/postulaciones', texto: 'Postulaciones', icono: Send },
  { to: '/candidato/cv/paso/1', texto: 'Perfil', icono: UserRound },
];

/** Candidato: barra inferior en móvil y barra superior en escritorio. */
export function CandidatoLayout() {
  const navigate = useNavigate();
  const candidato = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined,
  );

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ '--alto-nav-inferior': ALTO_NAV_INFERIOR } as CSSProperties}
    >
      <header className="border-b border-borde bg-superficie">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <Logo to="/candidato/vacantes" />
          <NavSuperior items={ITEMS} />
          <div className="flex items-center gap-2">
            {candidato && (
              <Avatar
                nombre={candidato.nombre}
                {...(candidato.fotoUrl ? { fotoUrl: candidato.fotoUrl } : {})}
                sector={candidato.sector}
                tamano="sm"
              />
            )}
            <button
              type="button"
              onClick={salir}
              className="flex min-h-11 items-center gap-2 rounded-boton px-3 text-base font-medium text-texto-2 hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
            >
              <LogOut size={20} aria-hidden="true" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <TransicionPantalla>
          <Outlet />
        </TransicionPantalla>
      </main>
      <BarraInferior items={ITEMS} />
    </div>
  );
}
