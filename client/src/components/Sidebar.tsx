import { Layout, ListTodo, Calendar, User, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    user: { name?: string; email?: string } | null;
    onLogout: () => void;
    activeTab?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, onLogout }) => {
    const location = useLocation();
    const sidebarLinks = [
        { label: 'Dashboard', icon: Layout, path: '/dashboard' },
        { label: 'My Tasks', icon: ListTodo, path: '/tasks' },
        { label: 'Calendar', icon: Calendar, path: '/calendar' }, // Replaced Inbox with Calendar
        { label: 'Account', icon: User, path: '/account' }, // Replaced Reports with Account
    ];

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform lg:transform-none transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col p-4">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                                <Layout className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-slate-800">Workspace</span>
                        </div>
                        <button onClick={onClose} className="lg:hidden p-1 text-slate-400">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="space-y-1 flex-1">
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${location.pathname === link.path
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-slate-200 pt-4 mt-4">
                        <div className="flex items-center justify-between px-2 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-slate-700 truncate max-w-[100px]">{user?.name || 'User'}</p>
                                </div>
                            </div>
                            <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
