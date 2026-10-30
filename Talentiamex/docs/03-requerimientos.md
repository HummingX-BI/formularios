# 03 · Requerimientos

## Requerimientos funcionales

32 requerimientos en 8 módulos, con prioridad MoSCoW y fase. La columna **Demo** dice cómo se muestra el viernes.

| ID | Requerimiento | Prioridad | Fase | Demo | Pantalla |
| --- | --- | --- | --- | --- | --- |
| **Acceso** | | | | | |
| RF-01 | Registro e inicio de sesión de candidato | Debe | 1 | Simulado | P02 |
| RF-02 | Registro e inicio de sesión de empresa | Debe | 1 | Simulado | P02 |
| RF-03 | Acceso del administrador | Debe | 1 | Simulado | P02 |
| RF-04 | Recuperación de contraseña | Debe | 1 | Solo el enlace, sin flujo | P02 |
| **Perfil y CV** | | | | | |
| RF-05 | Constructor de CV por pasos, pensado para celular | Debe | 1 | Navegable | P03 |
| RF-06 | Foto opcional en el CV | Debería | 1 | Navegable | P03 |
| RF-07 | Elegir entre 3 plantillas y ver vista previa | Debe | 1 | Navegable | P04 |
| RF-08 | Descargar el CV en PDF después de pagar | Debe | 1 | Pago simulado, PDF real | P05 |
| RF-09 | El CV completo funciona como perfil visible para empresas | Debe | 1 | Navegable | P04, P12, P13 |
| **Vacantes** | | | | | |
| RF-10 | La empresa publica una vacante con sector, puesto, sueldo, zona y descripción | Debe | 1 | Navegable | P11 |
| RF-11 | La empresa agrega preguntas de descarte a una vacante | Debe | 1 | Navegable | P11 |
| RF-12 | La vacante vence a los 30 días y puede renovarse | Debe | 1 | Contador de días + renovar | P10 |
| RF-13 | La empresa pausa, edita o cierra una vacante | Debería | 1 | Navegable | P10 |
| **Búsqueda y postulación** | | | | | |
| RF-14 | El candidato busca y filtra vacantes por sector y zona | Debe | 1 | Navegable | P06 |
| RF-15 | El candidato se postula en un clic | Debe | 1 | Navegable | P07 |
| RF-16 | El candidato responde las preguntas de descarte al postularse | Debe | 1 | Navegable | P07 |
| RF-17 | El candidato ve el estado de sus postulaciones | Debería | 1 | Navegable | P08 |
| **Gestión de candidatos** | | | | | |
| RF-18 | La empresa ve los postulantes de cada vacante con sus respuestas | Debe | 1 | Navegable | P12 |
| RF-19 | La empresa marca postulantes: en revisión, preseleccionado, descartado | Debe | 1 | Navegable | P12 |
| RF-20 | La empresa busca perfiles por sector y etiquetas y los contacta | Debe | 1 | Navegable | P13 |
| **Suscripciones y pagos** | | | | | |
| RF-21 | La empresa elige un plan entre varios niveles | Debe | 2 | Navegable | P09 |
| RF-22 | La empresa inicia una prueba gratis | Debe | 2 | Navegable | P09 |
| RF-23 | Cobro recurrente mensual de la suscripción | Debe | 2 | Pago simulado | P09 |
| RF-24 | Confirmación de pago por webhook de la pasarela | Debe | 2 | No se muestra | — |
| **Avisos por WhatsApp** | | | | | |
| RF-25 | Recordatorio a la empresa 5, 3 y 0 días antes de que venza su vacante | Debe | 2 | Simulado | P18 |
| RF-26 | Aviso a la empresa por candidato nuevo | Debería | 2 | Simulado | P18 |
| RF-27 | Aviso al candidato por vacante que coincide | Debería | 2 | Simulado | P18 |
| RF-28 | Aviso a la empresa por suscripción por vencer | Debería | 2 | Simulado | P18 |
| **Administración** | | | | | |
| RF-29 | El administrador ve métricas del piloto: empresas activas, candidatos, vacantes, postulaciones | Debe | 1 | Navegable | P15 |
| RF-30 | El administrador gestiona empresas, usuarios y vacantes | Debe | 1 | Navegable | P16 |
| RF-31 | El administrador gestiona sectores, etiquetas y planes | Debería | 1 | Navegable | P17 |
| RF-32 | El administrador recibe y asigna solicitudes de headhunting | Podría | Por definir | Navegable (formulario de solicitud) | P14, P15 |

RF-29 mide directamente la meta del piloto: 3 empresas y 50 candidatos.

## Requerimientos no funcionales

Resumen por características de ISO/IEC 25010:2023. Las metas numéricas del MVP real se fijan en la versión 1.0.
Para la **demo**, la columna derecha dice cómo se cumple.

| ID | Característica | Requerimiento | En la demo |
| --- | --- | --- | --- |
| RNF-01 | Capacidad de interacción | Interfaz guiada: cada pantalla con título del paso actual y botón de color con la siguiente acción | Obligatorio en todas las pantallas |
| RNF-02 | Capacidad de interacción | Lenguaje sencillo y sin tecnicismos | Revisar todos los textos |
| RNF-03 | Compatibilidad | PWA móvil primero; funciona también en computadora | Diseño a 390 px y 1280 px; manifest PWA |
| RNF-04 | Eficiencia de desempeño | Pantallas ligeras con datos móviles limitados | Sin imágenes pesadas; carga diferida de pantallas |
| RNF-05 | Seguridad | Datos personales solo visibles por rol; conexión cifrada | Rutas protegidas por rol simulado |
| RNF-06 | Seguridad | Datos de tarjeta procesados por la pasarela, nunca guardados | El formulario de pago no guarda nada |
| RNF-07 | Fiabilidad | Avisos programados sin pérdidas ni duplicados | El simulador no duplica mensajes al avanzar días |
| RNF-08 | Mantenibilidad | Código y documentación que otro equipo pueda retomar | Reglas de `CLAUDE.md` |
| RNF-09 | Flexibilidad | Agregar un sector o un plan sin reprogramar | Sectores y planes salen del store, editables en P17 |

## Restricciones técnicas

- El cliente prefiere React o Next.js, Node.js o Python y AWS, pero **está abierto a recomendación**.
- Aún **no tiene cuenta de AWS** ni **número de WhatsApp Business**.
- Tiene una cuenta **activa** en una pasarela de pagos (falta confirmar cuál).
- Opera como **persona física con actividad empresarial**.
- **Identidad visual:** solo tiene logo.
- La demo no depende de internet para funcionar durante la llamada (fuentes empaquetadas, sin CDNs).
