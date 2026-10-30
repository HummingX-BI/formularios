# Plan de trabajo — Demo Talentiamex

**Entrega:** jueves 29 oct 2026, noche (build de presentación probado).
**Presentación:** viernes 30 oct 2026, videollamada de ~30 min.

Trabaja los hitos en orden. Dentro de cada hito, las pantallas marcadas **[guion]** están en el recorrido
de la presentación (`docs/10-guion-demo.md`) y van primero. Si el tiempo no alcanza, las pantallas sin
**[guion]** pueden quedar más sencillas, pero deben existir y verse terminadas.

## Hito 0 · Base del proyecto
- [x] Crear `app/` con Vite + React 18 + TS + Tailwind 3 (ver `docs/09-arquitectura-demo.md`)
- [x] Tokens de diseño en `app/src/styles/tokens.css` y `tailwind.config.js` (`docs/07-diseno.md`)
- [x] Componentes base en `app/src/ui/`: Button, Card, Badge, SectorChip, Stepper, ProgressBar, Input, Select,
      Textarea, Modal, Toast, EmptyState, Avatar, PhoneFrame
- [x] Layouts por rol: público, candidato (barra inferior en móvil), empresa (barra lateral), administrador
- [x] Router (HashRouter) con todas las rutas de `docs/09` apuntando a pantallas vacías con su título
- [x] Store Zustand con datos semilla (`docs/08-datos-mock.md`), persistencia en `localStorage` y acción `resetDemo()`
- [ ] Panel de demo flotante: cambiar de rol, vista celular, abrir simulador de WhatsApp, avanzar días, reiniciar _(listo salvo el simulador de WhatsApp, prompt 37)_
- [x] Scripts `iniciar.sh` e `iniciar.bat` (como en `../demo-pantera`)

## Hito 1 · Público y acceso
- [x] P01 Inicio **[guion]**
- [x] P02 Registro e inicio de sesión por rol **[guion]**

## Hito 2 · Candidato
- [x] P03 Constructor de CV por pasos **[guion]**
- [x] P04 Plantillas y vista previa (3 plantillas) **[guion]**
- [x] P05 Pago y descarga del PDF **[guion]**
- [x] P06 Buscar vacantes **[guion]**
- [x] P07 Detalle de vacante y postulación con preguntas de descarte **[guion]**
- [x] P08 Mis postulaciones

## Hito 3 · Empresa
- [x] P09 Planes y prueba gratis **[guion]**
- [x] P10 Panel de la empresa **[guion]**
- [x] P11 Crear vacante con preguntas de descarte **[guion]**
- [x] P12 Postulantes de una vacante **[guion]**
- [ ] P14 Solicitar headhunting **[guion]**
- [x] P13 Buscar perfiles y contactar

## Hito 4 · Avisos por WhatsApp
- [ ] P18 Simulador de WhatsApp (celular con conversación) **[guion]**
- [ ] Disparadores: postulación nueva → aviso a empresa; vacante publicada que coincide → aviso a candidato;
      "avanzar días" en panel de demo → recordatorios 5, 3 y 0 días y suscripción por vencer

## Hito 5 · Administrador
- [ ] P15 Tablero del piloto **[guion]**
- [ ] P16 Gestión de empresas, usuarios y vacantes
- [ ] P17 Sectores, etiquetas y planes

## Hito 6 · Pulido y ensayo
- [ ] Recorrer el guion completo 2 veces sin recargar y sin errores en consola
- [ ] Revisar todas las pantallas a 390 px y 1280 px (capturas con Playwright en `app/screenshots/`)
- [ ] Manifest PWA e ícono (para que se vea "instalable")
- [ ] Estados vacíos, de carga simulada (300–600 ms) y de éxito en cada acción
- [ ] `npm run typecheck && npm run lint && npm run build` sin errores
- [ ] Actualizar `CHANGELOG.md` a v1.0.0

## Siguiente paso
Hito 0: crear el proyecto en `app/`.
