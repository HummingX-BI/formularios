import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { cargaSimulada } from '@/lib/esperar';
import { Button, ProgressBar, ScreenHeader, Stepper, StickyAction, useToast } from '@/ui';
import { PASOS_CV, TOTAL_PASOS_CV } from './pasosCv';

interface PasoCvProps {
  /** Paso actual, de 1 a 5. */
  paso: number;
  /** Guarda lo capturado en el paso sin validar (se usa al ir atrás). */
  onGuardar: () => void;
  /** Valida y guarda; devuelve false si hay errores que corregir. */
  onSiguiente: () => boolean;
  children: ReactNode;
}

/** Marco común de los pasos del CV: título guiado, avance, botón fijo y navegación. */
export function PasoCv({ paso, onGuardar, onSiguiente, children }: PasoCvProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [cargando, setCargando] = useState(false);
  const info = PASOS_CV[paso - 1];
  const esUltimo = paso === TOTAL_PASOS_CV;

  const atras = () => {
    onGuardar();
    navigate(`/candidato/cv/paso/${paso - 1}`);
  };

  const siguiente = async (e: FormEvent) => {
    e.preventDefault();
    if (!onSiguiente()) return;
    setCargando(true);
    await cargaSimulada();
    if (esUltimo) {
      toast.exito('¡Tu CV quedó guardado!');
      navigate('/candidato/cv');
    } else {
      navigate(`/candidato/cv/paso/${paso + 1}`);
    }
  };

  return (
    <form onSubmit={(e) => void siguiente(e)} noValidate className="mx-auto max-w-2xl">
      <ScreenHeader
        titulo={`Paso ${paso} de ${TOTAL_PASOS_CV} · ${info?.nombre ?? ''}`}
        subtitulo={info?.ayuda}
      />
      <div className="mb-6 flex flex-col gap-3">
        <Stepper pasos={PASOS_CV.map((p) => p.corto)} actual={paso} />
        <ProgressBar
          valor={(paso / TOTAL_PASOS_CV) * 100}
          etiqueta="Avance de tu CV"
          mostrarPorcentaje
        />
      </div>
      <div className="flex flex-col gap-5 rounded-tarjeta bg-superficie p-4 shadow-1 md:p-6">
        {children}
      </div>
      <StickyAction>
        {paso > 1 && (
          <Button variante="secundario" icono={ArrowLeft} onClick={atras}>
            Atrás
          </Button>
        )}
        <Button
          type="submit"
          cargando={cargando}
          icono={esUltimo ? Eye : ArrowRight}
          className="flex-1 md:flex-none"
        >
          {esUltimo ? 'Ver mi CV' : 'Guardar y seguir'}
        </Button>
      </StickyAction>
    </form>
  );
}
