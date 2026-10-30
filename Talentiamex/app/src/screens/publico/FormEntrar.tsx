import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { entrar } from '@/sim/auth';
import { errorContrasena, errorCorreo } from '@/lib/validaciones';
import { Button, Input, useToast } from '@/ui';
import { useFormulario } from './useFormulario';

const INICIAL = { correo: '', contrasena: '' };

const INICIO: Record<'candidato' | 'empresa' | 'admin', string> = {
  candidato: '/candidato/vacantes',
  empresa: '/empresa',
  admin: '/admin',
};

/** Inicio de sesión (HU-1.3). Con `admin` entra al tablero del piloto. */
export function FormEntrar({ admin }: { admin: boolean }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [cargando, setCargando] = useState(false);
  const f = useFormulario(INICIAL, (v) => ({
    correo: errorCorreo(v.correo),
    contrasena: errorContrasena(v.contrasena),
  }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.validarEnvio()) return;
    setCargando(true);
    const r = await entrar(f.valores.correo, f.valores.contrasena, admin ? 'admin' : undefined);
    setCargando(false);
    if (!r.ok) return;
    toast.exito('¡Bienvenido de vuelta!');
    navigate(INICIO[r.sesion.rol]);
  };

  return (
    <form onSubmit={(e) => void enviar(e)} noValidate className="flex flex-col gap-4">
      <Input
        etiqueta="Correo"
        name="correo"
        type="email"
        autoComplete="email"
        value={f.valores.correo}
        onChange={(e) => f.cambiar('correo', e.target.value)}
        onBlur={() => f.tocar('correo')}
        error={f.error('correo')}
      />
      <Input
        etiqueta="Contraseña"
        name="contrasena"
        type="password"
        autoComplete="current-password"
        value={f.valores.contrasena}
        onChange={(e) => f.cambiar('contrasena', e.target.value)}
        onBlur={() => f.tocar('contrasena')}
        error={f.error('contrasena')}
      />
      <button
        type="button"
        onClick={() => toast.info('Te enviamos un enlace a tu correo')}
        className="self-start rounded text-sm font-medium text-marca hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
      >
        ¿Olvidaste tu contraseña?
      </button>
      <Button type="submit" cargando={cargando} icono={ArrowRight} anchoCompleto>
        Entrar
      </Button>
      {!admin && (
        <p className="text-center text-base text-texto-2">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/registro/candidato"
            className="rounded font-semibold text-marca hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
          >
            Créala aquí
          </Link>
        </p>
      )}
    </form>
  );
}
