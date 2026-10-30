# 01 · Visión y alcance

> Versión 0.1 (nivel demo) · 2026-10-27 · Fuentes: `fuentes/convocatoria.md`, `fuentes/respuestas-cuestionario.md`

## Estándares de referencia

Se toma de cada uno la parte útil para un MVP, sin seguirlos al pie de la letra.

| Para qué | Estándar | Qué se toma |
| --- | --- | --- |
| Estructura de requerimientos | ISO/IEC/IEEE 29148:2018 | Secciones: alcance, actores, funcionales, no funcionales, supuestos |
| Requerimientos no funcionales | ISO/IEC 25010:2023 | Sus 9 características de calidad como lista de verificación |
| Historias de usuario | "Como… quiero… para…" + INVEST | Historias independientes, negociables, valiosas, estimables, pequeñas y probables |
| Criterios de aceptación | Gherkin | Dado / Cuando / Entonces |
| Prioridad | MoSCoW | Debe · Debería · Podría · No por ahora |

**Convención de IDs:** RN = regla de negocio · RF = requerimiento funcional · RNF = no funcional ·
E = épica · HU = historia (HU-4.2 = épica 4, historia 2) · P = pantalla.

## Visión

Talentiamex une en una sola plataforma a candidatos y empresas de sectores con alta rotación, y suma un
servicio especializado de headhunting. El MVP busca validar el modelo con un piloto real en CDMX y Estado de México.

- **Problema:** candidatos y empresas usan hoy servicios separados para armar CV, publicar vacantes y contactarse.
- **Diferencial (palabras del cliente):** "juntar servicios ya existentes por separado en una sola plataforma.
  Servicio especializado de headhunting."
- **Meta de éxito a 3 meses del lanzamiento (definida por el cliente):** al menos **3 empresas** usando el servicio
  y al menos **50 candidatos**.
- **Punto de partida:** ya hay empresas listas para un piloto. Se lanza con candidatos y empresas al mismo tiempo,
  sin fecha fija.
- **Petición de experiencia (palabras del cliente):** "Que sea un espacio dinámico, sencillo de entender. Botones con
  colores y título que va guiando al usuario y empresas en su proceso."

## Alcance

| | Dentro del MVP | Fuera del MVP (por ahora) |
| --- | --- | --- |
| Sectores | Salud, Restaurantes y cocinas, Escuelas | Otros sectores |
| Zona | CDMX y Estado de México | Resto del país |
| Candidato | Registro, CV por pasos, 3 plantillas PDF, búsqueda, postulación en un clic | Pruebas psicométricas, videoentrevistas |
| Empresa | Vacantes, preguntas de descarte, revisión de postulantes, búsqueda de perfiles, suscripción por niveles con prueba gratis | Integración con sistemas de RH o nómina |
| Cobros | Pago por descarga de CV y suscripciones | Facturación CFDI (el cliente la descartó para la primera versión) |
| Avisos | WhatsApp: vencimiento de vacante, nuevo candidato, vacante que coincide, suscripción por vencer | Chat dentro de la plataforma |
| Legal | Espacio para aviso de privacidad y términos | Redacción del aviso y los términos (abogado del cliente) |

## Fases

1. **Fase 1 · Piloto.** Cuentas, CV con PDF de pago, vacantes, búsqueda por sector, postulación en un clic,
   preguntas de descarte y panel de administración.
2. **Fase 2 · Escalar.** Suscripciones con niveles y prueba gratis, y avisos automáticos por WhatsApp.

**La demo muestra ambas fases**, con pagos y WhatsApp simulados.
