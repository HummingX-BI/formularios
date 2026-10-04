# Generación de Datos Simulados

La base de datos de Pantera es generada en tiempo real localmente durante los primeros milisegundos tras abrir la aplicación. Esto asegura que la demostración cuente con **cero dependencias externas**, manteniendo la máxima seguridad y agilidad.

## Reglas de Generación
El sistema sigue las "Historias de Dato" requeridas:
1. **Volumen de Entidades (H1):** ~500 alumnos activos, cada uno con historial de asistencias (últimas 12 semanas), evaluaciones y mensualidades.
2. **Ciclo de Ingresos y Flujo (H2-H4):** Estacionalidad (caídas en vacaciones), prospectos distribuidos en un embudo (60% web, 30% recomendación), y retención superior en planes anuales (H6).
3. **Distribución Física y Capacidad (H5):** Un horario de 6 días, limitados por aforos. Un cuello de botella garantizado en "Sábados Principiantes a las 10AM".
4. **Comportamiento Asistencial (H8-H9):** Ausencias de 3+ semanas correlacionadas directamente con un alta en la probabilidad estadística de "Churn" (baja).

## Modificación del Dataset
Si deseas probar la aplicación con variaciones (más alumnos, otra estacionalidad, etc.), basta con alterar los parámetros globales en el módulo **Sitio y Configuración (M13.3)** y cambiar la semilla numérica (`seed`). El universo entero se redibujará.
