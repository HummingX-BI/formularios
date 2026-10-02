import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import { 
  tTestWelch, zTestTwoProportions, 
  confIntervalMean, confIntervalProportionWilson, 
  cohensD, cohensH
} from '@/stats/inference';
import { mean } from '@/stats/descriptive';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';

type MetricType = 'mean' | 'proportion';

export default function M9_5_Inference() {
  const dataset = useDataset();
  const [metric, setMetric] = useState('ticket');
  const [compare, setCompare] = useState('instructors');

  const { data, result, chart, type, m1, m2, effectSize } = useMemo(() => {
    let type: MetricType = 'mean';
    let vals1: number[] = [];
    let vals2: number[] = [];
    let n1 = 0, n2 = 0, k1 = 0, k2 = 0;
    
    // Split into 2 groups randomly but deterministically for the demo
    const g1 = dataset.students.filter(s => s.id.charCodeAt(0) % 2 === 0);
    const g2 = dataset.students.filter(s => s.id.charCodeAt(0) % 2 !== 0);
    
    const label1 = compare === 'instructors' ? 'Mariana' : 'Matutino';
    const label2 = compare === 'instructors' ? 'Ricardo' : 'Vespertino';

    if (metric === 'ticket') {
      type = 'mean';
      vals1 = g1.map(() => 800 + Math.random() * 400);
      vals2 = g2.map(() => 750 + Math.random() * 400);
    } else if (metric === 'tiempo') {
      type = 'mean';
      vals1 = g1.map(() => 4 + Math.random() * 12);
      vals2 = g2.map(() => 3 + Math.random() * 12);
    } else if (metric === 'retencion') {
      type = 'proportion';
      n1 = g1.length;
      n2 = g2.length;
      k1 = Math.round(n1 * 0.65);
      k2 = Math.round(n2 * 0.45);
    } else if (metric === 'conversion') {
      type = 'proportion';
      n1 = 120; n2 = 140;
      k1 = 45; k2 = 30;
    }

    let statResult;
    let m1Val, m2Val, ci1: [number, number], ci2: [number, number], effectSize;

    if (type === 'mean') {
      m1Val = mean(vals1);
      m2Val = mean(vals2);
      ci1 = confIntervalMean(vals1);
      ci2 = confIntervalMean(vals2);
      statResult = tTestWelch(vals1, vals2);
      effectSize = cohensD(vals1, vals2);
    } else {
      m1Val = k1 / n1;
      m2Val = k2 / n2;
      ci1 = confIntervalProportionWilson(k1, n1);
      ci2 = confIntervalProportionWilson(k2, n2);
      statResult = zTestTwoProportions(k1, n1, k2, n2);
      effectSize = cohensH(m1Val, m2Val);
    }

    const chartData = [
      {
        type: 'bar',
        x: [label1, label2],
        y: [m1Val, m2Val],
        error_y: {
          type: 'data',
          symmetric: false,
          array: [ci1[1] - m1Val, ci2[1] - m2Val],
          arrayminus: [m1Val - ci1[0], m2Val - ci2[0]],
          color: '#0F172A',
          thickness: 2,
          width: 6
        },
        marker: { color: ['#2FB6D4', '#7CC4E8'] }
      }
    ];

    return { 
      data: { label1, label2, ci1, ci2 }, 
      result: statResult, 
      chart: chartData, 
      type, 
      m1: m1Val, 
      m2: m2Val,
      effectSize
    };
  }, [dataset, metric, compare]);

  const isSig = result.p < 0.05;

  return (
    <LabLayout
      title="Intervalos y Pruebas de Hipótesis"
      businessQuestion="¿Esta diferencia es real o puede ser azar?"
      description="Una prueba de hipótesis evalúa si la diferencia observada entre dos grupos es lo suficientemente grande como para no ser una simple coincidencia. Los intervalos de confianza muestran dónde se encuentra el valor real con 95% de seguridad."
      formulas={`IC Proporción: p ± Z √(p(1-p)/n)\nPrueba T Welch: t = (x1 - x2) / √(s1²/n1 + s2²/n2)`}
      findings={
        <div className="space-y-6">
          <div className="flex gap-4 mb-4 bg-ice-50 p-2 rounded">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-navy-900 mb-1">Métrica</label>
              <Select 
                options={[
                  {label: 'Ticket Promedio (Media)', value: 'ticket'},
                  {label: 'Tiempo en Nivel (Media)', value: 'tiempo'},
                  {label: 'Retención a 6 Meses (Proporción)', value: 'retencion'},
                  {label: 'Conversión (Proporción)', value: 'conversion'}
                ]}
                value={metric}
                onChange={e => setMetric(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-navy-900 mb-1">Comparar</label>
              <Select 
                options={[
                  {label: 'Instructor A vs B', value: 'instructors'},
                  {label: 'Turno Matutino vs Vespertino', value: 'turnos'}
                ]}
                value={compare}
                onChange={e => setCompare(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 border border-ice-200 rounded p-2">
              <PlotChart
                id="inf_chart"
                data={chart as any}
                layout={{ 
                  margin: { l: 40, r: 20, t: 10, b: 30 },
                  yaxis: { tickformat: type === 'proportion' ? '.0%' : '' }
                }}
                altText="Gráfico de barras con intervalos de confianza"
                tableData={{ columns: [], rows: [] }}
              />
            </div>
            
            <div className="flex flex-col gap-4 justify-center">
              <div className={`p-4 rounded border ${isSig ? 'bg-green-50 border-green-200 text-green-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isSig ? (
                    <Badge color="bg-green-500 text-white">Diferencia Significativa</Badge>
                  ) : (
                    <Badge color="bg-gray-400 text-white">Atribuible al azar</Badge>
                  )}
                </div>
                <p className="font-bold mb-1">{result.phrase}</p>
              </div>

              <Card className="p-3 bg-white border border-ice-100 shadow-sm text-sm">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-ice-50">
                      <th className="py-1 text-secundario">Valor p (P-value)</th>
                      <td className="py-1 font-mono">{result.p.toFixed(4)}</td>
                    </tr>
                    <tr className="border-b border-ice-50">
                      <th className="py-1 text-secundario">Estadístico ({type === 'mean' ? 't' : 'Z'})</th>
                      <td className="py-1">{result.stat.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-ice-50">
                      <th className="py-1 text-secundario">Tamaño del Efecto</th>
                      <td className="py-1">{effectSize?.toFixed(2)} {Math.abs(effectSize || 0) > 0.8 ? '(Grande)' : Math.abs(effectSize || 0) > 0.5 ? '(Medio)' : '(Pequeño)'}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border border-ice-100 rounded bg-white shadow-sm text-sm text-center">
              <div className="text-secundario font-bold mb-1">{data.label1}</div>
              <div className="text-xl text-navy-900 mb-1">{type === 'proportion' ? (m1*100).toFixed(1)+'%' : m1.toFixed(1)}</div>
              <div className="text-xs text-secundario">
                IC 95%: [{type === 'proportion' ? (data.ci1[0]*100).toFixed(1) : data.ci1[0].toFixed(1)}, {type === 'proportion' ? (data.ci1[1]*100).toFixed(1) : data.ci1[1].toFixed(1)}]
              </div>
            </div>
            <div className="p-3 border border-ice-100 rounded bg-white shadow-sm text-sm text-center">
              <div className="text-secundario font-bold mb-1">{data.label2}</div>
              <div className="text-xl text-navy-900 mb-1">{type === 'proportion' ? (m2*100).toFixed(1)+'%' : m2.toFixed(1)}</div>
              <div className="text-xs text-secundario">
                IC 95%: [{type === 'proportion' ? (data.ci2[0]*100).toFixed(1) : data.ci2[0].toFixed(1)}, {type === 'proportion' ? (data.ci2[1]*100).toFixed(1) : data.ci2[1].toFixed(1)}]
              </div>
            </div>
          </div>

        </div>
      }
      action={
        <div className="space-y-4 text-sm text-navy-900">
          <p>
            <strong>Si es significativo:</strong> La diferencia es real y debes actuar. Si el Instructor A retiene mejor, úsalo como mentor. 
          </p>
          <p>
            <strong>Si no es significativo:</strong> No tomes decisiones drásticas. Castigar o premiar a alguien por una diferencia que es atribuible a la suerte (ruido aleatorio) destruye la moral del equipo.
          </p>
        </div>
      }
    />
  );
}
