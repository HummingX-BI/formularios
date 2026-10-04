# Pantera Demo (HummingX BI)

Demostración técnica de un Panel de Administración Inteligente para el "Club Azulejo Escuela de Natación". Este sistema fue diseñado para resolver problemas de gestión académica y financiera mediante el uso de análisis prescriptivo y Machine Learning en el navegador.

## 🚀 Inicio Rápido (Modo Presentación Offline)

Para abrir la demo terminada sin necesidad de compilar y sin conexión a internet:
1. En Windows: Haz doble clic en `iniciar.bat`
2. En Mac/Linux: Ejecuta `./iniciar.sh` en la terminal.

La aplicación se abrirá en `http://localhost:4173`.

## 💻 Desarrollo

Si deseas modificar la aplicación o ver el código fuente en acción:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (con Hot Reload)
npm run dev

# 3. Compilar para producción
npm run build
```

## 🛠 Atajos de Teclado y Opciones Ocultas

* **Modo Presentación (`P`)**: Oculta barras, aumenta el tamaño de la letra y entra en un modo amigable para proyector.
* **Búsqueda Global (`/` o `Ctrl + K`)**: Abre el buscador principal.
* **Hoja del Presentador**: Navega manualmente a `/#/_cheatsheet` para ver el guion y cifras exactas del generador.
* **Variables de Entorno**: 
  * `VITE_SHOW_DEBUG=true` muestra rutas de depuración ocultas en la navegación principal (Gráficas de debug, rendimiento de ML, etc).

## 📄 Documentación Adjunta
En la carpeta `docs/` encontrarás:
* `ARQUITECTURA.md`: Diseño de software y flujo de datos.
* `DATOS.md`: Cómo funciona el motor de generación.
* `ESTADISTICA.md`: Técnicas predictivas y descriptivas.
* `MODULOS.md`: Listado de los 58 submódulos integrados.
* `ACEPTACION.md`: Informe final de Criterios de Aceptación.
* `CONTINGENCIA.md`: Plan de riesgos y resolución.
* `LICENCIAS.md`: Licenciamiento de software de terceros.

---
*Versión 1.0.0. Propiedad de HummingX BI.*
