import { Layout, AlertCircle, CheckCircle } from 'lucide-react';

interface StatsOverviewProps {
    stats: {
        total: number;
        inProgress: number;
        completed: number;
    };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
                { label: 'Total Tasks', val: stats.total, color: 'bg-indigo-50 text-indigo-600', icon: Layout },
                { label: 'In Progress', val: stats.inProgress, color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
                { label: 'Completed', val: stats.completed, color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                        <stat.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.val}</h3>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;
