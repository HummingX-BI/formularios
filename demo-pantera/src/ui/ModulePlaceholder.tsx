import { MODULE_REGISTRY } from '@/modules/registry';
import { ModulePage } from '@/ui/ModulePage';

export function ModulePlaceholder({ id }: { id: string }) {
  const mod = MODULE_REGISTRY.find((m) => m.id === id);
  if (!mod) return <div>Module not found</div>;

  return (
    <ModulePage module={mod}>
      <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-ice-100 rounded-xl bg-ice-50/50">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Módulo en construcción</h2>
        <p className="text-text-secondary">{mod.shortDescription}</p>
      </div>
    </ModulePage>
  );
}
