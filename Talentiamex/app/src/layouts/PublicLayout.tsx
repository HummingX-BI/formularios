import { Link, Outlet } from 'react-router-dom';
import { Logo } from '@/ui/Logo';

const ENLACE =
  'rounded text-sm font-medium text-texto-2 hover:text-marca focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca';

/** Páginas públicas: encabezado con logo y pie con privacidad, términos y acceso. */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-borde bg-superficie">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
          <Logo to="/" />
          <Link
            to="/entrar"
            className="flex min-h-11 items-center rounded-boton px-4 text-base font-semibold text-marca hover:bg-marca-suave focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-borde bg-superficie">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 md:px-8">
          <p className="text-sm text-texto-2">© 2026 Talentiamex</p>
          <nav aria-label="Información legal" className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="#/" className={ENLACE}>
              Aviso de privacidad
            </a>
            <a href="#/" className={ENLACE}>
              Términos y condiciones
            </a>
            <Link to="/entrar" className={ENLACE}>
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
