import { MapPin, MessageCircle } from 'lucide-react';
import { VIGENCIA_VACANTE_DIAS } from '@/data/config';
import { sumarDias } from '@/lib/fechas';
import { ETIQUETA_TURNO } from '@/lib/etiquetas';
import { fechaCorta, moneda } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import type { Empresa } from '@/types';
import { Badge, Card, SectorChip } from '@/ui';
import type { BorradorVacante } from './borrador';

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="font-titulo text-base font-semibold text-texto">{titulo}</h3>
      <ul className="mt-1 list-disc pl-5 text-base text-texto">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

interface Paso3Props {
  borrador: BorradorVacante;
  empresa: Empresa;
  /** Si se está editando, no se avisa a nadie. */
  editando: boolean;
}

/** P11 · paso 3: vista previa como la verá el candidato y fecha de vencimiento. */
export function Paso3Revisar({ borrador: b, empresa, editando }: Paso3Props) {
  const hoy = useDemoStore((s) => s.hoy);
  const suspendidos = useDemoStore((s) => s.suspendidos);
  const coinciden = useDemoStore(
    (s) =>
      s.candidatos.filter(
        (c) => c.sector === b.sector && c.zona === b.zona && !suspendidos.includes(c.id),
      ).length,
  );
  const preguntas = b.preguntas.filter((p) => p.texto.trim() !== '');

  return (
    <>
      <p className="rounded-boton bg-accion-suave p-3 text-base font-medium text-accion-hover">
        Vigencia: {VIGENCIA_VACANTE_DIAS} días, vence el{' '}
        {fechaCorta(sumarDias(hoy, VIGENCIA_VACANTE_DIAS))}.
      </p>

      {!editando && (
        <p className="flex items-start gap-2 text-base text-texto-2">
          <MessageCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          {coinciden === 0
            ? 'Por ahora no hay candidatos que coincidan, pero tu vacante aparecerá en las búsquedas.'
            : coinciden === 1
              ? 'Avisaremos por WhatsApp a 1 candidato que coincide.'
              : `Avisaremos por WhatsApp a ${coinciden} candidatos que coinciden.`}
        </p>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-texto-2">
          Así la verá el candidato
        </p>
        <Card className="flex flex-col gap-4 border border-borde shadow-none">
          <SectorChip sector={b.sector} />
          <div>
            <h2 className="font-titulo text-xl font-bold text-texto">
              {b.puesto} en {empresa.nombre}
            </h2>
            <ul className="mt-2 flex flex-col gap-1 text-base text-texto">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-texto-3" aria-hidden="true" />
                {b.zona}
              </li>
              <li>{moneda(Number(b.sueldo))} al mes</li>
              <li>
                Turno {b.turno ? ETIQUETA_TURNO[b.turno].toLowerCase() : ''} · {b.contrato}
              </li>
            </ul>
          </div>
          <p className="text-base text-texto">{b.descripcion}</p>
          <Lista titulo="Requisitos" items={b.requisitos} />
          <Lista titulo="Prestaciones" items={b.prestaciones} />
          {preguntas.length > 0 && (
            <section>
              <h3 className="font-titulo text-base font-semibold text-texto">
                Preguntas al postularse
              </h3>
              <ul className="mt-2 flex flex-col gap-2">
                {preguntas.map((p) => (
                  <li
                    key={p.clave}
                    className="flex flex-wrap items-center gap-2 text-base text-texto"
                  >
                    {p.texto}
                    <Badge tono="gris">Esperas: {p.respuestaEsperada ? 'Sí' : 'No'}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Card>
      </div>
    </>
  );
}
