import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Button } from '@/ui/components/Buttons';
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
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Optimizador de Horarios</h1>
          <p className="text-lg text-secundario mt-1">
            Recomendaciones algorítmicas de consolidación y migración
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Left: Lista de movimientos */}
        <Card className="col-span-5 bg-white border border-ice-100 shadow-sm flex flex-col">
          <div className="p-4 border-b border-ice-100 bg-ice-50">
            <h3 className="font-bold text-navy-900">Movimientos Sugeridos ({moves.length})</h3>
            <p className="text-xs text-secundario mt-1">Ordenados por impacto económico mensual</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {moves.length === 0 && (
              <div className="p-4 text-center text-secundario">No hay movimientos sugeridos.</div>
            )}
            {moves.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMoveId(m.id)}
                className={`p-3 rounded border cursor-pointer ${selectedMoveId === m.id ? 'border-aqua-500 bg-ice-50 ring-1 ring-aqua-500' : 'border-ice-200 hover:bg-ice-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-navy-900 text-sm">
                    {m.type === 'consolidate' ? 'Consolidación' : 'Mover a Demanda'}
                  </div>
                  <Badge color="bg-green-100 text-green-800 font-bold">
                    +{formatCurrency(m.impactExpected)}/mes
                  </Badge>
                </div>
                <div className="text-xs text-secundario space-y-1">
                  <div>
                    <span className="font-bold">Grupo:</span> {m.groupName} ({m.instructor})
                  </div>
                  <div>
                    <span className="font-bold">De:</span> {m.sourceSlot.day} {m.sourceSlot.hour}
                  </div>
                  <div>
                    <span className="font-bold">A:</span> {m.destSlot.day} {m.destSlot.hour}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Detalle del movimiento */}
        <Card className="col-span-7 p-6 bg-white border border-ice-100 shadow-sm flex flex-col">
          {selectedMove ? (
            <>
              <h3 className="font-bold text-navy-900 font-jakarta text-xl mb-4">
                {selectedMove.type === 'consolidate'
                  ? 'Consolidar grupo subutilizado'
                  : 'Migrar grupo a franja saturada'}
              </h3>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded text-blue-900 mb-6 text-sm">
                {selectedMove.explanation}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 border border-ice-200 rounded">
                  <div className="font-bold text-navy-900 mb-2 border-b border-ice-100 pb-2">
                    Antes (Franja Origen)
                  </div>
                  <div className="text-sm">
                    <div>
                      <span className="text-secundario">Día/Hora:</span>{' '}
                      {selectedMove.sourceSlot.day} {selectedMove.sourceSlot.hour}
                    </div>
                    <div>
                      <span className="text-secundario">Ocupación:</span>{' '}
                      {selectedMove.sourceSlot.occ}%
                    </div>
                    <div>
                      <span className="text-secundario">Lista Espera:</span>{' '}
                      {selectedMove.sourceSlot.waitlist}
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-ice-200 rounded">
                  <div className="font-bold text-navy-900 mb-2 border-b border-ice-100 pb-2">
                    Después (Franja Destino)
                  </div>
                  <div className="text-sm">
                    <div>
                      <span className="text-secundario">Día/Hora:</span> {selectedMove.destSlot.day}{' '}
                      {selectedMove.destSlot.hour}
                    </div>
                    <div>
                      <span className="text-secundario">Ocupación Esperada:</span>{' '}
                      {selectedMove.type === 'consolidate'
                        ? selectedMove.destSlot.occ + 40
                        : selectedMove.destSlot.occ - 10}
                      %
                    </div>
                    <div>
                      <span className="text-secundario">Familias Absorbidas:</span>{' '}
                      {selectedMove.familiesBenefited}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mb-8">
                <div className="p-3 bg-ice-50 rounded">
                  <div className="text-xs text-secundario mb-1">Impacto Pesimista</div>
                  <div className="font-bold text-navy-900">
                    {formatCurrency(selectedMove.impactLow)}
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-xs text-green-800 mb-1 font-bold">Impacto Esperado</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedMove.impactExpected)}
                  </div>
                </div>
                <div className="p-3 bg-ice-50 rounded">
                  <div className="text-xs text-secundario mb-1">Impacto Optimista</div>
                  <div className="font-bold text-navy-900">
                    {formatCurrency(selectedMove.impactHigh)}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <Button variant="ghost" className="flex-1 text-secundario">
                  Enviar al Plan de Acción
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleApply}>
                  Aplicar en Simulación
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-secundario">
              Selecciona un movimiento para ver el detalle
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
