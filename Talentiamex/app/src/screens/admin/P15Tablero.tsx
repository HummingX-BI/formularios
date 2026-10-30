// P15 · HU-8.1, HU-8.4
import { useMemo } from 'react';
import { Briefcase, Download, Send, Wallet } from 'lucide-react';
import { monedaCorta } from '@/lib/formato';
import { kpisAdmin, postulacionesPorDia, resumenPorSector } from '@/store/selectors';
import { useDemoStore } from '@/store/useDemoStore';
import { Card, GoalMeter, KpiCard, ScreenHeader } from '@/ui';
import { GraficaPorDia, GraficaPorSector } from './GraficasTablero';
import { TablaHeadhunting } from './TablaHeadhunting';

export default function P15Tablero() {
  // Todo se calcula en vivo con los selectors a partir del estado de la demo.
  const estado = useDemoStore((s) => s);
  const kpis = useMemo(() => kpisAdmin(estado), [estado]);
  const porDia = useMemo(() => postulacionesPorDia(estado), [estado]);
  const porSector = useMemo(() => resumenPorSector(estado), [estado]);

  return (
    <div>
      <ScreenHeader titulo="Tablero del piloto" subtitulo="¿Vamos hacia la meta?" />

      <section aria-label="Metas del piloto" className="grid gap-4 md:grid-cols-2">
        <GoalMeter
          etiqueta="Empresas activas"
          actual={kpis.empresasActivas}
          meta={kpis.metaEmpresas}
        />
        <GoalMeter
          etiqueta="Candidatos activos"
          actual={kpis.candidatosActivos}
          meta={kpis.metaCandidatos}
        />
      </section>

      <section aria-label="Indicadores" className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard valor={kpis.vacantesActivas} etiqueta="Vacantes activas" icono={Briefcase} />
        <KpiCard
          valor={kpis.postulacionesSemana}
          etiqueta="Postulaciones de la semana"
          icono={Send}
        />
        <KpiCard valor={kpis.cvDescargados} etiqueta="CV descargados" icono={Download} />
        <KpiCard valor={monedaCorta(kpis.ingresos)} etiqueta="Ingresos (MXN)" icono={Wallet} />
      </section>

      <section aria-label="Gráficas" className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="mb-3 font-titulo text-lg font-semibold text-texto">
            Postulaciones por día
          </h2>
          <GraficaPorDia datos={porDia} />
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-titulo text-lg font-semibold text-texto">
            Candidatos por sector
          </h2>
          <GraficaPorSector datos={porSector} sectores={estado.sectores} />
        </Card>
      </section>

      <TablaHeadhunting />
    </div>
  );
}
