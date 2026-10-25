import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Slider } from '@/ui/components/Inputs';
import { LineChart, BarChart } from '@/charts/components/BasicCharts';
import { runScenarioModel } from '@/metrics/scenarioModel';
import type { ScenarioConfig, ScenarioParams } from '@/metrics/scenarioModel';
import { useAppStore } from '@/app/store';
import { SlidersHorizontal, Settings2, Save, X, Rocket, TrendingUp, TrendingDown, Users, DollarSign, BrainCircuit, Columns, Play, AlertTriangle, BarChart as BarChartIcon, BarChart3 } from 'lucide-react';

export default function M11_2_Simulator() {
  const { addPlanAction } = useAppStore();

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
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]!,
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

  const base6MoRev = baseRev.reduce((a, b) => a + b, 0);
  const cur6MoRev = curRev.reduce((a, b) => a + b, 0);

  const base6MoProfit = baseScenario.expected.reduce((a, b) => a + b.profit, 0);
  const cur6MoProfit = currentScenario.expected.reduce((a, b) => a + b.profit, 0);

  const baseAct = baseScenario.expected[5]!.active;
  const curAct = currentScenario.expected[5]!.active;

  const limitedByCap = currentScenario.expected.some((m) => m.limitedByCapacity);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <SlidersHorizontal size={12} /> Modelado de Escenarios
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Simulador de Impacto
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Proyecta en tiempo real cómo afectan tus decisiones operativas al flujo de efectivo.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Tabs Segmented Control */}
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'simulador' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('simulador')}
            >
              Simulador en Vivo
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'comparador' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('comparador')}
            >
              Comparador <span className="bg-slate-200 text-slate-600 px-1.5 rounded-full text-[10px]">{localSavedScenarios.length}/3</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'simulador' && (
        <>
          <div className="flex justify-end gap-3 mb-2">
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100">
              <Settings2 size={14} /> {showAdvanced ? 'Ocultar Elasticidades' : 'Ajustar Elasticidades (IA)'}
            </button>
            <button onClick={saveScenario} disabled={localSavedScenarios.length >= 3} className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 px-5 py-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-slate-900/20">
              <Save size={14} /> Guardar Escenario
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* CONTROLS SIDEBAR */}
            <div className="w-full lg:w-1/3 space-y-6">
              <Card className="p-0 border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-slate-500" /> Variables de Negocio
                  </h4>
                </div>
                <div className="p-5 space-y-7 flex-1">
                  
                  {/* Slider 1 */}
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Ajuste de Precio Base</span>
                      <span className={`font-mono font-bold ${priceVarPct > 0 ? 'text-emerald-600' : priceVarPct < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                        {priceVarPct > 0 ? '+' : ''}{priceVarPct}% <span className="text-[10px] text-slate-400 font-normal">({formatMXN(baseConfig.basePrice * (1 + priceVarPct / 100))})</span>
                      </span>
                    </label>
                    <div className="px-1">
                      <Slider min={-20} max={40} value={priceVarPct} onChangeValue={setPriceVarPct} />
                    </div>
                  </div>
                  
                  {/* Slider 2 */}
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Descuento Promedio (Becas)</span>
                      <span className="font-mono font-bold text-amber-600">{siblingDiscountPct}%</span>
                    </label>
                    <div className="px-1">
                      <Slider min={0} max={20} value={siblingDiscountPct} onChangeValue={setSiblingDiscountPct} />
                    </div>
                  </div>

                  {/* Slider 3 */}
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Apertura / Cierre de Grupos</span>
                      <span className="font-mono font-bold text-slate-700">{groupsDelta > 0 ? '+' : ''}{groupsDelta} <span className="text-[10px] text-slate-400 font-normal">({groupsDelta * 5} lugares)</span></span>
                    </label>
                    <div className="px-1">
                      <Slider min={-5} max={10} value={groupsDelta} onChangeValue={setGroupsDelta} />
                    </div>
                  </div>

                  {/* Slider 4 */}
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Inversión en Retención</span>
                      <span className="font-mono font-bold text-emerald-600">+{retentionImpr}%</span>
                    </label>
                    <div className="px-1">
                      <Slider min={0} max={30} value={retentionImpr} onChangeValue={setRetentionImpr} />
                    </div>
                  </div>
                  
                  {/* Checkbox */}
                  <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                    <div className="relative flex items-center">
                      <input type="checkbox" id="seas" checked={seasonality} onChange={(e) => setSeasonality(e.target.checked)} className="w-5 h-5 accent-indigo-500 border-slate-300 rounded cursor-pointer" />
                    </div>
                    <label htmlFor="seas" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                      Habilitar modelo estacional (IA)
                    </label>
                  </div>

                </div>
              </Card>

              {showAdvanced && (
                <Card className="p-0 border border-indigo-200 bg-indigo-50 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-indigo-100">
                    <h4 className="font-bold text-indigo-900 text-xs flex items-center gap-2">
                      <BrainCircuit size={14} className="text-indigo-600" /> Supuestos de Elasticidad
                    </h4>
                  </div>
                  <div className="p-5 space-y-6">
                    <div>
                      <div className="flex justify-between mb-2 text-xs font-bold text-indigo-900">
                        <span>Elasticidad Conversión</span>
                        <span className="font-mono">{convElasticity.toFixed(2)}</span>
                      </div>
                      <div className="px-1">
                        <Slider min={-1.5} max={-0.1} step={0.1} value={convElasticity} onChangeValue={setConvElasticity} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2 text-xs font-bold text-indigo-900">
                        <span>Sensibilidad a Bajas</span>
                        <span className="font-mono">{churnElasticity.toFixed(2)}</span>
                      </div>
                      <div className="px-1">
                        <Slider min={0} max={1} step={0.05} value={churnElasticity} onChangeValue={setChurnElasticity} />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* RESULTS AREA */}
            <div className="w-full lg:w-2/3 flex flex-col space-y-6">
              
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <Card className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden group">
                  {cur6MoRev >= base6MoRev ? <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div> : <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={14} className="text-slate-400" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Ingreso (6m)</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-slate-900 mb-1">{formatMXN(cur6MoRev)}</p>
                  <p className={`text-xs font-bold flex items-center gap-1 ${cur6MoRev >= base6MoRev ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {cur6MoRev >= base6MoRev ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                    {cur6MoRev >= base6MoRev ? '+' : ''}{formatMXN(cur6MoRev - base6MoRev)} vs actual
                  </p>
                </Card>

                <Card className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden group">
                  {cur6MoProfit >= base6MoProfit ? <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div> : <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-slate-400" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Utilidad (6m)</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-slate-900 mb-1">{formatMXN(cur6MoProfit)}</p>
                  <p className={`text-xs font-bold flex items-center gap-1 ${cur6MoProfit >= base6MoProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {cur6MoProfit >= base6MoProfit ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                    {cur6MoProfit >= base6MoProfit ? '+' : ''}{formatMXN(cur6MoProfit - base6MoProfit)} vs actual
                  </p>
                </Card>

                <Card className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden group">
                  {curAct >= baseAct ? <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div> : <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} className="text-slate-400" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Alumnos (M6)</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-slate-900 mb-1">{Math.round(curAct)}</p>
                  <p className={`text-xs font-bold flex items-center gap-1 ${curAct >= baseAct ? 'text-indigo-600' : 'text-rose-600'}`}>
                    {curAct >= baseAct ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                    {curAct >= baseAct ? '+' : ''}{Math.round(curAct - baseAct)} vs actual
                  </p>
                </Card>

                <Card className={`p-4 border rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden ${limitedByCap ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                  {limitedByCap && <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>}
                  <div className="flex items-center gap-2 mb-1">
                    <Columns size={14} className={limitedByCap ? 'text-rose-400' : 'text-slate-400'} />
                    <p className={`text-[10px] uppercase font-bold tracking-widest ${limitedByCap ? 'text-rose-500' : 'text-slate-500'}`}>Ocupación (M6)</p>
                  </div>
                  <p className={`text-2xl font-display font-bold mb-1 ${limitedByCap ? 'text-rose-700' : 'text-slate-900'}`}>
                    {formatPct(currentScenario.expected[5]!.occupancy)}
                  </p>
                  {limitedByCap && (
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1 mt-1">
                      <AlertTriangle size={10} /> Capacidad tope
                    </p>
                  )}
                </Card>
              </div>

              {/* CHART */}
              <Card className="p-0 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" /> Proyección de Ingresos en el Tiempo
                  </h3>
                </div>
                <div className="min-h-[400px] p-5">
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

              {/* TABLE */}
              <Card className="p-0 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mes</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Prospectos</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Conv.</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Altas</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Bajas</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Activos</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right">Ingreso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentScenario.expected.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 text-sm">{months[i]}</td>
                          <td className="px-4 py-3 text-slate-600 text-sm">{Math.round(m.prospects)}</td>
                          <td className="px-4 py-3 text-slate-600 text-sm font-mono">{formatPct(m.conversion)}</td>
                          <td className={`px-4 py-3 text-sm ${m.limitedByCapacity ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                            {Math.round(m.enrollments)}
                            {m.limitedByCapacity ? <span className="text-rose-500 ml-1" title="Topó capacidad">*</span> : ''}
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-sm">{Math.round(m.churned)}</td>
                          <td className="px-4 py-3 text-indigo-700 font-bold text-sm">{Math.round(m.active)}</td>
                          <td className="px-4 py-3 text-emerald-700 font-bold text-sm font-mono text-right">{formatMXN(m.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

            </div>
          </div>
        </>
      )}

      {activeTab === 'comparador' && (
        <div className="pt-2">
          {localSavedScenarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 bg-slate-50/50 rounded-3xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Columns size={32} />
              </div>
              <p className="font-display font-bold text-xl text-slate-900 mb-2">No hay escenarios guardados</p>
              <p className="text-sm font-medium">Regresa al Simulador y guarda hasta 3 escenarios para compararlos.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {localSavedScenarios.map((s) => {
                  const totalRev = s.result.expected.reduce((a: number, b: any) => a + b.revenue, 0);
                  return (
                    <Card key={s.id} className="p-0 border border-slate-200 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <Play size={14} className="text-indigo-500" /> {s.name}
                        </h4>
                        <button onClick={() => removeScenario(s.id)} className="text-slate-400 hover:text-rose-500 transition-colors bg-white border border-slate-200 rounded-md p-1 shadow-sm">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <strong className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Ingreso Total Proyectado</strong>
                        <div className="text-3xl font-display font-bold text-emerald-600 mb-6">
                          {formatMXN(totalRev)}
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-3 font-medium text-slate-600 mb-6 flex-1">
                          <div className="flex justify-between border-b border-slate-200/60 pb-2"><span>Ajuste Precio:</span> <strong className={`font-mono ${s.params.priceVariationPct > 0 ? 'text-emerald-600' : s.params.priceVariationPct < 0 ? 'text-rose-500' : 'text-slate-900'}`}>{s.params.priceVariationPct > 0 ? '+' : ''}{s.params.priceVariationPct * 100}%</strong></div>
                          <div className="flex justify-between border-b border-slate-200/60 pb-2"><span>Descuento Beca:</span> <strong className="font-mono text-slate-900">{s.params.siblingDiscountPct * 100}%</strong></div>
                          <div className="flex justify-between border-b border-slate-200/60 pb-2"><span>Mejora Retención:</span> <strong className="font-mono text-indigo-600">+{s.params.retentionImprovementPct * 100}%</strong></div>
                          <div className="flex justify-between"><span>Delta Grupos:</span> <strong className="font-mono text-slate-900">{s.params.groupsAddedOrRemoved > 0 ? '+' : ''}{s.params.groupsAddedOrRemoved}</strong></div>
                        </div>
                        
                        <button onClick={() => sendToActionPlan(s)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm shadow-slate-900/20">
                          <Rocket size={14} /> Implementar Plan
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {localSavedScenarios.length > 0 && (
                <Card className="p-0 border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <BarChart3 size={16} className="text-indigo-500" /> Comparativa de Ingresos Acumulados a 6 meses
                    </h3>
                  </div>
                  <div className="min-h-[450px] p-5">
                    <BarChart
                      id="comp_chart"
                      x={localSavedScenarios.map((s) => s.name)}
                      series={[
                        {
                          name: 'Ingreso Total ($)',
                          y: localSavedScenarios.map((s) => s.result.expected.reduce((a: number, b: any) => a + b.revenue, 0)),
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
  );
}
