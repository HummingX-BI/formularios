# Decisiones de Implementación — Demo Pantera

Registro de decisiones tomadas durante la construcción del Panel de Administración Inteligente para Club Azulejo.

| Fecha       | Prompt | Decisión | Motivo |
|-------------|--------|----------|--------|
| 2026-09-30  | 1      | Usar React 18 en lugar de React 19 (que ofrece Vite por defecto) | La especificación solicita explícitamente React 18. Se fijó `react@^18.3.1` y `react-dom@^18.3.1`. |
| 2026-09-30  | 1      | Reemplazar oxlint con ESLint | El scaffold de Vite ahora trae oxlint por defecto, pero la especificación pide ESLint. Se configuró `eslint@9` con `typescript-eslint` en modo estricto. |
| 2026-09-30  | 1      | Usar Inter + Outfit como fuentes | La especificación pide fuentes empaquetadas con `@fontsource`. Inter es la fuente del cuerpo, Outfit es la fuente display para títulos. Coherente con el estilo del cuestionario de recepción existente. |
| 2026-09-30  | 1      | Paleta "azulejo" basada en teal/pool blue | Sin paleta explícita en el documento, se eligió un teal profundo que evoca agua/alberca y se siente premium en dark mode. Se alinea con el nombre "Club Azulejo" (que remite a azulejos de alberca). |
| 2026-09-30  | 1      | Dark mode como tema por defecto | La especificación menciona diseño premium para impresionar a un empresario. Dark mode con glassmorphism y gradientes transmite sofisticación. |
| 2026-09-30  | 1      | PRNG Mulberry32 con seed=42 | Se necesita un generador determinista. Mulberry32 es simple, rápido y tiene buen período (2^32). Seed=42 es la constante universal. |
| 2026-09-30  | 1      | Paquetes y niveles inferidos del cuestionario de recepción | El cuestionario de Club Azulejo menciona paquetes, niveles, instructores. Se crearon valores realistas (Acuabebés, Iniciación, Intermedio, Avanzado, Equipo Competitivo, Adultos) con precios coherentes para una escuela de natación en México. |
| 2026-09-30  | 1      | El documento "Requerimientos y Alcance v2.0" no existe como archivo, se trata el prompt como fuente de verdad | No se encontró un archivo separado en el workspace. El contenido de la especificación se interpreta como la fuente de verdad y los códigos (D-05, H3, etc.) se manejarán conforme se referencien en prompts futuros. |
| 2026-09-30  | 1      | TypeScript 5.6 en lugar de 6.0 | Vite scaffoldeó con TS 6.0 pero el ecosistema (@types/react 18, etc.) requiere TS 5.x. Se ajustó a `~5.6.3`. |
