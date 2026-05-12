/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { LayoutDashboard, CheckSquare, Users as UsersIcon, Tag, Menu, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, User, Category } from './types';

// Mock views for now
import Dashboard from './views/Dashboard';
import TasksView from './views/Tasks';
import UsersView from './views/Users';
import CategoriesView from './views/Categories';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'users' | 'categories'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // App-wide data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes, categoriesRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/users'),
        fetch('/api/categories')
      ]);
      
      const tasksData = await tasksRes.json();
      const usersData = await usersRes.json();
      const categoriesData = await categoriesRes.json();
      
      setTasks(tasksData);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = () => fetchData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare },
    { id: 'users', label: 'Usuarios', icon: UsersIcon },
    { id: 'categories', label: 'Categorías', icon: Tag },
  ];

  return (
    <div className="flex h-screen bg-[#0A0C10] text-slate-300 font-sans">
      <Toaster position="bottom-right" 
        toastOptions={{
          style: {
            background: '#11141A',
            color: '#CBD5E1',
            border: '1px solid rgba(71, 85, 105, 0.2)',
          },
        }}
      />
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="fixed lg:relative z-40 w-64 h-full bg-[#11141A] border-r border-slate-800/50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              <div className="p-6">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-[#0A0C10] shadow-glow">
                     <CheckSquare size={20} strokeWidth={2.5} />
                   </div>
                   <h1 className="text-lg font-bold tracking-tight text-white">TaskNexus</h1>
                 </div>
              </div>

              <div className="px-3 py-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-2">Menu</p>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === item.id 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <item.icon size={18} className={activeTab === item.id ? 'opacity-100' : 'opacity-60'} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 mt-auto">
                <div className="bg-[#1C2128] rounded-xl p-3 border border-slate-700/50">
                   <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Systen Status</p>
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                     <span className="text-[11px] font-mono text-slate-400">Node Cluster: Online</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-[#0D0F14] border-b border-slate-800/50 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-slate-800/50 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em]">
              {activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-800/30 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <UsersIcon size={12} className="text-emerald-500" />
                {users.length} Colaboradores
             </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-7xl mx-auto"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                   <div className="w-8 h-8 border-2 border-slate-800 border-t-emerald-500 rounded-full animate-spin" />
                   <p className="text-xs font-mono text-slate-500 animate-pulse">Sincronizando nexus...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && <Dashboard tasks={tasks} users={users} categories={categories} refresh={refresh} />}
                  {activeTab === 'tasks' && <TasksView tasks={tasks} users={users} categories={categories} refresh={refresh} />}
                  {activeTab === 'users' && <UsersView users={users} refresh={refresh} />}
                  {activeTab === 'categories' && <CategoriesView categories={categories} refresh={refresh} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
