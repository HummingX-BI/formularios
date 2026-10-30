import { CLINICA, MARIANA } from '@/data/personajes';
import { useDemoStore } from '@/store/useDemoStore';

/** Navega la app visible: la de la vista celular si está abierta, o la de la ventana. */
export function navegarA(ruta: string): void {
  const marco = document.querySelector<HTMLIFrameElement>('iframe[data-vista-celular]');
  if (!marco?.contentWindow) {
    window.location.hash = `#${ruta}`;
    return;
  }
  // El iframe recibe el estado nuevo por el evento "storage"; se espera a que lo reciba
  // para que RequireRole no lo mande a /entrar con la sesión anterior.
  const destino = marco.contentWindow;
  setTimeout(() => {
    destino.location.hash = `#${ruta}`;
  }, 200);
}

/** Entra como Mariana; si todavía no existe, la crea con su CV completo. */
export function entrarComoMariana(): void {
  const s = useDemoStore.getState();
  const existente = s.candidatos.find((c) => c.correo === MARIANA.correo);
  if (existente) {
    s.entrarComo('candidato', existente.id);
  } else {
    s.registrarCandidato({
      nombre: MARIANA.nombre,
      celular: MARIANA.celular,
      correo: MARIANA.correo,
    });
    useDemoStore.getState().guardarPasoCv(5, MARIANA.cv);
  }
  navegarA('/candidato/vacantes');
}

/** Entra como Clínica San Rafael; si no existe, la crea con prueba gratis activa. */
export function entrarComoClinica(): void {
  const s = useDemoStore.getState();
  const existente = s.empresas.find((e) => e.correo === CLINICA.correo);
  if (existente) {
    s.entrarComo('empresa', existente.id);
  } else {
    const { contrasena: _contrasena, ...datos } = CLINICA;
    s.registrarEmpresa(datos);
    useDemoStore.getState().iniciarPrueba('basico');
  }
  navegarA('/empresa');
}

export function entrarComoAdmin(): void {
  useDemoStore.getState().entrarComo('admin', 'admin');
  navegarA('/admin');
}

/** Regresa la demo al estado inicial y vuelve al inicio. */
export function reiniciarDemo(): void {
  useDemoStore.getState().resetDemo();
  navegarA('/');
}
