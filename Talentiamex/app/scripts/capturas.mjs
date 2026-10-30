// Capturas de P01 a P18 a 390 y 1280 px en app/screenshots/, con un informe de desbordes.
// Uso: npm run build && npm run preview -- --port 4173   (en otra terminal)
//      node scripts/capturas.mjs
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'screenshots');
const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const CLAVE = 'talentiamex-demo-v1';

function chromiumInstalado() {
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH) return process.env.PLAYWRIGHT_CHROMIUM_PATH;
  const base =
    process.env.PLAYWRIGHT_BROWSERS_PATH ?? join(process.env.LOCALAPPDATA ?? '', 'ms-playwright');
  if (!existsSync(base)) return undefined;
  const revisiones = readdirSync(base)
    .filter((d) => /^chromium_headless_shell-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  for (const d of revisiones) {
    const exe = join(base, d, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
    if (existsSync(exe)) return exe;
  }
  return undefined;
}

const TAMANOS = [
  { nombre: '390', ancho: 390, alto: 844 },
  { nombre: '1280', ancho: 1280, alto: 800 },
];

/** Pantallas: [id, rol, ruta, acción previa opcional]. */
const PANTALLAS = [
  ['P01', null, '/'],
  ['P02-registro-candidato', null, '/registro/candidato'],
  ['P02-registro-empresa', null, '/registro/empresa'],
  ['P02-entrar', null, '/entrar'],
  ['P03-paso1', 'mariana', '/candidato/cv/paso/1'],
  ['P03-paso2', 'mariana', '/candidato/cv/paso/2'],
  ['P03-paso3', 'mariana', '/candidato/cv/paso/3'],
  ['P03-paso4', 'mariana', '/candidato/cv/paso/4'],
  ['P03-paso5', 'mariana', '/candidato/cv/paso/5'],
  ['P04', 'mariana', '/candidato/cv'],
  ['P05', 'mariana', '/candidato/cv/pagar'],
  ['P06', 'mariana', '/candidato/vacantes'],
  ['P07', 'mariana', '/candidato/vacantes/vac-02'],
  ['P08', 'mariana', '/candidato/postulaciones'],
  ['P09', 'tere', '/empresa/planes'],
  ['P10', 'tere', '/empresa'],
  ['P11-paso1', 'tere', '/empresa/vacantes/nueva'],
  ['P12', 'tere', '/empresa/vacantes/vac-06/postulantes'],
  ['P13', 'tere', '/empresa/perfiles'],
  ['P14', 'tere', '/empresa/headhunting'],
  ['P15', 'admin', '/admin'],
  ['P16', 'admin', '/admin/gestion'],
  ['P17', 'admin', '/admin/catalogos'],
  ['P18', 'tere', '/empresa', 'whatsapp'],
];

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function ocultarPanel(page) {
  const boton = page.getByRole('button', { name: 'Panel de demo', exact: true });
  if (await boton.count()) await page.keyboard.press('d');
}

async function entrarComo(page, quien) {
  if (quien === 'mariana') {
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Panel de demo', exact: true }).click();
    await page.getByRole('button', { name: /Candidata · Mariana/ }).click();
    await espera(400);
    return;
  }
  const sesion =
    quien === 'tere'
      ? { rol: 'empresa', id: 'emp-03' }
      : quien === 'admin'
        ? { rol: 'admin', id: 'admin' }
        : null;
  await page.evaluate(
    ([clave, s]) => {
      const raw = JSON.parse(localStorage.getItem(clave) ?? '{}');
      raw.state.sesion = s;
      localStorage.setItem(clave, JSON.stringify(raw));
    },
    [CLAVE, sesion],
  );
  // Se recarga para que la app tome la sesión nueva antes de cambiar de ruta.
  await page.reload();
  await page.waitForLoadState('networkidle');
}

const informe = [];
mkdirSync(SALIDA, { recursive: true });
const ejecutable = chromiumInstalado();
const navegador = await chromium.launch(ejecutable ? { executablePath: ejecutable } : {});

for (const tam of TAMANOS) {
  const contexto = await navegador.newContext({ viewport: { width: tam.ancho, height: tam.alto } });
  const page = await contexto.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));

  await page.goto(`${BASE}/#/`);
  await page.waitForLoadState('networkidle');
  let quienActual = null;

  for (const [id, quien, ruta, extra] of PANTALLAS) {
    if (quien !== quienActual && quien !== null) {
      await entrarComo(page, quien);
      quienActual = quien;
    } else if (quien === null && quienActual !== null) {
      await page.evaluate((clave) => {
        const raw = JSON.parse(localStorage.getItem(clave) ?? '{}');
        raw.state.sesion = null;
        localStorage.setItem(clave, JSON.stringify(raw));
      }, CLAVE);
      quienActual = null;
    }
    await page.goto(`${BASE}/#${ruta}`);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await espera(700);

    if (extra === 'whatsapp') {
      await page.getByRole('button', { name: 'Panel de demo', exact: true }).click();
      await page.getByRole('button', { name: /Abrir WhatsApp/ }).click();
      await espera(1500);
    } else {
      await ocultarPanel(page);
    }

    const medidas = await page.evaluate(() => {
      const ancho = window.innerWidth;
      const fuera = [...document.querySelectorAll('body *')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.right > ancho + 1 &&
            !e.closest('[data-cv-hoja]') &&
            !e.closest('[role=img]') &&
            !e.closest('.overflow-x-auto') &&
            !e.closest('svg')
          );
        })
        .slice(0, 4)
        .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 50)}`);
      return { ancho, scrollW: document.documentElement.scrollWidth, fuera };
    });
    const archivo = `${id}-${tam.nombre}.png`;
    await page.screenshot({ path: join(SALIDA, archivo), fullPage: extra !== 'whatsapp' });
    informe.push({
      pantalla: id,
      tamano: tam.nombre,
      archivo,
      desborde: medidas.scrollW > medidas.ancho,
      elementosFuera: medidas.fuera,
    });
    console.log(
      `${medidas.scrollW > medidas.ancho || medidas.fuera.length ? '⚠' : '✓'} ${archivo}`,
    );
    if (extra === 'whatsapp') await page.keyboard.press('Escape');
  }
  if (errores.length)
    console.log(`Errores de consola a ${tam.nombre}:`, [...new Set(errores)].slice(0, 5));
  await contexto.close();
}

await navegador.close();
writeFileSync(join(SALIDA, 'informe.json'), JSON.stringify(informe, null, 2));
const malos = informe.filter((i) => i.desborde || i.elementosFuera.length);
console.log(`\n${informe.length} capturas, ${malos.length} con posibles desbordes.`);
for (const m of malos) console.log(' -', m.archivo, m.elementosFuera.join(' | '));
