import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { ShieldCheck, Brain, Activity, Compass, Fingerprint, LockKeyhole } from 'lucide-react';

export default function M10_1_ModelCatalog() {
  
  const variableImpactData = [{
    type: 'bar',
    x: [85, 70, 65, 45],
    y: ['Asistencia', 'Método Pago', 'Velocidad', 'Ubicación'],
    orientation: 'h',
    marker: {
      color: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']
    }
  }];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <ShieldCheck size={12} /> Confianza Estadística
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Score de Certeza de Negocio
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Métricas de precisión y fiabilidad de las predicciones de inteligencia artificial.
          </p>
        </div>
      </div>

      {/* INTRO BANNER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Brain size={32} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Motor de Predicción Activo</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              Pantera analiza miles de puntos de datos diarios en tu operación. Esta sección no muestra ingresos, sino la <strong className="text-white">precisión matemática</strong> del sistema para que sepas qué tanta confianza puedes depositar en las alertas de riesgo y pronósticos de facturación.
            </p>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Activity size={20} className="text-emerald-600" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Fiabilidad de Ingresos</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-slate-900">91.5</span>
              <span className="text-lg font-bold text-slate-400">%</span>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
            Históricamente, nuestras predicciones de ingreso coinciden en un 91.5% con la realidad al cierre de mes.
          </div>
        </Card>

        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Compass size={20} className="text-indigo-600" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Precisión en Bajas</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-slate-900">85.0</span>
              <span className="text-lg font-bold text-slate-400">%</span>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
            El sistema acierta el 85% de las veces al predecir con 30 días de anticipación quién abandonará la escuela.
          </div>
        </Card>

        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <Fingerprint size={20} className="text-cyan-600" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Estabilidad Operativa</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-slate-900">94.0</span>
              <span className="text-lg font-bold text-slate-400">%</span>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
            Tu asistencia y horarios mantienen patrones altamente regulares, lo que maximiza la fiabilidad del modelo.
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* VARIABLES INFLUYENTES */}
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <LockKeyhole size={20} className="text-indigo-500" /> Variables de Ponderación
              </h3>
              <p className="text-xs text-slate-500 mt-1">Factores silenciosos que el sistema vigila automáticamente</p>
            </div>
          </div>
          <div className="flex-1 p-6 relative w-full h-[300px]">
            <PlotChart
              id="business-drivers"
              data={variableImpactData as any}
              layout={{
                margin: { t: 20, b: 40, l: 120, r: 20 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                xaxis: { title: 'Impacto Relativo', gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
                yaxis: { gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#64748b', size: 12 } },
              }}
              altText="Impacto en el negocio"
              tableData={{ columns: [], rows: [] }}
            />
          </div>
        </Card>
        
        {/* RECALIBRACIÓN */}
        <Card className="p-0 bg-slate-50 border border-slate-200 shadow-sm rounded-3xl flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="p-10 relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-6">
              <ShieldCheck size={40} className="text-emerald-500" />
            </div>
            <h3 className="font-bold text-2xl mb-4 text-slate-900 tracking-tight">Tu negocio está respaldado</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Pantera ajusta sus cálculos diariamente. Si el comportamiento de tus clientes cambia de repente (por ejemplo, por la apertura de una nueva escuela competidora), <strong className="text-slate-800">el sistema lo detectará automáticamente y recalibrará sus alertas.</strong>
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
              <Brain size={14} /> Auto-Calibración Constante
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
