import { useState } from 'react';
import { ModulePage } from '@/ui/ModulePage';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { Badge } from '@/ui/components/DataDisplay';
import { BarChart } from '@/charts/components/BasicCharts';

export default function M10_1_ModelCatalog() {
  const [activeModel, setActiveModel] = useState('logistic');

  const models = [
    {
      id: 'logistic',
      name: 'Riesgo de Baja (Regresión Logística)',
      goal: 'Predecir la probabilidad de que un alumno se dé de baja en los próximos 30 días.',
      inputs: ['Edad', 'Faltas consecutivas', 'Atraso de pago', 'Meses activo'],
      method: 'Regresión Logística L2 (Penalizada)',
      metrics: [
        { name: 'AUC-ROC', value: '0.84', desc: 'Excelente discriminación' },
        { name: 'Exactitud', value: '78%', desc: 'Acierto global' }
      ],
      importance: [
        { feature: 'Faltas consecutivas', weight: 0.8 },
        { feature: 'Atraso de pago', weight: 0.5 },
        { feature: 'Meses activo', weight: -0.3 },
        { feature: 'Edad', weight: -0.1 }
      ],
      trainDate: '2026-09-15',
      limitations: 'El modelo no sabe si el alumno se mudó de ciudad. Faltan variables cualitativas (ej. quejas).',
      usedIn: ['M7.1 Riesgo de baja predictivo']
    },
    {
      id: 'km',
      name: 'Curvas de Supervivencia (Kaplan-Meier)',
      goal: 'Estimar el tiempo esperado de vida de un alumno antes de darse de baja.',
      inputs: ['Fecha de ingreso', 'Fecha de baja (si aplica)', 'Censura a la derecha'],
      method: 'Estimador no paramétrico de Kaplan-Meier',
      metrics: [
        { name: 'Log-Rank p-value', value: '0.001', desc: 'Significancia de diferencias' },
        { name: 'Vida Media', value: '8.4 meses', desc: 'Mediana poblacional' }
      ],
      importance: [], // Not applicable
      trainDate: '2026-10-01',
      limitations: 'Asume que los censurados tienen las mismas probabilidades que los que se quedan. No ajusta por múltiples covariables simultáneas (requeriría Cox).',
      usedIn: ['M7.2 Supervivencia', 'M4.5 Ticket promedio y LTV']
    },
    {
      id: 'kmeans',
      name: 'Segmentación de Familias (K-Means)',
      goal: 'Agrupar familias en clústeres con perfiles similares para personalizar el trato.',
      inputs: ['Ticket promedio', 'Asistencia %', 'Retraso promedio', 'Número de hijos'],
      method: 'K-Means clustering (K=5)',
      metrics: [
        { name: 'Coeficiente Silueta', value: '0.62', desc: 'Buena separación' },
        { name: 'Inercia (SSE)', value: '14,250', desc: 'Suma de cuadrados' }
      ],
      importance: [
        { feature: 'Ticket', weight: 0.9 },
        { feature: 'Asistencia', weight: 0.7 },
        { feature: 'Retraso', weight: 0.6 }
      ],
      trainDate: '2026-10-01',
      limitations: 'Sensible a valores atípicos. Asume clústeres esféricos. Requiere elegir K artificialmente.',
      usedIn: ['M10.2 Segmentación de familias']
    },
    {
      id: 'holt',
      name: 'Pronóstico de Demanda (Holt-Winters)',
      goal: 'Proyectar ingresos e inscripciones a futuro considerando tendencia y estacionalidad.',
      inputs: ['Serie histórica mensual (36 meses)'],
      method: 'Suavizamiento Exponencial Triple (Multiplicativo)',
      metrics: [
        { name: 'MAPE', value: '8.5%', desc: 'Error Porcentual Absoluto Medio' },
        { name: 'RMSE', value: '1,200', desc: 'Raíz del Error Cuadrático Medio' }
      ],
      importance: [],
      trainDate: '2026-10-01',
      limitations: 'El pasado no siempre predice el futuro (ej. una pandemia rompe el modelo). Asume que la estacionalidad es constante.',
      usedIn: ['M10.3 Pronóstico']
    },
    {
      id: 'montecarlo',
      name: 'Simulación Monte Carlo',
      goal: 'Estimar la probabilidad de alcanzar la meta de ingresos en escenarios de incertidumbre.',
      inputs: ['Distribuciones de retención, captación, ticket'],
      method: 'Caminata aleatoria con distribuciones Beta/Normal (10,000 iteraciones)',
      metrics: [
        { name: 'Probabilidad Meta', value: '68%', desc: '% trayectorias exitosas' },
        { name: 'VaR 95%', value: '$45,000', desc: 'Riesgo de cola' }
      ],
      importance: [
        { feature: 'Tasa de retención', weight: 0.85 },
        { feature: 'Captación de prospectos', weight: 0.60 }
      ],
      trainDate: 'Tiempo real',
      limitations: 'La calidad del resultado depende enteramente de la precisión de las distribuciones de entrada ("garbage in, garbage out").',
      usedIn: ['M10.4 Simulación']
    }
  ];

  const model = models.find(m => m.id === activeModel)!;

  return (
    <ModulePage module={ { id: 'M10.1', categoryId: 10, title: 'Catálogo de Modelos', level: 'S', route: '', icon: '', shortDescription: '', businessQuestion: '¿Qué modelos están corriendo detrás de mi escuela?', component: null as any } }>
      <div className="space-y-6 flex flex-col h-full overflow-auto pr-2 pb-6">
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg flex items-start gap-4">
          <div className="text-3xl">🤖</div>
          <div>
            <h3 className="font-bold text-sky-900 mb-1">Centro de Transparencia Algorítmica</h3>
            <p className="text-sm text-sky-800">
              Pantera no es una caja negra. Aquí puedes auditar los modelos matemáticos que están tomando decisiones, sus limitaciones y su nivel de precisión real.
              <Badge color="bg-sky-200 text-sky-900 ml-2">Datos Ilustrativos</Badge>
            </p>
          </div>
        </div>

        <div className="w-80">
          <label className="block text-xs font-bold text-navy-900 mb-1">Seleccionar Modelo</label>
          <Select 
            options={models.map(m => ({ label: m.name, value: m.id }))}
            value={activeModel}
            onChange={e => setActiveModel(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <Card className="p-5 border border-ice-200">
              <h4 className="font-bold text-navy-900 text-lg mb-4">{model.name}</h4>
              
              <div className="space-y-4 text-sm text-navy-900">
                <div>
                  <strong className="block text-secundario text-xs uppercase mb-1">Objetivo de Negocio</strong>
                  <p>{model.goal}</p>
                </div>
                
                <div>
                  <strong className="block text-secundario text-xs uppercase mb-1">Metodología</strong>
                  <p>{model.method}</p>
                </div>

                <div>
                  <strong className="block text-secundario text-xs uppercase mb-1">Variables de Entrada (Inputs)</strong>
                  <ul className="list-disc pl-5">
                    {model.inputs.map(input => <li key={input}>{input}</li>)}
                  </ul>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-4 border border-ice-200">
                <strong className="block text-secundario text-xs uppercase mb-3">Métricas de Calidad</strong>
                <div className="space-y-4">
                  {model.metrics.map(metric => (
                    <div key={metric.name} className="flex justify-between items-center border-b border-ice-50 pb-2">
                      <div>
                        <div className="font-bold text-navy-900">{metric.name}</div>
                        <div className="text-[10px] text-secundario">{metric.desc}</div>
                      </div>
                      <div className="text-xl font-mono text-sky-700">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 border border-ice-200">
                <strong className="block text-secundario text-xs uppercase mb-3">Limitaciones y Riesgos</strong>
                <p className="text-sm text-amber-800 bg-amber-50 p-3 rounded">
                  {model.limitations}
                </p>
                
                <div className="mt-4">
                  <strong className="block text-secundario text-xs uppercase mb-1">Último entrenamiento</strong>
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded text-gray-700">{model.trainDate}</div>
                </div>
              </Card>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            {model.importance.length > 0 && (
              <Card className="p-4 border border-ice-200">
                <strong className="block text-secundario text-xs uppercase mb-3">Importancia de Variables</strong>
                <div className="h-48">
                  <BarChart
                    id={`imp_${model.id}`}
                    x={model.importance.map(i => i.feature)}
                    series={[{ name: 'Peso', y: model.importance.map(i => Math.abs(i.weight)) }]}
                    altText="Importancia de variables"
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
                <p className="text-xs text-secundario mt-2">
                  Peso absoluto de cada factor en la decisión del modelo.
                </p>
              </Card>
            )}

            <Card className="p-4 border border-ice-200 bg-navy-900 text-white">
              <strong className="block text-ice-200 text-xs uppercase mb-3">Ejemplo Explicado</strong>
              {model.id === 'logistic' && (
                <div className="text-sm space-y-2">
                  <p><strong>Alumno:</strong> Juan Pérez</p>
                  <p><strong>Riesgo Predicho:</strong> 85%</p>
                  <p className="border-t border-navy-700 pt-2 text-ice-100 text-xs">
                    ¿Por qué? Juan tiene 2 faltas consecutivas (+40%), 1 mes de atraso (+30%) y solo 2 meses de antigüedad (+15%). Su edad (8) reduce ligeramente el riesgo (-5%). Total ponderado procesado por la función sigmoide = 85%.
                  </p>
                </div>
              )}
              {model.id !== 'logistic' && (
                <div className="text-sm italic text-ice-200">
                  Selecciona el modelo de Riesgo de Baja para ver un ejemplo detallado a nivel de registro.
                </div>
              )}
            </Card>

            <Card className="p-4 border border-ice-200">
              <strong className="block text-secundario text-xs uppercase mb-3">Módulos que lo usan</strong>
              <div className="flex flex-wrap gap-2">
                {model.usedIn.map(m => (
                  <Badge key={m} color="bg-ice-100 text-navy-800 border border-ice-200">{m}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ModulePage>
  );
}
