// P05 · HU-2.4 · modal sobre P04 (/candidato/cv/pagar)
import { useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { PRECIO_CV } from '@/data/config';
import { nombreArchivoCv } from '@/cv/exportarPdf';
import { INFO_PLANTILLAS } from '@/cv/plantillas';
import { useDescargarCv } from '@/cv/useDescargarCv';
import { cvCompleto } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, ModalPago } from '@/ui';
import P04Plantillas from './P04Plantillas';

export default function P05Pago() {
  const navigate = useNavigate();
  const candidato = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined,
  );
  const marcarCvPagado = useDemoStore((s) => s.marcarCvPagado);
  const { descargar, descargando } = useDescargarCv();
  // Si el CV ya estaba pagado al abrir el modal, no hay nada que cobrar.
  const yaPagado = useRef(candidato?.cvPagado ?? false);

  if (!candidato) return <Navigate to="/entrar" replace />;
  if (!cvCompleto(candidato) || yaPagado.current) return <Navigate to="/candidato/cv" replace />;

  const cerrar = () => navigate('/candidato/cv');
  const plantilla = INFO_PLANTILLAS.find((p) => p.id === candidato.plantilla)?.nombre ?? '';

  return (
    <>
      <P04Plantillas />
      <ModalPago
        titulo="Descarga tu CV"
        intro="Pago único, descárgalo las veces que quieras."
        resumen={[{ etiqueta: 'Plantilla', valor: plantilla }]}
        monto={PRECIO_CV}
        concepto="CV en PDF"
        onCerrar={cerrar}
        onAprobado={() => {
          marcarCvPagado();
          void descargar(candidato);
        }}
        exito={{
          titulo: 'Descarga tu CV',
          contenido: (
            <>
              <p className="text-base text-texto-2">
                {descargando
                  ? 'Estamos preparando tu PDF…'
                  : `Tu CV se descargó como ${nombreArchivoCv(candidato.nombre)}.`}
              </p>
              <p className="text-sm text-texto-2">
                Puedes descargarlo otra vez cuando quieras, sin costo.
              </p>
            </>
          ),
          pie: (
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
          ),
        }}
      />
    </>
  );
}
