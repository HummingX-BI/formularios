import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { formatCurrency } from '@/insights/templates';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';

export default function M5_3_LossReasons() {
  const [discountPercent, setDiscountPercent] = useState(15);
  const [recoveryRate, setRecoveryRate] = useState(25);

  const lostByPrice = 120; // Mock base from dataset over 6 months
  const avgTicket = 1250;

  // Simulator calculations
  const recoveredProspects = Math.round(lostByPrice * (recoveryRate / 100));
  const newTicket = avgTicket * (1 - (discountPercent / 100));
  const incrementalRevenue = recoveredProspects * newTicket;
  const discountCost = recoveredProspects * (avgTicket - newTicket);

  const barData = [{
    type: 'bar',
    x: ['Precio', 'Horarios', 'Distancia', 'Competencia', 'No contestó'],
    y: [40, 25, 15, 10, 10],
    marker: { color: ['#F26B5B', '#7CC4E8', '#CFE8F5', '#CFE8F5', '#CFE8F5'] }
  }];

  const pieData = [{
    type: 'pie',
    labels: ['Precio', 'Horarios', 'Distancia', 'Otros'],
    values: [40, 25, 15, 20],
    hole: 0.6,
    marker: { colors: ['#F26B5B', '#7CC4E8', '#1E7FC0', '#CFE8F5'] }
  }];

  const insightData = {
    id: 'loss_1',
    moduleId: 'M5.3',
    severity: 'info' as const,
    headline: 'El precio es barrera, pero el descuento es rentable',
    summary: 'Ofrecer un descuento recupera prospectos y genera ingreso incremental que supera el costo del descuento.',
    bullets: [
      `Con ${discountPercent}% de descuento, se estima recuperar $${formatCurrency(incrementalRevenue)}/mes.`,
      `El costo del descuento ($${formatCurrency(discountCost)}) es absorbido por el volumen recuperado.`
    ],
    action: {
      text: 'Llevar a Simulador de Escenarios',
      actionType: 'navigate' as const,
      targetModule: 'M11.2'
    },
    evidence: []
  };

  const comments = [
    "Me parece un poco elevado comparado con la competencia.",
    "Buscaba algo más económico para empezar.",
    "Se sale de mi presupuesto mensual actual.",
    "El costo de inscripción es una barrera para nosotros.",
    "Prefiero esperar a una promoción para entrar."
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Motivos de Pérdida</h1>
          <p className="text-lg text-secundario mt-1">Análisis de fricción y simulador de retención</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PlotChart 
          id="loss_bar"
          title="Distribución de Motivos"
          subtitle="Principales barreras de entrada"
          data={barData as any}
          altText="Gráfica de barras mostrando el precio como motivo principal de pérdida"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
        <PlotChart 
          id="loss_pie"
          title="Composición de Pérdidas"
          subtitle="Proporción sobre el total"
          data={pieData as any}
          altText="Gráfica de dona de motivos de pérdida"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 bg-white border border-ice-100 shadow-sm">
          <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Simulador: Efecto de Descuento por Precio</h3>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-bold text-navy-900 mb-2">Descuento Ofrecido: {discountPercent}%</label>
              <input type="range" min="5" max="50" step="5" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} className="w-full accent-aqua-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy-900 mb-2">Tasa de Recuperación Esperada: {recoveryRate}%</label>
              <input type="range" min="5" max="80" step="5" value={recoveryRate} onChange={e => setRecoveryRate(Number(e.target.value))} className="w-full accent-green-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-ice-50 rounded">
              <div className="text-sm text-secundario mb-1">Prospectos Recuperados</div>
              <div className="text-2xl font-bold text-navy-900">{recoveredProspects}</div>
            </div>
            <div className="p-4 bg-ice-50 rounded">
              <div className="text-sm text-secundario mb-1">Costo del Descuento</div>
              <div className="text-2xl font-bold text-coral">-{formatCurrency(discountCost)}</div>
            </div>
            <div className="p-4 bg-ice-50 rounded">
              <div className="text-sm text-secundario mb-1">Ingreso Incremental Neto</div>
              <div className="text-2xl font-bold text-green-500">+{formatCurrency(incrementalRevenue)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-ice-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Lo que dicen los clientes</h3>
            <ul className="space-y-3 text-sm text-secundario italic">
              {comments.map((c, i) => (
                <li key={i} className="border-l-2 border-aqua-500 pl-3">"{c}"</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-ice-100">
            <InsightBlock insight={insightData} />
          </div>
        </Card>
      </div>
    </div>
  );
}
