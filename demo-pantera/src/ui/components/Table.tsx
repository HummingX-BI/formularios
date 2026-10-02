import React, { useState, useMemo } from 'react';
import { Button } from './Buttons';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  exportable?: boolean;
  exportName?: string;
}

export function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  searchable = true, 
  pagination = true, 
  pageSize = 10,
  exportable = true,
  exportName = 'export'
}: TableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(lower))
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
    });
  }, [filtered, sortKey, sortDesc]);

  const paginated = useMemo(() => {
    if (!pagination) return sorted;
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(sorted.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDesc) { setSortKey(null); setSortDesc(false); }
      else setSortDesc(true);
    } else {
      setSortKey(key);
      setSortDesc(false);
    }
  };

  const exportCSV = () => {
    const headers = columns.map(c => `"${c.header}"`).join(',');
    const rows = sorted.map(row => 
      columns.map(c => {
        let val = row[c.key as string];
        if (val === undefined || val === null) val = '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-lg shadow-sm border border-ice-100 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-ice-100 bg-ice-50/50 flex flex-wrap gap-4 justify-between items-center">
        {searchable && (
          <div className="relative max-w-sm w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-secundario w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ice-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow shadow-sm"
            />
          </div>
        )}
        {exportable && (
          <Button variant="secondary" size="sm" onClick={exportCSV}>Exportar CSV</Button>
        )}
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ice-100">
          <thead className="bg-ice-50">
            <tr>
              {columns.map(col => (
                <th 
                  key={String(col.key)} 
                  className={`px-6 py-3 text-left text-xs font-semibold text-navy-900 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-sky-200/30 select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-blue-600">{sortDesc ? '↓' : '↑'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-ice-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-secundario">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={i} className="hover:bg-ice-50/50 transition-colors">
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-6 py-4 text-sm text-secundario whitespace-nowrap">
                      {col.render ? col.render(row) : String(row[col.key as string] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-ice-100 bg-ice-50/50 flex items-center justify-between">
          <span className="text-sm text-secundario">
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, sorted.length)} de {sorted.length}
          </span>
          <div className="flex gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 rounded border border-ice-100 bg-white text-secundario hover:bg-ice-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Anterior
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 rounded border border-ice-100 bg-white text-secundario hover:bg-ice-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
