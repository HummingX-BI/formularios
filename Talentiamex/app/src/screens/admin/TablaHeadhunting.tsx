import { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { RECLUTADORES } from '@/data/reclutadores';
import { fechaCorta } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import type { SolicitudHeadhunting } from '@/types';
import { BadgeHeadhunting, Button, Card, EmptyState, Modal, Select, useToast } from '@/ui';

/** Solicitudes de headhunting de las empresas, con la acción "Asignar reclutador". */
export function TablaHeadhunting() {
  const toast = useToast();
  const solicitudes = useDemoStore((s) => s.solicitudes);
  const empresas = useDemoStore((s) => s.empresas);
  const asignarReclutador = useDemoStore((s) => s.asignarReclutador);

  const [asignando, setAsignando] = useState<SolicitudHeadhunting | null>(null);
  const [nombre, setNombre] = useState('');
  const [intento, setIntento] = useState(false);

  const ordenadas = [...solicitudes].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id),
  );
  const empresaDe = (s: SolicitudHeadhunting) =>
    empresas.find((e) => e.id === s.empresaId)?.nombre ?? '';

  const abrir = (s: SolicitudHeadhunting) => {
    setAsignando(s);
    setNombre(s.reclutador ?? '');
    setIntento(false);
  };

  const confirmar = () => {
    setIntento(true);
    if (!asignando || !nombre) return;
    asignarReclutador(asignando.id, nombre);
    toast.exito(`${nombre} quedó asignado a ${asignando.puesto}`);
    setAsignando(null);
  };

  const accion = (s: SolicitudHeadhunting) => (
    <Button variante="secundario" icono={UserCheck} onClick={() => abrir(s)}>
      {s.reclutador ? 'Cambiar reclutador' : 'Asignar reclutador'}
    </Button>
  );

  return (
    <section aria-label="Solicitudes de headhunting" className="mt-8">
      <h2 className="mb-3 font-titulo text-xl font-semibold text-texto">
        Solicitudes de headhunting
      </h2>

      {ordenadas.length === 0 ? (
        <EmptyState
          icono={UserCheck}
          titulo="Aún no hay solicitudes"
          texto="Cuando una empresa pida headhunting, aparecerá aquí."
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-tarjeta bg-superficie shadow-1 md:block">
            <table className="w-full border-collapse text-left text-base">
              <thead>
                <tr className="border-b border-borde text-sm text-texto-2">
                  <th scope="col" className="p-3 font-semibold">
                    Empresa
                  </th>
                  <th scope="col" className="p-3 font-semibold">
                    Puesto
                  </th>
                  <th scope="col" className="p-3 font-semibold">
                    Urgencia
                  </th>
                  <th scope="col" className="p-3 font-semibold">
                    Estado
                  </th>
                  <th scope="col" className="p-3 font-semibold">
                    Reclutador
                  </th>
                  <th scope="col" className="p-3 font-semibold">
                    <span className="sr-only">Acción</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordenadas.map((s) => (
                  <tr key={s.id} className="border-b border-borde last:border-b-0">
                    <td className="p-3 font-medium text-texto">{empresaDe(s)}</td>
                    <td className="p-3 text-texto">{s.puesto}</td>
                    <td className="p-3 text-texto">{s.urgencia}</td>
                    <td className="p-3">
                      <BadgeHeadhunting estado={s.estado} />
                    </td>
                    <td className="p-3 text-texto-2">{s.reclutador ?? '—'}</td>
                    <td className="p-3 text-right">{accion(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {ordenadas.map((s) => (
              <li key={s.id}>
                <Card className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-titulo text-lg font-semibold text-texto">{s.puesto}</h3>
                    <BadgeHeadhunting estado={s.estado} />
                  </div>
                  <p className="text-base text-texto-2">{empresaDe(s)}</p>
                  <p className="text-base text-texto">
                    {s.urgencia} · enviada el {fechaCorta(s.fecha)}
                  </p>
                  {s.reclutador && (
                    <p className="text-base text-texto">
                      Reclutador: <strong className="font-semibold">{s.reclutador}</strong>
                    </p>
                  )}
                  <div>{accion(s)}</div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      <Modal
        abierto={asignando !== null}
        onCerrar={() => setAsignando(null)}
        titulo="Asignar reclutador"
        pie={
          <>
            <Button onClick={confirmar}>Asignar</Button>
            <Button variante="fantasma" onClick={() => setAsignando(null)}>
              Cancelar
            </Button>
          </>
        }
      >
        {asignando && (
          <>
            <p className="mb-4 text-base text-texto-2">
              {asignando.puesto} · {empresaDe(asignando)}
            </p>
            <Select
              etiqueta="Reclutador"
              name="reclutador"
              placeholder="Elige una persona"
              opciones={RECLUTADORES.map((r) => ({ valor: r, texto: r }))}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={intento && !nombre ? 'Elige a quién asignar' : undefined}
              ayuda="Al asignar, la solicitud pasa a En búsqueda."
            />
          </>
        )}
      </Modal>
    </section>
  );
}
