import type {
  AvisoDias,
  Candidato,
  Disponibilidad,
  Empresa,
  EstadoPostulacion,
  EstadoVacante,
  MensajeWhatsApp,
  Postulacion,
  SectorId,
  SolicitudHeadhunting,
  Turno,
  Vacante,
} from '@/types';
import { crearRng, type Rng } from '@/lib/rng';
import { sumarDias } from '@/lib/fechas';
import { HOY_INICIAL, VIGENCIA_VACANTE_DIAS } from './config';
import { SECTORES } from './sectores';
import { ZONAS } from './zonas';
import { preguntasPorSector } from './preguntasSugeridas';

const SEMILLA_FIJA = 20261030;

const NOMBRES_M = [
  'Sofía',
  'Valeria',
  'Camila',
  'Ximena',
  'Daniela',
  'Fernanda',
  'Andrea',
  'Paola',
  'Itzel',
  'Guadalupe',
  'Rocío',
  'Karla',
  'Lucía',
  'Berenice',
  'Alejandra',
  'Citlali',
  'Yesenia',
  'Nayeli',
];
const NOMBRES_H = [
  'Luis',
  'Carlos',
  'Jorge',
  'Miguel',
  'Héctor',
  'Diego',
  'Javier',
  'Raúl',
  'Eduardo',
  'Óscar',
  'Iván',
  'Ricardo',
  'Fernando',
  'Emiliano',
  'Adrián',
  'Mauricio',
];
const APELLIDOS = [
  'Hernández',
  'García',
  'Martínez',
  'Rodríguez',
  'Ramírez',
  'Sánchez',
  'Flores',
  'Cruz',
  'Morales',
  'Ortiz',
  'Reyes',
  'Gutiérrez',
  'Mendoza',
  'Vargas',
  'Castillo',
  'Jiménez',
  'Ruiz',
  'Torres',
  'Aguilar',
  'Domínguez',
  'Peña',
  'Salazar',
  'Navarro',
  'Cabrera',
  'Rangel',
];
const EMPRESAS_PREVIAS = [
  'Clínica Santa Elena',
  'Farmacias del Valle',
  'Hospital General Zona Norte',
  'Fonda La Esquina',
  'Restaurante El Fogón',
  'Cafetería Aroma',
  'Colegio Benito Juárez',
  'Escuela Particular Sol',
  'Estancia Infantil Pequeños Pasos',
  'Laboratorio Análisis del Centro',
  'Taquería Don Beto',
];
const ESTUDIOS = [
  'Secundaria',
  'Preparatoria',
  'Carrera técnica',
  'Licenciatura',
  'Licenciatura trunca',
];
const DOCUMENTOS: Record<string, string[]> = {
  salud: ['Cédula profesional', 'Título', 'Cartilla de vacunación', 'Constancia de curso'],
  restaurantes: [
    'Constancia de manejo higiénico de alimentos',
    'Tarjeta de salud',
    'Comprobante de estudios',
  ],
  escuelas: ['Título', 'Cédula docente', 'Constancia de inglés', 'Carta de no antecedentes'],
};
const TURNOS: Turno[] = ['matutino', 'vespertino', 'nocturno', 'mixto', 'rotativo'];
const DISPONIBILIDADES: Disponibilidad[] = [
  'inmediata',
  'inmediata',
  'una_semana',
  'dos_semanas',
  'un_mes',
];
const PLANTILLAS = ['clasica', 'moderna', 'compacta'] as const;
const RANGO_SUELDO: Record<string, [number, number]> = {
  salud: [9500, 17000],
  restaurantes: [7500, 12500],
  escuelas: [8500, 15000],
};

interface EspecVacante {
  empresa: number;
  puesto: string;
  zona: string;
  sueldo: number;
  turno: Turno;
  /** Días transcurridos desde su publicación. */
  antiguedad: number;
  estado?: EstadoVacante;
}

const ESPECS_VACANTES: EspecVacante[] = [
  // Hospital Santa Fe Norte (3 de Salud)
  {
    empresa: 0,
    puesto: 'Enfermera(o) general',
    zona: 'Miguel Hidalgo',
    sueldo: 15500,
    turno: 'matutino',
    antiguedad: 6,
  },
  {
    empresa: 0,
    puesto: 'Auxiliar de enfermería',
    zona: 'Miguel Hidalgo',
    sueldo: 11000,
    turno: 'vespertino',
    antiguedad: 9,
  },
  {
    empresa: 0,
    puesto: 'Recepcionista de clínica',
    zona: 'Álvaro Obregón',
    sueldo: 10500,
    turno: 'mixto',
    antiguedad: 3,
  },
  // Clínica Vida Plena
  {
    empresa: 1,
    puesto: 'Cuidador(a) de adulto mayor',
    zona: 'Coyoacán',
    sueldo: 10000,
    turno: 'rotativo',
    antiguedad: 12,
  },
  {
    empresa: 1,
    puesto: 'Químico laboratorista',
    zona: 'Tlalpan',
    sueldo: 14000,
    turno: 'matutino',
    antiguedad: 15,
  },
  // La Cocina de Doña Tere: una vence en 5 días y otra en 3
  {
    empresa: 2,
    puesto: 'Cocinero(a)',
    zona: 'Iztapalapa',
    sueldo: 10500,
    turno: 'matutino',
    antiguedad: 25,
  },
  {
    empresa: 2,
    puesto: 'Mesero(a)',
    zona: 'Iztapalapa',
    sueldo: 8200,
    turno: 'vespertino',
    antiguedad: 27,
  },
  // Grupo Sabor Capital (plan vencido)
  {
    empresa: 3,
    puesto: 'Cajero(a)',
    zona: 'Cuauhtémoc',
    sueldo: 8800,
    turno: 'mixto',
    antiguedad: 18,
  },
  {
    empresa: 3,
    puesto: 'Repartidor(a)',
    zona: 'Gustavo A. Madero',
    sueldo: 9000,
    turno: 'rotativo',
    antiguedad: 35,
    estado: 'vencida',
  },
  // Colegio Monte Albán
  {
    empresa: 4,
    puesto: 'Docente de primaria',
    zona: 'Benito Juárez',
    sueldo: 13500,
    turno: 'matutino',
    antiguedad: 8,
  },
  {
    empresa: 4,
    puesto: 'Docente de inglés',
    zona: 'Benito Juárez',
    sueldo: 14500,
    turno: 'matutino',
    antiguedad: 11,
  },
  {
    empresa: 4,
    puesto: 'Personal de intendencia',
    zona: 'Benito Juárez',
    sueldo: 8500,
    turno: 'vespertino',
    antiguedad: 14,
    estado: 'pausada',
  },
  // Instituto Nuevo Amanecer
  {
    empresa: 5,
    puesto: 'Prefecto(a)',
    zona: 'Naucalpan',
    sueldo: 9200,
    turno: 'matutino',
    antiguedad: 5,
  },
  {
    empresa: 5,
    puesto: 'Asistente administrativo escolar',
    zona: 'Naucalpan',
    sueldo: 10200,
    turno: 'matutino',
    antiguedad: 10,
  },
];

function sinAcentos(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function celular(rng: Rng): string {
  const a = rng.entero(1000, 9999);
  const b = rng.entero(1000, 9999);
  return `${rng.elegir(['55', '56', '33'])} ${a} ${b}`;
}

function sectorDe(indice: number): SectorId {
  return SECTORES[indice % SECTORES.length]?.id ?? 'salud';
}

function crearEmpresas(hoy: string, rng: Rng): Empresa[] {
  const base: Omit<Empresa, 'celular'>[] = [
    {
      id: 'emp-01',
      nombre: 'Hospital Santa Fe Norte',
      sector: 'salud',
      tipo: 'hospital',
      contacto: 'Lic. Patricia Aldama',
      correo: 'rh@santafenorte.com.mx',
      plan: { id: 'pro', estado: 'activo', venceEl: sumarDias(hoy, 21) },
    },
    {
      id: 'emp-02',
      nombre: 'Clínica Vida Plena',
      sector: 'salud',
      tipo: 'hospital',
      contacto: 'Dr. Arturo Beltrán',
      correo: 'contacto@vidaplena.com.mx',
      plan: { id: 'basico', estado: 'prueba', venceEl: sumarDias(hoy, 9) },
    },
    {
      id: 'emp-03',
      nombre: 'La Cocina de Doña Tere',
      sector: 'restaurantes',
      tipo: 'pyme',
      contacto: 'Teresa Salgado',
      correo: 'dona.tere@lacocinadetere.mx',
      plan: { id: 'basico', estado: 'prueba', venceEl: sumarDias(hoy, 6) },
    },
    {
      id: 'emp-04',
      nombre: 'Grupo Sabor Capital',
      sector: 'restaurantes',
      tipo: 'cadena',
      contacto: 'Ing. Rodrigo Estrada',
      correo: 'personal@saborcapital.com.mx',
      plan: { id: 'basico', estado: 'vencido', venceEl: sumarDias(hoy, -6) },
    },
    {
      id: 'emp-05',
      nombre: 'Colegio Monte Albán',
      sector: 'escuelas',
      tipo: 'escuela',
      contacto: 'Mtra. Sandra Ibarra',
      correo: 'direccion@montealban.edu.mx',
      plan: { id: 'basico', estado: 'activo', venceEl: sumarDias(hoy, 18) },
    },
    {
      id: 'emp-06',
      nombre: 'Instituto Nuevo Amanecer',
      sector: 'escuelas',
      tipo: 'escuela',
      contacto: 'Prof. Gabriel Ochoa',
      correo: 'rh@nuevoamanecer.edu.mx',
      plan: { id: 'basico', estado: 'prueba', venceEl: sumarDias(hoy, 4) },
    },
  ];
  return base.map((e) => ({ ...e, celular: celular(rng) }));
}

function crearVacantes(hoy: string, empresas: Empresa[]): Vacante[] {
  return ESPECS_VACANTES.map((spec, i) => {
    const empresa = empresas[spec.empresa];
    if (!empresa) throw new Error('Empresa semilla inexistente');
    const id = `vac-${String(i + 1).padStart(2, '0')}`;
    const avisos: AvisoDias[] = [];
    const diasRestantes = VIGENCIA_VACANTE_DIAS - spec.antiguedad;
    if (diasRestantes <= 5) avisos.push(5);
    if (diasRestantes <= 3) avisos.push(3);
    if (diasRestantes <= 0) avisos.push(0);
    return {
      id,
      empresaId: empresa.id,
      puesto: spec.puesto,
      sector: empresa.sector,
      zona: spec.zona,
      sueldo: spec.sueldo,
      turno: spec.turno,
      contrato: 'Contrato indefinido, con prestaciones de ley',
      descripcion: `${empresa.nombre} busca ${spec.puesto.toLowerCase()} para incorporarse a su equipo en ${spec.zona}.`,
      requisitos: [
        'Disponibilidad para el turno indicado',
        'Buen trato y puntualidad',
        'Comprobante de estudios',
      ],
      prestaciones: ['Prestaciones de ley', 'Vales de despensa', 'Capacitación inicial'],
      preguntas: preguntasPorSector(empresa.sector).map((p, n) => ({
        id: `${id}-q${n + 1}`,
        texto: p.texto,
        respuestaEsperada: p.respuestaEsperada,
      })),
      publicadaEl: sumarDias(hoy, -spec.antiguedad),
      estado: spec.estado ?? 'activa',
      avisosEnviados: avisos,
    };
  });
}

function crearCandidatos(hoy: string, rng: Rng): Candidato[] {
  const zonas = ZONAS;
  const usados = new Set<string>();
  const lista: Candidato[] = [];
  for (let i = 0; i < 46; i++) {
    const sectorId = sectorDe(i);
    const sector = SECTORES.find((s) => s.id === sectorId);
    if (!sector) throw new Error('Sector semilla inexistente');
    const mujer = rng.probabilidad(0.62);
    let nombre = '';
    do {
      nombre = `${rng.elegir(mujer ? NOMBRES_M : NOMBRES_H)} ${rng.elegir(APELLIDOS)} ${rng.elegir(APELLIDOS)}`;
    } while (usados.has(nombre) || nombre.startsWith('Mariana López'));
    usados.add(nombre);

    const partes = nombre.split(' ');
    const correo = `${sinAcentos(partes[0] ?? 'candidato')}.${sinAcentos(partes[1] ?? 'perfil')}${i + 1}@correo.mx`;
    const [minS, maxS] = RANGO_SUELDO[sectorId] ?? [8000, 14000];
    const sinExperiencia = i % 11 === 5;
    const nExp = sinExperiencia ? 0 : rng.entero(1, 3);
    const experiencias = Array.from({ length: nExp }, (_, n) => {
      const anioFin = 2026 - n * 2;
      return {
        puesto: rng.elegir(sector.puestos),
        empresa: rng.elegir(EMPRESAS_PREVIAS),
        desde: `${anioFin - 2}-0${rng.entero(1, 9)}`,
        hasta: n === 0 && rng.probabilidad(0.5) ? undefined : `${anioFin}-0${rng.entero(1, 9)}`,
        descripcion: 'Atención de tareas diarias, trabajo en equipo y cumplimiento de horarios.',
      };
    });
    const puesto = rng.elegir(sector.puestos);
    lista.push({
      id: `can-${String(i + 1).padStart(2, '0')}`,
      nombre,
      celular: celular(rng),
      correo,
      zona: rng.elegir(zonas),
      sector: sectorId,
      puestoDeseado: puesto,
      sueldoEsperado: Math.round(rng.entero(minS, maxS) / 500) * 500,
      turno: rng.elegir(TURNOS),
      disponibilidad: rng.elegir(DISPONIBILIDADES),
      experiencias: experiencias.map(({ hasta, ...resto }) =>
        hasta ? { ...resto, hasta } : resto,
      ),
      sinExperiencia,
      estudios: { nivel: rng.elegir(ESTUDIOS) },
      documentos: rng.mezclar(DOCUMENTOS[sectorId] ?? []).slice(0, rng.entero(1, 3)),
      habilidades: rng.mezclar(sector.habilidades).slice(0, rng.entero(2, 4)),
      resumen: `Persona responsable y puntual, con interés en trabajar como ${puesto.toLowerCase()}.`,
      plantilla: rng.elegir(PLANTILLAS),
      perfilVisible: !rng.probabilidad(0.12),
      cvPagado: rng.probabilidad(0.3),
      creadoEl: sumarDias(hoy, -rng.entero(1, 45)),
    });
  }
  return lista;
}

function crearPostulaciones(
  hoy: string,
  rng: Rng,
  candidatos: Candidato[],
  vacantes: Vacante[],
): Postulacion[] {
  const abiertas = vacantes.filter((v) => v.estado === 'activa');
  const pares = new Set<string>();
  const lista: Postulacion[] = [];
  let intentos = 0;
  while (lista.length < 60 && intentos < 2000) {
    intentos++;
    const vacante = rng.elegir(abiertas);
    const delSector = candidatos.filter((c) => c.sector === vacante.sector);
    const candidato = rng.probabilidad(0.85) ? rng.elegir(delSector) : rng.elegir(candidatos);
    const clave = `${vacante.id}|${candidato.id}`;
    if (pares.has(clave)) continue;
    pares.add(clave);

    const respuestas: Record<string, boolean> = {};
    for (const p of vacante.preguntas) {
      respuestas[p.id] = rng.probabilidad(0.75) ? p.respuestaEsperada : !p.respuestaEsperada;
    }
    const cumple = vacante.preguntas.every((p) => respuestas[p.id] === p.respuestaEsperada);
    const tirada = rng.siguiente();
    let estado: EstadoPostulacion;
    if (cumple)
      estado = tirada < 0.3 ? 'enviada' : tirada < 0.65 ? 'en_revision' : 'preseleccionado';
    else estado = tirada < 0.4 ? 'enviada' : tirada < 0.6 ? 'en_revision' : 'descartado';

    lista.push({
      id: `pos-${String(lista.length + 1).padStart(2, '0')}`,
      vacanteId: vacante.id,
      candidatoId: candidato.id,
      fecha: sumarDias(hoy, -rng.entero(0, 13)),
      respuestas,
      cumpleDescarte: cumple,
      estado,
    });
  }
  return lista;
}

function crearSolicitudes(hoy: string): SolicitudHeadhunting[] {
  return [
    {
      id: 'hh-01',
      empresaId: 'emp-01',
      puesto: 'Jefe(a) de enfermería',
      sector: 'salud',
      vacantes: 1,
      urgencia: 'Alta',
      sueldoRango: '$28,000 – $35,000 MXN',
      detalle:
        'Perfil con 5 años de experiencia coordinando personal de enfermería en hospital privado.',
      estado: 'en_busqueda',
      reclutador: 'Andrea Solís',
      fecha: sumarDias(hoy, -4),
    },
    {
      id: 'hh-02',
      empresaId: 'emp-05',
      puesto: 'Coordinador(a) académico',
      sector: 'escuelas',
      vacantes: 1,
      urgencia: 'Media',
      sueldoRango: '$20,000 – $26,000 MXN',
      detalle:
        'Coordinación de primaria y secundaria, con experiencia en planeación y atención a padres de familia.',
      estado: 'recibida',
      fecha: sumarDias(hoy, -1),
    },
  ];
}

function crearMensajes(
  hoy: string,
  vacantes: Vacante[],
  candidatos: Candidato[],
): MensajeWhatsApp[] {
  const vencePronto = vacantes.find(
    (v) => v.empresaId === 'emp-03' && v.avisosEnviados.includes(5),
  );
  const paraCandidato = candidatos.find((c) => c.sector === 'salud');
  const vacSalud = vacantes.find((v) => v.empresaId === 'emp-01');
  const mensajes: MensajeWhatsApp[] = [
    {
      id: 'wa-01',
      para: 'empresa',
      destinatarioId: 'emp-01',
      regla: 'RN-07',
      texto:
        'Hospital Santa Fe Norte: llegó un candidato nuevo a tu vacante de enfermería. Revísalo cuando quieras.',
      boton: {
        texto: 'Ver postulantes',
        ruta: `/empresa/vacantes/${vacSalud?.id ?? 'vac-01'}/postulantes`,
      },
      hora: `${sumarDias(hoy, -2)}T10:15`,
      leido: true,
    },
    {
      id: 'wa-02',
      para: 'empresa',
      destinatarioId: 'emp-03',
      regla: 'RN-06',
      texto: `Tu vacante de ${vencePronto?.puesto ?? 'cocina'} vence en 5 días. Renuévala para seguir recibiendo candidatos.`,
      boton: { texto: 'Renovar vacante', ruta: '/empresa' },
      hora: `${hoy}T08:00`,
      leido: false,
    },
  ];
  if (paraCandidato) {
    mensajes.push({
      id: 'wa-03',
      para: 'candidato',
      destinatarioId: paraCandidato.id,
      regla: 'RN-08',
      texto: `Hola ${paraCandidato.nombre.split(' ')[0] ?? ''}, hay una vacante nueva que coincide contigo.`,
      boton: { texto: 'Ver vacante', ruta: `/candidato/vacantes/${vacSalud?.id ?? 'vac-01'}` },
      hora: `${sumarDias(hoy, -1)}T12:40`,
      leido: true,
    });
  }
  return mensajes;
}

export interface Semilla {
  empresas: Empresa[];
  vacantes: Vacante[];
  candidatos: Candidato[];
  postulaciones: Postulacion[];
  solicitudes: SolicitudHeadhunting[];
  mensajes: MensajeWhatsApp[];
}

/** Genera los datos de ejemplo. Misma semilla y misma fecha, mismos datos. */
export function generarSemilla(hoy: string = HOY_INICIAL): Semilla {
  const rng = crearRng(SEMILLA_FIJA);
  const empresas = crearEmpresas(hoy, rng);
  const vacantes = crearVacantes(hoy, empresas);
  const candidatos = crearCandidatos(hoy, rng);
  const postulaciones = crearPostulaciones(hoy, rng, candidatos, vacantes);
  return {
    empresas,
    vacantes,
    candidatos,
    postulaciones,
    solicitudes: crearSolicitudes(hoy),
    mensajes: crearMensajes(hoy, vacantes, candidatos),
  };
}
