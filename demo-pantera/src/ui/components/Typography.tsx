import React from 'react';

export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-end mb-6">
    <div>
      <h2 className="text-2xl font-bold font-jakarta text-navy-900">{title}</h2>
      {subtitle && <p className="text-secundario mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-ice-100 bg-ice-50 text-xs font-mono text-secundario shadow-sm">
    {children}
  </kbd>
);

export const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="p-4 rounded-lg bg-navy-900 text-ice-50 font-mono text-sm overflow-x-auto shadow-inner">
    <code>{code}</code>
  </pre>
);
