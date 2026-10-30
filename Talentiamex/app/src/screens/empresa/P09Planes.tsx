// P09 · HU-6.1, HU-6.2
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Check, Gift, Minus } from 'lucide-react';
import { COMPARATIVA } from '@/data/planes';
import { PRUEBA_DIAS } from '@/data/config';
import { cargaSimulada } from '@/lib/esperar';
import { cn } from '@/lib/cn';
import { fechaCorta, moneda } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import type { Plan } from '@/types';
import { Badge, Button, Card, ModalPago, ScreenHeader, useToast } from '@/ui';

/** Lo que P10 manda cuando hay que contratar un plan para renovar una vacante (RD-04). */
interface EstadoRetorno {
  renovarVacanteId?: string;
}

function leerRetorno(estado: unknown): EstadoRetorno {
  if (typeof estado === 'object' && estado !== null && 'renovarVacanteId' in estado) {
    const id = estado.renovarVacanteId;
    if (typeof id === 'string') return { renovarVacanteId: id };
  }
  return {};
}

export default function P09Planes() {
  const navigate = useNavigate();
  const toast = useToast();
  const retorno = leerRetorno(useLocation().state);
  const planes = useDemoStore((s) => s.planes);
  const empresa = useDemoStore((s) =>
    s.sesion?.rol === 'empresa' ? s.empresas.find((e) => e.id === s.sesion?.id) : undefined,
  );
  const iniciarPrueba = useDemoStore((s) => s.iniciarPrueba);
  const contratarPlan = useDemoStore((s) => s.contratarPlan);
  const renovarVacante = useDemoStore((s) => s.renovarVacante);

  const [probando, setProbando] = useState(false);
  const [contratando, setContratando] = useState<Plan | null>(null);

  if (!empresa) return <Navigate to="/entrar" replace />;

  const recomendado = planes.find((p) => p.recomendado) ?? planes[1] ?? planes[0];
  const puedeProbar = empresa.plan.estado === 'sin_plan';

  const subtitulo = puedeProbar
    ? `Empieza con una prueba gratis de ${PRUEBA_DIAS} días, sin tarjeta`
    : empresa.plan.estado === 'vencido'
      ? 'Tu prueba terminó, elige un plan para seguir'
      : 'Cambia de plan cuando lo necesites';

  const probarGratis = async () => {
    if (!recomendado) return;
    setProbando(true);
    await cargaSimulada();
    iniciarPrueba(recomendado.id);
    toast.exito(`Empezó tu prueba gratis de ${PRUEBA_DIAS} días`);
    navigate('/empresa');
  };

  const alAprobar = () => {
    if (!contratando) return;
    contratarPlan(contratando.id);
    if (retorno.renovarVacanteId) renovarVacante(retorno.renovarVacanteId);
  };

  const limite = (p: Plan) =>
    p.vacantesActivas === 'ilimitadas' ? 'Ilimitadas' : String(p.vacantesActivas);

  return (
    <div>
      <ScreenHeader titulo="Elige tu plan" subtitulo={subtitulo} />

      <div className="grid gap-4 md:grid-cols-3">
        {planes.map((p) => {
          const destacado = p.id === recomendado?.id;
          const esActual = empresa.plan.estado === 'activo' && empresa.plan.id === p.id;
          return (
            <Card
              key={p.id}
              className={cn(
                'relative flex flex-col gap-4',
                destacado && 'order-first border-2 border-marca shadow-2 md:order-none',
              )}
            >
              {destacado && (
                <Badge tono="verde" className="absolute -top-3 left-4">
                  Recomendado
                </Badge>
              )}
              <div>
                <h2 className="font-titulo text-xl font-bold text-texto">{p.nombre}</h2>
                <p className="mt-1 font-titulo text-3xl font-bold tabular-nums text-texto">
                  {moneda(p.precioMensual)}
                  <span className="text-base font-medium text-texto-2"> /mes</span>
                </p>
                <p className="mt-1 text-base font-medium text-marca">
                  {p.vacantesActivas === 'ilimitadas'
                    ? 'Vacantes activas ilimitadas'
                    : `Hasta ${p.vacantesActivas} vacantes activas`}
                </p>
              </div>
              <ul className="flex flex-col gap-2 text-base text-texto">
                {p.incluye.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={18} className="mt-0.5 shrink-0 text-accion" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 pt-2">
                {destacado && puedeProbar && (
                  <Button
                    icono={Gift}
                    cargando={probando}
                    onClick={() => void probarGratis()}
                    anchoCompleto
                  >
                    Probar gratis {PRUEBA_DIAS} días
                  </Button>
                )}
                <Button
                  variante={
                    destacado && puedeProbar ? 'secundario' : destacado ? 'primario' : 'secundario'
                  }
                  disabled={esActual || probando}
                  onClick={() => setContratando(p)}
                  anchoCompleto
                >
                  {esActual ? 'Tu plan actual' : 'Contratar'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <section aria-label="Comparación de planes" className="mt-8">
        <h2 className="mb-3 font-titulo text-xl font-semibold text-texto">Compara los planes</h2>
        <div className="overflow-x-auto rounded-tarjeta bg-superficie shadow-1">
          <table className="w-full min-w-[30rem] border-collapse text-left text-base">
            <thead>
              <tr className="border-b border-borde">
                <th scope="col" className="p-3 text-sm font-semibold text-texto-2">
                  Incluye
                </th>
                {planes.map((p) => (
                  <th
                    key={p.id}
                    scope="col"
                    className="p-3 text-center font-titulo font-semibold text-texto"
                  >
                    {p.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-borde">
                <th scope="row" className="p-3 font-medium text-texto">
                  Vacantes activas
                </th>
                {planes.map((p) => (
                  <td key={p.id} className="p-3 text-center font-semibold text-texto">
                    {limite(p)}
                  </td>
                ))}
              </tr>
              {COMPARATIVA.map((fila) => (
                <tr key={fila.etiqueta} className="border-b border-borde last:border-b-0">
                  <th scope="row" className="p-3 font-medium text-texto">
                    {fila.etiqueta}
                  </th>
                  {planes.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      {fila.incluido[p.id] ? (
                        <Check size={20} className="mx-auto text-accion" aria-label="Incluido" />
                      ) : (
                        <Minus
                          size={20}
                          className="mx-auto text-texto-3"
                          aria-label="No incluido"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {contratando && (
        <ModalPago
          titulo={`Contratar plan ${contratando.nombre}`}
          intro="Se cobra cada mes."
          resumen={[
            { etiqueta: 'Plan', valor: contratando.nombre },
            { etiqueta: 'Cobro', valor: 'Mensual' },
          ]}
          monto={contratando.precioMensual}
          concepto={`Plan ${contratando.nombre}`}
          onCerrar={() => setContratando(null)}
          onAprobado={alAprobar}
          exito={{
            titulo: '¡Plan activo!',
            contenido: (
              <>
                <p className="text-base text-texto-2">
                  Tu plan {contratando.nombre} está activo hasta el{' '}
                  {fechaCorta(empresa.plan.venceEl)}.
                </p>
                {retorno.renovarVacanteId && (
                  <p className="text-sm text-texto-2">Tu vacante se renovó por 30 días.</p>
                )}
              </>
            ),
            pie: <Button onClick={() => navigate('/empresa')}>Ir a mi panel</Button>,
          }}
        />
      )}
    </div>
  );
}
