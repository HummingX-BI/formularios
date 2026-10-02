import { useMemo } from 'react';
import { useMetrics } from '@/metrics/hooks';
import { KpiCard } from '@/ui/components/Cards';
import { generateInsightsFor } from '@/insights/generators';
import { generateAlerts } from '@/insights/alerts';
import { generateRecommendations } from '@/insights/recommendations';
import { Button } from '@/ui/components/Buttons';
import { SeverityPill } from '@/ui/components/DataDisplay';

export default function M1_1_Executive() {
  const metricsEngine = useMetrics();

  // Load basic metrics needed for M1.1
  const m = useMemo(() => {
    return {
      activos: metricsEngine.compute('alumnos_activos'),
      ingreso: metricsEngine.compute('ingresos_totales'),
      meta: metricsEngine.compute('meta_ingresos'),
      ocupacion: metricsEngine.compute('ocupacion_cupo'),
      prospectos: metricsEngine.compute('prospectos_nuevos'),
      retencion6m: metricsEngine.compute('retencion_6m'),
      riesgoAlto: metricsEngine.compute('riesgo_alto_baja'),
      // For funnel
      leads: metricsEngine.compute('leads'),
      contactados: metricsEngine.compute('contactados'),
      citas: metricsEngine.compute('citas'),
      inscritos: metricsEngine.compute('inscritos'),
    };
  }, [metricsEngine]);

  const insights = useMemo(() => generateInsightsFor('m1-executive', m), [m]);
  const headline = insights.length > 0 ? insights[0]!.headline : 'El negocio opera con normalidad';

  const alerts = useMemo(() => generateAlerts(m, { occupancyThreshold: 95, arrearsThreshold: 30000 }, new Date()).slice(0, 3), [m]);
  const recommendations = useMemo(() => generateRecommendations(m).slice(0, 3), [m]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Resumen Ejecutivo</h1>
          <p className="text-lg text-secundario mt-1">{headline}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Alumnos Activos"
          value={m.activos}
          variation={2.4}
          variationLabel="vs mes ant."
          semanticColor="positive"
          infoText="Total de alumnos con suscripción vigente"
          infoFormula="∑(Inscripciones) - ∑(Bajas)"
        />
        <KpiCard
          title="Ingresos vs Meta"
          value={m.ingreso}
          isCurrency
          variation={-1.2}
          variationLabel="vs mes ant."
          semanticColor="neutral"
          infoText="Ingreso cobrado este mes"
          infoFormula="∑(Pagos efectivos)"
        />
        <KpiCard
          title="Ocupación de Cupo"
          value={m.ocupacion}
          unit="%"
          variation={0.5}
          variationLabel="vs mes ant."
          semanticColor="positive"
          infoText="Porcentaje de lugares ocupados"
          infoFormula="(Ocupados / Capacidad) * 100"
        />
        <KpiCard
          title="Prospectos de la Semana"
          value={m.prospectos}
          variation={-5.0}
          variationLabel="vs sem ant."
          semanticColor="negative"
        />
        <KpiCard
          title="Retención a 6 meses"
          value={m.retencion6m}
          unit="%"
          semanticColor="neutral"
        />
        <KpiCard
          title="Alumnos en Riesgo Alto"
          value={m.riesgoAlto}
          semanticColor={m.riesgoAlto > 10 ? 'negative' : 'positive'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow-sm border border-ice-100 p-6">
          <h3 className="text-xl font-bold font-jakarta text-navy-900 mb-4">Brecha de Ingresos</h3>
          <p className="text-sm text-secundario mb-4">Diferencia entre ingreso posible y real</p>
          {/* Placeholder for gap visualization */}
          <div className="h-48 bg-ice-50 rounded flex items-center justify-center text-secundario">
            [Gráfica de Cascada de Brecha]
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-ice-100 p-6">
          <h3 className="text-xl font-bold font-jakarta text-navy-900 mb-4">Mini Embudo (Mes)</h3>
          {/* Placeholder for funnel */}
          <div className="h-48 bg-ice-50 rounded flex flex-col justify-center items-center text-secundario gap-2">
            <div>Leads: {m.leads}</div>
            <div>Contactados: {m.contactados}</div>
            <div>Citas: {m.citas}</div>
            <div>Inscritos: {m.inscritos}</div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h3 className="text-xl font-bold font-jakarta text-navy-900 mb-4">Alertas Prioritarias</h3>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-secundario">No hay alertas activas.</p>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="p-4 bg-white border border-ice-100 rounded-lg flex gap-4 shadow-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityPill level={alert.severity === 'critico' ? 'critical' : alert.severity === 'alerta' ? 'high' : 'medium'} />
                      <h4 className="font-bold text-navy-900">{alert.title}</h4>
                    </div>
                    <p className="text-sm text-secundario">{alert.message}</p>
                  </div>
                  <Button variant="secondary" size="sm">Descartar</Button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold font-jakarta text-navy-900 mb-4">Top Recomendaciones</h3>
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <p className="text-secundario">No hay recomendaciones en este momento.</p>
            ) : (
              recommendations.map(rec => (
                <div key={rec.id} className="p-4 bg-white border border-ice-100 rounded-lg shadow-sm">
                  <h4 className="font-bold text-navy-900 mb-1">{rec.title}</h4>
                  <p className="text-sm text-secundario mb-3">{rec.rationale}</p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">Aceptar</Button>
                    <Button variant="secondary" size="sm">Posponer</Button>
                    <Button variant="ghost" size="sm">Descartar</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
