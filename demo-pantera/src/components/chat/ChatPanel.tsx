import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/app/store';
import { Bot, X, Send, AlertTriangle, Copy, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { ask } from '@/assistant';
import type { AssistantContext } from '@/assistant';
import { useDataset } from '@/data/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/ui/components/utils'; 

export function ChatPanel({ isFullscreen = false }: { isFullscreen?: boolean }) { 
  const { chatIsOpen, toggleChat, chatMessages, addChatMessage, setChatTyping, chatIsTyping, clearChat, period, poolFilter } = useAppStore(); 
  const [input, setInput] = useState(''); 
  const [context, setContext] = useState<AssistantContext>({ turnsSinceLastIntent: 0 }); 
  const scrollRef = useRef<HTMLDivElement>(null); 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const dataset = useDataset(); 
  
  // Scroll to bottom on new message 
  useEffect(() => { 
    if (scrollRef.current) { 
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
    }
  }, [chatMessages, chatIsTyping]); 
  
  // Initial welcome message 
  useEffect(() => { 
    if (chatIsOpen && chatMessages.length === 0) { 
      const summaryMsg: any = { 
        id: 'welcome', 
        role: 'assistant', 
        isWelcome: true, 
        text: '¡Hola! Soy Pantera, tu IA Operativa.', 
        summary: { 
          metrics: [ { label: 'Ocupación', value: '82%' }, { label: 'Ingresos', value: '$245k' }, { label: 'Bajas', value: '12' } ], 
          alert: 'Riesgo alto de retención en Nivel 3' 
        }, 
        suggestions: [
          '¿Cuáles son los principales riesgos de baja este mes?', 
          '¿Qué impacto tendría subir los precios un 5%?', 
          'Muéstrame el top 3 de áreas de mejora operativa',
          'Resume el estado financiero actual'
        ] 
      }; 
      addChatMessage(summaryMsg); 
    }
  }, [chatIsOpen, chatMessages.length, addChatMessage]); 
  
  if (!chatIsOpen && !isFullscreen) return null; 
  
  const handleSend = (text: string) => { 
    if (!text.trim()) return; 
    const userMsg = { id: Date.now().toString(), role: 'user', text }; 
    addChatMessage(userMsg as any); 
    setInput(''); 
    setChatTyping(true); 
    // Simulate typing delay (max 2s) 
    setTimeout(() => { 
      try { 
        // Canned intelligent responses based on current system simulation data
        const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let simulationAnswer: any = null;

        if (cleanText.includes('riesgo') || cleanText.includes('baja') || cleanText.includes('desercion') || cleanText.includes('cancel')) {
          simulationAnswer = {
            cifraPrincipal: '12 Alumnos en Riesgo',
            miniGrafica: { 
              tipo: 'desglose_riesgo', 
              titulo: 'Distribución por Nivel de Riesgo',
              datos: [
                { label: 'Crítico (+3 faltas)', val: 5, color: '#ef4444' },
                { label: 'Alto (2 faltas)', val: 4, color: '#f97316' },
                { label: 'Moderado (Pago demora)', val: 3, color: '#eab308' }
              ] 
            },
            interpretacion: 'Detectamos 12 alumnos con más de 2 faltas consecutivas en las últimas 3 semanas. La mayor concentración está en el nivel Intermedio (Nivel 3). Si no se contactan, representan una fuga potencial de $14,400 MXN mensuales.',
            recomendacion: 'Asignar al personal de recepción la llamada de seguimiento a las familias con 2 faltas consecutivas hoy mismo.',
            enlace: { texto: 'Ver Radar de Retención (Módulo 7.1)', ruta: '/retencion/riesgo' },
            preguntasSeguimiento: [
              '¿Cuánto tenemos en cartera vencida?',
              '¿Qué carril u horario tiene menor ocupación?'
            ]
          };
        } else if (cleanText.includes('precio') || cleanText.includes('subir') || cleanText.includes('aumentar') || cleanText.includes('5%') || cleanText.includes('10%') || cleanText.includes('cuota')) {
          simulationAnswer = {
            cifraPrincipal: '+$185,000 MXN / Año',
            miniGrafica: { 
              tipo: 'sparkline', 
              titulo: 'Proyección Acumulada de Utilidad Adicional (MXN)',
              datos: [30, 65, 105, 145, 185],
              labels: ['Mes 2', 'Mes 4', 'Mes 6', 'Mes 9', 'Mes 12']
            },
            interpretacion: 'Al simular un incremento del 5% en la mensualidad regular, el modelo proyecta una baja de solo 3 alumnos por elasticidad, pero genera un incremento neto positivo de $15,400 MXN mensuales sobre la base activa de 450 alumnos.',
            recomendacion: 'Aplica el ajuste únicamente a nuevas inscripciones o bonifica con un kit de bienvenida a los alumnos antiguos.',
            enlace: { texto: 'Abrir Simulador Financiero (Módulo 11.2)', ruta: '/mando/alertas' },
            preguntasSeguimiento: [
              '¿Cómo van los ingresos vs la meta?',
              '¿Cuál es la tasa de ocupación actual?'
            ]
          };
        } else if (cleanText.includes('carril') || cleanText.includes('saturad') || cleanText.includes('ocupacion') || cleanText.includes('hora') || cleanText.includes('vaci') || cleanText.includes('valle')) {
          simulationAnswer = {
            cifraPrincipal: '82% Ocupación (Horas valle: 38%)',
            miniGrafica: { 
              tipo: 'barras_etiquetadas', 
              titulo: 'Ocupación por Carril (Horario Matutino 10:00 - 12:00)',
              datos: [
                { label: 'Carril 1', val: 80, color: '#3b82f6' },
                { label: 'Carril 2', val: 38, color: '#f59e0b' },
                { label: 'Carril 3', val: 42, color: '#f59e0b' },
                { label: 'Carril 4', val: 85, color: '#3b82f6' }
              ]
            },
            interpretacion: 'La ocupación global promedio es del 82%. Sin embargo, los carriles 2 y 3 entre 10:00 y 12:00 hrs operan a solo el 38% y 42% de capacidad, generando un costo ocioso de gas y químicos.',
            recomendacion: 'Lanza paquetes especiales de matronatación o acondicionamiento para adultos mayores en la franja de 10:00 a 12:00 hrs.',
            enlace: { texto: 'Ver Mapa Térmico de Carriles (Módulo 6.1)', ruta: '/capacidad/ocupacion' },
            preguntasSeguimiento: [
              '¿Cuántos prospectos han llegado del sitio web?',
              '¿Cuáles son los principales riesgos de baja?'
            ]
          };
        } else if (cleanText.includes('ingreso') || cleanText.includes('meta') || cleanText.includes('financier') || cleanText.includes('dinero') || cleanText.includes('ventas')) {
          simulationAnswer = {
            cifraPrincipal: '$245,000 MXN (81.6% Meta)',
            miniGrafica: { 
              tipo: 'gauge', 
              titulo: 'Avance hacia la Meta Mensual ($300,000 MXN)',
              datos: [81.6] 
            },
            interpretacion: 'Se han recaudado $245,000 MXN contra la meta mensual de $300,000 MXN. Existen $45,000 MXN pendientes en cartera vencida de alumnos activos.',
            recomendacion: 'Cobrar el 50% de la cartera vencida asegurará superar el 90% de la meta antes de fin de mes.',
            enlace: { texto: 'Ver Cuentas por Cobrar (Módulo 4.2)', ruta: '/finanzas/cobranza' },
            preguntasSeguimiento: [
              '¿Cuánto tenemos en cartera vencida?',
              '¿Qué impacto tendría subir los precios un 5%?'
            ]
          };
        } else if (cleanText.includes('cartera') || cleanText.includes('vencid') || cleanText.includes('deud') || cleanText.includes('cobrar') || cleanText.includes('mora')) {
          simulationAnswer = {
            cifraPrincipal: '$45,000 MXN por Cobrar',
            miniGrafica: { 
              tipo: 'barras_etiquetadas', 
              titulo: 'Antigüedad de la Deuda ($ MXN)',
              datos: [
                { label: '1 a 15 días', val: 22000, display: '$22k', color: '#6366f1' },
                { label: '16 a 30 días', val: 15000, display: '$15k', color: '#f97316' },
                { label: '+30 días', val: 8000, display: '$8k', color: '#ef4444' }
              ]
            },
            interpretacion: '14 familias concentran adeudos mayores a 15 días. El 60% de los retrasos ocurre en pagos en efectivo no domiciliados.',
            recomendacion: 'Enviar recordatorios de cobro con botón de pago desde el módulo de caja a los 14 tutores registrados.',
            enlace: { texto: 'Ver Módulo de Cobranza (Módulo 4.2)', ruta: '/finanzas/cobranza' },
            preguntasSeguimiento: [
              '¿Quién es el profesor con mejor retención?',
              '¿Cómo van los ingresos vs la meta?'
            ]
          };
        } else if (cleanText.includes('prospect') || cleanText.includes('lead') || cleanText.includes('web') || cleanText.includes('sitio') || cleanText.includes('visita')) {
          simulationAnswer = {
            cifraPrincipal: '120 Prospectos Web (25% Cierre)',
            miniGrafica: { 
              tipo: 'embudo', 
              titulo: 'Embudo de Conversión Web a Alumno Inscrito',
              datos: [
                { etapa: 'Visitas Formulario', val: 120, pct: '100%' },
                { etapa: 'Contactados', val: 85, pct: '71%' },
                { etapa: 'Clase Muestra', val: 60, pct: '50%' },
                { etapa: 'Inscritos Pagados', val: 30, pct: '25%' }
              ]
            },
            interpretacion: '120 personas solicitaron informes en el sitio web este mes. 60 asistieron a Clase Muestra y 30 se inscribieron formalmente. El Piloto Automático con IA redujo el tiempo de primer contacto a menos de 2 minutos.',
            recomendacion: 'Mantener activa la respuesta automática para no perder familias que consultan en fines de semana.',
            enlace: { texto: 'Ver CRM y Piloto IA (Módulo 5.1)', ruta: '/ventas/crm' },
            preguntasSeguimiento: [
              '¿Cuál es la tasa de ocupación actual?',
              '¿Cuáles son los principales riesgos de baja?'
            ]
          };
        } else if (cleanText.includes('profesor') || cleanText.includes('instructor') || cleanText.includes('maestro') || cleanText.includes('equipo') || cleanText.includes('retiene')) {
          simulationAnswer = {
            cifraPrincipal: 'Prof. Carlos Mendoza (94% Retención)',
            miniGrafica: { 
              tipo: 'barras_etiquetadas', 
              titulo: 'Tasa de Retención a 6 Meses por Instructor (%)',
              datos: [
                { label: 'Carlos M.', val: 94, display: '94%', color: '#10b981' },
                { label: 'Mariana R.', val: 88, display: '88%', color: '#3b82f6' },
                { label: 'Roberto S.', val: 85, display: '85%', color: '#6366f1' },
                { label: 'Sofía V.', val: 78, display: '78%', color: '#f59e0b' }
              ]
            },
            interpretacion: 'Carlos Mendoza registra la retención más alta de la escuela con 94% de alumnos que renuevan mes a mes. El promedio general del equipo es de 86.5%. Sofía V. tiene oportunidad de mejora en retención.',
            recomendacion: 'Documentar su dinámica de clase para capacitar a los instructores con menor índice de retención.',
            enlace: { texto: 'Ver Rendimiento de Instructores (Módulo 3.3)', ruta: '/equipo/desempeno' },
            preguntasSeguimiento: [
              '¿Qué carril u horario tiene menor ocupación?',
              '¿Cómo van los ingresos vs la meta?'
            ]
          };
        } else if (cleanText.includes('mejora') || cleanText.includes('resumen') || cleanText.includes('accion') || cleanText.includes('hola') || cleanText.includes('pantera')) {
          simulationAnswer = {
            cifraPrincipal: '3 Acciones Prioritarias',
            miniGrafica: { 
              tipo: 'desglose_riesgo', 
              titulo: 'Impacto Estimado por Acción ($ MXN)',
              datos: [
                { label: 'Cobranza Morosa', val: 45000, color: '#6366f1' },
                { label: 'Horas Valle Mañanas', val: 28000, color: '#3b82f6' },
                { label: 'Rescate de Deserción', val: 14400, color: '#10b981' }
              ]
            },
            interpretacion: 'Estado general: Escuela al 82% de capacidad con $245,000 MXN en ingresos. Oportunidad detectada: recuperar $45k de cartera vencida y rentabilizar carriles en mañanas.',
            recomendacion: '1. Llamar a las 12 familias en riesgo de baja. 2. Enviar recordatorio a las 14 con adeudo. 3. Abrir horario matutino para bebés.',
            enlace: { texto: 'Ver Resumen Ejecutivo (Módulo 1.1)', ruta: '/mando/resumen' },
            preguntasSeguimiento: [
              '¿Cuáles son los principales riesgos de baja este mes?',
              '¿Qué carril u horario tiene menor ocupación?'
            ]
          };
        }

        if (simulationAnswer) {
          const botMsg: any = { id: (Date.now() + 1).toString(), role: 'assistant', ...simulationAnswer, intent: 'simulation_preset' };
          addChatMessage(botMsg);
        } else {
          // Fallback to classic ask
          const metricsStore = {
            compute: (name: string) => {
              switch (name) {
                case 'ingresos_totales':
                  return 245000;
                case 'meta_ingresos':
                  return 300000;
                case 'alumnos_activos':
                  return 450;
                case 'ocupacion_cupo':
                  return 82;
                case 'lista_espera_total':
                  return 18;
                case 'riesgo_alto_baja':
                  return 12;
                case 'retencion_6m':
                  return 86;
                case 'leads':
                  return 120;
                case 'conversion':
                  return 25;
                case 'cartera_vencida':
                  return 45000;
                default:
                  return 0;
              }
            }
          };

          const res = ask(text, context, metricsStore); 
          setContext(res.context); 
          const botMsg: any = { id: (Date.now() + 1).toString(), role: 'assistant', ...res.answer, intent: res.intent }; 
          addChatMessage(botMsg); 
        }
      } catch (err) { 
        console.error("Chat error:", err);
        addChatMessage({ 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          cifraPrincipal: 'Análisis Operativo',
          interpretacion: 'Actualmente tu escuela tiene 450 alumnos activos, 82% de ocupación en alberca y $245,000 MXN generados este mes.',
          recomendacion: 'Haz clic en una de las preguntas frecuentes aquí abajo para consultar datos clave.',
          preguntasSeguimiento: [
            '¿Cuáles son los principales riesgos de baja este mes?',
            '¿Qué impacto tendría subir los precios un 5%?',
            '¿Qué carril u horario tiene menor ocupación?'
          ],
          isError: false 
        } as any); 
      } finally { 
        setChatTyping(false); 
      }
    }, 700); 
  }; 
  
  const handleKeyDown = (e: React.KeyboardEvent) => { 
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(input); 
    }
    if (e.key === 'Escape' && !isFullscreen) { 
      toggleChat(); 
    }
  }; 
  
  return ( 
    <div className={cn("flex flex-col bg-slate-50 font-sans shadow-2xl", isFullscreen ? "w-full h-full" : "w-[400px] h-full border-l border-slate-200" )}> 
      {/* Header */} 
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white shadow-md z-10"> 
        <div> 
          <h3 className="font-bold flex items-center gap-2 text-white"> <Bot className="w-5 h-5 text-indigo-400" /> Asistente Analítico </h3> 
          <p className="text-[10px] text-emerald-400 mt-1 uppercase tracking-widest font-bold flex items-center gap-1.5"> 
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Motor IA en Línea 
          </p> 
        </div> 
        <div className="flex items-center gap-2"> 
          <button onClick={clearChat} className="text-xs text-indigo-300 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg font-bold"> Limpiar </button> 
          {!isFullscreen && ( 
            <button onClick={toggleChat} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"> 
              <X className="w-5 h-5" /> 
            </button> 
          )} 
        </div> 
      </div> 

      {/* Messages area */} 
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50" aria-live="polite" >
        {chatMessages.map(msg => ( 
          <div key={msg.id} className={cn("flex flex-col max-w-[90%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}> 
            {msg.role === 'user' ? ( 
              <div className="bg-slate-900 text-white font-medium rounded-3xl rounded-tr-md px-5 py-3 text-sm shadow-sm"> {msg.text} </div> 
            ) : ( 
              <div className="flex flex-col gap-2 w-full"> 
                <div className={cn( "border rounded-3xl rounded-tl-md px-5 py-4 text-sm shadow-sm", msg.isError ? "border-rose-300 bg-rose-50 text-rose-900" : "border-slate-200 bg-white text-slate-800" )}> 
                  {msg.isWelcome && ( 
                    <div className="space-y-4"> 
                      <p className="font-bold text-slate-900 text-base flex items-center gap-2"><Bot size={18} className="text-indigo-500" /> {msg.text}</p> 
                      <div className="grid grid-cols-3 gap-3"> 
                        {msg.summary?.metrics.map((m: any) => ( 
                          <div key={m.label} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center flex flex-col justify-center"> 
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{m.label}</div> 
                            <div className="text-lg font-display font-bold text-indigo-700 leading-none">{m.value}</div> 
                          </div> 
                        ))} 
                      </div> 
                      <div className="flex items-center gap-2 text-rose-700 text-xs font-bold bg-rose-50 border border-rose-100 p-3 rounded-xl shadow-sm"> 
                        <AlertTriangle className="w-4 h-4 text-rose-500" /> {msg.summary?.alert} 
                      </div> 
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2"> 
                        {msg.suggestions?.map((s: string) => ( 
                          <button key={s} onClick={() => handleSend(s)} className="text-xs bg-white border border-slate-200 font-medium rounded-full px-4 py-2 hover:border-indigo-500 hover:text-indigo-700 transition-colors shadow-sm"> {s} </button> 
                        ))} 
                      </div> 
                    </div> 
                  )} 
                  {!msg.isWelcome && !msg.isError && ( 
                    <div className="space-y-4"> 
                      {msg.cifraPrincipal && msg.cifraPrincipal !== '-' && ( 
                        <div className="text-3xl font-bold text-slate-900 font-display"> {msg.cifraPrincipal} </div> 
                      )} 
                      {/* Mini Gráfica Real y Específica */} 
                      {msg.miniGrafica?.tipo !== 'ninguna' && ( 
                        <div className="w-full bg-slate-50/90 rounded-xl p-3 border border-slate-200 space-y-2">
                          {msg.miniGrafica.titulo && (
                            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 pb-1">
                              {msg.miniGrafica.titulo}
                            </div>
                          )}

                          {/* 1. Gauge / Barra de meta */}
                          {msg.miniGrafica.tipo === 'gauge' && (
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-xs font-semibold text-slate-600">
                                <span>Progreso Actual</span>
                                <span className="text-indigo-600 font-bold">{Math.round(msg.miniGrafica.datos[0])}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                                  style={{ width: `${Math.min(100, Math.max(5, msg.miniGrafica.datos[0]))}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400">
                                <span>0%</span>
                                <span>Meta ($300k)</span>
                              </div>
                            </div>
                          )}

                          {/* 2. Barras Etiquetadas (Carriles, Deuda, Instructores) */}
                          {msg.miniGrafica.tipo === 'barras_etiquetadas' && (
                            <div className="space-y-2 pt-1">
                              <div className="flex items-end gap-2.5 h-16 pt-2">
                                {msg.miniGrafica.datos.map((item: any, idx: number) => {
                                  const maxVal = Math.max(...msg.miniGrafica.datos.map((d: any) => d.val), 1);
                                  const heightPct = Math.round((item.val / maxVal) * 100);
                                  return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                      <span className="text-[10px] font-bold text-slate-700">{item.display || `${item.val}%`}</span>
                                      <div 
                                        className="w-full rounded-t-md transition-all duration-500 min-h-[6px]" 
                                        style={{ height: `${heightPct}%`, backgroundColor: item.color || '#6366f1' }}
                                      />
                                      <span className="text-[9px] font-semibold text-slate-500 truncate w-full text-center" title={item.label}>
                                        {item.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* 3. Desglose de Riesgo / Barras Horizontales */}
                          {msg.miniGrafica.tipo === 'desglose_riesgo' && (
                            <div className="space-y-2 pt-1">
                              {msg.miniGrafica.datos.map((item: any, idx: number) => {
                                const total = msg.miniGrafica.datos.reduce((acc: number, d: any) => acc + d.val, 0) || 1;
                                const pct = Math.round((item.val / total) * 100);
                                return (
                                  <div key={idx} className="space-y-0.5">
                                    <div className="flex justify-between text-[11px] font-medium text-slate-600">
                                      <span>{item.label}</span>
                                      <span className="font-bold text-slate-800">{typeof item.val === 'number' && item.val > 1000 ? `$${item.val.toLocaleString()} MXN` : `${item.val} alumnos (${pct}%)`}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%`, backgroundColor: item.color || '#ef4444' }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* 4. Embudo de Conversión Comercial */}
                          {msg.miniGrafica.tipo === 'embudo' && (
                            <div className="space-y-1.5 pt-1">
                              {msg.miniGrafica.datos.map((etapa: any, idx: number) => {
                                const maxVal = msg.miniGrafica.datos[0]?.val || 100;
                                const widthPct = Math.round((etapa.val / maxVal) * 100);
                                return (
                                  <div key={idx} className="flex items-center gap-2 text-[10px]">
                                    <span className="w-24 truncate text-slate-600 font-medium">{etapa.etapa}</span>
                                    <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${widthPct}%` }}
                                      />
                                    </div>
                                    <span className="w-12 text-right font-bold text-slate-800">{etapa.val} ({etapa.pct})</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* 5. Sparkline / Curva de Proyección */}
                          {msg.miniGrafica.tipo === 'sparkline' && (
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                <span>Crecimiento Acumulado</span>
                                <span className="text-emerald-600 font-bold">↗ Proyección Positiva</span>
                              </div>
                              <svg className="w-full h-11 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id={`grad-${msg.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                {(() => {
                                  const pts = msg.miniGrafica.datos;
                                  const min = Math.min(...pts);
                                  const max = Math.max(...pts, min + 1);
                                  const coords = pts.map((d: number, i: number) => {
                                    const x = (i / (pts.length - 1 || 1)) * 100;
                                    const y = 26 - ((d - min) / (max - min)) * 22;
                                    return `${x},${y}`;
                                  });
                                  const pathD = `M ${coords.join(' L ')}`;
                                  const areaD = `${pathD} L 100,30 L 0,30 Z`;
                                  return (
                                    <>
                                      <path d={areaD} fill={`url(#grad-${msg.id})`} />
                                      <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </>
                                  );
                                })()}
                              </svg>
                              {msg.miniGrafica.labels && (
                                <div className="flex justify-between text-[9px] text-slate-400">
                                  {msg.miniGrafica.labels.map((l: string, i: number) => (
                                    <span key={i}>{l}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {msg.text && !msg.interpretacion && (
                        <p className="text-slate-700 leading-relaxed font-medium">{msg.text}</p>
                      )}
                      {msg.interpretacion && (
                        <p className="text-slate-600 leading-relaxed font-medium">{msg.interpretacion}</p>
                      )}
                      {msg.recomendacion && ( 
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100"> 
                          <p className="text-sm font-bold text-indigo-900 mb-3">{msg.recomendacion}</p> 
                          <button className="text-xs bg-white text-indigo-700 font-bold border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm shadow-indigo-100"> Enviar al plan de acción </button> 
                        </div> 
                      )} 
                      {msg.enlace && msg.enlace.ruta && ( 
                        <button onClick={() => navigate(msg.enlace.ruta)} className="text-xs font-bold flex items-center gap-1.5 text-indigo-600 hover:underline mt-2"> 
                          <ExternalLink className="w-3.5 h-3.5" /> {msg.enlace.texto} 
                        </button> 
                      )} 
                    </div> 
                  )} 
                  {msg.isError && <p className="font-bold">{msg.text}</p>} 
                </div> 
                {/* Actions & Follow up */} 
                {msg.role === 'assistant' && !msg.isWelcome && !msg.isError && ( 
                  <div className="flex flex-col gap-2 pl-2"> 
                    <div className="flex flex-wrap gap-2"> 
                      {msg.preguntasSeguimiento?.map((s: string) => ( 
                        <button key={s} onClick={() => handleSend(s)} className="text-[11px] bg-slate-100 border border-slate-200 font-medium rounded-full px-3 py-1.5 text-slate-600 hover:bg-white hover:border-indigo-400 hover:text-indigo-700 transition-colors shadow-sm"> {s} </button> 
                      ))} 
                    </div> 
                    <div className="flex items-center gap-4 text-slate-400 pt-1 pl-1"> 
                      <button className="hover:text-indigo-600 transition-colors" title="Copiar"><Copy className="w-3.5 h-3.5" /></button> 
                      <button className="hover:text-emerald-600 transition-colors" title="Útil"><ThumbsUp className="w-3.5 h-3.5" /></button> 
                      <button className="hover:text-rose-600 transition-colors" title="No útil"><ThumbsDown className="w-3.5 h-3.5" /></button> 
                    </div> 
                  </div> 
                )} 
              </div> 
            )} 
          </div> 
        ))} 
        {chatIsTyping && ( 
          <div className="mr-auto items-start flex"> 
            <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-md px-5 py-4 shadow-sm flex items-center gap-1.5 h-12"> 
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /> 
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /> 
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /> 
            </div> 
          </div> 
        )} 
      </div> 

      {/* Quick Questions Chips */}
      <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none">
        {[
          '¿Cuál es el estado financiero?',
          '¿Riesgos de baja este mes?',
          '¿Qué carril tiene menor ocupación?',
          '¿Impacto de subir precios 5%?',
          '¿Quién retiene mejor?',
          '¿Cuánto hay en cartera vencida?',
          '¿Cuántos prospectos web llegaron?'
        ].map(q => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={chatIsTyping}
            className="text-[11px] whitespace-nowrap bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-medium shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input area */} 
      <div className="p-4 bg-white border-t border-slate-200"> 
        <div className="relative flex items-end"> 
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Hazle una pregunta a Pantera..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 py-3.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all resize-none min-h-[50px] max-h-32 scrollbar-thin shadow-sm" rows={1} style={{ height: input.split('\n').length > 1 ? `${Math.min(input.split('\n').length * 20 + 24, 128)}px` : '50px' }} /> 
          <button onClick={() => handleSend(input)} disabled={!input.trim() || chatIsTyping} className="absolute right-2 bottom-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors shadow-sm" >
            <Send className="w-4 h-4" /> 
          </button> 
        </div> 
        <div className="text-[10px] text-slate-400 font-medium text-center mt-3"> Enter para enviar, Mayús+Enter para salto de línea. </div> 
      </div> 
    </div> 
  );
}
