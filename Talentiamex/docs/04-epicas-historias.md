# 04 · Épicas e historias de usuario

8 épicas y 27 historias. Las marcadas con ★ tienen criterio de aceptación en Gherkin y forman el guion de la demo:
**deben funcionar exactamente así**.

## E1 · Registro y acceso
- **HU-1.1** Como candidato, quiero crear mi cuenta con mi celular y correo, para empezar mi CV. (RF-01 · P02)
- **HU-1.2** Como empresa, quiero registrar mi negocio con su sector, para publicar vacantes. (RF-02 · P02)
- **HU-1.3** Como administrador, quiero entrar a un panel propio, para supervisar la plataforma. (RF-03 · P02)

## E2 · Perfil y constructor de CV
- ★ **HU-2.1** Como candidato, quiero llenar mi CV por pasos desde el celular, para no abrumarme con un formulario largo. (RF-05 · P03)
  ```gherkin
  Dado que acabo de crear mi cuenta
  Cuando inicio mi CV
  Entonces veo un paso a la vez, con una barra de avance y un botón "Siguiente"
  ```
- **HU-2.2** Como candidato, quiero agregar una foto si lo deseo, para personalizar mi CV. (RF-06 · P03)
- ★ **HU-2.3** Como candidato, quiero elegir entre 3 diseños y ver cómo queda, para escoger el que más me guste. (RF-07 · P04)
  ```gherkin
  Dado que terminé mi CV
  Cuando toco un diseño
  Entonces la vista previa cambia a ese diseño con mis datos
  ```
- ★ **HU-2.4** Como candidato, quiero pagar y descargar mi CV en PDF, para enviarlo a otros lugares. (RF-08 · P05)
  ```gherkin
  Dado que elegí un diseño
  Cuando toco "Descargar PDF" y completo el pago
  Entonces se descarga mi CV con ese diseño
  ```
- **HU-2.5** Como candidato, quiero que mi CV sea mi perfil visible, para que las empresas me encuentren sin hacer más. (RF-09 · P04)

## E3 · Vacantes
- ★ **HU-3.1** Como empresa, quiero publicar una vacante con sector, puesto, sueldo y zona, para atraer candidatos. (RF-10 · P11)
  ```gherkin
  Dado que tengo una suscripción o prueba activa
  Cuando completo los datos y toco "Publicar"
  Entonces la vacante aparece en las búsquedas con 30 días de vigencia
  ```
- ★ **HU-3.2** Como empresa, quiero agregar preguntas de descarte, para filtrar candidatos desde el inicio. (RF-11 · P11)
  ```gherkin
  Dado que estoy creando una vacante
  Cuando agrego una pregunta con su respuesta esperada
  Entonces cada postulante la responde y yo veo si cumple
  ```
- **HU-3.3** Como empresa, quiero ver cuántos días le quedan a mi vacante y renovarla, para no perder candidatos. (RF-12 · P10)
- **HU-3.4** Como empresa, quiero pausar, editar o cerrar una vacante, para mantenerla al día. (RF-13 · P10)

## E4 · Búsqueda y postulación
- **HU-4.1** Como candidato, quiero filtrar vacantes por sector y zona, para ver solo las que me sirven. (RF-14 · P06)
- ★ **HU-4.2** Como candidato, quiero postularme en un clic, para no volver a llenar mis datos. (RF-15, RF-16 · P07)
  ```gherkin
  Dado que mi CV está completo
  Cuando toco "Postularme" y respondo las preguntas de descarte
  Entonces veo una confirmación y la empresa recibe mi postulación
  ```
- **HU-4.3** Como candidato, quiero ver en qué estado están mis postulaciones, para saber si avanzo. (RF-17 · P08)

## E5 · Gestión de candidatos
- ★ **HU-5.1** Como empresa, quiero ver a los postulantes de cada vacante con sus respuestas, para decidir rápido. (RF-18, RF-19 · P12)
  ```gherkin
  Dado que mi vacante tiene postulantes
  Cuando la abro
  Entonces veo a cada uno con su CV, sus respuestas y si cumple las preguntas de descarte
  Y puedo marcarlo como preseleccionado o descartado
  ```
- **HU-5.2** Como empresa, quiero buscar perfiles por sector y etiquetas y contactarlos, para no esperar a que se postulen. (RF-20 · P13)

## E6 · Suscripciones y pagos
- ★ **HU-6.1** Como empresa, quiero comparar los planes e iniciar una prueba gratis, para probar antes de pagar. (RF-21, RF-22 · P09)
  ```gherkin
  Dado que acabo de registrarme
  Cuando elijo un plan y toco "Probar gratis"
  Entonces mi cuenta queda activa durante la prueba y veo cuándo termina
  ```
- **HU-6.2** Como empresa, quiero que mi suscripción se cobre cada mes de forma automática, para no interrumpir mis vacantes. (RF-23, RF-24 · P09)

## E7 · Avisos por WhatsApp
- ★ **HU-7.1** Como empresa, quiero recibir un recordatorio por WhatsApp antes de que venza mi vacante, para renovarla a tiempo. (RF-25 · P18)
  ```gherkin
  Dado que mi vacante vence en 5 días
  Cuando el sistema hace su revisión diaria
  Entonces recibo un WhatsApp con un enlace para renovarla
  Y lo mismo a 3 días y el día del vencimiento
  ```
- **HU-7.2** Como empresa, quiero un aviso cuando llega un candidato nuevo, para revisarlo pronto. (RF-26 · P18)
- **HU-7.3** Como candidato, quiero un aviso cuando hay una vacante para mi perfil, para postularme antes que otros. (RF-27 · P18)
- **HU-7.4** Como empresa, quiero un aviso cuando mi suscripción está por vencer, para no perder el servicio. (RF-28 · P18)

## E8 · Administración
- ★ **HU-8.1** Como administrador, quiero ver las métricas del piloto en un tablero, para saber si vamos hacia la meta. (RF-29 · P15)
  ```gherkin
  Dado que entro al panel
  Cuando abro el tablero
  Entonces veo empresas activas contra la meta de 3 y candidatos activos contra la meta de 50
  ```
- **HU-8.2** Como administrador, quiero gestionar empresas, usuarios y vacantes, para mantener la calidad de la plataforma. (RF-30 · P16)
- **HU-8.3** Como administrador, quiero gestionar sectores, etiquetas y planes, para crecer sin reprogramar. (RF-31 · P17)
- **HU-8.4** Como administrador, quiero recibir solicitudes de headhunting de las empresas, para dar el servicio especializado. (RF-32 · P14, P15)
