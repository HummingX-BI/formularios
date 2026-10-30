import { useState } from 'react';
import { ZONAS } from '@/data/zonas';
import {
  errorCelular,
  errorCorreo,
  errorRequerido,
  formatearCelularEscribiendo,
} from '@/lib/validaciones';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato } from '@/types';
import { FotoCircular, Input, Select } from '@/ui';
import { PasoCv } from './PasoCv';

/** P03 · paso 1: datos personales, zona y foto opcional. */
export function Paso1Datos({ candidato }: { candidato: Candidato }) {
  const guardar = useDemoStore((s) => s.guardarPasoCv);
  const quitarFotoCv = useDemoStore((s) => s.quitarFotoCv);
  const [nombre, setNombre] = useState(candidato.nombre);
  const [celular, setCelular] = useState(candidato.celular);
  const [correo, setCorreo] = useState(candidato.correo);
  const [zona, setZona] = useState(candidato.zona);
  const [fotoUrl, setFotoUrl] = useState(candidato.fotoUrl);
  const [intento, setIntento] = useState(false);

  const errores = {
    nombre: errorRequerido(nombre, 'tu nombre'),
    celular: errorCelular(celular),
    correo: errorCorreo(correo),
    zona: zona ? undefined : 'Elige tu alcaldía o municipio',
  };
  const ver = (campo: keyof typeof errores) => (intento ? errores[campo] : undefined);

  const datos = (): Partial<Candidato> => ({
    nombre: nombre.trim(),
    celular,
    correo: correo.trim(),
    zona,
    ...(fotoUrl ? { fotoUrl } : {}),
  });

  const guardarPaso = () => {
    guardar(1, datos());
    if (!fotoUrl && candidato.fotoUrl) quitarFotoCv();
  };

  return (
    <PasoCv
      paso={1}
      onGuardar={guardarPaso}
      onSiguiente={() => {
        setIntento(true);
        if (Object.values(errores).some(Boolean)) return false;
        guardarPaso();
        return true;
      }}
    >
      <Input
        etiqueta="Nombre completo"
        name="nombre"
        autoComplete="name"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={ver('nombre')}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          etiqueta="Celular"
          name="celular"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={celular}
          onChange={(e) => setCelular(formatearCelularEscribiendo(e.target.value))}
          error={ver('celular')}
        />
        <Input
          etiqueta="Correo"
          name="correo"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          error={ver('correo')}
        />
      </div>
      <Select
        etiqueta="Alcaldía o municipio"
        name="zona"
        placeholder="Elige una opción"
        opciones={ZONAS.map((z) => ({ valor: z, texto: z }))}
        value={zona}
        onChange={(e) => setZona(e.target.value)}
        error={ver('zona')}
      />
      <FotoCircular valor={fotoUrl} onCambio={setFotoUrl} nombre={nombre} />
    </PasoCv>
  );
}
