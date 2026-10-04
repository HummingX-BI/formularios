import { useState, useMemo } from 'react';
import { useMetrics } from '@/metrics/hooks';
import { Card } from '@/ui/components/Cards';
import { Slider } from '@/ui/components/Inputs';

export default function M1_2_Health() {
  const metricsEngine = useMetrics();

  // Dimenciones
  const [weights, setWeights] = useState({
    retencion: 30,
    ocupacion: 20,
    conversion: 20,
    financiera: 20,
    satisfaccion: 10,
  });

  const m = useMemo(() => {
    return {
      retencion: metricsEngine.compute('retencion_6m') || 85,
      ocupacion: metricsEngine.compute('ocupacion_cupo') || 75,
      conversion: metricsEngine.compute('conversion') || 25,
      financiera: 90, // Placeholder
      satisfaccion: 88, // Placeholder
    };
  }, [metricsEngine]);

  const indexScore = (
    m.retencion * (weights.retencion / 100) +
    m.ocupacion * (weights.ocupacion / 100) +
    m.conversion * 2 * (weights.conversion / 100) + // Normalizing conversion to ~100 scale
    m.financiera * (weights.financiera / 100) +
    m.satisfaccion * (weights.satisfaccion / 100)
  ).toFixed(1);

  const getStatusColor = (val: number) => {
    if (val >= 80) return 'text-verde-agua';
    if (val >= 60) return 'text-ambar';
    return 'text-coral';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">
            Índice de Salud del Negocio
          </h1>
          <p className="text-lg text-secundario mt-1">
            Calificación ponderada del desempeño general
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center col-span-1">
          <h3 className="text-lg font-bold text-navy-900 mb-4">Salud Global</h3>
          <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-8 border-ice-100">
            {/* Simple CSS placeholder for Gauge */}
            <div
              className={`text-5xl font-bold font-jakarta ${getStatusColor(Number(indexScore))}`}
            >
              {indexScore}
            </div>
          </div>
          <p className="mt-4 text-secundario text-center">
            {Number(indexScore) >= 80
              ? 'El negocio está en excelente forma.'
              : 'Hay áreas de oportunidad importantes.'}
          </p>
        </Card>

        <Card className="p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-navy-900 mb-4">Dimensiones vs Meta (Radar)</h3>
          <div className="h-48 bg-ice-50 rounded flex items-center justify-center text-secundario">
            [RadarChart: Retención, Ocupación, Conversión, Finanzas, Satisfacción]
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Evolución (24 Meses)</h3>
        <div className="h-64 bg-ice-50 rounded flex items-center justify-center text-secundario">
          [LineChart con franja de semáforo]
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            key: 'retencion',
            label: 'Retención',
            val: m.retencion,
            desc: 'Tasa de retención a 6 meses',
          },
          { key: 'ocupacion', label: 'Ocupación', val: m.ocupacion, desc: 'Capacidad utilizada' },
          {
            key: 'conversion',
            label: 'Conversión',
            val: m.conversion * 2,
            desc: 'Prospectos convertidos',
          },
          { key: 'financiera', label: 'Finanzas', val: m.financiera, desc: 'Brecha de cobranza' },
          {
            key: 'satisfaccion',
            label: 'Satisfacción',
            val: m.satisfaccion,
            desc: 'NPS de alumnos',
          },
        ].map((d) => (
          <Card key={d.key} className="p-4 cursor-pointer hover:border-blue-600 transition-colors">
            <h4 className="font-bold text-navy-900 text-sm mb-1">{d.label}</h4>
            <div className={`text-2xl font-bold font-jakarta mb-2 ${getStatusColor(d.val)}`}>
              {d.val.toFixed(1)}
            </div>
            <p className="text-xs text-secundario">{d.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Simulador de Ponderaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {Object.keys(weights).map((k) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{k}</span>
                  <span>{weights[k as keyof typeof weights]}%</span>
                </div>
                <Slider
                  value={weights[k as keyof typeof weights]}
                  onChangeValue={(v) => setWeights((prev) => ({ ...prev, [k]: v }))}
                  max={100}
                />
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm text-secundario mb-4">
              Ajusta los pesos para ver cómo afectaría al índice global. Esto no altera la
              configuración general de la cuenta.
            </p>
            <div className="p-4 bg-ice-50 rounded text-center">
              <span className="block text-sm text-secundario mb-1">Índice Simulado</span>
              <span
                className={`text-4xl font-bold font-jakarta ${getStatusColor(Number(indexScore))}`}
              >
                {indexScore}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
