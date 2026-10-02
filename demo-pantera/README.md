# Demo Pantera — Panel de Administración Inteligente (Club Azulejo)

## Propósito
Este proyecto es una demo de preventa interactiva ("Panel de Administración Inteligente") construida para Club Azulejo Escuela de Natación bajo el ala de HummingX BI. Su objetivo es impresionar a un empresario no técnico mediante visualizaciones premium de datos, simulaciones estadísticas y módulos interactivos.

**ADVERTENCIA: Datos de demostración.**
Este proyecto no tiene backend real ni base de datos. Todos los datos, cifras y métricas se generan dinámicamente en el navegador utilizando un generador pseudoaleatorio determinista (PRNG) matemático, lo cual asegura que el escenario de datos siempre se vea consistente durante las demostraciones.

## Requisitos
- Node.js (versión LTS).
- NPM.

## Comandos Principales
- `npm run dev`: Inicia el servidor local de desarrollo.
- `npm run build`: Genera la versión de producción empaquetada.
- `npm run preview`: Previsualiza localmente el build de producción.
- `npm test`: Corre los tests unitarios.
- `npm run lint`: Evalúa las reglas de estilo y consistencia (ESLint).
- `npm run typecheck`: Evalúa los tipos estrictos de TypeScript sin compilar.
- `npm run format`: Formatea el código base con Prettier.

## Estructura del Proyecto
- `src/app/`: Núcleo de la app (store global Zustand, React Router).
- `src/ui/`: Componentes de interfaz (Layout, botones, barra lateral).
- `src/modules/`: Páginas y vistas principales divididas por categoría C01-C13.
- `src/config/`: Constantes de negocio de la escuela (tarifas, niveles).
- `src/data/`, `src/metrics/`, `src/stats/`, `src/ml/`: Capas de lógica pura y matemática (Sin React).

## Convenciones de Código
- React 18 y TypeScript Estricto.
- Tailwind CSS para los estilos de UI. Framer Motion para las animaciones.
- Regla Arquitectónica estricta: Las carpetas matemáticas/lógicas no pueden importar React.
