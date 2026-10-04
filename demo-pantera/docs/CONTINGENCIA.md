# Plan de Contingencia - Presentación Pantera

Este documento contiene los pasos a seguir en caso de fallas durante la demostración en vivo (RNF-22).

## 1. Si falla la conexión a Internet
**Solución:** La demo está compilada para ejecutarse 100% offline.
1. Ejecuta `iniciar.bat` (Windows) o `iniciar.sh` (Mac/Linux).
2. Se abrirá automáticamente la dirección `http://localhost:4173`. Todos los cálculos de ML y reportes funcionan sin red.

## 2. Si el navegador se congela o rompe la UI
**Solución:** Recarga fuerte.
1. Presiona `F5` o `Ctrl + R`.
2. Como la semilla de datos (`seed`) es determinista, todo el estado visual y de datos volverá al punto exacto sin perder información crítica.

## 3. Si la pantalla es de baja resolución o la fuente se ve pequeña
**Solución:** Modo Presentación.
1. Presiona la tecla `P`.
2. El sistema ocultará las barras laterales y agrandará las fuentes y tarjetas al 110% (`scale-105`), enfocado en ser visible en proyectores.

## 4. Si debes cambiar de computadora
**Solución:** Memoria USB portátil.
1. Copia la carpeta de Pantera (con la compilación `dist` completada) a una memoria USB.
2. Cópiala a la nueva computadora.
3. Ejecuta `iniciar.bat` o `iniciar.sh`. No requiere base de datos ni Docker.

## 5. Si los datos "se ensucian" (por manipulación con el simulador)
**Solución:** Reiniciar Estado.
1. Haz clic en "Reiniciar demo" en el pie de página de la aplicación.
2. Esto borrará el registro de cambios de la sesión y regenerará el dataset intacto.
