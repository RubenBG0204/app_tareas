import { useState } from 'react';
import { Task, User, Category } from '../types';
import { Plus, Search, Filter, MoreVertical, CheckCircle2, Circle, Clock, Trash2, Edit2, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import TaskModal from '../components/TaskModal';

interface TasksViewProps {
  tasks: Task[];
  users: User[];
  categories: Category[];
  refresh: () => void;
}

export default function TasksView({ tasks, users, categories, refresh }: TasksViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const [filterUser, setFilterUser] = useState<number | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.categoryId === filterCategory;
    const matchesUser = filterUser === 'all' || task.users.some(u => u.id === filterUser);
    return matchesSearch && matchesCategory && matchesUser;
  });

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'pendiente' ? 'completada' : 'pendiente';
    try {
      await fetch(`/api/tasks/${task.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      refresh();
      toast.success(`Tarea ${newStatus === 'completada' ? 'completada' : 'reabierta'}`);
    } catch (error) {
      toast.error('Error al actualizar tarea');
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      refresh();
      toast.success('Tarea eliminada');
    } catch (error) {
      toast.error('Error al eliminar tarea');
    }
  };

  const openModal = (task?: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Centro de Operaciones</h1>
          <p className="text-slate-500 font-medium">Gestión integral de nodos y tareas de equipo.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-emerald-500 text-[#0A0C10] px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#11141A] p-4 rounded-2xl border border-slate-800/50 shadow-sm">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Buscar en nexus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none text-sm transition-all border text-slate-300 placeholder:text-slate-700"
          />
        </div>
        <div className="flex gap-3 min-w-fit">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-2 bg-[#0D0F14] border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 outline-none focus:border-emerald-500/50 appearance-none min-w-[160px]"
          >
            <option value="all">Categorías: Todas</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-2 bg-[#0D0F14] border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 outline-none focus:border-emerald-500/50 appearance-none min-w-[160px]"
          >
            <option value="all">Asignación: Todos</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-[#11141A] border border-slate-800/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-slate-700/50 transition-all group flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: task.category.color || '#475569' }} />
            
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-1 bg-slate-800/50 rounded border border-slate-700/30 text-slate-400">
                {task.category.name}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => openModal(task)}
                  className="p-1.5 text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className={`text-lg font-bold leading-tight mb-2 ${task.status === 'completada' ? 'line-through text-slate-600' : 'text-white'}`}>
              {task.title}
            </h3>
            
            <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1 font-medium">
              {task.description || 'Sin parámetros de descripción definidos.'}
            </p>

            <div className="flex flex-col gap-5 pt-5 border-t border-slate-800/50">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => toggleStatus(task)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    task.status === 'completada' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'completada' ? 'bg-emerald-500 shadow-glow' : 'bg-amber-500'}`} />
                  {task.status}
                </button>
                {task.dueDate && (
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                    <Clock size={12} />
                    {format(new Date(task.dueDate), 'MMM d, yyyy', { locale: es })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {task.users.map((u) => (
                    <div 
                      key={u.id} 
                      className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#11141A] flex items-center justify-center text-[10px] text-white font-bold ring-0 group-hover:ring-2 ring-emerald-500/30 transition-all shadow-sm"
                      title={u.name}
                    >
                      {u.name.charAt(0)}
                    </div>
                  ))}
                  {task.users.length === 0 && <span className="text-[10px] text-slate-600 font-bold uppercase italic">Sin Agentes</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
           <div className="w-20 h-20 bg-[#11141A] border border-slate-800/50 rounded-3xl flex items-center justify-center text-slate-700 mb-6 shadow-2xl">
              <CheckSquare size={40} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Nexus despejado</h3>
           <p className="text-slate-500 max-w-xs">No hay registros que coincidan con los parámetros de búsqueda actuales.</p>
        </div>
      )}

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          users={users}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
