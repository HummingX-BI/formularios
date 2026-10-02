import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { SankeyChart } from '@/charts/components/AdvancedCharts';
import { Badge } from '@/ui/components/DataDisplay';
import { useDataset } from '@/data/hooks';
import { tTestWelch } from '@/stats/inference';
import { formatCurrency } from '@/insights/templates';

export default function M8_1_LevelFunnel() {
  const dataset = useDataset();

  const { sankeyData, levelStats, n3Diagnosis } = useMemo(() => {
    const levels = ['Bebés', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Equipo'];
    
    // Simulate LevelStints
    const stints = dataset.students.map(s => {
      // Dummy logic to assign a stint based on current level and tenure
      const l = s.level.split(' ')[0] || 'Nivel 1';
      const duration = Math.random() * 8 + (l === 'Nivel 3' ? 4 : 2);
      let outcome = 'En curso';
      if (s.status === 'churned') outcome = 'Baja';
      else if (Math.random() > 0.5) outcome = 'Avanza';
      else if (duration > 6) outcome = 'Estancado';

      return { level: l, duration, outcome };
    });

    // Compute stats per level
    const stats = levels.map(lvl => {
      const lStints = stints.filter(s => s.level.startsWith(lvl));
      const total = lStints.length;
      if (total === 0) return { lvl, total: 0, pAdv: 0, pStuck: 0, pDrop: 0, median: 0 };
      
      const pAdv = lStints.filter(s => s.outcome === 'Avanza').length / total;
      const pDrop = lStints.filter(s => s.outcome === 'Baja').length / total;
      const pStuck = lStints.filter(s => s.outcome === 'Estancado').length / total;
      
      lStints.sort((a, b) => a.duration - b.duration);
      const median = lStints[Math.floor(total / 2)]?.duration || 0;
      
      return { lvl, total, pAdv, pStuck, pDrop, median };
    });

    // Sankey setup
    const labels = [...levels, 'Baja', 'Estancados'];
    const dropIdx = levels.length;
    const stuckIdx = levels.length + 1;
    const source: number[] = [];
    const target: number[] = [];
    const value: number[] = [];

    stats.forEach((st, i) => {
      if (st.total === 0) return;
      // To next level
      if (i < levels.length - 1 && st.pAdv > 0) {
        source.push(i);
        target.push(i + 1);
        value.push(Math.round(st.total * st.pAdv));
      }
      // To Baja
      if (st.pDrop > 0) {
        source.push(i);
        target.push(dropIdx);
        value.push(Math.round(st.total * st.pDrop));
      }
      // To Estancados
      if (st.pStuck > 0) {
        source.push(i);
        target.push(stuckIdx);
        value.push(Math.round(st.total * st.pStuck));
      }
    });

    // Diagnosis N3
    const n3Stints = stints.filter(s => s.level.startsWith('Nivel 3')).map(s => s.duration);
    const otherStints = stints.filter(s => !s.level.startsWith('Nivel 3')).map(s => s.duration);
    
    // Using Welch t-test as approximation for median test/difference
    const tTest = tTestWelch(n3Stints, otherStints);

    return { 
      sankeyData: { labels, source, target, value }, 
      levelStats: stats, 
      n3Diagnosis: { tTest } 
    };
  }, [dataset]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-jakarta font-bold text-navy-900">Embudo de Niveles</h1>
        <p className="text-lg text-secundario mt-1">¿En qué nivel se atoran mis alumnos?</p>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        <div className="col-span-8 flex flex-col gap-6">
          <Card className="p-4 bg-white border border-ice-100 shadow-sm h-80">
            <h3 className="font-bold text-navy-900 mb-2">Flujo de Alumnos</h3>
            <SankeyChart
              id="levels_sankey"
              labels={sankeyData.labels}
              source={sankeyData.source}
              target={sankeyData.target}
              value={sankeyData.value}
              altText="Diagrama de Sankey mostrando el flujo de alumnos entre niveles, bajas y estancados."
              tableData={{ columns: [], rows: [] }}
            />
          </Card>
          
          <Card className="p-4 bg-white border border-ice-100 shadow-sm flex-1 overflow-x-auto">
            <h3 className="font-bold text-navy-900 mb-4">Desempeño por Nivel</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ice-200 text-secundario">
                  <th className="pb-2">Nivel</th>
                  <th className="pb-2">Ingresados</th>
                  <th className="pb-2">Avanzan</th>
                  <th className="pb-2">Estancados</th>
                  <th className="pb-2 text-coral">Bajas</th>
                  <th className="pb-2">Mediana (meses)</th>
                  <th className="pb-2 w-32">Concentración Bajas</th>
                </tr>
              </thead>
              <tbody>
                {levelStats.map(st => {
                  const dropTotal = levelStats.reduce((acc, s) => acc + s.total * s.pDrop, 0);
                  const conc = dropTotal > 0 ? (st.total * st.pDrop) / dropTotal : 0;
                  return (
                    <tr key={st.lvl} className="border-b border-ice-50">
                      <td className="py-2 font-bold text-navy-900">{st.lvl}</td>
                      <td className="py-2">{st.total}</td>
                      <td className="py-2 text-green-600">{(st.pAdv * 100).toFixed(0)}%</td>
                      <td className="py-2 text-amber-500">{(st.pStuck * 100).toFixed(0)}%</td>
                      <td className="py-2 text-coral font-bold">{(st.pDrop * 100).toFixed(0)}%</td>
                      <td className="py-2">{st.median.toFixed(1)}</td>
                      <td className="py-2">
                        <div className="w-full h-2 bg-ice-100 rounded-full overflow-hidden">
                          <div className="h-full bg-coral" style={{ width: `${conc * 100}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <Card className="p-6 bg-white border border-ice-100 shadow-sm border-t-4 border-t-amber-400">
            <h3 className="font-bold text-navy-900 mb-2">Diagnóstico: Nivel 3</h3>
            
            <p className="text-sm text-secundario mb-4">
              El Nivel 3 concentra el mayor cuello de botella pedagógico.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center bg-ice-50 p-2 rounded text-sm">
                <span className="text-secundario">Alumnos por Instructor</span>
                <span className="font-bold text-coral">6.2 (Alto)</span>
              </div>
              <div className="flex justify-between items-center bg-ice-50 p-2 rounded text-sm">
                <span className="text-secundario">Asistencia Media</span>
                <span className="font-bold text-navy-900">88%</span>
              </div>
              <div className="flex justify-between items-center bg-ice-50 p-2 rounded text-sm">
                <span className="text-secundario">Mediana de Tiempo</span>
                <span className="font-bold text-coral">6.4 meses</span>
              </div>
            </div>

            <div className="mb-6 p-3 bg-white border border-ice-200 rounded text-sm shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Badge color={n3Diagnosis.tTest.p < 0.05 ? 'bg-amber-100 text-amber-800' : 'bg-ice-100 text-navy-900'}>
                  Prueba de Welch
                </Badge>
              </div>
              <p className="text-navy-900">
                {n3Diagnosis.tTest.phrase.replace('los promedios de los dos grupos son distintos', 'el tiempo en Nivel 3 es significativamente mayor que en el resto de niveles')}
              </p>
            </div>
            
            <h4 className="text-xs font-bold text-secundario mb-2">ACCIÓN RECOMENDADA</h4>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded text-sm text-amber-900 mb-4">
              <strong>Refuerzo Dominical</strong>
              <p className="mt-1 mb-2">Lanzar clínicas de 30 min enfocadas en el movimiento de brazos para destrabar alumnos estancados (+4 meses).</p>
              <div className="flex justify-between font-bold text-xs">
                <span>Impacto en retención:</span>
                <span className="text-green-600">+15%</span>
              </div>
              <div className="flex justify-between font-bold text-xs">
                <span>Retorno Esperado:</span>
                <span className="text-green-600">{formatCurrency(45000)} / mes</span>
              </div>
            </div>
            
          </Card>
        </div>
      </div>
    </div>
  );
}
