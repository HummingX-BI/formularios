# Arquitectura del Sistema

El proyecto Pantera Demo es una aplicación de tipo **Single Page Application (SPA)** completamente estática. Toda su potencia analítica y reactiva corre dentro del cliente (navegador), garantizando privacidad, velocidad (0 latencia de red) y demostrabilidad sin dependencias externas.

## 1. Patrón Arquitectónico Principal
El sistema implementa una arquitectura **In-Browser Compute** dividida en 3 capas fundamentales:

1. **Capa de Generación de Datos (`src/data/generator/`)**
   - Inyecta determinismo a la aplicación mediante PRNG (Generador Numérico Pseudo-Aleatorio) con semilla de inicio (ej. `seed=2026`).
   - Simula 500 alumnos, pagos, asistencias y dependencias espaciales utilizando funciones estadísticas gaussianas para garantizar una distribución de datos realista y no una aleatoriedad caótica.

2. **Capa de Lógica y Estado (`src/app/` y `src/ml/`)**
   - Utiliza **Zustand** como contenedor de estado global (`useAppStore`), sincronizando configuración, alertas, y eventos del carrito/asistente en tiempo real entre los 58 submódulos sin prop-drilling.
   - Delega procesos pesados (Modelos Matemáticos como Regresión Logística y Curvas Kaplan-Meier) a Web Workers (`mlClient.ts`) aislando el hilo principal de renderizado de la UI.

3. **Capa de Presentación (`src/ui/` y `src/modules/`)**
   - Construida con **React 18 + Vite**.
   - Usa Code-Splitting basado en Rutas mediante `React.lazy()` para cargar los componentes de UI pesados y gráficos (`Plotly`) únicamente cuando el usuario navega a ellos (estrategia TTV: Time to View óptimo).
   - Estilizada mediante **Tailwind CSS**.

## 2. Flujo de Datos

1. Al abrir la app, la semilla genera un objeto inmutable de base de datos (`dataset`).
2. Los componentes solicitan recortes o transformaciones vía Hooks (`useDataset`, `useMetrics`).
3. Acciones de usuario (como el Simulador de Ajustes en "M11.3") disparan un estado diferencial de cambios temporales, el cual vuelve a forzar el re-calculo de las métricas que se sobreponen al dataset original, provocando la actualización en cadena del "Centro de Alertas".
