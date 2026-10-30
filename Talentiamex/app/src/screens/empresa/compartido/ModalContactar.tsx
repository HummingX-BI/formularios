import { useState } from 'react';
import { Send } from 'lucide-react';
import { cargaSimulada } from '@/lib/esperar';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato, Empresa, Vacante } from '@/types';
import { Button, Modal, Textarea, useToast } from '@/ui';

function mensajeInicial(candidato: Candidato, empresa: Empresa, vacante?: Vacante): string {
  const primerNombre = candidato.nombre.split(' ')[0] ?? candidato.nombre;
  const tema = vacante ? `la vacante de ${vacante.puesto}` : 'una oportunidad de trabajo';
  return `Hola, ${primerNombre}. Soy ${empresa.contacto} de ${empresa.nombre}. Vimos tu perfil en Talentiamex y nos interesa platicar contigo sobre ${tema}. ¿Te late que hablemos?`;
}

interface ModalContactarProps {
  candidato: Candidato | undefined;
  /** Si se conoce la vacante, el mensaje la menciona. */
  vacante?: Vacante | undefined;
  onCerrar: () => void;
}

/** Contactar a un candidato con un mensaje prellenado (WhatsApp simulado). Se usa en P12 y P13. */
export function ModalContactar({ candidato, vacante, onCerrar }: ModalContactarProps) {
  const empresa = useDemoStore((s) =>
    s.sesion?.rol === 'empresa' ? s.empresas.find((e) => e.id === s.sesion?.id) : undefined,
  );
  if (!candidato || !empresa) return null;
  // La clave reinicia el texto cuando se contacta a otra persona.
  return (
    <Formulario
      key={candidato.id}
      candidato={candidato}
      empresa={empresa}
      vacante={vacante}
      onCerrar={onCerrar}
    />
  );
}

function Formulario({
  candidato,
  empresa,
  vacante,
  onCerrar,
}: {
  candidato: Candidato;
  empresa: Empresa;
  vacante: Vacante | undefined;
  onCerrar: () => void;
}) {
  const toast = useToast();
  const [texto, setTexto] = useState(() => mensajeInicial(candidato, empresa, vacante));
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    setEnviando(true);
    await cargaSimulada();
    setEnviando(false);
    toast.exito(`Mensaje enviado a ${candidato.nombre} por WhatsApp`);
    onCerrar();
  };

  return (
    <Modal
      abierto
      onCerrar={() => !enviando && onCerrar()}
      titulo={`Contactar a ${candidato.nombre}`}
      pie={
        <Button
          icono={Send}
          cargando={enviando}
          onClick={() => void enviar()}
          className="w-full md:w-auto"
        >
          Enviar por WhatsApp
        </Button>
      }
    >
      <p className="mb-3 text-base text-texto-2">
        Para: <strong className="text-texto">{candidato.nombre}</strong> · {candidato.celular}
      </p>
      <Textarea
        etiqueta="Mensaje"
        name="mensaje"
        rows={6}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        ayuda="Puedes editarlo antes de enviarlo."
      />
    </Modal>
  );
}
