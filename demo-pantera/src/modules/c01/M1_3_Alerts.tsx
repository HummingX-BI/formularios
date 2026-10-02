import { useMemo, useState } from 'react';
import { useMetrics } from '@/metrics/hooks';
import { useAppStore } from '@/app/store';
import { generateAlerts } from '@/insights/alerts';
import { Card } from '@/ui/components/Cards';
import { SeverityPill } from '@/ui/components/DataDisplay';
import { Button } from '@/ui/components/Buttons';
import { Select } from '@/ui/components/Inputs';

export default function M1_3_Alerts() {
  const store = useAppStore();
  const metricsEngine = useMetrics();
  
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('current');

  const m = useMemo(() => {
    return {
      ocupacion: metricsEngine.compute('ocupacion_cupo'),
      listaEspera: metricsEngine.compute('lista_espera_total') || 10,
      carteraVencida: metricsEngine.compute('cartera_vencida') || 45000,
      caidaConversion: 6,
      crecimientoListaEspera: 25,
      metaIngresosEnRiesgo: true,
      proyeccionIngresos: 280000,
      metaIngresos: 300000,
    };
  }, [metricsEngine]);

  const allAlerts = useMemo(() => generateAlerts(m, { occupancyThreshold: 95, arrearsThreshold: 30000 }, new Date()), [m]);
  
  // Filter out dismissed alerts and by severity
  const visibleAlerts = allAlerts.filter(a => 
    !store.dismissedAlerts.includes(a.id) && 
    (filterSeverity === 'all' || a.severity === filterSeverity)
  );

  const copyBriefing = () => {
    navigator.clipboard.writeText("Briefing Semanal...\nMejoras:\n- Retención subió.\nOportunidades:\n- Cartera vencida alta.");
    alert("Copiado al portapapeles");
  };

  const downloadBriefing = () => {
    const text = "Briefing Semanal...\nMejoras:\n- Retención subió.\nOportunidades:\n- Cartera vencida alta.";
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefing-${selectedWeek}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Alertas y Briefing Semanal</h1>
          <p className="text-lg text-secundario mt-1">Centro unificado de atención y resumen directivo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 flex justify-between items-center bg-ice-50">
            <h3 className="font-bold text-navy-900">Alertas Activas ({visibleAlerts.length})</h3>
            <Select 
              options={[
                { label: 'Todas las severidades', value: 'all' },
                { label: 'Crítico', value: 'critico' },
                { label: 'Alerta', value: 'alerta' },
                { label: 'Atención', value: 'atencion' },
                { label: 'Info', value: 'info' }
              ]} 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-48"
            />
          </Card>

          {visibleAlerts.length === 0 ? (
            <Card className="p-8 text-center text-secundario">
              No hay alertas que requieran tu atención.
            </Card>
          ) : (
            visibleAlerts.map(alert => (
              <Card key={alert.id} className="p-4 flex gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityPill level={alert.severity === 'critico' ? 'critical' : alert.severity === 'alerta' ? 'high' : alert.severity === 'atencion' ? 'medium' : 'low'} />
                    <h4 className="font-bold text-navy-900">{alert.title}</h4>
                    <span className="text-xs text-tenue bg-ice-50 px-2 py-0.5 rounded">{alert.type}</span>
                  </div>
                  <p className="text-sm text-secundario mb-3">{alert.message}</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Ir al módulo</Button>
                    {alert.dismissible && (
                      <Button variant="ghost" size="sm" onClick={() => store.dismissAlert(alert.id)}>Descartar</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-blue-800 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg font-jakarta">Briefing Semanal</h3>
              <Select 
                options={[
                  { label: 'Semana Actual', value: 'current' },
                  { label: 'Semana Anterior', value: 'prev1' },
                  { label: 'Hace 2 Semanas', value: 'prev2' }
                ]} 
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-40 text-navy-900"
              />
            </div>
            
            <div className="space-y-4 text-sm text-ice-100">
              <div>
                <h4 className="font-bold text-aqua-500 mb-1">Qué mejoró:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>La conversión aumentó 2%.</li>
                  <li>Se redujeron los pagos tardíos.</li>
                  <li>La retención del grupo 3 se estabilizó.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-coral mb-1">Qué empeoró:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Cartera vencida subió $15,000.</li>
                  <li>Faltas aumentaron por lluvias.</li>
                  <li>2 grupos con ocupación crítica.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sky-400 mb-1">Acciones sugeridas:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Lanzar cobranza prioritaria.</li>
                  <li>Enviar recordatorio de reposiciones.</li>
                  <li>Abrir grupo sabatino.</li>
                  <li>Llamar a 5 alumnos en riesgo.</li>
                  <li>Revisar tarifas.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="secondary" size="sm" onClick={copyBriefing}>Copiar</Button>
              <Button variant="ghost" size="sm" onClick={downloadBriefing} className="text-white border-white hover:bg-white/10">Descargar .txt</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
