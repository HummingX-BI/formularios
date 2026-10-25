import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { useDataset } from '@/data/hooks';
import { formatCurrency } from '@/insights/templates';
import { Calendar, Download, Settings2, Wallet, TrendingUp, CheckCircle2 } from 'lucide-react';

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
    }).sort((a, b) => b.total - a.total);
  }, [dataset, hourlyRate, commissionRate, selectedPeriod]);

  const periods = [
    { label: 'Septiembre Q2 2026', value: '2026-09-Q2' },
    { label: 'Septiembre Q1 2026', value: '2026-09-Q1' },
    { label: 'Agosto Q2 2026', value: '2026-08-Q2' },
    { label: 'Agosto Q1 2026', value: '2026-08-Q1' },
  ];

  const totalPayroll = payroll.reduce((acc, curr) => acc + curr.total, 0);
  const totalBase = payroll.reduce((acc, curr) => acc + curr.basePay, 0);
  const totalCommission = payroll.reduce((acc, curr) => acc + curr.commission, 0);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Nómina y Comisiones</h1>
          <p className="text-base text-slate-500 mt-1 font-medium">Gestión de compensaciones y bonos de retención</p>
        </div>
        
        {/* KPI Summary */}
        <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Total Periodo</p>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalPayroll)}</p>
          </div>
          <div className="w-px h-10 bg-slate-200"></div>
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Base</p>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(totalBase)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-500">Bonos</p>
              <p className="text-sm font-bold text-emerald-600">+{formatCurrency(totalCommission)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Control Panel (Sidebar on Desktop) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-5 sticky top-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings2 className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-700">Parámetros</h3>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Quincena
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Costo Base por Hora
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Comisión Retención
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                Porcentaje sobre la colegiatura de los alumnos que no se dieron de baja.
              </p>
            </div>

            <button className="mt-2 w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-blue-100">
              <Download className="w-4 h-4" /> Exportar Recibos
            </button>
          </Card>
        </div>

        {/* Payroll List */}
        <div className="lg:col-span-9 flex flex-col gap-3">
          {payroll.map((p) => (
            <Card key={p.id} className="bg-white border border-slate-200 p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg border border-slate-200 group-hover:from-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                  {getInitials(p.name)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 font-medium">ID: {p.id}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Procesado
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Base ({p.hours}h)</p>
                  <p className="font-semibold text-slate-600 text-sm">{formatCurrency(p.basePay)}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-emerald-500 mb-0.5">Bonos</p>
                  <p className="font-bold text-emerald-600 text-sm">+{formatCurrency(p.commission)}</p>
                </div>
                
                <div className="text-right border-l border-slate-100 pl-6 w-28 shrink-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Pago Final</p>
                  <p className="font-bold text-blue-700 text-lg tracking-tight">{formatCurrency(p.total)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
