import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { pearson, spearman } from '@/stats/correlation';
import { useDataset } from '@/data/hooks';

export default function M9_6_Correlations() {
  const dataset = useDataset();
  const [method, setMethod] = useState<'pearson' | 'spearman'>('pearson');

  const { chartData, topRelations } = useMemo(() => {
    const vars = [
      { id: 'edad', label: 'Edad' },
      { id: 'antiguedad', label: 'Antigüedad' },
      { id: 'asistencia', label: 'Asistencia' },
      { id: 'ticket', label: 'Ticket' },
      { id: 'retraso', label: 'Retraso Pago' },
    ];

    // Mock data generation for correlation to ensure some visible correlations
    const n = 100;
    const data: Record<string, number[]> = {};
    vars.forEach((v) => (data[v.id] = []));

    for (let i = 0; i < n; i++) {
      const edad = 3 + Math.random() * 10; // 3 to 13
      const antiguedad = edad * 0.5 + Math.random() * 2; // Positively correlated with age
      const asistencia = 95 - antiguedad * 1.5 + Math.random() * 10; // Negatively correlated with antiguedad
      const ticket = 800 + Math.random() * 200; // Uncorrelated
      const retraso = Math.max(0, 15 - asistencia * 0.1 + Math.random() * 5); // Slight negative correlation with asistencia

      data.edad!.push(edad);
      data.antiguedad!.push(antiguedad);
      data.asistencia!.push(asistencia);
      data.ticket!.push(ticket);
      data.retraso!.push(retraso);
    }

    const k = vars.length;
    const zData = Array.from({ length: k }, () => new Array(k).fill(1));
    const textData = Array.from({ length: k }, () => new Array(k).fill(''));
    const flatRels: { v1: string; v2: string; r: number; p: number }[] = [];

    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k; j++) {
        if (i === j) {
          zData[i]![j] = 1;
          textData[i]![j] = '1.00';
          continue;
        }

        const vi = vars[i]!.id;
        const vj = vars[j]!.id;
        const res =
          method === 'pearson' ? pearson(data[vi]!, data[vj]!) : spearman(data[vi]!, data[vj]!);

        zData[i]![j] = res.r;
        textData[i]![j] =
          `${res.r > 0 ? '+' : ''}${res.r.toFixed(2)} (p${res.p < 0.01 ? '<.01' : '=' + res.p.toFixed(2)})`;

        if (i < j) {
          flatRels.push({ v1: vars[i]!.label, v2: vars[j]!.label, r: res.r, p: res.p });
        }
      }
    }

    flatRels.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
    const topRelations = flatRels.slice(0, 3);

    const labels = vars.map((v) => v.label);

    const chartData = [
      {
        type: 'heatmap',
        z: zData,
        x: labels,
        y: labels,
        text: textData,
        texttemplate: '%{text}',
        hoverinfo: 'x+y+text',
        colorscale: 'RdBu',
        zmin: -1,
        zmax: 1,
      },
    ];

    return { chartData, topRelations };
  }, [dataset, method]);

  return (
    <LabLayout
      title="Correlaciones"
      businessQuestion="¿Qué variables se mueven juntas en mi escuela?"
      description="La correlación mide si dos variables tienden a subir juntas (positiva) o si una sube cuando la otra baja (negativa). Valores cercanos a 1 o -1 indican relaciones muy fuertes; valores cercanos a 0 indican que no hay relación."
      formulas={`Pearson r = Cov(x,y) / (σx σy)\nSpearman ρ = Pearson sobre rangos`}
      assumptions="Pearson asume relación lineal. Spearman solo asume relación monótona (útil si hay valores extremos o relaciones curvas simples)."
      findings={
        <div className="space-y-6">
          <div className="w-64 mb-4">
            <label className="block text-xs font-bold text-navy-900 mb-1">Método</label>
            <Select
              options={[
                { label: 'Pearson (Lineal)', value: 'pearson' },
                { label: 'Spearman (Rangos)', value: 'spearman' },
              ]}
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-[400px] border border-ice-200 rounded p-2">
              <PlotChart
                id="corr_heatmap"
                data={chartData as any}
                layout={{
                  margin: { l: 80, r: 20, t: 20, b: 80 },
                  xaxis: { tickangle: -45 },
                }}
                altText="Matriz de correlación"
                tableData={{ columns: [], rows: [] }}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-navy-900 border-b border-ice-200 pb-2">
                Top 3 Relaciones Más Fuertes
              </h4>
              {topRelations.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-ice-100 rounded shadow-sm text-sm"
                >
                  <div className="font-bold text-navy-900 mb-1">
                    {rel.v1} ↔ {rel.v2}
                  </div>
                  <div
                    className={`text-lg font-bold mb-1 ${rel.r > 0 ? 'text-blue-600' : 'text-coral'}`}
                  >
                    r = {rel.r > 0 ? '+' : ''}
                    {rel.r.toFixed(2)}
                  </div>
                  <div className="text-xs text-secundario mb-2">Valor p: {rel.p.toFixed(4)}</div>
                  <p className="text-xs text-navy-900 bg-ice-50 p-2 rounded">
                    {rel.r > 0
                      ? `Cuando ${rel.v1} es alto, ${rel.v2} tiende a ser alto.`
                      : `Cuando ${rel.v1} es alto, ${rel.v2} tiende a ser bajo.`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      action={
        <div className="space-y-4 text-sm text-navy-900">
          <p className="text-amber-700 bg-amber-50 p-3 rounded border border-amber-200 font-bold">
            ⚠️ Correlación NO implica causalidad.
          </p>
          <p>
            Que la edad esté correlacionada con la asistencia no significa que cumplir años te haga
            faltar menos. Podría haber una variable oculta (ej. los padres de niños más grandes
            organizan mejor su tiempo). Usa esto para generar <strong>hipótesis</strong>, no
            conclusiones definitivas.
          </p>
        </div>
      }
    />
  );
}
