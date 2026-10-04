import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { PlotChart } from '@/charts/PlotChart';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';
import { formatNum, formatPercent } from '@/insights/templates';
import { useAppStore } from '@/app/store';

// Mock SEO Data generator (since it's not part of main dataset)
const generateSeoData = (seed: number) => {
  // Simple deterministic random 
  const r = (min: number, max: number, s: number) => { 
    const x = Math.sin(seed + s) * 10000; 
    return min + (x - Math.floor(x)) * (max - min); 
  }; 
  
  const keywords = [ 
    { kw: 'clases de natacion', pos: Math.round(r(1, 5, 1)), change: Math.round(r(-2, 3, 2)), imp: Math.round(r(5000, 10000, 3)), clicks: Math.round(r(500, 1500, 4)) }, 
    { kw: 'escuela de natacion infantil', pos: Math.round(r(3, 8, 5)), change: Math.round(r(-1, 2, 6)), imp: Math.round(r(3000, 6000, 7)), clicks: Math.round(r(300, 800, 8)) }, 
    { kw: 'natacion bebes', pos: Math.round(r(8, 15, 9)), change: Math.round(r(-3, 1, 10)), imp: Math.round(r(2000, 4000, 11)), clicks: Math.round(r(50, 200, 12)) }, 
    { kw: 'curso de verano natacion', pos: Math.round(r(12, 25, 13)), change: Math.round(r(0, 5, 14)), imp: Math.round(r(8000, 15000, 15)), clicks: Math.round(r(100, 400, 16)) }, 
    { kw: 'aprender a nadar adultos', pos: Math.round(r(5, 12, 17)), change: Math.round(r(-2, 2, 18)), imp: Math.round(r(2500, 5000, 19)), clicks: Math.round(r(150, 400, 20)) }, 
  ].map(k => ({ ...k, ctr: k.clicks / k.imp })); 
  
  // Opportunities: High volume (imp > 3000) and pos > 10 
  const opportunities = keywords.filter(k => k.imp > 3000 && k.pos > 10); 
  
  // Sparklines 
  keywords.forEach(k => { 
    (k as any).history = Array.from({ length: 12 }, (_, i) => Math.round(k.clicks * r(0.7, 1.3, i * 100))); 
  }); 
  
  return { keywords, opportunities };
};

export default function M13_1_SEO() {
  const { seed, setExplanationContext } = useAppStore();
  const { keywords, opportunities } = useMemo(() => generateSeoData(seed), [seed]);
  
  const funnelData = [
    { stage: 'Visitas al Sitio', count: 12500 },
    { stage: 'Prospectos (Leads)', count: 850 },
    { stage: 'Inscritos', count: 142 },
  ];
  
  const sessionsAreaChart = [
    {
      name: 'Orgánico',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [3000, 3200, 3500, 3300, 4000, 4200],
      type: 'scatter',
      stackgroup: 'one',
    },
    {
      name: 'Directo',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [1000, 1100, 1050, 1200, 1150, 1300],
      type: 'scatter',
      stackgroup: 'one',
    },
    {
      name: 'Social',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [800, 950, 900, 850, 1100, 1050],
      type: 'scatter',
      stackgroup: 'one',
    },
    {
      name: 'Referidos',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [200, 250, 300, 280, 350, 400],
      type: 'scatter',
      stackgroup: 'one',
    },
  ];
  
  const insightData: any = {
    id: 'seo_1',
    moduleId: 'M13.1',
    severity: opportunities.length > 0 ? 'atencion' : 'positivo',
    headline:
      opportunities.length > 0
        ? 'Oportunidades de tráfico orgánico detectadas'
        : 'Rendimiento orgánico saludable',
    summary:
      'El análisis automatizado de palabras clave sugiere oportunidades de optimización (H13).',
    bullets:
      opportunities.length > 0
        ? opportunities.map(
            (o) =>
              `La búsqueda "${o.kw}" tiene ${formatNum(o.imp)} impresiones pero estamos en posición ${o.pos}.`,
          )
        : ['Todas las palabras clave principales están en la primera página.'],
    action:
      opportunities.length > 0
        ? { text: 'Crear campaña de contenido', actionType: 'task', targetModule: 'M13.2' }
        : undefined,
    evidence: [],
  } as const;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-jakarta font-bold text-navy-900">
              SEO y Analítica Web
            </h1>
            <Badge color="bg-ice-100 text-secundario">Analítica del sitio simulada</Badge>
          </div>
          <p className="text-lg text-secundario mt-1">
            ¿Qué tan bien me encuentran en internet y qué tanto convierte mi sitio?
          </p>
        </div>
      </div>
      
      <Card className="p-6 bg-white border border-ice-100 shadow-sm">
        <InsightBlock insight={insightData} />
      </Card>
      
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 bg-white border border-ice-100 shadow-sm overflow-hidden p-6">
          <PlotChart
            id="seo_sessions_chart"
            title="Sesiones por Fuente"
            subtitle="Últimos 6 meses apilados"
            data={sessionsAreaChart as any}
            layout={{ showlegend: true, legend: { orientation: 'h', y: -0.2 } }}
            altText="Gráfica de áreas apiladas de sesiones por fuente"
            tableData={{ columns: [], rows: [] }}
            onExplain={() => setExplanationContext('seo_sessions_chart')}
          />
        </Card>
        
        <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden p-6 flex flex-col items-center justify-center">
          <h3 className="font-bold text-navy-900 font-jakarta self-start w-full mb-4">
            Embudo de Conversión del Sitio
          </h3>
          <div className="w-full space-y-4">
            {funnelData.map((step, idx) => {
              const firstCount = funnelData[0]?.count || 1;
              const prevCount = funnelData[idx - 1]?.count || 1;
              const width = Math.max(20, (step.count / firstCount) * 100);
              const conversion = idx > 0 ? step.count / prevCount : null;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className="h-10 bg-sky-400 rounded-md flex items-center justify-center text-white font-bold transition-all duration-500 shadow-sm"
                    style={{ width: `${width}%` }}
                  >
                    {formatNum(step.count)}
                  </div>
                  <div className="text-sm font-semibold text-navy-900 mt-1">{step.stage}</div>
                  {conversion !== null && (
                    <div className="text-xs text-secundario mt-2 mb-2 flex items-center gap-1">
                      <span className="text-green-500 font-bold">
                        ↓ {formatPercent(conversion * 100)}
                      </span>{' '}
                      conversión
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      
      <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-ice-100 flex justify-between items-center bg-ice-50">
          <h3 className="font-bold text-navy-900 font-jakarta">
            Rendimiento de Palabras Clave
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ice-50 border-b border-ice-100">
              <tr>
                <th className="p-4 font-bold text-navy-900 text-sm">Palabra Clave</th>
                <th className="p-4 font-bold text-navy-900 text-sm text-center">Posición</th>
                <th className="p-4 font-bold text-navy-900 text-sm text-right">Impresiones</th>
                <th className="p-4 font-bold text-navy-900 text-sm text-right">Clics</th>
                <th className="p-4 font-bold text-navy-900 text-sm text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ice-100">
              {keywords.map((kw, i) => (
                <tr key={i} className="hover:bg-sky-50 transition-colors">
                  <td className="p-4 font-semibold text-navy-900">{kw.kw}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold">{kw.pos}</span>
                      {kw.change !== 0 && (
                        <span
                          className={`text-xs font-bold ${kw.change > 0 ? 'text-green-500' : 'text-coral'}`}
                        >
                          {kw.change > 0 ? '↑' : '↓'} {Math.abs(kw.change)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 tabular-figures text-right">{formatNum(kw.imp)}</td>
                  <td className="p-4 tabular-figures text-right text-sky-600 font-bold">
                    {formatNum(kw.clicks)}
                  </td>
                  <td className="p-4 tabular-figures text-right font-medium">
                    {formatPercent(kw.ctr * 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
