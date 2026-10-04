import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Badge } from '@/ui/components/DataDisplay';
import { Select } from '@/ui/components/Inputs';
import { useDataset } from '@/data/hooks';
import { useAppStore } from '@/app/store';
import { formatCurrency } from '@/insights/templates';

export default function M2_6_Waitlist() {
  const dataset = useDataset();
  const store = useAppStore();

  const [filterTime, setFilterTime] = useState('todas');
  const [notified, setNotified] = useState<string[]>([]);

  const waitlist = useMemo(() => {
    let list = dataset.waitlist;
    if (filterTime !== 'todas') {
      list = list.filter((w) => w.requestedSchedule.includes(filterTime));
    }
    return list.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
  }, [dataset, filterTime]);

  const potentialRevenue = waitlist.length * 1850; // Mock: assuming 2 classes plan

  const handleNotify = (id: string, name: string) => {
    setNotified([...notified, id]);
    store.addPlanAction({ type: 'waitlist_offer', target: name, message: 'Cupo ofrecido' });
    alert(`Notificación enviada a la familia de ${name}`);
  };

  const getPriorityColor = (dateString: string) => {
    const daysWaiting = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24),
    );
    if (daysWaiting > 60) return 'bg-coral text-white border-0 mt-1';
    if (daysWaiting > 30) return 'bg-amber-400 text-navy-900 border-0 mt-1';
    return 'bg-ice-200 text-secundario border-0 mt-1';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Lista de Espera</h1>
          <p className="text-lg text-secundario mt-1">Gestión de familias esperando cupo</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-secundario">Ingreso potencial (aprox)</div>
            <div className="text-xl font-bold text-green-500">
              {formatCurrency(potentialRevenue)}
            </div>
          </div>
        </div>
      </div>

      <Card className="p-6 bg-white border border-ice-100 shadow-sm flex gap-6 items-end">
        <div className="w-64">
          <label className="block text-sm font-bold text-navy-900 mb-1">Filtrar por Franja</label>
          <Select
            options={[
              { label: 'Todas las franjas', value: 'todas' },
              { label: '15:00', value: '15:00' },
              { label: '16:00', value: '16:00' },
              { label: '17:00', value: '17:00' },
              { label: '18:00', value: '18:00' },
            ]}
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
          />
        </div>
        <div className="flex-1"></div>
        <Button variant="ghost" className="border border-ice-200">
          Exportar CSV
        </Button>
      </Card>

      <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ice-50 border-b border-ice-100">
            <tr>
              <th className="p-4 font-bold text-navy-900 text-sm">Alumno / Familia</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Fecha de Ingreso</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Nivel</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Horario Deseado</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Estado</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ice-100">
            {waitlist.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secundario">
                  No hay registros en la lista de espera.
                </td>
              </tr>
            ) : (
              waitlist.map((w) => {
                const student = dataset.students.find((s) => s.id === w.studentId);
                const family = dataset.families.find((f) => f.id === student?.familyId);
                const isNotified = notified.includes(w.id);
                return (
                  <tr key={w.id} className="hover:bg-ice-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-navy-900">
                        {student?.name || 'Desconocido'}
                      </div>
                      <div className="text-xs text-secundario">
                        {family?.tutorName || 'Tutor'} • {family?.phone || ''}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-navy-900">{w.dateAdded}</div>
                      <Badge color={getPriorityColor(w.dateAdded)}>
                        {Math.floor(
                          (new Date().getTime() - new Date(w.dateAdded).getTime()) /
                            (1000 * 3600 * 24),
                        )}{' '}
                        días
                      </Badge>
                    </td>
                    <td className="p-4 capitalize text-navy-900">{student?.level || 'N/A'}</td>
                    <td className="p-4 text-navy-900">{w.requestedSchedule}</td>
                    <td className="p-4">
                      {isNotified ? (
                        <span className="text-sm font-bold text-aqua-500">Notificado</span>
                      ) : (
                        <span className="text-sm text-secundario">Esperando</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant={isNotified ? 'ghost' : 'primary'}
                        size="sm"
                        onClick={() => handleNotify(w.id, student?.name || 'Desconocido')}
                        disabled={isNotified}
                      >
                        {isNotified ? 'Reenviar' : 'Ofrecer Cupo'}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
