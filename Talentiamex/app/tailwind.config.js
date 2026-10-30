/** @type {import('tailwindcss').Config} */
const token = (nombre) => `var(--${nombre})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        marca: { DEFAULT: token('color-marca'), suave: token('color-marca-suave') },
        accion: {
          DEFAULT: token('color-accion'),
          hover: token('color-accion-hover'),
          suave: token('color-accion-suave'),
        },
        salud: { DEFAULT: token('color-salud'), suave: token('color-salud-suave') },
        restaurantes: {
          DEFAULT: token('color-restaurantes'),
          suave: token('color-restaurantes-suave'),
        },
        escuelas: { DEFAULT: token('color-escuelas'), suave: token('color-escuelas-suave') },
        exito: token('color-exito'),
        alerta: { DEFAULT: token('color-alerta'), suave: token('color-alerta-suave') },
        error: { DEFAULT: token('color-error'), suave: token('color-error-suave') },
        info: token('color-info'),
        fondo: token('color-fondo'),
        superficie: token('color-superficie'),
        borde: token('color-borde'),
        texto: {
          DEFAULT: token('color-texto'),
          2: token('color-texto-2'),
          3: token('color-texto-3'),
        },
        admin: token('color-admin'),
        wa: {
          encabezado: token('wa-encabezado'),
          fondo: token('wa-fondo'),
          salida: token('wa-burbuja-salida'),
          entrada: token('wa-burbuja-entrada'),
        },
      },
      borderRadius: {
        tarjeta: token('radio-tarjeta'),
        boton: token('radio-boton'),
        chip: token('radio-chip'),
      },
      boxShadow: {
        1: token('sombra-1'),
        2: token('sombra-2'),
        arriba: token('sombra-arriba'),
      },
      fontFamily: {
        sans: token('fuente-texto'),
        titulo: token('fuente-titulo'),
      },
    },
  },
  plugins: [],
};
