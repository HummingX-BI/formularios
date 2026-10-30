# Changelog — Demo Talentiamex

## [1.0.0] · 2026-10-30
Primera versión completa de la demo (solo frontend), lista para la presentación.

- **Candidato:** registro, constructor de CV en 5 pasos (foto con recorte circular), 3 plantillas A4
  (Clásica, Moderna, Compacta), pago simulado y descarga real del PDF, búsqueda de vacantes con filtros,
  postulación en un clic con preguntas de descarte y seguimiento de postulaciones.
- **Empresa:** registro, planes con prueba gratis de 14 días, panel con vigencia de 30 días (renovar, pausar,
  editar, cerrar), creación de vacantes con preguntas de descarte, postulantes con CV completo y contacto,
  búsqueda de perfiles y solicitud de headhunting.
- **Administrador:** tablero del piloto (metas 3 empresas y 50 candidatos, gráficas), asignación de
  reclutadores, gestión con suspensión y catálogos de sectores, etiquetas y planes.
- **Avisos por WhatsApp (RN-06 a RN-09):** simulador de celular con animación de escritura, botones que abren la
  pantalla correspondiente, avisos de 5, 3 y 0 días sin duplicados y aviso de prueba por vencer.
- **Panel de demo:** cambio de rol, vista celular, avanzar días, autollenado con los datos del guion,
  simulador de WhatsApp con contador de no leídos y reinicio con confirmación (tecla D para ocultarlo).
- **Calidad:** 39 pruebas unitarias, prueba de extremo a extremo del guion completo (8 pasos) con Playwright,
  script de capturas a 390 y 1280 px, scripts `iniciar.sh` e `iniciar.bat`, manifest PWA.

## [0.1.0] · 2026-10-28
- Documentación inicial: requerimientos v0.1, especificación de pantallas, diseño, datos de ejemplo,
  arquitectura y guion de la demo.
- Contexto para el agente de código (`CLAUDE.md`) y plan de trabajo (`PLAN.md`).
