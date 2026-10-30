import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cargaSimulada } from '@/lib/esperar';
import {
  errorContrasena,
  errorCelular,
  errorCorreo,
  errorRequerido,
  formatearCelularEscribiendo,
} from '@/lib/validaciones';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, Checkbox, Input, useToast } from '@/ui';
import { useFormulario } from './useFormulario';

const INICIAL = { nombre: '', celular: '', correo: '', contrasena: '', aviso: false };

/** Registro de candidato (HU-1.1). Al terminar lleva al paso 1 del CV (P03). */
export function FormRegistroCandidato() {
  const navigate = useNavigate();
  const toast = useToast();
  const [cargando, setCargando] = useState(false);
  const f = useFormulario(INICIAL, (v) => ({
    nombre: errorRequerido(v.nombre, 'tu nombre'),
    celular: errorCelular(v.celular),
    correo: errorCorreo(v.correo),
    contrasena: errorContrasena(v.contrasena),
    aviso: v.aviso ? undefined : 'Acepta el aviso de privacidad para continuar',
  }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.validarEnvio()) return;
    const tienda = useDemoStore.getState();
    if (
      tienda.candidatos.some(
        (c) => c.correo.toLowerCase() === f.valores.correo.trim().toLowerCase(),
      )
    ) {
      f.forzarError('correo', 'Ya hay una cuenta con este correo. Entra con tu contraseña.');
      return;
    }
    setCargando(true);
    await cargaSimulada();
    tienda.registrarCandidato({
      nombre: f.valores.nombre.trim(),
      celular: f.valores.celular,
      correo: f.valores.correo.trim(),
    });
    toast.exito('¡Listo! Tu cuenta está creada');
    navigate('/candidato/cv/paso/1');
  };

  return (
    <form onSubmit={(e) => void enviar(e)} noValidate className="flex flex-col gap-4">
      <Input
        etiqueta="Nombre completo"
        name="nombre"
        autoComplete="name"
        value={f.valores.nombre}
        onChange={(e) => f.cambiar('nombre', e.target.value)}
        onBlur={() => f.tocar('nombre')}
        error={f.error('nombre')}
      />
      <Input
        etiqueta="Celular"
        name="celular"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="55 1234 5678"
        ayuda="10 dígitos. Aquí te avisamos de nuevas vacantes."
        value={f.valores.celular}
        onChange={(e) => f.cambiar('celular', formatearCelularEscribiendo(e.target.value))}
        onBlur={() => f.tocar('celular')}
        error={f.error('celular')}
      />
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
        autoComplete="new-password"
        ayuda="Al menos 6 caracteres"
        value={f.valores.contrasena}
        onChange={(e) => f.cambiar('contrasena', e.target.value)}
        onBlur={() => f.tocar('contrasena')}
        error={f.error('contrasena')}
      />
      <div>
        <Checkbox
          etiqueta="Acepto el aviso de privacidad"
          name="aviso"
          checked={f.valores.aviso}
          onChange={(e) => f.cambiar('aviso', e.target.checked)}
          onBlur={() => f.tocar('aviso')}
        />
        {f.error('aviso') && (
          <p role="alert" className="text-sm font-medium text-error">
            {f.error('aviso')}
          </p>
        )}
      </div>
      <Button type="submit" cargando={cargando} icono={ArrowRight} anchoCompleto>
        Crear mi cuenta
      </Button>
    </form>
  );
}
