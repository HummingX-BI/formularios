/**
 * ZAMMIR Mock Data — expandido para demo realista
 * Todos los datos son ficticios pero específicos del oficio de vidriería.
 */

// ─── NEGOCIO ────────────────────────────────────────────────────────────────
export const negocio = {
  nombre: 'Soluciones en Vidrio y Aluminio ZAMMIR',
  nombreCorto: 'ZAMMIR',
  ubicacion: 'Otumba de Gómez Farías, Estado de México',
  telefono: '595 108 2247',
  dueno: 'Luis Ramírez Rodríguez',
  socio: 'Ricardo Mendoza Soto',
  logo: 'ZAMMIR',
  slogan: 'Medidas exactas. Trabajo de calidad.',
  aniosOperando: 1.5,
  garantiaMeses: 6, // Puede ser modificado más adelante cuando Luis confirme
};

// ─── USUARIOS / CAJEROS ─────────────────────────────────────────────────────
export const cajeros = [
  { id: 'luis', nombre: 'Luis Ramírez', rol: 'Dueño / Administrador', pin: '0000' },
  { id: 'ricardo', nombre: 'Ricardo Mendoza', rol: 'Socio / Vendedor', pin: '1111' },
  { id: 'mari', nombre: 'Mari Hernández', rol: 'Cajera', pin: '2222' },
  { id: 'tono', nombre: 'Toño Vargas', rol: 'Instalador / Ventas', pin: '3333' },
];

// ─── CATÁLOGO ───────────────────────────────────────────────────────────────
export const catalogo = [
  { id: 'c01', nombre: 'Vidrio claro / flotado 3mm', tipo: 'a medida', unidad: 'm²', precio: 180, sku: 'VCL-03', stock: null },
  { id: 'c02', nombre: 'Vidrio claro / flotado 6mm', tipo: 'a medida', unidad: 'm²', precio: 280, sku: 'VCL-06', stock: null },
  { id: 'c03', nombre: 'Vidrio claro / flotado 10mm', tipo: 'a medida', unidad: 'm²', precio: 420, sku: 'VCL-10', stock: null },
  { id: 'c04', nombre: 'Vidrio templado 6mm', tipo: 'a medida', unidad: 'm²', precio: 580, sku: 'VTP-06', stock: null },
  { id: 'c05', nombre: 'Vidrio templado 10mm', tipo: 'a medida', unidad: 'm²', precio: 890, sku: 'VTP-10', stock: null },
  { id: 'c06', nombre: 'Espejo 4mm plata', tipo: 'a medida', unidad: 'm²', precio: 320, sku: 'ESP-04', stock: null },
  { id: 'c07', nombre: 'Espejo 6mm anti-humedad', tipo: 'a medida', unidad: 'm²', precio: 480, sku: 'ESP-06AH', stock: null },
  { id: 'c08', nombre: 'Cristal doble / termopanel 20mm', tipo: 'a medida', unidad: 'm²', precio: 1200, sku: 'TPN-20', stock: null },
  { id: 'c09', nombre: 'Puerta corrediza aluminio natural', tipo: 'pieza estándar', unidad: 'pieza', precio: 4800, sku: 'PCA-NAT', stock: 4 },
  { id: 'c10', nombre: 'Puerta corrediza aluminio blanco', tipo: 'pieza estándar', unidad: 'pieza', precio: 5200, sku: 'PCA-BLC', stock: 3 },
  { id: 'c11', nombre: 'Ventana fija aluminio 1.20×1.00', tipo: 'pieza estándar', unidad: 'pieza', precio: 2400, sku: 'VFA-120', stock: 6 },
  { id: 'c12', nombre: 'Ventana proyectante aluminio 0.60×0.40', tipo: 'pieza estándar', unidad: 'pieza', precio: 1650, sku: 'VPR-060', stock: 8 },
  { id: 'c13', nombre: 'Cancelería interior aluminio natural (m²)', tipo: 'a medida', unidad: 'm²', precio: 1800, sku: 'CAN-INT', stock: null },
  { id: 'c14', nombre: 'Mampara de baño vidrio 6mm', tipo: 'a medida', unidad: 'pieza', precio: 6500, sku: 'MAM-06', stock: null },
  { id: 'c15', nombre: 'Vitrina mostrador vidrio 4mm', tipo: 'a medida', unidad: 'pieza', precio: 3800, sku: 'VIT-04', stock: null },
  { id: 'c16', nombre: 'Instalación a domicilio (Otumba área)', tipo: 'servicio', unidad: 'visita', precio: 350, sku: 'SRV-INST', stock: null },
  { id: 'c17', nombre: 'Medición a domicilio', tipo: 'servicio', unidad: 'visita', precio: 0, sku: 'SRV-MED', stock: null },
];

// ─── CLIENTES ───────────────────────────────────────────────────────────────
export const clientes = [
  { id: 'cl01', nombre: 'Familia Torres Ruiz', telefono: '595 102 3341', email: 'familia.torres@gmail.com', municipio: 'Otumba', tipo: 'residencial' },
  { id: 'cl02', nombre: 'Taquería El Buen Sazón', telefono: '595 100 8812', email: '', municipio: 'Otumba', tipo: 'comercial' },
  { id: 'cl03', nombre: 'Sra. Guadalupe Pérez Méndez', telefono: '595 104 5567', email: '', municipio: 'San Martín de las Pirámides', tipo: 'residencial' },
  { id: 'cl04', nombre: 'Constructora Alborada S.A.', telefono: '55 3312 4455', email: 'contacto@alborada.mx', municipio: 'Ecatepec', tipo: 'comercial' },
  { id: 'cl05', nombre: 'Farmacia San Pablo Ixquitlán', telefono: '595 106 2200', email: '', municipio: 'San Pablo Ixquitlán', tipo: 'comercial' },
  { id: 'cl06', nombre: 'Familia Medina Ortega', telefono: '595 103 7789', email: 'h.medina@hotmail.com', municipio: 'Otumba', tipo: 'residencial' },
  { id: 'cl07', nombre: 'Salón de Eventos Pirámide', telefono: '595 108 9901', email: '', municipio: 'Teotihuacán', tipo: 'comercial' },
  { id: 'cl08', nombre: 'Estética D Rosa', telefono: '595 107 1144', email: '', municipio: 'Otumba', tipo: 'comercial' },
  { id: 'cl09', nombre: 'Sr. Arturo González Reyes', telefono: '595 101 6623', email: '', municipio: 'Axapusco', tipo: 'residencial' },
  { id: 'cl10', nombre: 'Panadería La Espiga de Oro', telefono: '595 105 3318', email: '', municipio: 'Tepetlaoxtoc', tipo: 'comercial' },
  { id: 'cl11', nombre: 'Instituto Estelar Otumba', telefono: '595 109 4432', email: 'admin@estelarotumba.edu.mx', municipio: 'Otumba', tipo: 'institucional' },
  { id: 'cl12', nombre: 'Familia Ramírez Soto', telefono: '595 102 8877', email: '', municipio: 'Nopaltepec', tipo: 'residencial' },
  { id: 'cl13', nombre: 'Minisuper El Manantial', telefono: '595 103 2256', email: '', municipio: 'Otumba', tipo: 'comercial' },
  { id: 'cl14', nombre: 'Sra. Elena Vázquez Cruz', telefono: '595 104 9934', email: '', municipio: 'San Juan Teotihuacán', tipo: 'residencial' },
  { id: 'cl15', nombre: 'Taller Mecánico Los Cuates', telefono: '595 106 5521', email: '', municipio: 'Otumba', tipo: 'comercial' },
];

// ─── ÓRDENES DE TRABAJO ─────────────────────────────────────────────────────
export const ordenes = [
  {
    id: 'OT-2026-048', clienteId: 'cl01', fecha: '2026-09-15',
    descripcion: 'Ventanas de recámara, cristal doble termopanel',
    detalle: '2 ventanas 1.20×1.00 cristal doble, 1 ventana 0.60×0.40 fija',
    estatus: 'en proceso',
    anticipo: 2000, total: 5800, saldoPendiente: 3800,
    cajero: 'luis', instalacion: true, fechaCompromiso: '2026-09-27',
    items: [{ productoId: 'c08', descripcion: 'Termopanel 20mm', ancho: 1.20, alto: 1.00, cantidad: 2, subtotal: 2880 },
            { productoId: 'c11', descripcion: 'Ventana fija', ancho: 0.60, alto: 0.40, cantidad: 1, subtotal: 1650 },
            { productoId: 'c16', descripcion: 'Instalación', cantidad: 1, subtotal: 350 }]
  },
  {
    id: 'OT-2026-047', clienteId: 'cl02', fecha: '2026-09-18',
    descripcion: 'Puerta de aluminio con vidrio templado para fachada',
    detalle: 'Puerta corrediza 2 hojas, vidrio templado 10mm, perfil aluminio natural',
    estatus: 'listo para entrega',
    anticipo: 3000, total: 7400, saldoPendiente: 4400,
    cajero: 'ricardo', instalacion: true, fechaCompromiso: '2026-09-25',
    items: [{ productoId: 'c09', descripcion: 'Puerta corrediza AL natural', cantidad: 1, subtotal: 4800 },
            { productoId: 'c05', descripcion: 'Vidrio templado 10mm', ancho: 0.90, alto: 2.10, cantidad: 2, subtotal: 3374 }]
  },
  {
    id: 'OT-2026-046', clienteId: 'cl03', fecha: '2026-09-10',
    descripcion: 'Espejo de baño a medida con biseles',
    detalle: 'Espejo 4mm plata 1.20×0.80, bordes biselados 1.5cm',
    estatus: 'entregado',
    anticipo: 900, total: 900, saldoPendiente: 0,
    cajero: 'mari', instalacion: false, fechaCompromiso: '2026-09-14',
    items: [{ productoId: 'c06', descripcion: 'Espejo 4mm plata', ancho: 1.20, alto: 0.80, cantidad: 1, subtotal: 307 }]
  },
  {
    id: 'OT-2026-049', clienteId: 'cl04', fecha: '2026-09-20',
    descripcion: 'Cancelería interior 5 módulos oficinas',
    detalle: 'Cancelería aluminio natural con vidrio claro 6mm, 5 módulos de 1.80×2.40',
    estatus: 'en proceso',
    anticipo: 8000, total: 22000, saldoPendiente: 14000,
    cajero: 'luis', instalacion: true, fechaCompromiso: '2026-10-05',
    items: [{ productoId: 'c13', descripcion: 'Cancelería int. AL', cantidad: 5, subtotal: 9000 },
            { productoId: 'c02', descripcion: 'Vidrio claro 6mm', ancho: 1.80, alto: 2.40, cantidad: 5, subtotal: 6048 }]
  },
  {
    id: 'OT-2026-050', clienteId: 'cl05', fecha: '2026-09-22',
    descripcion: 'Vitrina mostrador farmacia',
    detalle: 'Vitrina 3.00×0.90 vidrio 4mm, 3 módulos con puerta corrediza',
    estatus: 'en espera',
    anticipo: 0, total: 12000, saldoPendiente: 12000,
    cajero: 'tono', instalacion: true, fechaCompromiso: '2026-10-10',
    items: [{ productoId: 'c15', descripcion: 'Vitrina mostrador', cantidad: 3, subtotal: 11400 }]
  },
  {
    id: 'OT-2026-045', clienteId: 'cl06', fecha: '2026-09-08',
    descripcion: 'Mampara de baño vidrio templado',
    detalle: 'Mampara 1.50×1.90 vidrio templado 6mm, perfil aluminio',
    estatus: 'entregado',
    anticipo: 4000, total: 7200, saldoPendiente: 0,
    cajero: 'luis', instalacion: true, fechaCompromiso: '2026-09-20',
    items: [{ productoId: 'c14', descripcion: 'Mampara de baño', cantidad: 1, subtotal: 6500 }]
  },
  {
    id: 'OT-2026-051', clienteId: 'cl07', fecha: '2026-09-23',
    descripcion: 'División salón de eventos vidrio esmerilado',
    detalle: 'Cancelería 8m lineal vidrio esmerilado 6mm, estructura aluminio natural',
    estatus: 'en espera',
    anticipo: 5000, total: 18500, saldoPendiente: 13500,
    cajero: 'ricardo', instalacion: true, fechaCompromiso: '2026-10-15',
    items: [{ productoId: 'c13', descripcion: 'Cancelería int. AL', cantidad: 8, subtotal: 14400 }]
  },
  {
    id: 'OT-2026-052', clienteId: 'cl08', fecha: '2026-09-24',
    descripcion: 'Espejo de pared estética',
    detalle: 'Espejo 4mm plata 3.00×1.20, instalación incluida',
    estatus: 'en proceso',
    anticipo: 600, total: 1554, saldoPendiente: 954,
    cajero: 'mari', instalacion: true, fechaCompromiso: '2026-09-26',
    items: [{ productoId: 'c06', descripcion: 'Espejo 4mm', ancho: 3.00, alto: 1.20, cantidad: 1, subtotal: 1152 }]
  },
  {
    id: 'OT-2026-053', clienteId: 'cl09', fecha: '2026-09-25',
    descripcion: 'Ventanas sala-comedor vidrio claro',
    detalle: '4 ventanas fijas 1.20×1.00, vidrio claro 6mm',
    estatus: 'en espera',
    anticipo: 2000, total: 6800, saldoPendiente: 4800,
    cajero: 'luis', instalacion: false, fechaCompromiso: '2026-10-01',
    items: [{ productoId: 'c11', descripcion: 'Ventana fija 1.20×1.00', cantidad: 4, subtotal: 9600 }]
  },
  {
    id: 'OT-2026-043', clienteId: 'cl10', fecha: '2026-09-02',
    descripcion: 'Vitrinas pan mostrador',
    detalle: 'Vitrina doble cara 2.40×0.80, vidrio 4mm',
    estatus: 'entregado',
    anticipo: 2000, total: 4200, saldoPendiente: 0,
    cajero: 'tono', instalacion: true, fechaCompromiso: '2026-09-07',
    items: [{ productoId: 'c15', descripcion: 'Vitrina mostrador', cantidad: 1, subtotal: 3800 }]
  },
];

// ─── CUENTAS POR COBRAR ──────────────────────────────────────────────────────
export const cuentasPorCobrar = ordenes
  .filter(o => o.saldoPendiente > 0)
  .map(o => {
    const cliente = clientes.find(c => c.id === o.clienteId);
    return {
      ordenId: o.id,
      clienteId: o.clienteId,
      clienteNombre: cliente?.nombre,
      saldo: o.saldoPendiente,
      total: o.total,
      anticipo: o.anticipo,
      fechaOrden: o.fecha,
      estatus: o.estatus,
      diasDesde: Math.floor((new Date() - new Date(o.fecha)) / (1000 * 60 * 60 * 24)),
    };
  });

// ─── HISTORIAL DE VENTAS (10 días) ───────────────────────────────────────────
export const historialVentas = [
  { fecha: '2026-09-16', total: 6200, efectivo: 4200, transferencia: 2000, trabajos: 3, cajero: 'luis' },
  { fecha: '2026-09-17', total: 3800, efectivo: 3800, transferencia: 0, trabajos: 2, cajero: 'mari' },
  { fecha: '2026-09-18', total: 9100, efectivo: 5100, transferencia: 4000, trabajos: 4, cajero: 'ricardo' },
  { fecha: '2026-09-19', total: 2400, efectivo: 2400, transferencia: 0, trabajos: 1, cajero: 'mari' },
  { fecha: '2026-09-20', total: 11500, efectivo: 6500, transferencia: 5000, trabajos: 5, cajero: 'luis' },
  { fecha: '2026-09-21', total: 4700, efectivo: 2700, transferencia: 2000, trabajos: 3, cajero: 'tono' },
  { fecha: '2026-09-22', total: 7200, efectivo: 4200, transferencia: 3000, trabajos: 4, cajero: 'luis' },
  { fecha: '2026-09-23', total: 5600, efectivo: 3600, transferencia: 2000, trabajos: 3, cajero: 'ricardo' },
  { fecha: '2026-09-24', total: 8900, efectivo: 5400, transferencia: 3500, trabajos: 5, cajero: 'mari' },
  { fecha: '2026-09-25', total: 8450, efectivo: 5200, transferencia: 3250, trabajos: 4, cajero: 'luis' },
];

// ─── RESUMEN DEL DÍA ACTUAL ──────────────────────────────────────────────────
export const resumenHoy = {
  fecha: '2026-09-25',
  ventaTotal: 8450,
  efectivo: 5200,
  transferencia: 3250,
  trabajosPendientes: ordenes.filter(o => ['en espera', 'en proceso'].includes(o.estatus)).length,
  trabajosListos: ordenes.filter(o => o.estatus === 'listo para entrega').length,
  trabajosEntregados: ordenes.filter(o => o.estatus === 'entregado').length,
  cuentasPorCobrar: cuentasPorCobrar.reduce((sum, c) => sum + c.saldo, 0),
  cajeroActivo: 'luis',
};

// ─── COTIZACIÓN DEMO (para la vista del cliente) ──────────────────────────────
export const cotizacionDemo = {
  folio: 'COT-2026-031',
  fecha: '2026-09-25',
  vigencia: '2026-10-10',
  clienteId: 'cl01',
  clienteNombre: 'Familia Torres Ruiz',
  clienteTelefono: '595 102 3341',
  vendedor: 'Luis Ramírez Rodríguez',
  direccionInstalacion: 'Callejón del Sapo 14, Centro, Otumba, Estado de México',
  items: [
    { descripcion: 'Cristal doble / termopanel 20mm (Corte a medida para ventanas)', dimensiones: '1.20m × 1.00m', cantidad: 2, unitario: 1440, subtotal: 2880 },
    { descripcion: 'Ventana fija con perfilería de aluminio natural (Pieza estándar)', dimensiones: '0.60m × 0.40m', cantidad: 1, unitario: 1650, subtotal: 1650 },
    { descripcion: 'Servicio de instalación a domicilio (Equipo de 2 técnicos)', dimensiones: 'N/A', cantidad: 1, unitario: 350, subtotal: 350 },
  ],
  subtotal: 4880,
  iva: 0,
  total: 5800,
  anticipo: 2000,
  saldo: 3800,
  condiciones: 'Anticipo del 35% para iniciar. Saldo contra entrega. Tiempo estimado: 10 días hábiles.',
  notas: 'Incluye medición previa sin costo. Garantía de instalación: 6 meses.',
  estatus: 'aceptada',
};

// ─── TIMELINE DEL CLIENTE DEMO ────────────────────────────────────────────────
export const timelineDemo = [
  { estatus: 'cotización enviada', fecha: '2026-09-15', completado: true, descripcion: 'Luis preparó y te envió esta cotización para tu revisión.' },
  { estatus: 'anticipo recibido', fecha: '2026-09-16', completado: true, descripcion: 'Mari validó tu anticipo de $2,000. ¡Tu proyecto ya está en nuestra agenda!' },
  { estatus: 'medición realizada', fecha: '2026-09-18', completado: true, descripcion: 'Toño visitó tu domicilio para tomar las medidas finales y asegurar un encaje perfecto.' },
  { estatus: 'en fabricación', fecha: '2026-09-20', completado: true, descripcion: 'Ricardo está trabajando en el taller cortando tu cristal y ensamblando la perfilería.' },
  { estatus: 'listo para instalación', fecha: null, completado: false, descripcion: 'Mari te contactará en cuanto tu material esté revisado y listo para salir del taller.' },
  { estatus: 'instalación y entrega', fecha: null, completado: false, descripcion: 'Toño y su equipo acudirán a tu domicilio para la instalación final. Podrás liquidar el saldo al terminar.' },
];

export default {
  negocio, cajeros, catalogo, clientes, ordenes,
  cuentasPorCobrar, historialVentas, resumenHoy,
  cotizacionDemo, timelineDemo,
};
