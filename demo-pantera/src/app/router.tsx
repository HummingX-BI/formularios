import { HashRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/ui/DashboardLayout';
import { LoginPage } from '@/modules/login/LoginPage';
import { DesignGallery } from '@/modules/design/DesignGallery';
import { NotFoundPage } from '@/ui/NotFoundPage';
import DataAuditPage from '@/modules/system/DataAuditPage';
import { MODULE_REGISTRY } from '@/modules/registry';
import MLDebugPage from '@/modules/system/MLDebugPage';
import ChartsGallery from '@/modules/system/ChartsGallery';
import React, { Suspense } from 'react';
import { TabbedModule } from '@/ui/TabbedModule';
import { LegacyRedirect, LEGACY_ROUTES } from './legacyRoutes';

export function AppRouter(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/_design" element={<DesignGallery />} />

        <Route element={<DashboardLayout />}>
          {MODULE_REGISTRY.map((mod) => (
            <Route
              key={mod.id}
              path={mod.route}
              element={
                mod.tabs ? (
                  <TabbedModule moduleInfo={mod} />
                ) : (
                  <Suspense fallback={<div className="p-8">Cargando...</div>}>
                    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 h-full min-h-[700px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                      {mod.component && <mod.component />}
                    </div>
                  </Suspense>
                )
              }
            />
          ))}
          {/* Rutas legacy redirigidas a las nuevas */}
          {Object.keys(LEGACY_ROUTES).map(legacyPath => (
            <Route key={legacyPath} path={legacyPath} element={<LegacyRedirect />} />
          ))}
          <Route path="_data-audit" element={<DataAuditPage />} />
          <Route path="_ml-debug" element={<MLDebugPage />} />
          <Route path="_charts" element={<ChartsGallery />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
