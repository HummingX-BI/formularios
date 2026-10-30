import { expect, test, type Page } from '@playwright/test';

/**
 * Guion de la demo (docs/10-guion-demo.md), pasos 1 a 8, sobre `npm run preview`
 * y usando el botón "Autollenar" del panel de demo. Sin errores en la consola.
 */

const errores: string[] = [];

test.beforeEach(async ({ page }) => {
  errores.length = 0;
  page.on('console', (m) => {
    if (m.type() === 'error') errores.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => errores.push(`pageerror: ${e.message}`));
});

/** Abre el panel de demo si no está abierto. */
async function abrirPanel(page: Page): Promise<void> {
  const boton = page.getByRole('button', { name: 'Panel de demo', exact: true });
  if ((await boton.getAttribute('aria-expanded')) !== 'true') await boton.click();
}

/** Abre el panel de demo y llena el formulario que haya en pantalla. */
async function autollenar(page: Page): Promise<void> {
  await expect(page.getByText(/Formulario llenado|Aquí no hay nada/)).toHaveCount(0);
  await abrirPanel(page);
  await page.getByRole('button', { name: 'Autollenar formulario' }).click();
  await expect(page.getByText('Formulario llenado')).toBeVisible({ timeout: 40_000 });
}

async function abrirWhatsApp(page: Page, como: 'Empresa' | 'Candidato'): Promise<void> {
  await abrirPanel(page);
  await page.getByRole('button', { name: /Abrir WhatsApp/ }).click();
  const simulador = page.getByRole('dialog', { name: 'Simulador de WhatsApp' });
  await simulador.getByRole('button', { name: como, exact: true }).click();
}

test('guion completo (pasos 1 a 8): Mariana, la clínica, avisos, renovación y tablero', async ({
  page,
}) => {
  // ── Paso 1 · Candidata: registro, CV en 5 pasos, plantilla Moderna, pago y PDF ──
  await page.goto('/#/');
  await page.getByRole('link', { name: /Busco trabajo/ }).click();
  await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
  await autollenar(page);
  await page.getByRole('button', { name: 'Crear mi cuenta' }).click();

  for (const paso of [1, 2, 3, 4, 5]) {
    await expect(
      page.getByRole('heading', { name: new RegExp(`^Paso ${paso} de 5`) }),
    ).toBeVisible();
    await autollenar(page);
    await page.getByRole('button', { name: paso === 5 ? 'Ver mi CV' : 'Guardar y seguir' }).click();
  }

  await expect(page.getByRole('heading', { name: '¡Tu CV está listo!' })).toBeVisible();
  await page.getByRole('radio', { name: /^Moderna/ }).click();
  await expect(page.getByText('Tu CV está completo')).toBeVisible();
  await page.getByRole('link', { name: /Descargar PDF/ }).click();
  await autollenar(page);
  const descarga = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Pagar $49' }).click();
  await expect(page.getByText('¡Pago aprobado!')).toBeVisible();
  expect((await descarga).suggestedFilename()).toBe('CV-Mariana-Lopez.pdf');
  await page.getByRole('button', { name: 'Volver a mi CV' }).click();
  await expect(page.getByRole('button', { name: 'Descargar de nuevo' })).toBeVisible();

  // ── Paso 2 · Empresa: registro, prueba gratis y vacante con 2 preguntas ──
  await page.goto('/#/registro/empresa');
  await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
  await autollenar(page);
  await page.getByRole('button', { name: 'Crear mi cuenta' }).click();
  await expect(page.getByRole('heading', { name: 'Elige tu plan' })).toBeVisible();
  await page.getByRole('button', { name: /Probar gratis 14 días/ }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Clínica San Rafael' })).toBeVisible();
  await expect(page.getByText(/Tu prueba termina el/)).toBeVisible();

  await page.getByRole('link', { name: 'Publicar vacante' }).first().click();
  await expect(page.getByRole('heading', { name: /^Paso 1 de 3/ })).toBeVisible();
  await autollenar(page);
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.getByRole('heading', { name: /^Paso 2 de 3/ })).toBeVisible();
  await autollenar(page);
  await expect(page.getByRole('textbox', { name: /Pregunta 2/ })).toBeVisible();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.getByRole('heading', { name: /^Paso 3 de 3/ })).toBeVisible();
  await page.getByRole('button', { name: 'Publicar vacante' }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Clínica San Rafael' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Enfermera general — turno nocturno' }),
  ).toBeVisible();

  // ── Paso 3 · WhatsApp: Mariana recibe el aviso de la vacante ──
  await abrirWhatsApp(page, 'Candidato');
  const simulador = page.getByRole('dialog', { name: 'Simulador de WhatsApp' });
  await expect(simulador.getByText(/Hay una vacante que coincide contigo/)).toBeVisible();
  await expect(simulador.getByText(/Enfermera general — turno nocturno/)).toBeVisible();

  // ── Paso 4 · Candidata: abre la vacante desde el mensaje y se postula; la clínica recibe aviso ──
  await simulador.getByRole('button', { name: 'Postularme' }).click();
  await expect(
    page.getByRole('heading', { name: /Enfermera general — turno nocturno en Clínica San Rafael/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Postularme en un clic' }).click();
  const preguntas = page.getByRole('dialog');
  await expect(preguntas.getByRole('radiogroup')).toHaveCount(2);
  for (const grupo of await preguntas.getByRole('radiogroup').all()) {
    await grupo.getByRole('radio', { name: 'Sí' }).click();
  }
  await preguntas.getByRole('button', { name: 'Enviar postulación' }).click();
  await expect(page.getByText('Tu postulación llegó a Clínica San Rafael.')).toBeVisible();
  await page.getByRole('link', { name: 'Ver mis postulaciones' }).click();
  await expect(page.getByRole('heading', { name: 'Tus postulaciones' })).toBeVisible();
  await expect(page.getByText('Enviada')).toBeVisible();

  await abrirWhatsApp(page, 'Empresa');
  await expect(
    page
      .getByRole('dialog', { name: 'Simulador de WhatsApp' })
      .getByText(/Tienes un nuevo postulante/),
  ).toBeVisible();
  await expect(
    page.getByRole('dialog', { name: 'Simulador de WhatsApp' }).getByText(/Mariana López/),
  ).toBeVisible();

  const simuladorWa = () => page.getByRole('dialog', { name: 'Simulador de WhatsApp' });
  const cerrarWhatsApp = async () => {
    await simuladorWa().getByRole('button', { name: 'Cerrar' }).click();
    await expect(simuladorWa()).toHaveCount(0);
  };
  const cambiarRol = async (rol: RegExp) => {
    await abrirPanel(page);
    await page.getByRole('button', { name: rol }).click();
  };

  // ── Paso 5 · La clínica ve a Mariana con "Cumple descarte" y la preselecciona ──
  await cerrarWhatsApp();
  await cambiarRol(/Empresa · Clínica San Rafael/);
  await expect(page.getByRole('heading', { name: 'Hola, Clínica San Rafael' })).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Enfermera general — turno nocturno' })
    .getByRole('link', { name: 'Ver postulantes' })
    .click();
  await expect(
    page.getByRole('heading', { name: /1 postulante para Enfermera general/ }),
  ).toBeVisible();
  await expect(page.getByText('Mariana López')).toBeVisible();
  await expect(page.getByText('Cumple descarte')).toBeVisible();
  await page.getByRole('button', { name: 'Preseleccionar' }).click();
  await expect(page.getByText('Preseleccionaste a Mariana López')).toBeVisible();

  await cambiarRol(/Candidata · Mariana/);
  await page.getByRole('link', { name: 'Postulaciones' }).first().click();
  await expect(page.getByRole('heading', { name: 'Tus postulaciones' })).toBeVisible();
  await expect(page.getByText('Preseleccionado')).toBeVisible();

  // ── Paso 6 · La clínica pide headhunting para "Jefa de enfermería" ──
  await cambiarRol(/Empresa · Clínica San Rafael/);
  await page.getByRole('link', { name: 'Headhunting' }).first().click();
  await expect(page.getByRole('heading', { name: 'Headhunting especializado' })).toBeVisible();
  await autollenar(page);
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect(page.getByText(/Recibimos tu solicitud/)).toBeVisible();
  const misSolicitudes = page.getByRole('region', { name: 'Mis solicitudes' });
  await expect(misSolicitudes.getByText('Jefa de enfermería')).toBeVisible();
  await expect(misSolicitudes.getByText('Recibida')).toBeVisible();

  // ── Paso 7 · Avanzar 30 días: avisos en orden, la clínica renueva y elige plan ──
  await abrirPanel(page);
  await page.getByRole('button', { name: '+30' }).click();
  await expect(page.getByText(/WhatsApp nuevos/)).toBeVisible();
  await abrirWhatsApp(page, 'Empresa');
  const chatEmpresa = simuladorWa();
  const orden = [/Tu prueba gratis vence/, /vence en 5 días/, /vence en 3 días/, /vence hoy/];
  for (const texto of orden) {
    await expect(chatEmpresa.getByText(texto)).toHaveCount(1);
  }
  const burbujas = await chatEmpresa.locator('p.whitespace-pre-line').allTextContents();
  const posiciones = orden.map((r) => burbujas.findIndex((b) => r.test(b)));
  expect(posiciones).toEqual([...posiciones].sort((a, b) => a - b));
  await chatEmpresa.getByRole('button', { name: 'Renovar' }).first().click();
  await expect(page.getByRole('heading', { name: 'Hola, Clínica San Rafael' })).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Enfermera general — turno nocturno' })
    .getByRole('button', { name: 'Renovar' })
    .click();
  await expect(page.getByText('Tu prueba terminó, elige un plan para seguir.')).toBeVisible();
  await page.getByRole('button', { name: 'Elegir plan' }).click();
  await expect(page.getByRole('heading', { name: 'Elige tu plan' })).toBeVisible();
  await page.getByRole('button', { name: 'Contratar' }).first().click();
  await autollenar(page);
  await page.getByRole('button', { name: /^Pagar \$/ }).click();
  await expect(page.getByText('Tu vacante se renovó por 30 días.')).toBeVisible();
  await page.getByRole('button', { name: 'Ir a mi panel' }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Clínica San Rafael' })).toBeVisible();

  // ── Paso 8 · Administrador: empresas 3 de 3, candidatos 47 de 50 y headhunting asignado ──
  await cambiarRol(/Administrador/);
  await expect(page.getByRole('heading', { name: 'Tablero del piloto' })).toBeVisible();
  const metas = page.getByRole('region', { name: 'Metas del piloto' });
  await expect(metas).toContainText('Empresas activas');
  await expect(metas).toContainText('3 / 3');
  await expect(metas).toContainText('Meta cumplida');
  await expect(metas).toContainText('47 / 50');
  const headhunting = page.getByRole('region', { name: 'Solicitudes de headhunting' });
  const fila = headhunting.getByRole('row').filter({ hasText: 'Jefa de enfermería' });
  await expect(fila).toContainText('Recibida');
  await fila.getByRole('button', { name: 'Asignar reclutador' }).click();
  await page.getByRole('dialog').getByLabel('Reclutador').selectOption('Andrea Solís');
  await page.getByRole('dialog').getByRole('button', { name: 'Asignar', exact: true }).click();
  await expect(fila).toContainText('En búsqueda');
  await expect(fila).toContainText('Andrea Solís');

  expect(errores, errores.join('\n')).toEqual([]);
});
