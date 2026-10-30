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
├── DEPLOY.md                      Cómo publicar la demo
├── cuestionario-talentiamex.html  Cuestionario diagnóstico enviado al cliente
├── docs/                          Requerimientos, diseño, datos, arquitectura, guion
│   └── fuentes/                   Convocatoria y respuestas del cliente (originales)
└── app/                           Código de la demo (React + TypeScript + Tailwind)
```

## Correr la demo

```bash
cd Talentiamex/app
npm install
npm run build
npm run preview      # abre http://localhost:4173
```

Atajo: `app/iniciar.bat` (Windows) o `app/iniciar.sh` compilan, levantan el servidor en el puerto 4173 y abren el navegador.
Para desarrollo: `npm run dev`. Pruebas: `npm test` (unitarias) y `npm run test:e2e` (guion completo con Playwright).

## Antes de la llamada

1. **Reiniciar la demo.** Abre el panel de demo (botón redondo abajo a la izquierda, o tecla `D` para ocultarlo y
   mostrarlo) → **Reiniciar demo** → confirma. Todo vuelve al estado inicial y la fecha al 30 oct 2026.
   Hazlo justo antes de empezar y de nuevo si quieres repetir el recorrido.
2. **Activar la vista celular.** En el mismo panel, toca **Vista celular**: la app se ve dentro de un celular de
   390 × 844 px (ideal para la parte de la candidata). Vuelve a tocar el botón para salir. Con esa vista abierta,
   cambiar de rol desde el panel también cambia lo que se ve en el celular.
3. **Tener el respaldo abierto.** Levanta una segunda copia con `npm run preview -- --port 4174` y déjala abierta en
   otra pestaña (`http://localhost:4174`). Cada puerto guarda su propio estado, así que si algo falla en la
   principal puedes seguir en el respaldo con **Reiniciar demo** y el botón **Autollenar formulario**.

Lista rápida: batería y conexión a la corriente, notificaciones apagadas, navegador a pantalla completa y un
ensayo previo con `npm run test:e2e`.

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
