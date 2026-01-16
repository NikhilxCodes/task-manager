import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Menu, User, Mail, Trash2, Save } from 'lucide-react';


const Account: React.FC = () => {
    const { user, logout, updateProfile, deleteAccount } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateProfile({ name, email });
        } catch (error) {
            // Toast handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your tasks.')) {
            try {
                await deleteAccount();
            } catch (error) {
                // Toast handled in context
            }
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={logout}
                activeTab="Reports" // Mapping "Reports" -> Account for now, will update Sidebar types later
            />

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">Account Settings</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-2xl mx-auto">

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Profile Information</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 settings-save-btn"
                                    >
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
                            <h2 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h2>
                            <p className="text-red-600 mb-6 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Account;
