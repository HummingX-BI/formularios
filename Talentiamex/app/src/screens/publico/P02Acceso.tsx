// P02 · HU-1.1, HU-1.2, HU-1.3
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { Card, ScreenHeader } from '@/ui';
import { FormEntrar } from './FormEntrar';
import { FormRegistroCandidato } from './FormRegistroCandidato';
import { FormRegistroEmpresa } from './FormRegistroEmpresa';

export type ModoAcceso = 'candidato' | 'empresa' | 'entrar';

const PESTAÑAS: { modo: 'candidato' | 'empresa'; to: string; texto: string }[] = [
  { modo: 'candidato', to: '/registro/candidato', texto: 'Candidato' },
  { modo: 'empresa', to: '/registro/empresa', texto: 'Empresa' },
];

export default function P02Acceso({ modo }: { modo: ModoAcceso }) {
  const [admin, setAdmin] = useState(false);

  if (modo === 'entrar') {
    return (
      <div className="mx-auto max-w-md">
        <ScreenHeader
          titulo={admin ? 'Acceso administrador' : 'Entra a tu cuenta'}
          subtitulo={admin ? 'Entra al tablero del piloto' : 'Usa tu correo y contraseña'}
        />
        <Card>
          <FormEntrar key={admin ? 'admin' : 'normal'} admin={admin} />
        </Card>
        <p className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setAdmin((v) => !v)}
            className="rounded text-sm text-texto-2 hover:text-marca hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
          >
            {admin ? 'Volver al acceso normal' : 'Acceso administrador'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className={cn('mx-auto', modo === 'empresa' ? 'max-w-2xl' : 'max-w-md')}>
      <ScreenHeader titulo="Crea tu cuenta" subtitulo="Te toma menos de un minuto" />
      <div
        role="tablist"
        aria-label="Tipo de cuenta"
        className="mb-4 grid grid-cols-2 gap-1 rounded-boton bg-borde p-1"
      >
        {PESTAÑAS.map((p) => (
          <Link
            key={p.modo}
            to={p.to}
            role="tab"
            aria-selected={modo === p.modo}
            className={cn(
              'flex min-h-11 items-center justify-center rounded-boton text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
              modo === p.modo
                ? 'bg-superficie text-marca shadow-1'
                : 'text-texto-2 hover:text-texto',
            )}
          >
            {p.texto}
          </Link>
        ))}
      </div>
      <Card>{modo === 'empresa' ? <FormRegistroEmpresa /> : <FormRegistroCandidato />}</Card>
      <p className="mt-4 text-center text-base text-texto-2">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/entrar"
          className="rounded font-semibold text-marca hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
        >
          Entra aquí
        </Link>
      </p>
    </div>
  );
}
