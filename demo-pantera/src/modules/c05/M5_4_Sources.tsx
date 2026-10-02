import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { Badge } from '@/ui/components/DataDisplay';
import { confIntervalProportionWilson, chiSquareIndependence } from '@/stats/inference';
import { formatCurrency } from '@/insights/templates';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';

export default function M5_4_Sources() {
  const [costFacebook, setCostFacebook] = useState(5000);
  const [costGoogle, setCostGoogle] = useState(8000);

  // Mock data representing current period
  const sources = [
    { name: 'Facebook', leads: 85, enrolled: 12, cost: costFacebook },
    { name: 'Google', leads: 60, enrolled: 15, cost: costGoogle },
    { name: 'Referido', leads: 30, enrolled: 18, cost: 0 },
    { name: 'Orgánico', leads: 25, enrolled: 5, cost: 0 }
  ];

  // Chi Square: Rows=Source, Cols=[Enrolled, NotEnrolled]
  const observed = sources.map(s => [s.enrolled, s.leads - s.enrolled]);
  const chiResult = chiSquareIndependence(observed);

  // Chart data for Conversion with Wilson CI
  const conversionChartData = [
    {
      name: 'Conversión',
      type: 'bar',
      x: sources.map(s => s.name),
      y: sources.map(s => (s.enrolled / s.leads) * 100),
      error_y: {
        type: 'data',
        array: sources.map(s => {
          const ci = confIntervalProportionWilson(s.enrolled, s.leads);
          return ((ci[1] || 0) - (s.enrolled / s.leads)) * 100;
        }),
        visible: true
      },
      marker: { color: ['#7CC4E8', '#1E7FC0', '#2FB6D4', '#CFE8F5'] }
    }
  ];

  const mixEvolutionData = [
    { name: 'Referido', type: 'scatter', stackgroup: 'one', x: ['Ene','Feb','Mar','Abr'], y: [20,25,28,30], fillcolor: '#2FB6D4' },
    { name: 'Google', type: 'scatter', stackgroup: 'one', x: ['Ene','Feb','Mar','Abr'], y: [40,45,55,60], fillcolor: '#1E7FC0' },
    { name: 'Facebook', type: 'scatter', stackgroup: 'one', x: ['Ene','Feb','Mar','Abr'], y: [100,90,95,85], fillcolor: '#7CC4E8' }
  ];

  const insightData = {
    id: 'fuentes_1',
    moduleId: 'M5.4',
    severity: 'positivo' as const,
    headline: 'Referidos domina en conversión, Google es más eficiente que Facebook',
    summary: 'La prueba chi-cuadrada confirma que la fuente sí afecta la conversión significativamente. Los referidos convierten a más del doble, sin costo de campaña.',
    bullets: [
      chiResult.phrase,
      'Costo de Adquisición (CAC) en Facebook es alto; se sugiere reasignar 20% del presupuesto a Google o a incentivos de referidos.'
    ],
    action: {
      text: 'Simular reasignación en Planner',
      actionType: 'navigate' as const,
      targetModule: 'M11.2'
    },
    evidence: []
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Fuentes de Captación</h1>
          <p className="text-lg text-secundario mt-1">Análisis de adquisición y eficiencia por canal</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 bg-white border border-ice-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Rendimiento por Canal</h3>
            <table className="w-full text-left text-sm">
              <thead className="bg-ice-50 border-b border-ice-100">
                <tr>
                  <th className="p-3 font-bold text-navy-900">Fuente</th>
                  <th className="p-3 font-bold text-navy-900 text-center">Prospectos</th>
                  <th className="p-3 font-bold text-navy-900 text-center">Inscritos</th>
                  <th className="p-3 font-bold text-navy-900 text-center">Conversión</th>
                  <th className="p-3 font-bold text-navy-900 text-right">CAC Estimado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ice-100">
                {sources.map(s => {
                  const conv = (s.enrolled / s.leads) * 100;
                  const cac = s.cost > 0 ? s.cost / s.enrolled : 0;
                  return (
                    <tr key={s.name}>
                      <td className="p-3 font-bold text-navy-900">{s.name}</td>
                      <td className="p-3 text-center">{s.leads}</td>
                      <td className="p-3 text-center text-green-500 font-bold">{s.enrolled}</td>
                      <td className="p-3 text-center">
                        <Badge color="bg-ice-100 text-secundario">{conv.toFixed(1)}%</Badge>
                      </td>
                      <td className="p-3 text-right font-bold tabular-figures">
                        {cac > 0 ? formatCurrency(cac) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-ice-50 border border-ice-200 rounded flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-navy-900 mb-1">Costo Campaña Facebook</label>
              <input type="range" min="1000" max="20000" step="500" value={costFacebook} onChange={e => setCostFacebook(Number(e.target.value))} className="w-full accent-aqua-500" />
              <div className="text-xs text-secundario mt-1">{formatCurrency(costFacebook)}</div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-navy-900 mb-1">Costo Campaña Google</label>
              <input type="range" min="1000" max="20000" step="500" value={costGoogle} onChange={e => setCostGoogle(Number(e.target.value))} className="w-full accent-aqua-500" />
              <div className="text-xs text-secundario mt-1">{formatCurrency(costGoogle)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <InsightBlock insight={insightData} />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PlotChart 
          id="sources_conversion_chart"
          title="Tasa de Conversión por Fuente"
          subtitle="Con intervalos de confianza (Wilson 95%)"
          data={conversionChartData as any}
          layout={{ yaxis: { title: 'Conversión (%)' } }}
          altText="Gráfica de barras mostrando conversión por fuente con intervalos de error"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
        <PlotChart 
          id="sources_mix_chart"
          title="Mix de Fuentes (Volumen)"
          subtitle="Evolución de prospectos"
          data={mixEvolutionData as any}
          layout={{ hovermode: 'x unified' }}
          altText="Gráfica de área apilada mostrando la evolución del mix de fuentes"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
      </div>
    </div>
  );
}
