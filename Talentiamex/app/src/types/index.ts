/** Sectores base más los que se agregan en P17. */
export type SectorId = 'salud' | 'restaurantes' | 'escuelas' | (string & Record<never, never>);

export type PlanId = 'basico' | 'pro' | 'empresa';

export type Turno = 'matutino' | 'vespertino' | 'nocturno' | 'mixto' | 'rotativo';

export type Disponibilidad = 'inmediata' | 'una_semana' | 'dos_semanas' | 'un_mes';

export type PlantillaCv = 'clasica' | 'moderna' | 'compacta';

export interface Sector {
  id: SectorId;
  nombre: string;
  color: string;
  colorSuave: string;
  icono: string;
  puestos: string[];
  habilidades: string[];
}

export interface Experiencia {
  puesto: string;
  empresa: string;
  desde: string;
  hasta?: string;
  descripcion?: string;
}

export interface Candidato {
  id: string;
  nombre: string;
  celular: string;
  correo: string;
  zona: string;
  fotoUrl?: string;
  sector: SectorId;
  puestoDeseado: string;
  sueldoEsperado: number;
  turno: Turno;
  disponibilidad: Disponibilidad;
  experiencias: Experiencia[];
  sinExperiencia: boolean;
  estudios: { nivel: string; institucion?: string };
  documentos: string[];
  habilidades: string[];
  resumen: string;
  plantilla: PlantillaCv;
  perfilVisible: boolean;
  cvPagado: boolean;
  creadoEl: string;
}

export type TipoEmpresa = 'pyme' | 'cadena' | 'hospital' | 'escuela';

export type EstadoPlan = 'prueba' | 'activo' | 'vencido';

export interface Empresa {
  id: string;
  nombre: string;
  sector: SectorId;
  tipo: TipoEmpresa;
  contacto: string;
  celular: string;
  correo: string;
  plan: { id: PlanId; estado: EstadoPlan; venceEl: string };
}

export type EstadoVacante = 'activa' | 'pausada' | 'cerrada' | 'vencida';

/** Días de aviso de vencimiento ya enviados (RNF-07: no duplicar). */
export type AvisoDias = 5 | 3 | 0;

export interface PreguntaDescarte {
  id: string;
  texto: string;
  respuestaEsperada: boolean;
}

export interface Vacante {
  id: string;
  empresaId: string;
  puesto: string;
  sector: SectorId;
  zona: string;
  sueldo: number;
  turno: Turno;
  contrato: string;
  descripcion: string;
  requisitos: string[];
  prestaciones: string[];
  preguntas: PreguntaDescarte[];
  publicadaEl: string;
  estado: EstadoVacante;
  avisosEnviados: AvisoDias[];
}

export type EstadoPostulacion = 'enviada' | 'en_revision' | 'preseleccionado' | 'descartado';

export interface Postulacion {
  id: string;
  vacanteId: string;
  candidatoId: string;
  fecha: string;
  respuestas: Record<string, boolean>;
  cumpleDescarte: boolean;
  estado: EstadoPostulacion;
}

export interface Plan {
  id: PlanId;
  nombre: string;
  precioMensual: number;
  vacantesActivas: number | 'ilimitadas';
  incluye: string[];
  recomendado?: boolean;
}

export type EstadoHeadhunting = 'recibida' | 'en_busqueda' | 'finalistas';

export interface SolicitudHeadhunting {
  id: string;
  empresaId: string;
  puesto: string;
  sector: SectorId;
  vacantes: number;
  urgencia: string;
  sueldoRango: string;
  detalle: string;
  estado: EstadoHeadhunting;
  reclutador?: string;
  fecha: string;
}

export type ReglaWhatsApp = 'RN-06' | 'RN-07' | 'RN-08' | 'RN-09';

export interface MensajeWhatsApp {
  id: string;
  para: 'empresa' | 'candidato';
  destinatarioId: string;
  regla: ReglaWhatsApp;
  texto: string;
  boton?: { texto: string; ruta: string };
  hora: string;
  leido: boolean;
}
