#!/bin/bash
echo "==================================================="
echo "    INICIANDO DEMO PANTERA (VERSION PRODUCCION)"
echo "==================================================="
echo ""
echo "1. Cerrando servidores anteriores..."
pkill -f "node"

echo "2. Preparando entorno optimizado..."
npm run preview -- --port 8080 --host &

echo "3. Esperando al servidor..."
sleep 3

echo "4. Abriendo la plataforma en el navegador..."
if which xdg-open > /dev/null
then
  xdg-open http://localhost:8080/
elif which open > /dev/null
then
  open http://localhost:8080/
fi

echo ""
echo "==================================================="
echo " SISTEMA EN LINEA. PUEDES MINIMIZAR ESTA VENTANA."
echo "==================================================="
wait
