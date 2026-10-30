import { useState, type FormEvent, type ReactNode } from 'react';
import { CreditCard, Lock, Wallet } from 'lucide-react';
import { monedaCorta } from '@/lib/formato';
import {
  errorCvv,
  errorTarjeta,
  errorVencimiento,
  formatearTarjeta,
  formatearVencimiento,
} from '@/lib/validaciones';
import { pagar } from '@/sim/pagos';
import { Button } from './Button';
import { CheckAnimado } from './CheckAnimado';
import { Input } from './Input';
import { Modal } from './Modal';

interface ModalPagoProps {
  titulo: string;
  /** Frase corta bajo el título que explica el cobro. */
  intro: string;
  /** Líneas del resumen (plantilla, plan, periodo…). */
  resumen: { etiqueta: string; valor: string }[];
  monto: number;
  /** Texto que queda registrado como ingreso en el tablero. */
  concepto: string;
  onCerrar: () => void;
  /** Se llama una vez que el pago se aprueba. */
  onAprobado: () => void;
  /** Pantalla de éxito: título, contenido y botones (los que ofrece cada flujo). */
  exito: { titulo: string; contenido: ReactNode; pie: ReactNode };
}

/** Pago simulado con tarjeta (o botón de pasarela). Sin marcas reales (RNF-06). */
export function ModalPago({
  titulo,
  intro,
  resumen,
  monto,
  concepto,
  onCerrar,
  onAprobado,
  exito,
}: ModalPagoProps) {
  const [aprobado, setAprobado] = useState(false);
  const [tarjeta, setTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [intento, setIntento] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | undefined>();

  const errores = {
    tarjeta: errorTarjeta(tarjeta),
    vencimiento: errorVencimiento(vencimiento),
    cvv: errorCvv(cvv),
  };
  const ver = (campo: keyof typeof errores) => (intento ? errores[campo] : undefined);

  const cobrar = async (numero: string) => {
    setProcesando(true);
    setErrorPago(undefined);
    const r = await pagar(monto, concepto, numero);
    setProcesando(false);
    if (!r.ok) {
      setErrorPago(r.error);
      return;
    }
    setAprobado(true);
    onAprobado();
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setIntento(true);
    if (Object.values(errores).some(Boolean)) return;
    void cobrar(tarjeta);
  };

  return (
    <Modal
      abierto
      onCerrar={() => !procesando && onCerrar()}
      titulo={aprobado ? exito.titulo : titulo}
      pie={
        aprobado ? (
          exito.pie
        ) : (
          <Button
            type="submit"
            form="form-pago"
            icono={Lock}
            cargando={procesando}
            className="w-full md:w-auto"
          >
            {procesando ? 'Procesando…' : `Pagar ${monedaCorta(monto)}`}
          </Button>
        )
      }
    >
      {aprobado ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckAnimado />
          <h3 className="font-titulo text-xl font-bold text-texto">¡Pago aprobado!</h3>
          {exito.contenido}
        </div>
      ) : (
        <form id="form-pago" onSubmit={enviar} noValidate className="flex flex-col gap-4">
          <p className="text-base text-texto-2">{intro}</p>

          <dl className="rounded-boton bg-fondo p-3 text-base">
            {resumen.map((r) => (
              <div key={r.etiqueta} className="flex justify-between gap-4 py-0.5">
                <dt className="text-texto-2">{r.etiqueta}</dt>
                <dd className="text-right font-medium text-texto">{r.valor}</dd>
              </div>
            ))}
            <div className="mt-1 flex justify-between gap-4 border-t border-borde pt-1.5">
              <dt className="text-texto-2">Total</dt>
              <dd className="font-titulo font-bold text-texto">{monedaCorta(monto)} MXN</dd>
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
      )}
    </Modal>
  );
}
