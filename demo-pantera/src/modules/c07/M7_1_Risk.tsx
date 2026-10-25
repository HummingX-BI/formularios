import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { ShieldAlert, Phone, MessageCircle, AlertTriangle, Search, Activity, UserMinus, Sparkles, AlertOctagon, Info, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/insights/templates';

const mockRisks = [
  { id: 'R1', name: 'Diego Torres', level: 'Alto', reason: 'Faltó 3 clases seguidas', value: 1200, lastContact: 'Hace 5 días', probability: 85 },
  { id: 'R2', name: 'Familia Mendoza', level: 'Crítico', reason: 'Adeudo de 2 meses', value: 2500, lastContact: 'Ayer (Sin respuesta)', probability: 95 },
  { id: 'R3', name: 'Sofía Álvarez', level: 'Medio', reason: 'Estancada en nivel', value: 900, lastContact: 'Hace 1 mes', probability: 45 },
];

export default function M7_1_Risk() {
  const [selectedRisk, setSelectedRisk] = useState(mockRisks[0]!);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedRisk) return null;

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <ShieldAlert className="text-rose-500 w-8 h-8" />
            Gestor de Riesgo y Rescate
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Alumnos con alta probabilidad de baja y planes de acción recomendados.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start flex-1 min-h-0">
        
        {/* SIDEBAR: LISTA DE RIESGOS (CRM INBOX STYLE) */}
        <Card className="w-full lg:w-96 shrink-0 bg-white border border-slate-200 shadow-sm flex flex-col rounded-3xl h-[700px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Buscar alumno en riesgo..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Prioridad AI</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mockRisks.map((risk) => {
              const isSelected = selectedRisk.id === risk.id;
              const isCritical = risk.level === 'Crítico';
              const isHigh = risk.level === 'Alto';
              
              const levelColor = isCritical ? 'text-rose-600 bg-rose-50 border-rose-200' : isHigh ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-50 border-slate-200';
              const levelDot = isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-slate-400';

              return (
                <button
                  key={risk.id}
                  onClick={() => setSelectedRisk(risk)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start gap-3 group relative overflow-hidden
                    ${isSelected ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}
                >
                  {isSelected && <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500"></div>}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className={`font-bold truncate text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {risk.name}
                      </div>
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${levelColor} flex items-center gap-1 shrink-0`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${levelDot}`}></span>
                        {risk.probability}% Baja
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate mb-2">
                      {risk.reason}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>{risk.lastContact}</span>
                      <span className="text-slate-700">{formatCurrency(risk.value)}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* PLAN DE RESCATE (DERECHA) */}
        <Card className="flex-1 p-0 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col min-h-[700px] overflow-hidden">
          
          {/* HEADER DETALLE */}
          <div className="p-8 border-b border-slate-100 relative overflow-hidden bg-slate-50/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border 
                    ${selectedRisk.level === 'Crítico' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                      selectedRisk.level === 'Alto' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    Nivel de Riesgo: {selectedRisk.level}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Activity size={12} /> Probabilidad de baja: {selectedRisk.probability}%
                  </span>
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900">
                  {selectedRisk.name}
                </h2>
                <div className="text-sm font-medium text-slate-500 mt-1">
                  Último contacto: {selectedRisk.lastContact}
                </div>
              </div>

              <div className="text-right bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[200px]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                  Ingreso en Riesgo
                </div>
                <div className="text-3xl font-display font-bold text-slate-900">{formatCurrency(selectedRisk.value)}</div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            {/* RECOMENDACIÓN DE LA IA (CLEAN DIAGNOSTIC CARD) */}
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6 relative">
              <div className="absolute -left-px top-6 bottom-6 w-1 bg-indigo-500 rounded-r-full"></div>
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-indigo-500" />
                <h3 className="font-bold text-indigo-900 text-lg">Diagnóstico y Plan de Acción (IA)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                    <Info size={12} /> Diagnóstico
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    El alumno ha faltado 3 semanas seguidas sin justificar. Históricamente, el <span className="font-bold text-rose-500">85% de los alumnos</span> con este patrón cancelan al siguiente corte de pago si no hay intervención.
                  </p>
                </div>
                <div>
                  <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                    <ArrowRight size={12} /> Acción Óptima Recomendada
                  </div>
                  <p className="text-sm text-indigo-900 leading-relaxed font-bold bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                    Llamada telefónica inmediata (No WhatsApp). Ofrecer reagendar las 3 clases perdidas sin costo penal en fines de semana.
                  </p>
                </div>
              </div>
            </div>

            {/* HERRAMIENTAS DE ACCIÓN */}
            <div>
               <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                <UserMinus size={18} className="text-slate-400" /> Ejecutar Retención
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button className="bg-white hover:bg-slate-50 border border-slate-200 shadow-sm py-4 px-4 rounded-2xl flex items-center gap-4 transition-all hover:border-emerald-300 hover:shadow-md group">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <MessageCircle size={20} className="text-emerald-600" /> 
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">Mensaje de Ausencia</div>
                    <div className="text-xs text-slate-500">Plantilla de WhatsApp</div>
                  </div>
                </button>
                
                <button className="bg-indigo-600 hover:bg-indigo-500 border border-transparent shadow-md shadow-indigo-500/20 py-4 px-4 rounded-2xl flex items-center gap-4 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-white" /> 
                  </div>
                  <div className="text-left text-white">
                    <div className="font-bold text-sm">Registrar Llamada</div>
                    <div className="text-xs text-indigo-200">Guardar en bitácora</div>
                  </div>
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Texto sugerido por IA (Script)</h4>
                  <button onClick={handleCopy} className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 hover:text-indigo-700 transition-colors bg-white px-2 py-1 rounded border border-indigo-100 shadow-sm">
                    {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="text-sm text-slate-700 italic leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-100 shadow-inner">
                  "Hola familia de {selectedRisk.name}, los hemos extrañado en clases. Sabemos que a veces se complica asistir, por lo que les hemos habilitado 3 pases de reposición gratuitos para usar este mes. ¿Les marco en la tarde para agendarlos?"
                </div>
              </div>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
}
