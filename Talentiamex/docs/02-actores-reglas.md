# 02 · Actores y reglas de negocio

## Actores

| Actor | Quién es | Qué hace | Qué paga |
| --- | --- | --- | --- |
| Candidato | Persona que busca trabajo en Salud, Restaurantes o Escuelas; su perfil y su celular varían según el sector | Arma su CV, busca vacantes, se postula, recibe avisos de vacantes que coinciden con su perfil | La descarga de su CV en PDF |
| Empresa | PYMEs, cadenas y franquicias, hospitales y clínicas, escuelas | Publica vacantes, define preguntas de descarte, revisa postulantes, busca perfiles y los contacta, solicita headhunting | Suscripción mensual por niveles, con prueba gratis |
| Administrador | Equipo de Talentiamex | Supervisa empresas, usuarios y vacantes; administra sectores, etiquetas y planes; atiende solicitudes de headhunting | — |
| Sistema | Procesos automáticos (en la demo: simulados) | Vence vacantes, envía recordatorios y avisos por WhatsApp, cobra suscripciones | — |

## Reglas de negocio

Salen de la convocatoria y del cuestionario. Valen para la demo y el MVP mientras el cliente no las cambie.

| ID | Regla | Origen |
| --- | --- | --- |
| RN-01 | Armar el CV es gratis; descargarlo en PDF tiene costo por descarga | Cuestionario |
| RN-02 | El CV tiene 3 plantillas fijas de diseño; el cliente aportará referencias | Convocatoria y cuestionario |
| RN-03 | La foto en el CV es opcional | Cuestionario |
| RN-04 | El CV sirve como documento descargable y también como perfil que ven las empresas | Cuestionario |
| RN-05 | Una vacante dura 30 días publicada | Cuestionario |
| RN-06 | El sistema avisa a la empresa por WhatsApp 5, 3 y 0 días antes de que venza su vacante, para que la renueve o pague | Convocatoria y cuestionario |
| RN-07 | La empresa recibe aviso por WhatsApp cuando llega un candidato nuevo | Cuestionario |
| RN-08 | El candidato recibe aviso por WhatsApp cuando hay una vacante que coincide con su perfil | Cuestionario |
| RN-09 | La empresa recibe aviso cuando su suscripción está por vencer | Cuestionario |
| RN-10 | La suscripción de empresa tiene varios niveles (básico, pro, etc.) y periodo de prueba gratis | Cuestionario |
| RN-11 | Perfiles y vacantes se clasifican con etiquetas por sector: Salud, Restaurantes y cocinas, Escuelas | Convocatoria y cuestionario |
| RN-12 | El candidato puede postularse en un clic si su CV está completo | Cuestionario |
| RN-13 | La empresa puede agregar preguntas de descarte a cada vacante | Cuestionario |
| RN-14 | La primera versión no emite facturas | Cuestionario |

Pendientes de definir con el cliente (valores provisionales en `11-preguntas-abiertas.md`): duración de la prueba
gratis; nombres, precios y límites de cada nivel; precio de la descarga del CV.

## Reglas derivadas para la demo

No las pidió el cliente; son necesarias para que los flujos sean coherentes. Están en `DECISIONS.md`.

| ID | Regla |
| --- | --- |
| RD-01 | "CV completo" = datos personales, al menos 1 experiencia o la casilla "sin experiencia", sector de interés y zona |
| RD-02 | Una vacante "coincide" con un candidato si comparten sector y zona (municipio o alcaldía) |
| RD-03 | Una pregunta de descarte es de sí/no con respuesta esperada; el postulante que no la cumple se marca "No cumple" pero no se rechaza solo |
| RD-04 | Para publicar vacantes, la empresa necesita prueba gratis o plan activo |
