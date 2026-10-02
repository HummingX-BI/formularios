import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { PlotChart } from '@/charts/PlotChart';
import { formatCurrency } from '@/insights/templates';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';

export default function M4_6_Profitability() {
  
  const [costParams, setCostParams] = useState({
    instructorAvgHour: 200,
    maintenanceHour: 500,
    energyHour: 300
  });

  const [heatMapMetric, setHeatMapMetric] = useState<'mxn' | 'margin'>('mxn');

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const HOURS = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  // Simulated heatmap logic
  const heatmapData = useMemo(() => {
    const z = [];
    const text = [];
    for (let h = 0; h < HOURS.length; h++) {
      const row = [];
      const rowText = [];
      for (let d = 0; d < DAYS.length; d++) {
        // Mock data logic based on dataset size
        const val = Math.floor(Math.random() * 5000) + (h > 2 ? 3000 : 0);
        const margin = (val / (val + costParams.instructorAvgHour + costParams.maintenanceHour + costParams.energyHour)) * 100;
        
        row.push(heatMapMetric === 'mxn' ? val : margin);
        rowText.push(heatMapMetric === 'mxn' ? formatCurrency(val) : `${margin.toFixed(1)}%`);
      }
      z.push(row);
      text.push(rowText);
    }
    return [{
      z,
      x: DAYS,
      y: HOURS,
      text,
      texttemplate: "%{text}",
      type: 'heatmap' as const,
      colorscale: heatMapMetric === 'mxn' ? 'Greens' : 'Blues',
      showscale: false
    }];
  }, [heatMapMetric, costParams]);

  // Scatter data (Occupancy vs Profitability)
  const scatterData = [{
    x: Array.from({length: 50}, () => Math.random() * 100), // Occupancy %
    y: Array.from({length: 50}, () => (Math.random() * 2000) - 500), // Profitability MXN
    mode: 'markers',
    type: 'scatter',
    marker: { color: '#7CC4E8', size: 10, opacity: 0.7 }
  }];

  const insightData = {
    id: 'rentabilidad_1',
    moduleId: 'M4.6',
    severity: 'positivo' as const,
    headline: 'Grupos con niños y adultos simultáneos maximizan la rentabilidad',
    summary: 'Los horarios de 17:00 a 19:00 tienen alta ocupación, pero la rentabilidad se dispara al 45% de margen cuando la alberca principal y la infantil operan a tope al mismo tiempo (H10).',
    bullets: [
      'El costo fijo operativo diluye las ganancias en los horarios de baja ocupación (15:00).',
      'Instructor Carlos G. genera $15,000/mes de ganancia neta, siendo el más rentable.'
    ],
    action: {
      text: 'Consolidar grupos de 15:00 a 16:00',
      actionType: 'task' as const,
      targetModule: 'M2.3'
    },
    evidence: []
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Rentabilidad Operativa</h1>
          <p className="text-lg text-secundario mt-1">¿Qué horarios, albercas e instructores dejan dinero?</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-64 space-y-4">
          <Card className="p-4 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-4">Parámetros de Costo (Hora)</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-secundario mb-1">Instructor Promedio</label>
                <div className="relative">
                  <span className="absolute left-2 top-1.5 text-tenue">$</span>
                  <input type="number" value={costParams.instructorAvgHour} onChange={e => setCostParams(p => ({...p, instructorAvgHour: Number(e.target.value)}))} className="w-full pl-6 pr-2 py-1.5 border border-ice-200 rounded outline-none focus:border-aqua-500" />
                </div>
              </div>
              <div>
                <label className="block text-secundario mb-1">Mantenimiento (Fijo)</label>
                <div className="relative">
                  <span className="absolute left-2 top-1.5 text-tenue">$</span>
                  <input type="number" value={costParams.maintenanceHour} onChange={e => setCostParams(p => ({...p, maintenanceHour: Number(e.target.value)}))} className="w-full pl-6 pr-2 py-1.5 border border-ice-200 rounded outline-none focus:border-aqua-500" />
                </div>
              </div>
              <div>
                <label className="block text-secundario mb-1">Energía/Gas (Variable)</label>
                <div className="relative">
                  <span className="absolute left-2 top-1.5 text-tenue">$</span>
                  <input type="number" value={costParams.energyHour} onChange={e => setCostParams(p => ({...p, energyHour: Number(e.target.value)}))} className="w-full pl-6 pr-2 py-1.5 border border-ice-200 rounded outline-none focus:border-aqua-500" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-ice-100">
              <div className="text-xs text-tenue mb-1">Costo Base Operativo por Hora</div>
              <div className="text-xl font-bold text-coral">{formatCurrency(costParams.instructorAvgHour + costParams.maintenanceHour + costParams.energyHour)}</div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-3">Ranking Instructores</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center"><span className="text-navy-900 font-bold">1. Carlos G.</span><Badge color="bg-green-100 text-green-800">45% Mg</Badge></li>
              <li className="flex justify-between items-center"><span className="text-navy-900 font-bold">2. Ana P.</span><Badge color="bg-green-100 text-green-800">38% Mg</Badge></li>
              <li className="flex justify-between items-center"><span className="text-secundario">...</span></li>
              <li className="flex justify-between items-center"><span className="text-navy-900 font-bold">7. Luis R.</span><Badge color="bg-coral text-white">-5% Mg</Badge></li>
            </ul>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <Card className="p-6 bg-white border border-ice-100 shadow-sm">
            <InsightBlock insight={insightData} />
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10 bg-white/80 p-1 rounded border border-ice-200 flex gap-1">
                <button onClick={() => setHeatMapMetric('mxn')} className={`px-2 py-1 text-xs font-bold rounded ${heatMapMetric === 'mxn' ? 'bg-navy-900 text-white' : 'text-secundario hover:bg-ice-50'}`}>MXN</button>
                <button onClick={() => setHeatMapMetric('margin')} className={`px-2 py-1 text-xs font-bold rounded ${heatMapMetric === 'margin' ? 'bg-navy-900 text-white' : 'text-secundario hover:bg-ice-50'}`}>Margen %</button>
              </div>
              <PlotChart 
                id="profitability_heatmap"
                title="Rentabilidad por Hora-Carril"
                subtitle="Mapa de calor de la operación semanal"
                data={heatmapData as any}
                layout={{ margin: { l: 50, r: 20, t: 60, b: 40 } }}
                altText="Mapa de calor mostrando los horarios más rentables"
                tableData={{ columns: [], rows: [] }}
                onExplain={() => {}}
              />
            </div>
            
            <PlotChart 
              id="occupancy_profitability_scatter"
              title="Ocupación vs Rentabilidad"
              subtitle="Grupos individuales y sus márgenes"
              data={scatterData as any}
              layout={{ 
                xaxis: { title: 'Ocupación (%)' },
                yaxis: { title: 'Rentabilidad Neta (MXN)' },
                shapes: [
                  { type: 'line', x0: 0, x1: 100, y0: 0, y1: 0, line: { color: '#F26B5B', dash: 'dash' } },
                  { type: 'line', x0: 75, x1: 75, y0: -500, y1: 1500, line: { color: '#7D95AA', dash: 'dot' } }
                ]
              }}
              altText="Gráfica de dispersión comparando ocupación y rentabilidad"
              tableData={{ columns: [], rows: [] }}
              onExplain={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
