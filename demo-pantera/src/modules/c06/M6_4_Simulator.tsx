import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { Button } from '@/ui/components/Buttons';
import { PlotChart } from '@/charts/PlotChart';
import { binomial } from '@/stats/distributions';
import { Calculator, Users, Scale, AlertTriangle, CheckCircle2, TrendingUp, Settings2, BarChart3 } from 'lucide-react';

export default function M6_4_Simulator() {
  const [day, setDay] = useState('Lunes');
  const [hour, setHour] = useState('16:00');
  const [level, setLevel] = useState('Tortugas');
  const [instructor, setInstructor] = useState('Carlos Ruiz');

  // Params
  const [waitlistDemand, setWaitlistDemand] = useState(6);
  const [expectedNewDemand, setExpectedNewDemand] = useState(4);
  const [conversionProb, setConversionProb] = useState(60); // 60%

  // Economics
  const capacity = 8;
  const breakEven = 4;
  const totalDemand = waitlistDemand + expectedNewDemand;
  const p = conversionProb / 100;

  // Calculate probabilities
  const pBreakEven = binomial.sf(breakEven - 1, totalDemand, p);
  const pFull = binomial.sf(capacity - 1, totalDemand, p);

  // Generate distribution graph data
  const xVals = [];
  const yVals = [];
  for (let k = 0; k <= totalDemand; k++) {
    xVals.push(k);
    yVals.push(binomial.pmf(k, totalDemand, p) * 100);
  }

  const chartData = [
    {
      type: 'bar',
      x: xVals,
      y: yVals,
      marker: {
        color: xVals.map((x) => (x >= breakEven ? '#10b981' : '#f43f5e')), // Emerald and Rose
        line: {
          width: 0
        }
      },
    },
  ];

  let recommendation = { text: 'Aprobar Apertura', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 };
  if (pBreakEven < 0.5) recommendation = { text: 'Rechazar Apertura', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', icon: AlertTriangle };
  else if (pBreakEven < 0.75)
    recommendation = { text: 'Apertura Riesgosa', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle };

  const RecIcon = recommendation.icon;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Calculator size={12} /> Modelado Estadístico
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Simulador de Apertura
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Calcula la probabilidad de éxito antes de comprometer recursos.
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left: Formulario */}
        <Card className="w-full xl:w-80 shrink-0 bg-slate-900 border border-slate-800 shadow-xl flex flex-col rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Settings2 className="text-indigo-400 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">Configuración</h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Parámetros del modelo</p>
            </div>
          </div>

          <div className="p-6 space-y-6 relative z-10 overflow-y-auto max-h-[600px] custom-scrollbar">
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Variables de Entorno</h4>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Día</label>
                <Select
                  options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((d) => ({ label: d, value: d }))}
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Hora</label>
                <Select
                  options={['08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00'].map((h) => ({ label: h, value: h }))}
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Nivel</label>
                <Select
                  options={['Tortugas', 'Delfines', 'Tiburones'].map((l) => ({ label: l, value: l }))}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Instructor Designado</label>
                <Select
                  options={['Carlos Ruiz', 'Ana López', 'Mario Santos'].map((i) => ({ label: i, value: i }))}
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Variables de Demanda</h4>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Familias en Espera (Compatibles)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  value={waitlistDemand}
                  onChange={(e: any) => setWaitlistDemand(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Llegada Esperada (Nuevos)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  value={expectedNewDemand}
                  onChange={(e: any) => setExpectedNewDemand(Number(e.target.value))}
                />
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold text-slate-400">Conversión Esperada</label>
                  <span className="text-sm font-bold text-emerald-400">{conversionProb}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={conversionProb}
                  onChange={(e) => setConversionProb(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Resultados */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Tarjetas KPI Premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Users size={20} className="text-indigo-500" />
                </div>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 mt-4">Demanda Potencial</div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-display font-bold text-slate-900">{totalDemand}</div>
                <div className="text-sm font-medium text-slate-500 mb-1">familias</div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Scale size={20} className="text-slate-600" />
                </div>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 mt-4">Punto de Equilibrio</div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-display font-bold text-slate-900">{breakEven}</div>
                <div className="text-sm font-medium text-slate-500 mb-1">alumnos</div>
              </div>
            </Card>

            <Card className={`p-6 border shadow-sm rounded-3xl relative overflow-hidden group hover:shadow-md transition-all ${recommendation.bg} ${recommendation.border}`}>
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shadow-sm`}>
                  <RecIcon size={20} className={recommendation.color} />
                </div>
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 mt-4 ${recommendation.color} opacity-80`}>Veredicto del Modelo</div>
              <div className={`text-2xl font-display font-bold ${recommendation.color} leading-tight`}>
                {recommendation.text}
              </div>
            </Card>

          </div>

          <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <BarChart3 size={20} className="text-indigo-500" /> Proyección de Probabilidad de Inscripciones
                </h3>
                <p className="text-sm text-slate-500 mt-1">Probabilidad de escenarios operativos</p>
              </div>
              <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prob. Equilibrio (≥{breakEven})</div>
                  <div className="font-bold text-emerald-600 text-xl flex items-center gap-1 justify-end">
                    {(pBreakEven * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prob. Lleno (≥{capacity})</div>
                  <div className="font-bold text-indigo-600 text-xl flex items-center gap-1 justify-end">
                    {(pFull * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[350px]">
              <PlotChart
                id="simulator_binomial"
                data={chartData as any}
                layout={{
                  xaxis: { title: 'Alumnos Inscritos', tickmode: 'linear', tickfont: { family: 'Inter', color: '#64748b', weight: 'bold' } },
                  yaxis: { title: 'Probabilidad (%)', tickfont: { family: 'Inter', color: '#64748b' } },
                  margin: { l: 50, r: 20, t: 10, b: 50 },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  bargap: 0.2,
                }}
                tableData={{ columns: [], rows: [] }}
                altText="Gráfica de probabilidad binomial de alumnos inscritos"
                onExplain={() => {}}
              />
            </div>
            <div className="text-xs text-slate-500 text-center mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
              El color verde indica los escenarios donde se supera el punto de equilibrio operativo (carriles + instructor).
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
