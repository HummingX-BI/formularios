import React from 'react';
import type { AppModule } from '@/modules/registry';

interface ModulePageProps {
  module: AppModule;
  children: React.ReactNode;
}

export function ModulePage({ module, children }: ModulePageProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Categoría {module.categoryId}</span>
          <span>/</span>
          <span className="font-medium text-text-primary">{module.id}</span>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-display font-bold text-text-primary">{module.title}</h1>
          <span className="px-2 py-1 bg-sky-200 text-blue-800 rounded-full text-xs font-bold">
            Nivel {module.level}
          </span>
        </div>
        {module.businessQuestion && (
          <p className="text-lg text-text-secondary mt-1">{module.businessQuestion}</p>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t text-sm text-text-tenue text-center">
        Fórmulas usadas: <em>Pendiente</em>
      </footer>
    </div>
  );
}
