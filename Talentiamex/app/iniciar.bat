@echo off
cd /d "%~dp0"
echo ===================================================
echo     INICIANDO DEMO TALENTIAMEX
echo ===================================================
echo.
echo 1. Liberando el puerto 4173...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":4173 " ^| findstr "LISTENING"') do taskkill /F /PID %%p >nul 2>&1

echo 2. Preparando la version de presentacion...
if not exist node_modules call npm install
call npm run build
if errorlevel 1 (
  echo.
  echo No se pudo compilar. Revisa los mensajes de arriba.
  pause
  exit /b 1
)

echo 3. Iniciando el servidor...
start "Talentiamex" cmd /c "npm run preview -- --port 4173 --strictPort"
timeout /t 4 /nobreak >nul

echo 4. Abriendo la plataforma en el navegador...
start http://localhost:4173/

echo.
echo ===================================================
echo  LISTO EN http://localhost:4173/
echo  Puedes minimizar esta ventana. Para detener la demo,
echo  cierra la ventana "Talentiamex".
echo ===================================================
pause
