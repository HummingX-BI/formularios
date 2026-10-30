# Decisiones — Demo Talentiamex

Agrega una fila por cada decisión no obvia: de producto, de diseño o técnica. Lo más reciente va abajo.

| Fecha | Decisión | Motivo | Quién |
| --- | --- | --- | --- |
| 2026-10-27 | La demo es solo frontend, en local, presentada por videollamada | Acordado con el cliente; el backend se cotiza aparte | Juan (HummingX) |
| 2026-10-27 | La demo muestra Fase 1 y Fase 2 completas; pagos y WhatsApp simulados | Que el cliente vea el producto completo antes de negociar fases | Juan (HummingX) |
| 2026-10-27 | Se incluye la pantalla de headhunting (P14) aunque el cliente no ha definido el modelo | Es su diferencial; se valida en la llamada | Juan (HummingX) |
| 2026-10-27 | Presentación de 30 min: 20 de recorrido y 10 de preguntas | Duración de la llamada confirmada por Juan | Juan (HummingX) |
| 2026-10-28 | Stack igual a `../demo-pantera`: Vite, React 18, TS, Tailwind 3, React Router, Zustand | El equipo ya lo domina; acelera la entrega | HummingX |
| 2026-10-28 | El cliente pidió React/Next.js y AWS como preferencia, no requisito; la demo no usa Next.js | Para una demo estática Vite es más rápido; la decisión del MVP real se toma después | HummingX |
| 2026-10-28 | Estado persistido en `localStorage` con botón "Reiniciar demo" | Si se recarga la página en plena llamada, no se pierde el avance del guion | HummingX |
| 2026-10-28 | Precios, días de prueba y nombres de planes son provisionales (ver `docs/11-preguntas-abiertas.md`) | El cliente no los ha definido; se marcan como "precio de ejemplo" solo en este documento, no en la UI | HummingX |
| 2026-10-28 | Paleta de Talentiamex provisional, en tokens fáciles de cambiar | El cliente solo tiene logo; se ajusta cuando lo comparta en alta resolución | HummingX |
| 2026-10-28 | Reglas derivadas RD-01 a RD-04 (CV completo, coincidencia, descarte, plan para publicar) | Necesarias para que los flujos sean coherentes; no las pidió el cliente | HummingX |
| 2026-10-28 | El guion cuenta una sola historia: la clínica publica, Mariana recibe el aviso, se postula y la clínica la preselecciona | Conecta todos los módulos y termina con la meta de empresas cumplida en el tablero | HummingX |
| 2026-10-28 | Panel de demo con autollenado, avanzar días y vista celular | Que el recorrido quepa en 20 min sin teclear en vivo | HummingX |
| 2026-10-28 | Botón principal siempre verde; colores fijos por sector (Salud azul, Restaurantes naranja, Escuelas violeta) | Responde a "botones con colores y título que va guiando" | HummingX |
| 2026-10-30 | Tipos auxiliares provisionales: Turno (matutino, vespertino, nocturno, mixto, rotativo), Disponibilidad (inmediata, 15 días, 1 mes, como en docs/06 §P03), Experiencia (puesto, empresa, desde, hasta, descripción) y PlanId (basico, pro, empresa) | docs/08 los menciona pero no los define | HummingX |
| 2026-10-30 | Semilla de empresas: 2 con plan activo, 3 en prueba y 1 vencida; "empresas activas" del tablero cuenta solo plan activo | La tabla de docs/08 (2 prueba + 3 activas) contradice "arranca en 2 de 3"; así Clínica San Rafael llega a 3 de 3 al contratar plan en el paso 7 del guion | HummingX |
| 2026-10-30 | Vigencia de vacante: verde con más de 5 días, ámbar de 1 a 5, rojo con 0 o menos; puedePublicar permite hasta el día de vencimiento del plan | docs no fijan los umbrales; se alinean con los avisos de 5, 3 y 0 días de RN-06 | HummingX |
| 2026-10-30 | Se agrega el estado de plan "sin_plan" (empresa recién registrada, antes de iniciar prueba) | El modelo de docs/08 no cubre el paso entre registrarse y elegir plan en el guion (P02 → P09) | HummingX |
| 2026-10-30 | RN-09 se avisa una vez cuando faltan 3 días o menos para que venza la prueba o el plan; se vuelve a armar al cambiar la fecha de vencimiento | docs no fija el umbral; el guion pide un aviso de prueba por vencer al avanzar 30 días | HummingX |
| 2026-10-30 | Tabla comparativa de P09: búsqueda de perfiles desde Pro y headhunting con descuento solo en Empresa; la prueba gratis se activa sobre el plan recomendado | docs/06 lista las filas pero no qué plan incluye cada una; depende de Q2 | HummingX |
| 2026-10-30 | Se agrega `@playwright/test` como dependencia de desarrollo (`npm run test:e2e`) | Prompt 45: probar el guion de la demo sobre `npm run preview` con el Chromium ya instalado | HummingX |
| 2026-10-30 | Seis colores nuevos `--color-sector-1…6` en `tokens.css` para los sectores que agrega el administrador en P17 | Los colores van en los tokens (regla 12); el color suave se calcula con `color-mix` | HummingX |
| 2026-10-30 | "Contactar" (P12 y P13) simula el envío por WhatsApp con un aviso; no se agrega al chat de P18 | P18 solo define las plantillas RN-06, RN-07, RN-08 y RN-09 | HummingX |
