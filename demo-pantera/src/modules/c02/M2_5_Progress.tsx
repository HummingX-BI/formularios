import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Badge } from '@/ui/components/DataDisplay';
import { useDataset } from '@/data/hooks';
import { LEVELS } from '@/data/generator/catalogs';

const SKILLS: Record<string, string[]> = {
  'L1_Adaptacion': ['Control de respiración', 'Inmersión facial completa', 'Flotación ventral con apoyo', 'Patada básica en borde'],
  'L2_Flotacion': ['Flotación dorsal independiente', 'Deslizamiento ventral 5m', 'Patada continua con tabla', 'Brazada rudimentaria crol'],
  'L3_Respiracion': ['Sumergir cabeza', 'Respiración lateral bilateral'],
  'L4_Libre': ['Crol completo 15m'],
  'L5_Dorso': ['Dorso básico 15m'],
  'L6_PechoMariposa': ['Brazada y patada de pecho'],
  'L7_Perfeccionamiento': ['Dominio 4 estilos', 'Vueltas de campana', 'Resistencia 400m libres', 'Salida de competencia']
};

export default function M2_5_Progress() {
  const dataset = useDataset();
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]?.id || 'L1_Adaptacion');

  const studentsInLevel = useMemo(() => dataset.students.filter(s => s.level === selectedLevel), [dataset, selectedLevel]);

  // Mock ready to promote logic
  const readyToPromote = useMemo(() => studentsInLevel.filter(s => {
    // Determine random readiness based on ID for mock
    return s.id.charCodeAt(0) % 4 === 0;
  }), [studentsInLevel]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Niveles y Progreso</h1>
          <p className="text-lg text-secundario mt-1">Evaluación de habilidades y promoción de alumnos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-4">Seleccionar Nivel</h3>
            <div className="space-y-2">
              {LEVELS.map(lvl => {
                const count = dataset.students.filter(s => s.level === lvl.id).length;
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`w-full flex justify-between items-center p-3 rounded transition-colors border ${isSelected ? 'bg-sky-200 border-aqua-500 text-navy-900' : 'bg-white border-ice-200 text-secundario hover:bg-ice-50'}`}
                  >
                    <span className="font-bold capitalize">{lvl.name}</span>
                    <span className="text-sm bg-white/50 px-2 py-0.5 rounded">{count} al.</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4 bg-ice-50 border border-ice-100 shadow-sm text-center">
            <h4 className="font-bold text-navy-900 mb-2">Listos para promover</h4>
            <div className="text-4xl font-bold text-green-500 mb-2">{readyToPromote.length}</div>
            <p className="text-xs text-secundario">Alumnos que cumplen asistencia y tiempo en nivel.</p>
            <Button variant="primary" className="w-full mt-4">Iniciar Evaluaciones</Button>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 bg-white border border-ice-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-navy-900 font-jakarta capitalize">Nivel {selectedLevel}</h2>
                <p className="text-secundario">Kárdex de habilidades requeridas para avanzar</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {SKILLS[selectedLevel]?.map((skill, i) => (
                <div key={i} className="p-3 bg-ice-50 rounded border border-ice-100 text-center flex flex-col justify-center min-h-[80px]">
                  <span className="text-sm font-bold text-navy-900">{skill}</span>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-navy-900 mb-4 border-b pb-2">Alumnos en este nivel ({studentsInLevel.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-secundario">
                    <th className="pb-3 font-bold">Alumno</th>
                    <th className="pb-3 font-bold">Meses en nivel</th>
                    <th className="pb-3 font-bold">Avance (Mock)</th>
                    <th className="pb-3 font-bold">Estatus</th>
                    <th className="pb-3 font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ice-100">
                  {studentsInLevel.slice(0, 10).map((s) => {
                    const isReady = readyToPromote.some(r => r.id === s.id);
                    const months = (s.id.charCodeAt(0) % 8) + 1;
                    const progress = isReady ? 100 : ((s.id.charCodeAt(1) % 4) + 1) * 20;
                    
                    return (
                      <tr key={s.id} className="hover:bg-ice-50">
                        <td className="py-3">
                          <div className="font-bold text-navy-900">{s.name}</div>
                          <div className="text-xs text-tenue">{s.id}</div>
                        </td>
                        <td className="py-3">{months} meses</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2 w-32">
                            <div className="flex-1 h-2 bg-ice-200 rounded-full overflow-hidden">
                              <div className="h-full bg-aqua-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs text-secundario">{progress}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          {isReady ? <Badge color="bg-green-500 text-white">Listo</Badge> : <Badge color="bg-ice-200 text-secundario">En curso</Badge>}
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" className="text-blue-600">Evaluar</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {studentsInLevel.length > 10 && (
              <div className="text-center mt-4 pt-4 border-t border-ice-100">
                <Button variant="secondary">Cargar más alumnos</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
