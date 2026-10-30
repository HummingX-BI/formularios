// P05 · HU-2.4 · modal sobre P04 (/candidato/cv/pagar)
import { useRef, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CreditCard, Download, Lock, Wallet } from 'lucide-react';
import { PRECIO_CV } from '@/data/config';
import { INFO_PLANTILLAS } from '@/cv/plantillas';
import { nombreArchivoCv } from '@/cv/exportarPdf';
import { useDescargarCv } from '@/cv/useDescargarCv';
import {
  errorCvv,
  errorTarjeta,
  errorVencimiento,
  formatearTarjeta,
  formatearVencimiento,
} from '@/lib/validaciones';
import { monedaCorta } from '@/lib/formato';
import { pagar } from '@/sim/pagos';
import { cvCompleto } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, CheckAnimado, Input, Modal } from '@/ui';
import P04Plantillas from './P04Plantillas';

type Fase = 'datos' | 'exito';

export default function P05Pago() {
  const navigate = useNavigate();
  const candidato = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined,
  );
  const marcarCvPagado = useDemoStore((s) => s.marcarCvPagado);
  const { descargar, descargando } = useDescargarCv();

  const [fase, setFase] = useState<Fase>('datos');
  // Si el CV ya estaba pagado al abrir el modal, no hay nada que cobrar.
  const yaPagado = useRef(candidato?.cvPagado ?? false);
  const [tarjeta, setTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [intento, setIntento] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | undefined>();

  if (!candidato) return <Navigate to="/entrar" replace />;
  if (fase === 'datos' && (!cvCompleto(candidato) || yaPagado.current)) {
    return <Navigate to="/candidato/cv" replace />;
  }

  const cerrar = () => {
    if (!procesando) navigate('/candidato/cv');
  };

  const errores = {
    tarjeta: errorTarjeta(tarjeta),
    vencimiento: errorVencimiento(vencimiento),
    cvv: errorCvv(cvv),
  };
  const ver = (campo: keyof typeof errores) => (intento ? errores[campo] : undefined);

  const cobrar = async (numero: string) => {
    setProcesando(true);
    setErrorPago(undefined);
    const r = await pagar(PRECIO_CV, 'CV en PDF', numero);
    if (!r.ok) {
      setProcesando(false);
      setErrorPago(r.error);
      return;
    }
    marcarCvPagado();
    setProcesando(false);
    setFase('exito');
    await descargar(candidato);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setIntento(true);
    if (Object.values(errores).some(Boolean)) return;
    void cobrar(tarjeta);
  };

  const plantilla = INFO_PLANTILLAS.find((p) => p.id === candidato.plantilla)?.nombre ?? '';

  return (
    <>
      <P04Plantillas />
      <Modal
        abierto
        onCerrar={cerrar}
        titulo="Descarga tu CV"
        pie={
          fase === 'datos' ? (
            <Button
              type="submit"
              form="form-pago"
              icono={Lock}
              cargando={procesando}
              className="w-full md:w-auto"
            >
              {procesando ? 'Procesando…' : `Pagar ${monedaCorta(PRECIO_CV)}`}
            </Button>
          ) : (
            <>
              <Button
                variante="secundario"
                icono={Download}
                cargando={descargando}
                onClick={() => void descargar(candidato)}
              >
                Descargar de nuevo
              </Button>
              <Button onClick={cerrar}>Volver a mi CV</Button>
            </>
          )
        }
      >
        {fase === 'datos' ? (
          <form id="form-pago" onSubmit={enviar} noValidate className="flex flex-col gap-4">
            <p className="text-base text-texto-2">Pago único, descárgalo las veces que quieras.</p>

            <dl className="rounded-boton bg-fondo p-3 text-base">
              <div className="flex justify-between">
                <dt className="text-texto-2">Plantilla</dt>
                <dd className="font-medium text-texto">{plantilla}</dd>
              </div>
              <div className="mt-1 flex justify-between">
                <dt className="text-texto-2">Total</dt>
                <dd className="font-titulo font-bold text-texto">{monedaCorta(PRECIO_CV)} MXN</dd>
              </div>
            </dl>

            <Input
              etiqueta="Número de tarjeta"
              name="tarjeta"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={tarjeta}
              onChange={(e) => setTarjeta(formatearTarjeta(e.target.value))}
              error={ver('tarjeta')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                etiqueta="Vencimiento"
                name="vencimiento"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                value={vencimiento}
                onChange={(e) => setVencimiento(formatearVencimiento(e.target.value))}
                error={ver('vencimiento')}
              />
              <Input
                etiqueta="Código (CVV)"
                name="cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                error={ver('cvv')}
              />
            </div>

            {errorPago && (
              <p
                role="alert"
                className="rounded-boton bg-error-suave p-3 text-base font-medium text-error"
              >
                {errorPago}
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-texto-2">
              <span className="h-px flex-1 bg-borde" />o<span className="h-px flex-1 bg-borde" />
            </div>
            <Button
              variante="secundario"
              icono={Wallet}
              disabled={procesando}
              onClick={() => void cobrar('')}
              anchoCompleto
            >
              Pagar con mi cuenta de pago
            </Button>

            <p className="flex items-center gap-2 text-sm text-texto-2">
              <CreditCard size={16} aria-hidden="true" />
              Pago seguro procesado por la pasarela.
            </p>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckAnimado />
            <h3 className="font-titulo text-xl font-bold text-texto">¡Pago aprobado!</h3>
            <p className="text-base text-texto-2">
              {descargando
                ? 'Estamos preparando tu PDF…'
                : `Tu CV se descargó como ${nombreArchivoCv(candidato.nombre)}.`}
            </p>
            <p className="text-sm text-texto-2">
              Puedes descargarlo otra vez cuando quieras, sin costo.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
