import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Table } from '@/ui/components/Table';
import { ProgressBar } from '@/ui/components/Feedback';

const reports = [
  {
    id: 'r1',
    title: 'Alumnos Activos',
    desc: 'Listado completo de alumnos con suscripción vigente y plan.',
  },
  {
    id: 'r2',
    title: 'Ingresos del Periodo',
    desc: 'Detalle de pagos recibidos en el periodo seleccionado.',
  },
  { id: 'r3', title: 'Asistencia por Grupo', desc: 'Registro de asistencias y faltas por clase.' },
  {
    id: 'r4',
    title: 'Cartera Vencida',
    desc: 'Familias con saldos pendientes y antigüedad de la deuda.',
  },
  {
    id: 'r5',
    title: 'Nómina del Periodo',
    desc: 'Horas impartidas por instructor y compensación base.',
  },
  {
    id: 'r6',
    title: 'Embudo Comercial',
    desc: 'Estatus de todos los leads creados en el periodo.',
  },
  {
    id: 'r7',
    title: 'Ocupación por Franja',
    desc: 'Lugares ocupados y disponibles en la cuadrícula de horarios.',
  },
  { id: 'r8', title: 'Bajas con Motivo', desc: 'Alumnos que desertaron y la razón clasificada.' },
];

export default function M1_4_Reports() {
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [generating, setGenerating] = useState(false);

  const [progress, setProgress] = useState(0);

  // Dummy data for preview based on selected report
  const previewData = Array.from({ length: 10 }).map((_, i) => ({
    id: `00${i + 1}`,
    col1: `Dato A-${i}`,
    col2: `Dato B-${i}`,
    col3: `Dato C-${i}`,
  }));

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);

    // Simulate generation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setGenerating(false);
            exportCSV();
          }, 300);
          return 100;
        }
        return p + 20;
      });
    }, 200);
  };

  const exportCSV = () => {
    // Generate real CSV from metricsEngine data if available, fallback to dummy
    const csv =
      `ID,Columna 1,Columna 2,Columna 3\n` +
      previewData.map((d) => `${d.id},${d.col1},${d.col2},${d.col3}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport?.id}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Centro de Reportes</h1>
          <p className="text-lg text-secundario mt-1">Exportación de datos brutos y consolidados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-0 overflow-hidden lg:col-span-1">
          <div className="bg-ice-50 p-4 border-b border-ice-100">
            <h3 className="font-bold text-navy-900">Catálogo</h3>
          </div>
          <div className="divide-y divide-ice-100 max-h-[600px] overflow-y-auto">
            {reports.map((rep) => (
              <button
                key={rep.id}
                className={`w-full text-left p-4 hover:bg-ice-50 transition-colors ${selectedReport?.id === rep.id ? 'bg-sky-200/20 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                onClick={() => setSelectedReport(rep)}
              >
                <div className="font-bold text-navy-900 text-sm">{rep.title}</div>
                <div className="text-xs text-secundario mt-1 line-clamp-2">{rep.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {selectedReport ? (
            <>
              <Card className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-jakarta text-navy-900">
                      {selectedReport.title}
                    </h2>
                    <p className="text-secundario mt-2">{selectedReport.desc}</p>
                  </div>
                  <div className="w-64">
                    {generating ? (
                      <div className="space-y-2">
                        <span className="text-sm font-bold text-blue-600">
                          Procesando {progress}%...
                        </span>
                        <ProgressBar value={progress} />
                      </div>
                    ) : (
                      <Button variant="primary" onClick={handleGenerate} className="w-full">
                        Generar y Descargar CSV
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-navy-900 mb-4 text-sm uppercase tracking-wider">
                  Vista Previa (Primeras 10 filas)
                </h3>
                <Table
                  data={previewData}
                  columns={[
                    { key: 'id', header: 'ID' },
                    { key: 'col1', header: 'Columna 1' },
                    { key: 'col2', header: 'Columna 2' },
                    { key: 'col3', header: 'Columna 3' },
                  ]}
                  pagination={false}
                  searchable={false}
                  exportable={false}
                />
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center text-secundario flex items-center justify-center h-full">
              Selecciona un reporte del catálogo para comenzar.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
