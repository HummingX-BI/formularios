import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { useDataset } from '@/data/hooks';

// Deterministic mock QR generator (just colored blocks)
const generateMockQR = (id: string) => {
  const blocks = [];
  let seed = 0;
  for(let i=0; i<id.length; i++) seed += id.charCodeAt(i);
  
  for(let row=0; row<10; row++) {
    for(let col=0; col<10; col++) {
      // Create pattern
      const isCorner = (row < 3 && col < 3) || (row < 3 && col > 6) || (row > 6 && col < 3);
      let isDark = false;
      if (isCorner) {
        isDark = (row === 0 || row === 2 || col === 0 || col === 2 || col === 7 || col === 9 || row === 7 || row === 9) && !(row===1 && col===1) && !(row===1 && col===8) && !(row===8 && col===1);
        if ((row === 1 && col === 1) || (row === 1 && col === 8) || (row === 8 && col === 1)) isDark = true;
      } else {
        isDark = ((seed * (row+1) * (col+1)) % 100) > 50;
      }
      blocks.push(
        <div key={`${row}-${col}`} className={`w-3 h-3 ${isDark ? 'bg-navy-900' : 'bg-white'}`} />
      );
    }
  }
  return <div className="grid grid-cols-10 gap-0 p-2 bg-white border border-ice-200">{blocks}</div>;
};

export default function M2_7_IDCard() {
  const dataset = useDataset();
  const [searchTerm, setSearchTerm] = useState('');
  
  const student = useMemo(() => {
    if (!searchTerm) return dataset.students[0];
    const term = searchTerm.toLowerCase();
    return dataset.students.find(s => s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term)) || dataset.students[0];
  }, [dataset, searchTerm]);

  // Mock payment status based on ID char code
  const isPaid = student ? student.id.charCodeAt(0) % 5 !== 0 : true;

  const handlePrint = () => {
    window.print();
  };

  if (!student) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Credencial Digital</h1>
          <p className="text-lg text-secundario mt-1">Generador de identificaciones para alumnos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6 print:hidden">
          <Card className="p-6 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-4">Buscar Alumno</h3>
            <input 
              type="text" 
              placeholder="Escribe nombre o ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-ice-200 rounded outline-none focus:border-aqua-500 mb-4"
            />
            <p className="text-sm text-secundario">Mostrando credencial para: <strong>{student.name}</strong></p>
          </Card>

          <Button variant="primary" className="w-full justify-center" onClick={handlePrint}>
            Imprimir / Guardar PDF
          </Button>
        </div>

        <div className="flex justify-center items-center">
          {/* ID Card Graphic */}
          <div className="relative w-80 h-[500px] bg-gradient-to-br from-ice-50 to-ice-100 rounded-2xl shadow-xl overflow-hidden border-2 border-white print:shadow-none print:border-black">
            {/* Header wave */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-aqua-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' }}></div>
            
            <div className="relative z-10 flex flex-col items-center pt-12 px-6 h-full">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center mb-4 overflow-hidden">
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white font-jakarta">
                  {student.name.charAt(0)}
                </div>
              </div>

              {/* Info */}
              <h2 className="text-2xl font-bold text-navy-900 font-jakarta text-center leading-tight mb-1">{student.name}</h2>
              <p className="text-secundario mb-4 font-mono text-sm">{student.id}</p>

              <div className="w-full bg-white/60 rounded-lg p-3 mb-6 border border-white/40">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-tenue">Nivel</span>
                  <span className="font-bold text-navy-900 capitalize">{student.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tenue">Estatus</span>
                  <span className={`font-bold ${isPaid ? 'text-green-600' : 'text-coral'}`}>{isPaid ? 'Pagado' : 'Adeudo'}</span>
                </div>
              </div>

              {/* QR Mock */}
              <div className="mt-auto mb-6">
                {generateMockQR(student.id)}
              </div>

              {/* Disclaimer */}
              <div className="text-[10px] text-center text-tenue pb-4">
                Credencial de demostración, sin control de acceso físico.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
