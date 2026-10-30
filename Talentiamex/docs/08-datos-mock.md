# 08 · Datos de ejemplo

Todos los datos son ficticios. Viven en `app/src/data/` como archivos TypeScript tipados y se cargan al store
al iniciar o al tocar "Reiniciar demo". Los nombres de personas y empresas son inventados; no usar marcas reales.

## Modelo (`app/src/types/`)

```ts
type SectorId = 'salud' | 'restaurantes' | 'escuelas' | string; // string: sectores agregados en P17

interface Sector { id: SectorId; nombre: string; color: string; colorSuave: string; icono: string; puestos: string[]; habilidades: string[] }

interface Candidato {
  id: string; nombre: string; celular: string; correo: string; zona: string; fotoUrl?: string;
  sector: SectorId; puestoDeseado: string; sueldoEsperado: number; turno: Turno; disponibilidad: Disponibilidad;
  experiencias: Experiencia[]; sinExperiencia: boolean;
  estudios: { nivel: string; institucion?: string }; documentos: string[];
  habilidades: string[]; resumen: string;
  plantilla: 'clasica' | 'moderna' | 'compacta'; perfilVisible: boolean; cvPagado: boolean; creadoEl: string;
}

interface Empresa {
  id: string; nombre: string; sector: SectorId; tipo: 'pyme' | 'cadena' | 'hospital' | 'escuela';
  contacto: string; celular: string; correo: string;
  plan: { id: PlanId; estado: 'prueba' | 'activo' | 'vencido'; venceEl: string };
}

interface Vacante {
  id: string; empresaId: string; puesto: string; sector: SectorId; zona: string; sueldo: number;
  turno: Turno; contrato: string; descripcion: string; requisitos: string[]; prestaciones: string[];
  preguntas: { id: string; texto: string; respuestaEsperada: boolean }[];
  publicadaEl: string; estado: 'activa' | 'pausada' | 'cerrada' | 'vencida';
  avisosEnviados: (5 | 3 | 0)[]; // RNF-07: no duplicar
}

interface Postulacion {
  id: string; vacanteId: string; candidatoId: string; fecha: string;
  respuestas: Record<string, boolean>; cumpleDescarte: boolean;
  estado: 'enviada' | 'en_revision' | 'preseleccionado' | 'descartado';
}

interface Plan { id: PlanId; nombre: string; precioMensual: number; vacantesActivas: number | 'ilimitadas'; incluye: string[]; recomendado?: boolean }

interface SolicitudHeadhunting { id: string; empresaId: string; puesto: string; sector: SectorId; vacantes: number; urgencia: string; sueldoRango: string; detalle: string; estado: 'recibida' | 'en_busqueda' | 'finalistas'; reclutador?: string; fecha: string }

interface MensajeWhatsApp { id: string; para: 'empresa' | 'candidato'; destinatarioId: string; regla: 'RN-06' | 'RN-07' | 'RN-08' | 'RN-09'; texto: string; boton?: { texto: string; ruta: string }; hora: string; leido: boolean }
```

## Volumen semilla

| Entidad | Cantidad | Notas |
| --- | --- | --- |
| Sectores | 3 | Salud, Restaurantes y cocinas, Escuelas |
| Empresas | 6 | 2 por sector; 2 en prueba, 3 activas, 1 vencida → "empresas activas" arranca en 2 de 3 para que el registro en vivo complete la meta |
| Vacantes | 14 | Repartidas por sector y zona; 2 vencen en ≤ 5 días; 1 pausada |
| Candidatos | 46 | → "candidatos activos" arranca en 46 de 50; el guion suma 1 en vivo |
| Postulaciones | 60 | En varios estados; postulaciones de los últimos 14 días para la gráfica |
| Solicitudes de headhunting | 2 | Una "en búsqueda", una "recibida" |
| Mensajes WhatsApp | 3 | Historial previo para que el chat no esté vacío |

## Fecha base de la demo

`HOY = 2026-10-30` (día de la presentación). Todas las fechas semilla se calculan relativas a `HOY` con
`date-fns`-like helpers propios (sin dependencia extra). "Avanzar días" mueve `HOY` en el store.

## Catálogos

**Zonas** (alcaldías CDMX + municipios Edomex más comunes): Álvaro Obregón, Azcapotzalco, Benito Juárez, Coyoacán,
Cuauhtémoc, Gustavo A. Madero, Iztacalco, Iztapalapa, Miguel Hidalgo, Tlalpan, Venustiano Carranza, Xochimilco,
Ecatepec, Naucalpan, Nezahualcóyotl, Tlalnepantla, Toluca, Cuautitlán Izcalli, Texcoco, Chalco.

**Puestos sugeridos por sector**
- Salud: Enfermera(o) general, Auxiliar de enfermería, Recepcionista de clínica, Camillero, Químico laboratorista, Cuidador(a) de adulto mayor.
- Restaurantes y cocinas: Cocinero(a), Ayudante de cocina, Mesero(a), Cajero(a), Lavaloza, Barista, Repartidor(a).
- Escuelas: Docente de primaria, Docente de inglés, Auxiliar educativo, Prefecto(a), Personal de intendencia, Asistente administrativo escolar.

**Habilidades sugeridas por sector**
- Salud: Toma de signos vitales, Aplicación de inyectables, Manejo de expediente clínico, Atención al paciente, Primeros auxilios.
- Restaurantes: Manejo higiénico de alimentos, Trabajo bajo presión, Atención al cliente, Manejo de caja, Cocina caliente / fría.
- Escuelas: Planeación didáctica, Manejo de grupo, Inglés intermedio, Paquetería Office, Atención a padres de familia.

**Preguntas de descarte sugeridas**
- Salud: ¿Cuentas con cédula profesional vigente? · ¿Tienes disponibilidad para turno nocturno?
- Restaurantes: ¿Tienes constancia de manejo higiénico de alimentos? · ¿Puedes trabajar fines de semana?
- Escuelas: ¿Cuentas con título o cédula docente? · ¿Tienes experiencia frente a grupo?

## Personajes del guion

Deben existir en la semilla tal cual, porque el guion los usa (ver `10-guion-demo.md`).

| Personaje | Rol | Detalle |
| --- | --- | --- |
| **Mariana López** | Candidata (se registra en vivo) | Enfermera general, Iztapalapa, 4 años de experiencia, turno nocturno |
| **Clínica San Rafael** | Empresa (se registra en vivo) | Salud, tipo hospital o clínica, contacto "Dra. Laura Méndez" |
| **Vacante "Enfermera general — turno nocturno"** | La publica Clínica San Rafael en vivo | Iztapalapa, $14,500/mes, 2 preguntas de descarte; coincide con Mariana (RD-02) y dispara RN-08 |
| **Hospital Santa Fe Norte** | Empresa semilla | Salud, plan Pro activo, 3 vacantes de Salud para que la búsqueda no se vea vacía |
| **La Cocina de Doña Tere** | Empresa semilla | Restaurantes, prueba gratis; 1 vacante que vence en 5 días |
| **Colegio Monte Albán** | Empresa semilla | Escuelas, plan Básico |
