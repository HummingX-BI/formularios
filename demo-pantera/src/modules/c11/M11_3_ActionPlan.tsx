import { useState } from 'react';
import { ModulePage } from '@/ui/ModulePage';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { useAppStore } from '@/app/store';

export default function M11_3_ActionPlan() {
  const { planActions } = useAppStore();
  
  // Local state to simulate changes without putting everything in the global store
  const [tasks, setTasks] = useState<any[]>(planActions.map(a => ({...a})));
  
  // Also sync when new tasks come from the store (like from M11.1 or M11.2)
  // but keep local status changes. For demo simplicity, we just merge.
  // In a real app we'd have full CRUD in the store.
  
  const moveTask = (id: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
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
      deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      metric: 'Variado',
      status: 'todo',
      impact: { estimate: 0, unit: '' }
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const openTasks = tasks.filter(t => t.status !== 'done');
  
  const todayStr = new Date().toISOString().split('T')[0]!;
  const overdueCount = openTasks.filter(t => t.deadline < todayStr).length;

  const totalExpectedImpact = tasks.reduce((sum, t) => sum + (t.impact?.estimate || 0), 0);
  
  // Simulate measurement for done tasks
  const getObserved = (estimate: number, seedStr: string) => {
    // Deterministic noise -5% to +15% based on string length
    const noise = (seedStr.length % 20) / 100 - 0.05; 
    return estimate * (1 + noise);
  };

  const columns = [
    { id: 'todo', title: 'Por Hacer' },
    { id: 'in_progress', title: 'En Curso' },
    { id: 'done', title: 'Hecho' }
  ];

  return (
    <ModulePage module={{ id: 'M11.3', categoryId: 11, title: 'Plan de Acción y Medición', level: 'S', route: '', icon: '', shortDescription: '', businessQuestion: '¿Qué estamos haciendo y está funcionando?', component: null as any }}>
      <div className="flex flex-col h-full space-y-4">
        
        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-3 border border-ice-200">
            <div className="text-xs text-secundario uppercase">Tareas Abiertas</div>
            <div className="text-xl font-bold text-navy-900">{openTasks.length}</div>
          </Card>
          <Card className={`p-3 border ${overdueCount > 0 ? 'bg-red-50 border-red-200' : 'border-ice-200'}`}>
            <div className="text-xs text-secundario uppercase">Tareas Vencidas</div>
            <div className={`text-xl font-bold ${overdueCount > 0 ? 'text-red-600' : 'text-navy-900'}`}>{overdueCount}</div>
          </Card>
          <Card className="p-3 border border-ice-200 bg-green-50">
            <div className="text-xs text-green-800 uppercase">Impacto Acumulado Esperado</div>
            <div className="text-xl font-bold text-green-700">${totalExpectedImpact.toLocaleString()}</div>
          </Card>
        </div>

        {/* Añadir Manual */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nueva acción manual..." 
            className="flex-1 border border-ice-300 rounded px-3 py-2 text-sm"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className="bg-navy-900 text-white px-4 py-2 rounded text-sm font-bold">Agregar Tarea</button>
        </form>

        {/* Tablero Kanban */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
          {columns.map(col => (
            <div key={col.id} className="bg-ice-50 rounded border border-ice-200 flex flex-col h-full overflow-hidden">
              <div className="bg-ice-100 p-2 font-bold text-sm text-navy-900 border-b border-ice-200 flex justify-between">
                {col.title}
                <Badge color="bg-white text-navy-900">{tasks.filter(t => t.status === col.id).length}</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {tasks.filter(t => t.status === col.id).map(task => {
                  const isOverdue = task.deadline < todayStr && col.id !== 'done';
                  
                  return (
                    <Card key={task.id} className={`p-3 text-xs border ${isOverdue ? 'border-red-300 bg-red-50' : 'border-ice-200 bg-white'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <Badge color="bg-sky-100 text-sky-800 truncate max-w-[100px]">{task.source}</Badge>
                        <span className="text-secundario">{task.owner}</span>
                      </div>
                      
                      <p className="font-bold text-navy-900 mb-2">{task.task}</p>
                      
                      <div className="flex justify-between items-center text-[10px] text-secundario mb-3">
                        <span className={isOverdue ? 'text-red-600 font-bold' : ''}>Vence: {task.deadline}</span>
                        <span>Métrica: {task.metric}</span>
                      </div>

                      {col.id === 'done' && task.impact?.estimate > 0 && (
                        <div className="bg-green-50 p-2 rounded mb-3 border border-green-100">
                          <p className="text-[10px] text-green-800 font-bold mb-1">Medición simulada para demostración</p>
                          <div className="flex justify-between">
                            <span>Esperado: ${task.impact.estimate.toLocaleString()}</span>
                            <span className="font-bold">Observado: ${Math.round(getObserved(task.impact.estimate, task.id)).toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-1 border-t border-ice-100 pt-2 mt-auto">
                        {col.id !== 'todo' && <button onClick={() => moveTask(task.id, 'todo')} className="flex-1 text-[10px] py-1 bg-ice-100 hover:bg-ice-200 rounded">← Por Hacer</button>}
                        {col.id !== 'in_progress' && <button onClick={() => moveTask(task.id, 'in_progress')} className="flex-1 text-[10px] py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded">En Curso</button>}
                        {col.id !== 'done' && <button onClick={() => moveTask(task.id, 'done')} className="flex-1 text-[10px] py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded">Hecho →</button>}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModulePage>
  );
}
