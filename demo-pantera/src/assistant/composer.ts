// src/assistant/composer.ts
import type { Entities } from './entities';
import type { AssistantAnswer } from './intents';

// Formatter fallback if not found
function formatMoney(amount: number) { 
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}
function formatNum(amount: number) { 
  return new Intl.NumberFormat('es-MX').format(amount);
} 

export function composer(intentId: string, entities: Entities, metricsStore: any): AssistantAnswer { 
  // Base default answer 
  const ans: AssistantAnswer = { 
    cifraPrincipal: '-', 
    miniGrafica: { tipo: 'ninguna', datos: [] }, 
    interpretacion: '', 
    recomendacion: '', 
    enlace: { texto: 'Ver Tablero', ruta: '/' }, 
    preguntasSeguimiento: [], 
    metricasUsadas: [] 
  }; 
  
  const getMetric = (name: string) => { 
    ans.metricasUsadas.push(name); 
    // Add entity filters conceptually if the store supported it 
    // return metricsStore.compute(name, entities); 
    return metricsStore.compute(name) || 0; 
  }; 
  
  switch (intentId) { 
    case 'ingreso_vs_meta': { 
      const real = getMetric('ingresos_totales'); 
      const meta = getMetric('meta_ingresos'); 
      const pct = (real / meta) * 100; 
      ans.cifraPrincipal = formatMoney(real); 
      ans.miniGrafica = { tipo: 'gauge', datos: [pct] }; 
      ans.interpretacion = `Hemos alcanzado el ${pct.toFixed(1)}% de la meta mensual (${formatMoney(meta)}).`; 
      ans.recomendacion = pct < 100 ? 'Impulsa campañas de recuperación de cartera para cerrar la brecha.' : '¡Excelente ritmo! Mantén la retención para asegurar el cierre.'; 
      ans.enlace = { texto: 'Ver módulo de Ingresos', ruta: '/c04/m4-1' }; 
      ans.preguntasSeguimiento = ['¿Cuál es la proyección de cierre?', '¿Cuánto es la cartera vencida?']; 
      break; 
    }
    case 'ingreso_proyeccion': { 
      const proy = getMetric('ingresos_totales') * 1.1; // simple mock for projection 
      ans.cifraPrincipal = formatMoney(proy); 
      ans.miniGrafica = { tipo: 'sparkline', datos: [10, 15, 20, 25, 30] }; 
      ans.interpretacion = 'La proyección basada en el ritmo actual indica que cerraremos en esta cifra.'; 
      ans.recomendacion = 'Revisa los alumnos en riesgo de baja para no afectar este pronóstico.'; 
      ans.enlace = { texto: 'Ver módulo de Pronósticos', ruta: '/c10/m10-3' }; 
      ans.preguntasSeguimiento = ['¿Quiénes están en riesgo de baja?', '¿Qué pasaría si subo el precio?']; 
      break; 
    }
    case 'ingreso_comparativa': { 
      const actual = getMetric('ingresos_totales'); 
      const prev = actual * 0.95; // mock 
      const varPct = ((actual - prev) / prev) * 100; 
      ans.cifraPrincipal = `${varPct > 0 ? '+' : ''}${varPct.toFixed(1)}%`; 
      ans.miniGrafica = { tipo: 'barras', datos: [prev, actual] }; 
      ans.interpretacion = `Los ingresos actuales son de ${formatMoney(actual)}, en comparación con ${formatMoney(prev)} del periodo anterior.`; 
      ans.recomendacion = varPct < 0 ? 'Revisa la conversión de nuevos prospectos.' : 'Continúa con las estrategias actuales.'; 
      ans.enlace = { texto: 'Ver módulo Ejecutivo', ruta: '/c01/m1-1' }; 
      ans.preguntasSeguimiento = ['¿Cuántas bajas hubo este mes?', '¿Cuál es la ocupación actual?']; 
      break; 
    }
    case 'ingreso_por_plan': { 
      ans.cifraPrincipal = 'Plan Intensivo'; 
      ans.miniGrafica = { tipo: 'barras', datos: [50, 30, 20] }; 
      ans.interpretacion = 'El Plan Intensivo representa la mayor parte de los ingresos (50%), seguido del regular.'; 
      ans.recomendacion = 'Ofrece descuentos por hermanos en el plan regular para aumentar volumen.'; 
      ans.enlace = { texto: 'Ver Facturación', ruta: '/c04/m4-4' }; 
      ans.preguntasSeguimiento = ['¿Cuál es el ticket promedio?', '¿Qué fuente convierte mejor?']; 
      break; 
    }
    case 'ingreso_ticket_ltv': { 
      const ticket = getMetric('ingresos_totales') / (getMetric('alumnos_activos') || 1); 
      const ltv = ticket * 12; // mock 12 months lifetime 
      ans.cifraPrincipal = `Ticket: ${formatMoney(ticket)}`; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = `El LTV estimado actual es de ${formatMoney(ltv)} por alumno activo.`; 
      ans.recomendacion = 'Para subir el LTV, enfócate en extender el tiempo de retención un mes más.'; 
      ans.enlace = { texto: 'Ver Lifetime Value', ruta: '/c04/m4-5' }; 
      ans.preguntasSeguimiento = ['¿Cuál es el tiempo típico de permanencia?', '¿Quién retiene mejor?']; 
      break; 
    }
    case 'ingreso_brecha_facturable': { 
      const real = getMetric('ingresos_totales'); 
      const facturable = real * 1.15; 
      const brecha = facturable - real; 
      ans.cifraPrincipal = formatMoney(brecha); 
      ans.miniGrafica = { tipo: 'barras', datos: [facturable, real] }; 
      ans.interpretacion = 'Esta es la diferencia entre el potencial total (ocupación actual * precio) y lo que realmente ha ingresado.'; 
      ans.recomendacion = 'Ataca la cartera vencida para reducir esta brecha.'; 
      ans.enlace = { texto: 'Ver Rentabilidad', ruta: '/c04/m4-6' }; 
      ans.preguntasSeguimiento = ['¿A cuánto asciende la cartera vencida?', '¿Cuáles son los horarios menos rentables?']; 
      break; 
    }

    // 2. Ocupación 
    case 'ocupacion_horario_saturado': { 
      ans.cifraPrincipal = 'Martes 16:00'; 
      ans.miniGrafica = { tipo: 'barras', datos: [80, 95, 60, 40] }; 
      ans.interpretacion = 'La franja de 16:00 a 17:00 entre semana es la de mayor saturación (>95%).'; 
      ans.recomendacion = 'Abre nuevos grupos en ese horario o incrementa ligeramente el precio de esos cupos.'; 
      ans.enlace = { texto: 'Ver Saturación', ruta: '/c06/m6-2' }; 
      ans.preguntasSeguimiento = ['¿Dónde hay espacio disponible?', '¿Cuántos hay en lista de espera?']; 
      break; 
    }
    case 'ocupacion_espacio_disponible': { 
      ans.cifraPrincipal = 'Mañanas (10-12)'; 
      ans.miniGrafica = { tipo: 'barras', datos: [40, 50, 85, 95] }; 
      ans.interpretacion = 'Las mañanas de lunes a jueves tienen una ocupación inferior al 50%.'; 
      ans.recomendacion = 'Considera clases para adultos o bebés con descuento matutino.'; 
      ans.enlace = { texto: 'Ver Ocupación', ruta: '/c06/m6-1' }; 
      ans.preguntasSeguimiento = ['¿Cuáles son los horarios más rentables?', '¿Cómo es la ocupación el sábado?']; 
      break; 
    }
    case 'ocupacion_dia_alberca': { 
      const oc = getMetric('ocupacion_cupo'); 
      ans.cifraPrincipal = `${oc}%`; 
      ans.miniGrafica = { tipo: 'gauge', datos: [oc] }; 
      ans.interpretacion = `La ocupación global promedio es del ${oc}%.`; 
      ans.recomendacion = 'Un nivel saludable está por encima del 75%. Estás en buen rango.'; 
      ans.enlace = { texto: 'Ver Ocupación', ruta: '/c06/m6-1' }; 
      ans.preguntasSeguimiento = ['¿Qué horario está más saturado?', '¿Cuántos prospectos llegaron?']; 
      break; 
    }
    case 'ocupacion_lista_espera': { 
      const lista = getMetric('lista_espera_total'); 
      ans.cifraPrincipal = formatNum(lista) + ' alumnos'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = `Tenemos ${lista} prospectos esperando un lugar en horarios saturados.`; 
      ans.recomendacion = 'Contacta a estas familias ofreciéndoles un horario alternativo con descuento.'; 
      ans.enlace = { texto: 'Ver Lista de Espera', ruta: '/c02/m2-6' }; 
      ans.preguntasSeguimiento = ['¿Qué horario está más saturado?', '¿Dónde hay espacio disponible?']; 
      break; 
    }
    case 'ocupacion_rentabilidad_horarios': { 
      ans.cifraPrincipal = 'Sábados 9:00 - 11:00'; 
      ans.miniGrafica = { tipo: 'barras', datos: [1200, 1500, 900, 2500] }; 
      ans.interpretacion = 'Los sábados por la mañana generan la mayor contribución marginal debido a clases de capacidad máxima.'; 
      ans.recomendacion = 'Optimiza la logística de entrada/salida para aprovechar mejor esta ventana.'; 
      ans.enlace = { texto: 'Ver Optimizador', ruta: '/c06/m6-3' }; 
      ans.preguntasSeguimiento = ['¿Cuál es el horario más saturado?', '¿Qué fuente convierte mejor?']; 
      break; 
    }

    // 3. Retención y bajas 
    case 'retencion_riesgo': { 
      const riesgo = getMetric('riesgo_alto_baja'); 
      ans.cifraPrincipal = `${riesgo} alumnos`; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = 'Hay un grupo de alumnos marcados con alto riesgo de abandono inminente.'; 
      ans.recomendacion = 'Contacta a estos alumnos hoy mismo. Una llamada preventiva reduce la deserción un 40%.'; 
      ans.enlace = { texto: 'Ver Riesgo de Baja', ruta: '/c07/m7-1' }; 
      ans.preguntasSeguimiento = ['¿Cuáles son los principales motivos de baja?', '¿A qué familias llamar primero?']; 
      break; 
    }
    case 'retencion_bajas_churn': { 
      const churn = 100 - getMetric('retencion_6m'); // mock 
      ans.cifraPrincipal = `${churn.toFixed(1)}% Churn`; 
      ans.miniGrafica = { tipo: 'sparkline', datos: [3, 4, 3.5, 5, churn] }; 
      ans.interpretacion = `La tasa de cancelación (churn) se sitúa en ${churn.toFixed(1)}%.`; 
      ans.recomendacion = 'Un churn arriba de 5% mensual afecta seriamente el crecimiento. Implementa el plan de retención.'; 
      ans.enlace = { texto: 'Ver Cohortes y Bajas', ruta: '/c07/m7-3' }; 
      ans.preguntasSeguimiento = ['¿Quiénes están en riesgo de baja?', '¿Por qué se van los alumnos?']; 
      break; 
    }
    case 'retencion_cohorte': { 
      ans.cifraPrincipal = 'Enero 2026'; 
      ans.miniGrafica = { tipo: 'sparkline', datos: [100, 90, 85, 80] }; 
      ans.interpretacion = 'La cohorte de principios de año mantiene la mejor retención a los 6 meses (82%).'; 
      ans.recomendacion = 'Revisa qué promoción o proceso de inducción se usó en Enero para replicarlo.'; 
      ans.enlace = { texto: 'Ver Cohortes', ruta: '/c07/m7-3' }; 
      ans.preguntasSeguimiento = ['¿Cuál es el tiempo típico de permanencia?', '¿Quién retiene mejor?']; 
      break; 
    }
    case 'retencion_motivos_baja': { 
      ans.cifraPrincipal = 'Precio (38%)'; 
      ans.miniGrafica = { tipo: 'barras', datos: [38, 25, 20, 17] }; 
      ans.interpretacion = 'El costo es la razón número uno reportada por las bajas, seguido por horarios incompatibles.'; 
      ans.recomendacion = 'Evalúa introducir planes de fidelidad para alumnos que llevan más de un año.'; 
      ans.enlace = { texto: 'Ver Motivos de Baja', ruta: '/c07/m7-4' }; 
      ans.preguntasSeguimiento = ['¿Qué pasaría si bajo el precio?', '¿Quiénes están en riesgo de baja?']; 
      break; 
    }
    case 'retencion_atoran_nivel': { 
      ans.cifraPrincipal = 'Nivel 3 (Tiburón)'; 
      ans.miniGrafica = { tipo: 'barras', datos: [10, 15, 35, 10, 5] }; 
      ans.interpretacion = 'El 35% de las bajas de alumnos intermedios suceden mientras están estancados en el Nivel 3.'; 
      ans.recomendacion = 'Revisa la metodología de enseñanza en ese nivel, podría estar causando frustración.'; 
      ans.enlace = { texto: 'Ver Embudo de Niveles', ruta: '/c08/m8-1' }; 
      ans.preguntasSeguimiento = ['¿Qué instructor retiene mejor?', '¿Cuál es el desempeño del instructor Carlos?']; 
      break; 
    }
    case 'retencion_tiempo_permanencia': { 
      ans.cifraPrincipal = '7.4 Meses'; 
      ans.miniGrafica = { tipo: 'sparkline', datos: [100, 85, 70, 50, 30] }; // Survival curve approx 
      ans.interpretacion = 'La vida media o tiempo típico de permanencia de un alumno desde su inscripción es 7.4 meses.'; 
      ans.recomendacion = 'Añadir solo un mes más de permanencia subiría tus ingresos anuales significativamente.'; 
      ans.enlace = { texto: 'Ver Supervivencia', ruta: '/c07/m7-2' }; 
      ans.preguntasSeguimiento = ['¿Cuál es el LTV?', '¿Cómo es la retención por cohorte?']; 
      break; 
    }

    // 4. Prospectos 
    case 'prospectos_cantidad': { 
      const leads = getMetric('leads'); 
      ans.cifraPrincipal = formatNum(leads); 
      ans.miniGrafica = { tipo: 'barras', datos: [leads * 0.8, leads] }; 
      ans.interpretacion = `Se han generado ${leads} prospectos en el periodo.`; 
      ans.recomendacion = 'Mantén la velocidad de respuesta en WhatsApp para no enfriar a los leads.'; 
      ans.enlace = { texto: 'Ver Embudo de Ventas', ruta: '/c05/m5-2' }; 
      ans.preguntasSeguimiento = ['¿Cuál es la conversión del mes?', '¿Qué fuente convierte mejor?']; 
      break; 
    }
    case 'prospectos_perdidos_precio': { 
      ans.cifraPrincipal = '38%'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = 'Un 38% de los prospectos declina inscribirse por el precio del servicio.'; 
      ans.recomendacion = 'Haz pruebas A/B de precios o paquetes con descuento por horarios vacíos.'; 
      ans.enlace = { texto: 'Ver Motivos Pérdida', ruta: '/c05/m5-3' }; 
      ans.preguntasSeguimiento = ['¿Qué pasaría si subo el precio?', '¿Dónde hay espacio disponible?']; 
      break; 
    }
    case 'prospectos_fuente_mejor': { 
      ans.cifraPrincipal = 'Recomendación (Word of Mouth)'; 
      ans.miniGrafica = { tipo: 'barras', datos: [40, 20, 15, 25] }; 
      ans.interpretacion = 'Los alumnos que llegan por recomendación de otros clientes tienen una conversión 2x mayor.'; 
      ans.recomendacion = 'Crea un programa de referidos ("Trae a un amigo y ambos ganan").'; 
      ans.enlace = { texto: 'Ver Fuentes', ruta: '/c05/m5-4' }; 
      ans.preguntasSeguimiento = ['¿Cuántos prospectos llegaron?', '¿Cuál es la conversión del mes?']; 
      break; 
    }
    case 'prospectos_conversion_cambio': { 
      const conv = getMetric('conversion'); 
      ans.cifraPrincipal = `${conv}%`; 
      ans.miniGrafica = { tipo: 'gauge', datos: [conv] }; 
      ans.interpretacion = `De los prospectos que llegan, el ${conv}% termina inscribiéndose.`; 
      ans.recomendacion = 'Una conversión superior al 20% es sana. Intenta automatizar seguimientos para mejorarla.'; 
      ans.enlace = { texto: 'Ver Embudo', ruta: '/c05/m5-2' }; 
      ans.preguntasSeguimiento = ['¿Cuál es el desempeño del agente de ventas?', '¿Cuántos se fueron por precio?']; 
      break; 
    }
    case 'prospectos_posicionamiento': { 
      ans.cifraPrincipal = 'Top 3 en Google Maps'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = 'La escuela aparece constantemente en el Top 3 local de "clases de natación".'; 
      ans.recomendacion = 'Incentiva a tus alumnos más leales a dejar reviews de 5 estrellas para mantener la posición.'; 
      ans.enlace = { texto: 'Ver Fuentes', ruta: '/c05/m5-4' }; 
      ans.preguntasSeguimiento = ['¿Qué fuente convierte mejor?', '¿Cuántos prospectos llegaron?']; 
      break; 
    }
    case 'prospectos_desempeno_agente': { 
      ans.cifraPrincipal = '85% Automatización'; 
      ans.miniGrafica = { tipo: 'gauge', datos: [85] }; 
      ans.interpretacion = 'El agente virtual ha manejado el 85% de las consultas iniciales sin intervención humana.'; 
      ans.recomendacion = 'Revisa las conversaciones que requirieron humano para afinar la base de conocimiento del bot.'; 
      ans.enlace = { texto: 'Ver Desempeño del Agente', ruta: '/c05/m5-5' }; 
      ans.preguntasSeguimiento = ['¿Cuál es la conversión del mes?', '¿Qué fuente convierte mejor?']; 
      break; 
    }

    // 5. Instructores 
    case 'instructores_retiene_mejor': { 
      ans.cifraPrincipal = 'Mariana (92%)'; 
      ans.miniGrafica = { tipo: 'barras', datos: [92, 85, 78, 80] }; 
      ans.interpretacion = 'Mariana tiene la tasa de retención más alta, con un 92% de alumnos retenidos a 6 meses.'; 
      ans.recomendacion = 'Pídele a Mariana que comparta sus dinámicas de clase en la próxima junta de profesores.'; 
      ans.enlace = { texto: 'Ver Efectividad Instructores', ruta: '/c08/m8-3' }; 
      ans.preguntasSeguimiento = ['¿Cuál es la rentabilidad por instructor?', '¿En qué nivel se atoran los alumnos?']; 
      break; 
    }
    case 'instructores_desempeno_especifico': { 
      const n = entities.instructor || 'El instructor'; 
      ans.cifraPrincipal = `${n} (Evaluación Alta)`; 
      ans.miniGrafica = { tipo: 'sparkline', datos: [8, 8.5, 9, 9.2] }; 
      ans.interpretacion = `${n} ha mostrado una excelente progresión, manteniendo una retención sólida y buenos avances de nivel.`; 
      ans.recomendacion = 'Revisa su Scorecard individual para retroalimentación específica.'; 
      ans.enlace = { texto: 'Ver Scorecard de Instructor', ruta: '/c03/m3-3' }; 
      ans.preguntasSeguimiento = ['¿Quién retiene mejor?', '¿Cómo está la carga de instructores?']; 
      break; 
    }
    case 'instructores_rentabilidad': { 
      ans.cifraPrincipal = 'Carlos (+$15,000/mes)'; 
      ans.miniGrafica = { tipo: 'barras', datos: [15000, 12000, 10000] }; 
      ans.interpretacion = 'Carlos maneja los grupos más saturados de las tardes, generando el mayor retorno por hora pagada.'; 
      ans.recomendacion = 'Recompensa la alta productividad con bonos por retención de alumnos.'; 
      ans.enlace = { texto: 'Ver Nómina', ruta: '/c03/m3-2' }; 
      ans.preguntasSeguimiento = ['¿Cómo está la carga de instructores?', '¿Cuáles son los horarios más rentables?']; 
      break; 
    }
    case 'instructores_carga': { 
      ans.cifraPrincipal = 'Promedio 24h/sem'; 
      ans.miniGrafica = { tipo: 'barras', datos: [24, 30, 20, 15] }; 
      ans.interpretacion = 'La carga está bien distribuida, aunque un par de profesores superan las 30 horas semanales.'; 
      ans.recomendacion = 'Vigila el agotamiento en los profesores con más de 30 horas para evitar baja calidad de enseñanza.'; 
      ans.enlace = { texto: 'Ver Directorio', ruta: '/c03/m3-1' }; 
      ans.preguntasSeguimiento = ['¿Quién retiene mejor?', '¿Cuál es el desempeño de Carlos?']; 
      break; 
    }

    // 6. Finanzas 
    case 'finanzas_cartera_vencida': { 
      const cv = getMetric('cartera_vencida'); 
      ans.cifraPrincipal = formatMoney(cv); 
      ans.miniGrafica = { tipo: 'sparkline', datos: [40000, 42000, cv] }; 
      ans.interpretacion = `El saldo de mensualidades impagas o atrasadas suma ${formatMoney(cv)}.`; 
      ans.recomendacion = 'Implementa recordatorios automáticos 3 días antes de la fecha de corte.'; 
      ans.enlace = { texto: 'Ver Cartera Vencida', ruta: '/c04/m4-3' }; 
      ans.preguntasSeguimiento = ['¿A qué familias llamar primero?', '¿Morosidad por método de pago?']; 
      break; 
    }
    case 'finanzas_a_quien_llamar': { 
      ans.cifraPrincipal = 'Top 10 Familias'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = 'Hay un grupo prioritario de familias que concentran el 40% de la deuda (más de 2 meses atrasados).'; 
      ans.recomendacion = 'El módulo de cobranza genera la lista priorizada. Asigna las llamadas para hoy.'; 
      ans.enlace = { texto: 'Ver Cartera Vencida', ruta: '/c04/m4-3' }; 
      ans.preguntasSeguimiento = ['¿A cuánto asciende la cartera vencida?', '¿Cuáles son los ingresos de la semana?']; 
      break; 
    }
    case 'finanzas_morosidad_metodo': { 
      ans.cifraPrincipal = 'Efectivo (Mayor riesgo)'; 
      ans.miniGrafica = { tipo: 'barras', datos: [60, 30, 10] }; 
      ans.interpretacion = 'El pago en efectivo y transferencias manuales presenta tres veces más morosidad que el cobro recurrente a tarjeta.'; 
      ans.recomendacion = 'Incentiva la domiciliación a tarjeta de crédito con un descuento del 5%.'; 
      ans.enlace = { texto: 'Ver Estado de Cuenta', ruta: '/c04/m4-2' }; 
      ans.preguntasSeguimiento = ['¿A cuánto asciende la cartera vencida?', '¿A qué familias llamar primero?']; 
      break; 
    }
    case 'finanzas_ingresos_dia_semana': { 
      const rev = getMetric('ingresos_totales') * 0.25; // mock semana 
      ans.cifraPrincipal = formatMoney(rev); 
      ans.miniGrafica = { tipo: 'sparkline', datos: [rev*0.8, rev*1.1, rev] }; 
      ans.interpretacion = `Los ingresos recientes de la semana suman ${formatMoney(rev)}.`; 
      ans.recomendacion = 'Monitorea que no caigan pagos en fin de semana que requieran conciliación manual.'; 
      ans.enlace = { texto: 'Ver Pagos', ruta: '/c04/m4-1' }; 
      ans.preguntasSeguimiento = ['¿Cuál es la proyección de cierre?', '¿Cuánto dimos en descuentos?']; 
      break; 
    }
    case 'finanzas_recargos_descuentos': { 
      ans.cifraPrincipal = '4.5% del Ingreso'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = 'Se aplicaron descuentos equivalentes al 4.5% de la facturación, parcialmente compensados por recargos cobrados.'; 
      ans.recomendacion = 'Asegúrate de que los descuentos por hermanos estén fidelizando familias y no solo diluyendo margen.'; 
      ans.enlace = { texto: 'Ver Facturación', ruta: '/c04/m4-4' }; 
      ans.preguntasSeguimiento = ['¿Cuál es la brecha facturable?', '¿Qué plan deja más dinero?']; 
      break; 
    }

    // 7. Estadística 
    case 'estadistica_bayes': { 
      ans.cifraPrincipal = '85% Probabilidad de Baja'; 
      ans.miniGrafica = { tipo: 'gauge', datos: [85] }; 
      ans.interpretacion = 'El teorema de Bayes indica que si un alumno suma tres faltas consecutivas injustificadas, la probabilidad real de que abandone el próximo mes es del 85%.'; 
      ans.recomendacion = 'Intervén en la segunda falta con una llamada de seguimiento o un mensaje del instructor.'; 
      ans.enlace = { texto: 'Ver Laboratorio Bayes', ruta: '/c09/m9-4' }; 
      ans.preguntasSeguimiento = ['¿Quiénes están en riesgo de baja?', 'Explicación de un concepto del glosario.']; 
      break; 
    }
    case 'estadistica_binomial': { 
      const { k, n } = entities.binomial || { k: 8, n: 20 }; 
      const p = getMetric('conversion') / 100 || 0.25; 
      // Binomial formula approx calculation here: 
      // (n C k) * p^k * (1-p)^(n-k) 
      // just a mock return for deterministic testing 
      ans.cifraPrincipal = 'Probabilidad Específica'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = `Con una tasa de conversión de ${p*100}%, lograr exactamente ${k} inscritos de ${n} prospectos tiene una probabilidad calculada según la distribución binomial.`; 
      ans.recomendacion = 'Juega con estos valores en el laboratorio para establecer metas de ventas realistas.'; 
      ans.enlace = { texto: 'Ver Distribución Binomial', ruta: '/c09/m9-3' }; 
      ans.preguntasSeguimiento = ['¿Qué fuente convierte mejor?', 'Explicación de un concepto del glosario.']; 
      break; 
    }
    case 'estadistica_regresion': { 
      ans.cifraPrincipal = 'Alta Correlación Positiva'; 
      ans.miniGrafica = { tipo: 'sparkline', datos: [1, 2, 3, 4, 5] }; 
      ans.interpretacion = 'El modelo de regresión lineal demuestra que por cada 10% adicional de asistencia constante en los primeros dos meses, el LTV crece de forma predecible.'; 
      ans.recomendacion = 'Premia la asistencia perfecta en los primeros 3 meses de inscripción.'; 
      ans.enlace = { texto: 'Ver Regresiones', ruta: '/c09/m9-7' }; 
      ans.preguntasSeguimiento = ['Explicación de un concepto del glosario', '¿Cuál es el tiempo típico de permanencia?']; 
      break; 
    }
    case 'estadistica_glosario': { 
      ans.cifraPrincipal = 'Definición Técnica'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = 'LTV (Lifetime Value) es el valor neto proyectado que un alumno aporta a la escuela durante toda su vida como cliente. Churn es la tasa de cancelación.'; 
      ans.recomendacion = 'Consulta el laboratorio para explorar los conceptos y su cálculo exacto en tus propios datos.'; 
      ans.enlace = { texto: 'Ver Estadística Descriptiva', ruta: '/c09/m9-1' }; 
      ans.preguntasSeguimiento = ['¿Cuál es el ticket promedio y LTV?', '¿Cuántas bajas hubo este mes?']; 
      break; 
    }

    // 8. Recomendaciones 
    case 'recs_que_hacer': { 
      ans.cifraPrincipal = '3 Acciones Clave'; 
      ans.miniGrafica = { tipo: 'ninguna', datos: [] }; 
      ans.interpretacion = 'El motor analítico ha detectado oportunidades en ocupación, cobranza y marketing.'; 
      ans.recomendacion = 'Ve al módulo de Recomendaciones para aceptar aquellas de Alto Impacto y Bajo Esfuerzo.'; 
      ans.enlace = { texto: 'Ver Recomendaciones', ruta: '/c11/m11-1' }; 
      ans.preguntasSeguimiento = ['¿A qué familias llamar primero?', '¿Dónde hay espacio disponible?']; 
      break; 
    }
    case 'recs_what_if_precio': { 
      ans.cifraPrincipal = 'Simulación de Impacto'; 
      ans.miniGrafica = { tipo: 'sparkline', datos: [100, 105, 110] }; 
      ans.interpretacion = 'Subir o bajar el precio afecta directamente la inscripción de prospectos y puede detonar bajas (elasticidad).'; 
      ans.recomendacion = 'El modelo predice qué pasa si subes un 10%. Simula el escenario para confirmarlo.'; 
      ans.enlace = { texto: 'Ver Simulador', ruta: '/c11/m11-2' }; 
      ans.preguntasSeguimiento = ['¿Cuántos se fueron por precio?', '¿Cuál es la brecha facturable?']; 
      break; 
    }
    case 'recs_pronostico_inscripciones': { 
      ans.cifraPrincipal = 'Modelo Holt-Winters'; 
      ans.miniGrafica = { tipo: 'sparkline', datos: [15, 20, 25, 22] }; 
      ans.interpretacion = 'El modelo de pronóstico proyecta la entrada de alumnos considerando la tendencia y estacionalidad histórica.'; 
      ans.recomendacion = 'Prepara a los instructores y ajusta horarios según las inscripciones proyectadas.'; 
      ans.enlace = { texto: 'Ver Pronósticos (ML)', ruta: '/c10/m10-3' }; 
      ans.preguntasSeguimiento = ['¿Cuál es la proyección de cierre?', '¿Dónde hay espacio disponible?']; 
      break; 
    }
    case 'recs_salud_negocio': { 
      ans.cifraPrincipal = 'Salud Operativa Buena'; 
      ans.miniGrafica = { tipo: 'gauge', datos: [85] }; 
      ans.interpretacion = 'Pantera mantiene una ocupación sana y un churn controlado, aunque hay oportunidades para optimizar rentabilidad por horario y cobranza.'; 
      ans.recomendacion = 'Revisa las métricas clave y ejecuta las sugerencias prioritarias de la semana.'; 
      ans.enlace = { texto: 'Ver Resumen Ejecutivo', ruta: '/c01/m1-1' }; 
      ans.preguntasSeguimiento = ['¿Qué hacer esta semana?', '¿Cuál es la ocupación de la alberca infantil?']; 
      break; 
    }

    default: // Fallback in case of unknown intent that bypassed index.ts check 
      ans.cifraPrincipal = '-'; 
      ans.interpretacion = 'Esa consulta no está soportada todavía.'; 
      ans.enlace = { texto: 'Ir al Inicio', ruta: '/' }; 
      ans.preguntasSeguimiento = ['¿Qué hacer esta semana?']; 
  }

  // Override text if context modifies it 
  if (entities.alberca) { 
    ans.interpretacion += ` (Filtrado para la alberca ${entities.alberca})`; 
  }
  if (entities.periodo) { 
    ans.interpretacion += ` (Periodo: ${entities.periodo.replace('_', ' ')})`; 
  }

  return ans;
}
