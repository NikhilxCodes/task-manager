import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Task, TaskStatus, TaskPriority } from '../types';
import TaskListItem from '../components/TaskListItem';
import Sidebar from '../components/Sidebar';
import StatsOverview from '../components/StatsOverview';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import {
  Plus, Search, Bell, Menu, X, FileText, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isPast, parseISO } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Pending' as TaskStatus, priority: 'Medium' as TaskPriority, dueDate: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');

      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data?.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
        toast.error('Invalid data received from server');
      }
    } catch (error) {
      toast.error('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingTaskId) {
        const response = await api.put(`/tasks/${editingTaskId}`, newTask);
        setTasks(tasks.map(t => t._id === editingTaskId ? response.data.task : t));
        toast.success('Task updated successfully');
      } else {
        const response = await api.post('/tasks', newTask);
        setTasks([response.data.task, ...tasks]);
        toast.success('Task created successfully');
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleStatus = async (taskId: string, nextStatus: Task['status']) => {
    try {
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: nextStatus } : t));
      await api.put(`/tasks/${taskId}`, { status: nextStatus });
      toast.success(nextStatus === 'Completed' ? 'Task completed!' : 'Task re-opened');
    } catch (error) {
      fetchTasks();
      toast.error('Failed to update status');
    }
  };

  const openEditModal = (task: Task) => {
    setNewTask({ title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate || '' });
    setEditingTaskId(task._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setNewTask({ title: '', description: '', status: 'Pending', priority: 'Medium', dueDate: '' });
    setIsEditing(false);
    setEditingTaskId(null);
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = safeTasks.filter(task =>
    (task.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: safeTasks.length,
    inProgress: safeTasks.filter(t => t.status === 'Pending').length,
    completed: safeTasks.filter(t => t.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={logout}
        activeTab="Dashboard"
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative group max-w-md w-full sm:w-80 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative group cursor-pointer">
              <Bell className="h-5 w-5" />
              {tasks.some(t => t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'Completed') && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}

              {/* Notifications Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-hover:block z-50">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'Completed').length > 0 ? (
                    tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'Completed').map(task => (
                      <div key={task._id} className="p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{task.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Overdue</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow active:scale-95 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Project Overview</h1>
                <p className="text-slate-500 mt-1">Track your team's progress</p>
              </div>
              <div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">This Week</span>
              </div>
            </div>

            <StatsOverview stats={stats} />

            {/* Task List */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                Recent Activity
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-normal">{filteredTasks.length}</span>
              </h2>

              <div className="space-y-3">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                      <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No tasks found. Create one to get started!</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        layout
                      >
                        <TaskListItem
                          task={task}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDeleteTask}
                          onEdit={openEditModal}
                        />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Task Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="E.g., Design new landing page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none min-h-[100px]"
                    placeholder="Add details about this task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    {isEditing ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
