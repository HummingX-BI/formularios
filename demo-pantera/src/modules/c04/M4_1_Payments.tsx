import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Select } from '@/ui/components/Inputs';
import { Badge } from '@/ui/components/DataDisplay';
import { useDataset } from '@/data/hooks';
import { useAppStore } from '@/app/store';
import { formatCurrency } from '@/insights/templates';

export default function M4_1_Payments() {
  const dataset = useDataset();
  const store = useAppStore();

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
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [dataset, filterStatus, filterMethod, simulatedPayments]);

  const totalFiltered = charges.reduce((acc, c) => acc + c.amount, 0);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Pagos y Adeudos</h1>
          <p className="text-lg text-secundario mt-1">Gestión de cobranza y registro de pagos</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-secundario">Total en vista (Cuadre)</div>
          <div className="text-2xl font-bold text-navy-900">{formatCurrency(totalFiltered)}</div>
        </div>
      </div>

      <Card className="p-6 bg-white border border-ice-100 shadow-sm flex gap-6 items-end">
        <div className="w-48">
          <label className="block text-sm font-bold text-navy-900 mb-1">Estatus</label>
          <Select
            options={[
              { label: 'Todos', value: 'todos' },
              { label: 'Pendiente', value: 'pendiente' },
              { label: 'Vencido', value: 'vencido' },
              { label: 'Pagado', value: 'pagado' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-bold text-navy-900 mb-1">Método preferido</label>
          <Select
            options={[
              { label: 'Todos', value: 'todos' },
              { label: 'Tarjeta', value: 'tarjeta' },
              { label: 'Transferencia', value: 'transferencia' },
              { label: 'Efectivo', value: 'efectivo' },
            ]}
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
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
              <th className="p-4 font-bold text-navy-900 text-sm">Fecha</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Familia</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Concepto</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Monto</th>
              <th className="p-4 font-bold text-navy-900 text-sm">Estatus</th>
              <th className="p-4 font-bold text-navy-900 text-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ice-100">
            {charges.slice(0, 100).map((c) => (
              <tr key={c.id} className="hover:bg-ice-50 transition-colors">
                <td className="p-4 text-navy-900">{c.date}</td>
                <td className="p-4">
                  <div className="font-bold text-navy-900">
                    {c.family?.tutorName || 'Desconocido'}
                  </div>
                  <div className="text-xs text-secundario">{c.family?.phone}</div>
                </td>
                <td className="p-4 text-navy-900">{c.concept}</td>
                <td className="p-4 font-bold text-navy-900 tabular-figures">
                  {formatCurrency(c.amount)}
                </td>
                <td className="p-4">
                  <Badge
                    color={
                      c.status === 'pagado'
                        ? 'bg-green-500 text-white'
                        : c.status === 'vencido'
                          ? 'bg-coral text-white'
                          : 'bg-amber-400 text-navy-900'
                    }
                  >
                    {c.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  {c.status !== 'pagado' ? (
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleGenerateLink(c.id)}>
                        Link
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handlePay(c.id, c.amount)}>
                        Cobrar
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      Pagado
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {charges.length > 100 && (
          <div className="p-4 text-center text-sm text-secundario bg-ice-50 border-t border-ice-100">
            Mostrando 100 de {charges.length} registros
          </div>
        )}
      </Card>
    </div>
  );
}
