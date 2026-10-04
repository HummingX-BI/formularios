import React, { useState, useEffect, useRef } from 'react';
import { Search, Map, Users, Target, LayoutDashboard } from 'lucide-react';
import { useDataset } from '@/data/hooks';
import { useNavigate } from 'react-router-dom';
import { MODULE_REGISTRY } from '@/modules/registry';

function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const dataset = useDataset();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = React.useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = removeAccents(query.toLowerCase());
    
    let res: any[] = [];
    
    // Modules
    const isDebug = import.meta.env.VITE_SHOW_DEBUG === 'true';
    MODULE_REGISTRY.forEach(m => {
      if (!isDebug && m.route.startsWith('/_')) return;
      if (removeAccents(m.title.toLowerCase()).includes(q) || m.id.toLowerCase().includes(q)) {
        res.push({ type: 'module', id: m.id, title: m.title, icon: LayoutDashboard, route: m.route });
      }
    });

    // Students
    dataset.students.forEach(s => {
      if (removeAccents(s.name.toLowerCase()).includes(q)) {
        res.push({ type: 'student', id: s.id, title: s.name, subtitle: `Estudiante - ${(s as any).levelId || 'N/A'}`, icon: Users, route: `/c02/m2-1?student=${s.id}` });
      }
    });
    
    // Instructors
    dataset.instructors.forEach(i => {
      if (removeAccents(i.name.toLowerCase()).includes(q)) {
        res.push({ type: 'instructor', id: i.id, title: i.name, subtitle: 'Instructor', icon: Target, route: `/c03/m3-3?instructor=${i.id}` });
      }
    });

    // Groups
    dataset.groups.forEach(g => {
      if (g.id.toLowerCase().includes(q)) {
        res.push({ type: 'group', id: g.id, title: g.id, subtitle: `Grupo - ${(g as any).levelId || 'N/A'}`, icon: Map, route: `/c02/m2-3?group=${g.id}` });
      }
    });

    return res.slice(0, 8); // Top 8 results
  }, [query, dataset]);

  const handleSelect = (route: string) => {
    setOpen(false);
    setQuery('');
    navigate(route);
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input 
        id="global-search"
        type="text" 
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar módulos, alumnos, instructores... (/)" 
        className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-colors"
      />
      
      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 text-center">No se encontraron resultados para "{query}"</div>
          ) : (
            <div className="flex flex-col">
              {results.map((r, i) => {
                const Icon = r.icon;
                return (
                  <button 
                    key={`${r.type}-${r.id}-${i}`}
                    onClick={() => handleSelect(r.route)}
                    className="flex items-center gap-3 p-3 hover:bg-sky-50 transition-colors text-left border-b border-slate-100 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{r.title}</div>
                      {r.subtitle && <div className="text-xs text-slate-500">{r.subtitle}</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
