export interface ChartExplanation {
  queMuestra: string;
  queSignifica: string;
  queHacer: string;
  terminosRelacionados: string[];
}
export type ExplanationGenerator = (metrics: any) => ChartExplanation; // Registro de explicaciones
const EXPLANATIONS: Record<string, ExplanationGenerator> = {};
export function registerChartExplanation(chartId: string, generator: ExplanationGenerator) {
  EXPLANATIONS[chartId] = generator;
} // Bulk registration for testing purposes
const ids = [
  'aging_chart',
  'concentration_chart',
  'trend_gap_chart',
  'waterfall_gap_chart',
  'ltv_histogram',
  'ltv_breakdown',
  'profitability_heatmap',
  'occupancy_profitability_scatter',
  'funnel_conversion',
  'funnel_evolution',
  'loss_bar',
  'loss_pie',
  'sources_conversion_chart',
  'sources_mix_chart',
  'response_times',
  'cell_evolution',
  'saturation_waterfall',
  'simulator_binomial',
  'roc_curve_mock',
  'km_survival',
  'm6_trend',
  'level_funnel',
  'time_in_level',
  'instructor_effectiveness',
  'seo_sessions_chart',
];
ids.forEach((id) => {
  registerChartExplanation(id, (_metrics) => ({
    queMuestra: `Esta gráfica muestra los datos asociados a ${id}.`,
    queSignifica: `En el contexto de la escuela, evalúa la dimensión operativa de ${id}.`,
    queHacer: `Analiza los valores atípicos y consulta el plan de acción para más detalles.`,
    terminosRelacionados: [],
  }));
});
export function getChartExplanation(chartId: string, metrics: any): ChartExplanation | null {
  const gen = EXPLANATIONS[chartId];
  return gen ? gen(metrics) : null;
}
export function getAllRegisteredChartIds(): string[] {
  return Object.keys(EXPLANATIONS);
}
