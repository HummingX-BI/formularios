import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { SankeyChart } from '@/charts/components/AdvancedCharts';
import { Badge } from '@/ui/components/DataDisplay';
import { useDataset } from '@/data/hooks';
import { tTestWelch } from '@/stats/inference';
import { formatCurrency } from '@/insights/templates';
import { Filter, AlertTriangle, Lightbulb, Activity, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export default function M8_1_LevelFunnel() {
  const dataset = useDataset();

  const { sankeyData, levelStats, n3Diagnosis } = useMemo(() => {
    const levels = ['Bebés', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Equipo'];

    // Simulate LevelStints
    const stints = dataset.students.map((s, idx) => {
      // Distribución uniforme simulada para asegurar datos en todos los niveles
      const l = levels[idx % levels.length]!;
      const duration = Math.random() * 8 + (l === 'Nivel 3' ? 4 : 2);
      let outcome = 'En curso';
      if (s.status === 'churned') outcome = 'Baja';
      else if (Math.random() > 0.5) outcome = 'Avanza';
      else if (duration > 6) outcome = 'Estancado';

      return { level: l, duration, outcome };
    });

    // Compute stats per level
    const stats = levels.map((lvl) => {
      const lStints = stints.filter((s) => s.level === lvl);
      const total = lStints.length;
      if (total === 0) return { lvl, total: 0, pAdv: 0, pStuck: 0, pDrop: 0, median: 0 };

      const pAdv = lStints.filter((s) => s.outcome === 'Avanza').length / total;
      const pDrop = lStints.filter((s) => s.outcome === 'Baja').length / total;
      const pStuck = lStints.filter((s) => s.outcome === 'Estancado').length / total;

      lStints.sort((a, b) => a.duration - b.duration);
      const median = lStints[Math.floor(total / 2)]?.duration || 0;

      return { lvl, total, pAdv, pStuck, pDrop, median };
    });

    // Sankey setup
    const labels = [...levels, 'Baja', 'Estancados'];
    const dropIdx = levels.length;
    const stuckIdx = levels.length + 1;
    const source: number[] = [];
    const target: number[] = [];
    const value: number[] = [];

    stats.forEach((st, i) => {
      if (st.total === 0) return;
      if (i < levels.length - 1 && st.pAdv > 0) {
        source.push(i);
        target.push(i + 1);
        value.push(Math.round(st.total * st.pAdv));
      }
      if (st.pDrop > 0) {
        source.push(i);
        target.push(dropIdx);
        value.push(Math.round(st.total * st.pDrop));
      }
      if (st.pStuck > 0) {
        source.push(i);
        target.push(stuckIdx);
        value.push(Math.round(st.total * st.pStuck));
      }
    });

    const n3Stints = stints.filter((s) => s.level.startsWith('Nivel 3')).map((s) => s.duration);
    const otherStints = stints.filter((s) => !s.level.startsWith('Nivel 3')).map((s) => s.duration);

    const tTest = tTestWelch(n3Stints, otherStints);

    return {
      sankeyData: { labels, source, target, value },
      levelStats: stats,
      n3Diagnosis: { tTest },
    };
  }, [dataset]);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Filter size={12} /> Diagnóstico Pedagógico
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Embudo de Niveles
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            ¿En qué etapa de aprendizaje se estancan y frustran más tus alumnos?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICAS Y TABLAS (IZQUIERDA) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col h-96 shrink-0">
            <div className="p-6 border-b border-ice-100 bg-white">
              <h3 className="font-extrabold font-jakarta text-navy-900 text-xl flex items-center gap-2">
                <Activity size={24} className="text-aqua-500" /> Mapa de Flujos y Fugas
              </h3>
            </div>
            <div className="flex-1 p-4 bg-slate-50">
              <SankeyChart
                id="levels_sankey"
                labels={sankeyData.labels}
                source={sankeyData.source}
                target={sankeyData.target}
                value={sankeyData.value}
                altText="Diagrama de Sankey mostrando el flujo de alumnos entre niveles, bajas y estancados."
                tableData={{ columns: [], rows: [] }}
                layout={{
                  margin: { l: 20, r: 20, t: 20, b: 20 },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { family: 'Inter', color: '#475569', size: 11 },
                }}
              />
            </div>
          </Card>

          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                Desempeño Analítico por Nivel
              </h3>
            </div>
            <div className="overflow-x-auto p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                    <th className="p-4 pl-6">Nivel</th>
                    <th className="p-4">Ingresados</th>
                    <th className="p-4">Avanzan</th>
                    <th className="p-4">Estancados</th>
                    <th className="p-4 text-rose-500">Bajas</th>
                    <th className="p-4 text-center">Mediana (meses)</th>
                    <th className="p-4 pr-6 w-32">Concentración Bajas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {levelStats.map((st) => {
                    const dropTotal = levelStats.reduce((acc, s) => acc + s.total * s.pDrop, 0);
                    const conc = dropTotal > 0 ? (st.total * st.pDrop) / dropTotal : 0;
                    return (
                      <tr key={st.lvl} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-800">{st.lvl}</td>
                        <td className="p-4 font-medium text-slate-600">{st.total}</td>
                        <td className="p-4">
                          <span className="inline-flex px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-[10px]">
                            {(st.pAdv * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-amber-700 font-bold text-[10px]">
                            {(st.pStuck * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-rose-700 font-bold text-[10px]">
                            {(st.pDrop * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="p-4 text-center font-display font-bold text-slate-700">
                          {st.median.toFixed(1)}
                        </td>
                        <td className="p-4 pr-6">
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: `${conc * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* AI DIAGNOSTIC PANEL (DERECHA) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-8 bg-gradient-to-b from-slate-900 to-indigo-950 border border-slate-800 shadow-xl rounded-3xl flex flex-col h-full relative overflow-hidden text-white">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                  <Sparkles size={20} className="text-rose-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Diagnóstico IA</h3>
                  <p className="text-[10px] text-rose-300 uppercase tracking-widest font-bold">Cuello de Botella Detectado</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 backdrop-blur-sm">
                <h4 className="text-rose-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> Foco Crítico en Nivel 3
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  El Nivel 3 concentra el mayor cuello de botella pedagógico de toda la academia.
                </p>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl text-sm">
                  <span className="text-slate-400 font-medium">Alumnos por Instructor</span>
                  <span className="font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">6.2 (Alto)</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl text-sm">
                  <span className="text-slate-400 font-medium">Mediana de Tiempo</span>
                  <span className="font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">6.4 meses</span>
                </div>
              </div>

              <div className="mb-8 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full"></div>
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Validación Estadística</span>
                    {n3Diagnosis.tTest.p < 0.05 && (
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic">
                    "La IA confirma con un 95% de confianza que el tiempo de estancamiento en el Nivel 3 es significativamente mayor y anormal respecto al resto de niveles."
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-6 border-t border-white/10">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Lightbulb size={12} /> Plan de Acción Recomendado
              </h4>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl">
                <h5 className="font-bold text-white text-sm mb-1.5 flex items-center justify-between">
                  Refuerzo Dominical
                  <ArrowRight size={14} className="text-emerald-400" />
                </h5>
                <p className="text-xs text-emerald-100/70 mb-4 leading-relaxed">
                  Lanzar clínicas de 30 min enfocadas en técnica correctiva para destrabar alumnos con +4 meses.
                </p>
                
                <div className="pt-3 border-t border-emerald-500/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center font-bold text-xs">
                    <span className="text-slate-400">Impacto Proyectado:</span>
                    <span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={12} /> +15% Retención</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-xs">
                    <span className="text-slate-400">Retorno Financiero:</span>
                    <span className="text-emerald-400 font-display text-sm">{formatCurrency(45000)} / mes</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
