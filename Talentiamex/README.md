# Talentiamex — Demo del MVP

Demo navegable (solo frontend) de **Talentiamex**, plataforma de reclutamiento para sectores de alta rotación
en México. Preparada por **HummingX BI** para presentarse al cliente el viernes 30 de octubre de 2026.

## Contenido de la carpeta

```
Talentiamex/
├── CLAUDE.md                      Reglas y contexto para el agente de código
├── PLAN.md                        Plan de trabajo por hitos
├── DECISIONS.md                   Registro de decisiones
├── CHANGELOG.md                   Cambios por versión
├── cuestionario-talentiamex.html  Cuestionario diagnóstico enviado al cliente
├── docs/                          Requerimientos, diseño, datos, arquitectura, guion
│   └── fuentes/                   Convocatoria y respuestas del cliente (originales)
└── app/                           Código de la demo (lo crea el agente en el hito 0)
```

## Correr la demo

```bash
cd Talentiamex/app
npm install
npm run build
npm run preview      # abre http://localhost:4173
```

Para desarrollo: `npm run dev`.

## Qué es real y qué es simulado

| Real | Simulado |
| --- | --- |
| Navegación, formularios, filtros, vista previa del CV en 3 plantillas, descarga del PDF | Inicio de sesión |
| Diseño guiado, responsive en celular y computadora | Pagos (descarga de CV y suscripciones) |
| Contador de días de cada vacante | Avisos de WhatsApp (simulador de celular) |
| Tablero del piloto | Guardado (vive en el navegador; se reinicia desde el panel de demo) |

## Documento maestro

La versión editable de los requerimientos vive en el documento compartido "Talentiamex MVP — Requerimientos
para demo" (HummingX BI). Los archivos de `docs/` son su copia de trabajo para el agente, más el detalle técnico.
Si cambian los requerimientos, actualiza ambos.

---
*Propiedad de HummingX BI. Confidencial.*
