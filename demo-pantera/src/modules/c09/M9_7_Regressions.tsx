import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { Select } from '@/ui/components/Inputs';
import { ScatterRegression } from '@/charts/components/AdvancedCharts';
import { PlotChart } from '@/charts/PlotChart';
import { simpleLinearRegression, polynomialRegression2, ols } from '@/stats/regression';
import { useDataset } from '@/data/hooks';
import { Card } from '@/ui/components/Cards';

export default function M9_7_Regressions() {
  const dataset = useDataset();
  const [modelType, setModelType] = useState<'linear' | 'quad' | 'multiple'>('linear');

  const { linear, quad, multiple, residualsData, interpretation } = useMemo(() => {
    // Generate mock data closely aligned with the business case

    // 1. Linear (Clases 1er mes vs Permanencia truncada)
    const n = 150;
    const xLin = [];
    const yLin = [];
    for (let i = 0; i < n; i++) {
      const clases = 1 + Math.random() * 7; // 1 to 8 classes
      const noise = (Math.random() - 0.5) * 4;
      let permanencia = 2 + clases * 1.2 + noise;
      if (permanencia > 12) permanencia = 12; // truncated
      if (permanencia < 1) permanencia = 1;

      // Jitter
      xLin.push(clases + (Math.random() - 0.5) * 0.2);
      yLin.push(permanencia);
    }
    const linModel = simpleLinearRegression(xLin, yLin);
    const lineXLin = [1, 2, 3, 4, 5, 6, 7, 8];
    const lineYLin: number[] = [];
    const lowerYLin: number[] = [];
    const upperYLin: number[] = [];
    lineXLin.forEach((x) => {
      const p = linModel.predict(x);
      lineYLin.push(p.fit);
      lowerYLin.push(p.confBand[0]);
      upperYLin.push(p.confBand[1]);
    });

    // 2. Quadratic (Edad vs Prop bajas 6 meses)
    const xQuad = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const yQuad = xQuad.map((age) => {
      // U-shape, minimum around 8
      return 0.4 - 0.08 * age + 0.005 * age * age + (Math.random() - 0.5) * 0.05;
    });
    const sizes = xQuad.map(() => 20 + Math.random() * 80); // bubbles
    const quadModel = polynomialRegression2(xQuad, yQuad);

    const lineXQuad = [];
    const lineYQuad = [];
    for (let i = 3; i <= 12; i += 0.5) {
      lineXQuad.push(i);
      lineYQuad.push(
        quadModel.coefficients[0]! +
          quadModel.coefficients[1]! * i +
          quadModel.coefficients[2]! * i * i,
      );
    }

    // 3. Multiple
    // y = b0 + b1*clases + b2*edad + b3*atraso
    const XMult = [];
    const yMult = [];
    for (let i = 0; i < 200; i++) {
      const clases = 1 + Math.random() * 7;
      const edad = 3 + Math.random() * 9;
      const atraso = Math.random() * 5;

      let permanencia = 2 + clases * 0.8 + edad * 0.2 - atraso * 0.5 + (Math.random() - 0.5) * 3;
      if (permanencia > 12) permanencia = 12;

      XMult.push([1, clases, edad, atraso]); // with intercept
      yMult.push(permanencia);
    }
    const multModel = ols(XMult, yMult);

    // Select active model for residuals
    let currentModel: any;
    if (modelType === 'linear') currentModel = linModel;
    else if (modelType === 'quad') currentModel = quadModel;
    else currentModel = multModel;

    const resFitted = currentModel.fitted;
    const resVals = currentModel.residuals;

    const residualsData = [
      {
        type: 'scatter',
        mode: 'markers',
        x: resFitted,
        y: resVals,
        marker: { color: '#64748B', size: 5, opacity: 0.6 },
        name: 'Residuales',
      },
      {
        type: 'line',
        x: [Math.min(...resFitted), Math.max(...resFitted)],
        y: [0, 0],
        line: { color: '#F43F5E', dash: 'dash' },
        name: 'Cero',
      },
    ];

    let interp = '';
    if (modelType === 'linear') {
      interp = `Por cada clase adicional asistida en el primer mes, el alumno se queda en promedio ${linModel.coefficients[1]!.toFixed(2)} meses más. (R² = ${(linModel.rSquared * 100).toFixed(1)}%)`;
    } else if (modelType === 'quad') {
      interp = `El riesgo de baja tiene forma de U. La edad de menor riesgo (el vértice) es a los ${quadModel.vertexX.toFixed(1)} años. Antes y después de esa edad, el riesgo aumenta.`;
    } else {
      interp = `El modelo múltiple explica el ${(multModel.rSquared * 100).toFixed(1)}% de la variación en permanencia tomando en cuenta todos los factores a la vez.`;
    }

    return {
      linear: {
        x: xLin,
        y: yLin,
        lx: lineXLin,
        ly: lineYLin,
        uy: upperYLin,
        lw: lowerYLin,
        eq: `Y = ${linModel.coefficients[0]!.toFixed(2)} + ${linModel.coefficients[1]!.toFixed(2)}X`,
      },
      quad: {
        x: xQuad,
        y: yQuad,
        sizes,
        lx: lineXQuad,
        ly: lineYQuad,
        vX: quadModel.vertexX,
        vY: quadModel.vertexY,
      },
      multiple: { model: multModel },
      residualsData,
      interpretation: interp,
    };
  }, [dataset, modelType]);

  return (
    <LabLayout
      title="Regresiones"
      businessQuestion="¿Qué factores explican cuánto se queda un alumno y cómo se comportan?"
      description="La regresión aísla el peso matemático de una o varias variables sobre un resultado (permanencia). Responde preguntas de impacto: 'Si la asistencia sube 1 punto, ¿cuánto sube la permanencia?'"
      formulas={`Lineal: Y = β0 + β1X + ε\nCuadrática: Y = β0 + β1X + β2X² + ε`}
      assumptions="Mínimos Cuadrados Ordinarios (OLS). Asume que los errores son independientes, se distribuyen normalmente y tienen varianza constante (homocedasticidad). Revisa la gráfica de residuales: debe verse como una nube sin patrón."
      findings={
        <div className="space-y-6">
          <div className="w-64 mb-4">
            <label className="block text-xs font-bold text-navy-900 mb-1">Modelo</label>
            <Select
              options={[
                { label: 'Lineal (H12: Clases Mes 1)', value: 'linear' },
                { label: 'Cuadrática (H11: Edad vs Riesgo)', value: 'quad' },
                { label: 'Múltiple (Todas las variables)', value: 'multiple' },
              ]}
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
            />
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 border border-ice-200 rounded p-4 h-96 flex flex-col">
              <h4 className="font-bold text-navy-900 text-center mb-2">
                {modelType === 'linear' && 'Impacto de Clases Iniciales en Permanencia'}
                {modelType === 'quad' && 'Efecto Curvo de la Edad en el Riesgo de Baja'}
                {modelType === 'multiple' && 'Contribución Simultánea de Factores'}
              </h4>

              {modelType === 'linear' && (
                <div className="flex-1">
                  <ScatterRegression
                    id="lin_reg"
                    x={linear.x}
                    y={linear.y}
                    lineX={linear.lx}
                    lineY={linear.ly}
                    upperY={linear.uy}
                    lowerY={linear.lw}
                    altText="Regresión lineal simple"
                    tableData={{ columns: [], rows: [] }}
                  />
                  <div className="text-center text-xs font-mono font-bold mt-2 text-secundario">
                    {linear.eq}
                  </div>
                </div>
              )}

              {modelType === 'quad' && (
                <div className="flex-1">
                  <PlotChart
                    id="quad_reg"
                    data={
                      [
                        {
                          type: 'scatter',
                          mode: 'markers',
                          x: quad.x,
                          y: quad.y,
                          marker: {
                            size: quad.sizes,
                            sizemode: 'area',
                            sizeref: 2,
                            color: '#7CC4E8',
                            opacity: 0.6,
                          },
                          name: 'Grupos por Edad',
                        },
                        {
                          type: 'scatter',
                          mode: 'lines',
                          x: quad.lx,
                          y: quad.ly,
                          line: { color: '#0B2A47', width: 3 },
                          name: 'Ajuste Cuadrático',
                        },
                        {
                          type: 'scatter',
                          mode: 'markers',
                          x: [quad.vX],
                          y: [quad.vY],
                          marker: { size: 10, color: '#F43F5E', symbol: 'star' },
                          name: 'Edad Óptima (Vértice)',
                        },
                      ] as any
                    }
                    layout={{ margin: { l: 40, r: 20, t: 10, b: 30 } }}
                    altText="Regresión cuadrática con burbujas"
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
              )}

              {modelType === 'multiple' && (
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-ice-200">
                        <th className="py-2">Factor</th>
                        <th className="py-2 text-right">Coeficiente (Impacto)</th>
                        <th className="py-2 text-right">Error Est.</th>
                        <th className="py-2 text-right">Valor p</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-ice-50">
                        <td className="py-2 text-secundario">(Intercepto)</td>
                        <td className="py-2 text-right font-mono">
                          {multiple.model.coefficients[0]!.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">
                          {multiple.model.stdErrors[0]!.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">{multiple.model.pValues[0]!.toFixed(4)}</td>
                      </tr>
                      <tr className="border-b border-ice-50">
                        <td className="py-2 font-bold text-navy-900">Clases 1er Mes</td>
                        <td className="py-2 text-right font-mono text-green-600">
                          +{multiple.model.coefficients[1]!.toFixed(2)} meses
                        </td>
                        <td className="py-2 text-right">
                          {multiple.model.stdErrors[1]!.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">{multiple.model.pValues[1]!.toFixed(4)}</td>
                      </tr>
                      <tr className="border-b border-ice-50">
                        <td className="py-2 font-bold text-navy-900">Edad (años)</td>
                        <td className="py-2 text-right font-mono text-green-600">
                          +{multiple.model.coefficients[2]!.toFixed(2)} meses
                        </td>
                        <td className="py-2 text-right">
                          {multiple.model.stdErrors[2]!.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">{multiple.model.pValues[2]!.toFixed(4)}</td>
                      </tr>
                      <tr className="border-b border-ice-50">
                        <td className="py-2 font-bold text-navy-900">Atraso Promedio</td>
                        <td className="py-2 text-right font-mono text-coral">
                          {multiple.model.coefficients[3]!.toFixed(2)} meses
                        </td>
                        <td className="py-2 text-right">
                          {multiple.model.stdErrors[3]!.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">{multiple.model.pValues[3]!.toFixed(4)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4 text-xs text-secundario bg-ice-50 p-2 rounded">
                    <strong>Nota:</strong> Los p-values indican significancia. La regresión múltiple
                    aísla el efecto: "A igualdad de edad y atraso, cada clase del mes 1 suma X meses
                    de vida".
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-4 flex flex-col gap-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded text-sm text-amber-900">
                <strong>Interpretación Directa:</strong>
                <br />
                {interpretation}
              </div>

              <Card className="p-4 bg-white border border-ice-100 shadow-sm flex-1">
                <h4 className="font-bold text-navy-900 text-xs text-center mb-2 uppercase">
                  Diagnóstico: Residuales
                </h4>
                <div className="h-40">
                  <PlotChart
                    id="residuals"
                    data={residualsData as any}
                    layout={{
                      margin: { l: 30, r: 10, t: 10, b: 20 },
                      xaxis: { title: 'Predicción' },
                      yaxis: { title: 'Error' },
                    }}
                    altText="Gráfico de residuales vs ajustados"
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
                <div className="text-[10px] text-secundario mt-2 text-center">
                  Si hay forma de embudo, viola homocedasticidad.
                </div>
              </Card>
            </div>
          </div>
        </div>
      }
      action={
        <div className="space-y-4 text-sm text-navy-900">
          <p>
            <strong>Cuidado con el Truncamiento:</strong> En el modelo lineal usamos alumnos
            recientes limitados a 12 meses. Esto "aplasta" la curva al final (censura a la derecha).
            Los modelos OLS estándar subestiman el efecto si hay mucha censura; en Pantera avanzada,
            esto se soluciona migrando a modelos de Supervivencia de Cox (ver módulo M7.2).
          </p>
        </div>
      }
    />
  );
}
