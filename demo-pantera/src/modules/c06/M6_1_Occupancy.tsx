import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Button } from '@/ui/components/Buttons';
import { PlotChart } from '@/charts/PlotChart';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00'];

const SATURATION_THRESHOLD = 90;
const UNDERUTILIZATION_THRESHOLD = 60;

export default function M6_1_Occupancy() {
  const [metric, setMetric] = useState<'ocupacion' | 'carriles'>('ocupacion');
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: string } | null>(null);

  // Generate mock heatmap data based on dataset
  const heatmapData = useMemo(() => {
    const data: Record<
      string,
      Record<string, { value: number; waitlist: number; capacity: number; enrolled: number }>
    > = {};
    DAYS.forEach((day) => {
      data[day] = {};
      HOURS.forEach((hour) => {
        // mock generation
        const base = day === 'Sábado' || hour === '17:00' || hour === '18:00' ? 80 : 50;
        const noise = Math.random() * 30 - 15;
        let val = Math.round(base + noise);
        if (val < 20) val = 20;
        if (val > 100) val = 100;

        data[day]![hour] = {
          value: val,
          waitlist: val >= 90 ? Math.floor(Math.random() * 5) + 1 : 0,
          capacity: 20,
          enrolled: Math.round(20 * (val / 100)),
        };
      });
    });
    return data;
  }, []);

  const getBgColor = (val: number) => {
    if (val < 40) return 'bg-ice-50 text-navy-900';
    if (val < 60) return 'bg-sky-200 text-navy-900';
    if (val < 80) return 'bg-sky-400 text-navy-900';
    return 'bg-blue-600 text-white';
  };

  const getBorder = (val: number) => {
    if (val >= SATURATION_THRESHOLD) return 'border-2 border-coral';
    if (val <= UNDERUTILIZATION_THRESHOLD) return 'border-2 border-dashed border-ice-300';
    return 'border border-transparent';
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">
            Mapa de Calor y Ocupación
          </h1>
          <p className="text-lg text-secundario mt-1">¿Cuándo estoy lleno y cuándo estoy vacío?</p>
        </div>
        <div className="flex bg-ice-100 p-1 rounded-lg">
          <Button
            variant={metric === 'ocupacion' ? 'primary' : 'ghost'}
            onClick={() => setMetric('ocupacion')}
            className={metric === 'ocupacion' ? 'shadow-sm' : ''}
          >
            Ocupación de Cupo
          </Button>
          <Button
            variant={metric === 'carriles' ? 'primary' : 'ghost'}
            onClick={() => setMetric('carriles')}
            className={metric === 'carriles' ? 'shadow-sm' : ''}
          >
            Utilización de Carriles
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-xs text-secundario mb-1">Ocupación Promedio</div>
          <div className="text-2xl font-bold text-navy-900">76%</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-xs text-secundario mb-1">Franjas Saturadas ({'>'}90%)</div>
          <div className="text-2xl font-bold text-coral">8</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-xs text-secundario mb-1">Franjas Subutilizadas ({'<'}60%)</div>
          <div className="text-2xl font-bold text-amber-500">12</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-xs text-secundario mb-1">Horas-Carril Ociosas / Sem</div>
          <div className="text-2xl font-bold text-navy-900">45 hrs</div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        <Card
          className={`col-span-${selectedCell ? '8' : '12'} p-6 bg-white border border-ice-100 shadow-sm overflow-x-auto transition-all`}
        >
          <div className="min-w-[600px]">
            <div className="grid grid-cols-7 gap-2 mb-2">
              <div className="text-center font-bold text-navy-900 p-2">Hora</div>
              {DAYS.map((d) => (
                <div key={d} className="text-center font-bold text-navy-900 p-2">
                  {d}
                </div>
              ))}
            </div>
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-7 gap-2 mb-2">
                <div className="flex items-center justify-center font-bold text-secundario text-sm">
                  {hour}
                </div>
                {DAYS.map((day) => {
                  const cell = heatmapData[day]![hour]!;
                  const isSelected = selectedCell?.day === day && selectedCell?.hour === hour;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      onClick={() => setSelectedCell({ day, hour })}
                      className={`relative flex flex-col items-center justify-center p-3 rounded cursor-pointer transition-transform hover:scale-105 ${getBgColor(cell.value)} ${getBorder(cell.value)} ${isSelected ? 'ring-4 ring-aqua-500 z-10' : ''}`}
                      title={`${cell.value}% - ${cell.enrolled}/${cell.capacity} inscritos`}
                    >
                      <span className="font-bold text-lg">{cell.value}%</span>
                      {cell.waitlist > 0 && (
                        <div className="absolute -top-2 -right-2 bg-coral text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow">
                          {cell.waitlist}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-6 text-sm text-secundario justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-ice-50 border border-ice-200"></div> &lt; 40%
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-200"></div> 40 - 60%
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-400"></div> 60 - 80%
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600"></div> &gt; 80%
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-4 h-4 border-2 border-coral bg-white"></div> Saturado ({'>'}90%)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-dashed border-ice-300 bg-white"></div>{' '}
              Subutilizado ({'<'}60%)
            </div>
          </div>
        </Card>

        {selectedCell && (
          <Card className="col-span-4 p-6 bg-white border border-ice-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-navy-900 font-jakarta text-xl">{selectedCell.day}</h3>
                <div className="text-secundario">{selectedCell.hour}</div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedCell(null)}
                className="text-secundario hover:text-coral"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-ice-50 rounded">
                <span className="text-sm font-bold text-navy-900">Ocupación Total</span>
                <Badge
                  color={
                    heatmapData[selectedCell.day]![selectedCell.hour]!.value >= 90
                      ? 'bg-coral text-white'
                      : 'bg-aqua-500 text-white'
                  }
                >
                  {heatmapData[selectedCell.day]![selectedCell.hour]!.value}%
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-ice-50 rounded">
                <span className="text-sm font-bold text-navy-900">En Lista de Espera</span>
                <span className="font-bold text-coral">
                  {heatmapData[selectedCell.day]![selectedCell.hour]!.waitlist} familias
                </span>
              </div>
            </div>

            <h4 className="font-bold text-navy-900 mb-3 border-b border-ice-100 pb-2">
              Grupos en esta franja
            </h4>
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="p-3 border border-ice-200 rounded text-sm">
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Tortugas (3-5 años)</span>
                  <span className="text-coral">8/8</span>
                </div>
                <div className="text-secundario text-xs">Instructor: Carlos Ruiz</div>
                <div className="text-coral text-xs mt-1 font-bold">+2 en espera</div>
              </div>
              <div className="p-3 border border-ice-200 rounded text-sm">
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Delfines (6-8 años)</span>
                  <span className="text-aqua-500">7/8</span>
                </div>
                <div className="text-secundario text-xs">Instructor: Ana López</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-ice-100">
              <div className="text-xs font-bold text-secundario mb-2">Evolución (6 meses)</div>
              <div className="h-32">
                <PlotChart
                  id="cell_evolution"
                  data={[
                    {
                      type: 'scatter',
                      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                      y: [
                        75,
                        78,
                        85,
                        90,
                        88,
                        heatmapData[selectedCell.day]![selectedCell.hour]!.value,
                      ],
                      line: { color: '#2FB6D4', width: 3 },
                    },
                  ]}
                  layout={{ margin: { l: 20, r: 10, t: 10, b: 20 }, yaxis: { range: [0, 100] } }}
                  tableData={{ columns: [], rows: [] }}
                  altText="Línea de tendencia de ocupación"
                  onExplain={() => {}}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
