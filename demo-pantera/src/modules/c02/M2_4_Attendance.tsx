import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { CheckCircle2, XCircle, AlertTriangle, Target, Medal, Calendar, ShieldAlert } from 'lucide-react';

const mockStudents = [
  { id: 'S1', name: 'Sofía Martínez', status: 'present', technique: 85, effort: 90, readyToLevelUp: false },
  { id: 'S2', name: 'Leo Hernández', status: 'absent', technique: 70, effort: 60, readyToLevelUp: false },
  { id: 'S3', name: 'Valentina Ruiz', status: 'pending', technique: 95, effort: 98, readyToLevelUp: true },
  { id: 'S4', name: 'Mateo Gómez', status: 'pending', technique: 60, effort: 85, readyToLevelUp: false },
];

export default function M2_4_Attendance() {
  const [students, setStudents] = useState(mockStudents);

  const setStatus = (id: string, status: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const setReady = (id: string, ready: boolean) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, readyToLevelUp: ready } : s));
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-ice-200 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-jakarta font-extrabold text-navy-900 flex items-center gap-3">
            <Target className="text-aqua-500" size={28} />
            Portal del Instructor
          </h1>
          <p className="text-lg text-secundario mt-1 font-medium">
            Pase de lista y evaluación de progreso al final de la clase.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-ice-100 flex-1 overflow-hidden flex flex-col">
        {/* INFO CLASE */}
        <div className="p-6 border-b border-ice-100 bg-gradient-to-r from-navy-900 to-slate-800 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">Clase Actual</span>
            </div>
            <h2 className="text-2xl font-bold font-jakarta mb-1">Natación Básico Infantil</h2>
            <div className="flex gap-4 text-sm text-ice-300">
              <span className="flex items-center gap-1"><Calendar size={16} /> Hoy, 16:00 - 17:00</span>
              <span className="flex items-center gap-1"><Target size={16} /> Carril 3</span>
            </div>
          </div>
          <Button variant="primary" className="bg-aqua-500 hover:bg-aqua-400 text-navy-900 font-extrabold shadow-lg">
            Finalizar Sesión y Guardar
          </Button>
        </div>

        {/* TABLA DE EVALUACIÓN */}
        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-ice-200 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-bold text-navy-900 w-1/3">Alumno</th>
                <th className="p-4 font-bold text-navy-900 text-center">Asistencia</th>
                <th className="p-4 font-bold text-navy-900 text-center">Eval. Técnica (0-100)</th>
                <th className="p-4 font-bold text-navy-900 text-center">¿Sube de Nivel?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ice-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-ice-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-navy-900 text-base">{student.name}</div>
                    <div className="text-xs text-secundario">ID: {student.id}</div>
                  </td>
                  
                  {/* ASISTENCIA */}
                  <td className="p-4 text-center">
                    <div className="inline-flex bg-ice-100 rounded-lg p-1">
                      <button 
                        onClick={() => setStatus(student.id, 'present')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${student.status === 'present' ? 'bg-green-500 text-white shadow-sm' : 'text-secundario hover:bg-white'}`}
                      >
                        <CheckCircle2 size={14} /> Asistió
                      </button>
                      <button 
                        onClick={() => setStatus(student.id, 'absent')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${student.status === 'absent' ? 'bg-coral text-white shadow-sm' : 'text-secundario hover:bg-white'}`}
                      >
                        <XCircle size={14} /> Faltó
                      </button>
                    </div>
                  </td>

                  {/* EVALUACIÓN TÉCNICA */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <input 
                        type="range" 
                        min="0" max="100" 
                        defaultValue={student.technique} 
                        className="w-24 accent-aqua-500" 
                        disabled={student.status === 'absent'}
                      />
                      <span className="w-8 font-bold text-navy-900 text-right">{student.status === 'absent' ? '--' : student.technique}</span>
                    </div>
                  </td>

                  {/* NIVEL */}
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setReady(student.id, !student.readyToLevelUp)}
                      disabled={student.status === 'absent'}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                        student.status === 'absent' 
                          ? 'opacity-30 cursor-not-allowed bg-ice-50 border-ice-200 text-secundario'
                          : student.readyToLevelUp 
                            ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm' 
                            : 'bg-white border-ice-200 text-secundario hover:border-aqua-500 hover:text-aqua-600'
                      }`}
                    >
                      <Medal size={16} className={student.readyToLevelUp ? 'text-amber-500' : ''} />
                      {student.readyToLevelUp ? 'Aprobado para Cambio' : 'Mantener Nivel'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-6 bg-amber-50 border-t border-amber-100 flex items-start gap-4">
            <ShieldAlert className="text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Aviso de Reposiciones Automatizadas</h4>
              <p className="text-amber-800 text-xs mt-1">Al marcar a un alumno como "Faltó", el sistema le enviará automáticamente un mensaje a la familia por WhatsApp con un enlace para que agenden su clase de reposición sin que intervenga recepción.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
