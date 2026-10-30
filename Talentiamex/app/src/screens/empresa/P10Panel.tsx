// P10 · HU-3.3, HU-3.4
import {
  AlarmClock,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  Inbox,
  PlusCircle,
  Star,
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { fechaCorta } from '@/lib/formato';
import { diasRestantes } from '@/store/reglas';
import { kpisEmpresa, postulantesNuevosDeVacante } from '@/store/selectors';
import { useDemoStore } from '@/store/useDemoStore';
import type { EstadoVacante } from '@/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  KpiCard,
  ScreenHeader,
  SectorChip,
  StickyAction,
  VigenciaBar,
} from '@/ui';
import type { TonoBadge } from '@/ui';

const ESTADO_VACANTE: Record<
  Exclude<EstadoVacante, 'activa'>,
  { tono: TonoBadge; texto: string }
> = {
  pausada: { tono: 'ambar', texto: 'Pausada' },
  cerrada: { tono: 'gris', texto: 'Cerrada' },
  vencida: { tono: 'rojo', texto: 'Vencida' },
};

const DIAS_POR_VENCER = 5;

export default function P10Panel() {
  const hoy = useDemoStore((s) => s.hoy);
  const vacantes = useDemoStore((s) => s.vacantes);
  const postulaciones = useDemoStore((s) => s.postulaciones);
  const empresa = useDemoStore((s) =>
    s.sesion?.rol === 'empresa' ? s.empresas.find((e) => e.id === s.sesion?.id) : undefined,
  );
  const kpis = useDemoStore(useShallow((s) => kpisEmpresa(s, empresa?.id ?? '')));
  const nuevosPorVacante = useDemoStore(
    useShallow((s) =>
      Object.fromEntries(
        s.vacantes.map((v) => [v.id, postulantesNuevosDeVacante(s, v.id)] as const),
      ),
    ),
  );

  if (!empresa) return <Navigate to="/entrar" replace />;

  const propias = vacantes
    .filter((v) => v.empresaId === empresa.id)
    .sort((a, b) => b.publicadaEl.localeCompare(a.publicadaEl));
  const porVencer = propias.filter((v) => {
    const d = diasRestantes(v, hoy);
    return v.estado === 'activa' && d >= 0 && d <= DIAS_POR_VENCER;
  });

  const { estado, venceEl } = empresa.plan;
  const etiquetaDias = estado === 'prueba' ? 'Días de prueba' : 'Días de tu plan';

  return (
    <div>
      <ScreenHeader
        titulo={`Hola, ${empresa.nombre}`}
        subtitulo="Esto es lo que pasa con tus vacantes hoy"
      />

      <div className="mb-5 flex flex-col gap-3">
        {estado === 'prueba' && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-boton bg-accion-suave p-3 text-base font-medium text-accion-hover"
          >
            <CalendarClock size={20} aria-hidden="true" />
            Tu prueba termina el {fechaCorta(venceEl)}.
            <Link to="/empresa/planes" className="ml-auto font-semibold underline">
              Ver planes
            </Link>
          </p>
        )}
        {(estado === 'sin_plan' || estado === 'vencido') && (
          <p
            role="status"
            className="flex flex-wrap items-center gap-2 rounded-boton bg-alerta-suave p-3 text-base font-medium text-alerta"
          >
            <AlarmClock size={20} aria-hidden="true" />
            {estado === 'vencido'
              ? 'Tu prueba o plan terminó. Elige un plan para seguir publicando.'
              : 'Empieza tu prueba gratis para publicar vacantes.'}
            <Link to="/empresa/planes" className="ml-auto font-semibold underline">
              Elegir plan
            </Link>
          </p>
        )}
        {porVencer.length > 0 && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-boton bg-alerta-suave p-3 text-base font-medium text-alerta"
          >
            <AlarmClock size={20} aria-hidden="true" />
            {porVencer.length === 1
              ? '1 vacante vence'
              : `${porVencer.length} vacantes vencen`} en {DIAS_POR_VENCER} días o menos.
          </p>
        )}
      </div>

      <section aria-label="Resumen" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard valor={kpis.vacantesActivas} etiqueta="Vacantes activas" icono={Briefcase} />
        <KpiCard valor={kpis.postulantesNuevos} etiqueta="Postulantes nuevos" icono={Inbox} />
        <KpiCard valor={kpis.preseleccionados} etiqueta="Preseleccionados" icono={Star} />
        <KpiCard
          valor={kpis.diasPlan === null ? '—' : kpis.diasPlan}
          etiqueta={etiquetaDias}
          icono={CalendarClock}
        />
      </section>

      <section aria-label="Tus vacantes" className="mt-8">
        <h2 className="mb-3 font-titulo text-xl font-semibold text-texto">Tus vacantes</h2>
        {propias.length === 0 ? (
          <EmptyState
            icono={ClipboardCheck}
            titulo="Aún no publicas vacantes"
            texto="Publica tu primera vacante y empieza a recibir candidatos."
            accion={
              <Button icono={PlusCircle} to="/empresa/vacantes/nueva">
                Publicar vacante
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {propias.map((v) => {
              const total = postulaciones.filter((p) => p.vacanteId === v.id).length;
              const nuevos = nuevosPorVacante[v.id] ?? 0;
              return (
                <li key={v.id}>
                  <Card className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-titulo text-lg font-semibold text-texto">{v.puesto}</h3>
                        {v.estado !== 'activa' && (
                          <Badge tono={ESTADO_VACANTE[v.estado].tono}>
                            {ESTADO_VACANTE[v.estado].texto}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <SectorChip sector={v.sector} />
                        <span className="text-base text-texto-2">
                          {total === 1 ? '1 postulante' : `${total} postulantes`}
                        </span>
                        {nuevos > 0 && (
                          <Badge tono="rojo">{nuevos === 1 ? '1 nuevo' : `${nuevos} nuevos`}</Badge>
                        )}
                      </div>
                    </div>
                    {v.estado === 'activa' || v.estado === 'vencida' ? (
                      <div className="lg:w-64">
                        <VigenciaBar dias={diasRestantes(v, hoy)} />
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button variante="secundario" to={`/empresa/vacantes/${v.id}/postulantes`}>
                        Ver postulantes
                      </Button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <StickyAction>
        <Button icono={PlusCircle} to="/empresa/vacantes/nueva" className="flex-1 md:flex-none">
          Publicar vacante
        </Button>
      </StickyAction>
    </div>
  );
}
