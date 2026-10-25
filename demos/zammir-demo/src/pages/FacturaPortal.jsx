import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import '../styles/factura.css';

const order = { folio: 'OT-1048', concept: 'Cancel fijo + instalación', amount: 18560, date: new Date().toLocaleDateString('es-MX') };

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

function downloadIllustrativePdf(form) {
  const doc = new jsPDF();
  const uuid = generateUUID();
  const dateStr = new Date().toLocaleString('es-MX');

  // Header & Emisor
  doc.setFillColor(30, 50, 75);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ZAMMIR VIDRIO & ALUMINIO S.A. DE C.V.', 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('RFC: ZAM230401XXX  |  Régimen: 601 General de Ley Personas Morales', 14, 18);
  
  // Title / Folio
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA (Ingreso)', 130, 35);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Folio Interno: ${order.folio}`, 130, 41);
  doc.text(`Fecha y hora de emisión: ${dateStr}`, 130, 46);
  doc.text(`Lugar de expedición: 64000`, 130, 51);

  // Receptor
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, 60, 182, 30, 2, 2, 'FD');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL RECEPTOR', 18, 66);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Razón Social: ${form.razon}`, 18, 73);
  doc.text(`RFC: ${form.rfc}`, 18, 78);
  doc.text(`Domicilio Fiscal (C.P.): ${form.cp}`, 18, 83);
  doc.text(`Régimen Fiscal: ${form.regimen.split(' - ')[0]}`, 110, 73);
  doc.text(`Uso de CFDI: ${form.uso.split(' - ')[0]}`, 110, 78);

  // Conceptos Table Header
  doc.setFillColor(30, 50, 75);
  doc.rect(14, 98, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CANT', 16, 103);
  doc.text('UNIDAD', 32, 103);
  doc.text('CONCEPTO / DESCRIPCIÓN', 55, 103);
  doc.text('V. UNITARIO', 140, 103);
  doc.text('IMPORTE', 170, 103);

  // Conceptos Row
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setDrawColor(200, 200, 200);
  doc.rect(14, 106, 182, 12, 'D');
  doc.text('1', 18, 113);
  doc.text('E48', 34, 113);
  doc.text(order.concept, 55, 113);
  
  const subtotal = order.amount / 1.16;
  const iva = order.amount - subtotal;
  
  doc.text(`$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 140, 113);
  doc.text(`$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 170, 113);

  // Totals
  doc.roundedRect(120, 125, 76, 25, 2, 2, 'D');
  doc.text('Subtotal:', 125, 131);
  doc.text(`$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 165, 131);
  doc.text('IVA (16%):', 125, 137);
  doc.text(`$${iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 165, 137);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 125, 145);
  doc.text(`$${order.amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 165, 145);

  // Fiscal Data Footer (SAT Seals)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 160, 196, 160);
  
  // QR Placeholder (using jsPDF primitives to simulate)
  doc.rect(14, 165, 30, 30, 'D');
  doc.text('QR SAT', 22, 180);

  doc.setFont('helvetica', 'bold');
  doc.text('Folio Fiscal (UUID):', 50, 169);
  doc.setFont('helvetica', 'normal');
  doc.text(uuid, 80, 169);

  doc.setFont('helvetica', 'bold');
  doc.text('Sello Digital del CFDI:', 50, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text('aB3dE... (Cadena representativa del sello digital del emisor)', 50, 179);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('Sello del SAT:', 50, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text('XyZ89... (Cadena representativa del sello digital del SAT)', 50, 189);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('Cadena Original del complemento de certificación digital del SAT:', 14, 205);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text(`||1.1|${uuid}|${dateStr}|SAT970701NN3|aB3dE...||`, 14, 209);

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Este documento es una representación impresa de un CFDI (Simulación).', 14, 280);

  doc.save(`Factura_${form.rfc}_${order.folio}.pdf`);
}

export default function FacturaPortal() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ rfc: '', razon: '', cp: '', email: '', regimen: '601 - General de Ley Personas Morales', uso: 'G03 - Gastos en general' });
  const [sent, setSent] = useState(false);
  
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  return (
    <main className="formal-portal">
      <header className="portal-header">
        <div className="portal-container header-inner">
          <div className="brand-group">
            <span className="logo-text">ZAMMIR</span>
            <span className="logo-sub">VIDRIO & ALUMINIO</span>
          </div>
          <div className="security-badge">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M7 0C4.79 0 3 1.79 3 4V5H2C.895 5 0 5.895 0 7V14C0 15.105.895 16 2 16H12C13.105 16 14 15.105 14 14V7C14 5.895 13.105 5 12 5H11V4C11 1.79 9.21 0 7 0ZM7 2C8.105 2 9 2.895 9 4V5H5V4C5 2.895 5.895 2 7 2ZM7 9C7.828 9 8.5 9.672 8.5 10.5C8.5 11.115 8.13 11.642 7.6 11.866V13.5C7.6 13.776 7.376 14 7.1 14H6.9C6.624 14 6.4 13.776 6.4 13.5V11.866C5.87 11.642 5.5 11.115 5.5 10.5C5.5 9.672 6.172 9 7 9Z"/></svg>
            Conexión Segura TLS 1.2
          </div>
        </div>
      </header>
      
      <div className="portal-sub-header">
        <div className="portal-container">
          <h1>Portal de Autofacturación CFDI 4.0</h1>
          <p>Trámite oficial para la emisión de comprobantes fiscales digitales.</p>
        </div>
      </div>

      <section className="portal-container portal-content">
        <div className="layout-grid">
          
          <div className="form-column">
            <div className="stepper">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <span>Datos Fiscales</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span>Verificación</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Emisión</span>
              </div>
            </div>

            <div className="card form-card">
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="card-header">
                    <h2>I. Información del Receptor</h2>
                    <p>Ingrese los datos fiscales correspondientes a la Constancia de Situación Fiscal actualizada.</p>
                  </div>
                  
                  <div className="form-group">
                    <label>RFC (Registro Federal de Contribuyentes) *</label>
                    <input type="text" value={form.rfc} onChange={update('rfc')} placeholder="Ej. XAXX010101000" required />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Razón Social (Sin régimen societario) *</label>
                      <input type="text" value={form.razon} onChange={update('razon')} placeholder="Nombre completo o Empresa" required />
                    </div>
                    <div className="form-group">
                      <label>Código Postal *</label>
                      <input type="text" value={form.cp} onChange={update('cp')} placeholder="Ej. 64000" pattern="\d{5}" required title="Debe contener 5 dígitos" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Régimen Fiscal *</label>
                    <select value={form.regimen} onChange={update('regimen')} required>
                      <option value="601 - General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                      <option value="605 - Sueldos y Salarios e Ingresos Asimilados a Salarios">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                      <option value="612 - Personas Físicas con Actividades Empresariales">612 - Personas Físicas con Actividades Empresariales</option>
                      <option value="616 - Sin obligaciones fiscales">616 - Sin obligaciones fiscales</option>
                      <option value="626 - Régimen Simplificado de Confianza">626 - Régimen Simplificado de Confianza</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Uso de CFDI *</label>
                    <select value={form.uso} onChange={update('uso')} required>
                      <option value="G01 - Adquisición de mercancías">G01 - Adquisición de mercancías</option>
                      <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                      <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                      <option value="I01 - Construcciones">I01 - Construcciones</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Correo Electrónico de Recepción *</label>
                    <input type="email" value={form.email} onChange={update('email')} placeholder="facturacion@empresa.com" required />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Validar y Continuar</button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="review-section">
                  <div className="card-header">
                    <h2>II. Verificación de Datos</h2>
                    <p>Por favor revise detenidamente que la información ingresada coincida con su Constancia de Situación Fiscal. Una vez timbrado el CFDI no habrá cancelaciones.</p>
                  </div>
                  
                  <div className="data-table">
                    <div className="data-row">
                      <span className="data-label">RFC Contribuyente</span>
                      <span className="data-value">{form.rfc}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Razón Social</span>
                      <span className="data-value">{form.razon}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">C.P. Domicilio Fiscal</span>
                      <span className="data-value">{form.cp}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Régimen Fiscal</span>
                      <span className="data-value">{form.regimen}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Uso de CFDI</span>
                      <span className="data-value">{form.uso}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Correo de Destino</span>
                      <span className="data-value">{form.email}</span>
                    </div>
                  </div>

                  <div className="legal-checkbox">
                    <label>
                      <input type="checkbox" required defaultChecked />
                      Declaro bajo protesta de decir verdad que los datos proporcionados son correctos y concuerdan con los registros del SAT.
                    </label>
                  </div>

                  <div className="form-actions multi">
                    <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Modificar Datos</button>
                    <button type="button" className="btn-primary" onClick={() => { setSent(true); setStep(3); }}>Emitir CFDI</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="success-section">
                  <div className="success-icon-large">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div className="card-header center">
                    <h2>III. CFDI Emitido Exitosamente</h2>
                    <p>El comprobante fiscal ha sido procesado, sellado y enviado al correo proporcionado: <strong>{form.email}</strong></p>
                  </div>
                  
                  <div className="action-cards">
                    <div className="action-card" onClick={() => downloadIllustrativePdf(form)}>
                      <div className="icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </div>
                      <div className="text">
                        <strong>Descargar Representación Impresa (PDF)</strong>
                        <span>Formato estructurado visual.</span>
                      </div>
                    </div>
                    <div className="action-card" onClick={() => setSent(true)}>
                      <div className="icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><polyline points="14 12 16 14 14 16"></polyline><polyline points="10 12 8 14 10 16"></polyline></svg>
                      </div>
                      <div className="text">
                        <strong>Descargar Archivo XML</strong>
                        <span>Archivo estructurado para contabilidad.</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions center">
                    <a href="/" className="btn-secondary">Finalizar y volver al inicio</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="info-column">
            <div className="card order-summary">
              <h3>Resumen de Operación</h3>
              <div className="summary-item">
                <span className="lbl">Orden de Trabajo:</span>
                <span className="val">{order.folio}</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Fecha de Orden:</span>
                <span className="val">{order.date}</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Concepto:</span>
                <span className="val">{order.concept}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span className="lbl">Total a Facturar:</span>
                <span className="val">${order.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
              </div>
              
              <div className="qr-container">
                <QRCodeSVG value={`https://zammir.mx/factura/validar?orden=${order.folio}`} size={120} />
                <p>Folio de Referencia Único para emisión.</p>
              </div>
            </div>

            <div className="security-notice">
              <h4>Aviso de Seguridad</h4>
              <p>Sus datos personales y fiscales son recabados con la única finalidad de la emisión del CFDI y son protegidos bajo estrictos protocolos de encriptación, en cumplimiento con la Ley Federal de Protección de Datos Personales.</p>
            </div>
          </div>

        </div>
      </section>

      <footer className="portal-footer">
        <div className="portal-container footer-content">
          <p>© 2026 ZAMMIR Vidrio & Aluminio. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#">Términos y Condiciones</a>
            <a href="#">Aviso de Privacidad</a>
            <a href="#">Soporte Técnico</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

