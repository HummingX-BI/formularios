import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = 'bg-ice-100 text-secundario',
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
  >
    {children}
  </span>
);

export const SeverityPill: React.FC<{ level: 'low' | 'medium' | 'high' | 'critical' }> = ({
  level,
}) => {
  const map = {
    low: { label: 'Bajo', classes: 'bg-ice-100 text-secundario' },
    medium: { label: 'Medio', classes: 'bg-amber-100 text-amber-800' },
    high: { label: 'Alto', classes: 'bg-red-100 text-red-800' },
    critical: { label: 'Crítico', classes: 'bg-red-600 text-white' },
  };
  return <Badge color={map[level].classes}>{map[level].label}</Badge>;
};

export const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({
  name,
  size = 'md',
}) => {
  // Deterministic color based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const colors = [
    'bg-blue-600',
    'bg-aqua-500',
    'bg-verde-agua',
    'bg-periwinkle',
    'bg-coral',
    'bg-ambar',
  ];
  const color = colors[Math.abs(hash) % colors.length];

  const initials = name.substring(0, 2).toUpperCase();
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };

  return (
    <div
      className={`flex-shrink-0 inline-flex items-center justify-center rounded-full text-white font-bold ${color} ${sizes[size]}`}
    >
      {initials}
    </div>
  );
};

export const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-tenue uppercase tracking-wider">{label}</span>
    <span className="text-lg font-semibold text-navy-900 tabular-figures">{value}</span>
  </div>
);

export const Divider: React.FC = () => <hr className="border-t border-ice-100 my-4" />;
