import React, { useState } from 'react';
import { X, Save, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { toast } from 'react-hot-toast';

interface CategoryModalProps {
  category?: Category;
  onClose: () => void;
  onRefresh: () => void;
}

export default function CategoryModal({ category, onClose, onRefresh }: CategoryModalProps) {
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || '#3b82f6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#141414', '#6b7280', '#06b6d4', '#f97316'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('El nombre es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = category ? `/api/categories/${category.id}` : '/api/categories';
      const method = category ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });

      if (!res.ok) throw new Error();
      
      toast.success(category ? 'Categoría actualizada' : 'Categoría creada');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error('Error al guardar categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#11141A] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-800/50"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50 bg-[#151921]">
          <h2 className="text-xl font-bold text-white tracking-tight">{category ? 'Ajustar Parámetros' : 'Nueva Taxonomía'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Descriptor de categoría</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none transition-all border text-slate-200 placeholder:text-slate-700 font-medium"
              placeholder="Ej. BACKEND_SYNC, UI_CORE..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Palette size={14} /> Color de Identificación
            </label>
            <div className="grid grid-cols-5 gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`aspect-square rounded-xl border-2 transition-all ${
                    color === c ? 'border-emerald-500 scale-110 shadow-glow' : 'border-transparent scale-100 hover:scale-105 hover:border-slate-600'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 p-3 bg-[#0D0F14] rounded-xl border border-slate-800">
               <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: color }} />
               <input 
                 type="text" 
                 value={color} 
                 onChange={(e) => setColor(e.target.value)}
                 className="text-xs font-mono uppercase bg-transparent border-none text-slate-400 outline-none w-24"
               />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-slate-800/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 rounded-xl font-bold text-slate-400 text-xs uppercase tracking-widest bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-3 bg-emerald-500 text-[#0A0C10] px-4 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <Save size={18} />}
              {category ? 'Guardar Cambios' : 'Generar Taxonomía'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
