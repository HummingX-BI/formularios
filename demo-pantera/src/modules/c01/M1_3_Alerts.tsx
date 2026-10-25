import { useMemo, useState } from 'react';
import { useMetrics } from '@/metrics/hooks';
import { useAppStore } from '@/app/store';
import { Button } from '@/ui/components/Buttons';
import { Select } from '@/ui/components/Inputs';
import { 
  BellRing, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  FileText, 
  Copy, 
  Download,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function M1_3_Alerts() {
  const store = useAppStore();
  const metricsEngine = useMetrics();

  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('current');

  // Hardcode alerts for the demo to always look impressive and business-focused
  const demoAlerts = [
    {
      id: 'al-1',
      severity: 'critico',
      type: 'Finanzas',
      title: 'Déficit Crítico de Flujo',
      message: 'La cartera vencida superó los $45,000 MXN. Se requiere envío de recordatorios de pago manuales de inmediato para no afectar la nómina.',
    },
    {
      id: 'al-2',
      severity: 'alerta',
      type: 'Operación',
      title: 'Grupos Fantasma Detectados',
      message: 'El grupo "Inglés Avanzado 10AM" tiene solo 2 alumnos. Mantenerlo abierto cuesta $3,500 al mes en pérdidas. Considerar fusión.',
    },
    {
      id: 'al-3',
      severity: 'atencion',
      type: 'Ventas',
      title: 'Caída en Cierre de Ventas',
      message: 'Las inscripciones cayeron un 15% esta semana a pesar de tener el mismo volumen de prospectos. Revisar guion de ventas de recepción.',
    },
    {
      id: 'al-4',
      severity: 'info',
      type: 'Oportunidad',
      title: 'Lista de Espera Saturada',
      message: 'Tienes 12 personas esperando lugar para Natación 4PM. Tienes demanda suficiente para abrir un grupo nuevo hoy mismo.',
    }
  ];

  const visibleAlerts = demoAlerts.filter(
    (a) =>
      !store.dismissedAlerts.includes(a.id) &&
      (filterSeverity === 'all' || a.severity === filterSeverity),
  );

  const getAlertStyle = (severity: string) => {
    switch(severity) {
      case 'critico': return 'border-coral bg-red-50 text-red-900';
      case 'alerta': return 'border-amber-500 bg-amber-50 text-amber-900';
      case 'atencion': return 'border-aqua-500 bg-sky-50 text-sky-900';
      default: return 'border-green-500 bg-green-50 text-green-900';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch(severity) {
      case 'critico': return <AlertTriangle className="text-coral" size={24} />;
      case 'alerta': return <AlertTriangle className="text-amber-500" size={24} />;
      case 'atencion': return <Info className="text-aqua-500" size={24} />;
      default: return <CheckCircle2 className="text-green-500" size={24} />;
    }
  };

  const copyBriefing = () => {
    navigator.clipboard.writeText('Briefing copiado.');
    alert('Copiado al portapapeles');
  };

  const downloadBriefing = () => {
    alert('Briefing descargado');
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-ice-200 pb-4">
        <div>
          <h1 className="text-4xl font-jakarta font-extrabold text-navy-900 flex items-center gap-3">
            <BellRing className="text-amber-500" size={32} />
            Alertas y Briefing Semanal
          </h1>
          <p className="text-xl text-secundario mt-2 font-medium">
            Lo que necesitas saber y hacer hoy para mejorar tu escuela.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: ALERTAS PRIORITARIAS */}
        <div className="xl:col-span-7 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-ice-100">
            <h3 className="font-extrabold text-navy-900 text-lg flex items-center gap-2">
              Bandeja de Atención ({visibleAlerts.length})
            </h3>
            <Select
              options={[
                { label: 'Mostrar todas', value: 'all' },
                { label: 'Solo Críticas', value: 'critico' },
                { label: 'Alertas', value: 'alerta' },
              ]}
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-48 bg-ice-50 border-transparent font-medium text-sm"
            />
          </div>

          <div className="space-y-4">
            {visibleAlerts.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl shadow-sm border border-ice-100 text-center flex flex-col items-center">
                <CheckCircle2 size={64} className="text-green-400 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-navy-900">¡Todo en orden!</h3>
                <p className="text-secundario">No hay alertas críticas que requieran tu atención.</p>
              </div>
            ) : (
              visibleAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex gap-4 p-5 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all ${getAlertStyle(alert.severity)} relative overflow-hidden group`}
                >
                  <div className="shrink-0 mt-1">
                    {getAlertIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-extrabold text-lg tracking-tight">{alert.title}</h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/50 border border-black/10">
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed max-w-[90%] mb-4">
                      {alert.message}
                    </p>
                    <div className="flex gap-3">
                      <Button variant="primary" size="sm" className="bg-navy-900 text-white hover:bg-navy-800 border-0 shadow-sm">
                        Atender Problema
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => store.dismissAlert(alert.id)}
                        className="bg-white/40 hover:bg-white/60 text-current"
                      >
                        Posponer
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: BRIEFING SEMANAL */}
        <div className="xl:col-span-5">
          <div className="bg-white rounded-2xl shadow-lg border border-ice-100 overflow-hidden flex flex-col h-full relative">
            {/* Header del Briefing */}
            <div className="bg-navy-900 p-6 text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                <FileText size={120} />
              </div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <h3 className="font-extrabold text-2xl font-jakarta">Reporte Ejecutivo</h3>
                <Select
                  options={[
                    { label: 'Semana Actual', value: 'current' },
                    { label: 'Semana Pasada', value: 'prev1' },
                  ]}
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-40 bg-white/10 text-white border-transparent text-xs font-bold"
                />
              </div>
              <p className="text-ice-300 text-sm relative z-10">Resumen digerido por Inteligencia Artificial.</p>
            </div>

            {/* Contenido del Briefing */}
            <div className="p-6 flex-1 space-y-6 bg-slate-50">
              
              {/* Mejoras */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                  <TrendingUp size={20} /> Lo que salió bien
                </h4>
                <ul className="space-y-2">
                  <li className="flex gap-2 items-start text-sm text-green-900">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>La retención mejoró un <strong>2.4%</strong> respecto al mes pasado.</span>
                  </li>
                  <li className="flex gap-2 items-start text-sm text-green-900">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>Adquirimos <strong>15 prospectos</strong> orgánicos sin gastar en pauta.</span>
                  </li>
                </ul>
              </div>

              {/* Focos Rojos */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                  <TrendingDown size={20} /> Lo que hay que vigilar
                </h4>
                <ul className="space-y-2">
                  <li className="flex gap-2 items-start text-sm text-red-900">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-coral"></div>
                    <span>La <strong>cartera vencida creció $15,000</strong> en solo 7 días.</span>
                  </li>
                  <li className="flex gap-2 items-start text-sm text-red-900">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-coral"></div>
                    <span><strong>12 alumnos</strong> han faltado 3 veces consecutivas.</span>
                  </li>
                </ul>
              </div>

              {/* Plan de Acción */}
              <div className="bg-white border border-ice-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-navy-900 flex items-center gap-2 mb-3">
                  <Target size={20} className="text-aqua-500" /> Plan de Acción Recomendado
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center group cursor-pointer">
                    <div className="w-5 h-5 rounded border-2 border-ice-300 group-hover:border-aqua-500 transition-colors"></div>
                    <span className="text-sm font-medium text-secundario group-hover:text-navy-900">Enviar campaña masiva de cobranza a morosos.</span>
                  </div>
                  <div className="flex gap-3 items-center group cursor-pointer">
                    <div className="w-5 h-5 rounded border-2 border-ice-300 group-hover:border-aqua-500 transition-colors"></div>
                    <span className="text-sm font-medium text-secundario group-hover:text-navy-900">Contactar a los 12 ausentes por WhatsApp.</span>
                  </div>
                  <div className="flex gap-3 items-center group cursor-pointer">
                    <div className="w-5 h-5 rounded border-2 border-ice-300 group-hover:border-aqua-500 transition-colors"></div>
                    <span className="text-sm font-medium text-secundario group-hover:text-navy-900">Abrir grupo sabatino de natación.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer de Acciones */}
            <div className="p-4 border-t border-ice-200 bg-white flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={copyBriefing} className="bg-ice-50 hover:bg-ice-100 text-navy-900">
                <Copy size={16} className="mr-2" /> Copiar al portapapeles
              </Button>
              <Button variant="primary" size="sm" onClick={downloadBriefing} className="bg-navy-900 hover:bg-navy-800 shadow-md">
                <Download size={16} className="mr-2" /> Descargar PDF
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
