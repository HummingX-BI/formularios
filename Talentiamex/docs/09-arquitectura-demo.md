# 09 · Arquitectura de la demo

SPA estática que corre completa en el navegador. Sin servidor, sin red: todo el "backend" es un store en memoria
persistido en `localStorage`, más simuladores de pago, autenticación y WhatsApp.

## Stack

| Pieza | Elección | Nota |
| --- | --- | --- |
| Build | Vite 6 | Igual que `../demo-pantera` |
| UI | React 18 + TypeScript 5.6 (estricto) | |
| Estilos | Tailwind CSS 3 + variables CSS de `07-diseno.md` | |
| Rutas | React Router 6 con `HashRouter` | Funciona con `vite preview` y abriendo archivos |
| Estado | Zustand 5 + `persist` (localStorage, clave `talentiamex-demo-v1`) | |
| Íconos | lucide-react | |
| Animación | framer-motion | |
| PDF | jspdf + html2canvas | Solo en P05 |
| Fuentes | @fontsource-variable/inter, @fontsource/plus-jakarta-sans | Sin CDN |
| Calidad | ESLint 9 + typescript-eslint, Prettier | Copiar config de `../demo-pantera` |

## Estructura

```
Talentiamex/app/
├── index.html
├── public/                 manifest.webmanifest, íconos PWA
├── iniciar.sh / iniciar.bat
└── src/
    ├── main.tsx
    ├── App.tsx             Router + layouts + DemoPanel + WhatsAppSimulator
    ├── styles/             tokens.css, index.css
    ├── assets/             logo-placeholder.svg
    ├── types/              Modelos de 08-datos-mock.md
    ├── data/               Semilla: sectores, zonas, planes, empresas, vacantes, candidatos, postulaciones…
    ├── store/              useDemoStore.ts (estado + acciones), selectors.ts, reglas.ts (RN y RD como funciones)
    ├── sim/                auth.ts, pagos.ts, whatsapp.ts (plantillas y disparadores), reloj.ts (HOY y avanzar días)
    ├── ui/                 Componentes base de 07-diseno.md
    ├── cv/                 Plantillas Clasica, Moderna, Compacta + exportarPdf.ts
    ├── layouts/            PublicLayout, CandidatoLayout, EmpresaLayout, AdminLayout
    ├── screens/
    │   ├── publico/        P01Inicio, P02Acceso
    │   ├── candidato/      P03ConstructorCv, P04Plantillas, P05Pago, P06Vacantes, P07Vacante, P08Postulaciones
    │   ├── empresa/        P09Planes, P10Panel, P11NuevaVacante, P12Postulantes, P13Perfiles, P14Headhunting
    │   └── admin/          P15Tablero, P16Gestion, P17Catalogos
    └── demo/               DemoPanel, WhatsAppSimulator (P18), autollenar.ts
```

## Rutas

| Ruta | Pantalla | Acceso |
| --- | --- | --- |
| `/` | P01 | público |
| `/registro/candidato`, `/registro/empresa`, `/entrar` | P02 | público |
| `/candidato/cv/paso/:n` | P03 | candidato |
| `/candidato/cv` (+ `/pagar` modal) | P04, P05 | candidato |
| `/candidato/vacantes`, `/candidato/vacantes/:id` | P06, P07 | candidato |
| `/candidato/postulaciones` | P08 | candidato |
| `/empresa/planes` | P09 | empresa |
| `/empresa` | P10 | empresa |
| `/empresa/vacantes/nueva` | P11 | empresa |
| `/empresa/vacantes/:id/postulantes` | P12 | empresa |
| `/empresa/perfiles` | P13 | empresa |
| `/empresa/headhunting` | P14 | empresa |
| `/admin`, `/admin/gestion`, `/admin/catalogos` | P15–P17 | administrador |

Un `RequireRole` redirige a `/entrar` si el rol de la sesión simulada no corresponde.

## Store (resumen de acciones)

```ts
// sesión
registrarCandidato(datos) · registrarEmpresa(datos) · entrarComo(rol, id) · salir()
// CV
guardarPasoCv(n, datos) · elegirPlantilla(id) · marcarCvPagado() · alternarPerfilVisible()
// vacantes
publicarVacante(datos) · renovarVacante(id) · pausarVacante(id) · cerrarVacante(id)
// postulación
postularse(vacanteId, respuestas) · cambiarEstadoPostulacion(id, estado)
// empresa
iniciarPrueba(planId) · contratarPlan(planId) · solicitarHeadhunting(datos)
// admin
asignarReclutador(solicitudId, nombre) · agregarSector(datos) · editarPlan(datos) · alternarSuspension(tipo, id)
// demo
avanzarDias(n) · resetDemo() · autollenar(formulario)
```

Las reglas (RN-xx, RD-xx) viven como funciones puras en `store/reglas.ts` para que sean legibles y probables,
p. ej. `cvCompleto(c)`, `coincide(c, v)`, `diasRestantes(v, hoy)`, `avisosPendientes(v, hoy)`.

## Simuladores

- **Autenticación (`sim/auth.ts`):** cualquier correo y contraseña válidos entran; guarda `{ rol, id }`.
- **Pagos (`sim/pagos.ts`):** `pagar(monto, concepto)` espera 1.2 s y aprueba; registra el ingreso para P15.
  Tarjeta terminada en `0002` devuelve "rechazada" (para mostrar el manejo de error si se pide).
- **WhatsApp (`sim/whatsapp.ts`):** `enviar(regla, destinatario, datos)` agrega un `MensajeWhatsApp` al store con
  la plantilla de P18; muestra un toast "Nuevo WhatsApp" y un punto en el botón del simulador.
- **Reloj (`sim/reloj.ts`):** `HOY` del store. `avanzarDias(n)` itera día por día y, en cada uno, revisa
  vencimientos (RN-06, RN-09) y marca `avisosEnviados` para no duplicar (RNF-07).

## Panel de demo

Botón flotante discreto (esquina inferior izquierda, ícono `Presentation`), atajo de teclado `D`.

- Cambiar de rol: Candidata (Mariana) · Empresa (Clínica San Rafael) · Administrador.
- Vista celular: envuelve la app en `PhoneFrame` de 390 × 844 en escritorio.
- Abrir WhatsApp (P18), con contador de no leídos.
- Avanzar días: +1, +5, +30. Muestra la fecha simulada.
- Autollenar formulario actual (datos de `10-guion-demo.md`).
- Reiniciar demo (con confirmación).

El panel no aparece en las capturas para el cliente si se presiona `D` para ocultarlo.

## PWA

`manifest.webmanifest` con nombre, colores de marca e íconos 192/512. Sin service worker (no hace falta en la demo).
