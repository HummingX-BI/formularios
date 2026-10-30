import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout, CandidatoLayout, EmpresaLayout, PublicLayout } from '@/layouts';
import { RequireRole } from '@/RequireRole';
import { DemoPanel } from '@/demo/DemoPanel';
import { useDemoUi } from '@/demo/useDemoUi';
import { PhoneFrame, ToastProvider } from '@/ui';

const P01Inicio = lazy(() => import('@/screens/publico/P01Inicio'));
const P02Acceso = lazy(() => import('@/screens/publico/P02Acceso'));
const P03ConstructorCv = lazy(() => import('@/screens/candidato/P03ConstructorCv'));
const P04Plantillas = lazy(() => import('@/screens/candidato/P04Plantillas'));
const P05Pago = lazy(() => import('@/screens/candidato/P05Pago'));
const P06Vacantes = lazy(() => import('@/screens/candidato/P06Vacantes'));
const P07Vacante = lazy(() => import('@/screens/candidato/P07Vacante'));
const P08Postulaciones = lazy(() => import('@/screens/candidato/P08Postulaciones'));
const P09Planes = lazy(() => import('@/screens/empresa/P09Planes'));
const P10Panel = lazy(() => import('@/screens/empresa/P10Panel'));
const P11NuevaVacante = lazy(() => import('@/screens/empresa/P11NuevaVacante'));
const P12Postulantes = lazy(() => import('@/screens/empresa/P12Postulantes'));
const P13Perfiles = lazy(() => import('@/screens/empresa/P13Perfiles'));
const P14Headhunting = lazy(() => import('@/screens/empresa/P14Headhunting'));
const P15Tablero = lazy(() => import('@/screens/admin/P15Tablero'));
const P16Gestion = lazy(() => import('@/screens/admin/P16Gestion'));
const P17Catalogos = lazy(() => import('@/screens/admin/P17Catalogos'));

function Cargando() {
  return (
    <p role="status" className="py-10 text-center text-base text-texto-2">
      Cargando…
    </p>
  );
}

function Rutas() {
  return (
    <HashRouter>
      <Suspense fallback={<Cargando />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<P01Inicio />} />
            <Route path="/registro/candidato" element={<P02Acceso modo="candidato" />} />
            <Route path="/registro/empresa" element={<P02Acceso modo="empresa" />} />
            <Route path="/entrar" element={<P02Acceso modo="entrar" />} />
          </Route>

          <Route element={<RequireRole rol="candidato" />}>
            <Route element={<CandidatoLayout />}>
              <Route path="/candidato" element={<Navigate to="/candidato/vacantes" replace />} />
              <Route path="/candidato/cv/paso/:n" element={<P03ConstructorCv />} />
              <Route path="/candidato/cv" element={<P04Plantillas />} />
              <Route path="/candidato/cv/pagar" element={<P05Pago />} />
              <Route path="/candidato/vacantes" element={<P06Vacantes />} />
              <Route path="/candidato/vacantes/:id" element={<P07Vacante />} />
              <Route path="/candidato/postulaciones" element={<P08Postulaciones />} />
            </Route>
          </Route>

          <Route element={<RequireRole rol="empresa" />}>
            <Route element={<EmpresaLayout />}>
              <Route path="/empresa" element={<P10Panel />} />
              <Route path="/empresa/planes" element={<P09Planes />} />
              <Route path="/empresa/vacantes/nueva" element={<P11NuevaVacante />} />
              <Route path="/empresa/vacantes/:id/postulantes" element={<P12Postulantes />} />
              <Route path="/empresa/perfiles" element={<P13Perfiles />} />
              <Route path="/empresa/headhunting" element={<P14Headhunting />} />
            </Route>
          </Route>

          <Route element={<RequireRole rol="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<P15Tablero />} />
              <Route path="/admin/gestion" element={<P16Gestion />} />
              <Route path="/admin/catalogos" element={<P17Catalogos />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

/** Vista celular: la misma app dentro de un iframe de 390 px, para que los breakpoints respondan como en un teléfono. */
function VistaCelular() {
  const src = `${window.location.pathname}${window.location.search}${window.location.hash || '#/'}`;
  return (
    <div className="flex min-h-screen items-center justify-center bg-marca-suave py-6">
      <PhoneFrame>
        <iframe
          data-vista-celular
          title="Vista celular de Talentiamex"
          src={src}
          className="block h-full w-full border-0"
        />
      </PhoneFrame>
    </div>
  );
}

export default function App() {
  const vistaCelular = useDemoUi((s) => s.vistaCelular);
  // Dentro del iframe de vista celular la app no muestra el panel de demo.
  const enMarco = window.self !== window.top;
  return (
    <ToastProvider>
      {vistaCelular && !enMarco ? <VistaCelular /> : <Rutas />}
      {!enMarco && <DemoPanel />}
    </ToastProvider>
  );
}
