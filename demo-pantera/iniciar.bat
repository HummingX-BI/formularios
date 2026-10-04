@echo off
echo ==============================================
echo  INICIANDO PANTERA DEMO (MODO SIN CONEXION)
echo ==============================================
echo.
echo Comprobando Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js no esta instalado.
  echo Por favor instala Node.js para ejecutar la demostracion.
  pause
  exit /b 1
)

echo.
echo Sirviendo la aplicacion localmente...
start http://localhost:4173
npx serve -s dist -p 4173
