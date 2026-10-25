import { useState, useMemo } from 'react';
import { Card, KpiCard } from '@/ui/components/Cards';
import { useDataset } from '@/data/hooks';
import { BarChart, LineChart } from '@/charts/components/BasicCharts';
import { User, Award, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';

export default function M3_3_InstructorScorecard() {
  const dataset = useDataset();
  const instructorsOptions = useMemo(
    () => dataset.instructors.map((i) => ({ label: i.name, value: i.id })),
    [dataset],
  );
  const [selectedInstructorId, setSelectedInstructorId] = useState(
    instructorsOptions[0]?.value || '',
  );

  const instructor = useMemo(
    () => dataset.instructors.find((i) => i.id === selectedInstructorId),
    [dataset, selectedInstructorId],
  );

  // Mock performance metrics based on instructor ID
  const metrics = useMemo(() => {
    if (!instructor) return null;
    const isGood = instructor.id.charCodeAt(0) % 2 === 0;
    return {
      isGood,
      alumnos: isGood ? 45 : 30,
      retencion3m: isGood ? 92 : 81,
      retencion6m: isGood ? 85 : 72,
      asistencia: isGood ? 94 : 88,
      tiempoPrincipiante: isGood ? 4.2 : 5.8, // meses
      rentabilidad: isGood ? 450 : 320, // $/hr
    };
  }, [instructor]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.substring(0, 2).toUpperCase();
  };

  if (!instructor || !metrics) return <div>No hay instructores disponibles.</div>;

  return (
    <div className="space-y-6 pb-8">
      {/* Header and Profile Banner */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Ficha de Desempeño</h1>
          <p className="text-base text-slate-500 mt-1 font-medium">Evaluación operativa y retención por instructor</p>
        </div>
        
        {/* Selector and Profile */}
        <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl border border-slate-200 shadow-sm w-full xl:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
            {getInitials(instructor.name)}
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Instructor Analizado</p>
            <div className="relative mt-0.5">
              <select
                value={selectedInstructorId}
                onChange={(e) => setSelectedInstructorId(e.target.value)}
                className="appearance-none bg-transparent font-bold text-slate-800 text-lg w-full focus:outline-none pr-6 cursor-pointer"
              >
                {instructorsOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200 mx-2"></div>
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Status</p>
            {metrics.isGood ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                <Award className="w-3.5 h-3.5" /> Top Performer
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                <AlertCircle className="w-3.5 h-3.5" /> Requiere Apoyo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* HIGH-END KPI WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Widget: Alumnos & Asistencia */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Volumen y Tráfico</h3>
          
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <User className="w-4 h-4" /> <span className="font-medium text-sm">Alumnos a Cargo</span>
              </div>
              <div className="text-4xl font-display font-extrabold text-slate-800">{metrics.alumnos}</div>
            </div>
            <div className={`flex flex-col items-end ${metrics.alumnos > 35 ? 'text-emerald-600' : 'text-amber-600'}`}>
              <div className="flex items-center gap-1 text-sm font-bold">
                <TrendingUp className="w-4 h-4" /> {metrics.alumnos > 35 ? '+12%' : '-4%'}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">vs prom. escuela</span>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full mb-4"></div>

          <div className="flex justify-between items-center relative z-10">
            <span className="text-sm text-slate-500 font-medium">Asistencia Promedio</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${metrics.asistencia > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${metrics.asistencia}%` }}
                ></div>
              </div>
              <span className="font-bold text-slate-800">{metrics.asistencia}%</span>
            </div>
          </div>
        </div>

        {/* Widget: Retención (Radial Progress) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 relative z-10">Fidelización</h3>
          
          <div className="flex items-center justify-around relative z-10">
            {/* 3 Months Ring */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                  <circle 
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * metrics.retencion3m) / 100}
                    className={metrics.retencion3m > 85 ? 'text-emerald-400' : 'text-amber-400'} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute text-xl font-bold">{metrics.retencion3m}%</div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Retención 3 Meses</span>
            </div>

            {/* 6 Months Ring */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-800" />
                  <circle 
                    cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" fill="transparent" 
                    strokeDasharray="201" 
                    strokeDashoffset={201 - (201 * metrics.retencion6m) / 100}
                    className={metrics.retencion6m > 80 ? 'text-blue-400' : 'text-rose-400'} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute text-lg font-bold">{metrics.retencion6m}%</div>
              </div>
              <span className="text-xs text-slate-400 font-medium">6 Meses</span>
            </div>
          </div>
        </div>

        {/* Widget: Eficiencia & Rentabilidad */}
        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <h3 className="text-sm font-bold text-emerald-600/70 uppercase tracking-widest mb-6">Eficiencia Financiera</h3>
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-slate-600 font-medium text-sm mb-1">Rentabilidad / Hora</div>
              <div className="text-4xl font-display font-extrabold text-emerald-700">${metrics.rentabilidad}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${metrics.rentabilidad > 400 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {metrics.rentabilidad > 400 ? '+ Excelente' : '- Bajo Promedio'}
            </div>
          </div>

          <div className="h-px bg-emerald-100/50 w-full mb-4"></div>

          <div className="flex justify-between items-center">
            <div>
              <span className="block text-sm text-slate-500 font-medium">Tiempo en Nivel Principiante</span>
              <span className="block text-xs text-slate-400 mt-0.5">Menor tiempo = Mayor eficiencia</span>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${metrics.tiempoPrincipiante < 5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {metrics.tiempoPrincipiante} <span className="text-sm">meses</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-lg">Comparativa Operativa vs Escuela</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <BarChart
              id="instructor-comparison"
              x={['Retención (%)', 'Asistencia (%)', 'Eficiencia (%)']}
              series={[
                { name: instructor.name, y: [metrics.retencion3m, metrics.asistencia, metrics.isGood ? 95 : 75] },
                { name: 'Promedio Escuela', y: [85, 90, 80] }
              ]}
              altText="Gráfica de comparativa"
              tableData={{ columns: [], rows: [] }}
            />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">Curva de Supervivencia de Alumnos</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <LineChart
              id="instructor-survival"
              x={['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6']}
              series={[
                { name: instructor.name, y: [100, metrics.isGood ? 98 : 90, metrics.retencion3m, metrics.isGood ? 90 : 80, metrics.isGood ? 88 : 75, metrics.retencion6m] },
                { name: 'Promedio Escuela', y: [100, 95, 85, 82, 80, 78] }
              ]}
              altText="Gráfica de retención por cohorte"
              tableData={{ columns: [], rows: [] }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
