import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { formatCurrency } from '@/insights/templates';

const SEGMENTS = [
  { id: 1, name: 'Alto Riesgo - 3 Faltas', cause: 'Faltas', action: 'Llamada del Instructor', target: 12, cost: 0, effectiveness: 0.3, ltv: 3500 },
  { id: 2, name: 'Alto Riesgo - Nivel 3', cause: 'Fricción', action: 'Clase de Refuerzo Gratis', target: 8, cost: 200, effectiveness: 0.5, ltv: 3500 },
  { id: 3, name: 'Medio Riesgo - Atraso Pago', cause: 'Finanzas', action: 'Descuento 10% por 3 meses', target: 25, cost: 450, effectiveness: 0.4, ltv: 2800 },
  { id: 4, name: 'Medio Riesgo - Horario', cause: 'Horario', action: 'Oferta de Cambio Prioritario', target: 18, cost: 0, effectiveness: 0.6, ltv: 3100 }
];

export default function M7_5_RetentionPlan() {
  const [activeActions, setActiveActions] = useState<number[]>([]);

  const toggleAction = (id: number) => {
    setActiveActions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totals = SEGMENTS.filter(s => activeActions.includes(s.id)).reduce((acc, s) => {
    const saved = s.target * s.effectiveness;
    const rev = saved * s.ltv;
    const cost = s.target * s.cost;
    return {
      saved: acc.saved + saved,
      rev: acc.rev + rev,
      cost: acc.cost + cost
    };
  }, { saved: 0, rev: 0, cost: 0 });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-jakarta font-bold text-navy-900">Plan de Retención</h1>
        <p className="text-lg text-secundario mt-1">¿Qué acciones tomar y cuánto retorno darán?</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Bajas Evitadas Estimadas</div>
          <div className="text-3xl font-bold text-aqua-500">{totals.saved.toFixed(1)}</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Ingreso Retenido (LTV)</div>
          <div className="text-3xl font-bold text-green-500">{formatCurrency(totals.rev)}</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Retorno sobre Inversión (ROI)</div>
          <div className="text-3xl font-bold text-navy-900">
            {totals.cost > 0 ? (((totals.rev - totals.cost) / totals.cost) * 100).toFixed(0) : (totals.rev > 0 ? '∞' : '0')}%
          </div>
          <div className="text-xs text-coral mt-1">Costo: {formatCurrency(totals.cost)}</div>
        </Card>
      </div>

      <Card className="flex-1 bg-white border border-ice-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ice-100 bg-ice-50">
          <h3 className="font-bold text-navy-900">Acciones Recomendadas por Segmento</h3>
        </div>
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-white sticky top-0 border-b border-ice-200">
              <tr>
                <th className="p-4 text-secundario">Segmento (Riesgo)</th>
                <th className="p-4 text-secundario">Acción Sugerida</th>
                <th className="p-4 text-secundario text-center">Alumnos</th>
                <th className="p-4 text-secundario text-right">Efectividad</th>
                <th className="p-4 text-secundario text-right">Costo / Alumno</th>
                <th className="p-4 text-secundario text-right">Retorno Esp.</th>
                <th className="p-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {SEGMENTS.map(s => {
                const isActive = activeActions.includes(s.id);
                const saved = s.target * s.effectiveness;
                const ret = saved * s.ltv - s.target * s.cost;
                return (
                  <tr key={s.id} className={`border-b border-ice-50 hover:bg-ice-50 transition-colors ${isActive ? 'bg-aqua-50/30' : ''}`}>
                    <td className="p-4">
                      <div className="font-bold text-navy-900">{s.name}</div>
                      <div className="text-xs text-secundario">Causa: {s.cause}</div>
                    </td>
                    <td className="p-4 font-bold text-aqua-600">{s.action}</td>
                    <td className="p-4 text-center font-bold text-navy-900">{s.target}</td>
                    <td className="p-4 text-right">{(s.effectiveness * 100).toFixed(0)}%</td>
                    <td className="p-4 text-right text-coral font-bold">{s.cost > 0 ? formatCurrency(s.cost) : 'N/A'}</td>
                    <td className="p-4 text-right text-green-600 font-bold">+{formatCurrency(ret)}</td>
                    <td className="p-4 text-center">
                      <Button 
                        variant={isActive ? 'ghost' : 'primary'} 
                        className={`text-xs py-1 px-3 ${isActive ? 'text-secundario border-secundario' : ''}`}
                        onClick={() => toggleAction(s.id)}
                      >
                        {isActive ? 'Remover' : 'Enviar al Plan'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
