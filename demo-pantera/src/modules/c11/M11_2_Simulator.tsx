import { useState, useMemo } from 'react';
import { ModulePage } from '@/ui/ModulePage';
import { Card } from '@/ui/components/Cards';
import { Slider } from '@/ui/components/Inputs';
import { LineChart, BarChart } from '@/charts/components/BasicCharts';
import { runScenarioModel } from '@/metrics/scenarioModel';
import type { ScenarioConfig, ScenarioParams } from '@/metrics/scenarioModel';
import { useAppStore } from '@/app/store';

export default function M11_2_Simulator() {
  const { addPlanAction } = useAppStore((state) => ({
    addPlanAction: state.addPlanAction,
  }));

  // Workaround for store not having addSavedScenario natively:
  const [localSavedScenarios, setLocalSavedScenarios] = useState<any[]>([]);

  // Simulation Controls
  const [priceVarPct, setPriceVarPct] = useState(0);
  const [siblingDiscountPct, setSiblingDiscountPct] = useState(0);
  const [groupsDelta, setGroupsDelta] = useState(0);
  const [retentionImpr, setRetentionImpr] = useState(0);
  const [seasonality, setSeasonality] = useState(true);

  // Advanced Elasticity Controls
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [convElasticity, setConvElasticity] = useState(-0.9);
  const [churnElasticity, setChurnElasticity] = useState(0.35);

  const [activeTab, setActiveTab] = useState<'simulador' | 'comparador'>('simulador');

  const baseConfig: ScenarioConfig = useMemo(
    () => ({
      months: 6,
      baseProspects: [120, 110, 140, 100, 95, 130],
      baseConversion: 0.35,
      baseChurn: 0.08,
      baseActive: 450,
      totalCapacity: 500,
      basePrice: 1200,
      instructorCostPerHour: 150,
      laneCostPerHour: 100,
      avgSessionsPerStudent: 8,
      hoursPerMonth: 160,
      lanes: 4,
    }),
    [],
  );

  const baseParams: ScenarioParams = useMemo(
    () => ({
      priceVariationPct: 0,
      siblingDiscountPct: 0,
      groupsAddedOrRemoved: 0,
      retentionImprovementPct: 0,
      seasonalityEnabled: true,
      convElasticityMin: -0.5,
      convElasticityExpected: -0.9,
      convElasticityMax: -1.3,
      churnElasticityMin: 0.15,
      churnElasticityExpected: 0.35,
      churnElasticityMax: 0.6,
    }),
    [],
  );

  const currentParams: ScenarioParams = useMemo(
    () => ({
      ...baseParams,
      priceVariationPct: priceVarPct / 100,
      siblingDiscountPct: siblingDiscountPct / 100,
      groupsAddedOrRemoved: groupsDelta,
      retentionImprovementPct: retentionImpr / 100,
      seasonalityEnabled: seasonality,
      convElasticityExpected: convElasticity,
      churnElasticityExpected: churnElasticity,
    }),
    [
      priceVarPct,
      siblingDiscountPct,
      groupsDelta,
      retentionImpr,
      seasonality,
      convElasticity,
      churnElasticity,
      baseParams,
    ],
  );

  const baseScenario = useMemo(
    () => runScenarioModel(baseConfig, baseParams),
    [baseConfig, baseParams],
  );
  const currentScenario = useMemo(() => {
    // Artificial small delay for UI feedback "en vivo menos de 1 segundo"
    return runScenarioModel(baseConfig, currentParams);
  }, [baseConfig, currentParams]);

  const saveScenario = () => {
    if (localSavedScenarios.length >= 3) return;
    setLocalSavedScenarios([
      ...localSavedScenarios,
      {
        id: `scen_${Date.now()}`,
        name: `Escenario ${localSavedScenarios.length + 1} (${priceVarPct > 0 ? '+' : ''}${priceVarPct}% precio)`,
        params: { ...currentParams },
        result: currentScenario,
      },
    ]);
  };

  const removeScenario = (id: string) => {
    setLocalSavedScenarios(localSavedScenarios.filter((s) => s.id !== id));
  };

  const sendToActionPlan = (scenario: any) => {
    addPlanAction({
      id: `plan_${Date.now()}`,
      task: `Implementar ${scenario.name} (Precio: ${scenario.params.priceVariationPct * 100}%, Descuento: ${scenario.params.siblingDiscountPct * 100}%)`,
      source: 'M11.2 Simulador',
      owner: 'Por asignar',
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      metric: 'Ingreso Estimado',
      status: 'todo',
      impact: {
        estimate: scenario.result.expected.reduce((sum: number, m: any) => sum + m.revenue, 0),
        unit: 'MXN',
      },
    });
    alert(`Escenario "${scenario.name}" enviado al Plan de Acción.`);
  };

  const formatMXN = (val: number) => `$${Math.round(val).toLocaleString()}`;
  const formatPct = (val: number) => `${(val * 100).toFixed(1)}%`;

  // Chart Data
  const months = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'];
  const baseRev = baseScenario.expected.map((m) => m.revenue);
  const curRev = currentScenario.expected.map((m) => m.revenue);
  const curRevOpt = currentScenario.optimistic.map((m) => m.revenue);
  const curRevCons = currentScenario.conservative.map((m) => m.revenue);

  // Base metrics to compare
  const base6MoRev = baseRev.reduce((a, b) => a + b, 0);
  const cur6MoRev = curRev.reduce((a, b) => a + b, 0);

  const base6MoProfit = baseScenario.expected.reduce((a, b) => a + b.profit, 0);
  const cur6MoProfit = currentScenario.expected.reduce((a, b) => a + b.profit, 0);

  const baseAct = baseScenario.expected[5]!.active;
  const curAct = currentScenario.expected[5]!.active;

  const limitedByCap = currentScenario.expected.some((m) => m.limitedByCapacity);

  return (
    <ModulePage
      module={{
        id: 'M11.2',
        categoryId: 11,
        title: 'Simulador de Escenarios',
        level: 'E',
        route: '',
        icon: '',
        shortDescription: '',
        businessQuestion: '¿Qué pasa si muevo precio, descuentos, grupos o retención?',
        component: null as any,
      }}
    >
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-end border-b border-ice-200 pb-2">
          <div className="flex gap-4">
            <button
              className={`pb-2 px-1 font-bold text-sm ${activeTab === 'simulador' ? 'text-navy-900 border-b-2 border-navy-900' : 'text-secundario hover:text-navy-900'}`}
              onClick={() => setActiveTab('simulador')}
            >
              Simulador en Vivo
            </button>
            <button
              className={`pb-2 px-1 font-bold text-sm ${activeTab === 'comparador' ? 'text-navy-900 border-b-2 border-navy-900' : 'text-secundario hover:text-navy-900'}`}
              onClick={() => setActiveTab('comparador')}
            >
              Comparador ({localSavedScenarios.length}/3)
            </button>
          </div>
          {activeTab === 'simulador' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-secundario underline"
              >
                {showAdvanced ? 'Ocultar Elasticidades' : 'Ajustar Elasticidades'}
              </button>
              <button
                onClick={saveScenario}
                disabled={localSavedScenarios.length >= 3}
                className="bg-navy-900 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
              >
                Guardar Escenario
              </button>
            </div>
          )}
        </div>

        {activeTab === 'simulador' && (
          <div className="flex flex-col lg:flex-row gap-6 overflow-hidden h-full">
            {/* Controles */}
            <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2 pb-4">
              <div className="bg-ice-50 p-4 rounded border border-ice-200 shadow-sm space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-navy-900 mb-2">
                    <span>Precio Base</span>
                    <span
                      className={
                        priceVarPct > 0 ? 'text-green-600' : priceVarPct < 0 ? 'text-red-600' : ''
                      }
                    >
                      {priceVarPct > 0 ? '+' : ''}
                      {priceVarPct}% ({formatMXN(baseConfig.basePrice * (1 + priceVarPct / 100))})
                    </span>
                  </div>
                  <Slider min={-20} max={40} value={priceVarPct} onChangeValue={setPriceVarPct} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-navy-900 mb-2">
                    <span>Descuento por Hermanos</span>
                    <span>{siblingDiscountPct}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={20}
                    value={siblingDiscountPct}
                    onChangeValue={setSiblingDiscountPct}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-navy-900 mb-2">
                    <span>Grupos Agregados / Removidos</span>
                    <span>
                      {groupsDelta > 0 ? '+' : ''}
                      {groupsDelta} ({groupsDelta * 5} lugares)
                    </span>
                  </div>
                  <Slider min={-5} max={10} value={groupsDelta} onChangeValue={setGroupsDelta} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-navy-900 mb-2">
                    <span>Mejora de Retención</span>
                    <span className="text-green-600">+{retentionImpr}%</span>
                  </div>
                  <Slider min={0} max={30} value={retentionImpr} onChangeValue={setRetentionImpr} />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="seas"
                    checked={seasonality}
                    onChange={(e) => setSeasonality(e.target.checked)}
                  />
                  <label htmlFor="seas" className="text-xs font-bold text-navy-900">
                    Aplicar Estacionalidad Mensual
                  </label>
                </div>
              </div>

              {showAdvanced && (
                <div className="bg-amber-50 p-4 rounded border border-amber-200 text-xs">
                  <p className="font-bold text-amber-900 mb-2">Supuestos Ilustrativos (H4)</p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Elasticidad Conversión</span>
                        <span>{convElasticity.toFixed(2)}</span>
                      </div>
                      <Slider
                        min={-1.5}
                        max={-0.1}
                        step={0.1}
                        value={convElasticity}
                        onChangeValue={setConvElasticity}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Elasticidad Churn</span>
                        <span>{churnElasticity.toFixed(2)}</span>
                      </div>
                      <Slider
                        min={0}
                        max={1}
                        step={0.05}
                        value={churnElasticity}
                        onChangeValue={setChurnElasticity}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resultados */}
            <div className="w-full lg:w-2/3 flex flex-col overflow-y-auto pr-2 pb-4">
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <Card className="p-3 bg-white border border-ice-200">
                  <p className="text-[10px] text-secundario uppercase">Ingreso (6m)</p>
                  <p className="text-lg font-bold text-navy-900">{formatMXN(cur6MoRev)}</p>
                  <p
                    className={`text-xs ${cur6MoRev >= base6MoRev ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {cur6MoRev >= base6MoRev ? '+' : ''}
                    {formatMXN(cur6MoRev - base6MoRev)} vs base
                  </p>
                </Card>
                <Card className="p-3 bg-white border border-ice-200">
                  <p className="text-[10px] text-secundario uppercase">Utilidad (6m)</p>
                  <p className="text-lg font-bold text-navy-900">{formatMXN(cur6MoProfit)}</p>
                  <p
                    className={`text-xs ${cur6MoProfit >= base6MoProfit ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {cur6MoProfit >= base6MoProfit ? '+' : ''}
                    {formatMXN(cur6MoProfit - base6MoProfit)} vs base
                  </p>
                </Card>
                <Card className="p-3 bg-white border border-ice-200">
                  <p className="text-[10px] text-secundario uppercase">Alumnos (Mes 6)</p>
                  <p className="text-lg font-bold text-navy-900">{Math.round(curAct)}</p>
                  <p className={`text-xs ${curAct >= baseAct ? 'text-green-600' : 'text-red-600'}`}>
                    {curAct >= baseAct ? '+' : ''}
                    {Math.round(curAct - baseAct)} vs base
                  </p>
                </Card>
                <Card
                  className={`p-3 border ${limitedByCap ? 'bg-red-50 border-red-200' : 'bg-white border-ice-200'}`}
                >
                  <p className="text-[10px] text-secundario uppercase">Ocupación (Mes 6)</p>
                  <p className="text-lg font-bold text-navy-900">
                    {formatPct(currentScenario.expected[5]!.occupancy)}
                  </p>
                  {limitedByCap && (
                    <p className="text-[10px] font-bold text-red-600">CAPACIDAD AL MÁXIMO</p>
                  )}
                </Card>
              </div>

              {/* Gráfica */}
              <Card className="p-4 bg-white border border-ice-200 flex-1 min-h-[300px] mb-6">
                <h3 className="text-sm font-bold text-navy-900 mb-4">Proyección de Ingresos</h3>
                <div className="h-[250px]">
                  <LineChart
                    id="sim_rev"
                    x={months}
                    series={[
                      { name: 'Base', y: baseRev, concept: 'default' },
                      { name: 'Escenario', y: curRev, concept: 'cobranza' },
                      { name: 'Límite Sup', y: curRevOpt, concept: 'meta' },
                      { name: 'Límite Inf', y: curRevCons, concept: 'meta' },
                    ]}
                    altText="Simulador de Ingresos"
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
              </Card>

              {/* Tabla */}
              <div className="bg-white rounded border border-ice-200 text-xs overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-ice-50 text-navy-900">
                    <tr>
                      <th className="p-2 border-b">Mes</th>
                      <th className="p-2 border-b">Prospectos</th>
                      <th className="p-2 border-b">Conv.</th>
                      <th className="p-2 border-b">Altas</th>
                      <th className="p-2 border-b">Bajas</th>
                      <th className="p-2 border-b">Activos</th>
                      <th className="p-2 border-b">Ingreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentScenario.expected.map((m, i) => (
                      <tr key={i} className="border-b border-ice-100 last:border-0 hover:bg-ice-50">
                        <td className="p-2 font-bold">{months[i]}</td>
                        <td className="p-2">{Math.round(m.prospects)}</td>
                        <td className="p-2">{formatPct(m.conversion)}</td>
                        <td
                          className={`p-2 ${m.limitedByCapacity ? 'text-red-600 font-bold' : ''}`}
                        >
                          {Math.round(m.enrollments)}
                          {m.limitedByCapacity ? '*' : ''}
                        </td>
                        <td className="p-2">{Math.round(m.churned)}</td>
                        <td className="p-2">{Math.round(m.active)}</td>
                        <td className="p-2">{formatMXN(m.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparador' && (
          <div className="flex-1 overflow-y-auto">
            {localSavedScenarios.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-secundario">
                <p>No hay escenarios guardados.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {localSavedScenarios.map((s) => {
                    const totalRev = s.result.expected.reduce(
                      (a: number, b: any) => a + b.revenue,
                      0,
                    );
                    return (
                      <Card key={s.id} className="p-4 border border-ice-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-navy-900">{s.name}</h4>
                          <button
                            onClick={() => removeScenario(s.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="text-xl font-bold text-green-600 mb-4">
                          {formatMXN(totalRev)}
                        </div>
                        <ul className="text-xs space-y-1 mb-4 text-secundario">
                          <li>Precio: +{s.params.priceVariationPct * 100}%</li>
                          <li>Descuento: {s.params.siblingDiscountPct * 100}%</li>
                          <li>Retención: +{s.params.retentionImprovementPct * 100}%</li>
                          <li>Grupos: {s.params.groupsAddedOrRemoved}</li>
                        </ul>
                        <button
                          onClick={() => sendToActionPlan(s)}
                          className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 rounded text-xs"
                        >
                          Enviar al Plan de Acción
                        </button>
                      </Card>
                    );
                  })}
                </div>

                {localSavedScenarios.length > 0 && (
                  <Card className="p-4 border border-ice-200">
                    <h3 className="font-bold text-navy-900 mb-4">
                      Comparación de Ingreso a 6 meses
                    </h3>
                    <div className="h-64">
                      <BarChart
                        id="comp_chart"
                        x={localSavedScenarios.map((s) => s.name)}
                        series={[
                          {
                            name: 'Ingreso Total',
                            y: localSavedScenarios.map((s) =>
                              s.result.expected.reduce((a: number, b: any) => a + b.revenue, 0),
                            ),
                            concept: 'cobranza',
                          },
                        ]}
                        altText="Comparación de escenarios"
                        tableData={{ columns: [], rows: [] }}
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ModulePage>
  );
}
