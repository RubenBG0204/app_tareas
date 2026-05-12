import React, { useState } from 'react';
import { X, Save, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import { toast } from 'react-hot-toast';

interface UserModalProps {
  user?: User;
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserModal({ user, onClose, onRefresh }: UserModalProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = user ? `/api/users/${user.id}` : '/api/users';
      const method = user ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error();
      
      toast.success(user ? 'Usuario actualizado' : 'Usuario creado');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error('Error al guardar usuario. Puede que el email ya exista.');
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
          <h2 className="text-xl font-bold text-white tracking-tight">{user ? 'Refactorizar Agente' : 'Alta de Nuevo Agente'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Pseudónimo / Nombre</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none transition-all border text-slate-200 placeholder:text-slate-700 font-medium"
              placeholder="Identidad del agente..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Coordenadas de Enlace (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0F14] border-slate-800 focus:border-emerald-500/50 rounded-xl outline-none transition-all border text-slate-200 placeholder:text-slate-700 font-medium"
              placeholder="firma@nexus.com"
            />
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
              {user ? 'Guardar Cambios' : 'Registrar Agente'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
