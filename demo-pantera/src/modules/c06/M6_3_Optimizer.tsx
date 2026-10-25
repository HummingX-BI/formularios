import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Zap, Sparkles, ArrowRight, ArrowRightLeft, Users, Clock, Calendar, CheckCircle2, Bot } from 'lucide-react';
import { formatCurrency } from '@/insights/templates';
import { runScheduleOptimizer } from '@/metrics/scheduleOptimizer';

export default function M6_3_Optimizer() {
  const [moves, setMoves] = useState(() => runScheduleOptimizer());
  const [selectedMoveId, setSelectedMoveId] = useState(moves[0]?.id);

  const selectedMove = moves.find((m) => m.id === selectedMoveId);

  const handleApply = () => {
    if (selectedMove) {
      alert(
        `Movimiento ${selectedMove.id} aplicado en sesión de forma simulada. Cambios reflejados en M6.1 y M2.3.`,
      );
      setMoves(moves.filter((m) => m.id !== selectedMove.id));
      setSelectedMoveId(moves.find((m) => m.id !== selectedMove.id)?.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Bot size={12} /> Motor de IA
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Zap className="text-amber-500 w-8 h-8" fill="currentColor" />
            Optimizador de Grupos
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Recomendaciones algorítmicas de consolidación y migración
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Lista de movimientos */}
        <Card className="w-full lg:w-1/3 shrink-0 bg-slate-50 border border-slate-200 shadow-inner flex flex-col h-[700px] rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" /> Sugerencias ({moves.length})
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">Ordenado por rentabilidad</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {moves.length === 0 && (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
                <CheckCircle2 size={32} className="text-emerald-400" />
                <span className="font-medium text-sm">Tu horario está 100% optimizado.</span>
              </div>
            )}
            
            {moves.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMoveId(m.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                  selectedMoveId === m.id 
                  ? 'bg-white border-2 border-indigo-500 shadow-md ring-4 ring-indigo-500/10' 
                  : 'bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                {selectedMoveId === m.id && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {m.type === 'consolidate' ? <Users size={14} className="text-emerald-500"/> : <ArrowRightLeft size={14} className="text-amber-500"/>}
                    {m.type === 'consolidate' ? 'Consolidación' : 'Migración'}
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2 py-0.5 rounded-md border border-emerald-100">
                    +{formatCurrency(m.impactExpected)}/mes
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 space-y-2 relative z-10">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-slate-700 font-bold">{m.groupName}</span> 
                    <span className="text-slate-400">({m.instructor})</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="flex-1">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">De:</div>
                      <div className="font-bold text-slate-700">{m.sourceSlot.day} {m.sourceSlot.hour}</div>
                    </div>
                    <ArrowRight size={12} className="text-slate-300 flex-shrink-0" />
                    <div className="flex-1 text-right">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">A:</div>
                      <div className="font-bold text-indigo-600">{m.destSlot.day} {m.destSlot.hour}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Detalle del movimiento */}
        <Card className="flex-1 p-0 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col min-h-[700px] overflow-hidden">
          {selectedMove ? (
            <>
              {/* Encabezado del Detalle */}
              <div className="p-8 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                  <Badge color={selectedMove.type === 'consolidate' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} className="mb-4">
                    {selectedMove.type === 'consolidate' ? 'Ahorro Operativo' : 'Desbloqueo de Ventas'}
                  </Badge>
                  <h3 className="font-display font-bold text-slate-900 text-2xl mb-4 leading-tight">
                    {selectedMove.type === 'consolidate'
                      ? `Fusionar y cancelar grupo de ${selectedMove.groupName}`
                      : `Mover ${selectedMove.groupName} para liberar cupo saturado`}
                  </h3>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-900 text-sm leading-relaxed shadow-inner">
                    <span className="font-bold flex items-center gap-2 mb-1">
                      <Bot size={16} className="text-indigo-500" /> Análisis de la IA:
                    </span>
                    {selectedMove.explanation}
                  </div>
                </div>
              </div>

              {/* Diagrama de Flujo (Antes/Despues) */}
              <div className="p-8 bg-slate-50/50 flex-1">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* Origen */}
                  <div className="flex-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm w-full relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 rounded-l-2xl"></div>
                    <div className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Calendar size={12} /> Franja de Origen
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Horario</span>
                        <span className="font-bold text-slate-800">{selectedMove.sourceSlot.day} {selectedMove.sourceSlot.hour}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Ocupación</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${selectedMove.sourceSlot.occ < 60 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-700'}`}>{selectedMove.sourceSlot.occ}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Lista Espera</span>
                        <span className="font-bold text-slate-700">{selectedMove.sourceSlot.waitlist}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flecha */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10 my-2 md:my-0">
                    <ArrowRight size={20} className="text-indigo-400 rotate-90 md:rotate-0" />
                  </div>

                  {/* Destino */}
                  <div className="flex-1 bg-white p-5 border border-indigo-200 rounded-2xl shadow-md w-full relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl"></div>
                    <div className="font-bold text-[10px] text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Sparkles size={12} /> Franja de Destino
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Horario</span>
                        <span className="font-bold text-indigo-900">{selectedMove.destSlot.day} {selectedMove.destSlot.hour}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Nueva Ocupación</span>
                        <span className="font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">
                          {selectedMove.type === 'consolidate' ? selectedMove.destSlot.occ + 40 : selectedMove.destSlot.occ - 10}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Familias Absorbidas</span>
                        <span className="font-bold text-indigo-600">+{selectedMove.familiesBenefited}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impacto Financiero Widget */}
              <div className="p-8 mt-auto border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Proyección de Impacto Financiero</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-8">
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Escenario Pesimista</div>
                    <div className="font-display font-bold text-xl text-slate-700">
                      {formatCurrency(selectedMove.impactLow)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden transform scale-105 z-10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Impacto Esperado</div>
                    <div className="font-display font-bold text-2xl text-white">
                      +{formatCurrency(selectedMove.impactExpected)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Escenario Optimista</div>
                    <div className="font-display font-bold text-xl text-slate-700">
                      {formatCurrency(selectedMove.impactHigh)}
                    </div>
                  </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 py-3 px-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                    Enviar al Plan de Acción
                  </button>
                  <button onClick={handleApply} className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2">
                    Aplicar en Simulación <Zap size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12">
              <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <Sparkles size={32} className="text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-600 text-lg mb-2">Selecciona una sugerencia</h3>
              <p className="text-center text-sm">Haz clic en un movimiento de la lista izquierda para ver el análisis detallado y el impacto financiero.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
