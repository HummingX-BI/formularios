import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { decomposeTimeSeries } from '@/ml/timeseries';
import { useDataset } from '@/data/hooks';

export default function M9_8_TimeSeries() {
  const dataset = useDataset();
  const [metric, setMetric] = useState('inscripciones');
  const [method, setMethod] = useState<'additive' | 'multiplicative'>('multiplicative');

  const { original, trend, seasonal, residual, indices, peakMonth, valleyMonth, xDates } = useMemo(() => {
    // Generate 36 months of mock data
    const n = 36;
    const xDates = [];
    const data = [];
    let base = 50;
    
    if (metric === 'inscripciones') base = 40;
    if (metric === 'prospectos') base = 120;
    if (metric === 'ingresos') base = 40000;
    if (metric === 'bajas') base = 15;

    for (let i = 0; i < n; i++) {
      const year = 2022 + Math.floor((i + 9) / 12); // Start in Oct 2022
      const month = (i + 9) % 12; // 0=Jan
      xDates.push(`${year}-${(month+1).toString().padStart(2, '0')}`);

      let trendFactor = i * (metric === 'ingresos' ? 500 : 1.5);
      
      // Seasonal pattern: Peak in Jan (0) and Aug (7), valley in Dec (11) and Apr (3)
      let s = 1;
      if (month === 0) s = 1.4; // Jan
      if (month === 7) s = 1.3; // Aug
      if (month === 11) s = 0.6; // Dec
      if (month === 3) s = 0.8; // Apr
      if (month === 6) s = 1.1; // Jul
      
      let noise = (Math.random() - 0.5) * (base * 0.1);
      
      if (method === 'multiplicative') {
        data.push((base + trendFactor) * s + noise);
      } else {
        // additive pseudo
        data.push(base + trendFactor + (s - 1) * base + noise);
      }
    }

    const decomp = decomposeTimeSeries(data, method);

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const indicesData = decomp.seasonalIndices.map((s, i) => ({ month: monthNames[i]!, s, i }));
    
    // Find peak and valley
    let peakIdx = 0;
    let valleyIdx = 0;
    for (let i = 1; i < 12; i++) {
      if (indicesData[i]!.s > indicesData[peakIdx]!.s) peakIdx = i;
      if (indicesData[i]!.s < indicesData[valleyIdx]!.s) valleyIdx = i;
    }

    return {
      original: data,
      trend: decomp.trend,
      seasonal: decomp.seasonal,
      residual: decomp.residual,
      indices: indicesData,
      peakMonth: indicesData[peakIdx]!,
      valleyMonth: indicesData[valleyIdx]!,
      xDates
    };
  }, [dataset, metric, method]);

  return (
    <LabLayout
      title="Series de Tiempo y Estacionalidad"
      businessQuestion="¿Qué parte de mis altibajos es temporada y qué parte es tendencia?"
      description="La descomposición estacional separa una serie histórica en tres fuerzas: la Tendencia (el rumbo de largo plazo), la Estacionalidad (los picos repetitivos de cada año) y el Ruido (los movimientos impredecibles)."
      formulas={method === 'additive' ? `Y = Tendencia + Estacionalidad + Ruido\n(Los índices estacionales suman 0)` : `Y = Tendencia × Estacionalidad × Ruido\n(Los índices estacionales promedian 1)`}
      assumptions="Requiere al menos 24 meses de datos históricos para extraer ciclos anuales confiables usando medias móviles centradas. No predice el futuro por sí sola (para eso se usa ARIMA o Prophet), sino que diagnostica el pasado."
      findings={
        <div className="space-y-6">
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-navy-900 mb-1">Serie Histórica</label>
              <Select 
                options={[
                  {label: 'Inscripciones (Altas)', value: 'inscripciones'},
                  {label: 'Prospectos (Leads)', value: 'prospectos'},
                  {label: 'Bajas Mensuales', value: 'bajas'},
                  {label: 'Ingresos Facturados', value: 'ingresos'}
                ]}
                value={metric}
                onChange={e => setMetric(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-navy-900 mb-1">Modelo de Descomposición</label>
              <Select 
                options={[
                  {label: 'Multiplicativo (Estacionalidad % proporcional)', value: 'multiplicative'},
                  {label: 'Aditivo (Estacionalidad fija en volumen)', value: 'additive'}
                ]}
                value={method}
                onChange={e => setMethod(e.target.value as any)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 flex flex-col gap-2">
              {[
                { title: '1. Datos Originales', y: original, color: '#0B2A47' },
                { title: '2. Tendencia (Movimiento Subyacente)', y: trend, color: '#F59E0B' },
                { title: '3. Estacionalidad (Patrón Anual)', y: seasonal, color: '#2FB6D4' },
                { title: '4. Ruido / Residuales', y: residual, color: '#64748B', type: 'bar' }
              ].map((panel, idx) => (
                <div key={idx} className="h-32 border border-ice-200 rounded p-1">
                  <PlotChart
                    id={`ts_${idx}`}
                    data={[{
                      type: panel.type === 'bar' ? 'bar' : 'scatter',
                      mode: 'lines',
                      x: xDates,
                      y: panel.y,
                      line: { color: panel.color, width: 2 },
                      marker: { color: panel.color }
                    } as any]}
                    layout={{ 
                      margin: { l: 40, r: 10, t: 20, b: 20 },
                      title: { text: panel.title, font: { size: 10 }, y: 0.95 },
                      xaxis: { showticklabels: idx === 3 }
                    }}
                    altText={panel.title}
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
              ))}
            </div>

            <div className="col-span-4 flex flex-col gap-4">
              <div className="h-64 border border-ice-200 rounded p-2">
                <PlotChart
                  id="seasonal_indices"
                  data={[{
                    type: 'bar',
                    x: indices.map(i => i.month),
                    y: indices.map(i => i.s),
                    marker: { 
                      color: indices.map(i => 
                        i.i === peakMonth.i ? '#22C55E' : 
                        i.i === valleyMonth.i ? '#EF4444' : '#94A3B8'
                      ) 
                    }
                  } as any]}
                  layout={{
                    margin: { l: 30, r: 10, t: 30, b: 30 },
                    title: { text: 'Perfil Estacional Promedio', font: { size: 12 } },
                    shapes: [{
                      type: 'line', x0: -0.5, x1: 11.5,
                      y0: method === 'additive' ? 0 : 1, y1: method === 'additive' ? 0 : 1,
                      line: { color: '#0F172A', dash: 'dash' }
                    }]
                  }}
                  altText="Índices Estacionales"
                  tableData={{ columns: [], rows: [] }}
                />
              </div>

              <div className="p-4 bg-white border border-ice-100 shadow-sm text-sm rounded">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-secundario">Mes Pico:</span>
                  <span className="font-bold text-green-700">{peakMonth.month} ({method === 'multiplicative' ? `+${((peakMonth.s - 1)*100).toFixed(0)}%` : `+${peakMonth.s.toFixed(0)}`})</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-secundario">Mes Valle:</span>
                  <span className="font-bold text-red-700">{valleyMonth.month} ({method === 'multiplicative' ? `${((valleyMonth.s - 1)*100).toFixed(0)}%` : `${valleyMonth.s.toFixed(0)}`})</span>
                </div>
                
                <div className="mt-4 pt-3 border-t border-ice-100">
                  <p className="text-xs text-navy-900 font-bold mb-1">Acción Sugerida:</p>
                  <p className="text-xs text-secundario leading-relaxed">
                    Tus campañas fuertes de captación deben lanzarse 3 a 4 semanas <strong>antes</strong> del pico de {peakMonth.month}. Para el valle de {valleyMonth.month}, planifica "Cursos de Verano" o Clínicas Intensivas para compensar el hueco de flujo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      action={
        <div className="space-y-4 text-sm text-navy-900">
          <p>
            No confundas <strong>Tendencia</strong> con <strong>Estacionalidad</strong>. Si en Octubre bajan tus ingresos respecto a Septiembre, pero el modelo muestra que es el valle histórico, no entres en pánico: es temporada baja. 
            El pánico solo está justificado si la línea amarilla (Tendencia) empieza a inclinarse hacia abajo a largo plazo.
          </p>
        </div>
      }
    />
  );
}
