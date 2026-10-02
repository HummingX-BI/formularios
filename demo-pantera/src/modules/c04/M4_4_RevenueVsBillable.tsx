import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { formatCurrency } from '@/insights/templates';
import { AppInsightBlock as InsightBlock } from '@/insights/components/AppInsightBlock';

export default function M4_4_RevenueVsBillable() {
  
  // Real vs Billable mock data
  const realIncome = 120000;
  const billableIncome = 145000;
  const gap = billableIncome - realIncome;

  const trendData = [
    { name: 'Facturable', x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], y: [130000, 135000, 140000, 142000, 143000, 145000], type: 'scatter', mode: 'lines+markers', line: { color: '#7D95AA', dash: 'dash' } },
    { name: 'Real Cobrado', x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], y: [110000, 118000, 125000, 115000, 122000, 120000], type: 'scatter', mode: 'lines+markers', line: { color: '#1E7FC0', width: 3 } }
  ];

  // Waterfall chart data
  const waterfallData = [{
    name: 'Brecha',
    type: 'waterfall',
    orientation: 'v',
    measure: ['absolute', 'relative', 'relative', 'relative', 'relative', 'total'],
    x: ['Facturable', 'Adeudos', 'Descuentos', 'Bajas', 'Recargos No', 'Real Cobrado'],
    textposition: 'outside',
    text: [formatCurrency(145000), formatCurrency(-15000), formatCurrency(-8000), formatCurrency(-5000), formatCurrency(3000), formatCurrency(120000)],
    y: [145000, -15000, -8000, -5000, 3000, 120000],
    connector: { line: { color: '#CFE8F5' } },
    decreasing: { marker: { color: '#F26B5B' } },
    increasing: { marker: { color: '#2BAE84' } },
    totals: { marker: { color: '#14507F' } }
  }];

  const insightData = {
    id: 'rev_gap_1',
    moduleId: 'M4.4',
    severity: 'info' as const,
    headline: 'La brecha principal está en descuentos',
    summary: 'La diferencia de $25,000 entre lo facturable y lo real se debe en un 60% a adeudos no cobrados y 32% a descuentos otorgados (hermanos y becas).',
    bullets: [
      'El ingreso real está 5% por debajo de la meta mensual.',
      'Proyección de cierre: $135,000 (Rango: $132k - $138k).'
    ],
    evidence: []
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Real vs Facturable</h1>
          <p className="text-lg text-secundario mt-1">Análisis de la brecha de ingresos</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-secundario">Ingreso Real en Vista (Cuadre)</div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(realIncome)}</div>
          <div className="text-xs text-tenue">Diferencia con motor: $0.00</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <div className="text-sm text-secundario mb-1">Ingreso Facturable</div>
          <div className="text-3xl font-bold text-navy-900 mb-2">{formatCurrency(billableIncome)}</div>
          <div className="text-sm text-tenue">Lo que se debería cobrar por alumnos activos</div>
        </Card>
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <div className="text-sm text-secundario mb-1">Brecha Total</div>
          <div className="text-3xl font-bold text-coral mb-2">-{formatCurrency(gap)}</div>
          <div className="text-sm text-tenue">Fuga por descuentos, bajas y adeudos</div>
        </Card>
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <InsightBlock insight={insightData} />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PlotChart 
          id="trend_gap_chart"
          title="Evolución Real vs Facturable"
          subtitle="Últimos 6 meses"
          data={trendData}
          layout={{ hovermode: 'x unified' }}
          altText="Gráfica de líneas comparando el ingreso real contra el facturable"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
        <PlotChart 
          id="waterfall_gap_chart"
          title="Desglose de la Brecha (Mes Actual)"
          subtitle="Componentes que reducen el ingreso"
          data={waterfallData}
          layout={{ showlegend: false }}
          altText="Gráfica de cascada mostrando cómo el facturable disminuye al real por adeudos y descuentos"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
      </div>
    </div>
  );
}
