#!/bin/bash
echo "=============================================="
echo " INICIANDO PANTERA DEMO (MODO SIN CONEXION)"
echo "=============================================="
echo ""

if ! command -v node &> /dev/null
then
    echo "ERROR: Node.js no esta instalado."
    echo "Por favor instala Node.js para ejecutar la demostracion."
    exit 1
fi

echo "Sirviendo la aplicacion localmente..."

# Open browser depending on OS
if which xdg-open > /dev/null
then
  xdg-open http://localhost:4173 &
elif which open > /dev/null
then
  open http://localhost:4173 &
fi

npx serve -s dist -p 4173
