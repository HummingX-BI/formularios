# Changelog Pantera Demo

## [1.0.0] - 2026-10-04

### Added
- **58 Submódulos Funcionales**: Todas las áreas desde Centro de Mando hasta Machine Learning y Prescriptivo.
- **Motor Generador In-Browser (Seed Engine)**: Generación matemática de base de datos de 500 alumnos en 200ms al vuelo sin backend.
- **Modo Presentación (Flujo G)**: Atajo `P` y guiado de 15 minutos en la UI para presentadores.
- **Auditoría Estricta**: Pruebas automáticas (Vitest) para consistencia de datos, A11y (Axe-core) y ML Predictivo.
- **Soporte Offline 100%**: Web Workers en línea y bundler configurado para servir localmente sin dependencias externas.
- **Cheatsheet Oculta**: Panel de métricas confidencial en `/#/_cheatsheet` para preparadores.

### Changed
- Reestructuración de la paleta de colores para usar Azul Marino y Coral Pantera como identidades.
- Movido `mlClient` a un Web Worker nativo real, asegurando responsividad al calcular Kaplan-Meier y Regresiones en background.
- Optimizado el Code-Splitting de `Plotly.js` para reducir el peso inicial a menos de 45MB en RAM y 1.0s de TTV (Time To View).

### Removed
- Eliminado código muerto, logs (console.logs), marcadores `TODO`, y componentes sin utilizar.
- No existen APIs externas. Cero tráfico de red.

*(Lanzamiento Oficial para Inversionistas)*
