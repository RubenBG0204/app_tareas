import { Task, User, Category } from '../types';
import { CheckCircle2, Circle, Clock, TrendingUp, Users, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardProps {
  tasks: Task[];
  users: User[];
  categories: Category[];
  refresh: () => void;
}

export default function Dashboard({ tasks, users, categories }: DashboardProps) {
  const completedTasks = tasks.filter(t => t.status === 'completada').length;
  const pendingTasks = tasks.filter(t => t.status === 'pendiente').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const stats = [
    { label: 'Total Tareas', value: tasks.length, icon: CheckCircle2, color: 'text-emerald-400', progress: null, trend: '+12% este mes' },
    { label: 'Completadas', value: completedTasks, icon: TrendingUp, color: 'text-emerald-400', progress: completionRate, trend: null },
    { label: 'Pendientes', value: pendingTasks, icon: Clock, color: 'text-amber-500', progress: null, trend: '3 críticas hoy' },
    { label: 'Colaboradores', value: users.length, icon: Users, color: 'text-blue-400', progress: null, trend: 'En línea' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard de Proyecto</h1>
        <p className="text-slate-500 font-medium">Bienvenido de nuevo. Aquí está el estado actual de nexus.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#14181F] p-6 rounded-2xl border border-slate-800/50 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <stat.icon size={20} className={stat.color} />
            </div>
            {stat.progress !== null ? (
              <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${stat.progress}%` }} />
              </div>
            ) : (
              <div className={`text-[10px] mt-3 font-bold uppercase tracking-tighter ${stat.trend?.includes('+') ? 'text-emerald-400' : 'text-slate-500'}`}>
                {stat.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-white uppercase text-xs tracking-widest">Tareas Recientes</h2>
            <button className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:underline px-3 py-1 bg-emerald-500/10 rounded-md">Ver todas</button>
          </div>
          <div className="bg-[#11141A] rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800/50 bg-[#151921]">
                  <tr>
                    <th className="px-6 py-4 font-bold">Tarea</th>
                    <th className="px-6 py-4 font-bold text-center">Estado</th>
                    <th className="px-6 py-4 font-bold text-right">Límite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={task.status === 'completada' ? 'text-emerald-500' : 'text-slate-600'}>
                            {task.status === 'completada' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-sm font-medium truncate ${task.status === 'completada' ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                              {task.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                              {task.category.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            task.status === 'completada' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {task.status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy', { locale: es }) : '--'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-600 text-sm italic">
                        No hay tareas en el sistema.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Categories Summary */}
        <div className="space-y-4">
          <h2 className="font-bold text-white uppercase text-xs tracking-widest px-2">Estructura nexus</h2>
          <div className="bg-[#11141A] p-6 rounded-2xl border border-slate-800/50 shadow-2xl space-y-6">
            {categories.map((cat) => {
              const catTasks = tasks.filter(t => t.categoryId === cat.id).length;
              const percentage = tasks.length > 0 ? (catTasks / tasks.length) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color || '#475569' }} />
                       {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono font-bold tracking-tighter">{catTasks} NODOS</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 shadow-glow" 
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: cat.color || '#475569' 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
