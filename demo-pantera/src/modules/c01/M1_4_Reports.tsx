import { useState, useEffect } from 'react';
import { Button } from '@/ui/components/Buttons';
import { ProgressBar } from '@/ui/components/Feedback';
import { 
  Download, 
  FileSpreadsheet, 
  Users, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  ShieldCheck, 
  Database,
  Filter,
  CheckCircle2
} from 'lucide-react';

const reportsCatalog = [
  {
    id: 'r1',
    icon: Users,
    title: 'Padrón de Alumnos Activos',
    desc: 'Base de datos auditable con el estatus real de todas las membresías y datos de contacto.',
    columns: ['Matrícula', 'Nombre Alumno', 'Plan Contratado', 'Fecha Ingreso', 'Estatus'],
    data: [
      { id: 1, c1: 'MAT-8012', c2: 'Sofía Martínez', c3: 'Natación 3 Días', c4: '12/Ene/2023', c5: 'Al Día' },
      { id: 2, c1: 'MAT-8013', c2: 'Leo Hernández', c3: 'Arte y Pintura', c4: '05/Feb/2023', c5: 'Al Día' },
      { id: 3, c1: 'MAT-8014', c2: 'Valentina Ruiz', c3: 'Gimnasia Básico', c4: '18/Mar/2023', c5: 'Al Día' },
    ]
  },
  {
    id: 'r2',
    icon: DollarSign,
    title: 'Cierre de Ingresos (Contabilidad)',
    desc: 'Detalle transaccional exacto de cobros realizados, listo para enviar a tu contador.',
    columns: ['Folio Recibo', 'Fecha Cobro', 'Concepto', 'Monto MXN', 'Método Pago'],
    data: [
      { id: 1, c1: 'REC-9920', c2: '15/Oct/2023 10:23', c3: 'Mensualidad Octubre', c4: '$1,500.00', c5: 'Tarjeta Crédito' },
      { id: 2, c1: 'REC-9921', c2: '15/Oct/2023 11:05', c3: 'Mensualidad Octubre', c4: '$1,200.00', c5: 'Transferencia' },
      { id: 3, c1: 'REC-9922', c2: '15/Oct/2023 12:40', c3: 'Inscripción Nuevo Ingreso', c4: '$800.00', c5: 'Efectivo' },
    ]
  },
  {
    id: 'r3',
    icon: AlertCircle,
    title: 'Auditoría de Cartera Vencida',
    desc: 'Lista detallada de familias con adeudos, meses de atraso y último intento de cobro.',
    columns: ['Familia', 'Teléfono Contacto', 'Meses Atraso', 'Monto Deuda', 'Último Aviso'],
    data: [
      { id: 1, c1: 'Fam. Torres', c2: '55-1234-5678', c3: '2 meses', c4: '$3,000.00', c5: 'Hace 3 días' },
      { id: 2, c1: 'Fam. Gómez', c2: '55-9876-5432', c3: '1 mes', c4: '$1,500.00', c5: 'Ayer' },
      { id: 3, c1: 'Fam. López', c2: '55-4567-8901', c3: '3 meses', c4: '$4,200.00', c5: 'Hace 1 semana' },
    ]
  },
  {
    id: 'r4',
    icon: Calendar,
    title: 'Ocupación y Capacidad Máxima',
    desc: 'Radiografía de cuántos lugares te sobran por grupo, horario y profesor.',
    columns: ['Clase / Grupo', 'Horario', 'Profesor', 'Ocupados', 'Disponibles'],
    data: [
      { id: 1, c1: 'Natación Intermedio', c2: 'Lu-Mi 16:00', c3: 'Prof. Carlos', c4: '14', c5: '1' },
      { id: 2, c1: 'Natación Básico', c2: 'Ma-Ju 16:00', c3: 'Prof. Carlos', c4: '15', c5: '0 (Lleno)' },
      { id: 3, c1: 'Gimnasia Avanzada', c2: 'Lu-Mi 17:00', c3: 'Profa. Ana', c4: '8', c5: '7' },
    ]
  }
];

export default function M1_4_Reports() {
  const [selectedReport, setSelectedReport] = useState(reportsCatalog[0]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSync, setLastSync] = useState('');

  useEffect(() => {
    // Generate a recent mock sync time
    const d = new Date();
    d.setMinutes(d.getMinutes() - 2);
    setLastSync(d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setGenerating(false);
            exportCSV();
          }, 300);
          return 100;
        }
        return p + 25;
      });
    }, 250);
  };

  const exportCSV = () => {
    alert(`Descargando ${selectedReport?.title}.csv con datos seguros.`);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-ice-200 pb-4">
        <div>
          <h1 className="text-4xl font-jakarta font-extrabold text-navy-900 flex items-center gap-3">
            <Database className="text-aqua-500" size={32} />
            Exportación y Auditoría
          </h1>
          <p className="text-xl text-secundario mt-2 font-medium">
            Tus datos de negocio siempre seguros, auditables y listos para descargar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
        
        {/* CATÁLOGO DE REPORTES */}
        <div className="xl:col-span-4 flex flex-col bg-white rounded-2xl shadow-sm border border-ice-100 overflow-hidden">
          <div className="p-5 border-b border-ice-100 bg-ice-50 flex justify-between items-center">
            <h3 className="font-extrabold text-navy-900 flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-navy-900" /> Catálogo de Reportes
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {reportsCatalog.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              const Icon = rep.icon;
              return (
                <button
                  key={rep.id}
                  className={`w-full text-left p-4 rounded-xl transition-all border-2 flex items-start gap-4 group
                    ${isSelected 
                      ? 'bg-sky-50 border-aqua-400 shadow-sm' 
                      : 'border-transparent hover:bg-ice-50 hover:border-ice-200'
                    }`}
                  onClick={() => setSelectedReport(rep)}
                >
                  <div className={`p-2 rounded-lg shrink-0 transition-colors ${isSelected ? 'bg-aqua-500 text-white' : 'bg-ice-100 text-secundario group-hover:bg-ice-200'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className={`font-extrabold text-sm mb-1 ${isSelected ? 'text-navy-900' : 'text-secundario group-hover:text-navy-900'}`}>
                      {rep.title}
                    </div>
                    <div className="text-xs opacity-80 leading-relaxed line-clamp-2">
                      {rep.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* VISTA PREVIA Y EXPORTACIÓN */}
        <div className="xl:col-span-8 flex flex-col h-full">
          {selectedReport ? (
            <div className="bg-white rounded-2xl shadow-sm border border-ice-100 flex flex-col h-full overflow-hidden">
              
              {/* Header Reporte Seleccionado */}
              <div className="p-8 border-b border-ice-100 bg-gradient-to-r from-navy-900 to-slate-800 text-white flex justify-between items-center">
                <div className="max-w-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                      Reporte Oficial
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-green-300 font-medium">
                      <ShieldCheck size={12} /> Cifrado 256-bit
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold font-jakarta mb-2">
                    {selectedReport.title}
                  </h2>
                  <p className="text-ice-300 text-sm">
                    {selectedReport.desc}
                  </p>
                </div>
                
                {/* Botón Generar */}
                <div className="w-64 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                  {generating ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-aqua-400">
                        <span>Extrayendo registros...</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar value={progress} colorClass="bg-aqua-500" />
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={handleGenerate} 
                      className="w-full bg-aqua-500 hover:bg-aqua-400 text-navy-900 font-extrabold shadow-lg shadow-aqua-500/20 py-3"
                    >
                      <Download size={18} className="mr-2" /> Generar .CSV Seguro
                    </Button>
                  )}
                </div>
              </div>

              {/* Toolbar */}
              <div className="bg-ice-50 px-8 py-3 border-b border-ice-100 flex justify-between items-center text-sm">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-secundario hover:text-navy-900 font-medium px-0">
                    <Filter size={16} className="mr-2" /> Agregar Filtros
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-secundario">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Sincronizado hoy a las <strong>{lastSync}</strong></span>
                </div>
              </div>

              {/* Data Table Preview */}
              <div className="p-8 flex-1 overflow-auto bg-white">
                <h3 className="font-extrabold text-navy-900 mb-4 text-xs uppercase tracking-widest text-secundario">
                  Vista Previa de Columnas (Primeros 3 registros)
                </h3>
                
                <div className="rounded-xl border border-ice-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-ice-200">
                      <tr>
                        {selectedReport.columns.map((col, idx) => (
                          <th key={idx} className="p-4 font-bold text-navy-900 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ice-100">
                      {selectedReport.data.map((row) => (
                        <tr key={row.id} className="hover:bg-ice-50 transition-colors">
                          <td className="p-4 text-secundario">{row.c1}</td>
                          <td className="p-4 font-bold text-navy-900">{row.c2}</td>
                          <td className="p-4 text-secundario">{row.c3}</td>
                          <td className="p-4 text-secundario">{row.c4}</td>
                          <td className="p-4 text-secundario">
                            {row.c5 === 'Al Día' ? (
                              <span className="text-green-600 bg-green-50 px-2 py-1 rounded font-medium text-xs">{row.c5}</span>
                            ) : (
                              row.c5
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-tenue">
                    El archivo final en Excel/CSV incluirá las columnas adicionales de metadatos, direcciones y fechas exactas.
                  </p>
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
