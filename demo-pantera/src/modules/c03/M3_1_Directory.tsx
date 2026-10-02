import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { Badge } from '@/ui/components/DataDisplay';
import { useDataset } from '@/data/hooks';

export default function M3_1_Directory() {
  const dataset = useDataset();
  const [filterShift, setFilterShift] = useState('todos');

  const instructors = useMemo(() => {
    return dataset.instructors.map(inst => {
      const instructorGroups = dataset.groups.filter(g => g.instructorId === inst.id);
      // Determine dominant shift based on groups
      let am = 0, pm = 0;
      instructorGroups.forEach(g => {
        if (parseInt(g.timeSlot?.split(':')[0] || '0') < 14) am++; else pm++;
      });
      const shift = am > pm ? 'Matutino' : pm > am ? 'Vespertino' : 'Mixto';
      return {
        ...inst,
        groupsCount: instructorGroups.length,
        hoursWorking: instructorGroups.length, // roughly 1 hr per group per week
        shift
      };
    }).filter(inst => filterShift === 'todos' || inst.shift.toLowerCase() === filterShift.toLowerCase());
  }, [dataset, filterShift]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Directorio y Turnos</h1>
          <p className="text-lg text-secundario mt-1">Lista de personal e información de carga laboral</p>
        </div>
      </div>

      <Card className="p-6 bg-white border border-ice-100 shadow-sm flex gap-6 items-end">
        <div className="w-64">
          <label className="block text-sm font-bold text-navy-900 mb-1">Filtrar por Turno</label>
          <Select 
            options={[
              { label: 'Todos', value: 'todos' },
              { label: 'Matutino', value: 'matutino' },
              { label: 'Vespertino', value: 'vespertino' },
              { label: 'Mixto', value: 'mixto' }
            ]} 
            value={filterShift} 
            onChange={e => setFilterShift(e.target.value)} 
          />
        </div>
      </Card>

      <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ice-50 border-b border-ice-100">
            <tr>
              <th className="p-4 font-bold text-navy-900 text-sm">Instructor</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Turno</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-center">Grupos Asignados</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-center">Horas/Semana</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Horario (Mock)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ice-100">
            {instructors.map(inst => (
              <tr key={inst.id} className="hover:bg-ice-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-navy-900">{inst.name}</div>
                  <div className="text-xs text-secundario">{inst.id}</div>
                </td>
                <td className="p-4">
                  <Badge color={inst.shift === 'Matutino' ? 'bg-green-500 text-white' : inst.shift === 'Vespertino' ? 'bg-amber-400 text-navy-900' : 'bg-ice-200 text-secundario'}>
                    {inst.shift}
                  </Badge>
                </td>
                <td className="p-4 text-center text-navy-900 font-bold">{inst.groupsCount}</td>
                <td className="p-4 text-center text-navy-900">{inst.hoursWorking} hrs</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {['L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => {
                      const works = (inst.id.charCodeAt(0) + i) % 2 !== 0;
                      return (
                        <div key={i} className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${works ? 'bg-aqua-500 text-white' : 'bg-ice-100 text-tenue'}`} title={works ? 'Trabaja' : 'Descanso'}>
                          {day}
                        </div>
                      )
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
