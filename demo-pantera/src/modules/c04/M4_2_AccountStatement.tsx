import { useState, useMemo } from 'react';
import { useDataset } from '@/data/hooks';
import { formatCurrency } from '@/insights/templates';
import { 
  AlertTriangle, Phone, MessageCircle, Mail, 
  CreditCard, Search, ShieldAlert, FileText, Clock, ChevronRight, Activity, CheckCircle2
} from 'lucide-react';

export default function M4_2_AccountStatement() {
  const dataset = useDataset();
  const [searchTerm, setSearchTerm] = useState('');

  // Generamos una cartera vencida mock (familias con adeudos)
  const debtors = useMemo(() => {
    return dataset.families
      .filter((f, i) => i % 3 === 0) // simulamos 1/3 de familias con adeudo
      .map((f, i) => ({
        ...f,
        debtAmount: 850 + (i * 350),
        monthsDue: (i % 3) + 1,
        lastReminder: new Date(Date.now() - (i * 86400000 * 2)).toLocaleDateString()
      }));
  }, [dataset.families]);

  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(debtors[0]?.id || null);

  const filteredDebtors = useMemo(() => {
    if (!searchTerm) return debtors;
    const term = searchTerm.toLowerCase();
    return debtors.filter((d) => 
      d.tutorName.toLowerCase().includes(term) || d.id.toLowerCase().includes(term)
    );
  }, [debtors, searchTerm]);

  const selectedDebtor = useMemo(
    () => debtors.find(d => d.id === selectedDebtorId),
    [debtors, selectedDebtorId]
  );

  const debtorStudents = useMemo(() => {
    if (!selectedDebtor) return [];
    return dataset.students.filter(s => s.familyId === selectedDebtor.id);
  }, [dataset.students, selectedDebtor]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.substring(0, 2).toUpperCase();
  };

  if (!selectedDebtor) return <div className="p-8 text-center text-slate-500 font-medium">No hay deudores en este momento.</div>;

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 overflow-hidden pb-4">
      
      {/* SIDEBAR: CARTERA VENCIDA INBOX */}
      <div className="w-80 lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <h2 className="font-display font-bold text-slate-800 text-lg mb-1 flex items-center gap-2 tracking-tight">
            <Activity className="text-rose-500 w-5 h-5" /> Cartera Vencida
          </h2>
          <p className="text-xs text-slate-500 mb-4 font-medium">Listado de familias con saldos pendientes</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por familia o ID..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/30">
          {filteredDebtors.map((debtor) => {
            const isSelected = selectedDebtorId === debtor.id;
            return (
              <button
                key={debtor.id}
                onClick={() => setSelectedDebtorId(debtor.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group relative
                  ${isSelected ? 'bg-white shadow-sm border border-slate-200 ring-1 ring-slate-100' : 'border border-transparent hover:bg-slate-100/50'}`}
              >
                {isSelected && <div className="absolute left-0 top-3 bottom-3 w-1 bg-rose-500 rounded-r-full"></div>}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                  ${isSelected ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                  {getInitials(debtor.tutorName)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                    {debtor.tutorName}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${debtor.monthsDue > 1 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {debtor.monthsDue} mes{debtor.monthsDue > 1 ? 'es' : ''}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold text-sm ${isSelected ? 'text-rose-600' : 'text-slate-600 group-hover:text-rose-500'}`}>
                    {formatCurrency(debtor.debtAmount)}
                  </div>
                  <ChevronRight className={`w-4 h-4 ml-auto mt-1 ${isSelected ? 'text-slate-400' : 'text-transparent group-hover:text-slate-300'}`} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ESTADO DE CUENTA DETALLE */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-6">
        
        {/* HEADER PROFILE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
          {/* Fondo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 border border-rose-200">
                  <AlertTriangle className="w-3 h-3" /> Cuenta con Atraso
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">ID: {selectedDebtor.id}</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                Familia {selectedDebtor.tutorName}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Phone className="w-4 h-4 text-slate-400" /> {selectedDebtor.phone}</span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Mail className="w-4 h-4 text-slate-400" /> {selectedDebtor.email}</span>
              </div>
            </div>

            <div className="text-right bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 min-w-[220px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Adeudo Total
              </div>
              <div className="text-4xl font-bold text-white">{formatCurrency(selectedDebtor.debtAmount)}</div>
              <div className="text-xs text-rose-400 font-medium mt-2">{selectedDebtor.monthsDue} meses de atraso</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-slate-100">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5C] text-white text-sm font-bold rounded-xl shadow-sm transition-colors">
              <MessageCircle className="w-4 h-4" /> Enviar Recordatorio WhatsApp
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-xl shadow-sm transition-colors">
              <FileText className="w-4 h-4 text-blue-500" /> Generar PDF Estado de Cuenta
            </button>
            <div className="flex-1"></div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-colors">
              <CreditCard className="w-4 h-4" /> Registrar Pago
            </button>
          </div>
        </div>

        {/* DETALLE DE COBROS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Cargos Pendientes
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Concepto</th>
                  <th className="px-6 py-4">Alumno(s)</th>
                  <th className="px-6 py-4">Días Atraso</th>
                  <th className="px-6 py-4 text-center">Estatus</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">Mensualidad Mes Pasado</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{debtorStudents.map(s => s.name.split(' ')[0]).join(', ')}</td>
                  <td className="px-6 py-4 text-rose-600 font-bold">{selectedDebtor.monthsDue * 30} días</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">VENCIDO</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800 text-base">{formatCurrency(selectedDebtor.debtAmount * 0.8)}</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">Recargos por Atraso</td>
                  <td className="px-6 py-4 text-slate-400 font-medium">-</td>
                  <td className="px-6 py-4 text-slate-400 font-medium">-</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">VENCIDO</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800 text-base">{formatCurrency(selectedDebtor.debtAmount * 0.2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* LOG DE COBRANZA (TIMELINE) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-amber-500" /> Historial de Seguimiento
          </h3>
          
          <div className="flex gap-4 relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-8 bottom-0 w-px bg-slate-200"></div>
            
            <div className="relative z-10 w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800 text-sm">Recordatorio Automatizado (WhatsApp)</h4>
                <span className="text-xs font-bold text-slate-400">{selectedDebtor.lastReminder}</span>
              </div>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                El sistema envió un mensaje con el estado de cuenta y link de pago. <br/>
                <span className="inline-flex items-center gap-1 text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Leído por el cliente (Doble check azul)
                </span>
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acción sugerida:</span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">Llamada telefónica recomendada</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
