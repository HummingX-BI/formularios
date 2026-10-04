import type { Insight, ChartExplanation } from './types';
import { formatCurrency, formatPercent } from './templates';

export type InsightGenerator = (
  metrics: Record<string, number>,
  extras?: Record<string, any>,
) => Insight[];
export type ChartExplanationGenerator = (
  metrics: Record<string, number>,
  extras?: Record<string, any>,
) => ChartExplanation;

const insightRegistry: Record<string, InsightGenerator> = {};
const chartExplRegistry: Record<string, ChartExplanationGenerator> = {};

export function registerInsightGenerator(moduleId: string, generator: InsightGenerator) {
  insightRegistry[moduleId] = generator;
}

export function registerChartExplanation(chartId: string, generator: ChartExplanationGenerator) {
  chartExplRegistry[chartId] = generator;
}

export function generateInsightsFor(
  moduleId: string,
  metrics: Record<string, number>,
  extras?: Record<string, any>,
): Insight[] {
  const gen = insightRegistry[moduleId];
  return gen ? gen(metrics, extras) : [];
}

export function explainChart(
  chartId: string,
  metrics: Record<string, number>,
  extras?: Record<string, any>,
): ChartExplanation | null {
  const gen = chartExplRegistry[chartId];
  return gen ? gen(metrics, extras) : null;
}

// ==========================================
// Base Generators for Modules 1 to 5
// ==========================================

// Mod 1: Resumen Ejecutivo
registerInsightGenerator('m1-executive', (metrics) => {
  const occupancy = metrics.ocupacion || 0;

  const insights: Insight[] = [];

  if (occupancy > 90) {
    insights.push({
      id: 'm1-occ-high',
      moduleId: 'm1-executive',
      severity: 'positivo',
      headline: 'Ocupación casi a tope',
      summary: `La escuela opera al ${formatPercent(occupancy)} de su capacidad, lo cual es excelente.`,
      bullets: [
        `Quedan muy pocos lugares disponibles.`,
        `Es un buen momento para optimizar horarios o considerar expansión.`,
      ],
      evidence: [
        {
          metricId: 'ocupacion',
          label: 'Ocupación actual',
          value: occupancy,
          formatted: formatPercent(occupancy),
        },
      ],
    });
  }

  return insights;
});

// Mod 2: Índice de salud
registerInsightGenerator('m2-health', (metrics) => {
  const churn = metrics.churn || 0;
  return [
    {
      id: 'm2-health-churn',
      moduleId: 'm2-health',
      severity: churn > 5 ? 'alerta' : 'positivo',
      headline: churn > 5 ? 'Atención en deserciones' : 'Retención saludable',
      summary: `La tasa de deserción está en ${formatPercent(churn)}.`,
      bullets: [],
      evidence: [
        {
          metricId: 'churn',
          label: 'Tasa de deserción',
          value: churn,
          formatted: formatPercent(churn),
        },
      ],
    },
  ];
});

// Mod 3: Cartera Vencida
registerInsightGenerator('m3-arrears', (metrics) => {
  const arrears = metrics.carteraVencida || 0;
  return [
    {
      id: 'm3-arrears-alert',
      moduleId: 'm3-arrears',
      severity: arrears > 50000 ? 'alerta' : 'info',
      headline: 'Estado de la cobranza',
      summary: `Actualmente hay ${formatCurrency(arrears)} pendientes de cobro.`,
      bullets: [],
      evidence: [
        {
          metricId: 'carteraVencida',
          label: 'Monto vencido',
          value: arrears,
          formatted: formatCurrency(arrears),
        },
      ],
    },
  ];
});

// Mod 4: Ticket y LTV
registerInsightGenerator('m4-ltv', (metrics) => {
  const ltv = metrics.ltv || 0;
  const ticket = metrics.ticket || 0;
  return [
    {
      id: 'm4-ltv-insight',
      moduleId: 'm4-ltv',
      severity: 'info',
      headline: 'Valor del alumno',
      summary: `En promedio, un alumno aporta ${formatCurrency(ltv)} a lo largo de su vida.`,
      bullets: [`El ticket promedio es ${formatCurrency(ticket)}.`],
      evidence: [
        { metricId: 'ltv', label: 'Life Time Value', value: ltv, formatted: formatCurrency(ltv) },
      ],
    },
  ];
});

// Mod 5: Embudo y Fuentes
registerInsightGenerator('m5-funnel', (metrics) => {
  const conversion = metrics.conversion || 0;
  return [
    {
      id: 'm5-conversion',
      moduleId: 'm5-funnel',
      severity: conversion > 25 ? 'positivo' : 'atencion',
      headline: 'Conversión general',
      summary: `El ${formatPercent(conversion)} de los prospectos se inscribe.`,
      bullets: [],
      evidence: [
        {
          metricId: 'conversion',
          label: 'Tasa de conversión',
          value: conversion,
          formatted: formatPercent(conversion),
        },
      ],
    },
  ];
});
