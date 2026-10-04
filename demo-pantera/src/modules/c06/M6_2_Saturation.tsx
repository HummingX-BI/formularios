import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { Badge } from '@/ui/components/DataDisplay';
import { Button } from '@/ui/components/Buttons';
import { formatCurrency } from '@/insights/templates';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';

const SATURATED = [
  {
    day: 'Sábado',
    hour: '10:00',
    occ: 100,
    waitlist: 8,
    lostLow: 4800,
    lostExpected: 6600,
    lostHigh: 8400,
  },
  {
    day: 'Lunes',
    hour: '17:00',
    occ: 95,
    waitlist: 5,
    lostLow: 3000,
    lostExpected: 4125,
    lostHigh: 5250,
  },
  {
    day: 'Martes',
    hour: '17:00',
    occ: 95,
    waitlist: 4,
    lostLow: 2400,
    lostExpected: 3300,
    lostHigh: 4200,
  },
];

const UNDERUTILIZED = [
  {
    day: 'Miércoles',
    hour: '11:00',
    occ: 40,
    free: 12,
    potLow: 2500,
    potExpected: 4500,
    potHigh: 7000,
  },
  {
    day: 'Jueves',
    hour: '11:00',
    occ: 45,
    free: 11,
    potLow: 2200,
    potExpected: 4000,
    potHigh: 6500,
  },
  {
    day: 'Viernes',
    hour: '08:00',
    occ: 50,
    free: 10,
    potLow: 2000,
    potExpected: 3800,
    potHigh: 6000,
  },
];

export default function M6_2_Saturation() {
  const [probConversion, setProbConversion] = useState(55);
  const [probFill, setProbFill] = useState(40);

  const totalLost = SATURATED.reduce(
    (acc, s) => acc + s.waitlist * 1500 * (probConversion / 100),
    0,
  );
  const totalPot = UNDERUTILIZED.reduce(
    (acc, u) => acc + u.free * 150 * 4.33 * (probFill / 100),
    0,
  );

  const waterfallData = [
    {
      type: 'waterfall',
      orientation: 'v',
      measure: ['absolute', 'relative', 'relative', 'total'],
      x: ['Ingreso Actual', 'Pérdida por Lleno', 'Potencial por Vacío', 'Ingreso Óptimo'],
      y: [250000, totalLost, totalPot, 0],
      connector: { line: { color: 'rgb(63, 63, 63)' } },
      decreasing: { marker: { color: '#F26B5B' } },
      increasing: { marker: { color: '#2BAE84' } },
      totals: { marker: { color: '#1E7FC0' } },
    },
  ];

  const insightData = {
    id: 'sat_1',
    moduleId: 'M6.2',
    severity: 'alerta' as const,
    headline: 'Urgente: Mover demanda del sábado en la mañana',
    summary:
      'Sábado 10:00 am genera la mayor pérdida por saturación. Se recomienda intentar migrar demanda al domingo o abrir un nuevo grupo.',
    bullets: [
      `La pérdida estimada por lista de espera es de $${formatCurrency(totalLost)}/mes.`,
      `El potencial de crecimiento en horarios valle es de $${formatCurrency(totalPot)}/mes.`,
    ],
    action: {
      text: 'Usar Optimizador de Horarios',
      actionType: 'navigate' as const,
      targetModule: 'M6.3',
    },
    evidence: [],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Detector de Saturación</h1>
          <p className="text-lg text-secundario mt-1">
            ¿Cuánto dinero pierdo por franjas llenas y por franjas vacías?
          </p>
        </div>
        <div className="flex gap-4 items-center p-2 bg-ice-50 rounded border border-ice-100">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Prob. Conv. (Espera): {probConversion}%
            </label>
            <input
              type="range"
              min="40"
              max="70"
              step="5"
              value={probConversion}
              onChange={(e) => setProbConversion(Number(e.target.value))}
              className="w-32 accent-coral"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Prob. Llenado (Libre): {probFill}%
            </label>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={probFill}
              onChange={(e) => setProbFill(Number(e.target.value))}
              className="w-32 accent-green-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-navy-900 font-jakarta">Franjas Saturadas ({'>'}90%)</h3>
            <Badge color="bg-coral text-white font-bold">
              Fuga Estimada: {formatCurrency(totalLost)}/mes
            </Badge>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-ice-50 border-b border-ice-100">
              <tr>
                <th className="p-2 font-bold text-navy-900">Franja</th>
                <th className="p-2 font-bold text-navy-900 text-center">Ocup.</th>
                <th className="p-2 font-bold text-navy-900 text-center">Espera</th>
                <th className="p-2 font-bold text-navy-900 text-right">Pérdida (Esp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ice-100">
              {SATURATED.map((s, i) => (
                <tr key={i}>
                  <td className="p-2 font-bold text-navy-900">
                    {s.day} {s.hour}
                  </td>
                  <td className="p-2 text-center text-coral font-bold">{s.occ}%</td>
                  <td className="p-2 text-center">{s.waitlist}</td>
                  <td className="p-2 text-right font-bold text-coral">
                    {formatCurrency(s.waitlist * 1500 * (probConversion / 100))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-navy-900 font-jakarta">
              Franjas Subutilizadas ({'<60%'})
            </h3>
            <Badge color="bg-green-100 text-green-800 font-bold">
              Potencial: {formatCurrency(totalPot)}/mes
            </Badge>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-ice-50 border-b border-ice-100">
              <tr>
                <th className="p-2 font-bold text-navy-900">Franja</th>
                <th className="p-2 font-bold text-navy-900 text-center">Ocup.</th>
                <th className="p-2 font-bold text-navy-900 text-center">Libres</th>
                <th className="p-2 font-bold text-navy-900 text-right">Potencial (Esp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ice-100">
              {UNDERUTILIZED.map((u, i) => (
                <tr key={i}>
                  <td className="p-2 font-bold text-navy-900">
                    {u.day} {u.hour}
                  </td>
                  <td className="p-2 text-center text-amber-500 font-bold">{u.occ}%</td>
                  <td className="p-2 text-center">{u.free}</td>
                  <td className="p-2 text-right font-bold text-green-500">
                    {formatCurrency(u.free * 150 * 4.33 * (probFill / 100))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PlotChart
          id="saturation_waterfall"
          title="Impacto Económico"
          subtitle="Ingreso perdido y potencial de crecimiento"
          data={waterfallData as any}
          layout={{ showlegend: false }}
          tableData={{ columns: [], rows: [] }}
          altText="Gráfica de cascada de ingreso, pérdidas por lista de espera y potencial por huecos"
          onExplain={() => {}}
        />
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <InsightBlock insight={insightData} />
          <div className="mt-6 pt-4 border-t border-ice-100 flex gap-4">
            <Button variant="ghost" className="flex-1 text-sm border-coral text-coral">
              Ver Alertas de Crecimiento (M1.3)
            </Button>
            <Button variant="primary" className="flex-1 text-sm">
              Ejecutar Optimizador
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
