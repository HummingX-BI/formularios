# 07 · Sistema visual

Talentiamex solo tiene logo. Esta paleta es **provisional** y vive en tokens para cambiarla en un solo archivo
cuando el cliente comparta su logo en alta resolución (Q8).

## Principios

1. **Guiar, no decorar** (petición del cliente). En cada pantalla el ojo cae primero en el título y luego en el
   único botón de acción, que siempre es del mismo color verde.
2. **El color dice algo.** Verde = avanzar. Cada sector tiene su color fijo. Ámbar y rojo solo para vigencias y alertas.
3. **Limpio y confiable.** Es una plataforma de empleo: fondo claro, mucho aire, tipografía clara, sin saturar.
4. **Móvil primero.** Botones de al menos 48 px de alto, texto base de 16 px, una columna en 390 px.

## Tokens (`app/src/styles/tokens.css`)

```css
:root {
  /* Marca (provisional) */
  --color-marca: #1E3A8A;          /* azul profundo: encabezados, logo, navegación activa */
  --color-marca-suave: #E0E7FF;

  /* Acción principal: un solo color para "siguiente paso" */
  --color-accion: #15803D;         /* verde, texto blanco (contraste AA) */
  --color-accion-hover: #166534;
  --color-accion-suave: #DCFCE7;

  /* Sectores */
  --color-salud: #0369A1;          --color-salud-suave: #E0F2FE;
  --color-restaurantes: #C2410C;   --color-restaurantes-suave: #FFEDD5;
  --color-escuelas: #7C3AED;       --color-escuelas-suave: #EDE9FE;

  /* Estados */
  --color-exito: #15803D;
  --color-alerta: #B45309;         --color-alerta-suave: #FEF3C7;
  --color-error: #B91C1C;          --color-error-suave: #FEE2E2;
  --color-info: #1D4ED8;

  /* Neutros */
  --color-fondo: #F8FAFC;
  --color-superficie: #FFFFFF;
  --color-borde: #E2E8F0;
  --color-texto: #0F172A;
  --color-texto-2: #475569;
  --color-texto-3: #94A3B8;
  --color-admin: #0F172A;          /* barra lateral del administrador */

  /* Simulador de WhatsApp (solo P18) */
  --wa-encabezado: #075E54;
  --wa-fondo: #ECE5DD;
  --wa-burbuja-salida: #DCF8C6;
  --wa-burbuja-entrada: #FFFFFF;

  /* Forma */
  --radio-tarjeta: 16px;
  --radio-boton: 12px;
  --radio-chip: 999px;
  --sombra-1: 0 1px 2px rgba(15, 23, 42, .06), 0 1px 3px rgba(15, 23, 42, .08);
  --sombra-2: 0 8px 24px -8px rgba(15, 23, 42, .18);
}
```

Cada token se expone en `tailwind.config.js` (`bg-accion`, `text-marca`, `bg-salud-suave`, etc.).

## Tipografía

Empaquetada con `@fontsource` (funciona sin internet).

| Uso | Fuente | Tamaño / peso |
| --- | --- | --- |
| Título de pantalla | Plus Jakarta Sans | 28 px móvil · 36 px escritorio / 700 |
| Subtítulo guiado | Inter | 16 px / 400, `--color-texto-2` |
| Título de tarjeta | Plus Jakarta Sans | 18 px / 600 |
| Texto | Inter | 16 px / 400 |
| Etiquetas, ayudas | Inter | 13–14 px / 500 |
| Cifras de indicadores | Plus Jakarta Sans | 32 px / 700, números tabulares |

## Componentes base (`app/src/ui/`)

| Componente | Especificación |
| --- | --- |
| `Button` | Variantes: `primario` (verde acción), `secundario` (borde + texto marca), `fantasma`, `peligro`. Altura 48 px; estado de carga con spinner; ícono opcional a la izquierda |
| `StickyAction` | Contenedor del botón principal fijo al fondo en móvil, con sombra superior |
| `ScreenHeader` | Título + subtítulo guiado + migas o "Paso n de m" |
| `Stepper` / `ProgressBar` | Pasos numerados con check en los completados; barra con % |
| `Card` | Superficie blanca, radio 16, `--sombra-1`; hover `--sombra-2` si es clicable |
| `SectorChip` | Ícono + nombre, fondo `--color-<sector>-suave`, texto `--color-<sector>` |
| `Badge` | Estados de postulación y de descarte (verde, ámbar, rojo, gris) |
| `VigenciaBar` | Barra de 30 días con días restantes; verde > 5, ámbar 1–5, rojo vencida |
| `KpiCard` | Cifra grande + etiqueta + variación opcional |
| `GoalMeter` | Meta "x / 3" con barra y porcentaje (P15) |
| `Input`, `Select`, `Textarea`, `Checkbox`, `Toggle` | Etiqueta arriba, ayuda abajo, error en rojo bajo el campo |
| `Modal` / `BottomSheet` | Modal en escritorio, hoja inferior en móvil |
| `Toast` | Esquina inferior; éxito, info, error; 3 s |
| `EmptyState` | Ilustración simple con íconos lucide + texto + botón |
| `Avatar` | Foto o iniciales con fondo del color del sector |
| `PhoneFrame` | Marco de celular para P18 y para "vista celular" del panel de demo |
| `CvTemplate` | `Clasica`, `Moderna`, `Compacta`: tamaño A4 (794×1123 px a 96 dpi), reciben el CV del store |

## Íconos

`lucide-react`. Sectores: Salud `HeartPulse`, Restaurantes `ChefHat`, Escuelas `GraduationCap`. Acciones comunes:
`ArrowRight` (siguiente), `Download`, `Send`, `Bell`, `Clock` (vigencia), `Briefcase` (vacante), `UserSearch`
(buscar perfiles), `Target` (headhunting).

## Movimiento

`framer-motion`, siempre sutil: transición de pantalla 200 ms (fade + 8 px), checks de éxito animados,
burbujas de WhatsApp con "escribiendo…" de 800 ms. Respetar `prefers-reduced-motion`.

## Logo

Hasta tener el real: wordmark "Talentiamex" en Plus Jakarta Sans 700, color `--color-marca`, con un punto
verde (`--color-accion`). Archivo `app/src/assets/logo-placeholder.svg`. Reemplazar sin tocar componentes.
