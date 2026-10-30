import { CLINICA, HEADHUNTING_GUION, MARIANA, VACANTE_GUION } from '@/data/personajes';

/** Milisegundos entre cada carácter que se "escribe". */
const PAUSA_CARACTER = 15;
const PAUSA_ENTRE_CAMPOS = 120;
const ESPERA_MAXIMA = 2500;

const TARJETA_DE_PRUEBA = { tarjeta: '4242424242424242', vencimiento: '1228', cvv: '123' };

type Campo = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface ResultadoAutollenado {
  ok: boolean;
  mensaje: string;
}

const pausa = (ms: number) =>
  new Promise<void>((resolver) => {
    setTimeout(resolver, ms);
  });

/** La app visible: el iframe de vista celular si está abierto, o la ventana actual. */
function ventanaObjetivo(): Window {
  const marco = document.querySelector<HTMLIFrameElement>('iframe[data-vista-celular]');
  return marco?.contentWindow ?? window;
}

async function esperarElemento<T extends Element>(
  doc: Document,
  selector: string,
): Promise<T | null> {
  const limite = Date.now() + ESPERA_MAXIMA;
  while (Date.now() < limite) {
    const el = doc.querySelector<T>(selector);
    if (el) return el;
    await pausa(50);
  }
  return null;
}

/** Cambia el valor como lo haría el teclado, para que React se entere. */
function asignarValor(el: Campo, valor: string): void {
  const ventana = el.ownerDocument.defaultView;
  if (!ventana) return;
  const proto =
    el.tagName === 'TEXTAREA'
      ? ventana.HTMLTextAreaElement.prototype
      : el.tagName === 'SELECT'
        ? ventana.HTMLSelectElement.prototype
        : ventana.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, valor);
  el.dispatchEvent(
    new ventana.Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }),
  );
}

/** Escribe un texto en un campo, carácter por carácter. */
async function escribir(doc: Document, nombre: string, texto: string): Promise<void> {
  const el = await esperarElemento<Campo>(doc, `[name="${nombre}"]`);
  if (!el) return;
  el.scrollIntoView({ block: 'center' });
  if (
    el.tagName === 'SELECT' ||
    (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'month')
  ) {
    asignarValor(el, texto);
  } else {
    el.focus();
    asignarValor(el, '');
    for (let i = 1; i <= texto.length; i++) {
      asignarValor(el, texto.slice(0, i));
      await pausa(PAUSA_CARACTER);
    }
  }
  await pausa(PAUSA_ENTRE_CAMPOS);
}

async function marcar(doc: Document, nombre: string): Promise<void> {
  const el = await esperarElemento<HTMLInputElement>(doc, `[name="${nombre}"]`);
  if (el && !el.checked) el.click();
  await pausa(PAUSA_ENTRE_CAMPOS);
}

/** Toca el botón (opción, chip o botón) que tenga ese texto. */
async function tocar(
  doc: Document,
  selector: string,
  texto: string,
  exacto = true,
): Promise<boolean> {
  const limite = Date.now() + ESPERA_MAXIMA;
  while (Date.now() < limite) {
    const boton = Array.from(doc.querySelectorAll<HTMLElement>(selector)).find((b) => {
      const t = (b.textContent ?? '').trim();
      return exacto ? t === texto : t.includes(texto);
    });
    if (boton) {
      boton.click();
      await pausa(PAUSA_ENTRE_CAMPOS);
      return true;
    }
    await pausa(50);
  }
  return false;
}

const opcion = (doc: Document, texto: string) => tocar(doc, '[role=radio]', texto);
const chip = (doc: Document, texto: string) => tocar(doc, 'button[aria-pressed]', texto);
const boton = (doc: Document, texto: string) => tocar(doc, 'button', texto, false);

async function agregarChip(doc: Document, etiqueta: string, texto: string): Promise<void> {
  if (await chip(doc, texto)) return;
  const campo = await esperarElemento<HTMLInputElement>(doc, `input[aria-label="${etiqueta}"]`);
  if (!campo) return;
  asignarValor(campo, texto);
  await boton(doc, 'Agregar');
}

async function llenarTarjeta(doc: Document): Promise<void> {
  await escribir(doc, 'tarjeta', TARJETA_DE_PRUEBA.tarjeta);
  await escribir(doc, 'vencimiento', TARJETA_DE_PRUEBA.vencimiento);
  await escribir(doc, 'cvv', TARJETA_DE_PRUEBA.cvv);
}

const SECTOR_SALUD = 'Salud';

async function registroCandidato(doc: Document) {
  await escribir(doc, 'nombre', MARIANA.nombre);
  await escribir(doc, 'celular', MARIANA.celular);
  await escribir(doc, 'correo', MARIANA.correo);
  await escribir(doc, 'contrasena', MARIANA.contrasena);
  await marcar(doc, 'aviso');
}

async function registroEmpresa(doc: Document) {
  await escribir(doc, 'nombre', CLINICA.nombre);
  await escribir(doc, 'tipo', CLINICA.tipo);
  await opcion(doc, SECTOR_SALUD);
  await escribir(doc, 'contacto', CLINICA.contacto);
  await escribir(doc, 'celular', CLINICA.celular);
  await escribir(doc, 'correo', CLINICA.correo);
  await escribir(doc, 'contrasena', CLINICA.contrasena);
  await marcar(doc, 'aviso');
}

async function cvPaso(doc: Document, paso: number) {
  const cv = MARIANA.cv;
  if (paso === 1) {
    await escribir(doc, 'zona', cv.zona);
  } else if (paso === 2) {
    await opcion(doc, SECTOR_SALUD);
    if (!(await tocar(doc, 'main button', cv.puestoDeseado)))
      await escribir(doc, 'puestoDeseado', cv.puestoDeseado);
    await escribir(doc, 'sueldoEsperado', String(cv.sueldoEsperado));
    await opcion(doc, 'Nocturno');
    await opcion(doc, 'Inmediata');
  } else if (paso === 3) {
    for (const [i, e] of cv.experiencias.entries()) {
      if (i > 0) await boton(doc, 'Agregar otra');
      await escribir(doc, `puesto-${i}`, e.puesto);
      await escribir(doc, `empresa-${i}`, e.empresa);
      await escribir(doc, `desde-${i}`, e.desde);
      if ('hasta' in e) await escribir(doc, `hasta-${i}`, e.hasta);
      else await marcar(doc, `actual-${i}`);
      await escribir(doc, `descripcion-${i}`, e.descripcion);
    }
  } else if (paso === 4) {
    await escribir(doc, 'nivel', cv.estudios.nivel);
    await escribir(doc, 'institucion', cv.estudios.institucion);
    for (const d of cv.documentos) await agregarChip(doc, 'Otro documento o curso', d);
  } else {
    for (const h of cv.habilidades) await agregarChip(doc, 'Otra habilidad', h);
    await escribir(doc, 'resumen', cv.resumen);
  }
}

async function vacantePaso(doc: Document, paso: number): Promise<boolean> {
  if (paso === 1) {
    await opcion(doc, SECTOR_SALUD);
    await escribir(doc, 'puesto', VACANTE_GUION.puesto);
    await escribir(doc, 'zona', VACANTE_GUION.zona);
    await escribir(doc, 'sueldo', String(VACANTE_GUION.sueldo));
    await opcion(doc, 'Nocturno');
    await escribir(doc, 'contrato', VACANTE_GUION.contrato);
    await escribir(
      doc,
      'descripcion',
      'Atención de pacientes en turno nocturno, toma de signos vitales y registro en expediente.',
    );
    return true;
  }
  if (paso === 2) {
    for (const p of VACANTE_GUION.preguntas) await tocar(doc, 'main button', p.texto, false);
    return true;
  }
  return false;
}

async function headhunting(doc: Document) {
  const h = HEADHUNTING_GUION;
  await escribir(doc, 'puesto', h.puesto);
  await opcion(doc, SECTOR_SALUD);
  await escribir(doc, 'vacantes', String(h.vacantes));
  await escribir(doc, 'sueldoRango', h.sueldoRango);
  await opcion(doc, h.urgencia);
  await escribir(doc, 'detalle', h.detalle);
}

let enCurso = false;

/** Qué formulario hay en pantalla, para mostrarlo en el aviso. */
export function describirPantalla(): string | null {
  const ruta = ventanaObjetivo().location.hash.replace(/^#/, '');
  if (ruta.startsWith('/registro/candidato')) return 'registro de candidato';
  if (ruta.startsWith('/registro/empresa')) return 'registro de empresa';
  if (/^\/candidato\/cv\/paso\/\d/.test(ruta)) return 'CV';
  if (ruta.startsWith('/candidato/cv/pagar') || ruta.startsWith('/empresa/planes')) return 'pago';
  if (ruta.startsWith('/empresa/vacantes/nueva')) return 'vacante';
  if (ruta.startsWith('/empresa/headhunting')) return 'headhunting';
  return null;
}

/** Llena el formulario de la pantalla actual con los datos del guion, "escribiendo" rápido. */
export async function autollenar(): Promise<ResultadoAutollenado> {
  if (enCurso) return { ok: false, mensaje: 'Ya se está llenando el formulario' };
  const ventana = ventanaObjetivo();
  const doc = ventana.document;
  const ruta = ventana.location.hash.replace(/^#/, '');
  enCurso = true;
  try {
    if (ruta.startsWith('/registro/candidato')) {
      await registroCandidato(doc);
    } else if (ruta.startsWith('/registro/empresa')) {
      await registroEmpresa(doc);
    } else if (/^\/candidato\/cv\/paso\/\d/.test(ruta)) {
      await cvPaso(doc, Number(ruta.split('/').pop()));
    } else if (ruta.startsWith('/empresa/vacantes/nueva')) {
      const paso = Number(/Paso (\d)/.exec(doc.querySelector('h1')?.textContent ?? '')?.[1] ?? 1);
      if (!(await vacantePaso(doc, paso))) {
        return { ok: false, mensaje: 'Aquí no hay nada que llenar: revisa y publica' };
      }
    } else if (ruta.startsWith('/empresa/headhunting')) {
      await headhunting(doc);
    } else if (doc.querySelector('[role=dialog] [name="tarjeta"]')) {
      await llenarTarjeta(doc);
    } else {
      return { ok: false, mensaje: 'No hay un formulario que llenar en esta pantalla' };
    }
    return { ok: true, mensaje: 'Formulario llenado' };
  } finally {
    enCurso = false;
  }
}
