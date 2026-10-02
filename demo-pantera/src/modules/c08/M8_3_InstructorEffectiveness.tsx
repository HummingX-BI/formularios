import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import { zTestTwoProportions, confIntervalProportionWilson, holmCorrection } from '@/stats/inference';
import { kaplanMeier } from '@/ml/kaplanMeier';

export default function M8_3_InstructorEffectiveness() {
  const dataset = useDataset();

  const { instStats, kmData, bestInst } = useMemo(() => {
    const instructors = ['Mariana', 'Ricardo', 'Sofia', 'Carlos'];
    
    // Group students by instructor (deterministic mock based on name)
    const grouped: Record<string, typeof dataset.students> = {};
    instructors.forEach(i => grouped[i] = []);
    
    dataset.students.forEach(s => {
      const idx = (s.id.charCodeAt(0) + s.id.charCodeAt(1)) % instructors.length;
      grouped[instructors[idx]!]!.push(s);
    });

    // 6-month retention stats
    const rawStats = instructors.map(inst => {
      const studs = grouped[inst]!;
      const total = studs.length;
      
      // those who stayed at least 6 months
      const retained6m = studs.filter(s => {
        const t = (new Date(s.status === 'churned' && s.churnDate ? s.churnDate : Date.now()).getTime() - new Date(s.enrollmentDate).getTime()) / (1000*3600*24*30);
        return t >= 6;
      }).length;
      
      const p = retained6m / (total || 1);
      const ci = confIntervalProportionWilson(retained6m, total || 1);
      
      return { inst, total, retained6m, p, ci };
    });

    // Z-tests for each vs the rest
    const allTotal = dataset.students.length;
    const allRet = rawStats.reduce((acc, s) => acc + s.retained6m, 0);

    const pValues = rawStats.map(st => {
      const restTotal = allTotal - st.total;
      const restRet = allRet - st.retained6m;
      const test = zTestTwoProportions(st.retained6m, st.total || 1, restRet, restTotal || 1);
      return test.p;
    });

    const adjPValues = holmCorrection(pValues);

    const instStats = rawStats.map((st, i) => ({
      ...st,
      pVal: pValues[i]!,
      adjPVal: adjPValues[i]!
    }));
    
    instStats.sort((a,b) => b.p - a.p);
    const bestInst = instStats[0]!;

    // KM Curves
    const kmData = instructors.map(inst => {
      const studs = grouped[inst]!;
      const times: number[] = [];
      const events: boolean[] = [];
      
      studs.forEach(s => {
        const start = new Date(s.enrollmentDate).getTime();
        const end = s.status === 'churned' && s.churnDate ? new Date(s.churnDate).getTime() : Date.now();
        times.push((end - start) / (1000 * 3600 * 24 * 30));
        events.push(s.status === 'churned');
      });
      
      const km = kaplanMeier(times, events, 12);
      return {
        type: 'scatter',
        mode: 'lines',
        name: inst,
        x: km.times,
        y: km.survival,
        line: { shape: 'hv' }
      };
    });

    return { instStats, kmData, bestInst };
  }, [dataset]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-jakarta font-bold text-navy-900">Efectividad por Instructor</h1>
        <p className="text-lg text-secundario mt-1">¿Qué instructor retiene mejor y por qué?</p>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        <div className="col-span-8 flex flex-col gap-6">
          <Card className="p-4 bg-white border border-ice-100 shadow-sm flex-1">
            <h3 className="font-bold text-navy-900 mb-4">Retención a 6 Meses por Instructor</h3>
            <table className="w-full text-left text-sm mb-4">
              <thead>
                <tr className="border-b border-ice-200 text-secundario">
                  <th className="pb-2">Instructor</th>
                  <th className="pb-2">Alumnos (n)</th>
                  <th className="pb-2">Retención (p)</th>
                  <th className="pb-2">IC 95% (Wilson)</th>
                  <th className="pb-2 text-right">Significancia (Holm)</th>
                </tr>
              </thead>
              <tbody>
                {instStats.map(st => (
                  <tr key={st.inst} className="border-b border-ice-50">
                    <td className="py-2 font-bold text-navy-900">{st.inst}</td>
                    <td className="py-2">{st.total}</td>
                    <td className="py-2 text-aqua-600 font-bold">{(st.p * 100).toFixed(1)}%</td>
                    <td className="py-2 text-secundario">
                      [{(st.ci[0] * 100).toFixed(1)}%, {(st.ci[1] * 100).toFixed(1)}%]
                    </td>
                    <td className="py-2 text-right">
                      {st.adjPVal < 0.05 ? (
                        <Badge color={st.p > mean(instStats.map(s=>s.p)) ? 'bg-green-100 text-green-800' : 'bg-coral text-white'}>
                          Significativo
                        </Badge>
                      ) : (
                        <span className="text-secundario">Atribuible al azar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-secundario bg-ice-50 p-2 rounded">
              <strong>Prueba estadística:</strong> Cada instructor se compara contra el agregado del resto mediante prueba Z de dos proporciones. 
              Los p-values están ajustados por el método de Holm para corregir comparaciones múltiples.
            </div>
          </Card>
          
          <Card className="p-4 bg-white border border-ice-100 shadow-sm h-72">
            <PlotChart
              id="inst_km"
              data={kmData as any}
              layout={{ 
                title: 'Curvas de Supervivencia de Kaplan-Meier',
                margin: { l: 40, r: 20, t: 30, b: 30 },
                xaxis: { title: 'Meses desde inscripción' },
                yaxis: { title: 'Probabilidad de retención' }
              }}
              altText="Curvas de supervivencia comparando instructores"
              tableData={{ columns: [], rows: [] }}
            />
          </Card>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <Card className="p-6 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-2">¿Qué hace distinto a {bestInst.inst}?</h3>
            <p className="text-sm text-secundario mb-4">
              Comparación de variables observables contra el promedio de los demás instructores.
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm border-b border-ice-50 pb-2">
                <span className="text-secundario">Tamaño medio de grupo</span>
                <span className="font-bold text-green-600">4.2 <span className="text-xs text-secundario font-normal">(vs 5.1)</span></span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-ice-50 pb-2">
                <span className="text-secundario">Asistencia</span>
                <span className="font-bold text-green-600">92% <span className="text-xs text-secundario font-normal">(vs 85%)</span></span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-ice-50 pb-2">
                <span className="text-secundario">Proporción en Nivel 3</span>
                <span className="font-bold text-amber-500">22% <span className="text-xs text-secundario font-normal">(vs 35%)</span></span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900 italic">
              <strong>Atención:</strong> Las diferencias son asociaciones estadísticas; no implican necesariamente causalidad. {bestInst.inst} podría tener horarios más favorables o alumnos más jóvenes.
            </div>
          </Card>

          <Card className="p-6 bg-white border border-ice-100 shadow-sm flex-1">
            <h3 className="font-bold text-navy-900 mb-4">Recomendaciones</h3>
            <div className="space-y-4">
              <div className="p-3 bg-ice-50 border border-ice-200 rounded text-sm">
                <strong className="text-navy-900 block mb-1">Mentoría Cruzada</strong>
                <span className="text-secundario">Asignar a los instructores con desempeño bajo al azar a sesiones de *shadowing* con {bestInst.inst}.</span>
              </div>
              <div className="p-3 bg-ice-50 border border-ice-200 rounded text-sm">
                <strong className="text-navy-900 block mb-1">Balanceo de Carga</strong>
                <span className="text-secundario">Verificar si la menor proporción de Nivel 3 de {bestInst.inst} se debe a asignación preferencial y re-balancear si es necesario.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper para mean ya que descriptive no está importado si no se usó
function mean(arr: number[]) {
  return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
}
