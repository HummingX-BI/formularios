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
                <Suspense fallback={<div className="p-8">Cargando...</div>}>
                  <mod.component />
                </Suspense>
              }
            />
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
