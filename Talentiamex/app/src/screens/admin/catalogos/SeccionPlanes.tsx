import { useState } from 'react';
import { Save } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import type { Plan, PlanId } from '@/types';
import { Button, Card, Checkbox, GrupoOpciones, Input, Textarea, useAccion, useToast } from '@/ui';

function FormularioPlan({ plan }: { plan: Plan }) {
  const toast = useToast();
  const { ocupado, ejecutar } = useAccion();
  const editarPlan = useDemoStore((s) => s.editarPlan);
  const [nombre, setNombre] = useState(plan.nombre);
  const [precio, setPrecio] = useState(String(plan.precioMensual));
  const [ilimitadas, setIlimitadas] = useState(plan.vacantesActivas === 'ilimitadas');
  const [limite, setLimite] = useState(
    plan.vacantesActivas === 'ilimitadas' ? '' : String(plan.vacantesActivas),
  );
  const [incluye, setIncluye] = useState(plan.incluye.join('\n'));
  const [intento, setIntento] = useState(false);

  const errores = {
    nombre: nombre.trim() ? undefined : 'Escribe el nombre del plan',
    precio: Number(precio) > 0 ? undefined : 'Escribe un precio mayor a 0',
    limite: ilimitadas || Number(limite) >= 1 ? undefined : 'Indica cuántas vacantes incluye',
  };

  const guardar = () => {
    setIntento(true);
    if (Object.values(errores).some(Boolean)) return;
    editarPlan({
      ...plan,
      nombre: nombre.trim(),
      precioMensual: Number(precio),
      vacantesActivas: ilimitadas ? 'ilimitadas' : Number(limite),
      incluye: incluye
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
    });
    toast.exito(`Plan ${nombre.trim()} actualizado`);
  };

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="font-titulo text-lg font-semibold text-texto">Plan {plan.nombre}</h3>
      <Input
        etiqueta="Nombre"
        name={`plan-${plan.id}-nombre`}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={intento ? errores.nombre : undefined}
      />
      <Input
        etiqueta="Precio mensual (MXN)"
        name={`plan-${plan.id}-precio`}
        inputMode="numeric"
        value={precio}
        onChange={(e) => setPrecio(e.target.value.replace(/\D/g, '').slice(0, 6))}
        error={intento ? errores.precio : undefined}
      />
      <Checkbox
        etiqueta="Vacantes activas ilimitadas"
        name={`plan-${plan.id}-ilimitadas`}
        checked={ilimitadas}
        onChange={(e) => setIlimitadas(e.target.checked)}
      />
      {!ilimitadas && (
        <Input
          etiqueta="Vacantes activas incluidas"
          name={`plan-${plan.id}-limite`}
          inputMode="numeric"
          value={limite}
          onChange={(e) => setLimite(e.target.value.replace(/\D/g, '').slice(0, 3))}
          error={intento ? errores.limite : undefined}
        />
      )}
      <Textarea
        etiqueta="Qué incluye"
        name={`plan-${plan.id}-incluye`}
        rows={5}
        ayuda="Una línea por cada beneficio."
        value={incluye}
        onChange={(e) => setIncluye(e.target.value)}
      />
      <div>
        <Button
          variante="secundario"
          icono={Save}
          cargando={ocupado === 'guardar'}
          onClick={() => {
            setIntento(true);
            if (Object.values(errores).some(Boolean)) return;
            void ejecutar('guardar', guardar);
          }}
        >
          Guardar plan
        </Button>
      </div>
    </Card>
  );
}

/** Edición de nombre, precio y límites de los planes; se reflejan en P09. */
export function SeccionPlanes() {
  const toast = useToast();
  const planes = useDemoStore((s) => s.planes);
  const editarPlan = useDemoStore((s) => s.editarPlan);
  const recomendado = planes.find((p) => p.recomendado)?.id ?? '';

  const marcarRecomendado = (id: PlanId) => {
    for (const p of planes) {
      const debe = p.id === id;
      if (Boolean(p.recomendado) !== debe) {
        const { recomendado: _antes, ...resto } = p;
        editarPlan(debe ? { ...resto, recomendado: true } : resto);
      }
    }
    toast.exito('Plan recomendado actualizado');
  };

  return (
    <section aria-label="Planes">
      <h2 className="mb-1 font-titulo text-xl font-semibold text-texto">Planes</h2>
      <p className="mb-3 text-base text-texto-2">
        Cambia nombres, precios y límites. Las empresas ven los cambios en la pantalla de planes.
      </p>
      <div className="mb-4">
        <GrupoOpciones<PlanId>
          etiqueta="Plan recomendado"
          opciones={planes.map((p) => ({ valor: p.id, texto: p.nombre }))}
          valor={recomendado}
          onCambio={marcarRecomendado}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {planes.map((p) => (
          <FormularioPlan key={`${p.id}-${p.nombre}-${p.precioMensual}`} plan={p} />
        ))}
      </div>
    </section>
  );
}
