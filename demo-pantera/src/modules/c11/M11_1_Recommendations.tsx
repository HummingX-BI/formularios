import { useState, useMemo } from 'react';
import { ModulePage } from '@/ui/ModulePage';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Select } from '@/ui/components/Inputs';
import { DropConfetti } from '@/ui/components/DropConfetti';
import { useAppStore } from '@/app/store';
import { useMetrics } from '@/metrics/hooks';
import { generateRecommendations } from '@/insights/recommendations';

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

    // Sort by ROI (Impact Estimate / Effort weight)
    const effortWeight = { bajo: 1, medio: 2, alto: 3 };
    recs.sort((a, b) => {
      const roiA = a.impact.estimate / effortWeight[a.effort];
      const roiB = b.impact.estimate / effortWeight[b.effort];
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
        deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
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
    <ModulePage
      module={{
        id: 'M11.1',
        categoryId: 11,
        title: 'Recomendaciones Priorizadas',
        level: 'S',
        route: '',
        icon: '',
        shortDescription: '',
        businessQuestion: '¿Qué debo hacer hoy para mejorar mi escuela?',
        component: null as any,
      }}
    >
      <div className="space-y-6 flex flex-col h-full overflow-auto pr-2 pb-6">
        <div className="flex gap-4 mb-4">
          <div className="w-48">
            <label className="block text-xs font-bold text-navy-900 mb-1">Categoría</label>
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
          <div className="w-48">
            <label className="block text-xs font-bold text-navy-900 mb-1">Esfuerzo Máximo</label>
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

        {activeRecs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-secundario">
            <div className="text-4xl mb-4">🎉</div>
            <p className="font-bold text-navy-900">Estás al día</p>
            <p className="text-sm">No hay nuevas recomendaciones con los filtros actuales.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRecs.map((rec) => (
              <Card
                key={rec.id}
                className="p-5 border border-ice-200 flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge
                    color={
                      rec.category === 'finanzas'
                        ? 'bg-green-100 text-green-800'
                        : rec.category === 'operaciones'
                          ? 'bg-sky-100 text-sky-800'
                          : rec.category === 'retencion'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                    }
                  >
                    {rec.category.toUpperCase()}
                  </Badge>
                  <Badge
                    color={
                      rec.effort === 'bajo'
                        ? 'bg-green-100 text-green-800'
                        : rec.effort === 'medio'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                    }
                  >
                    Esfuerzo {rec.effort}
                  </Badge>
                </div>

                <h4 className="font-bold text-navy-900 text-lg mb-2 leading-tight">{rec.title}</h4>
                <p className="text-sm text-secundario mb-4 flex-1">{rec.rationale}</p>

                <div className="bg-ice-50 p-3 rounded mb-4 text-xs space-y-2">
                  <div>
                    <strong className="text-navy-900 block mb-1">Evidencia Detectada:</strong>
                    <ul className="list-disc pl-4 text-secundario">
                      {rec.evidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-4 pb-4 border-b border-ice-100">
                  <div>
                    <strong className="text-[10px] uppercase text-secundario block">
                      Impacto Esperado
                    </strong>
                    <div className="text-xl font-bold text-green-600">
                      {rec.impact.unit === 'MXN' ? '$' : ''}
                      {rec.impact.estimate.toLocaleString()}
                      {rec.impact.unit !== 'MXN' ? rec.impact.unit : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <strong className="text-[10px] uppercase text-secundario block">Métrica</strong>
                    <div className="text-sm font-bold text-navy-900">{rec.impact.metric}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(rec, 'accepted')}
                    className="flex-1 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 rounded text-xs transition-colors"
                  >
                    Aceptar al Plan
                  </button>
                  <button
                    onClick={() => handleAction(rec, 'postponed')}
                    className="flex-1 bg-ice-100 hover:bg-ice-200 text-navy-900 font-bold py-2 rounded text-xs transition-colors"
                  >
                    Posponer (7d)
                  </button>
                  <button
                    onClick={() => handleAction(rec, 'dismissed')}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-2 rounded text-xs transition-colors"
                    title="Descartar"
                  >
                    ✕
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <DropConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
    </ModulePage>
  );
}
