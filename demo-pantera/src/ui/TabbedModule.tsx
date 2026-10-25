import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { AppModule } from '../modules/registry';
import { ErrorBoundary } from './ErrorBoundary';
import { Tabs } from './components/Navigation';

interface TabbedModuleProps {
  moduleInfo: AppModule;
}

export const TabbedModule: React.FC<TabbedModuleProps> = ({ moduleInfo }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabs = moduleInfo.tabs || [];
  
  const currentTabSlug = searchParams.get('tab');
  
  const activeTabIndex = useMemo(() => {
    const idx = tabs.findIndex(t => t.slug === currentTabSlug);
    return idx >= 0 ? idx : 0;
  }, [tabs, currentTabSlug]);

  const handleTabChange = (idx: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tabs[idx].slug);
    setSearchParams(newParams, { replace: true });
  };

  const activeTab = tabs[activeTabIndex];

  if (!activeTab || !activeTab.component) return null;
  const ActiveComponent = activeTab.component;

  return (
    <div className="flex flex-col min-h-full h-full">
      <div className="px-6 pt-4 bg-white border-b border-slate-200 shrink-0">
        <Tabs 
          tabs={tabs.map(t => t.title)} 
          activeTab={activeTabIndex} 
          onChange={handleTabChange} 
        />
      </div>
      <div className="flex-1 overflow-auto bg-slate-50 relative">
        <ErrorBoundary key={activeTab.slug}>
          <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando pestaña...</div>}>
            <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
              <ActiveComponent />
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};
