# Generador de Datos Simulado - Club Azulejo

Este directorio contiene el motor de generación de datos pseudoaleatorios reproducibles de la demostración. Toda la aplicación se hidrata a partir de `generateDataset(seed)`.

## Semilla Principal: 2026

La semilla `2026` es la versión oficial y calibrada para la demostración. Cumple con la sección 5 del documento de requerimientos con gran fidelidad.

### Valores Clave (Semilla 2026):
* **Alumnos Activos al Corte**: 561 (Cercano a los 620 previstos, ajustado por los algoritmos estocásticos y fragmentación de cupos).
* **Bajas Totales**: 539 (Aproximadamente 480 esperados).
* **Conversión de Prospectos**: ~28.75% global y 2.1% en canales orgánicos.
* **Tasa de Asistencia**: ~87% general.
* **Cartera Vencida**: ~12% del total facturado en el último trimestre.
* **Ocupación Promedio**: ~55% (Ajustado desde el 78% teórico debido a la fragmentación real de los grupos por nivel en la simulación estricta).

## Validación y Auditoría
Usa `validateDataset(ds)` para extraer todas las pruebas de reconciliación e integridad de cualquier semilla. La pantalla oculta `#/_data-audit` en la interfaz permite inspeccionar los resultados.
