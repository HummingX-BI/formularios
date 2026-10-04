// src/assistant/intents.ts
export type MiniChartType = 'sparkline' | 'barras' | 'gauge' | 'ninguna'; 

export interface AssistantAnswer { 
  cifraPrincipal: string; 
  miniGrafica: { tipo: MiniChartType; datos: number[] }; 
  interpretacion: string; 
  recomendacion: string; 
  enlace: { texto: string; ruta: string }; 
  preguntasSeguimiento: string[]; 
  // Metadatos de trazabilidad obligatorios 
  metricasUsadas: string[];
} 

export interface IntentDef { 
  id: string; 
  category: string; 
  samples: string[]; 
  allowedEntities: string[]; // e.g., 'periodo', 'alberca', 'instructor' 
  composer: (entities: Record<string, any>, metrics: any) => AssistantAnswer;
} 

// Para el compositor, las métricas reales y ML deben venir ya proveídas o las calculamos desde `metrics` (el state/hook).
// Por simplicidad, pasaremos un objeto `data` que contiene un adaptador a useMetrics y models. 

const intentsList: Omit<IntentDef, 'composer'>[] = [ 
  // 1. Ingresos y ventas (6) 
  {
    id: 'ingreso_vs_meta', category: 'Ingresos y ventas', allowedEntities: ['periodo', 'alberca'], samples: [ "cuanto ingreso llevamos este mes contra la meta", "vamos a llegar a la meta de ingresos", "como vamos de dinero vs meta", "ingresos del mes comparados con lo esperado", "estamos arriba o abajo de la meta de ventas", "cuanta lana metimos este mes" ]
  }, {
    id: 'ingreso_proyeccion', category: 'Ingresos y ventas', allowedEntities: ['alberca'], samples: [ "cual es la proyeccion de cierre", "como vamos a cerrar el mes en ingresos", "probabilidad de llegar a la meta", "que pronostico tenemos para el cierre", "vamos a lograr la meta este mes", "cuanto dinero vamos a terminar ganando" ]
  }, {
    id: 'ingreso_comparativa', category: 'Ingresos y ventas', allowedEntities: ['periodo', 'alberca'], samples: [ "como vamos comparado con el mes anterior", "crecimos respecto al año pasado", "estamos mejor que el mes pasado", "comparativa de ingresos anual", "ingresos vs mes anterior", "ganamos mas este mes que el pasado" ]
  }, {
    id: 'ingreso_por_plan', category: 'Ingresos y ventas', allowedEntities: ['periodo'], samples: [ "cuanto ingreso trae cada plan", "que plan deja mas dinero", "distribucion de ingresos por paquete", "ingreso por tipo de plan", "ventas por paquete", "cual paquete vendio mas" ]
  }, {
    id: 'ingreso_ticket_ltv', category: 'Ingresos y ventas', allowedEntities: ['periodo', 'alberca'], samples: [ "cual es el ticket promedio y ltv", "cuanto vale un alumno en el tiempo", "ltv de la escuela", "cual es el ticket promedio mensual", "lifetime value de los clientes", "cuanto gasta en promedio una familia" ]
  }, {
    id: 'ingreso_brecha_facturable', category: 'Ingresos y ventas', allowedEntities: ['periodo'], samples: [ "cual es la brecha entre ingreso real y facturable", "cuanto dejamos de cobrar", "dinero en la mesa por falta de cobro", "diferencia entre lo que deberiamos ganar y lo real", "fuga de ingresos", "ingresos teoricos vs reales" ]
  }, 
  // 2. Ocupación y horarios (5) 
  {
    id: 'ocupacion_horario_saturado', category: 'Ocupación y horarios', allowedEntities: ['alberca'], samples: [ "cual es el horario mas saturado", "que hora esta mas llena", "horarios top de ocupacion", "franjas horarias a tope", "horarios sin cupo", "cuando estamos al maximo de capacidad" ]
  }, {
    id: 'ocupacion_espacio_disponible', category: 'Ocupación y horarios', allowedEntities: ['alberca', 'diaHora'], samples: [ "donde hay espacio disponible", "en que horarios me quedan lugares", "horarios vacios", "franjas con mas disponibilidad", "tenemos lugar los sabados", "que grupos estan vacios" ]
  }, {
    id: 'ocupacion_dia_alberca', category: 'Ocupación y horarios', allowedEntities: ['alberca', 'diaHora'], samples: [ "cual es la ocupacion de la alberca infantil", "como esta la ocupacion el sabado", "porcentaje de ocupacion hoy", "que tan llenos estamos", "nivel de ocupacion", "ocupacion del dia" ]
  }, {
    id: 'ocupacion_lista_espera', category: 'Ocupación y horarios', allowedEntities: ['alberca', 'diaHora'], samples: [ "cuantos hay en lista de espera", "lista de espera del sabado", "gente formada esperando lugar", "cuantos alumnos esperan entrar", "tenemos lista de espera", "demanda no atendida" ]
  }, {
    id: 'ocupacion_rentabilidad_horarios', category: 'Ocupación y horarios', allowedEntities: ['alberca'], samples: [ "cuales son los horarios mas rentables", "que hora deja mas ganancia", "horarios menos rentables", "rentabilidad por franja", "estamos perdiendo dinero en algun horario", "analisis de rentabilidad por hora" ]
  }, 
  // 3. Retención y bajas (6) 
  {
    id: 'retencion_riesgo', category: 'Retención y bajas', allowedEntities: ['alberca', 'instructor'], samples: [ "quienes estan en riesgo de baja", "alumnos con alto riesgo", "cuantos clientes podrian irse", "alumnos que van a cancelar", "probabilidad de baja alta", "quien esta por darse de baja" ]
  }, {
    id: 'retencion_bajas_churn', category: 'Retención y bajas', allowedEntities: ['periodo', 'alberca'], samples: [ "cuantas bajas hubo este mes", "cual es nuestra tasa de churn", "cuantos alumnos se fueron", "porcentaje de cancelaciones", "tasa de desercion", "numero de bajas" ]
  }, {
    id: 'retencion_cohorte', category: 'Retención y bajas', allowedEntities: [], samples: [ "como es la retencion por cohorte", "retencion de enero contra marzo", "analisis de cohortes", "que mes retiene mejor a los inscritos", "cohorte con mayor retencion", "evolucion de los grupos que entran" ]
  }, {
    id: 'retencion_motivos_baja', category: 'Retención y bajas', allowedEntities: ['periodo'], samples: [ "cuales son los principales motivos de baja", "por que se van los alumnos", "razones de cancelacion", "por que perdemos clientes", "causa principal de bajas", "motivos de abandono" ]
  }, {
    id: 'retencion_atoran_nivel', category: 'Retención y bajas', allowedEntities: ['alberca'], samples: [ "en que nivel se atoran los alumnos", "donde hay estancamiento pedagogico", "nivel con mas alumnos trabados", "cuello de botella en niveles", "alumnos atorados por nivel", "nivel mas dificil de pasar" ]
  }, {
    id: 'retencion_tiempo_permanencia', category: 'Retención y bajas', allowedEntities: ['alberca'], samples: [ "cual es el tiempo tipico de permanencia", "cuantos meses dura un alumno", "vida media de un cliente", "esperanza de vida del alumno", "curva de supervivencia", "cuanto tiempo se quedan con nosotros" ]
  }, 
  // 4. Prospectos y captación (6) 
  {
    id: 'prospectos_cantidad', category: 'Prospectos y captación', allowedEntities: ['periodo', 'fuente'], samples: [ "cuantos prospectos llegaron", "numero de leads nuevos", "cuanta gente pregunto", "prospectos del mes", "total de interesados", "volumen de prospectos" ]
  }, {
    id: 'prospectos_perdidos_precio', category: 'Prospectos y captación', allowedEntities: ['periodo'], samples: [ "cuantos se fueron por precio", "motivos de perdida de prospectos", "por que no se inscriben", "rechazos por costo", "prospectos perdidos por precio", "razones de no inscripcion" ]
  }, {
    id: 'prospectos_fuente_mejor', category: 'Prospectos y captación', allowedEntities: ['periodo'], samples: [ "que fuente convierte mejor", "de donde vienen los mejores leads", "canal de captacion mas efectivo", "instagram o recomendacion cual es mejor", "fuentes de prospectos", "donde invertir en marketing" ]
  }, {
    id: 'prospectos_conversion_cambio', category: 'Prospectos y captación', allowedEntities: ['periodo', 'alberca'], samples: [ "cual es la conversion del mes", "tasa de cierre", "cuantos prospectos se inscribieron", "cambio en la conversion", "mejoramos la tasa de conversion", "porcentaje de inscritos sobre leads" ]
  }, {
    id: 'prospectos_posicionamiento', category: 'Prospectos y captación', allowedEntities: ['periodo'], samples: [ "como estamos en posicionamiento en buscadores", "como nos va en seo local", "leads desde google", "posicionamiento online", "trafico web", "busquedas en google maps" ]
  }, {
    id: 'prospectos_desempeno_agente', category: 'Prospectos y captación', allowedEntities: ['periodo'], samples: [ "cual es el desempeño del agente de ventas", "agente autonomo metricas", "que tal lo hace el bot", "el agente virtual esta convirtiendo", "rendimiento de ventas del agente", "chatbot vs humanos" ]
  }, 
  // 5. Instructores (4) 
  {
    id: 'instructores_retiene_mejor', category: 'Instructores', allowedEntities: [], samples: [ "quien retiene mejor o peor", "que instructor tiene menos bajas", "profesor con mejor retencion", "tasa de supervivencia por instructor", "los instructores con mas cancelaciones", "quien es el mejor maestro" ]
  }, {
    id: 'instructores_desempeno_especifico', category: 'Instructores', allowedEntities: ['instructor', 'periodo'], samples: [ "cual es el desempeño de mariana", "metricas del instructor carlos", "como le va a sofia", "evaluacion del profe", "rendimiento de un maestro en particular", "que tal da clases jorge" ]
  }, {
    id: 'instructores_rentabilidad', category: 'Instructores', allowedEntities: ['instructor'], samples: [ "cual es la rentabilidad por instructor", "que profe nos deja mas dinero", "margen por profesor", "ingresos vs sueldo de maestros", "instructor mas rentable", "quien produce mas ganancias" ]
  }, {
    id: 'instructores_carga', category: 'Instructores', allowedEntities: ['instructor'], samples: [ "como esta la carga de los instructores", "cuantas horas da cada profesor", "profesores saturados de horas", "quien tiene mas clases", "distribucion de horas por maestro", "quien trabaja mas" ]
  }, 
  // 6. Finanzas y cobranza (5) 
  {
    id: 'finanzas_cartera_vencida', category: 'Finanzas y cobranza', allowedEntities: ['alberca'], samples: [ "a cuanto asciende la cartera vencida", "cuanto nos deben", "morosidad total", "dinero pendiente de cobro", "estado de la cartera vencida", "monto de deudas de alumnos" ]
  }, {
    id: 'finanzas_a_quien_llamar', category: 'Finanzas y cobranza', allowedEntities: [], samples: [ "a que familias llamar primero", "quienes son los peores deudores", "prioridad de cobranza", "top familias morosas", "a quien le cobramos hoy", "lista de llamadas de cobranza" ]
  }, {
    id: 'finanzas_morosidad_metodo', category: 'Finanzas y cobranza', allowedEntities: ['metodoPago'], samples: [ "morosidad por metodo de pago", "que metodo falla mas", "rechazos en tarjeta", "deudas por transferencia", "problemas con pagos en efectivo", "efectividad de metodos de pago" ]
  }, {
    id: 'finanzas_ingresos_dia_semana', category: 'Finanzas y cobranza', allowedEntities: ['periodo'], samples: [ "cuales son los ingresos de la semana", "cuanto cobramos hoy", "flujo de caja del dia", "cobranza de esta semana", "dinero que entro hoy", "ingresos recientes" ]
  }, {
    id: 'finanzas_recargos_descuentos', category: 'Finanzas y cobranza', allowedEntities: ['periodo'], samples: [ "cuanto dimos en recargos y descuentos", "descuentos aplicados este mes", "dinero de multas o recargos", "promociones y becas", "impacto de los descuentos", "cobro extra por atraso" ]
  }, 
  // 7. Estadística (4) 
  {
    id: 'estadistica_bayes', category: 'Estadística', allowedEntities: [], samples: [ "usa bayes con tres faltas consecutivas", "probabilidad de baja si falta tres veces", "teorema de bayes para ausencias", "que pasa si un niño falta 3 clases", "probabilidad condicional de cancelacion", "riesgo con 3 faltas" ]
  }, {
    id: 'estadistica_binomial', category: 'Estadística', allowedEntities: ['binomial'], samples: [ "probabilidad binomial 8 de 20", "que probabilidad hay de inscribir 5 de 10", "probabilidad exacta de 3 de 15", "distribucion binomial 12 de 30", "calcula la probabilidad 2 de 5", "chance de cerrar 10 de 50 prospectos" ]
  }, {
    id: 'estadistica_regresion', category: 'Estadística', allowedEntities: [], samples: [ "relacion entre asistencia y permanencia", "regresion lineal de ausencias y retencion", "como afecta la asistencia al churn", "correlacion de faltas y tiempo de vida", "modelo lineal de asistencia", "impacto de venir a clases en ltv" ]
  }, {
    id: 'estadistica_glosario', category: 'Estadística', allowedEntities: [], samples: [ "explicacion de un concepto del glosario", "que significa ltv", "define churn rate", "como se calcula el cac", "que es el mrr", "explicame un termino estadistico" ]
  }, 
  // 8. Recomendaciones (4) 
  {
    id: 'recs_que_hacer', category: 'Recomendaciones', allowedEntities: [], samples: [ "que hacer esta semana", "cuales son las recomendaciones", "dame sugerencias de mejora", "que me recomiendas hacer hoy", "plan de accion prioritario", "sugerencias inteligentes" ]
  }, {
    id: 'recs_what_if_precio', category: 'Recomendaciones', allowedEntities: [], samples: [ "que pasaria si subo el precio", "what-if de bajar colegiaturas", "simulador de aumento de precio", "impacto si cambio la tarifa", "si subo el precio gano mas", "simulacion de ingresos por precio" ]
  }, {
    id: 'recs_pronostico_inscripciones', category: 'Recomendaciones', allowedEntities: [], samples: [ "pronostico de inscripciones", "cuantos alumnos nuevos entraran el proximo mes", "forecast de ventas", "proyeccion de nuevos clientes", "cuantos prospectos vamos a cerrar", "prediccion de altas" ]
  }, {
    id: 'recs_salud_negocio', category: 'Recomendaciones', allowedEntities: [], samples: [ "resumen general y salud del negocio", "como estamos en general", "dame un overview de la escuela", "salud financiera y operativa", "resumen ejecutivo de pantera", "estamos sanos como negocio" ]
  }
]; 

export const INTENTS = intentsList;
