// P08 · HU-4.3
import { Building2, CalendarDays, ChevronRight, Search, Send } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { fechaCorta } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import { BadgePostulacion, Button, Card, EmptyState, ScreenHeader, SectorChip } from '@/ui';

export default function P08Postulaciones() {
  const candidatoId = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.sesion.id : undefined,
  );
  const postulaciones = useDemoStore((s) => s.postulaciones);
  const vacantes = useDemoStore((s) => s.vacantes);
  const empresas = useDemoStore((s) => s.empresas);

  if (!candidatoId) return <Navigate to="/entrar" replace />;

  const mias = postulaciones
    .filter((p) => p.candidatoId === candidatoId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));

  return (
    <div className="mx-auto max-w-3xl">
      <ScreenHeader titulo="Tus postulaciones" subtitulo="Aquí ves cómo vas en cada vacante" />

      {mias.length === 0 ? (
        <EmptyState
          icono={Send}
          titulo="Aún no te postulas"
          texto="Cuando te postules a una vacante, aquí verás cómo va tu proceso."
          accion={
            <Button icono={Search} to="/candidato/vacantes">
              Buscar vacantes
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {mias.map((p) => {
            const vacante = vacantes.find((v) => v.id === p.vacanteId);
            const empresa = empresas.find((e) => e.id === vacante?.empresaId);
            if (!vacante) return null;
            return (
              <li key={p.id}>
                <Card to={`/candidato/vacantes/${vacante.id}`} className="flex items-center gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-titulo text-lg font-semibold text-texto">
                        {vacante.puesto}
                      </h2>
                      <BadgePostulacion estado={p.estado} paraCandidato />
                    </div>
                    <p className="flex items-center gap-1.5 text-base text-texto-2">
                      <Building2 size={16} aria-hidden="true" />
                      {empresa?.nombre ?? ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-texto-2">
                      <SectorChip sector={vacante.sector} />
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={16} aria-hidden="true" />
                        Te postulaste el {fechaCorta(p.fecha)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={22} className="shrink-0 text-texto-3" aria-hidden="true" />
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
