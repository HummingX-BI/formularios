import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { useDataset } from '@/data/hooks';
import { Search, Filter, Mail, Calendar, Clock, Sun, Sunset, Timer } from 'lucide-react';

export default function M3_1_Directory() {
  const dataset = useDataset();
  const [filterShift, setFilterShift] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const instructors = useMemo(() => {
    return dataset.instructors
      .map((inst) => {
        const instructorGroups = dataset.groups.filter((g) => g.instructorId === inst.id);
        // Determine dominant shift based on groups
        let am = 0,
          pm = 0;
        instructorGroups.forEach((g) => {
          if (parseInt(g.timeSlot?.split(':')[0] || '0') < 14) am++;
          else pm++;
        });
        const shift = am > pm ? 'Matutino' : pm > am ? 'Vespertino' : 'Mixto';
        return {
          ...inst,
          groupsCount: instructorGroups.length,
          hoursWorking: instructorGroups.length, // roughly 1 hr per group per week
          shift,
        };
      })
      .filter((inst) => {
        const matchesShift = filterShift === 'todos' || inst.shift.toLowerCase() === filterShift.toLowerCase();
        const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || inst.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesShift && matchesSearch;
      });
  }, [dataset, filterShift, searchTerm]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Directorio Corporativo</h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Gestión de instructores, turnos y carga operativa
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o ID de empleado..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Turno:</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
            {['Todos', 'Matutino', 'Vespertino', 'Mixto'].map(t => (
              <button 
                key={t}
                onClick={() => setFilterShift(t.toLowerCase())}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  filterShift === t.toLowerCase() 
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Instructors */}
      {instructors.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No se encontraron instructores</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            Intenta ajustar los filtros de búsqueda o cambiar el turno seleccionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {instructors.map((inst) => (
            <Card key={inst.id} className="bg-white border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col group overflow-hidden">
              {/* Card Header */}
              <div className="p-5 flex items-start justify-between relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-500 group-hover:to-sky-400 transition-all duration-500"></div>
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 text-blue-700 flex items-center justify-center font-bold text-xl shadow-inner border border-slate-200 group-hover:scale-105 transition-transform">
                    {getInitials(inst.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{inst.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">ID: {inst.id}</span>
                    </div>
                  </div>
                </div>
                <Badge color={inst.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${inst.active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {inst.active ? "Activo" : "Inactivo"}
                  </span>
                </Badge>
              </div>
              
              {/* Key Stats */}
              <div className="px-5 py-4 bg-slate-50/80 border-y border-slate-100 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Turno</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    {inst.shift === 'Matutino' ? <Sun size={14} className="text-amber-500"/> : inst.shift === 'Vespertino' ? <Sunset size={14} className="text-orange-500"/> : <Timer size={14} className="text-slate-500"/>} {inst.shift}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Grupos</p>
                  <p className="text-sm font-bold text-slate-800">{inst.groupsCount}</p>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Carga</p>
                  <p className="text-sm font-bold text-slate-800">{inst.hoursWorking}h <span className="text-[10px] text-slate-400 font-normal">/sem</span></p>
                </div>
              </div>

              {/* Schedule Matrix */}
              <div className="p-5 flex-1 flex flex-col justify-end">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Disponibilidad
                  </p>
                </div>
                <div className="flex justify-between gap-1.5">
                  {['L', 'M', 'X', 'J', 'V', 'S'].map((day, i) => {
                    // Mock schedule logic for visual variety
                    const works = (inst.id.charCodeAt(0) + i) % 2 !== 0;
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-9 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          works 
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 hover:bg-blue-700' 
                            : 'bg-slate-50 text-slate-300 border border-slate-200/50 hover:bg-slate-100 hover:text-slate-400'
                        }`}
                        title={works ? 'Turno asignado' : 'Día de descanso'}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-white">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Alta: {inst.hireDate}
                </span>
                <button className="text-xs font-bold text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5 group-hover:bg-blue-50">
                  <Mail className="w-3.5 h-3.5" /> Contactar
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
