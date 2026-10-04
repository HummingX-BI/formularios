# Técnicas Estadísticas y Machine Learning

La demostración incorpora algoritmos matemáticos ejecutados **totalmente en el navegador** a través de Web Workers. Esto responde a la promesa de valor: *"Inteligencia en tus Datos"*.

## 1. Predicción de Bajas (Churn Risk)
- **Técnica:** Regresión Logística Múltiple (L2 Regularized).
- **Cómo se usa:** Calcula la probabilidad individual (0-100%) de que un alumno abandone en los próximos 30 días basándose en 4 variables (asistencia reciente, progreso pedagógico, método de pago y plan).
- **Limitaciones (Demo):** Los pesos están pre-calculados o simplificados a 1 iteración dado que la data de entrenamiento es la misma data generada.

## 2. Análisis de Supervivencia de Cohortes
- **Técnica:** Estimador de Kaplan-Meier.
- **Cómo se usa:** Muestra gráficamente en qué mes exacto un grupo específico tiende a abandonar la escuela, permitiendo comparativas (ej. "Orgánico vs Facebook"). 
- **Limitaciones:** El tamaño de muestra es de ~500 registros, por lo que algunas curvas pueden parecer escalonadas.

## 3. Segmentación RFM (Recencia, Frecuencia, Valor Monetario)
- **Técnica:** K-Means Clustering / Cuartiles Distribucionales.
- **Cómo se usa:** Etiqueta a las familias según su lealtad y aporte monetario, sugiriendo estrategias prescriptivas (Fidelizar, Retener, Recuperar).

## 4. Simuladores Financieros (Análisis Prescriptivo)
- **Técnica:** Modelado Determinista de Escenarios (What-if).
- **Cómo se usa:** Los Módulos Prescriptivos (M11.x) permiten inyectar variables virtuales (ej. "+1 Grupo el Sábado") y proyectan matemáticamente el impacto en ingresos asumiendo la lista de espera actual.
