import { Bell, Search, FileText } from 'lucide-react';
import { BRAND } from '@/config';
import React, { useState } from 'react';
import { ExecutiveReportModal } from './ExecutiveReportModal';

/**
 * Top header bar with search, notifications, and date indicator.
 */
export function Header(): React.JSX.Element {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[var(--surface)]/80 px-6 backdrop-blur-xl">
        {/* Left: breadcrumb / title */}
      <div>
        <p className="text-xs text-[var(--text-muted)] capitalize">{formattedDate}</p>
        <h1 className="text-base font-semibold text-[var(--text-primary)]">
          Panel de Administración
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-56 rounded-lg border border-white/[0.06] bg-[var(--surface-raised)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--color-azulejo-500)]/30"
          />
        </div>

        {/* Super Botón de Reporte */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="hidden lg:flex items-center gap-2 h-9 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-900/20"
        >
          <FileText size={16} />
          <span>Reporte Ejecutivo</span>
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          aria-label="Notificaciones"
        >
          <Bell size={16} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-azulejo-500)] to-[var(--color-azulejo-700)] text-xs font-bold text-white">
            CA
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-[var(--text-primary)] leading-tight">
              {BRAND.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] leading-tight">Administrador</p>
          </div>
        </div>
      </div>
    </header>
      <ExecutiveReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </>
  );
}
