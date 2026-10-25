import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Search, UserPlus, Clock, Users, ArrowRight, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

const mockGroups = [
  { id: 'g1', name: 'Natación Básico Infantil', schedule: 'Lu-Mi 16:00', instructor: 'Prof. Carlos', capacity: 15, enrolled: 15, waitlist: 4 },
  { id: 'g2', name: 'Gimnasia Intermedio', schedule: 'Ma-Ju 17:00', instructor: 'Profa. Ana', capacity: 20, enrolled: 18, waitlist: 0 },
  { id: 'g3', name: 'Estimulación Temprana', schedule: 'Sab 09:00', instructor: 'Prof. Luis', capacity: 10, enrolled: 5, waitlist: 0 },
];

export default function M2_2_Enrollment() {
  const [selectedGroup, setSelectedGroup] = useState(mockGroups[1]!);
  const [showForm, setShowForm] = useState(false);

  if (!selectedGroup) return null;

  const isFull = selectedGroup.enrolled >= selectedGroup.capacity;

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-ice-200 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-jakarta font-extrabold text-navy-900 flex items-center gap-3">
            <UserPlus className="text-aqua-500" size={28} />
            Inscripciones y Lista de Espera
          </h1>
          <p className="text-lg text-secundario mt-1 font-medium">
            Gestor de cupos, altas de alumnos y demanda en espera.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        
        {/* BUSCADOR DE GRUPOS */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl shadow-sm border border-ice-100 overflow-hidden">
          <div className="p-4 border-b border-ice-100 bg-ice-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secundario" size={16} />
              <input
                type="text"
                placeholder="Buscar grupo o disciplina..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-ice-200 rounded-lg focus:outline-none focus:border-aqua-500 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {mockGroups.map((group) => {
              const full = group.enrolled >= group.capacity;
              return (
                <button
                  key={group.id}
                  onClick={() => { setSelectedGroup(group); setShowForm(false); }}
                  className={`w-full text-left p-3 rounded-lg transition-all border ${selectedGroup.id === group.id ? 'bg-sky-50 border-aqua-300' : 'border-transparent hover:bg-ice-50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-navy-900 text-sm">{group.name}</span>
                    {full ? (
                      <span className="bg-coral/10 text-coral text-[10px] px-2 py-0.5 rounded font-bold">LLENO</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold">DISPONIBLE</span>
                    )}
                  </div>
                  <div className="text-xs text-secundario mb-2">{group.schedule} • {group.instructor}</div>
                  
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1 text-navy-900 font-medium">
                      <Users size={12} className="text-aqua-500" /> {group.enrolled}/{group.capacity}
                    </div>
                    {group.waitlist > 0 && (
                      <div className="flex items-center gap-1 text-amber-600 font-medium">
                        <Clock size={12} /> {group.waitlist} en espera
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ÁREA DE ACCIÓN */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl shadow-sm border border-ice-100 overflow-y-auto relative">
          
          <div className="p-6 border-b border-ice-100 bg-gradient-to-r from-navy-900 to-slate-800 text-white">
            <h2 className="text-2xl font-bold font-jakarta mb-2">{selectedGroup.name}</h2>
            <div className="flex gap-6 text-sm text-ice-300">
              <span className="flex items-center gap-1"><Calendar size={16} /> {selectedGroup.schedule}</span>
              <span className="flex items-center gap-1"><UserPlus size={16} /> {selectedGroup.instructor}</span>
            </div>
          </div>

          <div className="p-8">
            {/* INDICADOR DE CUPO */}
            <div className={`mb-8 p-4 rounded-xl flex items-center justify-between border ${isFull ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-4">
                {isFull ? (
                  <div className="w-12 h-12 bg-red-100 text-coral rounded-full flex items-center justify-center"><AlertTriangle size={24} /></div>
                ) : (
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={24} /></div>
                )}
                <div>
                  <h3 className={`text-lg font-bold ${isFull ? 'text-red-900' : 'text-green-900'}`}>
                    {isFull ? 'Grupo Lleno (Capacidad Máxima)' : 'Lugares Disponibles'}
                  </h3>
                  <p className={`text-sm ${isFull ? 'text-red-700' : 'text-green-700'}`}>
                    {isFull 
                      ? `No hay lugares libres. Los interesados deben pasar a Lista de Espera.` 
                      : `Quedan ${selectedGroup.capacity - selectedGroup.enrolled} lugares libres para inscripción inmediata.`}
                  </p>
                </div>
              </div>
              <div>
                <Button 
                  variant="primary" 
                  onClick={() => setShowForm(true)}
                  className={isFull ? 'bg-amber-500 hover:bg-amber-600 border-none' : 'bg-green-500 hover:bg-green-600 border-none'}
                >
                  {isFull ? <><Clock size={18} className="mr-2" /> Agregar a Lista de Espera</> : <><UserPlus size={18} className="mr-2" /> Inscribir Alumno</>}
                </Button>
              </div>
            </div>

            {/* FORMULARIO CONDICIONAL */}
            {showForm ? (
              <div className="border border-ice-200 rounded-xl p-6 bg-slate-50 animate-fade-in">
                <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <ArrowRight size={18} className="text-aqua-500" />
                  {isFull ? 'Formulario de Ingreso a Lista de Espera' : 'Formulario de Nueva Inscripción'}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-secundario mb-1">Nombre del Prospecto/Alumno</label>
                    <input type="text" className="w-full border border-ice-200 rounded p-2 text-sm" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secundario mb-1">Teléfono (WhatsApp)</label>
                    <input type="text" className="w-full border border-ice-200 rounded p-2 text-sm" placeholder="Ej. 55-1234-5678" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button variant="primary" className={isFull ? 'bg-amber-500' : 'bg-green-500'}>
                    {isFull ? 'Confirmar en Espera' : 'Confirmar Inscripción'}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-navy-900 mb-4 text-sm uppercase tracking-wider text-secundario">Estado Actual del Grupo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-ice-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-navy-900 mb-1">{selectedGroup.enrolled}</div>
                    <div className="text-sm text-secundario">Alumnos Inscritos Activos</div>
                  </div>
                  <div className="border border-ice-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-amber-500 mb-1">{selectedGroup.waitlist}</div>
                    <div className="text-sm text-secundario">Personas en Lista de Espera</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
