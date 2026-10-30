#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo "==================================================="
echo "    INICIANDO DEMO TALENTIAMEX"
echo "==================================================="
echo ""
echo "1. Liberando el puerto 4173..."
if command -v lsof > /dev/null; then
  lsof -ti tcp:4173 | xargs kill -9 2> /dev/null
fi

echo "2. Preparando la version de presentacion..."
[ -d node_modules ] || npm install
if ! npm run build; then
  echo ""
  echo "No se pudo compilar. Revisa los mensajes de arriba."
  exit 1
fi

echo "3. Iniciando el servidor..."
npm run preview -- --port 4173 --strictPort &
SERVIDOR=$!
sleep 4

echo "4. Abriendo la plataforma en el navegador..."
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:4173/
elif command -v open > /dev/null; then
  open http://localhost:4173/
elif command -v start > /dev/null; then
  start http://localhost:4173/
fi

echo ""
echo "==================================================="
echo " LISTO EN http://localhost:4173/"
echo " Puedes minimizar esta ventana. Ctrl+C detiene la demo."
echo "==================================================="
trap 'kill $SERVIDOR 2> /dev/null' EXIT
wait $SERVIDOR
