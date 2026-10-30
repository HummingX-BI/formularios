import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { Button } from './Button';

const LADO = 256;
const MAX_BYTES = 5 * 1024 * 1024;

interface FotoCircularProps {
  /** Foto actual como imagen en base64. */
  valor: string | undefined;
  onCambio: (foto: string | undefined) => void;
  nombre: string;
}

/** Foto opcional con recorte circular: se sube una imagen local y se ajusta con el zoom. */
export function FotoCircular({ valor, onCambio, nombre }: FotoCircularProps) {
  const entrada = useRef<HTMLInputElement>(null);
  const [origen, setOrigen] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!origen) return;
    const lienzo = document.createElement('canvas');
    lienzo.width = LADO;
    lienzo.height = LADO;
    const ctx = lienzo.getContext('2d');
    if (!ctx) return;
    const escala = (LADO / Math.min(origen.width, origen.height)) * zoom;
    const ancho = origen.width * escala;
    const alto = origen.height * escala;
    ctx.beginPath();
    ctx.arc(LADO / 2, LADO / 2, LADO / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, LADO, LADO);
    ctx.drawImage(origen, (LADO - ancho) / 2, (LADO - alto) / 2, ancho, alto);
    onCambio(lienzo.toDataURL('image/jpeg', 0.85));
    // onCambio cambia en cada render del padre; solo importa la imagen y el zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origen, zoom]);

  const elegir = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      setError('Elige una imagen (JPG o PNG)');
      return;
    }
    if (archivo.size > MAX_BYTES) {
      setError('La imagen pesa más de 5 MB. Prueba con otra');
      return;
    }
    setError(undefined);
    const lector = new FileReader();
    lector.onload = () => {
      const imagen = new Image();
      imagen.onload = () => {
        setZoom(1);
        setOrigen(imagen);
      };
      if (typeof lector.result === 'string') imagen.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  };

  const quitar = () => {
    setOrigen(null);
    setZoom(1);
    onCambio(undefined);
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-texto">Foto (opcional)</p>
      <div className="flex items-center gap-4">
        {valor ? (
          <img
            src={valor}
            alt={`Foto de ${nombre}`}
            className="h-24 w-24 shrink-0 rounded-chip object-cover shadow-1"
          />
        ) : (
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-chip bg-marca-suave text-marca">
            <Camera size={32} aria-hidden="true" />
          </span>
        )}
        <div className="flex flex-col items-start gap-2">
          <input
            ref={entrada}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Subir foto"
            onChange={elegir}
          />
          <div className="flex flex-wrap gap-2">
            <Button variante="secundario" icono={Camera} onClick={() => entrada.current?.click()}>
              {valor ? 'Cambiar foto' : 'Subir foto'}
            </Button>
            {valor && (
              <Button variante="fantasma" icono={Trash2} onClick={quitar}>
                Quitar
              </Button>
            )}
          </div>
          {!valor && <p className="text-sm text-texto-2">Puedes omitirla y agregarla después.</p>}
        </div>
      </div>
      {origen && valor && (
        <label className="mt-3 flex max-w-xs flex-col gap-1 text-sm font-medium text-texto">
          Acercar
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="accent-accion"
          />
        </label>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
