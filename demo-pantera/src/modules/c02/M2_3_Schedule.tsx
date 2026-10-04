import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Badge } from '@/ui/components/DataDisplay';
import { Select } from '@/ui/components/Inputs';
import { useDataset } from '@/data/hooks';
import type { Group } from '@/data/types';

export default function M2_3_Schedule() {
  const dataset = useDataset();
  const [selectedPool, setSelectedPool] = useState('todas');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Drag and drop mock state
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null);
  const [sessionChanges, setSessionChanges] = useState<
    Record<string, { dayOfWeek: number; timeSlot: string }>
  >({});

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const HOURS = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const getDayName = (dayNum: number) => DAYS[dayNum - 1] || 'Lunes';

  // Apply session changes to groups
  const groups = useMemo(() => {
    let list = dataset.groups;
    if (selectedPool !== 'todas') {
      list = list.filter((g) => g.pool === selectedPool);
    }
    return list.map((g) => {
      if (sessionChanges[g.id]) {
        return {
          ...g,
          dayOfWeek: sessionChanges[g.id]!.dayOfWeek,
          timeSlot: sessionChanges[g.id]!.timeSlot,
        };
      }
      return g;
    });
  }, [dataset, selectedPool, sessionChanges]);

  const handleDragStart = (e: React.DragEvent, groupId: string) => {
    e.dataTransfer.setData('groupId', groupId);
    setDraggedGroupId(groupId);
  };

  const handleDrop = (e: React.DragEvent, dayOfWeek: number, timeSlot: string) => {
    e.preventDefault();
    const groupId = e.dataTransfer.getData('groupId');
    if (groupId) {
      setSessionChanges((prev) => ({
        ...prev,
        [groupId]: { dayOfWeek, timeSlot },
      }));
    }
    setDraggedGroupId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const undoChanges = () => setSessionChanges({});

  const renderGridCell = (dayOfWeek: number, timeSlot: string) => {
    const cellGroups = groups.filter((g) => g.dayOfWeek === dayOfWeek && g.timeSlot === timeSlot);

    return (
      <div
        key={`${dayOfWeek}-${timeSlot}`}
        className="border border-ice-100 p-1 min-h-[100px] flex flex-col gap-1 bg-white relative transition-colors hover:bg-ice-50"
        onDrop={(e) => handleDrop(e, dayOfWeek, timeSlot)}
        onDragOver={handleDragOver}
      >
        {cellGroups.map((g) => {
          const instructor = dataset.instructors.find((i) => i.id === g.instructorId);
          // Ocupación simulada: 6/8
          const used = Math.floor(g.capacity * 0.75);
          const percent = (used / g.capacity) * 100;

          return (
            <div
              key={g.id}
              draggable
              onDragStart={(e) => handleDragStart(e, g.id)}
              onClick={() => setSelectedGroup(g)}
              className={`p-2 rounded text-xs cursor-grab active:cursor-grabbing border ${selectedGroup?.id === g.id ? 'ring-2 ring-aqua-500 border-aqua-500' : 'border-ice-200 shadow-sm'} ${draggedGroupId === g.id ? 'opacity-50' : 'opacity-100'}`}
              style={{
                backgroundColor: g.level.includes('principiante')
                  ? '#EAF4FA'
                  : g.level.includes('intermedio')
                    ? '#CFE8F5'
                    : '#7CC4E8',
              }}
            >
              <div className="font-bold text-navy-900 truncate">Grupo {g.id.substring(0, 4)}</div>
              <div className="text-secundario truncate">{instructor?.name.split(' ')[0]}</div>
              <div className="mt-1 h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-jakarta font-bold text-navy-900">Grupos y Horarios</h1>
            <p className="text-lg text-secundario mt-1">
              Arrastra para reubicar. Los cambios son de sesión.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {Object.keys(sessionChanges).length > 0 && (
              <Button variant="secondary" onClick={undoChanges}>
                Deshacer Movimientos
              </Button>
            )}
            <Select
              options={[
                { label: 'Todas las Albercas', value: 'todas' },
                { label: 'Alberca Principal', value: 'principal' },
                { label: 'Alberca Infantil', value: 'infantil' },
              ]}
              value={selectedPool}
              onChange={(e) => setSelectedPool(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        <Card className="flex-1 overflow-auto bg-white border border-ice-100 shadow-sm p-4">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              <div className="p-2 text-center font-bold text-tenue text-sm">Hora</div>
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="p-2 text-center font-bold text-navy-900 text-sm bg-ice-50 rounded"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="space-y-1">
              {HOURS.map((h) => (
                <div key={h} className="grid grid-cols-7 gap-1">
                  <div className="p-2 text-center font-bold text-secundario text-sm flex items-center justify-center border-t border-transparent">
                    {h}
                  </div>
                  {DAYS.map((_, i) => renderGridCell(i + 1, h))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="w-80 flex flex-col bg-white border border-ice-100 overflow-y-auto">
        {selectedGroup ? (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 font-jakarta">
                Grupo {selectedGroup.id.substring(0, 4)}
              </h2>
              <p className="text-secundario">
                {getDayName(selectedGroup.dayOfWeek)} {selectedGroup.timeSlot} •{' '}
                {selectedGroup.pool}
              </p>
            </div>

            <div>
              <span className="text-sm text-tenue block mb-1">Instructor</span>
              <div className="font-bold text-navy-900">
                {dataset.instructors.find((i) => i.id === selectedGroup.instructorId)?.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-ice-50 p-3 rounded text-center">
                <span className="text-sm text-tenue block">Nivel</span>
                <Badge color="bg-aqua-500 text-white capitalize">{selectedGroup.level}</Badge>
              </div>
              <div className="bg-ice-50 p-3 rounded text-center">
                <span className="text-sm text-tenue block">Cupo</span>
                <div className="font-bold text-navy-900">
                  {Math.floor(selectedGroup.capacity * 0.75)} / {selectedGroup.capacity}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-900 mb-3 border-b pb-2">Alumnos (Muestra)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center text-secundario">
                  <span className="truncate">Mateo Gómez</span>{' '}
                  <Badge color="bg-green-500 text-white">Corriente</Badge>
                </li>
                <li className="flex justify-between items-center text-secundario">
                  <span className="truncate">Sofía Ruiz</span>{' '}
                  <Badge color="bg-amber-400 text-navy-900">Atraso</Badge>
                </li>
                <li className="flex justify-between items-center text-secundario">
                  <span className="truncate">Liam Torres</span>{' '}
                  <Badge color="bg-green-500 text-white">Corriente</Badge>
                </li>
              </ul>
              <Button variant="ghost" className="w-full mt-3 text-aqua-500">
                Ver lista completa
              </Button>
            </div>

            <div>
              <h3 className="font-bold text-navy-900 mb-2">Lista de Espera</h3>
              <div className="text-sm text-secundario">2 personas en fila para este horario.</div>
              <Button variant="secondary" size="sm" className="w-full mt-2">
                Gestionar espera
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-secundario mt-20">
            Haz clic en un grupo del calendario para ver sus detalles.
          </div>
        )}
      </Card>
    </div>
  );
}
