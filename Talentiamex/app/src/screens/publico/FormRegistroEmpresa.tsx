import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cargaSimulada } from '@/lib/esperar';
import {
  errorCelular,
  errorContrasena,
  errorCorreo,
  errorRequerido,
  formatearCelularEscribiendo,
} from '@/lib/validaciones';
import { useDemoStore } from '@/store/useDemoStore';
import type { TipoEmpresa } from '@/types';
import { Button, Checkbox, Input, Select, SelectorSector, useToast } from '@/ui';
import { useFormulario } from './useFormulario';

const TIPOS: { valor: TipoEmpresa; texto: string }[] = [
  { valor: 'pyme', texto: 'PYME' },
  { valor: 'cadena', texto: 'Cadena o franquicia' },
  { valor: 'hospital', texto: 'Hospital o clínica' },
  { valor: 'escuela', texto: 'Escuela' },
];

const INICIAL = {
  nombre: '',
  sector: '',
  tipo: '',
  contacto: '',
  celular: '',
  correo: '',
  contrasena: '',
  aviso: false,
};

/** Registro de empresa (HU-1.2). Al terminar lleva a elegir plan (P09). */
export function FormRegistroEmpresa() {
  const navigate = useNavigate();
  const toast = useToast();
  const [cargando, setCargando] = useState(false);
  const f = useFormulario(INICIAL, (v) => ({
    nombre: errorRequerido(v.nombre, 'el nombre de tu negocio'),
    sector: v.sector ? undefined : 'Elige el sector de tu negocio',
    tipo: v.tipo ? undefined : 'Elige el tipo de negocio',
    contacto: errorRequerido(v.contacto, 'el nombre de la persona de contacto'),
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
      tienda.empresas.some((x) => x.correo.toLowerCase() === f.valores.correo.trim().toLowerCase())
    ) {
      f.forzarError('correo', 'Ya hay una cuenta con este correo. Entra con tu contraseña.');
      return;
    }
    setCargando(true);
    await cargaSimulada();
    tienda.registrarEmpresa({
      nombre: f.valores.nombre.trim(),
      sector: f.valores.sector,
      tipo: TIPOS.find((t) => t.valor === f.valores.tipo)?.valor ?? 'pyme',
      contacto: f.valores.contacto.trim(),
      celular: f.valores.celular,
      correo: f.valores.correo.trim(),
    });
    toast.exito('¡Listo! La cuenta de tu empresa está creada');
    navigate('/empresa/planes');
  };

  return (
    <form onSubmit={(e) => void enviar(e)} noValidate className="grid gap-4 md:grid-cols-2">
      <Input
        etiqueta="Nombre del negocio"
        name="nombre"
        autoComplete="organization"
        className="md:col-span-1"
        value={f.valores.nombre}
        onChange={(e) => f.cambiar('nombre', e.target.value)}
        onBlur={() => f.tocar('nombre')}
        error={f.error('nombre')}
      />
      <Select
        etiqueta="Tipo de negocio"
        name="tipo"
        placeholder="Elige una opción"
        opciones={TIPOS.map((t) => ({ valor: t.valor, texto: t.texto }))}
        value={f.valores.tipo}
        onChange={(e) => f.cambiar('tipo', e.target.value)}
        onBlur={() => f.tocar('tipo')}
        error={f.error('tipo')}
      />
      <div className="md:col-span-2">
        <SelectorSector
          etiqueta="Sector"
          valor={f.valores.sector}
          onCambio={(s) => {
            f.cambiar('sector', s);
            f.tocar('sector');
          }}
          error={f.error('sector')}
        />
      </div>
      <Input
        etiqueta="Nombre de la persona de contacto"
        name="contacto"
        autoComplete="name"
        value={f.valores.contacto}
        onChange={(e) => f.cambiar('contacto', e.target.value)}
        onBlur={() => f.tocar('contacto')}
        error={f.error('contacto')}
      />
      <Input
        etiqueta="Celular"
        name="celular"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="55 1234 5678"
        ayuda="10 dígitos. Aquí te avisamos de nuevos postulantes."
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
      <div className="md:col-span-2">
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
      <div className="md:col-span-2">
        <Button type="submit" cargando={cargando} icono={ArrowRight} anchoCompleto>
          Crear mi cuenta
        </Button>
      </div>
    </form>
  );
}
