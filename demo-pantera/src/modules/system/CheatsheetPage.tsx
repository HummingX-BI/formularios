import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAppStore } from '@/app/store';
import { useMetrics } from '@/metrics/hooks';

export default function CheatsheetPage() {
  const { seed } = useAppStore();
  const metricsProvider = useMetrics();
  const activeStudents = metricsProvider.compute('alumnos_activos');
  const mrr = metricsProvider.compute('ingresos_totales');
  const occupancyRate = metricsProvider.compute('ocupacion_cupo') / 100;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hoja de Apoyo del Presentador</h1>
          <p className="text-slate-500">Semilla activa: <span className="font-mono font-bold">{seed}</span></p>
        </div>
        <div className="text-right">
          <p className="text-sm text-red-600 font-bold">CONFIDENCIAL</p>
          <button onClick={() => window.print()} className="mt-2 text-sm text-sky-600 hover:underline no-print">Imprimir esta hoja</button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-200 pb-2">1. Cifras Clave (Generadas para Semilla {seed})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="block text-slate-500 text-xs">Alumnos Activos</span>
            <span className="font-bold text-lg">{activeStudents ?? 'Cargando...'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="block text-slate-500 text-xs">Ingreso del Mes</span>
            <span className="font-bold text-lg">${(mrr ?? 0).toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="block text-slate-500 text-xs">Ocupación General</span>
            <span className="font-bold text-lg">{((occupancyRate ?? 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="block text-slate-500 text-xs">Nivel Cuello Botella</span>
            <span className="font-bold text-lg">Principiantes</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-200 pb-2">2. Guion Paso a Paso (Flujo G - 15 min)</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2 border border-slate-300">Paso</th>
              <th className="p-2 border border-slate-300">Acción en App</th>
              <th className="p-2 border border-slate-300">Punto de Charla (Qué ver)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-slate-300 font-bold text-center">1</td>
              <td className="p-2 border border-slate-300 text-sky-700 font-mono text-xs">Atajo: 'P'</td>
              <td className="p-2 border border-slate-300">Activa Modo Presentación (limpia menús laterales, agranda fuentes). Presenta el Dashboard (M1.1). Destaca Activos e Ingresos.</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-300 font-bold text-center">2</td>
              <td className="p-2 border border-slate-300">Ir a Operación &gt; Lista de Espera</td>
              <td className="p-2 border border-slate-300">Muestra saturación. Destaca que "Sábados a las 10AM" tiene X alumnos esperando.</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-300 font-bold text-center">3</td>
              <td className="p-2 border border-slate-300">Ir a Prescriptivo &gt; Simulador de Aperturas</td>
              <td className="p-2 border border-slate-300">Usa el simulador para resolver la lista de espera. Crea grupo sábado 10AM y ve cómo los ingresos proyectados suben de inmediato.</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-300 font-bold text-center">4</td>
              <td className="p-2 border border-slate-300">Ir a Machine Learning &gt; Predicción Bajas</td>
              <td className="p-2 border border-slate-300">Muestra la tabla de probabilidad de baja. Señala un estudiante en rojo (riesgo alto).</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-300 font-bold text-center">5</td>
              <td className="p-2 border border-slate-300">Ir a Asistente IA (Icono superior)</td>
              <td className="p-2 border border-slate-300">Abre el cajón del asistente. Si el cajón no está 100% completo, explica que el asistente centraliza los datos.</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-300 font-bold text-center">6</td>
              <td className="p-2 border border-slate-300">Ir a Plan de Acción (Check superior)</td>
              <td className="p-2 border border-slate-300">Revisa la lista de tareas dinámicas. Termina con "Pantera no solo informa, acciona".</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-200 pb-2">3. Contingencias Rápidas</h2>
        <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700">
          <li><strong>Si la UI se rompe o traba:</strong> Presiona F5. El estado se re-generará de inmediato desde la misma semilla de forma idéntica.</li>
          <li><strong>Si hay un dato sin sentido:</strong> Di "Esta semilla del generador nos dio un caso extremo útil para ver cómo reaccionan las alertas".</li>
          <li><strong>Ocultar barra izquierda rápidamente:</strong> Presiona 'P'.</li>
          <li><strong>Buscador:</strong> Usa 'Ctrl+K' o '/' para saltar rápidamente a cualquier módulo si te pierdes.</li>
        </ul>
      </section>

      <style>{`
        @media print {
          body { font-size: 12pt; background: white; }
          .no-print { display: none; }
        }
      `}</style>
    </div>
  );
}
