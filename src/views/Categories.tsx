import { useState } from 'react';
import { Category } from '../types';
import { Plus, Search, Tag, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CategoryModal from '../components/CategoryModal';

interface CategoriesViewProps {
  categories: Category[];
  refresh: () => void;
}

export default function CategoriesView({ categories, refresh }: CategoriesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteCategory = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría? Todas las tareas asociadas quedarán sin categoría (o la operación fallará si hay dependencias).')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      refresh();
      toast.success('Categoría eliminada');
    } catch (error) {
      toast.error('Error al eliminar categoría. Asegúrate de que no tenga tareas asociadas.');
    }
  };

  const openModal = (cat?: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Taxonomía Nexus</h1>
          <p className="text-slate-500 font-medium">Clasificación lógica de flujos de trabajo.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-emerald-500 text-[#0A0C10] px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-[#11141A] p-4 rounded-2xl border border-slate-800/50 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Filtrar taxonomía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none text-sm transition-all border text-slate-300 placeholder:text-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-[#11141A] border border-slate-800/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-slate-700/50 transition-all group flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: cat.color || '#475569' }} />
            
            <div 
              className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: `${cat.color}20` || '#1e293b' }}
            >
               <Tag size={32} style={{ color: cat.color || '#94a3b8' }} />
            </div>
            
            <h3 className="font-bold text-lg text-white mb-1 uppercase tracking-tight">{cat.name}</h3>
            <p className="text-[10px] font-bold font-mono text-slate-600 uppercase tracking-[0.2em] mb-8">NODE_REF: {cat.id}</p>

            <div className="flex items-center gap-3 w-full pt-6 border-t border-slate-800/50 mt-auto">
              <button 
                onClick={() => openModal(cat)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-colors"
              >
                <Edit2 size={14} />
                Refactor
              </button>
              <button 
                onClick={() => deleteCategory(cat.id)}
                className="p-2.5 aspect-square flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
