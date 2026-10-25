import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';
import { formatNum, formatPercent } from '@/insights/templates';
import { useAppStore } from '@/app/store';
import { Search, Filter, TrendingUp, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';

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
      line: { color: '#6366f1' } // indigo-500
    },
    {
      name: 'Directo',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [1000, 1100, 1050, 1200, 1150, 1300],
      type: 'scatter',
      stackgroup: 'one',
      line: { color: '#8b5cf6' } // violet-500
    },
    {
      name: 'Social',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [800, 950, 900, 850, 1100, 1050],
      type: 'scatter',
      stackgroup: 'one',
      line: { color: '#a855f7' } // purple-500
    },
    {
      name: 'Referidos',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [200, 250, 300, 280, 350, 400],
      type: 'scatter',
      stackgroup: 'one',
      line: { color: '#d946ef' } // fuchsia-500
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
      'El análisis automatizado de palabras clave sugiere oportunidades de optimización para captar más tráfico de búsqueda.',
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
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Globe size={12} /> Tráfico y Conversión
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            SEO y Analítica Web
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            ¿Qué tan bien me encuentran en internet y qué tanto convierte mi sitio?
          </p>
        </div>
      </div>
      
      {/* INSIGHT */}
      <Card className="p-0 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <InsightBlock insight={insightData} />
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AREA CHART */}
        <Card className="lg:col-span-2 p-0 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-500" /> Sesiones por Fuente (Últimos 6 meses)
            </h3>
          </div>
          <div className="min-h-[350px] p-5">
            <PlotChart
              id="seo_sessions_chart"
              title=""
              subtitle=""
              data={sessionsAreaChart as any}
              layout={{ 
                showlegend: true, 
                legend: { orientation: 'h', y: -0.2 }, 
                margin: { t: 10, r: 10, l: 40, b: 20 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                yaxis: { gridcolor: '#f1f5f9' },
                xaxis: { gridcolor: '#f1f5f9' }
              }}
              altText="Gráfica de áreas apiladas de sesiones por fuente"
              tableData={{ columns: [], rows: [] }}
              onExplain={() => setExplanationContext('seo_sessions_chart')}
            />
          </div>
        </Card>
        
        {/* FUNNEL */}
        <Card className="p-0 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter size={16} className="text-indigo-500" /> Embudo de Conversión
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
            {funnelData.map((step, idx) => {
              const firstCount = funnelData[0]?.count || 1;
              const prevCount = funnelData[idx - 1]?.count || 1;
              const width = Math.max(15, (step.count / firstCount) * 100);
              const conversion = idx > 0 ? step.count / prevCount : null;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full flex justify-between items-end mb-1.5 px-1">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{step.stage}</span>
                     <span className="text-xl font-display font-bold text-slate-900">{formatNum(step.count)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-10 overflow-hidden flex items-center shadow-inner relative">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full flex items-center justify-end pr-4 text-white text-xs font-bold transition-all duration-1000 shadow-sm"
                      style={{ width: `${width}%` }}
                    >
                    </div>
                  </div>
                  {conversion !== null && (
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-4 mb-2 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                      <span className="text-emerald-600 flex items-center text-xs">
                        <ArrowDownRight size={14} className="mr-0.5" /> {formatPercent(conversion * 100)}
                      </span>{' '}
                      tasa de conversión
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      
      {/* KEYWORDS TABLE */}
      <Card className="p-0 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Search size={16} className="text-indigo-500" /> Rendimiento de Palabras Clave
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Palabra Clave</th>
                <th className="px-5 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center">Posición</th>
                <th className="px-5 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right">Impresiones</th>
                <th className="px-5 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right">Clics</th>
                <th className="px-5 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keywords.map((kw, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 text-sm">{kw.kw}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-display font-bold text-slate-700">{kw.pos}</span>
                      {kw.change !== 0 && (
                        <span
                          className={`text-[10px] font-bold flex items-center px-2 py-0.5 rounded-md ${kw.change > 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-rose-700 bg-rose-50 border border-rose-100'}`}
                        >
                          {kw.change > 0 ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />} {Math.abs(kw.change)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-sm text-slate-600">{formatNum(kw.imp)}</td>
                  <td className="px-5 py-4 text-right font-mono text-sm font-bold text-indigo-600">
                    {formatNum(kw.clicks)}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-sm font-bold text-slate-700">
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
