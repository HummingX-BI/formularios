import { useState, useMemo } from 'react';
import { useDataset } from '@/data/hooks';
import { Button } from '@/ui/components/Buttons';
import { PlotChart } from '@/charts/PlotChart';
import { formatCurrency } from '@/insights/templates';
import { 
  Search, Phone, MessageCircle, Mail, Calendar, 
  CreditCard, AlertTriangle, ShieldCheck, Star, 
  CheckCircle2, Users, FileText, Target
} from 'lucide-react';

export default function M2_1_Profile() {
  const dataset = useDataset();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    dataset.students[0]?.id || null,
  );

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return dataset.students;
    const term = searchTerm.toLowerCase();
    return dataset.students.filter((s) => {
      const family = dataset.families.find((f) => f.id === s.familyId);
      return (
        s.name.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term) ||
        family?.tutorName.toLowerCase().includes(term)
      );
    });
  }, [dataset, searchTerm]);

  const selectedStudent = useMemo(
    () => dataset.students.find((s) => s.id === selectedStudentId),
    [dataset, selectedStudentId],
  );
  
  const family = useMemo(
    () => selectedStudent ? dataset.families.find((f) => f.id === selectedStudent.familyId) : undefined,
    [dataset, selectedStudent],
  );
  
  const siblings = useMemo(
    () => family
        ? dataset.students.filter((s) => s.familyId === family.id && s.id !== selectedStudentId)
        : [],
    [dataset, family, selectedStudentId],
  );

  if (!selectedStudent || !family) {
    return <div className="p-10 text-center text-secundario">No hay alumnos disponibles en la base de datos.</div>;
  }

  // Generadores deterministas para la demo
  const obsIndex = selectedStudent.id.charCodeAt(0) % 3;
  const observations = [
    'Ha mejorado notablemente en la técnica de patada. Se sugiere empezar a trabajar respiración lateral.',
    'Mantiene buen ritmo, pero falta confianza en aguas profundas. Excelente constancia.',
    'Progresa según lo esperado. Listo para intentar flotación sin asistencia en la próxima clase.',
  ][obsIndex];

  const churnRisk = (selectedStudent.id.charCodeAt(0) * 7) % 100;
  const riskLabel = churnRisk > 50 ? 'Riesgo de Fuga Alto' : churnRisk > 20 ? 'Precaución' : 'Cliente Seguro';
  const riskColor = churnRisk > 50 ? 'bg-coral text-white' : churnRisk > 20 ? 'bg-amber-400 text-navy-900' : 'bg-green-500 text-white';
  const RiskIcon = churnRisk > 50 ? AlertTriangle : churnRisk > 20 ? AlertTriangle : ShieldCheck;

  // Radar Chart de Habilidades (Mock)
  const skillR1 = 60 + (selectedStudent.id.charCodeAt(0) % 40);
  const skillR2 = 50 + (selectedStudent.id.charCodeAt(1) % 50);
  const skillR3 = 70 + (selectedStudent.id.charCodeAt(2) % 30);
  const skillR4 = 65 + (selectedStudent.id.charCodeAt(3) % 35);
  const skillData = [{
    type: 'scatterpolar',
    r: [skillR1, skillR2, skillR3, skillR4, skillR1], 
    theta: ['Técnica', 'Fuerza', 'Disciplina', 'Velocidad', 'Técnica'],
    fill: 'toself',
    fillcolor: 'rgba(47, 182, 212, 0.3)',
    line: { color: '#2FB6D4', width: 2 },
    marker: { color: '#0f172a', size: 6 }
  }];

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 overflow-hidden">
      
      {/* SIDEBAR BUSCADOR */}
      <div className="w-80 flex flex-col bg-white rounded-2xl shadow-sm border border-ice-100 overflow-hidden shrink-0">
        <div className="p-5 border-b border-ice-100 bg-ice-50">
          <h2 className="font-extrabold text-navy-900 mb-3 flex items-center gap-2">
            <Search size={20} className="text-aqua-500" /> Directorio 360
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secundario" size={16} />
            <input
              type="text"
              placeholder="Buscar alumno, ID o tutor..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-ice-200 rounded-xl focus:outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-white">
          {filteredStudents.slice(0, 50).map((s) => {
            const isSelected = selectedStudentId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group
                  ${isSelected ? 'bg-sky-50 border border-aqua-200 shadow-sm' : 'border border-transparent hover:bg-ice-50'}`}
              >
                <div className={`w-10 h-10 rounded-full shrink-0 transition-all overflow-hidden relative shadow-sm
                  ${isSelected ? 'ring-2 ring-aqua-500 ring-offset-2' : 'border border-ice-200'}`}>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}&backgroundColor=e2e8f0,b6e3f4,c0aede,d1d4f9`} 
                    alt={s.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className={`font-bold truncate ${isSelected ? 'text-navy-900' : 'text-secundario group-hover:text-navy-900'}`}>
                    {s.name}
                  </div>
                  <div className="text-[10px] text-tenue uppercase font-bold tracking-wider">{s.id}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* PERFIL PRINCIPAL */}
      <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-6">
        
        {/* HEADER PERFIL CRM */}
        <div className="bg-white rounded-2xl shadow-sm border border-ice-100 overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-navy-900 via-slate-800 to-navy-900 absolute top-0 left-0 w-full"></div>
          
          <div className="relative pt-16 px-8 pb-8">
            <div className="flex justify-between items-end">
              <div className="flex gap-6 items-end">
                <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-lg relative z-10 overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.id}&backgroundColor=e2e8f0,b6e3f4,c0aede,d1d4f9`} 
                      alt={selectedStudent.name} 
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-4xl font-jakarta font-extrabold text-navy-900">
                      {selectedStudent.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${riskColor} shadow-sm`}>
                      <RiskIcon size={14} /> {riskLabel}
                    </span>
                  </div>
                  <p className="text-secundario font-medium">
                    ID: {selectedStudent.id} • {selectedStudent.status === 'active' ? 'Suscripción Activa' : 'Dado de Baja'} • Ingresó el {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pb-2">
                <Button variant="secondary" className="bg-white border-ice-200 text-navy-900 hover:bg-ice-50 shadow-sm">
                  <MessageCircle size={18} className="mr-2 text-green-500" /> WhatsApp
                </Button>
                <Button variant="secondary" className="bg-white border-ice-200 text-navy-900 hover:bg-ice-50 shadow-sm">
                  <Mail size={18} className="mr-2 text-blue-500" /> Correo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mt-10">
              <div className="bg-ice-50 rounded-xl p-4 border border-ice-100">
                <span className="text-tenue text-xs font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Users size={14} /> Tutor Principal
                </span>
                <span className="font-extrabold text-navy-900 text-lg block truncate">{family.tutorName || 'N/A'}</span>
                <div className="text-secundario text-sm flex items-center gap-1 mt-1">
                  <Phone size={12} /> {family.phone}
                </div>
              </div>
              <div className="bg-ice-50 rounded-xl p-4 border border-ice-100">
                <span className="text-tenue text-xs font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Star size={14} /> Nivel Actual
                </span>
                <span className="font-extrabold text-aqua-600 text-lg block">{selectedStudent.level}</span>
                <div className="text-secundario text-sm mt-1">{selectedStudent.plan}</div>
              </div>
              <div className="bg-ice-50 rounded-xl p-4 border border-ice-100">
                <span className="text-tenue text-xs font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <CreditCard size={14} /> Valor Cliente (LTV)
                </span>
                <span className="font-extrabold text-green-600 text-lg block">{formatCurrency(15000 + skillR1*100)}</span>
                <div className="text-secundario text-sm mt-1">Ingreso acumulado</div>
              </div>
              <div className="bg-ice-50 rounded-xl p-4 border border-ice-100">
                <span className="text-tenue text-xs font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Users size={14} /> Familiares
                </span>
                {siblings.length > 0 ? (
                  siblings.map((sib) => (
                    <button key={sib.id} onClick={() => setSelectedStudentId(sib.id)} className="text-aqua-600 font-bold hover:underline block text-sm">
                      {sib.name}
                    </button>
                  ))
                ) : (
                  <span className="text-secundario text-sm font-medium">Sin hermanos registrados</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICOS Y MÉTRICAS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* RADAR DE HABILIDADES */}
          <div className="bg-white rounded-2xl shadow-sm border border-ice-100 p-6 flex flex-col">
            <h3 className="font-extrabold text-navy-900 mb-2 font-jakarta text-xl flex items-center gap-2">
              <Target size={20} className="text-aqua-500" /> Progreso de Habilidades
            </h3>
            <p className="text-sm text-secundario mb-4">Evaluación técnica del instructor titular.</p>
            <div className="flex-1 min-h-[250px] -mt-4">
              <PlotChart
                id="radar_skills"
                data={skillData as any}
                layout={{
                  polar: { radialaxis: { visible: true, range: [0, 100] } },
                  margin: { l: 40, r: 40, t: 20, b: 20 },
                }}
                tableData={{columns: [], rows: []}}
                altText="Gráfica de radar de habilidades"
                onExplain={() => {}}
              />
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            
            {/* ASISTENCIA */}
            <div className="bg-white rounded-2xl shadow-sm border border-ice-100 p-6 flex-1">
              <h3 className="font-extrabold text-navy-900 mb-2 font-jakarta text-xl flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" /> Mapa de Asistencia
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-extrabold text-navy-900">85%</div>
                <div className="text-sm text-secundario leading-tight">
                  Tasa de asistencia<br/>últimos 3 meses
                </div>
              </div>
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 48 }).map((_, i) => {
                  const isMiss = i % 8 === 0;
                  return (
                    <div
                      key={i}
                      className={`w-full pt-[100%] rounded-md transition-transform hover:scale-110 ${isMiss ? 'bg-red-100 border border-red-200' : 'bg-green-400 shadow-sm'}`}
                      title={isMiss ? 'Falta' : 'Asistió'}
                    />
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 text-xs font-bold text-secundario justify-end">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-sm"></div> Asistencia</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 rounded-sm border border-red-200"></div> Falta</div>
              </div>
            </div>

            {/* ESTADO FINANCIERO MINI */}
            <div className="bg-white rounded-2xl shadow-sm border border-ice-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-navy-900 mb-1 font-jakarta flex items-center gap-2">
                  <CreditCard size={18} className="text-green-500" /> Estado de Cuenta
                </h3>
                <p className="text-sm text-secundario">Último pago recibido hace 12 días.</p>
              </div>
              <div className="text-right">
                <div className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-1">
                  <CheckCircle2 size={14} /> Corriente
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* OBSERVACIONES */}
        <div className="bg-white rounded-2xl shadow-sm border border-ice-100 p-6">
          <h3 className="font-extrabold text-navy-900 mb-4 font-jakarta text-xl flex items-center gap-2">
            <FileText size={20} className="text-amber-500" /> Notas del Instructor
          </h3>
          <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
            <p className="text-amber-900 italic font-medium leading-relaxed">
              "{observations}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
