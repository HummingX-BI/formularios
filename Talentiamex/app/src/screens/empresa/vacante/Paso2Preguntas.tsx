import { Plus, Trash2 } from 'lucide-react';
import { preguntasPorSector } from '@/data/preguntasSugeridas';
import { cn } from '@/lib/cn';
import { Button, GrupoOpciones, Input } from '@/ui';
import { MAX_PREGUNTAS, nuevaClave, type BorradorVacante } from './borrador';

const SI_NO: { valor: 'si' | 'no'; texto: string }[] = [
  { valor: 'si', texto: 'Sí' },
  { valor: 'no', texto: 'No' },
];

interface Paso2Props {
  borrador: BorradorVacante;
  onCambio: (parte: Partial<BorradorVacante>) => void;
}

/** P11 · paso 2: hasta 5 preguntas de Sí o No con la respuesta que esperas (RN-13). */
export function Paso2Preguntas({ borrador: b, onCambio }: Paso2Props) {
  const llena = b.preguntas.length >= MAX_PREGUNTAS;
  const sugeridas = preguntasPorSector(b.sector).filter(
    (s) => !b.preguntas.some((p) => p.texto === s.texto),
  );

  const agregar = (texto = '', respuestaEsperada = true) => {
    if (llena) return;
    onCambio({ preguntas: [...b.preguntas, { clave: nuevaClave(), texto, respuestaEsperada }] });
  };

  const cambiar = (clave: number, parte: Partial<BorradorVacante['preguntas'][number]>) =>
    onCambio({ preguntas: b.preguntas.map((p) => (p.clave === clave ? { ...p, ...parte } : p)) });

  return (
    <>
      <p className="text-base text-texto-2">
        Los candidatos responderán estas preguntas al postularse. Quien no cumpla se marca "No
        cumple", pero tú decides a quién avanzar.
      </p>

      {sugeridas.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm font-medium text-texto">
            Preguntas sugeridas para tu sector
          </p>
          <div className="flex flex-wrap gap-2">
            {sugeridas.map((s) => (
              <button
                key={s.texto}
                type="button"
                disabled={llena}
                onClick={() => agregar(s.texto, s.respuestaEsperada)}
                className={cn(
                  'inline-flex min-h-10 items-center gap-1.5 rounded-chip border border-borde bg-superficie px-3 text-left text-sm font-medium text-texto hover:bg-fondo',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                <Plus size={16} aria-hidden="true" />
                {s.texto}
              </button>
            ))}
          </div>
        </div>
      )}

      {b.preguntas.length === 0 ? (
        <p className="rounded-boton bg-fondo p-4 text-base text-texto-2">
          Aún no agregas preguntas. Puedes publicar sin ellas o agregar una sugerida.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {b.preguntas.map((p, i) => (
            <li key={p.clave} className="flex flex-col gap-3 rounded-boton border border-borde p-4">
              <Input
                etiqueta={`Pregunta ${i + 1}`}
                name={`pregunta-${i}`}
                placeholder="Ej. ¿Cuentas con cédula profesional vigente?"
                value={p.texto}
                onChange={(e) => cambiar(p.clave, { texto: e.target.value })}
              />
              <GrupoOpciones<'si' | 'no'>
                etiqueta="Respuesta que esperas"
                opciones={SI_NO}
                valor={p.respuestaEsperada ? 'si' : 'no'}
                onCambio={(v) => cambiar(p.clave, { respuestaEsperada: v === 'si' })}
              />
              <div>
                <Button
                  variante="fantasma"
                  icono={Trash2}
                  onClick={() =>
                    onCambio({ preguntas: b.preguntas.filter((x) => x.clave !== p.clave) })
                  }
                >
                  Quitar pregunta
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <Button variante="secundario" icono={Plus} disabled={llena} onClick={() => agregar()}>
          Agregar pregunta
        </Button>
        <p className="text-sm text-texto-2">
          {b.preguntas.length} de {MAX_PREGUNTAS}
        </p>
      </div>
    </>
  );
}
