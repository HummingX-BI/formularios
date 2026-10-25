# Diagnóstico Quirúrgico: Transición de "Laboratorio de Datos" a "Producto de Valor de Negocio"

## 1. Evaluación del Enfoque Actual vs. Objetivo
El sistema actual está construido bajo un prisma **Académico / Data Science**. Expone las "tripas" matemáticas (métodos, algoritmos, nombres de pruebas) al usuario final. Esto genera fricción cognitiva: obliga al dueño del negocio a interpretar la estadística antes de poder aplicarla.

**El Objetivo (Psicología Persuasiva y Valor de Negocio):** 
El cliente no compra "Machine Learning" ni "Regresiones Lineales"; el cliente compra **tiempo ahorrado, dinero recuperado, riesgo mitigado y tranquilidad operativa**. La interfaz debe traducir cada modelo en un "insight" directo y accionable. El sistema debe decirle *"Hemos detectado que puedes ingresar $15,000 extra si unes estos dos grupos"* en lugar de *"El modelo de Poisson indica subutilización estadística"*.

---

## 2. Puntos Críticos Detectados en el Código (Nivel Menú y Navegación)
En el archivo `src/modules/registry.tsx`, el menú principal asusta al cliente promedio. 

### Términos a Eliminar en las Categorías:
- ❌ **"Retención y churn"** → "Churn" es jerga de SaaS/Startups. Para una escuela, son "Bajas" o "Fidelización".
- ❌ **"Laboratorio estadístico"** → Suena a tarea de matemáticas. Debe enfocarse en análisis avanzado del negocio.
- ❌ **"Machine Learning"** → Jerga tecnológica. El cliente solo quiere saber qué depara el futuro.
- ❌ **"Prescriptivo"** → Término técnico de análisis de datos. 

### Los Módulos con Títulos Académicos (Infractores Principales):
- ❌ **M4.5: "Ticket promedio y LTV"** (LTV es jerga).
- ❌ **M7.1: "Riesgo de baja predictivo" / "Regresión Logística"** (No importa la regresión, importa quién se va a dar de baja).
- ❌ **M7.2: "Supervivencia" / "Curvas de Kaplan-Meier"** (Kaplan-Meier es terminología exclusiva de bioestadística y actuaría).
- ❌ **Toda la Categoría 9 (M9.1 a M9.8):** 
  - "Binomial y Poisson"
  - "Teorema de Bayes / Probabilidad condicional"
  - "Intervalos y pruebas de hipótesis"
  - "Correlaciones y Regresiones"
- ❌ **M10.1: "Catálogo y desempeño de modelos" / "Transparencia algorítmica"** (Rompe la magia. Al cliente no le interesa probar el modelo, asume que funciona).
- ❌ **M10.4: "Simulador de escenarios Monte Carlo"** (Monte Carlo es irrelevante para el cliente).
- ❌ **M12.2: "Glosario y explicador"** (Si necesitamos un glosario, la UX falló. La interfaz debe ser autoexplicativa).

---

## 3. Puntos Críticos de Interfaz "Developer" (UX/UI Frontend)
- ❌ **Variables Expuestas:** En `DashboardLayout.tsx` (y otras vistas) se exponen términos como `Seed` y `Dataset` ("Seed: 2026"). Esto rompe la ilusión de ser una plataforma real; suena a herramienta de prueba de software.
- ❌ **Descripciones de Gráficas Técnicas:** Las gráficas explican qué son ("Gráfica de barras apiladas") en lugar de qué demuestran ("Evolución de tus ingresos por programa").
- ❌ **Uso excesivo de "Explicaciones del Sistema":** Presentar al usuario *cómo* se calculó el resultado en lugar de darle *qué hacer* con el resultado.

---

## 4. Plan de Implementación de Cura (Reestructuración)

**Fase 1: Erradicación del Glosario Técnico (Re-etiquetado del Registry)**
Vamos a reescribir `registry.tsx` por completo. Todos los términos estadísticos serán traducidos a **Beneficios Empresariales**.
*Ejemplos:*
- *Categoría "Machine Learning"* → **"Proyecciones Automáticas"** o **"El Futuro de mi Escuela"**.
- *M7.2 "Kaplan-Meier"* → **"Tiempo de Permanencia Promedio"**.
- *M9 "Laboratorio Estadístico"* → **"Análisis a Profundidad"** (Y ocultar el cómo).
- *M10.4 "Monte Carlo"* → **"Simulador de Metas y Escenarios"**.

**Fase 2: Rediseño Narrativo en los Insights (Psicología Persuasiva)**
Los cuadros de texto y alertas no deben decir: *"La correlación de X y Y es 0.8"*. 
Deben decir: *"Tus alumnos de natación infantil son los más leales. Ofrecerles un programa cruzado aumentará tus ingresos."*
- Modificaremos las cajas de `AppInsightBlock` para priorizar la "Acción Recomendada" sobre la "Evidencia Estadística".

**Fase 3: Limpieza de UI (Modo Demo Cliente)**
- Eliminar la exposición de `Seed` del footer. En su lugar, simplemente decir *"Entorno Aislado"* o *"Modo Demostración"*.
- Ocultar/Renombrar las referencias a `Dataset`.
- Ocultar por completo el catálogo de modelos (M10.1) o reemplazarlo por un "Score de Certeza de Negocio".

---
**Conclusión del Diagnóstico:**
El panel actual es un Ferrari con el capó transparente: fascina a los ingenieros pero intimida al conductor. Nuestro trabajo ahora es cerrarle el capó, ponerle asientos de cuero y decirle al cliente: *"Solo pisa el acelerador, el sistema hace el resto"*.
