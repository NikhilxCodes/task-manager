import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';
import api from '../utils/axios';
import TaskListItem from '../components/TaskListItem';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

import toast from 'react-hot-toast';
import { isToday, isTomorrow, parseISO, isPast, isFuture } from 'date-fns';

const MyTasks: React.FC = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            if (response.data && Array.isArray(response.data.tasks)) {
                setTasks(response.data.tasks);
            } else if (Array.isArray(response.data)) {
                setTasks(response.data);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            toast.error('Failed to load tasks');
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Group tasks by due date
    const groupedTasks = {
        overdue: tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate)) && t.status !== 'Completed'),
        today: tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate))),
        tomorrow: tasks.filter(t => t.dueDate && isTomorrow(parseISO(t.dueDate))),
        upcoming: tasks.filter(t => t.dueDate && isFuture(parseISO(t.dueDate)) && !isTomorrow(parseISO(t.dueDate))),
        noDate: tasks.filter(t => !t.dueDate),
        completed: tasks.filter(t => t.status === 'Completed') // Keep completed separate or just show active? User asked for "date wise". Usually completed are hidden or at bottom. Let's show active date-wise.
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                toast.success('Task deleted successfully');
                setTasks(tasks.filter((t) => t._id !== taskId));
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    };

    const handleToggleStatus = async (taskId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
            const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
            toast.success(`Task marked as ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update task status');
        }
    };

    // Placeholder for edit
    const handleEditTask = (_task: Task) => {
        // Ideally we'd open the modal here, but for now let's just log it or maybe redirect to dashboard with query param?
        // Since the Dashboard has the modal, it's better to make the modal reusable or navigation simpler.
        // For this implementation, let's keep it simple.
        toast('Edit functionality is available on the Dashboard');
    };

    const Section = ({ title, tasks, colorClass }: { title: string, tasks: Task[], colorClass?: string }) => (
        tasks.length > 0 ? (
            <div className="mb-8">
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${colorClass || 'text-slate-800'}`}>
                    {title}
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-normal">{tasks.length}</span>
                </h3>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <TaskListItem
                            key={task._id}
                            task={task}
                            onToggleStatus={() => handleToggleStatus(task._id, task.status)}
                            onDelete={() => handleDeleteTask(task._id)}
                            onEdit={() => handleEditTask(task)}
                        />
                    ))}
                </div>
            </div>
        ) : null
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={logout}
                activeTab="My Tasks"
            />

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">My Tasks</h1>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollh-hide">
                    <div className="max-w-4xl mx-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <>
                                <Section title="Overdue" tasks={groupedTasks.overdue} colorClass="text-red-600" />
                                <Section title="Today" tasks={groupedTasks.today} colorClass="text-indigo-600" />
                                <Section title="Tomorrow" tasks={groupedTasks.tomorrow} colorClass="text-purple-600" />
                                <Section title="Upcoming" tasks={groupedTasks.upcoming} />
                                <Section title="No Due Date" tasks={groupedTasks.noDate} />
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyTasks;
