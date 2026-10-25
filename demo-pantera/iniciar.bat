@echo off
echo ===================================================
echo     INICIANDO DEMO PANTERA (VERSION PRODUCCION)
echo ===================================================
echo.
echo 1. Cerrando servidores anteriores...
taskkill /F /IM node.exe >nul 2>&1

echo 2. Preparando entorno optimizado...
start cmd /c "npm run preview -- --port 8080 --host"

echo 3. Esperando al servidor...
timeout /t 3 /nobreak >nul

echo 4. Abriendo la plataforma en el navegador...
start http://localhost:8080/

echo.
echo ===================================================
echo  SISTEMA EN LINEA. PUEDES MINIMIZAR ESTA VENTANA.
echo ===================================================
pause
