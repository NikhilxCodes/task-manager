import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';
import api from '../utils/axios';
import Sidebar from '../components/Sidebar';
import { Menu, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday } from 'date-fns';

const CalendarView: React.FC = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Tasks for selected day
    const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

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
            toast.error('Failed to load tasks');
            setTasks([]);
        }
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getTasksForDay = (date: Date) => {
        return tasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), date));
    };

    const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={logout}
                activeTab="Inbox" // Mapping "Inbox" -> Calendar
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
                        <h1 className="text-xl font-bold text-slate-800">Calendar</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="h-5 w-5" /></button>
                        <span className="font-semibold text-lg w-32 text-center">{format(currentMonth, 'MMMM yyyy')}</span>
                        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col gap-6">

                    {/* Calendar Grid */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                        <div className="grid grid-cols-7 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 auto-rows-fr gap-1">
                            {calendarDays.map((day) => {
                                const dayTasks = getTasksForDay(day);
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isSelected = selectedDay && isSameDay(day, selectedDay);
                                const isTodayDate = isToday(day);

                                return (
                                    <div
                                        key={day.toISOString()}
                                        onClick={() => setSelectedDay(day)}
                                        className={`
                                    min-h-[100px] p-2 border border-slate-100 rounded-lg cursor-pointer transition-all relative
                                    ${!isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'}
                                    ${isSelected ? 'ring-2 ring-indigo-600 ring-inset z-10' : 'hover:border-indigo-200'}
                                    ${isTodayDate ? 'bg-indigo-50/30 font-semibold' : ''}
                                `}
                                    >
                                        <span className={`text-sm ${isTodayDate ? 'text-indigo-600' : ''}`}>{format(day, 'd')}</span>
                                        <div className="mt-1 space-y-1">
                                            {dayTasks.slice(0, 3).map(task => (
                                                <div key={task._id} className={`text-[10px] truncate px-1.5 py-0.5 rounded-sm ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {task.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <div className="text-[10px] text-slate-400 pl-1">+{dayTasks.length - 3} more</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected Day Details */}
                    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-lg mb-4 text-slate-800">
                            {selectedDay ? format(selectedDay, 'EEEE, MMMM do') : 'Select a date'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedDayTasks.length > 0 ? (
                                selectedDayTasks.map(task => (
                                    <div key={task._id} className="p-3 border border-slate-100 rounded-xl hover:shadow-md transition-shadow group bg-slate-50/50">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-slate-800 text-sm line-clamp-2">{task.title}</h4>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                                task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">{task.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {task.status}
                                            </span>
                                            {task.dueDate && (
                                                <span className="text-[10px] text-slate-400">
                                                    {format(parseISO(task.dueDate), 'h:mm a')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-slate-400">
                                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No tasks for this day</p>
                                </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default CalendarView;
