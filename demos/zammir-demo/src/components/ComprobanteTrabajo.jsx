import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/comprobante.css';

export default function ComprobanteTrabajo({ 
  folio, 
  fecha, 
  cliente, 
  telefono, 
  producto, 
  medidas, 
  total, 
  anticipo, 
  saldo, 
  garantiaMeses,
  esVentaDirecta = false 
}) {
  const portalUrl = `${window.location.origin}/cliente-portal?f=${folio}`;

  return (
    <div className="comp-doc-wrapper" id={`comprobante-${folio}`}>
      <div className="comp-doc">
        {/* Cabecera */}
        <div className="comp-header">
          <div className="comp-logo">
            ZAMMIR
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 400, marginTop: '0.5rem', color: 'var(--c-ink-soft)' }}>
              Comprobante de Trabajo
            </div>
          </div>
          
          <div className="comp-qr-section">
            <div className="comp-qr-text">
              <div className="comp-qr-title">Seguimiento en Línea</div>
              <div>Folio: <strong>{folio}</strong></div>
              <div>Fecha: {fecha}</div>
            </div>
            <div className="comp-qr-code">
              <QRCodeSVG value={portalUrl} size={64} fgColor="var(--c-ink)" />
            </div>
          </div>
        </div>

        {/* Info del Cliente y Empresa */}
        <div className="comp-info-grid">
          <div className="comp-info-box">
            <div className="comp-info-title">Datos del Cliente</div>
            <strong>{cliente}</strong>
            <span>Tel: {telefono || 'No registrado'}</span>
          </div>
          <div className="comp-info-box" style={{ textAlign: 'right' }}>
            <div className="comp-info-title">Emitido por</div>
            <strong>ZAMMIR Vidrio y Aluminio</strong>
            <span>Soluciones arquitectónicas</span>
          </div>
        </div>

        <div className="comp-section-title">Detalle del Proyecto</div>
        
        {/* Tabla de Conceptos */}
        <table className="comp-table">
          <thead>
            <tr>
              <th>Concepto y Material</th>
              <th style={{ textAlign: 'right' }}>Especificaciones</th>
              <th style={{ textAlign: 'right' }}>Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 500 }}>{producto}</td>
              <td style={{ textAlign: 'right', color: 'var(--c-ink-soft)' }}>{medidas}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>
                ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Desglose Financiero */}
        <div className="comp-financials">
          <div className="comp-fin-row">
            <span className="comp-fin-label">Total Neto</span>
            <span className="comp-fin-val">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="comp-fin-row comp-fin-anticipo">
            <span className="comp-fin-label">{esVentaDirecta ? 'Total Pagado' : 'Anticipo Recibido'}</span>
            <span className="comp-fin-val">-${(esVentaDirecta ? total : anticipo).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          </div>
          {!esVentaDirecta && (
            <div className="comp-fin-row comp-fin-saldo">
              <span className="comp-fin-label">Saldo Pendiente</span>
              <span className="comp-fin-val">${saldo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>

        {/* Garantía y Condiciones */}
        <div className="comp-terms-grid">
          <div className="comp-term-box">
            <strong>Garantía de Calidad</strong>
            <p>Este trabajo cuenta con una garantía documentada de <strong>{garantiaMeses} meses</strong> contra defectos de fabricación o vicios ocultos en materiales e instalación. No cubre daños por mal uso, impactos o alteraciones por terceros.</p>
          </div>
          <div className="comp-term-box">
            <strong>Condiciones de Trabajo</strong>
            {esVentaDirecta ? (
              <p>Liquidado en una sola exhibición en mostrador. Salida la mercancía no se aceptan devoluciones en cristales a medida o materiales cortados.</p>
            ) : (
              <p>El saldo pendiente detallado arriba deberá ser liquidado en su totalidad contra la entrega o instalación satisfactoria del proyecto. En caso de cancelación por parte del cliente una vez iniciado el proceso de fabricación o corte, el anticipo no será reembolsable.</p>
            )}
          </div>
        </div>

        {/* Firmas */}
        <div className="comp-signatures">
          <div className="comp-sig-box">
            <div className="comp-sig-line"></div>
            <div className="comp-sig-label">Firma de Conformidad (Cliente)</div>
          </div>
          <div className="comp-sig-box">
            <div className="comp-sig-line"></div>
            <div className="comp-sig-label">ZAMMIR Vidrio y Aluminio</div>
          </div>
        </div>
      </div>
    </div>
  );
}
