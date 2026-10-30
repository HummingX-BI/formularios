// P04 · HU-2.3, HU-2.5
import { AlertTriangle, CheckCircle2, Download, Pencil, Search } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { PRECIO_CV } from '@/data/config';
import { Miniatura } from '@/cv/Miniatura';
import { INFO_PLANTILLAS } from '@/cv/plantillas';
import { VistaPrevia } from '@/cv/VistaPrevia';
import { cn } from '@/lib/cn';
import { monedaCorta } from '@/lib/formato';
import { cvFaltantes } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, Card, ScreenHeader, StickyAction, Toggle, useToast } from '@/ui';

export default function P04Plantillas() {
  const toast = useToast();
  const candidato = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined,
  );
  const sector = useDemoStore((s) => s.sectores.find((x) => x.id === candidato?.sector));
  const elegirPlantilla = useDemoStore((s) => s.elegirPlantilla);
  const alternarPerfilVisible = useDemoStore((s) => s.alternarPerfilVisible);

  if (!candidato) return <Navigate to="/entrar" replace />;

  const faltantes = cvFaltantes(candidato);
  const completo = faltantes.length === 0;

  const cambiarVisibilidad = () => {
    alternarPerfilVisible();
    toast.info(candidato.perfilVisible ? 'Tu perfil quedó oculto' : 'Tu perfil ahora es visible');
  };

  return (
    <div>
      <ScreenHeader titulo="¡Tu CV está listo!" subtitulo="Elige el diseño que más te guste" />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <section aria-label="Plantillas">
            <div role="radiogroup" aria-label="Diseño del CV" className="grid grid-cols-3 gap-2">
              {INFO_PLANTILLAS.map((p) => {
                const activa = candidato.plantilla === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={activa}
                    aria-label={`${p.nombre}: ${p.descripcion}`}
                    onClick={() => elegirPlantilla(p.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-boton border-2 p-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca',
                      activa
                        ? 'border-marca bg-marca-suave'
                        : 'border-transparent bg-superficie hover:bg-fondo',
                    )}
                  >
                    <Miniatura candidato={candidato} plantilla={p.id} ancho={92} />
                    <span className="text-sm font-semibold text-texto">{p.nombre}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-texto-2">
              {INFO_PLANTILLAS.find((p) => p.id === candidato.plantilla)?.descripcion}
            </p>
          </section>

          <Card>
            <Toggle
              activo={candidato.perfilVisible}
              onCambio={cambiarVisibilidad}
              etiqueta={`Tu perfil es visible para empresas de ${sector?.nombre ?? 'tu sector'}`}
              ayuda="Así te pueden encontrar aunque no te postules."
            />
          </Card>

          {completo ? (
            <p className="flex items-center gap-2 rounded-boton bg-accion-suave p-3 text-base font-medium text-accion-hover">
              <CheckCircle2 size={22} aria-hidden="true" />
              Tu CV está completo
            </p>
          ) : (
            <div role="status" className="rounded-boton bg-alerta-suave p-3 text-alerta">
              <p className="flex items-center gap-2 text-base font-semibold">
                <AlertTriangle size={22} aria-hidden="true" />
                Tu CV aún no está completo
              </p>
              <p className="mt-1 text-sm">Te falta:</p>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {faltantes.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button variante="secundario" icono={Pencil} to="/candidato/cv/paso/1" anchoCompleto>
              Editar CV
            </Button>
            <Button variante="fantasma" icono={Search} to="/candidato/vacantes" anchoCompleto>
              Buscar vacantes
            </Button>
          </div>
        </div>

        <VistaPrevia candidato={candidato} plantilla={candidato.plantilla} />
      </div>

      <StickyAction>
        {completo ? (
          <Button icono={Download} to="/candidato/cv/pagar" className="flex-1 md:flex-none">
            Descargar PDF · {monedaCorta(PRECIO_CV)}
          </Button>
        ) : (
          <Button icono={Pencil} to="/candidato/cv/paso/1" className="flex-1 md:flex-none">
            Completar mi CV
          </Button>
        )}
      </StickyAction>
      {!completo && (
        <p className="mt-2 text-sm text-texto-2 md:text-right">
          Completa tu CV para poder descargarlo.{' '}
          <Link to="/candidato/cv/paso/1" className="font-semibold text-marca">
            Ir al paso 1
          </Link>
        </p>
      )}
    </div>
  );
}
