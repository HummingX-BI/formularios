import { useState, useMemo } from 'react';
import { Card, KpiCard } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { useDataset } from '@/data/hooks';

export default function M3_3_InstructorScorecard() {
  const dataset = useDataset();
  const instructorsOptions = useMemo(() => dataset.instructors.map(i => ({ label: i.name, value: i.id })), [dataset]);
  const [selectedInstructorId, setSelectedInstructorId] = useState(instructorsOptions[0]?.value || '');

  const instructor = useMemo(() => dataset.instructors.find(i => i.id === selectedInstructorId), [dataset, selectedInstructorId]);

  // Mock performance metrics based on instructor ID
  const metrics = useMemo(() => {
    if (!instructor) return null;
    const isGood = instructor.id.charCodeAt(0) % 2 === 0;
    return {
      alumnos: isGood ? 45 : 30,
      retencion3m: isGood ? 92 : 81,
      retencion6m: isGood ? 85 : 72,
      asistencia: isGood ? 94 : 88,
      tiempoPrincipiante: isGood ? 4.2 : 5.8, // meses
      rentabilidad: isGood ? 450 : 320, // $/hr
    };
  }, [instructor]);

  if (!instructor || !metrics) return <div>No hay instructores disponibles.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Ficha de Desempeño</h1>
          <p className="text-lg text-secundario mt-1">Evaluación de métricas clave por instructor</p>
        </div>
        <div className="w-64">
          <Select options={instructorsOptions} value={selectedInstructorId} onChange={e => setSelectedInstructorId(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <KpiCard
          title="Alumnos a Cargo"
          value={metrics.alumnos}
          variation={2}
          variationLabel="vs promedio esc."
          semanticColor="positive"
        />
        <KpiCard
          title="Retención 3M"
          value={metrics.retencion3m}
          unit="%"
          variation={metrics.retencion3m > 85 ? 5 : -3}
          variationLabel="vs promedio esc."
          semanticColor={metrics.retencion3m > 85 ? 'positive' : 'negative'}
        />
        <KpiCard
          title="Retención 6M"
          value={metrics.retencion6m}
          unit="%"
          variation={metrics.retencion6m > 80 ? 4 : -5}
          variationLabel="vs promedio esc."
          semanticColor={metrics.retencion6m > 80 ? 'positive' : 'negative'}
        />
        <KpiCard
          title="Asistencia Promedio"
          value={metrics.asistencia}
          unit="%"
          variation={metrics.asistencia > 90 ? 2 : -2}
          variationLabel="vs promedio esc."
          semanticColor={metrics.asistencia > 90 ? 'positive' : 'negative'}
        />
        <KpiCard
          title="Tiempo Nivel Princ."
          value={metrics.tiempoPrincipiante}
          unit="m"
          variation={metrics.tiempoPrincipiante < 5 ? -0.8 : 0.8}
          variationLabel="vs promedio esc."
          semanticColor={metrics.tiempoPrincipiante < 5 ? 'positive' : 'negative'}
          infoText="Menor tiempo es mejor (mayor eficiencia)"
        />
        <KpiCard
          title="Rentabilidad (Hr)"
          value={metrics.rentabilidad}
          isCurrency
          variation={metrics.rentabilidad > 400 ? 50 : -30}
          variationLabel="vs promedio esc."
          semanticColor={metrics.rentabilidad > 400 ? 'positive' : 'negative'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Comparativa vs Escuela</h3>
          <div className="h-64 bg-ice-50 rounded flex items-center justify-center text-secundario border border-ice-100">
            [Gráfica de Barras Comparativas: Múltiples KPIs normalizados]
          </div>
        </Card>
        
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Retención por Cohorte del Instructor</h3>
          <div className="h-64 bg-ice-50 rounded flex items-center justify-center text-secundario border border-ice-100">
            [Gráfica de Líneas/Área: Retención de alumnos a 1, 3 y 6 meses]
          </div>
        </Card>
      </div>
    </div>
  );
}
