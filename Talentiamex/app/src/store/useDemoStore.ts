import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Candidato,
  Empresa,
  EstadoPostulacion,
  MensajeWhatsApp,
  Plan,
  PlanId,
  Postulacion,
  PreguntaDescarte,
  Sector,
  SolicitudHeadhunting,
  Vacante,
} from '@/types';
import { CLAVE_STORE, HOY_INICIAL, PRUEBA_DIAS, VIGENCIA_VACANTE_DIAS } from '@/data/config';
import { PLANES } from '@/data/planes';
import { SECTORES } from '@/data/sectores';
import { generarSemilla } from '@/data/semilla';
import { sumarDias } from '@/lib/fechas';
import { avanzarDias as avanzarReloj, type EventoReloj } from '@/sim/reloj';
import {
  plantillaRN06,
  plantillaRN07,
  plantillaRN08,
  plantillaRN09,
  type PlantillaMensaje,
} from '@/sim/plantillas';
import { coincide, cumpleDescarte, cvCompleto, puedePublicar } from './reglas';

export type Rol = 'candidato' | 'empresa' | 'admin';
export type TipoSuspension = 'empresa' | 'candidato' | 'vacante';

export interface Sesion {
  rol: Rol;
  id: string;
}

export interface Ingreso {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
}

export interface DatosDemo {
  hoy: string;
  sesion: Sesion | null;
  sectores: Sector[];
  planes: Plan[];
  empresas: Empresa[];
  vacantes: Vacante[];
  candidatos: Candidato[];
  postulaciones: Postulacion[];
  solicitudes: SolicitudHeadhunting[];
  mensajes: MensajeWhatsApp[];
  ingresos: Ingreso[];
  /** Ids de empresas, candidatos y vacantes suspendidos por el administrador. */
  suspendidos: string[];
  /** Empresa → vencimiento de plan ya avisado por RN-09. */
  avisosPlan: Record<string, string>;
}

export interface DatosCandidatoNuevo {
  nombre: string;
  celular: string;
  correo: string;
}

export interface DatosEmpresaNueva {
  nombre: string;
  sector: Empresa['sector'];
  tipo: Empresa['tipo'];
  contacto: string;
  celular: string;
  correo: string;
}

export interface DatosVacante {
  puesto: string;
  zona: string;
  sueldo: number;
  turno: Vacante['turno'];
  contrato: string;
  descripcion: string;
  requisitos: string[];
  prestaciones: string[];
  preguntas: Omit<PreguntaDescarte, 'id'>[];
}

export interface DatosHeadhunting {
  puesto: string;
  sector: Empresa['sector'];
  vacantes: number;
  urgencia: string;
  sueldoRango: string;
  detalle: string;
}

export type DatosSector = Omit<Sector, 'id'>;

export type ResultadoPostulacion =
  | { ok: true; id: string }
  | { ok: false; motivo: 'sin_sesion' | 'cv_incompleto' | 'duplicada' | 'no_disponible' };

export interface Acciones {
  // sesión
  registrarCandidato: (datos: DatosCandidatoNuevo) => string;
  registrarEmpresa: (datos: DatosEmpresaNueva) => string;
  entrarComo: (rol: Rol, id: string) => void;
  salir: () => void;
  // CV
  guardarPasoCv: (paso: number, datos: Partial<Candidato>) => void;
  elegirPlantilla: (id: Candidato['plantilla']) => void;
  marcarCvPagado: () => void;
  alternarPerfilVisible: () => void;
  // vacantes
  publicarVacante: (datos: DatosVacante) => string | null;
  renovarVacante: (id: string) => boolean;
  pausarVacante: (id: string) => void;
  reanudarVacante: (id: string) => void;
  cerrarVacante: (id: string) => void;
  // postulación
  postularse: (vacanteId: string, respuestas: Record<string, boolean>) => ResultadoPostulacion;
  cambiarEstadoPostulacion: (id: string, estado: EstadoPostulacion) => void;
  // empresa
  iniciarPrueba: (planId: PlanId) => boolean;
  contratarPlan: (planId: PlanId) => void;
  solicitarHeadhunting: (datos: DatosHeadhunting) => string | null;
  registrarIngreso: (concepto: string, monto: number) => void;
  // admin
  asignarReclutador: (solicitudId: string, nombre: string) => void;
  agregarSector: (datos: DatosSector) => string;
  editarPlan: (plan: Plan) => void;
  alternarSuspension: (tipo: TipoSuspension, id: string) => void;
  // mensajes
  agregarMensajes: (plantillas: PlantillaMensaje[]) => void;
  marcarLeidos: (para: MensajeWhatsApp['para'], destinatarioId: string) => void;
  // demo
  avanzarDias: (n: number) => void;
  resetDemo: () => void;
  /** Pendiente: se completa en el prompt de autollenar. */
  autollenar: (formulario: string) => void;
}

export type DemoStore = DatosDemo & Acciones;

export function estadoInicial(): DatosDemo {
  const semilla = generarSemilla(HOY_INICIAL);
  return {
    hoy: HOY_INICIAL,
    sesion: null,
    sectores: SECTORES.map((s) => ({ ...s })),
    planes: PLANES.map((p) => ({ ...p })),
    empresas: semilla.empresas,
    vacantes: semilla.vacantes,
    candidatos: semilla.candidatos,
    postulaciones: semilla.postulaciones,
    solicitudes: semilla.solicitudes,
    mensajes: semilla.mensajes,
    ingresos: [],
    suspendidos: [],
    avisosPlan: {},
  };
}

function siguienteId(prefijo: string, cantidad: number): string {
  return `${prefijo}-${String(cantidad + 1).padStart(2, '0')}`;
}

function horaActual(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Agrega mensajes al historial con id, hora y sin leer. */
function conMensajes(
  actuales: MensajeWhatsApp[],
  plantillas: PlantillaMensaje[],
  fecha: string,
  hora: string,
): MensajeWhatsApp[] {
  const nuevos = plantillas.map((p, i) => ({
    ...p,
    id: siguienteId('wa', actuales.length + i),
    hora: `${fecha}T${hora}`,
    leido: false,
  }));
  return [...actuales, ...nuevos];
}

function plantillasDeEventos(s: DatosDemo, eventos: EventoReloj[], empresas: Empresa[]) {
  const salida: { fecha: string; plantilla: PlantillaMensaje }[] = [];
  for (const ev of eventos) {
    const empresa = empresas.find((e) => e.id === ev.empresaId);
    if (!empresa) continue;
    if (ev.regla === 'RN-06') {
      const vacante = s.vacantes.find((v) => v.id === ev.vacanteId);
      if (vacante) salida.push({ fecha: ev.fecha, plantilla: plantillaRN06(empresa, vacante, ev.dias) });
    } else {
      const nombre = s.planes.find((p) => p.id === ev.planId)?.nombre ?? '';
      salida.push({ fecha: ev.fecha, plantilla: plantillaRN09(empresa, nombre) });
    }
  }
  return salida;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...estadoInicial(),

      // ── sesión ──
      registrarCandidato: (datos) => {
        const s = get();
        const id = siguienteId('can', s.candidatos.length);
        const nuevo: Candidato = {
          id,
          ...datos,
          zona: '',
          sector: '',
          puestoDeseado: '',
          sueldoEsperado: 0,
          turno: 'matutino',
          disponibilidad: 'inmediata',
          experiencias: [],
          sinExperiencia: false,
          estudios: { nivel: '' },
          documentos: [],
          habilidades: [],
          resumen: '',
          plantilla: 'clasica',
          perfilVisible: true,
          cvPagado: false,
          creadoEl: s.hoy,
        };
        set({ candidatos: [...s.candidatos, nuevo], sesion: { rol: 'candidato', id } });
        return id;
      },

      registrarEmpresa: (datos) => {
        const s = get();
        const id = siguienteId('emp', s.empresas.length);
        const nueva: Empresa = { id, ...datos, plan: { id: 'basico', estado: 'sin_plan', venceEl: '' } };
        set({ empresas: [...s.empresas, nueva], sesion: { rol: 'empresa', id } });
        return id;
      },

      entrarComo: (rol, id) => set({ sesion: { rol, id } }),
      salir: () => set({ sesion: null }),

      // ── CV ──
      guardarPasoCv: (_paso, datos) => {
        const { sesion } = get();
        if (sesion?.rol !== 'candidato') return;
        set((s) => ({
          candidatos: s.candidatos.map((c) => (c.id === sesion.id ? { ...c, ...datos } : c)),
        }));
      },

      elegirPlantilla: (plantilla) => {
        const { sesion } = get();
        if (sesion?.rol !== 'candidato') return;
        set((s) => ({
          candidatos: s.candidatos.map((c) => (c.id === sesion.id ? { ...c, plantilla } : c)),
        }));
      },

      marcarCvPagado: () => {
        const { sesion } = get();
        if (sesion?.rol !== 'candidato') return;
        set((s) => ({
          candidatos: s.candidatos.map((c) => (c.id === sesion.id ? { ...c, cvPagado: true } : c)),
        }));
      },

      alternarPerfilVisible: () => {
        const { sesion } = get();
        if (sesion?.rol !== 'candidato') return;
        set((s) => ({
          candidatos: s.candidatos.map((c) =>
            c.id === sesion.id ? { ...c, perfilVisible: !c.perfilVisible } : c,
          ),
        }));
      },

      // ── vacantes ──
      publicarVacante: (datos) => {
        const s = get();
        const empresa = s.sesion?.rol === 'empresa' ? s.empresas.find((e) => e.id === s.sesion?.id) : undefined;
        if (!empresa || !puedePublicar(empresa, s.hoy)) return null;
        const id = siguienteId('vac', s.vacantes.length);
        const vacante: Vacante = {
          id,
          empresaId: empresa.id,
          sector: empresa.sector,
          ...datos,
          preguntas: datos.preguntas.map((p, i) => ({ id: `${id}-q${i + 1}`, ...p })),
          publicadaEl: s.hoy,
          estado: 'activa',
          avisosEnviados: [],
        };
        const destinatarios = s.candidatos.filter(
          (c) => coincide(c, vacante) && !s.suspendidos.includes(c.id),
        );
        const plantillas = destinatarios.map((c) => plantillaRN08(c, vacante, empresa));
        set({
          vacantes: [...s.vacantes, vacante],
          mensajes: conMensajes(s.mensajes, plantillas, s.hoy, horaActual()),
        });
        return id;
      },

      renovarVacante: (id) => {
        const s = get();
        const vacante = s.vacantes.find((v) => v.id === id);
        const empresa = s.empresas.find((e) => e.id === vacante?.empresaId);
        if (!vacante || !empresa || !puedePublicar(empresa, s.hoy)) return false;
        set({
          vacantes: s.vacantes.map((v) =>
            v.id === id ? { ...v, publicadaEl: s.hoy, estado: 'activa', avisosEnviados: [] } : v,
          ),
        });
        return true;
      },

      pausarVacante: (id) =>
        set((s) => ({
          vacantes: s.vacantes.map((v) =>
            v.id === id && v.estado === 'activa' ? { ...v, estado: 'pausada' } : v,
          ),
        })),

      reanudarVacante: (id) =>
        set((s) => ({
          vacantes: s.vacantes.map((v) =>
            v.id === id && v.estado === 'pausada' ? { ...v, estado: 'activa' } : v,
          ),
        })),

      cerrarVacante: (id) =>
        set((s) => ({
          vacantes: s.vacantes.map((v) => (v.id === id ? { ...v, estado: 'cerrada' } : v)),
        })),

      // ── postulación ──
      postularse: (vacanteId, respuestas) => {
        const s = get();
        const candidato = s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined;
        if (!candidato) return { ok: false, motivo: 'sin_sesion' };
        const vacante = s.vacantes.find((v) => v.id === vacanteId);
        const empresa = s.empresas.find((e) => e.id === vacante?.empresaId);
        if (!vacante || !empresa || vacante.estado !== 'activa') return { ok: false, motivo: 'no_disponible' };
        if (!cvCompleto(candidato)) return { ok: false, motivo: 'cv_incompleto' };
        if (s.postulaciones.some((p) => p.vacanteId === vacanteId && p.candidatoId === candidato.id)) {
          return { ok: false, motivo: 'duplicada' };
        }
        const id = siguienteId('pos', s.postulaciones.length);
        const postulacion: Postulacion = {
          id,
          vacanteId,
          candidatoId: candidato.id,
          fecha: s.hoy,
          respuestas,
          cumpleDescarte: cumpleDescarte(vacante.preguntas, respuestas),
          estado: 'enviada',
        };
        set({
          postulaciones: [...s.postulaciones, postulacion],
          mensajes: conMensajes(
            s.mensajes,
            [plantillaRN07(empresa, vacante, candidato, s.hoy)],
            s.hoy,
            horaActual(),
          ),
        });
        return { ok: true, id };
      },

      cambiarEstadoPostulacion: (id, estado) =>
        set((s) => ({
          postulaciones: s.postulaciones.map((p) => (p.id === id ? { ...p, estado } : p)),
        })),

      // ── empresa ──
      iniciarPrueba: (planId) => {
        const s = get();
        if (s.sesion?.rol !== 'empresa') return false;
        const empresa = s.empresas.find((e) => e.id === s.sesion?.id);
        if (empresa?.plan.estado !== 'sin_plan') return false;
        const plan = { id: planId, estado: 'prueba' as const, venceEl: sumarDias(s.hoy, PRUEBA_DIAS) };
        set({ empresas: s.empresas.map((e) => (e.id === empresa.id ? { ...e, plan } : e)) });
        return true;
      },

      contratarPlan: (planId) => {
        const s = get();
        if (s.sesion?.rol !== 'empresa') return;
        const plan = { id: planId, estado: 'activo' as const, venceEl: sumarDias(s.hoy, VIGENCIA_VACANTE_DIAS) };
        set({ empresas: s.empresas.map((e) => (e.id === s.sesion?.id ? { ...e, plan } : e)) });
      },

      solicitarHeadhunting: (datos) => {
        const s = get();
        if (s.sesion?.rol !== 'empresa') return null;
        const id = siguienteId('hh', s.solicitudes.length);
        const solicitud: SolicitudHeadhunting = {
          id,
          empresaId: s.sesion.id,
          ...datos,
          estado: 'recibida',
          fecha: s.hoy,
        };
        set({ solicitudes: [...s.solicitudes, solicitud] });
        return id;
      },

      registrarIngreso: (concepto, monto) =>
        set((s) => ({
          ingresos: [
            ...s.ingresos,
            { id: siguienteId('ing', s.ingresos.length), concepto, monto, fecha: s.hoy },
          ],
        })),

      // ── admin ──
      asignarReclutador: (solicitudId, nombre) =>
        set((s) => ({
          solicitudes: s.solicitudes.map((x) =>
            x.id === solicitudId ? { ...x, reclutador: nombre, estado: 'en_busqueda' } : x,
          ),
        })),

      agregarSector: (datos) => {
        const s = get();
        const base = datos.nombre
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        const id = s.sectores.some((x) => x.id === base) ? `${base}-${s.sectores.length + 1}` : base;
        set({ sectores: [...s.sectores, { id, ...datos }] });
        return id;
      },

      editarPlan: (plan) =>
        set((s) => ({ planes: s.planes.map((p) => (p.id === plan.id ? plan : p)) })),

      alternarSuspension: (_tipo, id) =>
        set((s) => ({
          suspendidos: s.suspendidos.includes(id)
            ? s.suspendidos.filter((x) => x !== id)
            : [...s.suspendidos, id],
        })),

      // ── mensajes ──
      agregarMensajes: (plantillas) =>
        set((s) => ({ mensajes: conMensajes(s.mensajes, plantillas, s.hoy, horaActual()) })),

      marcarLeidos: (para, destinatarioId) =>
        set((s) => ({
          mensajes: s.mensajes.map((m) =>
            m.para === para && m.destinatarioId === destinatarioId ? { ...m, leido: true } : m,
          ),
        })),

      // ── demo ──
      avanzarDias: (n) => {
        const s = get();
        const { estado, eventos } = avanzarReloj(
          { hoy: s.hoy, vacantes: s.vacantes, empresas: s.empresas, avisosPlan: s.avisosPlan },
          n,
        );
        // Las plantillas de RN-09 leen el vencimiento que se avisó, así que se arman con las empresas de antes.
        const mensajes = plantillasDeEventos(s, eventos, s.empresas).reduce(
          (lista, { fecha, plantilla }) => conMensajes(lista, [plantilla], fecha, '08:00'),
          s.mensajes,
        );
        set({
          hoy: estado.hoy,
          vacantes: estado.vacantes,
          empresas: estado.empresas,
          avisosPlan: estado.avisosPlan,
          mensajes,
        });
      },

      resetDemo: () => set(estadoInicial()),

      autollenar: () => undefined,
    }),
    {
      name: CLAVE_STORE,
      version: 1,
      partialize: (s): DatosDemo => ({
        hoy: s.hoy,
        sesion: s.sesion,
        sectores: s.sectores,
        planes: s.planes,
        empresas: s.empresas,
        vacantes: s.vacantes,
        candidatos: s.candidatos,
        postulaciones: s.postulaciones,
        solicitudes: s.solicitudes,
        mensajes: s.mensajes,
        ingresos: s.ingresos,
        suspendidos: s.suspendidos,
        avisosPlan: s.avisosPlan,
      }),
    },
  ),
);
