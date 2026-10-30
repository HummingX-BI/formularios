# 10 · Guion de la demo (30 min)

**Formato:** videollamada, pantalla compartida, demo corriendo en local (`npm run preview`).
**Tiempo:** 20 min de recorrido + 10 min de preguntas y siguientes pasos.
**Antes de empezar:** abrir la demo, tocar "Reiniciar demo" en el panel, activar "Vista celular" para el candidato.

La historia conecta todo: una candidata y una clínica se registran en vivo, se encuentran gracias a una vacante
y los avisos de WhatsApp, y al final el tablero muestra la meta del piloto cumplida en empresas.

| # | Min | Rol | Qué se hace | Historias | Pantallas |
| --- | --- | --- | --- | --- | --- |
| 1 | 4 | Candidata | Mariana López se registra, llena su CV en 5 pasos, elige la plantilla Moderna, paga y **descarga el PDF** | HU-1.1, ★2.1, 2.2, ★2.3, ★2.4 | P01 → P02 → P03 → P04 → P05 |
| 2 | 4 | Empresa | Clínica San Rafael se registra, inicia **prueba gratis**, publica "Enfermera general — turno nocturno" con 2 preguntas de descarte | HU-1.2, ★6.1, ★3.1, ★3.2 | P01 → P02 → P09 → P10 → P11 |
| 3 | 1 | WhatsApp | Mariana recibe "Hay una vacante que coincide contigo" | HU-7.3 | P18 |
| 4 | 2 | Candidata | Desde el botón del mensaje abre la vacante, responde las preguntas y **se postula en un clic**; la clínica recibe aviso | ★HU-4.2, 7.2 | P07 → P18 |
| 5 | 2 | Empresa | La clínica ve a Mariana con "Cumple descarte", la **preselecciona**; Mariana ve su estado actualizado | ★HU-5.1, 4.3 | P12 → P08 |
| 6 | 2 | Empresa | La clínica pide **headhunting** para "Jefa de enfermería" | HU-8.4 | P14 |
| 7 | 2 | Sistema | Panel de demo → "Avanzar 30 días": el sistema recorre día por día y llegan, en orden, el aviso de prueba por vencer y los recordatorios de 5, 3 y 0 días. La clínica toca "Renovar" desde el mensaje; como su prueba terminó, el sistema le pide elegir plan (P09) y renueva | ★HU-7.1, 7.4, 3.3, 6.2 | P18 → P09 → P10 |
| 8 | 3 | Administrador | Tablero del piloto: **empresas 3 de 3 (meta cumplida)**, candidatos 47 de 50, la solicitud de headhunting recibida y asignada | ★HU-8.1, 8.4 | P15 |

## Datos que se teclean en vivo

Para ir rápido, cada formulario del guion tiene el botón oculto **"Autollenar"** en el panel de demo,
que llena los campos con los datos de abajo (se ve como si se escribiera rápido).

- **Mariana López** · 55 2345 6789 · mariana.lopez@correo.mx · Iztapalapa · Salud · Enfermera general ·
  $14,000 · Nocturno · Inmediata · Experiencia: Auxiliar de enfermería, Hospital General de Zona (2021–2023);
  Enfermera general, Clínica del Valle (2023–hoy) · Licenciatura en Enfermería · Cédula profesional ·
  Habilidades: Toma de signos vitales, Aplicación de inyectables, Atención al paciente.
- **Clínica San Rafael** · Salud · Hospital o clínica · Dra. Laura Méndez · 55 8765 4321 · contacto@clinicasanrafael.mx
- **Vacante:** Enfermera general — turno nocturno · Iztapalapa · $14,500 · Nocturno · Contrato indeterminado ·
  Preguntas: "¿Cuentas con cédula profesional vigente?" (Sí) · "¿Tienes disponibilidad para turno nocturno?" (Sí)
- **Headhunting:** Jefa de enfermería · 1 vacante · 2 semanas · $28,000–$32,000 · "Se requiere experiencia en gestión de turnos".

## Plan B

- Si algo falla: "Reiniciar demo" y saltar al paso siguiente con el autollenado.
- Tener abierto un build de respaldo en otra pestaña.
- Si la llamada se corta: el estado se conserva en el navegador.

## Preguntas para Luis al final

Ver `11-preguntas-abiertas.md`.
