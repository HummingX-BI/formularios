import { ModulePage } from '@/ui/ModulePage';

export default function AboutDemoPage() {
  return (
    <ModulePage
      module={{
        id: 'M13.5',
        categoryId: 13,
        title: 'Acerca de la Demostración',
        level: 'S',
        route: '',
        icon: '',
        shortDescription: '',
        businessQuestion: '¿Qué estoy viendo en esta demostración?',
        component: null as any,
      }}
    >
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <section className="bg-white p-6 rounded-xl border border-ice-100 shadow-sm">
          <h2 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🌊</span> Sobre Club Azulejo
          </h2>
          <p className="text-secundario leading-relaxed mb-4">
            Bienvenido a <strong>Club Azulejo CA</strong>. Todos los datos, alumnos, pagos y comportamientos que ves en este entorno han sido <strong>generados por un simulador matemático</strong> para ilustrar el poder de la analítica avanzada en el sector de natación.
          </p>
          <p className="text-secundario leading-relaxed">
            Ninguna persona, nombre o tarjeta de crédito en esta plataforma es real.
          </p>
        </section>

        <section className="bg-white p-6 rounded-xl border border-ice-100 shadow-sm">
          <h3 className="text-lg font-bold text-navy-900 mb-4">¿Qué INCLUYE esta demostración?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <div>
                <strong>Algoritmos Reales:</strong> Los modelos de riesgo de abandono (Machine Learning), optimización de horarios y simulaciones financieras funcionan exactamente como lo harían en producción.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <div>
                <strong>Interactividad Total:</strong> Puedes cambiar precios, reasignar grupos o aprobar recomendaciones y ver el impacto calculado en tiempo real.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <div>
                <strong>Interfaz Completa:</strong> Los 58 módulos están disponibles para navegar y explorar la profundidad del producto.
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl border border-ice-100 shadow-sm">
          <h3 className="text-lg font-bold text-navy-900 mb-4">¿Qué NO INCLUYE esta demostración?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">⚠</span>
              <div>
                <strong>Integraciones Físicas:</strong> No hay conexión con torniquetes, lectores de huella o cámaras. Esas integraciones se hacen a la medida en la instalación física.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">⚠</span>
              <div>
                <strong>Pasarelas de Pago Reales:</strong> Los módulos de cobro muestran la interfaz, pero no realizan cargos a tarjetas.
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-sky-50 p-6 rounded-xl border border-sky-100">
          <h3 className="text-lg font-bold text-blue-800 mb-4">¿Cómo se conectaría con tus datos reales?</h3>
          <p className="text-secundario leading-relaxed mb-4">
            Al implementar el sistema en tu escuela, realizamos una conexión (API o migración de bases de datos) con tu sistema actual de cobros o accesos. 
          </p>
          <p className="text-secundario leading-relaxed">
            Nuestro motor lee tu historial, aprende de los comportamientos de tus clientes reales y comienza a emitir predicciones y alertas específicas para tu negocio desde el día uno.
          </p>
        </section>
      </div>
    </ModulePage>
  );
}
