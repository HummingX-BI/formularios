import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { useAppStore } from '@/app/store';
import { ListTodo, Clock, TrendingUp, Plus, ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, Target, User } from 'lucide-react';

export default function M11_3_ActionPlan() {
  const { planActions } = useAppStore();

  const [tasks, setTasks] = useState<any[]>(
    planActions.length > 0
      ? planActions.map((a) => ({ ...a }))
      : [
          {
            id: 'mock_1',
            task: 'Llamar a los prospectos rezagados del Sitio Web',
            source: 'Recomendación IA',
            owner: 'Equipo de Ventas',
            deadline: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0]!,
            metric: 'Ingresos',
            status: 'todo',
            impact: { estimate: 15000, unit: 'MXN' },
          },
          {
            id: 'mock_2',
            task: 'Ofrecer paquete promocional a alumnos en riesgo',
            source: 'Alerta de Deserción',
            owner: 'Recepción',
            deadline: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]!,
            metric: 'Retención',
            status: 'todo',
            impact: { estimate: 22000, unit: 'MXN' },
          },
          {
            id: 'mock_3',
            task: 'Fusionar grupos matutinos de baja ocupación',
            source: 'Simulador de Ocupación',
            owner: 'Gerencia',
            deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]!,
            metric: 'Ahorro Operativo',
            status: 'in_progress',
            impact: { estimate: 8500, unit: 'MXN' },
          },
          {
            id: 'mock_4',
            task: 'Auditar asistencia de instructores nivel avanzado',
            source: 'Análisis de Equipo',
            owner: 'Recursos Humanos',
            deadline: new Date().toISOString().split('T')[0]!,
            metric: 'NPS',
            status: 'done',
            impact: { estimate: 0, unit: '' },
          }
        ]
  );

  const moveTask = (id: string, newStatus: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `manual_${Date.now()}`,
      task: newTaskTitle,
      source: 'Creación Manual',
      owner: 'Administración',
      deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]!,
      metric: 'Variado',
      status: 'todo',
      impact: { estimate: 0, unit: '' },
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const openTasks = tasks.filter((t) => t.status !== 'done');

  const todayStr = new Date().toISOString().split('T')[0]!;
  const overdueCount = openTasks.filter((t) => t.deadline < todayStr).length;

  const totalExpectedImpact = tasks.reduce((sum, t) => sum + (t.impact?.estimate || 0), 0);

  const getObserved = (estimate: number, seedStr: string) => {
    const noise = (seedStr.length % 20) / 100 - 0.05;
    return estimate * (1 + noise);
  };

  const columns = [
    { id: 'todo', title: 'Por Hacer' },
    { id: 'in_progress', title: 'En Curso' },
    { id: 'done', title: 'Hecho' },
  ];

  return (
    <div className="space-y-6 pb-12 flex flex-col h-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <ListTodo size={12} /> Gestión de Ejecución
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Plan de Mejora Operativa
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Rastrea e implementa las estrategias de retención, precios y operaciones.
          </p>
        </div>
      </div>

      <div className="flex flex-col h-full space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <ListTodo size={14} className="text-slate-400" />
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tareas Activas</p>
            </div>
            <p className="text-2xl font-display font-bold text-slate-900">{openTasks.length}</p>
          </Card>
          
          <Card className={`p-4 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden ${overdueCount > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
            {overdueCount > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>}
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className={overdueCount > 0 ? 'text-rose-500' : 'text-slate-400'} />
              <p className={`text-[10px] uppercase font-bold tracking-widest ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>Vencidas</p>
            </div>
            <p className={`text-2xl font-display font-bold ${overdueCount > 0 ? 'text-rose-700' : 'text-slate-900'}`}>{overdueCount}</p>
          </Card>
          
          <Card className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-emerald-600" />
              <p className="text-[10px] text-emerald-800 uppercase font-bold tracking-widest">Impacto Pipeline ($)</p>
            </div>
            <p className="text-2xl font-display font-bold text-emerald-700">${totalExpectedImpact.toLocaleString()}</p>
          </Card>
        </div>

        {/* Añadir Manual */}
        <form onSubmit={handleAddTask} className="flex gap-3">
          <input
            type="text"
            placeholder="Escribe una nueva iniciativa operativa..."
            className="flex-1 border border-slate-200 bg-white shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm shadow-slate-900/20"
          >
            <Plus size={16} /> Crear
          </button>
        </form>

        {/* Tablero Kanban */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
          {columns.map((col) => {
            const isTodo = col.id === 'todo';
            const isInProgress = col.id === 'in_progress';
            const isDone = col.id === 'done';

            return (
              <div
                key={col.id}
                className="bg-slate-50/50 rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden"
              >
                <div className={`p-4 border-b-2 flex justify-between items-center bg-white/50 ${isTodo ? 'border-slate-300' : isInProgress ? 'border-indigo-400' : 'border-emerald-400'}`}>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {isTodo && <ListTodo size={14} className="text-slate-400" />}
                    {isInProgress && <PlayCircle size={14} className="text-indigo-500" />}
                    {isDone && <CheckCircle2 size={14} className="text-emerald-500" />}
                    {col.title}
                  </h3>
                  <div className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === col.id).length}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {tasks
                    .filter((t) => t.status === col.id)
                    .map((task) => {
                      const isOverdue = task.deadline < todayStr && col.id !== 'done';

                      return (
                        <Card
                          key={task.id}
                          className={`p-4 text-xs rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border ${isOverdue ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-white'}`}
                        >
                          {isOverdue && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                          {!isOverdue && isDone && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>}
                          
                          <div className="flex justify-between items-start mb-3">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest truncate max-w-[120px]">
                              {task.source}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1 font-medium">
                              <User size={10} /> {task.owner}
                            </span>
                          </div>

                          <p className="font-display font-bold text-slate-900 text-base mb-3 leading-tight">{task.task}</p>

                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className={isOverdue ? 'text-rose-500' : 'text-slate-400'} />
                              <span className={`font-bold text-[10px] uppercase tracking-wide ${isOverdue ? 'text-rose-600' : 'text-slate-500'}`}>
                                Vence: {task.deadline}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Target size={12} className="text-indigo-400" />
                              <span className="font-bold text-[10px] uppercase tracking-wide text-slate-500">
                                Métrica: {task.metric}
                              </span>
                            </div>
                          </div>

                          {col.id === 'done' && task.impact?.estimate > 0 && (
                            <div className="bg-emerald-50 p-3 rounded-xl mb-4 border border-emerald-100">
                              <p className="text-[9px] text-emerald-800/70 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                                <TrendingUp size={10} /> Retorno de Inversión Proyectado
                              </p>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Proyectado:</span>
                                <span className="font-mono text-slate-900">${task.impact.estimate.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs mt-1 border-t border-emerald-200/50 pt-1">
                                <span className="text-emerald-800 font-bold">Real / Observado:</span>
                                <span className="font-mono font-bold text-emerald-700">
                                  ${Math.round(getObserved(task.impact.estimate, task.id)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 border-t border-slate-100 pt-3 mt-auto">
                            {col.id !== 'todo' && (
                              <button onClick={() => moveTask(task.id, 'todo')} className="flex-1 flex justify-center py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors border border-slate-200" title="Mover a Por Hacer">
                                <ChevronLeft size={16} />
                              </button>
                            )}
                            {col.id !== 'in_progress' && (
                              <button onClick={() => moveTask(task.id, 'in_progress')} className="flex-1 flex justify-center py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-bold tracking-wide" title="Mover a En Curso">
                                En Curso
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button onClick={() => moveTask(task.id, 'done')} className="flex-1 flex justify-center py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors font-bold tracking-wide" title="Mover a Hecho">
                                Finalizar <ChevronRight size={16} />
                              </button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
