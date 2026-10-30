import { Navigate, Outlet } from 'react-router-dom';
import { useDemoStore, type Rol } from '@/store/useDemoStore';

/** Deja pasar solo a quien tiene la sesión simulada del rol; si no, manda a /entrar. */
export function RequireRole({ rol }: { rol: Rol }) {
  const sesion = useDemoStore((s) => s.sesion);
  if (sesion?.rol !== rol) return <Navigate to="/entrar" replace />;
  return <Outlet />;
}
