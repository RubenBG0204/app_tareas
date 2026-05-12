import { useState } from 'react';
import { User } from '../types';
import { Plus, Search, Mail, Calendar, Trash2, Edit2, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import UserModal from '../components/UserModal';

interface UsersViewProps {
  users: User[];
  refresh: () => void;
}

export default function UsersView({ users, refresh }: UsersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteUser = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Las tareas asignadas dejarán de tener este usuario.')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      refresh();
      toast.success('Usuario eliminado');
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const openModal = (user?: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Directorio de Agentes</h1>
          <p className="text-slate-500 font-medium">Gestión de identidades y privilegios en nexus.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-emerald-500 text-[#0A0C10] px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#11141A] p-4 rounded-2xl border border-slate-800/50 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Buscar por identidad o firma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none text-sm transition-all border text-slate-300 placeholder:text-slate-700"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-[#11141A] border border-slate-800/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-slate-700/50 transition-all group">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl font-bold shadow-glow">
                 {user.name.charAt(0)}
               </div>
               <div>
                  <h3 className="font-bold text-lg text-white">{user.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <Mail size={12} />
                    {user.email}
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800/50">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  ACTIVO DESDE {format(new Date(user.createdAt), 'MMM yyyy', { locale: es })}
                </span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-slate-400 font-mono">UID: {user.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => openModal(user)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 rounded-xl text-xs font-bold text-slate-300 uppercase tracking-widest transition-colors"
              >
                <Edit2 size={14} />
                Editar
              </button>
              <button 
                onClick={() => deleteUser(user.id)}
                className="p-2.5 aspect-square flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
