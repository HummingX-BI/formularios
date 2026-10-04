import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { Button } from '@/ui/components/Buttons';
import { useDataset } from '@/data/hooks';
import { formatCurrency } from '@/insights/templates';

export default function M3_2_Payroll() {
  const dataset = useDataset();
  const [selectedPeriod, setSelectedPeriod] = useState('2026-09-Q2');

  // Parámetros configurables
  const [hourlyRate, setHourlyRate] = useState(150);
  const [commissionRate, setCommissionRate] = useState(2); // 2%

  const payroll = useMemo(() => {
    return dataset.instructors.map((inst) => {
      const instructorGroups = dataset.groups.filter((g) => g.instructorId === inst.id);
      // Mock bi-weekly hours: groups * 2 (2 weeks in a quincena approx)
      const hours = instructorGroups.length * 2;
      const basePay = hours * hourlyRate;

      // Mock commission based on retention
      // Supposing each group has 5 students, each paying 1850.
      const retainedStudents = instructorGroups.length * 5 * 0.85; // 85% retention
      const retainedRevenue = retainedStudents * 1850;
      const commission = retainedRevenue * (commissionRate / 100);

      const total = basePay + commission;

      return {
        ...inst,
        hours,
        basePay,
        retainedRevenue,
        commission,
        total,
      };
    });
  }, [dataset, hourlyRate, commissionRate, selectedPeriod]);

  const periods = [
    { label: 'Septiembre Q2 2026', value: '2026-09-Q2' },
    { label: 'Septiembre Q1 2026', value: '2026-09-Q1' },
    { label: 'Agosto Q2 2026', value: '2026-08-Q2' },
    { label: 'Agosto Q1 2026', value: '2026-08-Q1' },
  ];

  const totalPayroll = payroll.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Nómina y Comisiones</h1>
          <p className="text-lg text-secundario mt-1">Cálculo de pago quincenal a instructores</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-secundario">Total Nómina Periodo</div>
          <div className="text-2xl font-bold text-navy-900">{formatCurrency(totalPayroll)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-navy-900 mb-1">Quincena</label>
            <Select
              options={periods}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-900 mb-1">Costo por Hora ($)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-ice-200 rounded outline-none focus:border-aqua-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-900 mb-1">
              Comisión por Retención (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-ice-200 rounded outline-none focus:border-aqua-500"
            />
          </div>
          <Button variant="ghost" className="mt-auto border border-ice-200">
            Exportar CSV
          </Button>
        </Card>

        <Card className="lg:col-span-3 bg-white border border-ice-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ice-50 border-b border-ice-100">
              <tr>
                <th className="p-4 font-bold text-navy-900">Instructor</th>
                <th className="p-4 font-bold text-navy-900 text-right">Horas (Q)</th>
                <th className="p-4 font-bold text-navy-900 text-right">Sueldo Base</th>
                <th className="p-4 font-bold text-navy-900 text-right">Revenue Retenido</th>
                <th className="p-4 font-bold text-navy-900 text-right">Comisión</th>
                <th className="p-4 font-bold text-navy-900 text-right">Total a Pagar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ice-100">
              {payroll.map((p) => (
                <tr key={p.id} className="hover:bg-ice-50 transition-colors">
                  <td className="p-4 font-bold text-navy-900">{p.name}</td>
                  <td className="p-4 text-right text-secundario">{p.hours}</td>
                  <td className="p-4 text-right text-secundario">{formatCurrency(p.basePay)}</td>
                  <td className="p-4 text-right text-secundario">
                    {formatCurrency(p.retainedRevenue)}
                  </td>
                  <td className="p-4 text-right text-green-600 font-bold">
                    +{formatCurrency(p.commission)}
                  </td>
                  <td className="p-4 text-right font-bold text-blue-600 text-base">
                    {formatCurrency(p.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
