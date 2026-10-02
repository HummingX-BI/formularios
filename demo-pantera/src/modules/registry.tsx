import { lazy } from 'react';
import type { ComponentType } from 'react';

export type ModuleLevel = 'E' | 'S' | 'P';

export interface AppModule {
  id: string;
  categoryId: number;
  title: string;
  level: ModuleLevel;
  route: string;
  icon: string;
  shortDescription: string;
  businessQuestion: string;
  component: React.LazyExoticComponent<ComponentType>;
}

export const MODULE_REGISTRY: AppModule[] = [
  {
    id: "M1.1",
    categoryId: 1,
    title: "Resumen ejecutivo",
    level: "E",
    route: "/c01/m1-1",
    icon: "Activity",
    shortDescription: "Desc para Resumen ejecutivo",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c01/M1_1_Executive'))
  },
  {
    id: "M1.2",
    categoryId: 1,
    title: "Índice de salud del negocio",
    level: "E",
    route: "/c01/m1-2",
    icon: "Activity",
    shortDescription: "Desc para Índice de salud del negocio",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c01/M1_2_Health'))
  },
  {
    id: "M1.3",
    categoryId: 1,
    title: "Alertas y briefing semanal",
    level: "S",
    route: "/c01/m1-3",
    icon: "Activity",
    shortDescription: "Desc para Alertas y briefing semanal",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c01/M1_3_Alerts'))
  },
  {
    id: "M1.4",
    categoryId: 1,
    title: "Centro de reportes",
    level: "P",
    route: "/c01/m1-4",
    icon: "Activity",
    shortDescription: "Desc para Centro de reportes",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c01/M1_4_Reports'))
  },
  {
    id: "M2.1",
    categoryId: 2,
    title: "Expediente 360",
    level: "S",
    route: "/c02/m2-1",
    icon: "Activity",
    shortDescription: "Desc para Expediente 360",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c02/M2_1_Profile'))
  },
  {
    id: "M2.2",
    categoryId: 2,
    title: "Inscripciones, reinscripciones y reservas",
    level: "P",
    route: "/c02/m2-2",
    icon: "Activity",
    shortDescription: "Desc para Inscripciones, reinscripciones y reservas",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c02/M2_2_Enrollment'))
  },
  {
    id: "M2.3",
    categoryId: 2,
    title: "Grupos y horarios",
    level: "S",
    route: "/c02/m2-3",
    icon: "Activity",
    shortDescription: "Desc para Grupos y horarios",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c02/M2_3_Schedule'))
  },
  {
    id: "M2.4",
    categoryId: 2,
    title: "Asistencia y reposiciones",
    level: "P",
    route: "/c02/m2-4",
    icon: "Activity",
    shortDescription: "Desc para Asistencia y reposiciones",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c02/M2_4_Attendance'))
  },
  {
    id: "M2.5",
    categoryId: 2,
    title: "Niveles y progreso",
    level: "S",
    route: "/c02/m2-5",
    icon: "Activity",
    shortDescription: "Desc para Niveles y progreso",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c02/M2_5_Progress'))
  },
  {
    id: "M2.6",
    categoryId: 2,
    title: "Lista de espera",
    level: "P",
    route: "/c02/m2-6",
    icon: "Activity",
    shortDescription: "Desc para Lista de espera",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c02/M2_6_Waitlist'))
  },
  {
    id: "M2.7",
    categoryId: 2,
    title: "Credencial digital",
    level: "P",
    route: "/c02/m2-7",
    icon: "Activity",
    shortDescription: "Desc para Credencial digital",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c02/M2_7_IDCard'))
  },
  {
    id: "M3.1",
    categoryId: 3,
    title: "Directorio, turnos y horas",
    level: "P",
    route: "/c03/m3-1",
    icon: "Activity",
    shortDescription: "Desc para Directorio, turnos y horas",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c03/M3_1_Directory'))
  },
  {
    id: "M3.2",
    categoryId: 3,
    title: "Nómina y comisiones",
    level: "P",
    route: "/c03/m3-2",
    icon: "Activity",
    shortDescription: "Desc para Nómina y comisiones",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c03/M3_2_Payroll'))
  },
  {
    id: "M3.3",
    categoryId: 3,
    title: "Ficha de desempeño del instructor",
    level: "S",
    route: "/c03/m3-3",
    icon: "Activity",
    shortDescription: "Desc para Ficha de desempeño del instructor",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c03/M3_3_InstructorScorecard'))
  },
  {
    id: "M4.1",
    categoryId: 4,
    title: "Pagos y adeudos",
    level: "P",
    route: "/c04/m4-1",
    icon: "Activity",
    shortDescription: "Desc para Pagos y adeudos",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c04/M4_1_Payments'))
  },
  {
    id: "M4.2",
    categoryId: 4,
    title: "Estado de cuenta por familia",
    level: "P",
    route: "/c04/m4-2",
    icon: "Activity",
    shortDescription: "Desc para Estado de cuenta por familia",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c04/M4_2_AccountStatement'))
  },
  {
    id: "M4.3",
    categoryId: 4,
    title: "Cartera vencida",
    level: "S",
    route: "/c04/m4-3",
    icon: "Activity",
    shortDescription: "Desc para Cartera vencida",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c04/M4_3_PastDue'))
  },
  {
    id: "M4.4",
    categoryId: 4,
    title: "Ingreso real contra facturable",
    level: "S",
    route: "/c04/m4-4",
    icon: "Activity",
    shortDescription: "Desc para Ingreso real contra facturable",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c04/M4_4_RevenueVsBillable'))
  },
  {
    id: "M4.5",
    categoryId: 4,
    title: "Ticket promedio y LTV",
    level: "E",
    route: "/c04/m4-5",
    icon: "Activity",
    shortDescription: "Desc para Ticket promedio y LTV",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c04/M4_5_LTV'))
  },
  {
    id: "M4.6",
    categoryId: 4,
    title: "Rentabilidad",
    level: "E",
    route: "/c04/m4-6",
    icon: "Activity",
    shortDescription: "Desc para Rentabilidad",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('./c04/M4_6_Profitability'))
  },
  {
    id: "M5.1",
    categoryId: 5,
    title: "CRM de prospectos",
    level: "S",
    route: "/c05/m5-1",
    icon: "Users",
    shortDescription: "Kanban de prospectos",
    businessQuestion: "¿En qué etapa están mis prospectos?",
    component: lazy(() => import('./c05/M5_1_CRM'))
  },
  {
    id: "M5.2",
    categoryId: 5,
    title: "Embudo",
    level: "E",
    route: "/c05/m5-2",
    icon: "Filter",
    shortDescription: "Conversión de ventas",
    businessQuestion: "¿Cuántos prospectos llegaron este mes, cuántos se quedaron y cuántos se fueron por precio?",
    component: lazy(() => import('./c05/M5_2_Funnel'))
  },
  {
    id: "M5.3",
    categoryId: 5,
    title: "Motivos de pérdida",
    level: "S",
    route: "/c05/m5-3",
    icon: "Activity",
    shortDescription: "Por qué no compran",
    businessQuestion: "¿Por qué se van los prospectos?",
    component: lazy(() => import('./c05/M5_3_LossReasons'))
  },
  {
    id: "M5.4",
    categoryId: 5,
    title: "Fuentes de captación",
    level: "S",
    route: "/c05/m5-4",
    icon: "Target",
    shortDescription: "Canales de adquisición",
    businessQuestion: "¿Qué campañas traen alumnos?",
    component: lazy(() => import('./c05/M5_4_Sources'))
  },
  {
    id: "M5.5",
    categoryId: 5,
    title: "Agente de ventas autónomo",
    level: "E",
    route: "/c05/m5-5",
    icon: "MessageSquare",
    shortDescription: "Recepción por IA",
    businessQuestion: "¿Cuánta fricción le quita a recepción un agente que atiende solo?",
    component: lazy(() => import('./c05/M5_5_Agent'))
  },
  {
    id: "M6.1",
    categoryId: 6,
    title: "Mapa de calor de ocupación",
    level: "E",
    route: "/c06/m6-1",
    icon: "Grid",
    shortDescription: "Ocupación por horario",
    businessQuestion: "¿Cuándo estoy lleno y cuándo estoy vacío?",
    component: lazy(() => import('./c06/M6_1_Occupancy'))
  },
  {
    id: "M6.2",
    categoryId: 6,
    title: "Detector de saturación",
    level: "E",
    route: "/c06/m6-2",
    icon: "AlertTriangle",
    shortDescription: "Análisis de pérdidas",
    businessQuestion: "¿Cuánto dinero pierdo por franjas llenas y vacías?",
    component: lazy(() => import('./c06/M6_2_Saturation'))
  },
  {
    id: "M6.3",
    categoryId: 6,
    title: "Optimizador de horarios",
    level: "S",
    route: "/c06/m6-3",
    icon: "Zap",
    shortDescription: "Sugerencias de movimiento",
    businessQuestion: "¿Cómo consolido mis grupos subutilizados?",
    component: lazy(() => import('./c06/M6_3_Optimizer'))
  },
  {
    id: "M6.4",
    categoryId: 6,
    title: "Simulador de grupo nuevo",
    level: "S",
    route: "/c06/m6-4",
    icon: "PlusCircle",
    shortDescription: "Riesgo de apertura",
    businessQuestion: "¿Debo abrir un nuevo grupo en este horario?",
    component: lazy(() => import('./c06/M6_4_Simulator'))
  },
  {
    id: "M7.1",
    categoryId: 7,
    title: "Riesgo de baja predictivo",
    level: "E",
    route: "/c07/m7-1",
    icon: "ShieldAlert",
    shortDescription: "Modelo predictivo (Regresión Logística)",
    businessQuestion: "¿A quién estoy a punto de perder y por qué?",
    component: lazy(() => import('./c07/M7_1_Risk'))
  },
  {
    id: "M7.2",
    categoryId: 7,
    title: "Supervivencia",
    level: "E",
    route: "/c07/m7-2",
    icon: "Activity",
    shortDescription: "Curvas de Kaplan-Meier",
    businessQuestion: "¿Cuánto tiempo se queda un alumno típico y de qué depende?",
    component: lazy(() => import('./c07/M7_2_Survival'))
  },
  {
    id: "M7.3",
    categoryId: 7,
    title: "Cohortes",
    level: "E",
    route: "/c07/m7-3",
    icon: "Grid",
    shortDescription: "Evolución de retención",
    businessQuestion: "¿Mi operación mejora o empeora con el tiempo?",
    component: lazy(() => import('./c07/M7_3_Cohorts'))
  },
  {
    id: "M7.4",
    categoryId: 7,
    title: "Motivos de baja",
    level: "S",
    route: "/c07/m7-4",
    icon: "HelpCircle",
    shortDescription: "Razones de deserción",
    businessQuestion: "¿Por qué se van los alumnos?",
    component: lazy(() => import('./c07/M7_4_LossReasons'))
  },
  {
    id: "M7.5",
    categoryId: 7,
    title: "Plan de retención",
    level: "S",
    route: "/c07/m7-5",
    icon: "CheckSquare",
    shortDescription: "Acciones recomendadas",
    businessQuestion: "¿Qué acciones tomar y cuánto retorno darán?",
    component: lazy(() => import('./c07/M7_5_RetentionPlan'))
  },
  {
    id: "M8.1",
    categoryId: 8,
    title: "Embudo de niveles",
    level: "E",
    route: "/c08/m8-1",
    icon: "Filter",
    shortDescription: "Flujo y estancamiento",
    businessQuestion: "¿En qué nivel se atoran mis alumnos?",
    component: lazy(() => import('./c08/M8_1_LevelFunnel'))
  },
  {
    id: "M8.2",
    categoryId: 8,
    title: "Tiempo por nivel",
    level: "S",
    route: "/c08/m8-2",
    icon: "Clock",
    shortDescription: "Distribución de tiempos",
    businessQuestion: "¿Cuánto tardan los alumnos en avanzar?",
    component: lazy(() => import('./c08/M8_2_TimeInLevel'))
  },
  {
    id: "M8.3",
    categoryId: 8,
    title: "Efectividad por instructor",
    level: "S",
    route: "/c08/m8-3",
    icon: "Award",
    shortDescription: "Retención docente",
    businessQuestion: "¿Qué instructor retiene mejor y por qué?",
    component: lazy(() => import('./c08/M8_3_InstructorEffectiveness'))
  },
  {
    id: "M9.1",
    categoryId: 9,
    title: "Estadística descriptiva",
    level: "S",
    route: "/c09/m9-1",
    icon: "BarChart2",
    shortDescription: "Distribución y métricas",
    businessQuestion: "¿Cómo se distribuyen mis alumnos y mis cifras?",
    component: lazy(() => import('./c09/M9_1_Descriptive'))
  },
  {
    id: "M9.2",
    categoryId: 9,
    title: "Percentiles y cuantiles",
    level: "S",
    route: "/c09/m9-2",
    icon: "Percent",
    shortDescription: "Posición relativa",
    businessQuestion: "¿Dónde está un alumno respecto a los demás?",
    component: lazy(() => import('./c09/M9_2_Percentiles'))
  },
  {
    id: "M9.3",
    categoryId: 9,
    title: "Binomial y Poisson",
    level: "E",
    route: "/c09/m9-3",
    icon: "Activity",
    shortDescription: "Probabilidad de eventos",
    businessQuestion: "¿Qué tan realistas son mis metas de inscripción y bajas?",
    component: lazy(() => import('./c09/M9_3_BinomialPoisson'))
  },
  {
    id: "M9.4",
    categoryId: 9,
    title: "Probabilidad condicional",
    level: "E",
    route: "/c09/m9-4",
    icon: "GitMerge",
    shortDescription: "Teorema de Bayes",
    businessQuestion: "Si ocurre X, ¿qué tan probable es que ocurra Y?",
    component: lazy(() => import('./c09/M9_4_Bayes'))
  },
  {
    id: "M9.5",
    categoryId: 9,
    title: "Intervalos y pruebas de hipótesis",
    level: "S",
    route: "/c09/m9-5",
    icon: "Activity",
    shortDescription: "Evaluación de diferencias",
    businessQuestion: "¿Esta diferencia es real o puede ser azar?",
    component: lazy(() => import('./c09/M9_5_Inference'))
  },
  {
    id: "M9.6",
    categoryId: 9,
    title: "Correlaciones",
    level: "S",
    route: "/c09/m9-6",
    icon: "Activity",
    shortDescription: "Relaciones entre variables",
    businessQuestion: "¿Qué variables se mueven juntas en mi escuela?",
    component: lazy(() => import('./c09/M9_6_Correlations'))
  },
  {
    id: "M9.7",
    categoryId: 9,
    title: "Regresiones",
    level: "E",
    route: "/c09/m9-7",
    icon: "Activity",
    shortDescription: "Modelos predictivos",
    businessQuestion: "¿Qué factores explican cuánto se queda un alumno y cómo se comportan?",
    component: lazy(() => import('./c09/M9_7_Regressions'))
  },
  {
    id: "M9.8",
    categoryId: 9,
    title: "Series de tiempo y estacionalidad",
    level: "S",
    route: "/c09/m9-8",
    icon: "Activity",
    shortDescription: "Análisis de temporadas",
    businessQuestion: "¿Qué parte de mis altibajos es temporada y qué parte es tendencia?",
    component: lazy(() => import('./c09/M9_8_TimeSeries'))
  },
  {
    id: "M10.1",
    categoryId: 10,
    title: "Catálogo y desempeño de modelos",
    level: "S",
    route: "/c10/m10-1",
    icon: "Brain",
    shortDescription: "Transparencia algorítmica",
    businessQuestion: "¿Qué modelos están corriendo detrás de mi escuela?",
    component: lazy(() => import('./c10/M10_1_ModelCatalog'))
  },
  {
    id: "M10.2",
    categoryId: 10,
    title: "Segmentación de familias",
    level: "E",
    route: "/c10/m10-2",
    icon: "Users",
    shortDescription: "Perfiles automáticos",
    businessQuestion: "¿Qué tipos de familias tengo y qué necesita cada una?",
    component: lazy(() => import('./c10/M10_2_FamilySegmentation'))
  },
  {
    id: "M10.3",
    categoryId: 10,
    title: "Pronóstico de inscripciones e ingresos",
    level: "E",
    route: "/c10/m10-3",
    icon: "TrendingUp",
    shortDescription: "Proyección a 6 meses",
    businessQuestion: "¿Qué va a pasar en los próximos 6 meses?",
    component: lazy(() => import('./c10/M10_3_Forecast'))
  },
  {
    id: "M10.4",
    categoryId: 10,
    title: "Simulador de escenarios Monte Carlo",
    level: "S",
    route: "/c10/m10-4",
    icon: "Dices",
    shortDescription: "Probabilidad de metas",
    businessQuestion: "¿Qué tan probable es que llegue a mi meta de ingresos?",
    component: lazy(() => import('./c10/M10_4_MonteCarlo'))
  },
  {
    id: "M11.1",
    categoryId: 11,
    title: "Recomendaciones priorizadas",
    level: "S",
    route: "/c11/m11-1",
    icon: "Lightbulb",
    shortDescription: "Sugerencias inteligentes",
    businessQuestion: "¿Qué debo hacer hoy para mejorar mi escuela?",
    component: lazy(() => import('./c11/M11_1_Recommendations'))
  },
  {
    id: "M11.2",
    categoryId: 11,
    title: "Simulador de escenarios",
    level: "E",
    route: "/c11/m11-2",
    icon: "SlidersHorizontal",
    shortDescription: "Modelado What-If",
    businessQuestion: "¿Qué pasa si muevo precio, descuentos, grupos o retención?",
    component: lazy(() => import('./c11/M11_2_Simulator'))
  },
  {
    id: "M11.3",
    categoryId: 11,
    title: "Plan de acción y medición",
    level: "S",
    route: "/c11/m11-3",
    icon: "CheckSquare",
    shortDescription: "Kanban de tareas",
    businessQuestion: "¿Qué estamos haciendo y está funcionando?",
    component: lazy(() => import('./c11/M11_3_ActionPlan'))
  },
  {
    id: "M12.1",
    categoryId: 12,
    title: "Chat analítico",
    level: "E",
    route: "/c12/m12-1",
    icon: "Activity",
    shortDescription: "Desc para Chat analítico",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('@/ui/ModulePlaceholder').then(m => ({ default: () => <m.ModulePlaceholder id="M12.1" /> })))
  },
  {
    id: "M12.2",
    categoryId: 12,
    title: "Glosario y explicador",
    level: "S",
    route: "/c12/m12-2",
    icon: "Activity",
    shortDescription: "Desc para Glosario y explicador",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('@/ui/ModulePlaceholder').then(m => ({ default: () => <m.ModulePlaceholder id="M12.2" /> })))
  },
  {
    id: "M13.1",
    categoryId: 13,
    title: "SEO y analítica del sitio",
    level: "S",
    route: "/c13/m13-1",
    icon: "Activity",
    shortDescription: "Desc para SEO y analítica del sitio",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('@/ui/ModulePlaceholder').then(m => ({ default: () => <m.ModulePlaceholder id="M13.1" /> })))
  },
  {
    id: "M13.2",
    categoryId: 13,
    title: "Notificaciones y campañas",
    level: "P",
    route: "/c13/m13-2",
    icon: "Activity",
    shortDescription: "Desc para Notificaciones y campañas",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('@/ui/ModulePlaceholder').then(m => ({ default: () => <m.ModulePlaceholder id="M13.2" /> })))
  },
  {
    id: "M13.3",
    categoryId: 13,
    title: "Catálogos y configuración",
    level: "P",
    route: "/c13/m13-3",
    icon: "Activity",
    shortDescription: "Desc para Catálogos y configuración",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('@/ui/ModulePlaceholder').then(m => ({ default: () => <m.ModulePlaceholder id="M13.3" /> })))
  },
  {
    id: "M13.4",
    categoryId: 13,
    title: "Vistas previas y modo demo",
    level: "P",
    route: "/c13/m13-4",
    icon: "Activity",
    shortDescription: "Desc para Vistas previas y modo demo",
    businessQuestion: "¿Pregunta de negocio?",
    component: lazy(() => import('@/ui/ModulePlaceholder').then(m => ({ default: () => <m.ModulePlaceholder id="M13.4" /> })))
  },
];

export const CATEGORIES = [
  { id: 1, title: 'Centro de mando', icon: 'LayoutDashboard' },
  { id: 2, title: 'Operación académica', icon: 'GraduationCap' },
  { id: 3, title: 'Personal e instructores', icon: 'Users' },
  { id: 4, title: 'Cobranza y finanzas', icon: 'CircleDollarSign' },
  { id: 5, title: 'Embudo comercial', icon: 'TrendingUp' },
  { id: 6, title: 'Capacidad y ocupación', icon: 'Maximize' },
  { id: 7, title: 'Retención y churn', icon: 'HeartHandshake' },
  { id: 8, title: 'Desempeño pedagógico', icon: 'Medal' },
  { id: 9, title: 'Laboratorio estadístico', icon: 'BarChart3' },
  { id: 10, title: 'Machine Learning', icon: 'BrainCircuit' },
  { id: 11, title: 'Prescriptivo', icon: 'Lightbulb' },
  { id: 12, title: 'Asistente IA', icon: 'MessageSquare' },
  { id: 13, title: 'Sitio y configuración', icon: 'Settings' }
];
