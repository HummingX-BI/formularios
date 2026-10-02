import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import '../styles/factura.css';

const order = { folio: 'OT-1048', concept: 'Cancel fijo + instalación', amount: 18560 };

function downloadIllustrativePdf(form) {
  const doc = new jsPDF();
  doc.setFillColor(20, 38, 61);
  doc.rect(0, 0, 210, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ZAMMIR', 18, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('VIDRIO & ALUMINIO', 18, 23);
  doc.setTextColor(20, 38, 61);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Factura ilustrativa', 18, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 105, 115);
  doc.text('Ejemplo visual para presentacion - no es un CFDI timbrado', 18, 63);
  doc.setDrawColor(210, 220, 225);
  doc.line(18, 72, 192, 72);
  doc.setTextColor(20, 38, 61);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDEN DE TRABAJO', 18, 86);
  doc.text(order.folio, 150, 86);
  doc.setFont('helvetica', 'normal');
  doc.text('Receptor', 18, 103);
  doc.text(`${form.razon} (${form.rfc})`, 18, 111);
  doc.text(`C.P. ${form.cp} · ${form.regimen}`, 18, 119);
  doc.text(`Uso CFDI: ${form.uso}`, 18, 127);
  doc.setFillColor(241, 246, 248);
  doc.rect(18, 143, 174, 31, 'F');
  doc.setTextColor(20, 38, 61);
  doc.text(order.concept, 26, 156);
  doc.text(`$${order.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, 145, 156);
  doc.setFontSize(9);
  doc.setTextColor(90, 105, 115);
  doc.text('Este documento representa como podria verse la factura final.', 18, 195);
  doc.text(`Correo de entrega: ${form.email}`, 18, 203);
  doc.save(`Factura_ilustrativa_${order.folio}.pdf`);
}

export default function FacturaPortal() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ rfc: 'XAXX010101000', razon: 'Cliente mostrador', cp: '64000', email: 'cliente@correo.com', regimen: '616 - Sin obligaciones fiscales', uso: 'G03 - Gastos en general' });
  const [sent, setSent] = useState(false);
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  return (
    <main className="invoice-app">
      <header className="invoice-header">
        <a className="invoice-brand" href="/">ZAMMIR <span>vidrio & aluminio</span></a>
        <div className="invoice-secure"><span className="secure-dot" /> Portal seguro <b>•</b> CFDI 4.0</div>
      </header>
      <section className="invoice-shell">
        <div className="invoice-intro">
          <div className="eyebrow">FACTURACION DIGITAL</div>
          <h1>Tu factura,<br /><em>sin esperas.</em></h1>
          <p>Captura tus datos fiscales y recibe la factura de tu orden de trabajo directamente en tu correo.</p>
          <div className="order-chip"><span>ORDEN DE TRABAJO</span><strong>{order.folio}</strong><b>${order.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</b></div>
          <div className="invoice-qr-card"><QRCodeSVG value="https://zammir.mx/factura?orden=OT-1048" size={90} bgColor="#ffffff" fgColor="#14263d" /><div><span>Escanea para facturar</span><strong>Este QR vive en tu comprobante</strong><small>También puedes compartir este enlace con tu contador.</small></div></div>
        </div>
        <div className="invoice-panel">
          <div className="steps"><span className={step >= 1 ? 'active' : ''}>01 <b>Datos fiscales</b></span><i /><span className={step >= 2 ? 'active' : ''}>02 <b>Confirmación</b></span><i /><span className={step >= 3 ? 'active' : ''}>03 <b>Enviado</b></span></div>
          {step === 1 && <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="panel-heading"><span>01 / DATOS DEL RECEPTOR</span><h2>¿A quién emitimos tu factura?</h2><p>Usaremos esta información únicamente para generar tu CFDI.</p></div>
            <div className="field-grid"><label>RFC<input value={form.rfc} onChange={update('rfc')} required /></label><label>Razón social<input value={form.razon} onChange={update('razon')} required /></label><label>Código postal<input value={form.cp} onChange={update('cp')} required /></label><label>Régimen fiscal<select value={form.regimen} onChange={update('regimen')}><option>616 - Sin obligaciones fiscales</option><option>601 - General de Ley Personas Morales</option><option>612 - Personas Físicas con Actividades Empresariales</option></select></label><label>Uso de CFDI<select value={form.uso} onChange={update('uso')}><option>G03 - Gastos en general</option><option>S01 - Sin efectos fiscales</option><option>I01 - Construcciones</option></select></label><label>Correo de entrega<input type="email" value={form.email} onChange={update('email')} required /></label></div>
            <div className="notice">⌁ Tus datos viajan cifrados y la factura se genera en formato XML y PDF.</div><button className="invoice-button" type="submit">Continuar <span>→</span></button>
          </form>}
          {step === 2 && <div className="confirmation"><div className="checkmark">✓</div><div className="panel-heading"><span>02 / REVISA Y CONFIRMA</span><h2>Todo listo para timbrar.</h2><p>Verifica que tus datos sean correctos antes de generar la factura.</p></div><div className="review-box"><div><small>RFC</small><strong>{form.rfc}</strong></div><div><small>RAZÓN SOCIAL</small><strong>{form.razon}</strong></div><div><small>CORREO</small><strong>{form.email}</strong></div><div><small>ORDEN</small><strong>{order.folio} · ${order.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></div></div><button className="invoice-button" onClick={() => { setSent(true); setStep(3); }}>Generar factura <span>→</span></button><button className="back-button" onClick={() => setStep(1)}>← Editar datos</button></div>}
          {step === 3 && <div className="confirmation sent-state"><div className="success-icon">✦</div><div className="panel-heading"><span>03 / DOCUMENTO GENERADO</span><h2>Ya va en camino.</h2><p>Enviamos la factura simulada a <strong>{form.email}</strong>. También puedes descargar el documento ilustrativo.</p></div><div className="download-row"><button onClick={() => setSent(true)}>↓ <span>Descargar XML</span><small>XML de demostración</small></button><button onClick={() => downloadIllustrativePdf(form)}>↓ <span>Descargar PDF</span><small>PDF ilustrativo descargable</small></button></div><div className="success-note">Documento ilustrativo para demostración. No tiene validez fiscal ni sustituye un CFDI timbrado.</div><a className="back-button" href="/">Volver al inicio</a></div>}
        </div>
      </section>
      <footer className="invoice-footer"><span>© 2026 ZAMMIR</span><span>Soporte · Aviso de privacidad</span></footer>
    </main>
  );
}
