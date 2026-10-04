import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Select } from '@/ui/components/Inputs';
import { useDataset } from '@/data/hooks';
import { formatCurrency } from '@/insights/templates';

export default function M4_2_AccountStatement() {
  const dataset = useDataset();
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(dataset.families[0]?.id || '');

  const family = dataset.families.find((f) => f.id === selectedFamilyId);

  const { charges, payments, balance, summary } = useMemo(() => {
    if (!selectedFamilyId) return { charges: [], payments: [], balance: 0, summary: null };

    const fCharges = dataset.charges
      .filter((c) => c.familyId === selectedFamilyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const fPayments = dataset.payments
      .filter((p) => p.familyId === selectedFamilyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalCharges = fCharges.reduce((acc, c) => acc + c.amount, 0);
    const totalPayments = fPayments.reduce((acc, p) => acc + p.amount, 0);
    // Mock discounts/surcharges
    const discounts = 0;
    const surcharges = fCharges.filter((c) => c.status === 'vencido').length * 150;

    const balance = totalCharges + surcharges - discounts - totalPayments;

    return {
      charges: fCharges,
      payments: fPayments,
      balance,
      summary: { totalCharges, totalPayments, discounts, surcharges },
    };
  }, [dataset, selectedFamilyId]);

  const allMovements = useMemo(() => {
    const moves = [
      ...charges.map((c) => ({
        ...c,
        type: 'charge',
        desc: `Cargo: ${c.concept}`,
        color: 'bg-amber-100 text-amber-800',
      })),
      ...payments.map((p) => ({
        ...p,
        type: 'payment',
        desc: `Pago: #${p.id.substring(0, 8)}`,
        color: 'bg-green-100 text-green-800',
      })),
    ];
    return moves.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [charges, payments]);

  if (!family) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Estado de Cuenta</h1>
          <p className="text-lg text-secundario mt-1">Resumen financiero por familia</p>
        </div>
        <Button variant="ghost" className="border border-ice-200" onClick={() => window.print()}>
          Imprimir Estado de Cuenta
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1 p-6 bg-white border border-ice-100 shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-navy-900 mb-1">Buscar Familia</label>
            <Select
              options={dataset.families.map((f) => ({ label: f.tutorName, value: f.id }))}
              value={selectedFamilyId}
              onChange={(e) => setSelectedFamilyId(e.target.value)}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-ice-100">
            <h3 className="font-bold text-navy-900 mb-2">Datos de Contacto</h3>
            <div className="text-sm space-y-2">
              <p>
                <span className="text-tenue">ID:</span>{' '}
                <span className="font-bold">{family.id}</span>
              </p>
              <p>
                <span className="text-tenue">Tutor:</span> {family.tutorName}
              </p>
              <p>
                <span className="text-tenue">Teléfono:</span> {family.phone}
              </p>
              <p>
                <span className="text-tenue">Método preferido:</span>{' '}
                <span className="capitalize">{family.paymentMethod}</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="col-span-2 p-6 bg-white border border-ice-100 shadow-sm">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-ice-50 rounded text-center">
              <div className="text-sm text-secundario mb-1">Saldo Actual</div>
              <div
                className={`text-3xl font-bold ${balance > 0 ? 'text-coral' : 'text-green-500'}`}
              >
                {formatCurrency(balance)}
              </div>
            </div>
            <div className="p-4 bg-ice-50 rounded text-center">
              <div className="text-sm text-secundario mb-1">Cargos (Mes)</div>
              <div className="text-2xl font-bold text-navy-900">
                {formatCurrency(summary?.totalCharges || 0)}
              </div>
            </div>
            <div className="p-4 bg-ice-50 rounded text-center">
              <div className="text-sm text-secundario mb-1">Pagos (Mes)</div>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(summary?.totalPayments || 0)}
              </div>
            </div>
          </div>

          <h3 className="font-bold text-navy-900 mb-4 font-jakarta">
            Línea de Tiempo de Movimientos
          </h3>
          <div className="relative border-l border-ice-200 ml-3 pl-6 space-y-6">
            {allMovements.slice(0, 15).map((m, i) => (
              <div key={i} className="relative">
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${m.type === 'payment' ? 'bg-green-500' : 'bg-amber-400'}`}
                ></div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-navy-900">{m.desc}</div>
                    <div className="text-xs text-secundario">{m.date}</div>
                  </div>
                  <div
                    className={`font-bold tabular-figures ${m.type === 'payment' ? 'text-green-500' : 'text-navy-900'}`}
                  >
                    {m.type === 'payment' ? '-' : '+'}
                    {formatCurrency(m.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {allMovements.length > 15 && (
            <Button variant="ghost" className="w-full mt-6 text-aqua-500">
              Cargar más movimientos
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
