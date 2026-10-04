import type { Recommendation } from './types';
import { formatNum, formatPercent } from './templates';

export function generateRecommendations(metrics: Record<string, any>): Recommendation[] {
  const recs: Recommendation[] = [];
  const effortWeight = { bajo: 1, medio: 2, alto: 3 };

  // Helper to add recommendation
  const addRec = (
    id: string,
    title: string,
    rationale: string,
    evidence: string[],
    impactMetric: string,
    estimate: number,
    low: number,
    high: number,
    unit: string,
    effort: 'bajo' | 'medio' | 'alto',
    sourceModule: string,
    category: string,
  ) => {
    recs.push({
      id,
      title,
      rationale,
      evidence,
      impact: { metric: impactMetric, estimate, low, high, unit },
      effort,
      sourceModule,
      category,
      status: 'pending',
    });
  };

  // 1. Mover grupos de franjas vacías a saturadas
  if (metrics.franjasSaturadas && metrics.franjasSaturadas > 0) {
    addRec(
      'rec-move-slots',
      'Mover grupos a horarios saturados',
      'Hay horarios con lista de espera mientras otras franjas tienen muy baja ocupación. Reasignar recursos maximiza los ingresos.',
      [
        `${formatNum(metrics.franjasSaturadas)} franjas saturadas`,
        `${formatNum(metrics.franjasVacias || 0)} franjas subutilizadas`,
      ],
      'Ingreso Mensual',
      metrics.ingresoPerdidoHorarios || 15000,
      10000,
      25000,
      'MXN',
      'medio',
      'm1-executive',
      'operaciones',
    );
  }

  // 2. Abrir grupo en el sábado
  if (metrics.demandaSabado && metrics.demandaSabado > 15) {
    addRec(
      'rec-saturday-group',
      'Abrir nuevo grupo sabatino',
      'El sábado presenta la mayor concentración de prospectos no convertidos por falta de cupo.',
      [`${formatNum(metrics.demandaSabado)} prospectos rechazados para sábados`],
      'Ingreso Mensual',
      metrics.ingresoSabadoEstimado || 28000,
      20000,
      35000,
      'MXN',
      'medio',
      'm1-executive',
      'operaciones',
    );
  }

  // 3. Cobranza prioritaria
  if (metrics.familiasVencidas && metrics.familiasVencidas > 5) {
    addRec(
      'rec-collections',
      'Cobranza prioritaria a familias vencidas',
      'Atacar directamente a las familias con mayor deuda acumulada recupera flujo de caja crítico.',
      [`${formatNum(metrics.familiasVencidas)} familias con pagos atrasados`],
      'Flujo de Caja',
      metrics.carteraRecuperable || 20000,
      10000,
      30000,
      'MXN',
      'bajo',
      'm3-arrears',
      'finanzas',
    );
  }

  // 4. Llamar a alumnos de riesgo alto
  if (metrics.alumnosRiesgoAlto && metrics.alumnosRiesgoAlto > 0) {
    addRec(
      'rec-call-risk',
      'Contactar a alumnos en riesgo',
      'Una llamada preventiva a alumnos identificados con baja asistencia puede evitar la deserción.',
      [`${formatNum(metrics.alumnosRiesgoAlto)} alumnos en riesgo alto esta semana`],
      'LTV Salvado',
      metrics.alumnosRiesgoAlto * (metrics.ltv || 10000) * 0.3,
      5000,
      50000,
      'MXN',
      'bajo',
      'm2-health',
      'retencion',
    );
  }

  // 5. Clase de refuerzo para Nivel 3
  if (metrics.desercionNivel3 && metrics.desercionNivel3 > 8) {
    addRec(
      'rec-level3-boost',
      'Clases de refuerzo para Nivel 3',
      'El Nivel 3 (Respiración rítmica) tiene la mayor tasa de abandono. Ofrecer apoyo extra mejora la retención.',
      [`${formatNum(metrics.desercionNivel3, 1)}% de deserciones ocurren en el Nivel 3`],
      'Retención',
      5,
      2,
      8,
      '%',
      'medio',
      'm2-health',
      'operaciones',
    );
  }

  // 6. Replicar prácticas del instructor top
  if (metrics.instructorTop) {
    addRec(
      'rec-top-instructor',
      'Replicar prácticas de mejor instructor',
      `El instructor ${metrics.instructorTop.nombre} tiene una retención excepcional. Documentar y entrenar al equipo en sus métodos levantará el promedio.`,
      [`Retención del ${formatNum(metrics.instructorTop.retencion, 1)}% (Top 1)`],
      'Retención Global',
      2,
      1,
      4,
      '%',
      'alto',
      'm2-health',
      'rh',
    );
  }

  // 7. Capacitación instructor menor retención
  if (metrics.instructorBajo) {
    addRec(
      'rec-train-instructor',
      'Acompañamiento a instructor con baja retención',
      `Identificamos que los grupos de ${metrics.instructorBajo.nombre} sufren más deserciones. Un acompañamiento temprano evitará pérdidas.`,
      [`Deserción del ${formatNum(metrics.instructorBajo.desercion, 1)}% (Peor desempeño)`],
      'LTV Salvado',
      40000,
      20000,
      60000,
      'MXN',
      'medio',
      'm2-health',
      'rh',
    );
  }

  // 8. Descuento hermano
  if (metrics.familiasPotencialesHermanos && metrics.familiasPotencialesHermanos > 10) {
    addRec(
      'rec-sibling-discount',
      'Ofrecer descuento a hermanos',
      'Hay prospectos que no inscriben al segundo hijo por precio. Un descuento enfocado incrementa el share of wallet.',
      [
        `${formatNum(metrics.familiasPotencialesHermanos)} familias con un solo inscrito y prospectos perdidos`,
      ],
      'Ingreso Mensual',
      12000,
      8000,
      18000,
      'MXN',
      'bajo',
      'm4-ltv',
      'ventas',
    );
  }

  // 9. Promoción de referidos
  if (metrics.conversionReferidos && metrics.conversionReferidos > 40) {
    addRec(
      'rec-referrals',
      'Campaña de referidos',
      'La fuente "Referidos" tiene la mejor conversión. Incentivar a alumnos actuales a referir traerá prospectos altamente calificados.',
      [`Conversión del ${formatNum(metrics.conversionReferidos, 1)}% en Referidos`],
      'Inscripciones',
      15,
      5,
      25,
      'alumnos',
      'medio',
      'm5-funnel',
      'marketing',
    );
  }

  // 10. Palabra clave oportunidad
  if (metrics.keywordOportunidad) {
    addRec(
      'rec-seo-keyword',
      'Mejorar posicionamiento en búsqueda',
      `La palabra "${metrics.keywordOportunidad.palabra}" trae tráfico muy calificado pero estamos en posición baja.`,
      [`CTR actual de ${formatNum(metrics.keywordOportunidad.ctr, 1)}%`],
      'Prospectos Extras',
      40,
      20,
      80,
      'leads/mes',
      'medio',
      'm5-funnel',
      'marketing',
    );
  }

  // 11. Migración a 2 sesiones
  if (metrics.potencialUpgrade && metrics.potencialUpgrade > 20) {
    addRec(
      'rec-upsell-sessions',
      'Campaña de migración a 2 sesiones',
      'Alumnos que llevan más de 6 meses en 1 sesión por semana son candidatos ideales para un upgrade al plan de 2 sesiones.',
      [`${formatNum(metrics.potencialUpgrade)} alumnos estables en 1 sesión`],
      'Ingreso Mensual',
      18000,
      10000,
      25000,
      'MXN',
      'bajo',
      'm4-ltv',
      'ventas',
    );
  }

  // 12. Ajuste de precio
  if (metrics.inflacion && metrics.inflacion > 4 && !metrics.ajustePrecioReciente) {
    addRec(
      'rec-price-adjustment',
      'Ajuste de precio de entrada',
      'El costo de vida ha subido y no hemos ajustado tarifas en el último año. Un ajuste del 5% a nuevos ingresos es asimilable.',
      [`Inflación acumulada > 4% sin ajuste de tarifas`],
      'Ingreso Anual',
      120000,
      80000,
      150000,
      'MXN',
      'alto',
      'm1-executive',
      'finanzas',
    );
  }

  // 13. Reinscripción anticipada
  if (metrics.mesAniversario === 'diciembre') {
    addRec(
      'rec-early-renewal',
      'Programa de reinscripción anual anticipada',
      'Diciembre y Enero son meses críticos. Ofrecer mantener el precio actual si pagan la anualidad antes del 15 de diciembre asegura flujo.',
      [`Alta volatilidad histórica en fin de año`],
      'Flujo de Caja',
      150000,
      100000,
      250000,
      'MXN',
      'medio',
      'm3-arrears',
      'ventas',
    );
  }

  // 14. Recordatorios automatizados
  if (metrics.pagosTardios && metrics.pagosTardios > 20) {
    addRec(
      'rec-auto-reminders',
      'Recordatorios de pago automatizados',
      'Muchas familias pagan tarde por olvido, no por falta de liquidez. Automatizar WhatsApps el día 3 reducirá la morosidad.',
      [`${formatPercent(metrics.pagosTardios)} de pagos ocurren después del día 5`],
      'Reducción de Morosidad',
      30,
      15,
      45,
      '%',
      'bajo',
      'm3-arrears',
      'operaciones',
    );
  }

  // Sort by (Impact Estimate) / Effort Weight (Higher is better)
  // For % or students, we scale to roughly match MXN scale just for sorting logic, or normalize.
  const normalizeEstimate = (rec: Recommendation) => {
    if (rec.impact.unit === 'MXN') return rec.impact.estimate;
    if (rec.impact.unit === '%') return rec.impact.estimate * 5000;
    if (rec.impact.unit === 'alumnos') return rec.impact.estimate * 1000;
    if (rec.impact.unit === 'leads/mes') return rec.impact.estimate * 200;
    return rec.impact.estimate;
  };

  recs.sort((a, b) => {
    const scoreA = normalizeEstimate(a) / effortWeight[a.effort];
    const scoreB = normalizeEstimate(b) / effortWeight[b.effort];
    return scoreB - scoreA;
  });

  return recs;
}
