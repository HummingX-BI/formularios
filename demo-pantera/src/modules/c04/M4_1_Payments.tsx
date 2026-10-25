import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { useDataset } from '@/data/hooks';
import { useAppStore } from '@/app/store';
import { formatCurrency } from '@/insights/templates';
import { 
  Search, Filter, CreditCard, Banknote, Landmark, 
  Link as LinkIcon, CheckCircle2, Clock, AlertCircle, Download, DollarSign 
} from 'lucide-react';

export default function M4_1_Payments() {
  const dataset = useDataset();
  const store = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterMethod, setFilterMethod] = useState('todos');

  // Local simulated state for payments to show instant mutation in session
  const [simulatedPayments, setSimulatedPayments] = useState<Record<string, boolean>>({});

  const charges = useMemo(() => {
    return dataset.charges
      .map((c) => {
        const family = dataset.families.find((f) => f.id === c.familyId);
        const isSimulated = simulatedPayments[c.id];
        const status = isSimulated ? 'pagado' : c.status;
        return { ...c, status, family };
      })
      .filter((c) => {
        if (filterStatus !== 'todos' && c.status !== filterStatus) return false;
        if (filterMethod !== 'todos' && c.family?.paymentMethod !== filterMethod) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesName = c.family?.tutorName.toLowerCase().includes(term);
          const matchesConcept = c.concept.toLowerCase().includes(term);
          if (!matchesName && !matchesConcept) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [dataset, filterStatus, filterMethod, searchTerm, simulatedPayments]);

  const totalPagado = charges.filter(c => c.status === 'pagado').reduce((acc, c) => acc + c.amount, 0);
  const totalPendiente = charges.filter(c => c.status === 'pendiente').reduce((acc, c) => acc + c.amount, 0);
  const totalVencido = charges.filter(c => c.status === 'vencido').reduce((acc, c) => acc + c.amount, 0);

  const handlePay = (chargeId: string, amount: number) => {
    setSimulatedPayments((prev) => ({ ...prev, [chargeId]: true }));
    store.addPlanAction({
      type: 'payment',
      target: chargeId,
      message: `Cobro simulado de ${formatCurrency(amount)}`,
    });
  };

  const handleGenerateLink = (chargeId: string) => {
    store.addPlanAction({ type: 'link', target: chargeId, message: `Enlace de pago generado` });
    alert('Enlace de pago copiado al portapapeles: https://pantera.pay/demo/' + chargeId);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.substring(0, 2).toUpperCase();
  };

  const getMethodIcon = (method?: string) => {
    switch (method) {
      case 'tarjeta': return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'transferencia': return <Landmark className="w-4 h-4 text-indigo-500" />;
      case 'efectivo': return <Banknote className="w-4 h-4 text-emerald-500" />;
      default: return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pagado': return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Pagado' };
      case 'vencido': return { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: <AlertCircle className="w-3.5 h-3.5" />, label: 'Vencido' };
      default: return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Clock className="w-3.5 h-3.5" />, label: 'Pendiente' };
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Punto de Cobro</h1>
          <p className="text-base text-slate-500 mt-1 font-medium">Gestión de caja, cobros y enlaces de pago</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Exportar Reporte
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-0.5">Ingreso Asegurado</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalPagado)}</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-0.5">Por Cobrar</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalPendiente)}</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-0.5">Vencido (En Riesgo)</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalVencido)}</p>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por familia, alumno o concepto..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['Todos', 'Pendiente', 'Vencido', 'Pagado'].map(t => (
                <button 
                  key={t}
                  onClick={() => setFilterStatus(t.toLowerCase())}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    filterStatus === t.toLowerCase() 
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Métodos</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Familia / Cargo</th>
                <th className="px-6 py-4">Concepto</th>
                <th className="px-6 py-4">Método</th>
                <th className="px-6 py-4 text-right">Monto</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Acción de Cobro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {charges.slice(0, 100).map((c) => {
                const conf = getStatusConfig(c.status);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200 shrink-0">
                          {getInitials(c.family?.tutorName || 'D D')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{c.family?.tutorName || 'Desconocido'}</div>
                          <div className="text-xs text-slate-500 font-medium">{c.date} • {c.family?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">{c.concept}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        {getMethodIcon(c.family?.paymentMethod)}
                        <span className="capitalize">{c.family?.paymentMethod || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-800 text-base">{formatCurrency(c.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full border ${conf.bg} ${conf.border} ${conf.color} mx-auto w-fit`}>
                        {conf.icon}
                        <span className="text-xs font-bold">{conf.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status !== 'pagado' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleGenerateLink(c.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            title="Generar Link de Pago"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handlePay(c.id, c.amount)}
                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <DollarSign className="w-3.5 h-3.5" /> Cobrar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <span className="px-4 py-1.5 text-slate-400 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Acreditado
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {charges.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No se encontraron cargos con estos filtros.
            </div>
          )}
        </div>
        {charges.length > 100 && (
          <div className="p-4 text-center text-xs font-bold text-slate-400 bg-slate-50 border-t border-slate-100">
            Mostrando 100 de {charges.length} registros
          </div>
        )}
      </Card>
    </div>
  );
}
