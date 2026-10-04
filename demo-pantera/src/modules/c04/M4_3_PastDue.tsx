import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Button } from '@/ui/components/Buttons';
import { useDataset } from '@/data/hooks';
import { formatCurrency } from '@/insights/templates';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';
import { PlotChart } from '@/charts/PlotChart';

export default function M4_3_PastDue() {
  const dataset = useDataset();

  const pastDueCharges = useMemo(
    () => dataset.charges.filter((c) => c.status === 'vencido'),
    [dataset],
  );
  const totalPastDue = pastDueCharges.reduce((acc, c) => acc + c.amount, 0);

  // Group by family for the call list
  const callList = useMemo(() => {
    const map = new Map<
      string,
      { family: any; balance: number; oldestDate: string; probability: number }
    >();
    pastDueCharges.forEach((c) => {
      if (!map.has(c.familyId)) {
        const family = dataset.families.find((f) => f.id === c.familyId);
        // Probability mock: recent registration = higher probability, or deterministic via id
        const prob = 50 + (c.familyId.charCodeAt(0) % 40);
        map.set(c.familyId, { family, balance: 0, oldestDate: c.date, probability: prob });
      }
      const entry = map.get(c.familyId)!;
      entry.balance += c.amount;
      if (new Date(c.date) < new Date(entry.oldestDate)) {
        entry.oldestDate = c.date;
      }
    });
    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        daysPastDue: Math.floor(
          (new Date().getTime() - new Date(entry.oldestDate).getTime()) / (1000 * 3600 * 24),
        ),
      }))
      .sort((a, b) => b.balance * b.probability - a.balance * a.probability); // prioritize high balance & high probability
  }, [pastDueCharges, dataset]);

  // Expected recovery
  const expectedRecovery = callList.reduce((acc, c) => acc + c.balance * (c.probability / 100), 0);

  // Mock data for aging chart
  const agingData = [
    { name: '0-15 días', x: ['Jul', 'Ago', 'Sep'], y: [15000, 12000, 18000], type: 'bar' },
    { name: '16-30 días', x: ['Jul', 'Ago', 'Sep'], y: [8000, 7000, 9500], type: 'bar' },
    { name: '31-60 días', x: ['Jul', 'Ago', 'Sep'], y: [5000, 4000, 6000], type: 'bar' },
    { name: '>60 días', x: ['Jul', 'Ago', 'Sep'], y: [2000, 3000, 2500], type: 'bar' },
  ];

  // Concentration mock data
  const pieData = [
    {
      values: [45, 30, 25],
      labels: ['Transferencia', 'Efectivo', 'Tarjeta'],
      type: 'pie',
      hole: 0.6,
      marker: { colors: ['#7CC4E8', '#2FB6D4', '#1E7FC0'] },
    },
  ];

  const insightData = {
    id: 'cartera_1',
    moduleId: 'M4.3',
    severity: 'atencion' as const,
    headline: 'La concentración de deuda está en métodos manuales',
    summary:
      'El 75% de la cartera vencida proviene de familias que pagan por transferencia o efectivo. Esto indica una fricción en el proceso de cobro frente a la domiciliación.',
    bullets: [
      'Se espera recuperar $15,200 (±$2,000) esta semana según el modelo de probabilidad.',
      'Familias con 2 o más hijos concentran el 40% del monto vencido.',
    ],
    action: {
      text: 'Lanzar campaña de migración a tarjeta',
      actionType: 'task' as const,
      targetModule: 'M6.2',
    },
    evidence: [],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Cartera Vencida</h1>
          <p className="text-lg text-secundario mt-1">Análisis de adeudos y recuperación</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Cartera Vencida Total</div>
          <div className="text-3xl font-bold text-coral mb-2">{formatCurrency(totalPastDue)}</div>
          <Badge color="bg-amber-100 text-amber-800">+5.2% vs mes anterior</Badge>
        </Card>
        <Card className="p-6 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Recuperación Esperada</div>
          <div className="text-3xl font-bold text-green-500 mb-2">
            {formatCurrency(expectedRecovery)}
          </div>
          <Badge color="bg-ice-100 text-secundario">Rango: ±$3,500</Badge>
        </Card>
        <Card className="col-span-2 p-6 bg-white border border-ice-100 shadow-sm">
          <InsightBlock insight={insightData} />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PlotChart
          id="aging_chart"
          title="Antigüedad de Saldos"
          subtitle="Evolución de la cartera por edad de la deuda"
          data={agingData}
          layout={{ barmode: 'stack' }}
          altText="Gráfica de barras apiladas mostrando la antigüedad de saldos en los últimos 3 meses"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
        <PlotChart
          id="concentration_chart"
          title="Concentración por Método de Pago"
          subtitle="Distribución de la cartera vencida"
          data={pieData}
          layout={{ showlegend: true, legend: { orientation: 'h', y: -0.2 } }}
          altText="Gráfica de dona mostrando la concentración de deuda por método de pago"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
      </div>

      <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-ice-100 flex justify-between items-center">
          <h3 className="font-bold text-navy-900 font-jakarta">Lista Priorizada de Llamadas</h3>
          <Button variant="ghost" className="border border-ice-200">
            Asignar a Asesor
          </Button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-ice-50 border-b border-ice-100">
            <tr>
              <th className="p-4 font-bold text-navy-900 text-sm">Familia</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-center">Días de Atraso</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-right">Saldo Vencido</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-center">Probabilidad</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ice-100">
            {callList.slice(0, 10).map((row, i) => (
              <tr key={i} className="hover:bg-ice-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-navy-900">{row.family?.tutorName || 'N/A'}</div>
                  <div className="text-xs text-secundario">{row.family?.phone}</div>
                </td>
                <td className="p-4 text-center">
                  <Badge
                    color={
                      row.daysPastDue > 30 ? 'bg-coral text-white' : 'bg-amber-400 text-navy-900'
                    }
                  >
                    {row.daysPastDue} días
                  </Badge>
                </td>
                <td className="p-4 font-bold text-navy-900 tabular-figures text-right">
                  {formatCurrency(row.balance)}
                </td>
                <td className="p-4 text-center">
                  <div className="w-full bg-ice-100 rounded-full h-2.5 max-w-[100px] mx-auto">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${row.probability}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-secundario mt-1">{row.probability}%</div>
                </td>
                <td className="p-4 text-right">
                  <Button variant="primary" size="sm">
                    Registrar Llamada
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
