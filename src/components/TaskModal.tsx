import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Task, User, Category } from '../types';
import { toast } from 'react-hot-toast';

interface TaskModalProps {
  task?: Task;
  users: User[];
  categories: Category[];
  onClose: () => void;
  onRefresh: () => void;
}

export default function TaskModal({ task, users, categories, onClose, onRefresh }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'pendiente');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [categoryId, setCategoryId] = useState(task?.categoryId || (categories[0]?.id || 0));
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(task?.users.map(u => u.id) || []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId) {
      toast.error('Título y Categoría son obligatorios');
      return;
    }

    setIsSubmitting(true);
    const data = {
      title,
      description,
      status,
      dueDate: dueDate || null,
      categoryId,
      userIds: selectedUserIds,
    };

    try {
      const url = task ? `/api/tasks/${task.id}` : '/api/tasks';
      const method = task ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();
      
      toast.success(task ? 'Tarea actualizada' : 'Tarea creada');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error('Error al guardar tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUser = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
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
        className="relative bg-[#11141A] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800/50"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50 bg-[#151921]">
          <h2 className="text-xl font-bold text-white tracking-tight">{task ? 'Modificar Nodo' : 'Nuevo Nexus de Tarea'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Título de operación</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none transition-all border text-slate-200 placeholder:text-slate-700 font-medium"
              placeholder="¿Qué nodo debemos inicializar?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Especificaciones</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none transition-all border text-slate-400 placeholder:text-slate-700 min-h-[120px] text-sm"
              placeholder="Define los parámetros de la tarea..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Timestamp Límite</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none transition-all border text-slate-300 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Clasificación</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none transition-all border text-slate-300 text-sm appearance-none font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Agentes Asignados</label>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleUser(user.id)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    selectedUserIds.includes(user.id)
                      ? 'bg-emerald-500 border-emerald-500 text-[#0A0C10] shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-800/30 border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  {user.name}
                </button>
              ))}
              {users.length === 0 && <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle size={12}/> No hay agentes disponibles</p>}
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
              {task ? 'Guardar Cambios' : 'Inicializar Nodo'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
