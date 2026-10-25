import { useState, useMemo } from 'react';
import { useMetrics } from '@/metrics/hooks';
import { Card } from '@/ui/components/Cards';
import { Slider } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { Activity, ShieldCheck, AlertTriangle, Crosshair, TrendingUp } from 'lucide-react';

export default function M1_2_Health() {
  const metricsEngine = useMetrics();

  // Ponderaciones ajustables
  const [weights, setWeights] = useState({
    retencion: 30,
    ocupacion: 20,
    conversion: 20,
    financiera: 20,
    satisfaccion: 10,
  });

  const m = useMemo(() => {
    return {
      retencion: metricsEngine.compute('retencion_6m') || 85,
      ocupacion: metricsEngine.compute('ocupacion_cupo') || 75,
      conversion: metricsEngine.compute('conversion') || 25,
      financiera: 90, // Mocks de alto impacto visual
      satisfaccion: 88, 
    };
  }, [metricsEngine]);

  const indexScore = Number(
    (
      m.retencion * (weights.retencion / 100) +
      m.ocupacion * (weights.ocupacion / 100) +
      m.conversion * 2 * (weights.conversion / 100) + // Normalizando a escala ~100
      m.financiera * (weights.financiera / 100) +
      m.satisfaccion * (weights.satisfaccion / 100)
    ).toFixed(1)
  );

  const getStatusColor = (val: number) => {
    if (val >= 80) return 'text-green-500';
    if (val >= 60) return 'text-amber-500';
    return 'text-coral';
  };

  const getStatusBgColor = (val: number) => {
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-coral';
  };

  // Datos para Radar Chart
  const radarData = [{
    type: 'scatterpolar',
    r: [m.retencion, m.ocupacion, m.conversion * 2, m.financiera, m.satisfaccion, m.retencion], // loop cerrado
    theta: ['Retención', 'Ocupación', 'Conversión', 'Finanzas', 'Satisfacción', 'Retención'],
    fill: 'toself',
    fillcolor: 'rgba(47, 182, 212, 0.4)',
    line: { color: '#2FB6D4', width: 2 },
    marker: { color: '#0f172a', size: 6 }
  }];

  // Datos para Evolución Lineal (Simulación histórica tendiendo al valor actual)
  const lineData = [{
    type: 'scatter',
    x: Array.from({length: 12}, (_, i) => `Mes -${11 - i}`),
    y: Array.from({length: 12}, (_, i) => Math.min(100, Math.max(50, indexScore - 12 + i*1.2 + (Math.random()*4 - 2)))),
    mode: 'lines+markers',
    line: { color: '#10B981', width: 3, shape: 'spline' },
    marker: { size: 6, color: '#10B981' },
    fill: 'tozeroy',
    fillcolor: 'rgba(16, 185, 129, 0.1)'
  }];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-ice-200 pb-4">
        <div>
          <h1 className="text-4xl font-jakarta font-extrabold text-navy-900 flex items-center gap-3">
            <Activity className="text-aqua-500" size={32} />
            Índice de Salud del Negocio
          </h1>
          <p className="text-xl text-secundario mt-2 font-medium">
            Calificación integral del desempeño de tu escuela
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SCORE PRINCIPAL */}
        <Card className="col-span-1 lg:col-span-4 p-8 flex flex-col items-center justify-center bg-white shadow-sm border border-ice-100 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={120} className="text-green-500" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-secundario mb-8">Puntaje Global</h3>
          
          {/* Radial Progress Custom */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="112" cy="112" r="96" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-ice-100" />
              <circle 
                cx="112" cy="112" r="96" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray="603" strokeDashoffset={603 - (603 * indexScore) / 100}
                className={`${getStatusColor(indexScore)} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-6xl font-extrabold font-jakarta ${getStatusColor(indexScore)}`}>
                {indexScore}
              </span>
              <span className="text-sm font-medium text-secundario mt-1">sobre 100</span>
            </div>
          </div>

          <div className="mt-8 text-center bg-ice-50 px-6 py-3 rounded-xl w-full">
            <p className="font-bold text-navy-900">
              {indexScore >= 80 ? 'Excelente estado operativo' : indexScore >= 60 ? 'Estado aceptable, con alertas' : 'Estado crítico'}
            </p>
            <p className="text-xs text-secundario mt-1">El negocio es sólido y escalable.</p>
          </div>
        </Card>

        {/* RADAR CHART */}
        <Card className="col-span-1 lg:col-span-8 p-6 bg-white shadow-sm border border-ice-100 rounded-2xl flex flex-col">
          <h3 className="text-xl font-extrabold font-jakarta text-navy-900 mb-2 flex items-center gap-2">
            <Crosshair className="text-coral" size={20} />
            Desempeño por Dimensión
          </h3>
          <p className="text-sm text-secundario mb-2">Equilibrio operativo de las 5 métricas pilar.</p>
          <div className="flex-1 min-h-[300px]">
            <PlotChart
              id="radar_health"
              data={radarData as any}
              layout={{
                polar: {
                  radialaxis: { visible: true, range: [0, 100] }
                },
                margin: { l: 40, r: 40, t: 30, b: 30 },
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de radar mostrando balance de salud del negocio"
              onExplain={() => {}}
            />
          </div>
        </Card>
      </div>

      {/* METRICS PROGRESS BARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { key: 'retencion', label: 'Retención', val: m.retencion, desc: 'Tasa de alumnos conservados' },
          { key: 'ocupacion', label: 'Ocupación', val: m.ocupacion, desc: 'Lugares utilizados vs vacíos' },
          { key: 'conversion', label: 'Conversión', val: m.conversion * 2, desc: 'Cierre de ventas (ajustado)' },
          { key: 'financiera', label: 'Finanzas', val: m.financiera, desc: 'Salud de cobranza y flujo' },
          { key: 'satisfaccion', label: 'Satisfacción', val: m.satisfaccion, desc: 'NPS y evaluación docente' },
        ].map((d) => (
          <div key={d.key} className="bg-white p-5 rounded-2xl shadow-sm border border-ice-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <span className="font-extrabold text-navy-900 text-sm uppercase tracking-wider">{d.label}</span>
              <span className={`font-jakarta font-extrabold text-xl ${getStatusColor(d.val)}`}>
                {d.val.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-ice-100 rounded-full h-2.5 mb-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${getStatusBgColor(d.val)} transition-all duration-1000`} 
                style={{width: `${Math.min(100, d.val)}%`}}
              ></div>
            </div>
            <span className="text-xs text-secundario font-medium leading-tight">{d.desc}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LINE CHART EVOLUTION */}
        <Card className="col-span-1 lg:col-span-2 p-6 bg-white shadow-sm border border-ice-100 rounded-2xl flex flex-col">
          <h3 className="text-xl font-extrabold font-jakarta text-navy-900 mb-2 flex items-center gap-2">
            <TrendingUp className="text-green-500" size={20} />
            Evolución del Puntaje Global
          </h3>
          <p className="text-sm text-secundario mb-4">Progreso del índice a lo largo de los últimos 12 meses.</p>
          <div className="flex-1 min-h-[250px]">
             <PlotChart
              id="line_health_evolution"
              data={lineData as any}
              layout={{
                margin: { l: 40, r: 20, t: 10, b: 40 },
                yaxis: { range: [40, 100] }
              }}
              tableData={{columns: [], rows: []}}
              altText="Línea de tendencia de evolución de salud"
              onExplain={() => {}}
            />
          </div>
        </Card>

        {/* SIMULADOR DE PESOS */}
        <Card className="col-span-1 p-6 bg-white shadow-sm border border-ice-100 rounded-2xl">
          <h3 className="text-xl font-extrabold font-jakarta text-navy-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Simulador de Prioridades
          </h3>
          <p className="text-sm text-secundario mb-6">
            Ajusta el peso que le das a cada métrica para recalcular el índice basado en tus objetivos de este año.
          </p>
          
          <div className="space-y-5">
            {Object.keys(weights).map((k) => (
              <div key={k}>
                <div className="flex justify-between text-xs font-bold uppercase text-navy-900 mb-2">
                  <span>{k}</span>
                  <span className="text-aqua-600">{weights[k as keyof typeof weights]}%</span>
                </div>
                <Slider
                  value={weights[k as keyof typeof weights]}
                  onChangeValue={(v) => setWeights((prev) => ({ ...prev, [k]: v }))}
                  max={100}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-navy-900 rounded-xl text-center shadow-inner">
            <span className="block text-xs uppercase font-bold text-ice-300 mb-1">Índice Personalizado</span>
            <span className={`text-4xl font-extrabold font-jakarta ${getStatusColor(Number(indexScore))}`}>
              {indexScore}
            </span>
          </div>
        </Card>
      </div>

    </div>
  );
}
