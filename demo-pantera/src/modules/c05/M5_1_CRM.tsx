import { useState, useMemo } from 'react';
import { Badge } from '@/ui/components/DataDisplay';
import { Select } from '@/ui/components/Inputs';
import { useDataset } from '@/data/hooks';

const STAGES = ['nuevo', 'contactado', 'visita_agendada', 'clase_muestra', 'inscrito', 'perdido'];
const STAGE_NAMES: Record<string, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  visita_agendada: 'Visita Agendada',
  clase_muestra: 'Clase Muestra',
  inscrito: 'Inscrito',
  perdido: 'Perdido',
};

export default function M5_1_CRM() {
  const dataset = useDataset();
  const [filterChannel, setFilterChannel] = useState('todos');
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
  // Simulated local state for CRM kanban board
  const [localProspects, setLocalProspects] = useState(() => {
    return dataset.prospects.map((p) => ({
      ...p,
      // mock 'daysInStage', 'lastContact', 'probability'
      daysInStage: Math.floor(Math.random() * 5),
      lastContact: new Date(Date.now() - Math.random() * 72 * 3600 * 1000).toISOString(),
      probability: Math.floor(Math.random() * 80) + 10,
      parentName: `Familia ${p.id.slice(0, 4)}`,
    }));
  });

  const filteredProspects = useMemo(() => {
    return localProspects.filter((p) => {
      if (filterChannel !== 'todos' && p.channel !== filterChannel) return false;

      // Limit inscrito/perdido to recent (mocking 30 days limitation)
      if (['inscrito', 'perdido'].includes(p.stage)) {
        return p.daysInStage < 30; // Just using daysInStage for the mock limit
      }
      return true;
    });
  }, [localProspects, filterChannel]);
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    if (id) {
      setLocalProspects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stage: stage as any, daysInStage: 0 } : p)),
      );
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">CRM de Prospectos</h1>
          <p className="text-lg text-secundario mt-1">Gestión del embudo de ventas</p>
        </div>
        <div className="flex gap-4">
          <div className="w-48">
            <Select
              options={[
                { label: 'Todos los canales', value: 'todos' },
                { label: 'Mensajería', value: 'mensajeria' },
                { label: 'Teléfono', value: 'telefono' },
                { label: 'Formulario web', value: 'formulario_web' },
              ]}
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageProspects = filteredProspects.filter((p) => p.stage === stage);
          return (
            <div
              key={stage}
              className="bg-ice-50 rounded-lg flex flex-col border border-ice-100 min-w-[280px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="p-3 border-b border-ice-200 bg-ice-100 rounded-t-lg font-bold text-navy-900 flex justify-between">
                <span>{STAGE_NAMES[stage]}</span>
                <Badge color="bg-white text-secundario">{stageProspects.length}</Badge>
              </div>
              <div className="p-2 flex-1 space-y-2 overflow-y-auto">
                {stageProspects.map((p) => {
                  const isNeglected =
                    !['inscrito', 'perdido'].includes(p.stage) && p.daysInStage >= 2;
                  return (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, p.id)}
                      onClick={() => setSelectedProspectId(p.id)}
                      className={`p-3 bg-white border ${isNeglected ? 'border-coral' : 'border-ice-200'} rounded shadow-sm cursor-grab active:cursor-grabbing hover:border-aqua-500 ${selectedProspectId === p.id ? 'ring-2 ring-aqua-500' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-navy-900 text-sm truncate">
                          {p.parentName}
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-600" title={p.source}></div>
                      </div>
                      <div className="text-xs text-secundario mb-2">Hijo: {p.childAge} años</div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={isNeglected ? 'text-coral font-bold' : 'text-tenue'}>
                          Hace {p.daysInStage} días
                        </span>
                        <span className="text-aqua-500">{p.probability}% prob</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
