import { lazy } from 'react';
import type { ComponentType } from 'react';

const AboutDemoPage = lazy(() => import('./system/AboutDemoPage'));
const PerfPage = lazy(() => import('./system/PerfPage'));
const CheatsheetPage = lazy(() => import('./system/CheatsheetPage'));

export type ModuleLevel = 'E' | 'S' | 'P';

export interface ModuleTab {
  slug: string;
  title: string;
  legacyIds: string[];
  component: React.LazyExoticComponent<ComponentType>;
}

export interface AppModule {
  id: string;
  categoryId: number;
  title: string;
  level: ModuleLevel;
  route: string;
  icon: string;
  shortDescription: string;
  businessQuestion: string;
  component?: React.LazyExoticComponent<ComponentType>;
  tabs?: ModuleTab[];
  legacyIds?: string[];
  visibility?: 'always' | 'demo';
}

export const CATEGORIES = [
  { id: 1, title: 'Centro de Mando', icon: 'LayoutDashboard' },
  { id: 2, title: 'Alumnos y Clases', icon: 'GraduationCap' },
  { id: 3, title: 'Equipo e Instructores', icon: 'Users' },
  { id: 4, title: 'Finanzas y Cobranza', icon: 'CircleDollarSign' },
  { id: 5, title: 'Ventas y Automatización', icon: 'Megaphone' },
  { id: 6, title: 'Capacidad y Ocupación', icon: 'Maximize' },
  { id: 7, title: 'Retención de Alumnos', icon: 'HeartHandshake' },
  { id: 8, title: 'Inteligencia y Pronósticos', icon: 'BrainCircuit' },
  { id: 9, title: 'Reportes y Configuración', icon: 'Settings' },
];

export const MODULE_REGISTRY: AppModule[] = [
  {
    id: 'mando-resumen',
    categoryId: 1,
    title: 'Resumen ejecutivo',
    level: 'E',
    route: '/mando/resumen',
    icon: 'Activity',
    shortDescription: 'Vista rápida de la escuela',
    businessQuestion: '¿Cómo está operando la escuela hoy?',
    component: lazy(() => import('./c01/M1_1_Executive')),
    legacyIds: ['M1.1'],
  },
  {
    id: 'mando-salud',
    categoryId: 1,
    title: 'Salud del negocio y metas',
    level: 'E',
    route: '/mando/salud',
    icon: 'Activity',
    shortDescription: 'Calificación integral',
    businessQuestion: '¿Qué tan saludable está mi negocio en todos sus pilares?',
    tabs: [
      { slug: 'indice', title: 'Índice de Salud', legacyIds: ['M1.2'], component: lazy(() => import('./c01/M1_2_Health')) },
      { slug: 'metas', title: 'Auditoría y Metas', legacyIds: ['M9.1'], component: lazy(() => import('./c09/M9_1_Descriptive')) }
    ]
  },
  {
    id: 'mando-alertas',
    categoryId: 1,
    title: 'Alertas y recomendaciones',
    level: 'S',
    route: '/mando/alertas',
    icon: 'Activity',
    shortDescription: 'Puntos de atención urgente',
    businessQuestion: '¿En qué debo enfocar mi atención esta semana?',
    tabs: [
      { slug: 'alertas', title: 'Briefing Semanal', legacyIds: ['M1.3'], component: lazy(() => import('./c01/M1_3_Alerts')) },
      { slug: 'recomendaciones', title: 'Recomendaciones Priorizadas', legacyIds: ['M11.1'], component: lazy(() => import('./c11/M11_1_Recommendations')) }
    ]
  },
  {
    id: 'mando-plan',
    categoryId: 1,
    title: 'Plan de acción',
    level: 'S',
    route: '/mando/plan',
    icon: 'Activity',
    shortDescription: 'Seguimiento de tareas clave',
    businessQuestion: '¿Qué tareas hemos completado y cómo han impactado los números?',
    component: lazy(() => import('./c11/M11_3_ActionPlan')),
    legacyIds: ['M11.3'],
  },
  {
    id: 'alumnos-expediente',
    categoryId: 2,
    title: 'Expediente 360',
    level: 'S',
    route: '/alumnos/expediente',
    icon: 'Activity',
    shortDescription: 'Perfil completo e ID',
    businessQuestion: '¿Cuál es el historial y perfil completo de este alumno?',
    tabs: [
      { slug: 'perfil', title: 'Perfil 360', legacyIds: ['M2.1'], component: lazy(() => import('./c02/M2_1_Profile')) },
      { slug: 'credencial', title: 'Credencial e ID', legacyIds: ['M2.7'], component: lazy(() => import('./c02/M2_7_IDCard')) }
    ]
  },
  {
    id: 'alumnos-inscripciones',
    categoryId: 2,
    title: 'Inscripciones y lista de espera',
    level: 'P',
    route: '/alumnos/inscripciones',
    icon: 'Activity',
    shortDescription: 'Gestión de cupos',
    businessQuestion: '¿Cuántos alumnos nuevos inscribimos hoy o pasaron a espera?',
    tabs: [
      { slug: 'cupos', title: 'Inscripciones', legacyIds: ['M2.2'], component: lazy(() => import('./c02/M2_2_Enrollment')) },
      { slug: 'espera', title: 'Lista de Espera', legacyIds: ['M2.6'], component: lazy(() => import('./c02/M2_6_Waitlist')) }
    ]
  },
  {
    id: 'alumnos-horarios',
    categoryId: 2,
    title: 'Grupos y horarios',
    level: 'S',
    route: '/alumnos/horarios',
    icon: 'Activity',
    shortDescription: 'Organización de clases',
    businessQuestion: '¿Cómo están distribuidos mis grupos en la semana?',
    component: lazy(() => import('./c02/M2_3_Schedule')),
    legacyIds: ['M2.3'],
  },
  {
    id: 'alumnos-asistencia',
    categoryId: 2,
    title: 'Asistencia y evaluación',
    level: 'P',
    route: '/alumnos/asistencia',
    icon: 'Activity',
    shortDescription: 'Portal del Instructor',
    businessQuestion: '¿Quién faltó y qué alumnos están listos para subir de nivel?',
    tabs: [
      { slug: 'pase-lista', title: 'Pase de Lista', legacyIds: ['M2.4'], component: lazy(() => import('./c02/M2_4_Attendance')) },
      { slug: 'kardex', title: 'Kárdex y Progreso', legacyIds: ['M2.5'], component: lazy(() => import('./c02/M2_5_Progress')) }
    ]
  },
  {
    id: 'alumnos-niveles',
    categoryId: 2,
    title: 'Progreso por niveles',
    level: 'E',
    route: '/alumnos/niveles',
    icon: 'Activity',
    shortDescription: 'Alumnos estancados',
    businessQuestion: '¿En qué etapa de aprendizaje se detienen o se frustran más mis alumnos?',
    tabs: [
      { slug: 'flujo', title: 'Flujo de Niveles', legacyIds: ['M8.1'], component: lazy(() => import('./c08/M8_1_LevelFunnel')) },
      { slug: 'tiempo', title: 'Tiempo por Nivel', legacyIds: ['M8.2'], component: lazy(() => import('./c08/M8_2_TimeInLevel')) }
    ]
  },
  {
    id: 'equipo-directorio',
    categoryId: 3,
    title: 'Directorio, turnos y horas',
    level: 'P',
    route: '/equipo/directorio',
    icon: 'Activity',
    shortDescription: 'Horarios de personal',
    businessQuestion: '¿Quién está cubriendo qué turno hoy?',
    component: lazy(() => import('./c03/M3_1_Directory')),
    legacyIds: ['M3.1'],
  },
  {
    id: 'equipo-nomina',
    categoryId: 3,
    title: 'Nómina y comisiones',
    level: 'P',
    route: '/equipo/nomina',
    icon: 'Activity',
    shortDescription: 'Pagos al equipo',
    businessQuestion: '¿Cuánto me cuesta la nómina y qué bonos debo pagar?',
    component: lazy(() => import('./c03/M3_2_Payroll')),
    legacyIds: ['M3.2'],
  },
  {
    id: 'equipo-desempeno',
    categoryId: 3,
    title: 'Desempeño del instructor',
    level: 'S',
    route: '/equipo/desempeno',
    icon: 'Activity',
    shortDescription: 'Rendimiento docente',
    businessQuestion: '¿Qué instructores generan más lealtad en sus alumnos?',
    tabs: [
      { slug: 'ficha', title: 'Ficha de Desempeño', legacyIds: ['M3.3'], component: lazy(() => import('./c03/M3_3_InstructorScorecard')) },
      { slug: 'comparativa', title: 'Efectividad Comparada', legacyIds: ['M8.3'], component: lazy(() => import('./c08/M8_3_InstructorEffectiveness')) }
    ]
  },
  {
    id: 'finanzas-cobro',
    categoryId: 4,
    title: 'Punto de cobro',
    level: 'P',
    route: '/finanzas/cobro',
    icon: 'Activity',
    shortDescription: 'Registro de cobros',
    businessQuestion: '¿Cuánto se cobró hoy y qué métodos de pago se usaron?',
    component: lazy(() => import('./c04/M4_1_Payments')),
    legacyIds: ['M4.1'],
  },
  {
    id: 'finanzas-cobranza',
    categoryId: 4,
    title: 'Gestor de cobranza',
    level: 'P',
    route: '/finanzas/cobranza',
    icon: 'Activity',
    shortDescription: 'Cartera y Estados de Cuenta',
    businessQuestion: '¿Quiénes me deben dinero y cómo les cobro de inmediato?',
    tabs: [
      { slug: 'deudores', title: 'Estados de Cuenta', legacyIds: ['M4.2'], component: lazy(() => import('./c04/M4_2_AccountStatement')) },
      { slug: 'antiguedad', title: 'Antigüedad de Saldos', legacyIds: ['M4.3'], component: lazy(() => import('./c04/M4_3_PastDue')) }
    ]
  },
  {
    id: 'finanzas-rentabilidad',
    categoryId: 4,
    title: 'Rentabilidad y eficiencia',
    level: 'E',
    route: '/finanzas/rentabilidad',
    icon: 'Activity',
    shortDescription: 'Salud macroeconómica',
    businessQuestion: '¿Cuánto facturamos, cuánto cobramos y cuánto dinero quedó limpio?',
    tabs: [
      { slug: 'cfo', title: 'Facturado vs Cobrado', legacyIds: ['M4.4'], component: lazy(() => import('./c04/M4_4_RevenueVsBillable')) },
      { slug: 'hora-carril', title: 'Rentabilidad Hora-Carril', legacyIds: ['M4.6'], component: lazy(() => import('./c04/M4_6_Profitability')) }
    ]
  },
  {
    id: 'finanzas-ltv',
    categoryId: 4,
    title: 'Valor total del cliente',
    level: 'E',
    route: '/finanzas/ltv',
    icon: 'Activity',
    shortDescription: 'Ingreso proyectado por IA',
    businessQuestion: '¿Cuánto dinero dejará un alumno durante toda su vida en la escuela?',
    component: lazy(() => import('./c04/M4_5_LTV')),
    legacyIds: ['M4.5'],
  },
  {
    id: 'ventas-crm',
    categoryId: 5,
    title: 'CRM y automatización',
    level: 'S',
    route: '/ventas/crm',
    icon: 'Users',
    shortDescription: 'Atención manual y Piloto Automático',
    businessQuestion: '¿Cómo estamos atendiendo a los nuevos clientes interesados?',
    tabs: [
      { slug: 'pipeline', title: 'Pipeline CRM', legacyIds: ['M5.1'], component: lazy(() => import('./c05/M5_1_CRM')) },
      { slug: 'agente', title: 'Agente Inteligente', legacyIds: ['M5.5'], component: lazy(() => import('./c05/M5_5_Agent')) }
    ]
  },
  {
    id: 'ventas-embudo',
    categoryId: 5,
    title: 'Embudo y fugas',
    level: 'E',
    route: '/ventas/embudo',
    icon: 'Filter',
    shortDescription: 'Cierre y Motivos de pérdida',
    businessQuestion: 'De cada 100 interesados, ¿cuántos se inscriben y por qué se van los demás?',
    tabs: [
      { slug: 'embudo', title: 'Embudo de Ventas', legacyIds: ['M5.2'], component: lazy(() => import('./c05/M5_2_Funnel')) },
      { slug: 'motivos', title: 'Motivos de Pérdida', legacyIds: ['M5.3'], component: lazy(() => import('./c05/M5_3_LossReasons')) }
    ]
  },
  {
    id: 'ventas-trafico',
    categoryId: 5,
    title: 'Tráfico web y SEO',
    level: 'E',
    route: '/ventas/trafico',
    icon: 'Target',
    shortDescription: 'Visitantes del sitio web',
    businessQuestion: '¿Qué tan efectivo es el sitio web para atraer prospectos orgánicos?',
    component: lazy(() => import('./c13/M13_1_SEO')),
    legacyIds: ['M13.1'],
  },

  {
    id: 'capacidad-ocupacion',
    categoryId: 6,
    title: 'Mapa de ocupación',
    level: 'E',
    route: '/capacidad/ocupacion',
    icon: 'Grid',
    shortDescription: 'Lleno total vs Subutilizado',
    businessQuestion: '¿Cuáles son mis horarios muertos y cuáles los más saturados?',
    component: lazy(() => import('./c06/M6_1_Occupancy')),
    legacyIds: ['M6.1'],
  },
  {
    id: 'capacidad-oportunidades',
    categoryId: 6,
    title: 'Detector de oportunidades',
    level: 'E',
    route: '/capacidad/oportunidades',
    icon: 'AlertTriangle',
    shortDescription: 'Análisis de fugas financieras',
    businessQuestion: '¿Cuánto dinero estoy dejando en la mesa por mantener carriles casi vacíos?',
    component: lazy(() => import('./c06/M6_2_Saturation')),
    legacyIds: ['M6.2'],
  },
  {
    id: 'capacidad-optimizador',
    categoryId: 6,
    title: 'Optimizador de grupos',
    level: 'S',
    route: '/capacidad/optimizador',
    icon: 'Zap',
    shortDescription: 'Sugerencias para rentabilizar',
    businessQuestion: '¿Cómo agrupo mis alumnos actuales para ahorrarme instructores extra?',
    component: lazy(() => import('./c06/M6_3_Optimizer')),
    legacyIds: ['M6.3'],
  },
  {
    id: 'capacidad-simulador',
    categoryId: 6,
    title: 'Simulador de apertura',
    level: 'S',
    route: '/capacidad/simulador',
    icon: 'PlusCircle',
    shortDescription: 'Rentabilidad garantizada',
    businessQuestion: '¿Vale la pena abrir un nuevo grupo a esta hora de acuerdo a la lista de espera?',
    component: lazy(() => import('./c06/M6_4_Simulator')),
    legacyIds: ['M6.4'],
  },
  {
    id: 'retencion-riesgo',
    categoryId: 7,
    title: 'Riesgo y rescate',
    level: 'P',
    route: '/retencion/riesgo',
    icon: 'ShieldAlert',
    shortDescription: 'CRM de retención y acción',
    businessQuestion: '¿Qué alumnos estoy a punto de perder y cómo los salvo hoy mismo?',
    tabs: [
      { slug: 'riesgo', title: 'Gestor de Riesgo', legacyIds: ['M7.1'], component: lazy(() => import('./c07/M7_1_Risk')) },
      { slug: 'plan', title: 'Plan de Rescate', legacyIds: ['M7.5'], component: lazy(() => import('./c07/M7_5_RetentionPlan')) }
    ]
  },
  {
    id: 'retencion-bajas',
    categoryId: 7,
    title: 'Diagnóstico de bajas',
    level: 'S',
    route: '/retencion/bajas',
    icon: 'Activity',
    shortDescription: 'Por qué cancelan',
    businessQuestion: 'De los que ya se fueron, ¿por qué cancelaron y cuánto dinero perdimos?',
    component: lazy(() => import('./c07/M7_4_LossReasons')),
    legacyIds: ['M7.4'],
  },
  {
    id: 'retencion-lealtad',
    categoryId: 7,
    title: 'Lealtad por generaciones',
    level: 'E',
    route: '/retencion/lealtad',
    icon: 'HeartHandshake',
    shortDescription: 'Tiempo de Permanencia Promedio',
    businessQuestion: '¿Cuántos meses dura típicamente un alumno y cómo evolucionan mis generaciones?',
    tabs: [
      { slug: 'ciclo', title: 'Ciclo de Vida', legacyIds: ['M7.2'], component: lazy(() => import('./c07/M7_2_Survival')) },
      { slug: 'cohortes', title: 'Retención por Generación', legacyIds: ['M7.3'], component: lazy(() => import('./c07/M7_3_Cohorts')) }
    ]
  },
  {
    id: 'retencion-segmentacion',
    categoryId: 7,
    title: 'Segmentación de familias',
    level: 'E',
    route: '/retencion/segmentacion',
    icon: 'Users',
    shortDescription: 'Perfiles de clientes',
    businessQuestion: '¿Cuáles son mis familias más valiosas y qué tipo de servicio buscan?',
    component: lazy(() => import('./c10/M10_2_FamilySegmentation')),
    legacyIds: ['M10.2'],
  },
  {
    id: 'inteligencia-pronostico',
    categoryId: 8,
    title: 'Pronóstico de ingresos',
    level: 'E',
    route: '/inteligencia/pronostico',
    icon: 'TrendingUp',
    shortDescription: 'Visión del futuro',
    businessQuestion: 'Basado en mi estacionalidad, ¿cuánto voy a ganar o perder?',
    tabs: [
      { slug: 'corto', title: 'Corto Plazo', legacyIds: ['M9.3', 'M9.7'], component: lazy(() => import('./c09/M9_7_Regressions')) },
      { slug: 'seis-meses', title: 'Proyección 6 Meses', legacyIds: ['M10.3'], component: lazy(() => import('./c10/M10_3_Forecast')) },
      { slug: 'confiabilidad', title: 'Score de Certeza', legacyIds: ['M10.1'], component: lazy(() => import('./c10/M10_1_ModelCatalog')) }
    ]
  },
  {
    id: 'inteligencia-simulador',
    categoryId: 8,
    title: 'Simulador de escenarios',
    level: 'E',
    route: '/inteligencia/simulador',
    icon: 'SlidersHorizontal',
    shortDescription: 'Modelado "Qué Pasaría Si..."',
    businessQuestion: '¿Cuánto dinero gano o pierdo si muevo los precios u otras variables?',
    component: lazy(() => import('./c11/M11_2_Simulator')),
    legacyIds: ['M11.2'],
  },

  {
    id: 'inteligencia-laboratorio',
    categoryId: 8,
    title: 'Descubrimientos avanzados',
    level: 'E',
    route: '/inteligencia/laboratorio',
    icon: 'Activity',
    shortDescription: 'Herramientas avanzadas',
    businessQuestion: '¿Qué patrones de crecimiento me revela la IA?',
    tabs: [
      { slug: 'percentiles', title: 'Ranking de Alumnos', legacyIds: ['M9.2'], component: lazy(() => import('./c09/M9_2_Percentiles')) },
      { slug: 'binomial', title: 'Probabilidad de Éxito', legacyIds: ['M9.3'], component: lazy(() => import('./c09/M9_3_BinomialPoisson')) },
      { slug: 'correlaciones', title: 'Mapa de Causa y Efecto', legacyIds: ['M9.6'], component: lazy(() => import('./c09/M9_6_Correlations')) },
      { slug: 'series', title: 'Estacionalidad Mensual', legacyIds: ['M9.8'], component: lazy(() => import('./c09/M9_8_TimeSeries')) }
    ]
  },
  {
    id: 'inteligencia-asistente',
    categoryId: 8,
    title: 'Asistente de negocio',
    level: 'E',
    route: '/inteligencia/asistente',
    icon: 'Activity',
    shortDescription: 'Interacción en lenguaje natural',
    businessQuestion: '¿Qué le puedo preguntar al sistema directamente sobre mis datos?',
    tabs: [
      { slug: 'chat', title: 'Chatbot', legacyIds: ['M12.1'], component: lazy(() => import('./c12/M12_1_Chat')) }
    ]
  },
  {
    id: 'config-reportes',
    categoryId: 9,
    title: 'Centro de reportes',
    level: 'P',
    route: '/config/reportes',
    icon: 'Activity',
    shortDescription: 'Exportación de datos',
    businessQuestion: '¿Dónde obtengo un reporte detallado para mi contador?',
    component: lazy(() => import('./c01/M1_4_Reports')),
    legacyIds: ['M1.4'],
  },
  {
    id: 'config-comercial',
    categoryId: 9,
    title: 'Configuración comercial',
    level: 'P',
    route: '/config/comercial',
    icon: 'Activity',
    shortDescription: 'Ajustes del negocio',
    businessQuestion: '¿Cómo cambio los precios, descuentos y políticas de la escuela?',
    component: lazy(() => import('./c13/M13_3_Config')),
    legacyIds: ['M13.3'],
  },
  {
    id: 'config-entorno',
    categoryId: 9,
    title: 'Sobre el entorno',
    level: 'S',
    route: '/config/entorno',
    icon: 'info',
    shortDescription: 'Alcances y permisos',
    businessQuestion: '¿Qué módulos tengo activos y cuáles son mis límites operativos?',
    component: AboutDemoPage,
    legacyIds: ['M13.5'],
  },
  {
    id: 'config-demo',
    categoryId: 9,
    title: 'Centro de demostración',
    level: 'P',
    route: '/config/demo',
    icon: 'Activity',
    shortDescription: 'Ajuste de entorno',
    businessQuestion: '¿Cómo cambio los parámetros para ver otros resultados de simulación?',
    component: lazy(() => import('./c13/M13_4_Demo')),
    legacyIds: ['M13.4'],
    visibility: 'demo'
  },
  {
    id: 'perf-page',
    categoryId: 9,
    title: 'Salud de la plataforma',
    level: 'S',
    route: '/_perf',
    icon: 'Activity',
    shortDescription: 'Estado de conexión',
    businessQuestion: '¿Qué tan rápida está funcionando la plataforma ahora mismo?',
    component: PerfPage,
    legacyIds: ['M13.6'],
    visibility: 'demo'
  },
  {
    id: 'cheatsheet-page',
    categoryId: 9,
    title: 'Hoja de apoyo operativo',
    level: 'S',
    route: '/_cheatsheet',
    icon: 'info',
    shortDescription: 'Resumen en un clic',
    businessQuestion: 'N/A',
    component: CheatsheetPage,
    legacyIds: ['M13.7'],
    visibility: 'demo'
  }
];
