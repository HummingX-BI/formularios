import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Award,
  Target,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Waves,
} from 'lucide-react';
import { useAppStore } from '@/app/store';
import { BRAND } from '@/config';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'enrollment', label: 'Inscripciones', icon: Users, path: '/enrollment' },
  { id: 'revenue', label: 'Ingresos', icon: DollarSign, path: '/revenue' },
  { id: 'retention', label: 'Retención', icon: TrendingUp, path: '/retention' },
  { id: 'schedule', label: 'Horarios', icon: Calendar, path: '/schedule' },
  { id: 'instructors', label: 'Instructores', icon: Award, path: '/instructors' },
  { id: 'prospects', label: 'Prospectos', icon: Target, path: '/prospects' },
  { id: 'analytics', label: 'Analítica', icon: BarChart3, path: '/analytics' },
  { id: 'feedback', label: 'Satisfacción', icon: MessageSquare, path: '/feedback' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' },
];

export function Sidebar(): React.JSX.Element {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] bg-[var(--surface-sunken)]"
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo area */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-azulejo-500)] to-[var(--color-azulejo-700)]">
          <Waves size={18} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
              {BRAND.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] leading-tight">
              {BRAND.tagline}
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                group relative mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? 'bg-[var(--color-azulejo-500)]/10 text-[var(--color-azulejo-400)]'
                    : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--color-azulejo-400)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/[0.06] p-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-lg py-2 text-[var(--text-muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Consultant branding */}
      {!collapsed && (
        <div className="border-t border-white/[0.06] px-4 py-3">
          <p className="text-[10px] text-[var(--text-muted)]">
            Desarrollado por{' '}
            <span className="font-semibold text-[var(--text-secondary)]">
              {BRAND.consultantName}
            </span>
          </p>
        </div>
      )}
    </motion.aside>
  );
}
