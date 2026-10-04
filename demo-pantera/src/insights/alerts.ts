import type { Alert } from './types';
import { formatNum, formatCurrency, formatPercent } from './templates';

export interface AlertConfig {
  occupancyThreshold: number; // e.g. 95
  arrearsThreshold: number; // e.g. 30000
}

export function generateAlerts(
  metrics: Record<string, any>,
  config: AlertConfig,
  currentDate: Date,
): Alert[] {
  const alerts: Alert[] = [];
  const ts = currentDate.toISOString();

  // 1. Ocupación crítica
  if (
    metrics.ocupacion &&
    metrics.ocupacion > config.occupancyThreshold &&
    metrics.listaEspera > 0
  ) {
    alerts.push({
      id: 'alert-occ-critical',
      type: 'occupancy',
      severity: 'alerta',
      title: 'Ocupación crítica',
      message: `La ocupación supera el ${formatPercent(config.occupancyThreshold)} y hay ${formatNum(metrics.listaEspera)} personas en lista de espera.`,
      moduleId: 'm1-executive',
      createdAt: ts,
      evidence: { ocupacion: metrics.ocupacion, listaEspera: metrics.listaEspera },
      dismissible: true,
    });
  }

  // 2. Riesgo alto de baja
  if (metrics.alumnosRiesgoAlto && metrics.alumnosRiesgoAlto > 10) {
    alerts.push({
      id: 'alert-high-risk',
      type: 'retention',
      severity: 'atencion',
      title: 'Riesgo de deserción elevado',
      message: `Hay ${formatNum(metrics.alumnosRiesgoAlto)} alumnos con alta probabilidad de baja este mes.`,
      moduleId: 'm2-health',
      createdAt: ts,
      evidence: { riesgoAlto: metrics.alumnosRiesgoAlto },
      dismissible: true,
    });
  }

  // 3. Cartera Vencida
  if (metrics.carteraVencida && metrics.carteraVencida > config.arrearsThreshold) {
    alerts.push({
      id: 'alert-arrears',
      type: 'finance',
      severity: 'critico',
      title: 'Cartera vencida excedida',
      message: `El saldo pendiente de cobro asciende a ${formatCurrency(metrics.carteraVencida)}, superando el umbral esperado.`,
      moduleId: 'm3-arrears',
      createdAt: ts,
      evidence: { carteraVencida: metrics.carteraVencida },
      dismissible: false,
    });
  }

  // 4. Caída de conversión
  if (metrics.caidaConversion && metrics.caidaConversion > 5) {
    alerts.push({
      id: 'alert-conv-drop',
      type: 'sales',
      severity: 'alerta',
      title: 'Caída significativa en conversión',
      message: `La tasa de conversión cayó ${formatNum(metrics.caidaConversion, 1)} puntos porcentuales respecto al mes anterior.`,
      moduleId: 'm5-funnel',
      createdAt: ts,
      evidence: { caida: metrics.caidaConversion },
      dismissible: true,
    });
  }

  // 5. Instructor con baja retención
  if (metrics.instructorRetencionBaja) {
    alerts.push({
      id: 'alert-inst-ret',
      type: 'operations',
      severity: 'atencion',
      title: 'Baja retención por instructor',
      message: `El instructor ${metrics.instructorRetencionBaja.nombre} presenta una tasa de bajas significativamente mayor al promedio.`,
      moduleId: 'm2-health',
      createdAt: ts,
      evidence: metrics.instructorRetencionBaja,
      dismissible: true,
    });
  }

  // 6. Cohorte débil
  if (metrics.cohorteDebil) {
    alerts.push({
      id: 'alert-cohort-weak',
      type: 'retention',
      severity: 'atencion',
      title: 'Cohorte con rendimiento atípico',
      message: `La cohorte de ${metrics.cohorteDebil.mes} tiene una supervivencia del ${formatPercent(metrics.cohorteDebil.supervivencia)}, por debajo del promedio.`,
      moduleId: 'm2-health',
      createdAt: ts,
      evidence: metrics.cohorteDebil,
      dismissible: true,
    });
  }

  // 7. Crecimiento de lista de espera
  if (metrics.crecimientoListaEspera && metrics.crecimientoListaEspera > 20) {
    alerts.push({
      id: 'alert-waitlist-growth',
      type: 'operations',
      severity: 'info',
      title: 'Crecimiento de lista de espera',
      message: `La lista de espera creció un ${formatPercent(metrics.crecimientoListaEspera)} este mes. Podría ameritar abrir nuevos grupos.`,
      moduleId: 'm1-executive',
      createdAt: ts,
      evidence: { crecimiento: metrics.crecimientoListaEspera },
      dismissible: true,
    });
  }

  // 8. Meta de ingresos en riesgo
  if (metrics.metaIngresosEnRiesgo) {
    alerts.push({
      id: 'alert-revenue-risk',
      type: 'finance',
      severity: 'alerta',
      title: 'Meta de ingresos en riesgo',
      message: `La proyección de cierre mensual es de ${formatCurrency(metrics.proyeccionIngresos)}, inferior a la meta de ${formatCurrency(metrics.metaIngresos)}.`,
      moduleId: 'm1-executive',
      createdAt: ts,
      evidence: { proyeccion: metrics.proyeccionIngresos, meta: metrics.metaIngresos },
      dismissible: true,
    });
  }

  // Sort alerts by severity (critico > alerta > atencion > info)
  const severityWeight = { critico: 4, alerta: 3, atencion: 2, info: 1 };
  alerts.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);

  return alerts;
}
