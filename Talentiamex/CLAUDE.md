# CLAUDE.md — Demo Talentiamex (HummingX BI)

Lee este archivo completo antes de escribir código. Es la fuente de reglas del proyecto.

## Qué vas a construir

Una **demo navegable, solo frontend**, del MVP de **Talentiamex**: una plataforma web (PWA, móvil primero)
de reclutamiento para sectores de alta rotación en México (Salud, Restaurantes y cocinas, Escuelas).
Une candidatos con empresas y suma un servicio especializado de headhunting.

- **Cliente:** Luis A. Pichardo, fundador de Talentiamex.
- **Proveedor:** HummingX BI.
- **Presentación:** viernes 30 de octubre de 2026, por videollamada de ~30 min, corriendo en local.
- **Objetivo de la demo:** que el cliente vea su producto funcionando de punta a punta y que HummingX
  entre a negociación con el alcance claro. Tiene que verse terminado, atractivo y profesional.

**No hay backend.** Sin base de datos, sin servidor, sin pagos reales, sin WhatsApp real, sin llamadas a APIs
externas. Todo corre en el navegador con datos de ejemplo y simuladores.

## Dónde está cada cosa

| Archivo | Para qué |
| --- | --- |
| `docs/01-vision-alcance.md` | Problema, meta del piloto, qué entra y qué no, fases |
| `docs/02-actores-reglas.md` | Roles y reglas de negocio RN-01 a RN-14 |
| `docs/03-requerimientos.md` | Funcionales RF-01 a RF-32, no funcionales RNF-01 a RNF-09, restricciones |
| `docs/04-epicas-historias.md` | Épicas E1–E8, historias HU con criterios Dado/Cuando/Entonces |
| `docs/05-flujos.md` | Flujos de candidato, empresa, sistema y administrador (Mermaid) |
| `docs/06-pantallas.md` | **Especificación pantalla por pantalla P01–P18. Tu guía principal para construir.** |
| `docs/07-diseno.md` | Sistema visual: tokens, colores por sector, tipografía, componentes |
| `docs/08-datos-mock.md` | Modelo de datos de ejemplo y registros semilla |
| `docs/09-arquitectura-demo.md` | Stack, estructura de carpetas, rutas, estado, simuladores |
| `docs/10-guion-demo.md` | Guion de 30 min que la demo debe soportar sin fallas |
| `docs/11-preguntas-abiertas.md` | Lo que el cliente aún no define y el valor provisional que usamos |
| `docs/fuentes/` | Convocatoria original y respuestas del cuestionario (no editar) |
| `PLAN.md` | Orden de trabajo por hitos con checklist. **Márcalo conforme avances.** |
| `DECISIONS.md` | Registro de decisiones. **Agrega una fila por cada decisión no obvia.** |
| `CHANGELOG.md` | Cambios por versión |

Orden de lectura la primera vez: este archivo → `PLAN.md` → `docs/06-pantallas.md` → `docs/07-diseno.md`
→ `docs/09-arquitectura-demo.md` → `docs/08-datos-mock.md`. Consulta los demás cuando la tarea los toque.

## Reglas

### Alcance
1. **No inventes requerimientos.** Si algo no está en `docs/`, pregunta o usa el valor provisional de
   `docs/11-preguntas-abiertas.md`. Si tienes que suponer, registra la suposición en `DECISIONS.md`.
2. Cada pantalla lleva su ID (`P01`…`P18`) en el nombre del componente o en un comentario de cabecera,
   y la lista de historias (`HU-x.y`) que cubre.
3. Todo lo simulado (login, pagos, WhatsApp, guardado) debe **verse real** para el cliente. No muestres textos
   como "mock" o "fake" en la UI. La única pista permitida es el panel de demo (ver `docs/09`).
4. Trabaja **solo dentro de la carpeta `Talentiamex/`**. No toques otras carpetas del repo.

### Producto
5. **Móvil primero.** Diseña cada pantalla de candidato a 390 px y luego escala. Empresa y administrador
   se usan sobre todo en computadora, pero también deben funcionar en celular.
6. **Interfaz guiada** (petición expresa del cliente): cada pantalla tiene un título que dice dónde está el usuario
   y qué sigue, y un botón principal de color que indica la siguiente acción. Los procesos de varios pasos
   llevan barra de avance.
7. Lenguaje sencillo, en **español de México**, sin tecnicismos. Usa "tú" en toda la plataforma
   (candidatos y empresas), salvo que `DECISIONS.md` diga otra cosa.
8. Formatos: moneda `$1,234 MXN` con `Intl.NumberFormat('es-MX')`; fechas `28 oct 2026`; teléfonos `55 1234 5678`.
9. Accesibilidad básica: contraste AA, `alt` en imágenes, foco visible, botones con texto (no solo íconos).

### Código
10. Stack fijo (el mismo de `../demo-pantera`): **Vite + React 18 + TypeScript + Tailwind CSS 3 + React Router
    (HashRouter) + Zustand + lucide-react + framer-motion**. Para PDF: `jspdf` + `html2canvas`.
    No agregues otras dependencias sin registrarlo en `DECISIONS.md`.
11. TypeScript estricto. Sin `any` salvo justificación en comentario.
12. Colores y medidas siempre desde los tokens de `docs/07-diseno.md` (variables CSS + `tailwind.config.js`).
    Nada de colores hex sueltos en los componentes.
13. Los datos de ejemplo viven en `app/src/data/` y se cargan al store. Ningún componente define datos de negocio en línea.
14. Componentes pequeños y reutilizables en `app/src/ui/`. Las pantallas en `app/src/screens/<rol>/`.

### Definición de terminado (por pantalla)
- [ ] Cumple todo lo de su ficha en `docs/06-pantallas.md` y los criterios de sus historias.
- [ ] Se ve bien a 390 px y a 1280 px.
- [ ] `npm run typecheck`, `npm run lint` y `npm run build` pasan sin errores.
- [ ] El flujo del guion (`docs/10-guion-demo.md`) que pasa por ella funciona sin recargar.
- [ ] `PLAN.md` actualizado.

## Comandos

```bash
cd Talentiamex/app
npm install
npm run dev        # desarrollo
npm run build      # compilar
npm run preview    # versión de presentación (puerto 4173)
npm run typecheck
npm run lint
```

## Cuando termines una sesión de trabajo

1. Marca en `PLAN.md` lo terminado.
2. Agrega a `DECISIONS.md` lo que decidiste.
3. Agrega a `CHANGELOG.md` un resumen.
4. Deja en `PLAN.md`, sección "Siguiente paso", qué toca después.


## Modo ahorro (obligatorio)

1. Lee solo los archivos y secciones que el prompt indique.
2. No explores el repo ni ../demo-pantera salvo que se pida.
3. No muestres código en la respuesta, solo resume.
4. Corre typecheck y build una sola vez, al final.
5. Al terminar cada prompt: marca PLAN.md, commit "feat(talentiamex): <qué>" y push.
6. Responde en máximo 5 líneas: qué hiciste, archivos clave, pendiente.