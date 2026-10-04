import { formatCurrency, formatPercent } from './templates';

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  exampleGenerator?: (metrics: Record<string, any>) => string;
  relatedModule?: string;
}

export const glossary: GlossaryTerm[] = [
  {
    id: 'churn',
    term: 'Churn (Deserción)',
    definition: 'Porcentaje de alumnos que abandonan la escuela en un periodo determinado.',
    exampleGenerator: (m) => (m.churn ? `Tu churn actual es del ${formatPercent(m.churn)}.` : ''),
    relatedModule: 'm2-health',
  },
  {
    id: 'retencion',
    term: 'Retención',
    definition: 'Porcentaje de alumnos que continúan inscritos de un periodo a otro.',
    exampleGenerator: (m) =>
      m.retencion ? `Tu retención es del ${formatPercent(m.retencion)}.` : '',
    relatedModule: 'm2-health',
  },
  {
    id: 'cohorte',
    term: 'Cohorte',
    definition: 'Grupo de alumnos que se inscribieron en el mismo mes o periodo.',
    relatedModule: 'm2-health',
  },
  {
    id: 'ltv',
    term: 'Life Time Value (LTV)',
    definition:
      'Valor monetario total que un alumno aporta a la escuela durante toda su permanencia.',
    exampleGenerator: (m) =>
      m.ltv ? `El LTV promedio actual es de ${formatCurrency(m.ltv)}.` : '',
    relatedModule: 'm4-ltv',
  },
  {
    id: 'ticket-promedio',
    term: 'Ticket Promedio',
    definition: 'Ingreso promedio generado por alumno en un mes.',
    exampleGenerator: (m) =>
      m.ticket ? `Tu ticket promedio es de ${formatCurrency(m.ticket)}.` : '',
    relatedModule: 'm4-ltv',
  },
  {
    id: 'ocupacion-cupo',
    term: 'Ocupación de cupo',
    definition: 'Porcentaje de lugares ocupados respecto a la capacidad total de la escuela.',
    exampleGenerator: (m) =>
      m.ocupacion ? `La ocupación actual es ${formatPercent(m.ocupacion)}.` : '',
    relatedModule: 'm1-executive',
  },
  {
    id: 'hora-carril',
    term: 'Hora-carril',
    definition: 'Métrica de capacidad que representa un carril disponible durante una hora.',
    relatedModule: 'm6-operations',
  },
  {
    id: 'percentil',
    term: 'Percentil',
    definition:
      'Medida estadística que indica el valor por debajo del cual se encuentra un porcentaje dado de observaciones.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'sesgo',
    term: 'Sesgo (Asimetría)',
    definition:
      'Medida de la asimetría de la distribución de probabilidad de una variable respecto a su media.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'curtosis',
    term: 'Curtosis',
    definition:
      'Medida estadística que determina el grado de concentración que presentan los valores alrededor de la zona central de la distribución.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'binomial',
    term: 'Distribución Binomial',
    definition:
      'Distribución de probabilidad discreta que describe el número de éxitos al realizar n experimentos independientes.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'poisson',
    term: 'Distribución Poisson',
    definition:
      'Distribución que expresa la probabilidad de que ocurra un número de eventos en un tiempo fijo.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'bayes',
    term: 'Teorema de Bayes',
    definition:
      'Teorema que describe la probabilidad de un evento basado en el conocimiento previo de las condiciones que podrían estar relacionadas.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'prob-condicional',
    term: 'Probabilidad Condicional',
    definition: 'Probabilidad de que ocurra un evento A, dado que ya ha ocurrido un evento B.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'regresion-lineal',
    term: 'Regresión Lineal',
    definition:
      'Modelo matemático que describe la relación entre una variable dependiente y una o más independientes.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'r-cuadrada',
    term: 'R cuadrada (R²)',
    definition:
      'Proporción de la varianza en la variable dependiente que es predecible a partir de la independiente.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'valor-p',
    term: 'Valor p (p-value)',
    definition:
      'Probabilidad de obtener un resultado al menos tan extremo como el observado, suponiendo que la hipótesis nula es cierta.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'intervalo-confianza',
    term: 'Intervalo de Confianza',
    definition:
      'Rango de valores calculado a partir de los datos que es probable que contenga el valor real de un parámetro poblacional.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'supervivencia',
    term: 'Curva de Supervivencia',
    definition:
      'Gráfica que muestra la proporción de alumnos que permanecen activos a lo largo del tiempo.',
    relatedModule: 'm8-retention',
  },
  {
    id: 'kaplan-meier',
    term: 'Kaplan-Meier',
    definition:
      'Estimador no paramétrico utilizado para calcular la probabilidad de supervivencia en el tiempo considerando la censura.',
    relatedModule: 'm8-retention',
  },
  {
    id: 'k-means',
    term: 'K-Means (Segmentación)',
    definition:
      'Algoritmo de agrupación que particiona un conjunto de datos en k grupos basándose en similitudes.',
    relatedModule: 'm9-segmentation',
  },
  {
    id: 'auc',
    term: 'AUC (Area Under the Curve)',
    definition:
      'Métrica de rendimiento para problemas de clasificación; representa el grado de separabilidad del modelo.',
    relatedModule: 'm11-ml',
  },
  {
    id: 'matriz-confusion',
    term: 'Matriz de Confusión',
    definition:
      'Tabla que se utiliza para evaluar el desempeño de un modelo de clasificación mostrando los verdaderos/falsos positivos/negativos.',
    relatedModule: 'm11-ml',
  },
  {
    id: 'estacionalidad',
    term: 'Estacionalidad',
    definition:
      'Variaciones periódicas y predecibles en los datos (ej. picos de inscripciones en enero y agosto).',
    relatedModule: 'm10-stats',
  },
  {
    id: 'monte-carlo',
    term: 'Simulación Monte Carlo',
    definition:
      'Técnica matemática que predice resultados posibles evaluando rangos de riesgo mediante variables aleatorias repetidas.',
    relatedModule: 'm12-forecast',
  },
  // Adding the rest up to 45
  {
    id: 'conversion',
    term: 'Tasa de Conversión',
    definition: 'Porcentaje de prospectos que terminan inscribiéndose.',
    relatedModule: 'm5-funnel',
  },
  {
    id: 'prospecto',
    term: 'Prospecto (Lead)',
    definition:
      'Persona interesada en los servicios que ha dejado sus datos pero aún no se inscribe.',
    relatedModule: 'm5-funnel',
  },
  {
    id: 'arpu',
    term: 'ARPU',
    definition: 'Ingreso Promedio por Usuario (Average Revenue Per User).',
    relatedModule: 'm4-ltv',
  },
  {
    id: 'cac',
    term: 'CAC',
    definition: 'Costo de Adquisición de Cliente: cuánto cuesta atraer a un nuevo alumno.',
    relatedModule: 'm4-ltv',
  },
  { id: 'roi', term: 'ROI', definition: 'Retorno sobre la Inversión.', relatedModule: 'm4-ltv' },
  {
    id: 'mrr',
    term: 'MRR',
    definition: 'Ingreso Recurrente Mensual (Monthly Recurring Revenue).',
    relatedModule: 'm1-executive',
  },
  {
    id: 'cagr',
    term: 'CAGR',
    definition: 'Tasa de Crecimiento Anual Compuesto.',
    relatedModule: 'm1-executive',
  },
  {
    id: 'breakeven',
    term: 'Punto de Equilibrio',
    definition: 'Punto donde los ingresos igualan a los costos totales.',
    relatedModule: 'm1-executive',
  },
  {
    id: 'censura',
    term: 'Censura (en supervivencia)',
    definition:
      'Ocurre cuando la información sobre el tiempo de supervivencia de un alumno está incompleta.',
    relatedModule: 'm8-retention',
  },
  {
    id: 'log-rank',
    term: 'Prueba Log-Rank',
    definition:
      'Prueba de hipótesis estadística que compara estimaciones de supervivencia de dos muestras.',
    relatedModule: 'm8-retention',
  },
  {
    id: 'regresion-logistica',
    term: 'Regresión Logística',
    definition:
      'Modelo estadístico usado para predecir la probabilidad de una variable dicotómica (ej. baja vs no baja).',
    relatedModule: 'm11-ml',
  },
  {
    id: 'precision',
    term: 'Precisión',
    definition: 'Proporción de predicciones positivas que fueron correctas.',
    relatedModule: 'm11-ml',
  },
  {
    id: 'recall',
    term: 'Recall (Sensibilidad)',
    definition: 'Proporción de casos positivos reales que fueron identificados correctamente.',
    relatedModule: 'm11-ml',
  },
  {
    id: 'f1-score',
    term: 'F1 Score',
    definition: 'Media armónica entre precisión y recall.',
    relatedModule: 'm11-ml',
  },
  {
    id: 'overfitting',
    term: 'Overfitting',
    definition: 'Sobreajuste de un modelo a los datos de entrenamiento.',
    relatedModule: 'm11-ml',
  },
  {
    id: 'underfitting',
    term: 'Underfitting',
    definition: 'Subajuste de un modelo a los datos de entrenamiento.',
    relatedModule: 'm11-ml',
  },
  {
    id: 'pca',
    term: 'PCA',
    definition: 'Análisis de Componentes Principales, técnica de reducción de dimensionalidad.',
    relatedModule: 'm9-segmentation',
  },
  {
    id: 'varianza',
    term: 'Varianza',
    definition:
      'Medida de dispersión que representa la variabilidad de una serie de datos respecto a su media.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'desviacion-estandar',
    term: 'Desviación Estándar',
    definition: 'Raíz cuadrada de la varianza; indica cuánto se alejan los datos de la media.',
    relatedModule: 'm10-stats',
  },
  {
    id: 'outlier',
    term: 'Valor Atípico (Outlier)',
    definition: 'Observación que numéricamente es muy distinta al resto de la muestra.',
    relatedModule: 'm10-stats',
  },
];

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return glossary.find((t) => t.id === id);
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.toLowerCase();
  return glossary.filter(
    (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
  );
}
