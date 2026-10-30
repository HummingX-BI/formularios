# Despliegue de la demo

La demo es un sitio estático (solo frontend). La carpeta `app/dist` que genera `npm run build` se puede subir a
cualquier hosting estático. Usa `HashRouter` y rutas relativas (`base: './'`), así que funciona en la raíz o en
una subcarpeta sin configurar nada más.

## Antes de publicar

```bash
cd Talentiamex/app
npm ci
npm run typecheck && npm run lint && npm test && npm run build
```

Esas mismas revisiones corre el flujo de GitHub Actions antes de publicar.

## Opción A · GitHub Pages (ya preparada)

El flujo `.github/workflows/talentiamex-pages.yml` compila y publica `Talentiamex/app/dist`. **No se ejecuta
solo**: se lanza a mano.

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (una sola vez).
2. **Actions → "Talentiamex · publicar demo en GitHub Pages" → Run workflow**.
3. La URL queda en el resultado del trabajo `publicar`, normalmente
   `https://<organizacion>.github.io/<repositorio>/`.

> Ojo: el repositorio `HummingX-BI/formularios` es **público**. Una página de Pages también lo es, y la demo
> muestra el producto del cliente. Si no debe verse por fuera, publica en otro hosting con acceso restringido o
> pasa el repositorio a privado (Pages en repositorios privados requiere un plan de pago).

## Opción B · Netlify, Vercel o Cloudflare Pages

- Carpeta base: `Talentiamex/app`
- Comando de compilación: `npm run build`
- Carpeta de publicación: `dist`
- Node 22.

No hace falta configurar reglas de redirección porque las rutas usan `#`.

## Opción C · Servidor propio

Copia el contenido de `app/dist` a cualquier carpeta servida por Nginx, Apache o similar. Para probarlo en local:
`npm run preview -- --port 4173`.

## Notas

- No hay variables de entorno ni backend: todo corre en el navegador. El estado se guarda en `localStorage`.
- `manifest.webmanifest` e íconos 192/512 ya están en `dist` (la demo se puede "instalar" en el celular).
- La prueba de extremo a extremo (`npm run test:e2e`) necesita un Chromium instalado en la máquina; en GitHub
  Actions no se ejecuta.
