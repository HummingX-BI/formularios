import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ExecutiveReportPDF } from './ExecutiveReportPDF';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutiveReportModal({ isOpen, onClose }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setIsGenerating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          // Placeholder para la acción de descarga real
          setIsGenerating(false);
          alert('PDF generado exitosamente (Simulación). En producción esto abrirá el diálogo de impresión o guardará el archivo PDF.');
        }, 500);
      } else {
        setProgress(current);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-100 border border-zinc-300 w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-800 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Vista Previa de Impresión</h2>
              <p className="text-xs text-zinc-500">Reporte Ejecutivo (3 páginas)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando {progress}%</span>
                </>
              ) : progress === 100 ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Descargado</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>
            
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body - PDF Preview Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-200/50 p-6 flex justify-center">
          <ExecutiveReportPDF />
        </div>

      </div>
    </div>
  );
}
