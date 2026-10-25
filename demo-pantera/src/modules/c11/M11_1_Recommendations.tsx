import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { DropConfetti } from '@/ui/components/DropConfetti';
import { useAppStore } from '@/app/store';
import { useMetrics } from '@/metrics/hooks';
import { generateRecommendations } from '@/insights/recommendations';
import { Lightbulb, CheckCircle, BrainCircuit, Target, Clock, X, Check, TrendingUp, AlertTriangle } from 'lucide-react';

export default function M11_1_Recommendations() {
  const {
    acceptedRecommendations,
    postponedRecommendations,
    discardedRecommendations,
    updateRecommendationStatus,
    addPlanAction,
    addToast
  } = useAppStore();

  const metrics = useMetrics();

  const [filterCat, setFilterCat] = useState('todas');
  const [filterEffort, setFilterEffort] = useState('todos');
  const [showConfetti, setShowConfetti] = useState(false);

  const allRecs = useMemo(() => generateRecommendations(metrics), [metrics]);

  const activeRecs = useMemo(() => {
    let recs = allRecs.filter(
      (r) =>
        !acceptedRecommendations.includes(r.id) &&
        !postponedRecommendations.includes(r.id) &&
        !discardedRecommendations.includes(r.id),
    );

    if (filterCat !== 'todas') {
      recs = recs.filter((r) => r.category === filterCat);
    }
    if (filterEffort !== 'todos') {
      recs = recs.filter((r) => r.effort === filterEffort);
    }

    const effortWeight: Record<string, number> = { bajo: 1, medio: 2, alto: 3 };
    recs.sort((a, b) => {
      const roiA = a.impact.estimate / effortWeight[a.effort]!;
      const roiB = b.impact.estimate / effortWeight[b.effort]!;
      return roiB - roiA;
    });

    return recs;
  }, [
    allRecs,
    acceptedRecommendations,
    postponedRecommendations,
    discardedRecommendations,
    filterCat,
    filterEffort,
  ]);

  const handleAction = (rec: any, action: 'accepted' | 'postponed' | 'dismissed') => {
    updateRecommendationStatus(rec.id, action);
    if (action === 'accepted') {
      addPlanAction({
        id: `plan_${Date.now()}`,
        task: rec.title,
        source: 'M11.1 Recomendaciones',
        owner: 'Por asignar',
        deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]!,
        metric: rec.impact.metric,
        status: 'todo',
        impact: rec.impact,
      });
      addToast({
        title: 'Recomendación aceptada',
        message: 'Se ha agregado una tarea al Plan de Acción.',
        type: 'success',
        duration: 3000
      });
      setShowConfetti(true);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <BrainCircuit size={12} /> Motor de Decisiones IA
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Recomendaciones Priorizadas
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Acciones estratégicas sugeridas según la rentabilidad (ROI) y el impacto en tus KPIs.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="w-full md:w-40">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dominio</label>
            <Select
              options={[
                { label: 'Todas', value: 'todas' },
                { label: 'Operaciones', value: 'operaciones' },
                { label: 'Retención', value: 'retencion' },
                { label: 'Finanzas', value: 'finanzas' },
                { label: 'Marketing', value: 'marketing' },
              ]}
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            />
          </div>
          <div className="w-full md:w-40">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Esfuerzo Máximo</label>
            <Select
              options={[
                { label: 'Todos', value: 'todos' },
                { label: 'Bajo', value: 'bajo' },
                { label: 'Medio', value: 'medio' },
                { label: 'Alto', value: 'alto' },
              ]}
              value={filterEffort}
              onChange={(e) => setFilterEffort(e.target.value)}
            />
          </div>
        </div>
      </div>

      {activeRecs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 bg-slate-50/50 rounded-3xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <p className="font-display font-bold text-2xl text-slate-900 mb-2">Escuela Optimizada</p>
          <p className="text-sm font-medium">No hay nuevas recomendaciones. El modelo está procesando nuevos datos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeRecs.map((rec) => (
            <Card
              key={rec.id}
              className="p-6 border border-slate-200 flex flex-col h-full bg-white shadow-sm hover:shadow-lg transition-all rounded-3xl group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                  rec.category === 'finanzas' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                  rec.category === 'operaciones' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                  rec.category === 'retencion' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                  'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {rec.category}
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                  rec.effort === 'bajo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                  rec.effort === 'medio' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                  'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  <Target size={12} /> Esfuerzo {rec.effort}
                </div>
              </div>

              <h4 className="font-display font-bold text-slate-900 text-xl mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{rec.title}</h4>
              <p className="text-sm font-medium text-slate-500 mb-5 flex-1">{rec.rationale}</p>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-5 text-sm">
                <strong className="text-slate-900 text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Evidencia Detectada
                </strong>
                <ul className="list-disc pl-5 text-slate-600 space-y-1 text-xs font-medium">
                  {rec.evidence.map((ev: string, i: number) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-end mb-5 pb-5 border-b border-slate-100">
                <div>
                  <strong className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Retorno Esperado (ROI)
                  </strong>
                  <div className="text-2xl font-display font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp size={20} />
                    {rec.impact.unit === 'MXN' ? '$' : ''}
                    {rec.impact.estimate.toLocaleString()}
                    <span className="text-sm text-emerald-600/60 ml-1">{rec.impact.unit !== 'MXN' ? rec.impact.unit : ''}</span>
                  </div>
                </div>
                <div className="text-right">
                  <strong className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Métrica Clave</strong>
                  <div className="text-sm font-bold text-slate-800">{rec.impact.metric}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleAction(rec, 'accepted')} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm shadow-slate-900/20">
                  <Check size={14} /> Aprobar
                </button>
                <button onClick={() => handleAction(rec, 'postponed')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2">
                  <Clock size={14} /> Posponer
                </button>
                <button onClick={() => handleAction(rec, 'dismissed')} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold w-12 flex items-center justify-center rounded-xl text-xs transition-colors" title="Descartar">
                  <X size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <DropConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
