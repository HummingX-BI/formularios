# Diagnóstico y Plan de Implementación: "Scrollytelling" Premium (Pinned Horizontal Scroll)

## 1. Diagnóstico del Estado Actual
Actualmente, las pantallas de bienvenida (`Welcome.jsx` para el dueño y `ClientePortal.jsx` para el cliente) utilizan un modelo de **scroll vertical tradicional**.
- Cuando el usuario mueve la rueda del ratón o desliza el dedo, la página simplemente baja.
- Las animaciones están basadas en intersección (aparecen cuando entran en pantalla mediante `framer-motion`), pero no están "atadas" directamente a la posición física del scroll.
- No existe el efecto de "pantalla anclada" (Sticky) donde el usuario hace scroll hacia abajo pero el contenido se desliza lateralmente o hace transiciones en el mismo lugar.
- No hay integración de audio/música ambiental.

## 2. El Efecto Deseado (El Estándar Apple / Awwwards)
Lo que describes es un patrón de diseño conocido como **Scrollytelling con Pinned Sections (Secciones Ancladas)**. Es el efecto que usan marcas como Apple para presentar un iPhone nuevo.
- **La mecánica:** Un contenedor muy alto (ej. `300vh`) permite hacer scroll. Sin embargo, el contenido visible se "pega" (`position: sticky`) a la pantalla.
- **La magia:** Al hacer scroll hacia abajo, en lugar de bajar la página, usamos esa "energía de scroll" para mover elementos horizontalmente (Scroll Horizontal Falso), cambiar la opacidad de los textos, o hacer transformaciones 3D.
- **Resultado:** El usuario siente que está controlando un video interactivo o una presentación cinemática con su rueda del ratón o su dedo.

## 3. Plan de Implementación Técnica

Para lograr este nivel de calidad premium sin saturar la aplicación, utilizaremos **Framer Motion** (`useScroll` y `useTransform`), que ya tenemos instalado.

### Fase 1: Bienvenida del Dueño (Luis) - `Welcome.jsx`
1. **Reestructuración a Sticky Container**:
   - Crearemos un contenedor principal de `400vh` (4 veces la altura de la pantalla).
   - Dentro, un contenedor `sticky` de `100vh` que no se moverá.
2. **Animaciones atadas al Scroll**:
   - **0% a 25%**: Aparece el logo de ZAMMIR y una frase inicial fuerte ("El vidrio es exactitud.").
   - **25% a 50%**: El texto se desliza horizontalmente fuera de la pantalla mientras entra el segundo mensaje ("Tu negocio también debería serlo.").
   - **50% a 75%**: Transición visual hacia la revelación de la herramienta ("Bienvenido a tu nuevo centro de control.").
   - **75% a 100%**: Botón de "Entrar al Dashboard" hace un *fade-in* y el contenedor se desbloquea.

### Fase 2: Bienvenida del Cliente Final - `ClientePortal.jsx`
1. **El "Unboxing" Digital del Cliente**:
   - Contenedor de `300vh`.
   - **Primer impacto**: Pantalla limpia, saludo directo ("Hola, Familia Torres").
   - **Scroll (Falso horizontal)**: Al bajar, los textos se deslizan suavemente de derecha a izquierda: "Cada detalle de su proyecto ha sido calculado con precisión." -> "Su cotización está lista."
   - **Audio Ambiental**: Al primer toque de la pantalla (el navegador requiere interacción previa por políticas de autoplay), iniciará un acorde sutil y elegante de fondo, casi imperceptible, tipo *ambient spa* o corporativo de lujo.

### Fase 3: Integración de Audio (Premium Touch)
- Añadiremos un archivo de audio ligero (generado o proporcionado mediante un enlace estático).
- Crearemos un componente `<AudioPlayer />` invisible que se active suavemente (`fade-in` de volumen) en cuanto el usuario inicie el scroll o toque la pantalla.

## 4. Resultado Esperado
Cuando Luis o sus clientes abran el enlace, no verán una "página web". Verán una presentación interactiva que ellos mismos controlan con su dedo o ratón. Sentirán que están interactuando con software de miles de dólares, elevando inmediatamente el estatus de la vidriería ZAMMIR.

¿Estás de acuerdo con este plan técnico para proceder con la programación de estas secuencias?
