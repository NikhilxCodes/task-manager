import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Layout,
  Search,
  Bell,
  Plus,
} from "lucide-react";
import TaskListItem from "../components/TaskListItem";
import Sidebar from "../components/Sidebar";
import StatsOverview from "../components/StatsOverview";
import { Task } from "../types";

const Landing: React.FC = () => {
  // Mock data for the mini dashboard preview
  const mockTasks: Task[] = [
    {
      _id: "1",
      title: "Redesign Landing Page",
      description: "Implement new glassmorphism design system",
      status: "Pending",
      priority: "High",
      userId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Integrate Payment Gateway",
      description: "Setup Stripe for premium subscriptions",
      status: "Pending",
      priority: "Medium",
      userId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "3",
      title: "Update User Documentation",
      description: "Write guides for new features",
      status: "Completed",
      priority: "Low",
      userId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockStats = {
    total: 12,
    inProgress: 5,
    completed: 7,
  };

  const mockUser = {
    name: "Demo User",
    email: "demo@example.com",
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans overflow-hidden flex flex-col lg:flex-row relative">
      {/* Left Side - Hero Section */}
      <div className="lg:w-[45%] h-full min-h-screen flex flex-col justify-center px-8 sm:px-12 lg:px-16 relative z-10 bg-white border-r border-slate-100">
        {/* Enhanced Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-100/40 rounded-full blur-[100px] opacity-70 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-100/40 rounded-full blur-[100px] opacity-70"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-lg mx-auto lg:mx-0 pt-20 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 rotate-3 transform hover:rotate-6 transition-transform">
              <Layout className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              TaskFlow
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Manage tasks with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              clarity
            </span>
            .
          </h1>

          <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-md">
            The premium workspace designed to help you organize projects, hit
            deadlines, and unleash your team's productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              to="/login"
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 border-t border-slate-100 pt-8 flex items-center gap-8 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>Lightning Fast</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual Demo */}
      <div className="hidden lg:block lg:w-[55%] min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Technical Grid Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Gradient Blur Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Mini Dashboard Simulation */}
        <div className="absolute inset-0 flex items-center justify-center z-10 p-12 lg:pl-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: -5 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-5xl aspect-[16/10] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60 flex relative transform transition-transform duration-500 hover:rotate-y-0"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
              boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.15)",
            }}
          >
            {/* Sidebar (Mock) */}
            <div className="w-64 border-r border-slate-100 h-full hidden xl:block pointer-events-none bg-slate-50/50 backdrop-blur-sm">
              <Sidebar
                isOpen={true}
                onClose={() => {}}
                user={mockUser}
                onLogout={() => {}}
                activeTab="Dashboard"
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Top Bar */}
              <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                <div className="relative w-64 opacity-50">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <div className="w-full h-9 bg-slate-50 rounded-lg border border-slate-100"></div>
                </div>
                <div className="flex items-center gap-4 opacity-80">
                  <div className="p-2 text-slate-400">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    <span>New Task</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-8 overflow-hidden bg-slate-50/30">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        Project Overview
                      </h2>
                      <p className="text-slate-500 mt-1 text-sm">
                        Track your team's progress
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="transform scale-[0.95] origin-top-left sm:scale-100">
                    <StatsOverview stats={mockStats} />
                  </div>

                  {/* Task List */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      Recent Activity
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-normal">
                        3
                      </span>
                    </h3>
                    <div className="space-y-3 pointer-events-none">
                      {mockTasks.map((task) => (
                        <TaskListItem
                          key={task._id}
                          task={task}
                          onToggleStatus={() => {}}
                          onDelete={() => {}}
                          onEdit={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Notification */}
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-50 max-w-xs"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Task Completed!
                </p>
                <p className="text-xs text-slate-500">
                  You finished "Update Documentation"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
