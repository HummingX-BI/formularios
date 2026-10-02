import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { useDataset } from '@/data/hooks';
import { kaplanMeier } from '@/ml/kaplanMeier';
import { formatCurrency } from '@/insights/templates';
import { PlotChart } from '@/charts/PlotChart';

export default function M4_5_LTV() {
  const dataset = useDataset();
  
  // Kaplan-Meier calculation
  const kmResult = useMemo(() => {
    const times: number[] = [];
    const events: boolean[] = [];
    
    // Simulate current date as generating date or now
    const now = new Date(dataset.metadata.generatedAt).getTime();
    
    dataset.students.forEach(s => {
      const start = new Date(s.enrollmentDate).getTime();
      if (s.status === 'churned' && s.churnDate) {
        const end = new Date(s.churnDate).getTime();
        times.push((end - start) / (1000 * 3600 * 24 * 30)); // months
        events.push(true);
      } else if (s.status === 'active') {
        times.push((now - start) / (1000 * 3600 * 24 * 30)); // months
        events.push(false);
      }
    });
    
    return kaplanMeier(times, events, 36);
  }, [dataset]);

  // Mock metrics
  const avgTicket = 1250;
  const expectedMonths = kmResult.rmst36;
  const avgLtv = avgTicket * expectedMonths;
  const totalBaseValue = avgLtv * dataset.students.filter(s => s.status === 'active').length;

  // Histogram mock data
  const histogramData = [
    {
      x: Array.from({length: 500}, () => Math.max(0, (Math.random() + Math.random() + Math.random()) / 3) * 60000),
      type: 'histogram',
      histnorm: 'probability',
      marker: { color: '#7CC4E8' }
    }
  ];

  // Breakdown mock data
  const breakdownData = [
    { name: '1/semana', y: ['Planes'], x: [12000], type: 'bar', orientation: 'h', error_x: { type: 'data', array: [1500], visible: true } },
    { name: '2/semana', y: ['Planes'], x: [18000], type: 'bar', orientation: 'h', error_x: { type: 'data', array: [2000], visible: true } },
    { name: '3/semana', y: ['Planes'], x: [22000], type: 'bar', orientation: 'h', error_x: { type: 'data', array: [3000], visible: true } }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Ticket Promedio y LTV</h1>
          <p className="text-lg text-secundario mt-1">¿Cuánto vale cada alumno y dónde puedo subir ese valor?</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Ticket Promedio Mensual</div>
          <div className="text-3xl font-bold text-navy-900 mb-2">{formatCurrency(avgTicket)}</div>
        </Card>
        <Card className="p-6 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Permanencia Esperada</div>
          <div className="text-3xl font-bold text-navy-900 mb-2">{expectedMonths.toFixed(1)} meses</div>
          <div className="text-xs text-tenue">Vía Kaplan-Meier (Max 36m)</div>
        </Card>
        <Card className="p-6 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">LTV Promedio</div>
          <div className="text-3xl font-bold text-green-500 mb-2">{formatCurrency(avgLtv)}</div>
        </Card>
        <Card className="p-6 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-sm text-secundario mb-1">Valor de la Base Activa</div>
          <div className="text-3xl font-bold text-aqua-500 mb-2">{formatCurrency(totalBaseValue)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PlotChart 
          id="ltv_histogram"
          title="Distribución del LTV"
          subtitle="Densidad por alumno con percentiles"
          data={histogramData as any}
          layout={{ bargap: 0.1 }}
          altText="Histograma mostrando la distribución del LTV en la base de alumnos"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
        <PlotChart 
          id="ltv_breakdown"
          title="LTV por Plan"
          subtitle="Intervalos de confianza al 95%"
          data={breakdownData as any}
          layout={{ barmode: 'group', margin: { l: 80 } }}
          altText="Gráfica de barras horizontales comparando LTV por plan"
          tableData={{ columns: [], rows: [] }}
          onExplain={() => {}}
        />
      </div>

      <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden p-6">
        <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Oportunidades de Crecimiento (Simulación)</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="border border-ice-200 rounded p-4 bg-ice-50">
            <h4 className="font-bold text-navy-900 mb-2">Migrar 1 a 2 sesiones</h4>
            <p className="text-sm text-secundario mb-4">Efecto en LTV al incrementar la permanencia y el ticket.</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Impacto Esperado:</span>
              <span className="font-bold text-green-500">+{formatCurrency(120000)}</span>
            </div>
            <div className="text-xs text-tenue mb-4">Rango: $90k - $150k</div>
            <Button variant="primary" className="w-full">Ver Campaña</Button>
          </div>
          <div className="border border-ice-200 rounded p-4 bg-ice-50">
            <h4 className="font-bold text-navy-900 mb-2">Migrar 2 a 3 sesiones</h4>
            <p className="text-sm text-secundario mb-4">Impacto enfocado en los alumnos de nivel intermedio.</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Impacto Esperado:</span>
              <span className="font-bold text-green-500">+{formatCurrency(45000)}</span>
            </div>
            <div className="text-xs text-tenue mb-4">Rango: $30k - $60k</div>
            <Button variant="secondary" className="w-full text-blue-600 bg-white">Ver Campaña</Button>
          </div>
          <div className="border border-ice-200 rounded p-4 bg-ice-50">
            <h4 className="font-bold text-navy-900 mb-2">Reducir bajas en Nivel 3</h4>
            <p className="text-sm text-secundario mb-4">Mejorar el LTV general resolviendo el cuello de botella.</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Impacto Esperado:</span>
              <span className="font-bold text-green-500">+{formatCurrency(200000)}</span>
            </div>
            <div className="text-xs text-tenue mb-4">Rango: $150k - $250k</div>
            <Button variant="ghost" className="w-full border-ice-200 bg-white text-navy-900">Ver Acción</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
