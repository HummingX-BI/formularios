import type { MetricMetadata } from './types';

export const METRICS_REGISTRY: Record<string, MetricMetadata> = {
  activeStudents: {
    id: 'activeStudents',
    name: 'Alumnos Activos',
    shortDefinition: 'Total de alumnos con plan vigente en el periodo',
    formula: 'Σ(Alumnos) donde enrollmentDate <= end y (churnDate es null o churnDate > end)',
    unit: 'count',
    directionGood: 'up',
    code: 'D-01'
  },
  churn: {
    id: 'churn',
    name: 'Bajas',
    shortDefinition: 'Total de alumnos que causaron baja en el periodo',
    formula: 'Σ(Alumnos) donde churnDate entre start y end',
    unit: 'count',
    directionGood: 'down',
    code: 'D-02'
  },
  occupancy: {
    id: 'occupancy',
    name: 'Ocupación de Cupo',
    shortDefinition: 'Porcentaje de lugares asignados sobre capacidad total',
    formula: 'Lugares Ocupados / Capacidad Total Disponible',
    unit: 'percentage',
    directionGood: 'up',
    code: 'D-05'
  },
  laneUtilization: {
    id: 'laneUtilization',
    name: 'Utilización de Carriles',
    shortDefinition: 'Carriles ocupados sobre totales, por alberca y franja',
    formula: 'Σ(Carriles Asignados) / Σ(Carriles Totales de Alberca)',
    unit: 'percentage',
    directionGood: 'up',
    code: 'D-06'
  },
  tenure: {
    id: 'tenure',
    name: 'Permanencia (Tenure)',
    shortDefinition: 'Meses promedio de vida del alumno',
    formula: 'Promedio de (Fecha Baja - Fecha Ingreso) en meses, manejando censura por Kaplan-Meier',
    unit: 'months',
    directionGood: 'up',
    code: 'D-07'
  },
  timeInLevel: {
    id: 'timeInLevel',
    name: 'Tiempo en Nivel',
    shortDefinition: 'Meses que toma completar un nivel en promedio',
    formula: 'Promedio(Fecha Fin - Fecha Inicio) para LevelStint completados',
    unit: 'months',
    directionGood: 'down',
    code: 'D-08'
  },
  retention6m: {
    id: 'retention6m',
    name: 'Retención a 6 Meses',
    shortDefinition: 'Porcentaje de una cohorte que sigue activa al mes 6',
    formula: '(Activos de Cohorte en M+6) / (Inscritos en Cohorte M)',
    unit: 'percentage',
    directionGood: 'up',
    code: 'D-09'
  },
  monthlyChurnRate: {
    id: 'monthlyChurnRate',
    name: 'Tasa de Churn Mensual',
    shortDefinition: 'Bajas del mes sobre activos al inicio del mes',
    formula: 'Bajas(Mes) / Activos(Inicio de Mes)',
    unit: 'percentage',
    directionGood: 'down',
    code: 'D-10'
  },
  churnRisk: {
    id: 'churnRisk',
    name: 'Riesgo de Baja',
    shortDefinition: 'Probabilidad proyectada de baja a 30 días',
    formula: 'Modelo(Faltas Consecutivas, Nivel, Pagos)',
    unit: 'percentage',
    directionGood: 'down',
    code: 'D-11'
  },
  averageTicket: {
    id: 'averageTicket',
    name: 'Ticket Promedio',
    shortDefinition: 'Ingreso promedio mensual por alumno activo',
    formula: 'Ingreso Facturable / Alumnos Activos',
    unit: 'currency',
    directionGood: 'up',
    code: 'D-12'
  },
  ltv: {
    id: 'ltv',
    name: 'Valor de Vida (LTV)',
    shortDefinition: 'Ingreso total esperado por alumno',
    formula: 'Permanencia Media * Ticket Promedio * Margen Bruto',
    unit: 'currency',
    directionGood: 'up',
    code: 'D-13'
  },
  conversionRate: {
    id: 'conversionRate',
    name: 'Tasa de Conversión',
    shortDefinition: 'Prospectos convertidos a inscritos',
    formula: 'Inscritos / Total Prospectos Nuevos',
    unit: 'percentage',
    directionGood: 'up',
    code: 'D-14'
  },
  revenueReal: {
    id: 'revenueReal',
    name: 'Ingreso Real',
    shortDefinition: 'Efectivo ingresado a caja en el periodo',
    formula: 'Σ(Pagos) donde fecha pago entre start y end',
    unit: 'currency',
    directionGood: 'up',
    code: 'D-15'
  },
  unpaidDebt: {
    id: 'unpaidDebt',
    name: 'Cartera Vencida',
    shortDefinition: 'Monto de cargos vencidos no pagados',
    formula: 'Σ(Cargos Vencidos) - Σ(Pagos a Cargos Vencidos)',
    unit: 'currency',
    directionGood: 'down',
    code: 'D-16'
  },
  paymentStatus: {
    id: 'paymentStatus',
    name: 'Estatus de Pago',
    shortDefinition: 'Clasificación de cuenta por días de atraso',
    formula: 'Clasificación: Al Corriente (0), Atraso (1-15), Morosidad (16-30), Incobrable (>90)',
    unit: 'count',
    directionGood: 'up',
    code: 'D-17'
  },
  revenuePerSession: {
    id: 'revenuePerSession',
    name: 'Ingreso por Sesión',
    shortDefinition: 'Monto promedio cobrado por clase asistida',
    formula: 'Ingreso Real / Total Sesiones Impartidas',
    unit: 'currency',
    directionGood: 'up',
    code: 'D-18'
  },
  profitabilityHourly: {
    id: 'profitabilityHourly',
    name: 'Rentabilidad Hora-Carril',
    shortDefinition: 'Margen operativo por franja y carril',
    formula: '(Ingreso Franja - Costo Franja) / Horas',
    unit: 'currency',
    directionGood: 'up',
    code: 'D-19'
  },
  healthIndex: {
    id: 'healthIndex',
    name: 'Índice de Salud',
    shortDefinition: 'Calificación ponderada del negocio (0-100)',
    formula: '0.3*Conv + 0.3*Ret + 0.15*Ocup + 0.15*Fin + 0.1*Clima',
    unit: 'index',
    directionGood: 'up',
    code: 'D-20'
  },
  cohorts: {
    id: 'cohorts',
    name: 'Matriz de Cohortes',
    shortDefinition: 'Evolución de retención por mes de ingreso',
    formula: 'Matriz (Mes Ingreso) x (Meses Transcurridos)',
    unit: 'percentage',
    directionGood: 'up',
    code: 'D-21'
  },
  goalProgress: {
    id: 'goalProgress',
    name: 'Avance de Meta',
    shortDefinition: 'Porcentaje de avance hacia la meta de ingresos',
    formula: 'Ingreso Real / Meta Ingreso del Periodo',
    unit: 'percentage',
    directionGood: 'up',
    code: 'D-22'
  }
};
