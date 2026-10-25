# Plan de Implementación: Refactorización UX/Linguística Orientada a Negocio

## Objetivo Principal
Transformar la plataforma de una "Herramienta de Ciencia de Datos" a una "Suite de Inteligencia y Valor de Negocio", eliminando toda la jerga académica y enfocando cada elemento visual en el beneficio directo para el dueño del negocio (Psicología Persuasiva).

---

## Fase 1: Re-Estructuración del Menú y Navegación (`src/modules/registry.tsx`)
Esta fase cambia el "Escaparate" del software.

### 1.1 Cambio de Nombres de Categorías
- **"Retención y churn"** → **"Fidelización y Bajas"**
- **"Laboratorio estadístico"** → **"Métricas Profundas"** (o "Radiografía del Negocio")
- **"Machine Learning"** → **"Proyecciones Inteligentes"**
- **"Prescriptivo"** → **"Simuladores y Recomendaciones"**
- **"Asistente IA"** → **"Asistente de Negocio"**

### 1.2 Traducción de Módulos Críticos (Títulos y Descripciones Cortas)
- `M4.5`: "Ticket promedio y LTV" → **"Valor Real por Alumno"** (Desc: *¿Cuánto dinero me deja cada alumno durante su estancia?*)
- `M7.1`: "Riesgo de baja predictivo" → **"Detector de Alumnos en Riesgo"** (Desc: *Alumnos a punto de irse y cómo salvarlos*)
- `M7.2`: "Supervivencia (Kaplan-Meier)" → **"Tiempo de Permanencia"** (Desc: *Meses promedio que un alumno se queda*)
- `M7.3`: "Cohortes" → **"Evolución por Generaciones"** (Desc: *Desempeño de grupos a lo largo del tiempo*)
- `M9.X`: Transformar la categoría entera de matemáticas a preguntas de negocio:
  - *Binomial y Poisson* → **"Análisis de Viabilidad de Metas"**
  - *Probabilidad Condicional* → **"Patrones de Comportamiento Cruzado"**
  - *Regresiones / Correlaciones* → **"Factores Clave de Crecimiento"**
- `M10.1`: "Catálogo de modelos" → **"Certeza Analítica"** (Desc: *Precisión de nuestras alertas automáticas*)
- `M10.4`: "Simulador Monte Carlo" → **"Simulador de Escenarios Financieros"**

---

## Fase 2: Limpieza de la Interfaz del Usuario y Entorno (UX Frontend)
El cliente no debe saber que está en un simulador de datos ("Modo Demo").

### 2.1 Archivo: `src/ui/DashboardLayout.tsx`
- **Eliminar:** Cualquier texto en el footer que diga `Seed: [Número]`.
- **Reemplazar:** El banner de "Datos de demostración simulados" y "Sesión modificada" por algo elegante como: *"Entorno de Análisis Aislado"*.

### 2.2 Archivo: `src/modules/system/CheatsheetPage.tsx` y `M12.2` (Glosario)
- **Acción:** Purgar el glosario matemático. Si existe, debe convertirse en una **"Guía Rápida de Indicadores"** (ej. Qué significa estar en números rojos, cómo leer las alertas), escrita completamente en lenguaje natural y cotidiano.

---

## Fase 3: Rediseño Narrativo de los Insights (Psicología Persuasiva)
Revisaremos el contenido interno (las gráficas y los cuadros de texto de inteligencia) de los módulos más impactantes para modificar la narrativa.

### 3.1 Reestructuración de `AppInsightBlock` (El componente de alertas y resúmenes)
- Cambiaremos los "Summary" de las tarjetas en los módulos:
  - En `M7_1_Risk.tsx`: En lugar de "El modelo predice una probabilidad alta de churn...", cambiaremos a: *"Hemos detectado 15 alumnos a punto de cancelar. Te sugerimos ofrecerles este descuento para retener $12,000 MXN mensuales."*
  - En `M11_2_Simulator.tsx` y `M10_4`: Orientar las variables no a "Elasticidad Precio", sino a *"Sensibilidad de las familias ante un aumento de precio"*.

### 3.2 Títulos y Ejes de Gráficas (Plotly / PlotChart)
- Evitar nombres como "Gráfica de Dispersión de Asistencia vs Progreso". 
- Usar: **"Impacto de la Asistencia en el Nivel del Alumno"**.

---

## Cronograma de Ejecución Propuesto
1. **Ejecutar Fase 1 y Fase 2 inmediatamente:** Toma menos de 10 minutos reemplazar textos estáticos en el `registry.tsx` y `DashboardLayout.tsx`, obteniendo una victoria rápida y cambiando la cara del software al 100%.
2. **Revisión del código modificado:** Hacemos build y verificas visualmente cómo cambió la navegación.
3. **Ejecutar Fase 3:** Entramos de lleno a los componentes individuales y gráficas a modificar los "Insights" (textos analíticos).

---
*¿Estás de acuerdo con este plan? Si me das luz verde, procedo a reescribir inmediatamente el archivo `registry.tsx` y `DashboardLayout.tsx` (Fase 1 y 2).*
