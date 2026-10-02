import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Select } from '@/ui/components/Inputs';
import { Badge } from '@/ui/components/DataDisplay';
import { useDataset } from '@/data/hooks';
import { useAppStore } from '@/app/store';

export default function M2_4_Attendance() {
  const dataset = useDataset();
  const store = useAppStore();
  
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const getDayName = (dayNum: number) => DAYS[dayNum - 1] || 'Lunes';

  const groups = useMemo(() => dataset.groups.slice(0, 15).map(g => ({
    label: `Grupo ${g.id.substring(0,4)} - ${getDayName(g.dayOfWeek)} ${g.timeSlot}`,
    value: g.id
  })), [dataset]);

  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.value || '');
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  
  // Local session state for attendance modifications
  const [sessionAttendance, setSessionAttendance] = useState<Record<string, string>>({});

  const groupStudents = useMemo(() => {
    // Mock students for this group
    return dataset.students.slice(0, 8).map((s, i) => ({
      ...s,
      consecutiveAbsences: i === 2 ? 3 : i === 5 ? 2 : 0,
      initialStatus: i === 2 ? 'falta' : 'asistio'
    }));
  }, [dataset, selectedGroup]);

  const handleStatusChange = (studentId: string, status: string) => {
    setSessionAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getStatus = (studentId: string, initial: string) => {
    return sessionAttendance[studentId] || initial;
  };

  const handleNotify = (studentName: string) => {
    store.addPlanAction({ type: 'notification', target: studentName, message: 'Aviso de inasistencia enviado' });
    alert(`Notificación simulada enviada a la familia de ${studentName}`);
  };

  const attendanceCount = groupStudents.filter(s => getStatus(s.id, s.initialStatus) === 'asistio' || getStatus(s.id, s.initialStatus) === 'reposicion').length;
  const attendanceRate = Math.round((attendanceCount / groupStudents.length) * 100) || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Asistencia y Reposiciones</h1>
          <p className="text-lg text-secundario mt-1">Pase de lista y gestión de inasistencias</p>
        </div>
      </div>

      <Card className="p-6 bg-white border border-ice-100 shadow-sm flex gap-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-bold text-navy-900 mb-1">Grupo</label>
          <Select options={groups} value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-1">Fecha</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 border border-ice-200 rounded outline-none focus:border-aqua-500 w-48" />
        </div>
        <div className="bg-ice-50 px-6 py-2 rounded text-center border border-ice-200">
          <div className="text-sm text-secundario">Asistencia hoy</div>
          <div className="text-2xl font-bold text-aqua-500">{attendanceRate}%</div>
        </div>
      </Card>

      <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ice-50 border-b border-ice-100">
            <tr>
              <th className="p-4 font-bold text-navy-900 text-sm">Alumno</th>
              <th className="p-4 font-bold text-navy-900 text-sm w-64">Estado</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-center">Inasistencias</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ice-100">
            {groupStudents.map(s => {
              const currentStatus = getStatus(s.id, s.initialStatus);
              return (
                <tr key={s.id} className="hover:bg-ice-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-navy-900">{s.name}</div>
                    <div className="text-xs text-secundario">{s.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex bg-white rounded border border-ice-200 overflow-hidden w-fit">
                      {['asistio', 'falta', 'justifico', 'reposicion'].map(st => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(s.id, st)}
                          className={`px-3 py-1.5 text-xs font-bold capitalize border-r border-ice-200 last:border-0 ${currentStatus === st ? (st === 'falta' ? 'bg-coral text-white' : st === 'asistio' ? 'bg-green-500 text-white' : 'bg-aqua-500 text-white') : 'text-secundario hover:bg-ice-100'}`}
                        >
                          {st === 'asistio' ? 'Asistió' : st === 'falta' ? 'Faltó' : st === 'justifico' ? 'Justificó' : 'Repuso'}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {s.consecutiveAbsences > 0 ? (
                      <Badge color={s.consecutiveAbsences >= 3 ? 'bg-coral text-white' : 'bg-amber-400 text-navy-900'}>
                        {s.consecutiveAbsences} consecutivas
                      </Badge>
                    ) : (
                      <span className="text-tenue">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {s.consecutiveAbsences >= 2 && (
                      <Button variant="secondary" size="sm" onClick={() => handleNotify(s.name)}>
                        Notificar Familia
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
