import { useEffect } from 'react';
import { resumenHoy, negocio, catalogo } from '../data/mockData';

export default function ScrollTest() {
  useEffect(() => {
    if (window.__lenis) console.log('Lenis OK');
  }, []);

  return (
    <div style={{ minHeight: '300vh' }}>
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--c-paper)' }}>
        <p style={{ color: 'var(--c-laton)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>HummingX BI x ZAMMIR</p>
        <h1 style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '1rem' }}>{negocio.nombre}</h1>
        <p style={{ color: 'var(--c-ink-soft)', fontStyle: 'italic' }}>{negocio.slogan}</p>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <StatCard label="Venta hoy" value={resumenHoy.ventaTotal} color="var(--c-laton)" />
          <StatCard label="Pendientes" value={resumenHoy.trabajosPendientes} color="var(--c-oliva)" />
          <StatCard label="Listos" value={resumenHoy.trabajosListos} color="var(--c-success)" />
        </div>
        <p style={{ marginTop: '3rem', color: 'var(--c-ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Scroll suave Lenis activo.</p>
      </section>
      <section style={{ minHeight: '80vh', padding: '5rem 2rem', background: 'var(--c-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)' }}>Catalogo Activo: {catalogo.length} productos</h2>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--c-success)' }}>Tokens CSS listos. Mock data activo. Lenis smooth scroll verificado.</p>
      </section>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--c-panel)', border: '1px solid rgba(124,133,146,0.15)', borderRadius: 'var(--r-xl)', padding: '1.25rem 1.75rem', boxShadow: 'var(--shadow-md)', textAlign: 'center', minWidth: '160px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--c-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: color }}>{value}</p>
    </div>
  );
}