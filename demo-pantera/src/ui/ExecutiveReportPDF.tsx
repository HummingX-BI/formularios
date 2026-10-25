import React from 'react';
import { BRAND } from '@/config';

export function ExecutiveReportPDF() {
  const now = new Date();
  const month = now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }).toUpperCase();
  const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full h-auto">
      
      {/* PÁGINA 1 */}
      <div className="bg-white text-black shadow-2xl relative shrink-0 overflow-hidden" style={{ width: '794px', minHeight: '1123px', padding: '1in' }}>
        
        {/* Header Corporativo */}
        <div className="border-b-4 border-blue-900 pb-4 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-blue-950 uppercase">{BRAND.name}</h1>
            <p className="text-xs font-sans text-slate-600 tracking-widest mt-1">SISTEMA DE INTELIGENCIA DE NEGOCIO</p>
          </div>
          <div className="text-right text-xs font-sans">
            <p><strong>REPORTE EJECUTIVO DE DIRECCIÓN</strong></p>
            <p className="mt-1">PERIODO: {month}</p>
            <p>FECHA DE EMISIÓN: {dateStr}</p>
            <p>REF: AI-FIN-001</p>
          </div>
        </div>

        {/* Resumen Ejecutivo */}
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-blue-900 pb-1 mb-4">1. Resumen Ejecutivo</h2>
          <p className="text-xs font-serif leading-relaxed text-justify mb-4">
            El presente informe detalla el desempeño financiero y operativo del periodo en curso. Los márgenes de utilidad operativa se mantienen consistentes con las proyecciones iniciales del trimestre. Se identifica un área de oportunidad inmediata en la recuperación de cuentas por cobrar (cartera vencida), cuya corrección podría impactar positivamente el flujo de efectivo a corto plazo.
          </p>
        </div>

        {/* Estado de Resultados */}
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-blue-900 pb-1 mb-4">2. Estado de Resultados Consolidado</h2>
          <table className="w-full text-xs font-sans text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-blue-900 text-blue-950">
                <th className="py-2 font-bold uppercase">Concepto</th>
                <th className="py-2 font-bold uppercase text-right">Monto (MXN)</th>
                <th className="py-2 font-bold uppercase text-right">Variación vs Mes Anterior</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2">Ingresos Facturados Brutos</td>
                <td className="py-2 text-right">$ 245,000.00</td>
                <td className="py-2 text-right text-slate-600">+ 4.2%</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Ingresos Efectivamente Cobrados</td>
                <td className="py-2 text-right">$ 218,500.00</td>
                <td className="py-2 text-right text-slate-600">+ 2.1%</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Costos y Gastos Operativos (Estimado)</td>
                <td className="py-2 text-right">$ 133,100.00</td>
                <td className="py-2 text-right text-slate-600">- 1.5%</td>
              </tr>
              <tr className="border-b-2 border-blue-900 font-bold bg-blue-50/50">
                <td className="py-2 text-blue-950">Utilidad Operativa Libre</td>
                <td className="py-2 text-right text-blue-900">$ 85,400.00</td>
                <td className="py-2 text-right text-blue-700">+ 3.8%</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <p className="text-xs font-bold bg-slate-100 px-3 py-1 border border-slate-300">Margen Operativo: 39.08%</p>
          </div>
        </div>

        {/* Análisis de Cartera */}
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-blue-900 pb-1 mb-4">3. Análisis de Cartera Vencida y Riesgo</h2>
          <p className="text-xs font-serif leading-relaxed text-justify mb-4">
            Al cierre del periodo, se registra un déficit de flujo de efectivo por concepto de cuentas no cobradas. La siguiente tabla y gráfico desglosan el impacto directo de esta anomalía.
          </p>
          <table className="w-full text-xs font-sans text-left border-collapse mb-6">
            <thead>
              <tr className="border-b-2 border-blue-900 text-blue-950">
                <th className="py-2 font-bold uppercase">Indicador de Riesgo</th>
                <th className="py-2 font-bold uppercase text-right">Valor</th>
                <th className="py-2 font-bold uppercase text-right">Observación de Inteligencia</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2">Total Cartera Vencida</td>
                <td className="py-2 text-right">$ 26,500.00</td>
                <td className="py-2 text-right">Fuga de liquidez inmediata</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Índice de Efectividad de Cobro</td>
                <td className="py-2 text-right">89.18%</td>
                <td className="py-2 text-right">Debajo del objetivo (95%)</td>
              </tr>
            </tbody>
          </table>

          {/* Gráfico Cascada CSS */}
          <div className="border border-slate-300 p-4 bg-slate-50">
            <h3 className="text-[10px] font-bold text-center mb-6 uppercase tracking-widest text-slate-500">Composición del Flujo (Cascada)</h3>
            <div className="relative h-32 w-full text-[9px] font-mono text-slate-600">
              
              {/* Bar 1: Ingreso Facturado */}
              <div className="absolute bottom-0 left-[5%] w-[15%] h-full bg-blue-900/80 flex flex-col justify-start items-center">
                <span className="absolute -top-5 font-bold">$245k</span>
                <span className="absolute -bottom-8 text-center leading-tight">Ingreso<br/>Facturado</span>
              </div>

              {/* Conector 1 a 2 */}
              <div className="absolute top-0 left-[20%] w-[10%] border-t border-dashed border-slate-400"></div>

              {/* Bar 2: Cartera Vencida (Negativo, cuelga desde arriba) */}
              <div className="absolute top-0 left-[30%] w-[15%] h-[11%] bg-red-600/80 flex flex-col justify-end items-center">
                <span className="absolute -top-5 text-red-700 font-bold">-$26k</span>
                <span className="absolute -bottom-8 text-center leading-tight">Cartera<br/>Vencida</span>
              </div>

              {/* Conector 2 a 3 */}
              <div className="absolute top-[11%] left-[45%] w-[10%] border-t border-dashed border-slate-400"></div>

              {/* Bar 3: Costos Operativos (Negativo, cuelga desde donde terminó la anterior) */}
              <div className="absolute top-[11%] left-[55%] w-[15%] h-[54%] bg-slate-400 flex flex-col justify-end items-center">
                <span className="absolute top-1 text-white font-bold">-$133k</span>
                <span className="absolute -bottom-8 text-center leading-tight">Costos<br/>Operativos</span>
              </div>

              {/* Conector 3 a 4 */}
              <div className="absolute top-[65%] left-[70%] w-[10%] border-t border-dashed border-slate-400"></div>

              {/* Bar 4: Utilidad Libre (Total, se asienta en el eje x) */}
              <div className="absolute bottom-0 left-[80%] w-[15%] h-[35%] bg-emerald-600/80 flex flex-col justify-start items-center">
                <span className="absolute -top-5 font-bold text-emerald-800">$85k</span>
                <span className="absolute -bottom-8 text-center leading-tight font-bold">Utilidad<br/>Libre</span>
              </div>

              {/* Eje X */}
              <div className="absolute bottom-0 left-0 w-full border-b border-black"></div>
            </div>
            {/* Espaciador inferior para las etiquetas */}
            <div className="h-8"></div>
          </div>
        </div>

      </div>

      {/* PÁGINA 2 */}
      <div className="bg-white text-black shadow-2xl relative shrink-0 overflow-hidden" style={{ width: '794px', minHeight: '1123px', padding: '1in' }}>
        
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-blue-900 pb-1 mb-4">4. Métricas de Adquisición y Ciclo de Vida del Alumno</h2>
          <p className="text-xs font-serif leading-relaxed text-justify mb-4">
            La sostenibilidad a largo plazo de la institución depende de un costo de adquisición controlado y un alto valor de retención. A continuación, se presenta la auditoría de crecimiento comercial.
          </p>
          
          <table className="w-full text-xs font-sans text-left border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-blue-900 text-blue-950">
                <th className="py-2 font-bold uppercase">Métrica de Marketing y Ventas</th>
                <th className="py-2 font-bold uppercase text-right">Volumen / Costo</th>
                <th className="py-2 font-bold uppercase text-right">Tasa de Conversión Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2">Prospectos Generados (Leads)</td>
                <td className="py-2 text-right">142 unidades</td>
                <td className="py-2 text-right">--</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Clases de Prueba Agendadas</td>
                <td className="py-2 text-right">85 unidades</td>
                <td className="py-2 text-right">59.8% (Lead a Prueba)</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Nuevas Inscripciones (Matrículas)</td>
                <td className="py-2 text-right">41 unidades</td>
                <td className="py-2 text-right">28.8% (Lead a Matrícula)</td>
              </tr>
              <tr className="border-b-2 border-blue-900 font-bold bg-blue-50/50">
                <td className="py-2 text-blue-950">Costo de Adquisición por Alumno (CAC)</td>
                <td className="py-2 text-right text-blue-900">$ 450.00 MXN</td>
                <td className="py-2 text-right text-blue-700">Óptimo</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full text-xs font-sans text-left border-collapse mb-4">
            <thead>
              <tr className="border-b-2 border-blue-900 text-blue-950">
                <th className="py-2 font-bold uppercase">Métrica de Lealtad y Retención</th>
                <th className="py-2 font-bold uppercase text-right">Valor Actual</th>
                <th className="py-2 font-bold uppercase text-right">Benchmark (Objetivo)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2">Tasa de Deserción Mensual (Churn Rate)</td>
                <td className="py-2 text-right">4.1%</td>
                <td className="py-2 text-right">&lt; 8.0%</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Vida Útil Promedio del Alumno</td>
                <td className="py-2 text-right">11 Meses</td>
                <td className="py-2 text-right">12 Meses</td>
              </tr>
              <tr className="border-b-2 border-blue-900 font-bold bg-blue-50/50">
                <td className="py-2 text-blue-950">Valor Total del Alumno (LTV)</td>
                <td className="py-2 text-right text-blue-900">$ 12,400.00 MXN</td>
                <td className="py-2 text-right text-blue-700">&gt; $ 10,000.00 MXN</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-blue-900 pb-1 mb-4">5. Eficiencia Operativa de Instalaciones</h2>
          <table className="w-full text-xs font-sans text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-blue-900 text-blue-950">
                <th className="py-2 font-bold uppercase">Indicador de Capacidad Instalada</th>
                <th className="py-2 font-bold uppercase text-right">Métrica Registrada</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2">Ocupación General de la Alberca</td>
                <td className="py-2 text-right">72.0%</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Rentabilidad Promedio por Hora-Carril</td>
                <td className="py-2 text-right">$ 450.00 MXN</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2">Horarios con Déficit de Ocupación (&lt; 40%)</td>
                <td className="py-2 text-right">09:00 AM - 11:00 AM</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* PÁGINA 3 */}
      <div className="bg-white text-black shadow-2xl relative shrink-0 overflow-hidden flex flex-col justify-between" style={{ width: '794px', minHeight: '1123px', padding: '1in' }}>
        
        <div>
          <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-blue-900 pb-1 mb-4">6. Pronóstico Financiero (Modelado Predictivo)</h2>
            <p className="text-xs font-serif leading-relaxed text-justify mb-4">
              En base al análisis de series de tiempo y estacionalidad histórica, se proyectan los siguientes escenarios para el cierre del próximo trimestre, asumiendo una constancia en la inversión publicitaria y condiciones macroeconómicas estables.
            </p>
            <table className="w-full text-xs font-sans text-left border-collapse mb-6">
              <thead>
                <tr className="border-b-2 border-blue-900 text-blue-950">
                  <th className="py-2 font-bold uppercase">Escenario Predictivo</th>
                  <th className="py-2 font-bold uppercase text-right">Proyección de Ingresos</th>
                  <th className="py-2 font-bold uppercase text-right">Probabilidad Estadística</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-2">Escenario Conservador (Base)</td>
                  <td className="py-2 text-right">$ 251,000.00</td>
                  <td className="py-2 text-right">85.4%</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2">Escenario Optimista (+ Estacionalidad Verano)</td>
                  <td className="py-2 text-right">$ 285,500.00</td>
                  <td className="py-2 text-right">62.1%</td>
                </tr>
              </tbody>
            </table>

            {/* Gráfico Pronóstico Barras CSS */}
            <div className="border border-slate-300 p-4 bg-slate-50">
              <h3 className="text-[10px] font-bold text-center mb-4 uppercase tracking-widest text-slate-500">Proyección de Ingresos Trimestral</h3>
              <div className="flex items-end justify-around h-32 gap-4 text-[9px] font-mono text-slate-600">
                <div className="flex flex-col items-center justify-end w-8 h-full">
                  <span className="mb-1">$220k</span>
                  <div className="w-full bg-slate-300 h-[60%]"></div>
                  <span className="mt-2 font-bold">Mes -2</span>
                </div>
                <div className="flex flex-col items-center justify-end w-8 h-full">
                  <span className="mb-1">$235k</span>
                  <div className="w-full bg-slate-300 h-[65%]"></div>
                  <span className="mt-2 font-bold">Mes -1</span>
                </div>
                <div className="flex flex-col items-center justify-end w-8 h-full">
                  <span className="mb-1 text-blue-900">$245k</span>
                  <div className="w-full bg-blue-900 h-[70%]"></div>
                  <span className="mt-2 font-bold text-blue-900">Actual</span>
                </div>
                <div className="flex flex-col items-center justify-end w-8 h-full">
                  <span className="mb-1 text-emerald-700">$251k</span>
                  <div className="w-full bg-emerald-600 h-[75%] border border-dashed border-emerald-900"></div>
                  <span className="mt-2 font-bold text-emerald-700">Mes +1</span>
                </div>
                <div className="flex flex-col items-center justify-end w-8 h-full">
                  <span className="mb-1 text-emerald-700">$270k</span>
                  <div className="w-full bg-emerald-600 h-[85%] border border-dashed border-emerald-900"></div>
                  <span className="mt-2 font-bold text-emerald-700">Mes +2</span>
                </div>
                <div className="flex flex-col items-center justify-end w-8 h-full">
                  <span className="mb-1 text-emerald-700 font-bold">$285k</span>
                  <div className="w-full bg-emerald-600 h-[95%] border border-dashed border-emerald-900"></div>
                  <span className="mt-2 font-bold text-emerald-700">Mes +3</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-blue-900 pb-1 mb-4">7. Dictamen y Resoluciones Sugeridas</h2>
            <p className="text-xs font-serif leading-relaxed text-justify mb-4">
              Para maximizar la rentabilidad operativa durante el próximo periodo fiscal, la Dirección debe priorizar las siguientes acciones estratégicas:
            </p>
            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 border border-black shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-bold uppercase">Consolidación de Grupos en Horarios Valle</p>
                  <p className="text-slate-600 mt-1">Reubicar matrículas activas del horario de 17:00 Hrs hacia las 16:00 Hrs para reducir costos fijos de instrucción y operatividad del agua.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 border border-black shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-bold uppercase">Auditoría y Ejecución de Cobranza Institucional</p>
                  <p className="text-slate-600 mt-1">Iniciar procesos de requerimiento de pago para los registros que componen la cartera vencida de $ 26,500 MXN, con meta de recuperación del 60%.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 border border-black shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-bold uppercase">Campaña de Penetración Matutina</p>
                  <p className="text-slate-600 mt-1">Asignar presupuesto específico para adquisición de leads en el segmento demográfico disponible de 09:00 AM a 11:00 AM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Firmas */}
        <div className="mt-20">
          <div className="grid grid-cols-2 gap-16 px-10">
            <div className="col-span-2 flex justify-center">
              <div className="text-center w-64">
                <div className="border-b border-blue-900 h-16 mb-2"></div>
                <p className="text-xs font-bold uppercase text-blue-950">Dirección General</p>
                <p className="text-[10px] text-slate-500">Revisión y Aprobación</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
