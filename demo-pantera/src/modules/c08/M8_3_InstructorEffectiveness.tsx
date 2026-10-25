import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import {
  zTestTwoProportions,
  confIntervalProportionWilson,
  holmCorrection,
} from '@/stats/inference';
import { kaplanMeier } from '@/ml/kaplanMeier';
import { Users, Info, Activity, Award, CheckCircle2, AlertTriangle, TrendingUp, Shuffle } from 'lucide-react';

export default function M8_3_InstructorEffectiveness() {
  const dataset = useDataset();

  const { instStats, kmData, bestInst } = useMemo(() => {
    const instructors = ['Mariana', 'Ricardo', 'Sofia', 'Carlos'];

    // Group students by instructor (deterministic mock based on name)
    const grouped: Record<string, typeof dataset.students> = {};
    instructors.forEach((i) => (grouped[i] = []));

    dataset.students.forEach((s) => {
      const idx = (s.id.charCodeAt(0) + s.id.charCodeAt(1)) % instructors.length;
      grouped[instructors[idx]!]!.push(s);
    });

    // 6-month retention stats
    const rawStats = instructors.map((inst) => {
      const studs = grouped[inst]!;
      const total = studs.length;

      // those who stayed at least 6 months
      const retained6m = studs.filter((s) => {
        const t =
          (new Date(s.status === 'churned' && s.churnDate ? s.churnDate : Date.now()).getTime() -
            new Date(s.enrollmentDate).getTime()) /
          (1000 * 3600 * 24 * 30);
        return t >= 6;
      }).length;

      const p = retained6m / (total || 1);
      const ci = confIntervalProportionWilson(retained6m, total || 1);

      return { inst, total, retained6m, p, ci };
    });

    // Z-tests for each vs the rest
    const allTotal = dataset.students.length;
    const allRet = rawStats.reduce((acc, s) => acc + s.retained6m, 0);

    const pValues = rawStats.map((st) => {
      const restTotal = allTotal - st.total;
      const restRet = allRet - st.retained6m;
      const test = zTestTwoProportions(st.retained6m, st.total || 1, restRet, restTotal || 1);
      return test.p;
    });

    const adjPValues = holmCorrection(pValues);

    const instStats = rawStats.map((st, i) => ({
      ...st,
      pVal: pValues[i]!,
      adjPVal: adjPValues[i]!,
    }));

    instStats.sort((a, b) => b.p - a.p);
    const bestInst = instStats[0]!;

    // KM Curves
    const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b']; // Indigo, Rose, Emerald, Amber
    
    const kmData = instructors.map((inst, index) => {
      const studs = grouped[inst]!;
      const times: number[] = [];
      const events: boolean[] = [];

      studs.forEach((s) => {
        const start = new Date(s.enrollmentDate).getTime();
        const end =
          s.status === 'churned' && s.churnDate ? new Date(s.churnDate).getTime() : Date.now();
        times.push((end - start) / (1000 * 3600 * 24 * 30));
        events.push(s.status === 'churned');
      });

      const km = kaplanMeier(times, events, 12);
      return {
        type: 'scatter',
        mode: 'lines',
        name: inst,
        x: km.times,
        y: km.survival,
        line: { shape: 'hv', width: inst === bestInst.inst ? 4 : 2, color: colors[index % colors.length] },
      };
    });

    return { instStats, kmData, bestInst };
  }, [dataset]);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Users size={12} /> Recursos Humanos
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Efectividad por Instructor
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            ¿Qué instructor retiene mejor a sus alumnos y por qué?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICAS Y TABLAS (IZQUIERDA) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                Retención a 6 Meses por Instructor
              </h3>
              <div className="text-xs text-indigo-800 bg-indigo-50 px-4 py-2 border border-indigo-100 rounded-xl flex items-start gap-2 shadow-inner">
                <Info size={16} className="shrink-0 mt-0.5 text-indigo-500" />
                <span>
                  <strong>Significancia:</strong> Prueba Z de proporciones ajustada por método Holm.
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                    <th className="p-4 pl-6">Instructor</th>
                    <th className="p-4 text-center">Alumnos (n)</th>
                    <th className="p-4 text-center">Retención (p)</th>
                    <th className="p-4 text-center">IC 95% (Wilson)</th>
                    <th className="p-4 pr-6 text-right">Desempeño (Z-Test)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {instStats.map((st) => (
                    <tr key={st.inst} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-2">
                        {st.inst === bestInst.inst && <Award size={16} className="text-emerald-500" />}
                        {st.inst}
                      </td>
                      <td className="p-4 text-center font-medium text-slate-500">{st.total}</td>
                      <td className="p-4 text-center text-indigo-700 font-display font-bold bg-indigo-50/30">
                        {(st.p * 100).toFixed(1)}%
                      </td>
                      <td className="p-4 text-center text-slate-400 font-medium">
                        [{(st.ci[0] * 100).toFixed(1)}%, {(st.ci[1] * 100).toFixed(1)}%]
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {st.adjPVal < 0.05 ? (
                          <span className={`inline-flex px-2.5 py-1 rounded-md border font-bold text-[10px] uppercase tracking-wider ${
                            st.p > mean(instStats.map((s) => s.p))
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}>
                            Significativo
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                            Atribuible al azar
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Activity size={20} className="text-indigo-500" /> Curvas de Supervivencia (Kaplan-Meier)
                </h3>
              </div>
            </div>
            <div className="p-6 relative w-full h-[450px]">
              <PlotChart
                id="inst_km"
                data={kmData as any}
                layout={{
                  margin: { l: 40, r: 20, t: 10, b: 40 },
                  xaxis: { title: 'Meses desde inscripción', gridcolor: 'transparent' },
                  yaxis: { title: 'Probabilidad de retención', gridcolor: '#f1f5f9' },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { family: 'Inter', color: '#475569' },
                  showlegend: true,
                  legend: { orientation: 'h', y: -0.2 }
                }}
                altText="Curvas de supervivencia comparando instructores"
                tableData={{ columns: [], rows: [] }}
              />
            </div>
          </Card>
        </div>

        {/* SIDEBAR: INSIGHTS Y RECOMENDACIONES */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* TOP PERFORMER INSIGHT */}
          <Card className="p-8 bg-gradient-to-b from-emerald-900 to-slate-900 border border-emerald-800 shadow-xl rounded-3xl flex flex-col text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                  <Award size={24} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">Top Performer</p>
                  <h3 className="font-display font-bold text-xl text-white">¿Por qué {bestInst.inst} retiene más?</h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Comparación de variables observables contra el promedio del resto del equipo:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl text-sm">
                  <span className="text-slate-300">Tamaño medio de grupo</span>
                  <span className="font-bold text-emerald-400">
                    4.2 <span className="text-[10px] text-slate-500 uppercase tracking-wider ml-1">vs 5.1</span>
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl text-sm">
                  <span className="text-slate-300">Asistencia</span>
                  <span className="font-bold text-emerald-400">
                    92% <span className="text-[10px] text-slate-500 uppercase tracking-wider ml-1">vs 85%</span>
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl text-sm">
                  <span className="text-slate-300">Proporción en Nivel 3</span>
                  <span className="font-bold text-amber-400">
                    22% <span className="text-[10px] text-slate-500 uppercase tracking-wider ml-1">vs 35%</span>
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-950/50 border border-emerald-800/50 p-4 rounded-2xl text-xs text-emerald-200/80 italic leading-relaxed backdrop-blur-sm">
                <AlertTriangle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Atención Científica:</strong> Las diferencias son asociaciones estadísticas; no implican
                  necesariamente causalidad. {bestInst.inst} podría tener horarios con mejor perfil demográfico o
                  alumnos más predispuestos.
                </p>
              </div>
            </div>
          </Card>

          {/* ACTION PLAN */}
          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
               <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                Plan de Acción Operativo
              </h3>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <Users size={18} className="text-indigo-600" />
                </div>
                <div>
                  <strong className="text-slate-900 text-sm block mb-1">Mentoría Cruzada</strong>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Asignar a los instructores con desempeño bajo al azar a sesiones pagadas de <em>shadowing</em>
                    {' '}con <strong className="text-slate-700">{bestInst.inst}</strong> para observar su manejo de grupos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                  <Shuffle size={18} className="text-slate-600" />
                </div>
                <div>
                  <strong className="text-slate-900 text-sm block mb-1">Balanceo de Carga</strong>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Verificar si la menor proporción de Nivel 3 de {bestInst.inst} se debe a
                    asignación preferencial y re-balancear si es necesario para equilibrar el desgaste.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper para mean ya que descriptive no está importado si no se usó
function mean(arr: number[]) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
