# 06 · Especificación de pantallas (P01–P18)

Guía principal para construir. Cada ficha dice: ruta, rol, historias, **título guiado** (RNF-01), contenido,
**botón principal** (la acción de color), acciones secundarias, estados y criterios de terminado.

Convenciones para todas las pantallas:
- **Título guiado:** encabezado grande + subtítulo de una línea que dice qué hacer aquí.
- **Botón principal:** uno solo por pantalla, color `--color-accion` (ver `07-diseno.md`), texto con verbo
  ("Guardar y seguir", "Publicar vacante"). En móvil va fijo al fondo de la pantalla.
- **Chips de sector:** cada sector tiene su color (Salud, Restaurantes, Escuelas). Se usan en tarjetas, filtros y etiquetas.
- **Carga simulada:** cada acción que en el producto real iría al servidor muestra 300–600 ms de carga y luego un toast de éxito.

---

## Público

### P01 · Inicio
- **Ruta:** `/` · **Rol:** público · **Historias:** —
- **Objetivo:** que en 5 segundos se entienda qué es Talentiamex y elegir camino.
- **Título guiado:** "Encuentra trabajo o talento en Salud, Restaurantes y Escuelas" / "Elige cómo quieres empezar".
- **Contenido:**
  - Logo de Talentiamex (placeholder SVG hasta tener el real).
  - Dos tarjetas grandes de elección: **"Busco trabajo"** (crea tu CV gratis y postúlate en un clic) y
    **"Busco talento"** (publica vacantes y encuentra candidatos filtrados).
  - Franja de los 3 sectores con su color e ícono (lucide: `HeartPulse`, `ChefHat`, `GraduationCap`).
  - 3 beneficios cortos: "CV profesional en minutos", "Postúlate en un clic", "Avisos por WhatsApp".
  - Bloque de headhunting: "¿Puesto difícil de cubrir? Nuestros especialistas lo buscan por ti" → lleva a P02 empresa.
  - Pie: aviso de privacidad y términos (enlaces a páginas placeholder), "Iniciar sesión".
- **Botón principal:** cada tarjeta es un botón (dos acciones de igual peso; excepción permitida).
- **Terminado:** se ve completa sin scroll en 1280×800; en 390 px las tarjetas se apilan.

### P02 · Registro e inicio de sesión
- **Rutas:** `/registro/candidato`, `/registro/empresa`, `/entrar` · **Rol:** público · **Historias:** HU-1.1, HU-1.2, HU-1.3
- **Título guiado:** "Crea tu cuenta" / "Te toma menos de un minuto".
- **Contenido:**
  - Pestañas: Candidato · Empresa.
  - Candidato: nombre, celular (10 dígitos), correo, contraseña, casilla de aceptar aviso de privacidad.
  - Empresa: nombre del negocio, sector (chips), tipo (PYME, cadena o franquicia, hospital o clínica, escuela),
    nombre del contacto, celular, correo, contraseña, casilla de aviso.
  - `/entrar`: correo + contraseña, enlace "¿Olvidaste tu contraseña?" (abre toast "Te enviamos un enlace").
  - Enlace discreto "Acceso administrador" en el pie de `/entrar`.
- **Botón principal:** "Crear mi cuenta" / "Entrar".
- **Simulación:** cualquier dato válido entra. Validaciones visibles (formato de celular y correo, campos requeridos).
  Al registrar candidato → P03. Al registrar empresa → P09. Admin → P15.
- **Terminado:** errores en línea bajo cada campo; el botón muestra carga y luego navega.

---

## Candidato

Layout: barra inferior en móvil con 4 accesos (Inicio/Vacantes, Mi CV, Postulaciones, Perfil); barra superior en escritorio.

### P03 · Constructor de CV por pasos
- **Ruta:** `/candidato/cv/paso/:n` (n = 1…5) · **Historias:** HU-2.1, HU-2.2
- **Título guiado:** "Paso n de 5 · <nombre del paso>" / una línea de ayuda por paso.
- **Barra de avance** arriba con los 5 pasos y porcentaje.
- **Pasos:**
  1. **Tus datos:** nombre, celular, correo (precargados del registro), alcaldía o municipio (lista CDMX + Edomex),
     **foto opcional** (subir imagen local, recorte circular, botón "Omitir").
  2. **Qué buscas:** sector (chips de color, uno), puesto deseado (sugerencias según sector), sueldo mensual esperado,
     turno (matutino, vespertino, nocturno, mixto), disponibilidad (inmediata, 15 días, 1 mes).
  3. **Experiencia:** lista de experiencias (puesto, lugar, desde–hasta, qué hacías). Botón "Agregar otra".
     Casilla "Aún no tengo experiencia" (cumple RD-01).
  4. **Estudios y documentos:** nivel de estudios, institución, y "Documentos o certificaciones" con
     sugerencias según sector (Salud: cédula profesional; Restaurantes: constancia de manejo de alimentos;
     Escuelas: título o cédula docente). Todo opcional (pregunta abierta Q6).
  5. **Habilidades y resumen:** chips de habilidades sugeridas por sector + texto libre; resumen de 2–3 líneas con
     ejemplo en el placeholder.
- **Botón principal:** "Guardar y seguir" (pasos 1–4), "Ver mi CV" (paso 5 → P04). Botón secundario "Atrás".
- **Guardado:** cada paso se guarda en el store al avanzar (sin perder datos al ir atrás).
- **Terminado:** cumple ★HU-2.1; en 390 px el botón queda fijo al fondo y el teclado no lo tapa.

### P04 · Plantillas y vista previa
- **Ruta:** `/candidato/cv` · **Historias:** HU-2.3, HU-2.5
- **Título guiado:** "¡Tu CV está listo!" / "Elige el diseño que más te guste".
- **Contenido:**
  - Selector de 3 plantillas con miniatura: **Clásica** (una columna, sobria), **Moderna** (columna lateral de color
    del sector, foto circular), **Compacta** (todo en una hoja, ideal para operativos).
  - Vista previa a tamaño real (A4 escalado) con los datos del candidato; cambia al instante al tocar otra plantilla.
  - Tarjeta "Tu perfil es visible para empresas de <sector>" con interruptor (RN-04/HU-2.5).
  - Indicador de CV completo (RD-01) con lo que falta si no está completo.
- **Botón principal:** "Descargar PDF · $<precio>" → P05. Secundarios: "Editar CV" (P03), "Buscar vacantes" (P06).
- **Terminado:** cumple ★HU-2.3; las 3 plantillas se ven profesionales con datos largos y cortos.

### P05 · Pago y descarga del CV
- **Ruta:** modal sobre P04 (`/candidato/cv/pagar`) · **Historias:** HU-2.4
- **Título guiado:** "Descarga tu CV" / "Pago único, descárgalo las veces que quieras".
- **Contenido:** resumen (plantilla elegida, precio), métodos: tarjeta (formulario con número, vencimiento, CVV),
  y botón tipo pasarela. Leyenda "Pago seguro procesado por la pasarela" (RNF-06). Sin marcas reales de pasarela
  hasta que el cliente confirme cuál usa.
- **Botón principal:** "Pagar $<precio>".
- **Simulación:** acepta cualquier tarjeta de 16 dígitos; 1.2 s de "Procesando…", luego pantalla de éxito con
  check animado y el PDF **se descarga de verdad** (jspdf + html2canvas a partir de la plantilla).
  Tras pagar, el botón de P04 cambia a "Descargar de nuevo" sin cobrar.
- **Terminado:** cumple ★HU-2.4; el PDF abre bien y se ve igual que la vista previa.

### P06 · Buscar vacantes
- **Ruta:** `/candidato/vacantes` · **Historias:** HU-4.1
- **Título guiado:** "Vacantes para ti" / "Filtra por sector y zona".
- **Contenido:** filtros (sector con chips, alcaldía o municipio, turno, sueldo mínimo); pestaña
  "Recomendadas" (coinciden con RD-02) y "Todas"; tarjetas de vacante (puesto, empresa, sector chip, zona,
  sueldo, turno, "hace 2 días", etiqueta "Coincide contigo" si aplica, "Ya te postulaste" si aplica).
- **Botón principal:** en cada tarjeta, "Ver vacante".
- **Estados:** sin resultados → estado vacío con "Quitar filtros".

### P07 · Detalle de vacante y postulación
- **Ruta:** `/candidato/vacantes/:id` · **Historias:** HU-4.2
- **Título guiado:** "<Puesto> en <Empresa>" / "Revisa los detalles y postúlate".
- **Contenido:** datos de la vacante, descripción, requisitos, prestaciones, vigencia ("quedan 24 días") y zona
  en texto (sin mapa).
- **Botón principal:** "Postularme en un clic".
- **Flujo al tocarlo:**
  1. Si el CV no está completo (RD-01) → modal "Te falta completar: …" con botón "Completar mi CV" (P03).
  2. Si la vacante tiene preguntas de descarte → hoja inferior con cada pregunta (Sí/No) y botón "Enviar postulación".
  3. Confirmación: "¡Listo! Tu postulación llegó a <Empresa>" + "Te avisaremos por WhatsApp". Dispara aviso RN-07 a la empresa.
- **Terminado:** cumple ★HU-4.2; el botón cambia a "Ya te postulaste" y no permite duplicar.

### P08 · Mis postulaciones
- **Ruta:** `/candidato/postulaciones` · **Historias:** HU-4.3
- **Título guiado:** "Tus postulaciones" / "Aquí ves cómo vas en cada vacante".
- **Contenido:** lista con puesto, empresa, fecha y estado con color: Enviada, En revisión, Preseleccionado,
  No seleccionado. El estado cambia cuando la empresa actúa en P12.
- **Estados:** vacío → "Aún no te postulas" + botón "Buscar vacantes".

---

## Empresa

Layout: barra lateral en escritorio (Panel, Vacantes, Buscar perfiles, Headhunting, Plan); menú inferior en móvil.
Encabezado con nombre de la empresa, chip de su plan y días restantes de prueba.

### P09 · Planes y prueba gratis
- **Ruta:** `/empresa/planes` · **Historias:** HU-6.1, HU-6.2
- **Título guiado:** "Elige tu plan" / "Empieza con una prueba gratis de <N> días, sin tarjeta".
- **Contenido:** 3 tarjetas de plan (nombres, precios y límites provisionales en `11-preguntas-abiertas.md`);
  el del medio marcado "Recomendado"; tabla comparativa corta debajo (vacantes activas, búsqueda de perfiles,
  preguntas de descarte, avisos por WhatsApp, headhunting con descuento).
- **Botón principal:** "Probar gratis <N> días" en el plan recomendado. Secundario en cada plan: "Contratar".
- **Simulación:** "Probar gratis" activa la prueba y lleva a P10 con banner "Tu prueba termina el <fecha>".
  "Contratar" abre el mismo modal de pago de P05 con cobro mensual.
- **Terminado:** cumple ★HU-6.1.

### P10 · Panel de la empresa
- **Ruta:** `/empresa` · **Historias:** HU-3.3, HU-3.4
- **Título guiado:** "Hola, <Empresa>" / "Esto es lo que pasa con tus vacantes hoy".
- **Contenido:**
  - 4 indicadores: vacantes activas, postulantes nuevos, preseleccionados, días de prueba o plan.
  - Lista de vacantes: puesto, sector chip, postulantes (nuevos en rojo), **barra de vigencia de 30 días con días
    restantes** (verde > 5, ámbar 1–5, rojo vencida), acciones: Ver postulantes, Renovar, Pausar, Editar, Cerrar.
  - Si hay vacantes por vencer: banner ámbar "2 vacantes vencen en 5 días" con botón "Renovar".
- **Botón principal:** "Publicar vacante" → P11.
- **Terminado:** Renovar devuelve la vigencia a 30 días con toast; Pausar la oculta de P06. Si la prueba o el plan
  ya venció (RD-04), Renovar abre un modal "Tu prueba terminó, elige un plan para seguir" que lleva a P09 y,
  al contratar, regresa y renueva (paso 7 del guion).

### P11 · Crear vacante
- **Ruta:** `/empresa/vacantes/nueva` · **Historias:** HU-3.1, HU-3.2
- **Título guiado:** "Paso n de 3 · <nombre>" con barra de avance.
- **Pasos:** 1. **Datos** (puesto, sector, alcaldía o municipio, sueldo mensual, turno, tipo de contrato, descripción,
  requisitos, prestaciones). 2. **Preguntas de descarte** (agregar hasta 5 preguntas Sí/No con respuesta esperada;
  sugerencias por sector, p. ej. Salud: "¿Cuentas con cédula profesional vigente?"). 3. **Revisar y publicar**
  (vista previa como la verá el candidato + "Vigencia: 30 días, vence el <fecha>").
- **Botón principal:** "Siguiente" y al final "Publicar vacante".
- **Al publicar:** carga, toast, regreso a P10; la vacante aparece en P06; si coincide con un candidato (RD-02)
  se dispara aviso RN-08.
- **Terminado:** cumple ★HU-3.1 y ★HU-3.2. Sin plan ni prueba activa (RD-04) → modal que lleva a P09.

### P12 · Postulantes de una vacante
- **Ruta:** `/empresa/vacantes/:id/postulantes` · **Historias:** HU-5.1
- **Título guiado:** "<n> postulantes para <Puesto>" / "Revisa y decide quién avanza".
- **Contenido:** pestañas por estado (Nuevos, En revisión, Preseleccionados, Descartados); tarjeta por postulante:
  foto o iniciales, nombre, zona, experiencia en años, **badge "Cumple descarte" (verde) o "No cumple" (rojo)**
  con detalle de respuestas; panel lateral (o pantalla en móvil) con el CV completo en la plantilla elegida.
- **Acciones por postulante:** Preseleccionar (principal), Descartar, Contactar (abre WhatsApp simulado o correo).
  Cambiar estado actualiza P08 del candidato.
- **Terminado:** cumple ★HU-5.1.

### P13 · Buscar perfiles
- **Ruta:** `/empresa/perfiles` · **Historias:** HU-5.2
- **Título guiado:** "Busca talento" / "Encuentra perfiles aunque no se hayan postulado".
- **Contenido:** filtros (sector, puesto, zona, disponibilidad, etiquetas de habilidades); tarjetas de perfil
  (solo perfiles visibles, RN-04); vista del CV.
- **Botón principal:** en cada perfil, "Contactar" → modal con mensaje prellenado y "Enviar por WhatsApp" (simulado).

### P14 · Solicitar headhunting
- **Ruta:** `/empresa/headhunting` · **Historias:** HU-8.4
- **Título guiado:** "Headhunting especializado" / "Nuestros reclutadores buscan por ti el perfil difícil".
- **Contenido:** 3 pasos visuales de cómo funciona (cuéntanos el puesto → buscamos y filtramos → te presentamos
  finalistas); formulario: puesto, sector, número de vacantes, urgencia (esta semana, 2 semanas, 1 mes),
  rango de sueldo, qué lo hace difícil de cubrir; lista "Mis solicitudes" con estado (Recibida, En búsqueda,
  Finalistas enviados).
- **Botón principal:** "Enviar solicitud". La solicitud aparece en P15 del administrador.
- **Nota:** el modelo comercial del headhunting está por definir (Q1). No mostrar precio.

---

## Administrador

Layout: barra lateral oscura (navy) para distinguirlo de la empresa.

### P15 · Tablero del piloto
- **Ruta:** `/admin` · **Historias:** HU-8.1, HU-8.4
- **Título guiado:** "Tablero del piloto" / "¿Vamos hacia la meta?".
- **Contenido:**
  - **Dos medidores de meta grandes:** Empresas activas **x / 3** y Candidatos activos **x / 50** (barras de progreso con %).
  - Indicadores: vacantes activas, postulaciones de la semana, CV descargados, ingresos de la demo (descargas + planes).
  - Gráfica sencilla de postulaciones por día (últimos 14 días) y barras por sector.
  - **Solicitudes de headhunting:** tabla con empresa, puesto, urgencia, estado y acción "Asignar reclutador".
- **Terminado:** cumple ★HU-8.1; los números cambian en vivo cuando en la demo se registra alguien o se postula.

### P16 · Gestión de empresas, usuarios y vacantes
- **Ruta:** `/admin/gestion` · **Historias:** HU-8.2
- **Título guiado:** "Gestión" / "Empresas, candidatos y vacantes de la plataforma".
- **Contenido:** pestañas con tablas buscables: Empresas (plan, estado, vacantes), Candidatos (sector, CV completo,
  visible), Vacantes (empresa, vigencia, postulantes). Acciones: ver, suspender/activar.

### P17 · Sectores, etiquetas y planes
- **Ruta:** `/admin/catalogos` · **Historias:** HU-8.3
- **Título guiado:** "Catálogos" / "Agrega sectores y ajusta planes sin programar".
- **Contenido:** lista de sectores con color e ícono + "Agregar sector" (el nuevo aparece en filtros de P06/P13);
  etiquetas de habilidades por sector; planes con nombre, precio y límites editables (se reflejan en P09).
- **Terminado:** cumple RNF-09 en la demo.

---

## Demo

### P18 · Simulador de WhatsApp
- **Ruta:** panel lateral deslizable sobre cualquier pantalla (se abre desde el panel de demo) · **Historias:** HU-7.1 a HU-7.4
- **Contenido:** marco de celular (`PhoneFrame`) con conversación estilo WhatsApp del número "Talentiamex"
  (foto = logo, palomitas azules, hora). Selector arriba: ver como **Empresa** o como **Candidato**.
- **Mensajes (plantillas):**
  - RN-07 a empresa: "👋 Hola, <Contacto>. Tienes un nuevo postulante para *<Puesto>*: <Nombre>, <años> años de experiencia. [Ver postulante]"
  - RN-08 a candidato: "Hola, <Nombre>. Hay una vacante que coincide contigo: *<Puesto>* en <Empresa>, <Zona>. [Postularme]"
  - RN-06 a empresa (5, 3 y 0 días): "⏰ Tu vacante *<Puesto>* vence en <n> días. Renuévala para seguir recibiendo candidatos. [Renovar]" / día 0: "Tu vacante *<Puesto>* vence hoy…"
  - RN-09 a empresa: "Tu plan <Plan> vence el <fecha>. [Ver mi plan]"
- **Botones del mensaje:** llevan a la pantalla correspondiente de la demo (P12, P07, P10, P09).
- **Avanzar días** (en el panel de demo): +1 día, +5 días; dispara los recordatorios que correspondan sin duplicar (RNF-07).
- **Terminado:** cumple ★HU-7.1; cada evento del guion genera su mensaje con animación de "escribiendo…".
