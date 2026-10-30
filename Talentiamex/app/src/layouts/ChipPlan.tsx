import { diasEntre } from '@/lib/fechas';
import { useDemoStore } from '@/store/useDemoStore';
import { Badge, type TonoBadge } from '@/ui/Badge';

/** Chip del plan de la empresa con los días de prueba que le quedan. */
export function ChipPlan({ empresaId }: { empresaId: string }) {
  const empresa = useDemoStore((s) => s.empresas.find((e) => e.id === empresaId));
  const hoy = useDemoStore((s) => s.hoy);
  const nombrePlan = useDemoStore((s) => s.planes.find((p) => p.id === empresa?.plan.id)?.nombre ?? '');
  if (!empresa) return null;

  const dias = empresa.plan.venceEl ? diasEntre(hoy, empresa.plan.venceEl) : 0;
  let tono: TonoBadge = 'gris';
  let texto = 'Sin plan';
  switch (empresa.plan.estado) {
    case 'prueba':
      tono = dias <= 3 ? 'ambar' : 'verde';
      texto = dias === 1 ? 'Prueba · 1 día' : `Prueba · ${Math.max(dias, 0)} días`;
      break;
    case 'activo':
      tono = 'verde';
      texto = `Plan ${nombrePlan}`;
      break;
    case 'vencido':
      tono = 'rojo';
      texto = 'Plan vencido';
      break;
    case 'sin_plan':
      break;
  }
  return <Badge tono={tono}>{texto}</Badge>;
}
