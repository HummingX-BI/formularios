import { useState, useMemo } from 'react';
import { useDataset } from '@/data/hooks';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';

export default function M2_1_Profile() {
  const dataset = useDataset();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    dataset.students[0]?.id || null,
  );

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return dataset.students;
    const term = searchTerm.toLowerCase();
    return dataset.students.filter((s) => {
      const family = dataset.families.find((f) => f.id === s.familyId);
      return (
        s.name.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term) ||
        family?.tutorName.toLowerCase().includes(term)
      );
    });
  }, [dataset, searchTerm]);

  const selectedStudent = useMemo(
    () => dataset.students.find((s) => s.id === selectedStudentId),
    [dataset, selectedStudentId],
  );
  const family = useMemo(
    () =>
      selectedStudent ? dataset.families.find((f) => f.id === selectedStudent.familyId) : undefined,
    [dataset, selectedStudent],
  );
  const siblings = useMemo(
    () =>
      family
        ? dataset.students.filter((s) => s.familyId === family.id && s.id !== selectedStudentId)
        : [],
    [dataset, family, selectedStudentId],
  );

  if (!selectedStudent || !family) {
    return <div>No hay alumnos disponibles.</div>;
  }

  // Mock determinist text for instructor observations
  const obsIndex = selectedStudent.id.charCodeAt(0) % 3;
  const observations = [
    'Ha mejorado notablemente en la técnica de patada. Se sugiere empezar a trabajar respiración lateral.',
    'Mantiene buen ritmo, pero falta confianza en aguas profundas. Excelente asistencia.',
    'Progresa según lo esperado. Lista para intentar flotación sin asistencia en la próxima clase.',
  ][obsIndex];

  // Risk of churn
  const churnRisk = (selectedStudent.id.charCodeAt(0) * 7) % 100;
  const riskLabel = churnRisk > 50 ? 'Alto' : churnRisk > 20 ? 'Medio' : 'Bajo';
  const riskColor =
    churnRisk > 50
      ? 'bg-coral text-white'
      : churnRisk > 20
        ? 'bg-amber-400 text-navy-900'
        : 'bg-green-500 text-white';

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar List */}
      <Card className="w-1/3 flex flex-col overflow-hidden bg-white">
        <div className="p-4 border-b border-ice-100">
          <h2 className="font-bold text-navy-900 mb-2">Buscador 360</h2>
          <input
            type="text"
            placeholder="Nombre, ID o Tutor..."
            className="w-full px-3 py-2 border border-ice-200 rounded focus:outline-none focus:border-aqua-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredStudents.slice(0, 50).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`w-full text-left p-3 rounded transition-colors ${selectedStudentId === s.id ? 'bg-ice-100 border-l-4 border-aqua-500' : 'hover:bg-ice-50'}`}
            >
              <div className="font-bold text-navy-900">{s.name}</div>
              <div className="text-xs text-secundario">{s.id}</div>
            </button>
          ))}
          {filteredStudents.length > 50 && (
            <div className="text-center text-xs text-tenue p-2">
              Muestra 50 de {filteredStudents.length} resultados
            </div>
          )}
        </div>
      </Card>

      {/* Main Profile */}
      <div className="flex-1 overflow-y-auto space-y-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskColor}`}>
              Riesgo Baja: {riskLabel}
            </span>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-aqua-500 flex items-center justify-center text-white text-3xl font-bold font-jakarta">
              {selectedStudent.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-jakarta font-bold text-navy-900">
                {selectedStudent.name}
              </h1>
              <p className="text-secundario mb-4">
                ID: {selectedStudent.id} • {selectedStudent.status === 'active' ? 'Activo' : 'Baja'}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-tenue block">Tutor Principal</span>
                  <span className="font-bold text-navy-900">{family.tutorName || 'N/A'}</span>
                  <div className="text-secundario">{family.phone}</div>
                </div>
                <div>
                  <span className="text-tenue block">Hermanos</span>
                  {siblings.length > 0 ? (
                    siblings.map((sib) => (
                      <button
                        key={sib.id}
                        onClick={() => setSelectedStudentId(sib.id)}
                        className="text-aqua-500 hover:underline block"
                      >
                        {sib.name}
                      </button>
                    ))
                  ) : (
                    <span className="text-secundario">Sin hermanos</span>
                  )}
                </div>
                <div>
                  <span className="text-tenue block">Nivel Actual</span>
                  <span className="bg-aqua-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                    {selectedStudent.level}
                  </span>
                </div>
                <div>
                  <span className="text-tenue block">Plan</span>
                  <span className="text-navy-900 font-bold">{selectedStudent.plan}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6 bg-white shadow-sm border border-ice-100">
            <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Historial de Asistencia</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-aqua-500">85%</div>
              <div className="text-sm text-secundario">Asistencia últimos 6 meses</div>
            </div>
            {/* Mock heatmap */}
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 60 }).map((_, i) => {
                const isMiss = i % 7 === 0;
                return (
                  <div
                    key={i}
                    className={`w-full pt-[100%] rounded-sm ${isMiss ? 'bg-coral/80' : 'bg-aqua-500/80'}`}
                    title={isMiss ? 'Falta' : 'Asistencia'}
                  />
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm border border-ice-100">
            <h3 className="font-bold text-navy-900 mb-4 font-jakarta">Estado de Cuenta</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-ice-50 rounded">
                <span className="text-secundario">Estatus actual</span>
                <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                  Corriente
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-ice-50 rounded">
                <span className="text-secundario">Último pago</span>
                <span className="font-bold text-navy-900">$1,500.00 (Hace 12 días)</span>
              </div>
              <Button variant="secondary" className="w-full">
                Ver historial completo
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white shadow-sm border border-ice-100">
          <h3 className="font-bold text-navy-900 mb-4 font-jakarta">
            Observaciones del Instructor
          </h3>
          <p className="text-secundario italic mb-4">"{observations}"</p>
          <div className="flex gap-2">
            <Button variant="secondary">Enviar mensaje al tutor</Button>
            <Button variant="ghost" className="border border-ice-200">
              Agendar tutoría
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
