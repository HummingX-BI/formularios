import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { PlotChart } from '@/charts/PlotChart';
import { Grid, Users, AlertTriangle, Clock, CalendarX, ChevronRight, X, UserPlus, Info } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00'];

const SATURATION_THRESHOLD = 90;
const UNDERUTILIZATION_THRESHOLD = 60;

export default function M6_1_Occupancy() {
  const [metric, setMetric] = useState<'ocupacion' | 'carriles'>('ocupacion');
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: string } | null>(null);

  // Generate mock heatmap data based on dataset
  const heatmapData = useMemo(() => {
    const data: Record<
      string,
      Record<string, { value: number; waitlist: number; capacity: number; enrolled: number }>
    > = {};
    DAYS.forEach((day) => {
      data[day] = {};
      HOURS.forEach((hour) => {
        // mock generation
        const base = day === 'Sábado' || hour === '17:00' || hour === '18:00' ? 80 : 50;
        const noise = Math.random() * 30 - 15;
        let val = Math.round(base + noise);
        if (val < 20) val = 20;
        if (val > 100) val = 100;

        data[day]![hour] = {
          value: val,
          waitlist: val >= 90 ? Math.floor(Math.random() * 5) + 1 : 0,
          capacity: 20,
          enrolled: Math.round(20 * (val / 100)),
        };
      });
    });
    return data;
  }, []);

  const getBgColor = (val: number) => {
    if (val < 40) return 'bg-slate-100 text-slate-500 hover:bg-slate-200';
    if (val < 60) return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200';
    if (val < 80) return 'bg-indigo-300 text-indigo-900 hover:bg-indigo-400';
    return 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md';
  };

  const getBorder = (val: number) => {
    if (val >= SATURATION_THRESHOLD) return 'ring-2 ring-rose-500 ring-offset-1';
    if (val <= UNDERUTILIZATION_THRESHOLD) return 'border border-dashed border-slate-300';
    return 'border border-transparent';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Grid className="text-indigo-600 w-8 h-8" />
            Mapa de Ocupación
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Visualiza saturación, cuellos de botella y horarios muertos.
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setMetric('ocupacion')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${metric === 'ocupacion' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Users size={16} /> Ocupación (Alumnos)
          </button>
          <button 
            onClick={() => setMetric('carriles')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${metric === 'carriles' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Grid size={16} className={metric === 'carriles' ? 'text-indigo-200' : ''} /> Uso de Instalación
          </button>
        </div>
      </div>

      {/* KPI WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Promedio */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400">
              <Users size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ocupación Promedio</div>
            <div className="text-4xl font-display font-extrabold text-white mb-1">76%</div>
            <div className="text-xs text-slate-400 font-medium">De tu capacidad instalada total</div>
          </div>
        </div>

        {/* KPI 2: Saturadas */}
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-200/50 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-rose-800/60 uppercase tracking-widest mb-1">Franjas Saturadas ({'>'}90%)</div>
            <div className="text-4xl font-display font-extrabold text-rose-600 mb-1">8</div>
            <div className="text-xs text-rose-700/80 font-medium">Requieren abrir nuevos grupos</div>
          </div>
        </div>

        {/* KPI 3: Subutilizadas */}
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/50 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <CalendarX size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-amber-800/60 uppercase tracking-widest mb-1">Franjas Muertas ({'<'}60%)</div>
            <div className="text-4xl font-display font-extrabold text-amber-600 mb-1">12</div>
            <div className="text-xs text-amber-700/80 font-medium">Ideal para promociones 2x1</div>
          </div>
        </div>

        {/* KPI 4: Horas Ociosas */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Capacidad Ociosa</div>
            <div className="text-4xl font-display font-extrabold text-slate-800 mb-1">45 hrs</div>
            <div className="text-xs text-slate-500 font-medium">Horas-Carril perdidas por semana</div>
          </div>
        </div>

      </div>

      {/* HEATMAP & SIDEBAR CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* HEATMAP */}
        <Card
          className={`flex-1 p-6 lg:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm transition-all overflow-hidden`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Grid className="text-indigo-500" size={20} /> Matriz Semanal
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Info size={12} /> Clic para analizar
            </span>
          </div>
          
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[650px]">
              {/* Header Row */}
              <div className="grid grid-cols-7 gap-3 mb-4">
                <div className="text-right pr-4 font-bold text-slate-400 uppercase tracking-wider text-xs flex items-center justify-end">Hora</div>
                {DAYS.map((d) => (
                  <div key={d} className="text-center font-bold text-slate-700 text-sm">
                    {d}
                  </div>
                ))}
              </div>
              
              {/* Grid Rows */}
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-7 gap-3 mb-3">
                  <div className="flex items-center justify-end pr-4 font-bold text-slate-400 text-xs tracking-wider">
                    {hour}
                  </div>
                  {DAYS.map((day) => {
                    const cell = heatmapData[day]![hour]!;
                    const isSelected = selectedCell?.day === day && selectedCell?.hour === hour;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        onClick={() => setSelectedCell({ day, hour })}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer transition-all duration-200 ease-out ${getBgColor(cell.value)} ${getBorder(cell.value)} ${isSelected ? 'ring-4 ring-indigo-500/30 scale-[1.02] z-10 shadow-lg' : ''}`}
                        title={`${cell.value}% - ${cell.enrolled}/${cell.capacity} inscritos`}
                      >
                        <span className="font-bold text-lg">{cell.value}%</span>
                        {cell.waitlist > 0 && (
                          <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-md border-2 border-white">
                            {cell.waitlist}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* LEYENDA */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-bold text-slate-500 justify-center items-center uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200"></div> &lt; 40%
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-100"></div> 40 - 60%
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-300"></div> 60 - 80%
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-600"></div> &gt; 80%
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-4 h-4 rounded border-2 border-rose-500 bg-white"></div> Saturado ({'>'}90%)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-dashed border-slate-400 bg-white"></div>{' '}
              Subutilizado
            </div>
          </div>
        </Card>

        {/* SIDEBAR ANALYSIS (SELECTED CELL) */}
        {selectedCell && (
          <Card className="w-full lg:w-96 shrink-0 p-0 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
            {/* Header sidebar */}
            <div className="bg-slate-900 p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="font-display font-bold text-2xl mb-1">{selectedCell.day}</h3>
                  <div className="text-slate-400 font-medium flex items-center gap-2">
                    <Clock size={16} /> {selectedCell.hour} hrs
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-slate-300 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ocupación Total</div>
                  <div className={`text-2xl font-bold ${heatmapData[selectedCell.day]![selectedCell.hour]!.value >= 90 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {heatmapData[selectedCell.day]![selectedCell.hour]!.value}%
                  </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">En Espera</div>
                  <div className="text-2xl font-bold text-rose-600 flex items-center gap-1">
                    {heatmapData[selectedCell.day]![selectedCell.hour]!.waitlist}
                    {heatmapData[selectedCell.day]![selectedCell.hour]!.waitlist > 0 && <UserPlus size={16} className="text-rose-400" />}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" /> Detalle de Grupos
                </h4>
                <div className="space-y-3">
                  <div className="p-4 border border-slate-200 rounded-xl text-sm group hover:border-indigo-300 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center font-bold text-slate-900 mb-2">
                      <span>Tortugas (3-5 años)</span>
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">8/8</span>
                    </div>
                    <div className="text-slate-500 text-xs font-medium mb-2">Instructor: Carlos Ruiz</div>
                    <div className="text-rose-600 text-[10px] uppercase tracking-wider font-bold bg-rose-50 inline-flex items-center gap-1 px-2 py-1 rounded">
                      <AlertTriangle size={10} /> +2 alumnos en espera
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl text-sm group hover:border-indigo-300 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center font-bold text-slate-900 mb-2">
                      <span>Delfines (6-8 años)</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">7/8</span>
                    </div>
                    <div className="text-slate-500 text-xs font-medium">Instructor: Ana López</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Evolución Histórica (6 meses)</div>
                <div className="h-[120px] -mx-2">
                  <PlotChart
                    id="cell_evolution"
                    data={[
                      {
                        type: 'scatter',
                        x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                        y: [
                          75,
                          78,
                          85,
                          90,
                          88,
                          heatmapData[selectedCell.day]![selectedCell.hour]!.value,
                        ],
                        line: { color: '#6366f1', width: 3 },
                        fill: 'tozeroy',
                        fillcolor: 'rgba(99, 102, 241, 0.1)',
                      },
                    ]}
                    layout={{ 
                      margin: { l: 25, r: 10, t: 10, b: 20 }, 
                      yaxis: { range: [0, 100], tickfont: { size: 10, color: '#94a3b8' } },
                      xaxis: { tickfont: { size: 10, color: '#94a3b8' } },
                      paper_bgcolor: 'transparent',
                      plot_bgcolor: 'transparent',
                    }}
                    tableData={{ columns: [], rows: [] }}
                    altText="Línea de tendencia de ocupación"
                    onExplain={() => {}}
                  />
                </div>
              </div>
            </div>
            
          </Card>
        )}
      </div>
    </div>
  );
}
