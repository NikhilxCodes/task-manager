import { Task, TaskPriority } from '../types';
import { Trash2, Edit2, Check } from 'lucide-react';

interface TaskListItemProps {
    task: Task;
    onToggleStatus: (taskId: string, nextStatus: Task['status']) => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
}

const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
        case 'High':
            return 'bg-red-50 text-red-700 border-red-100';
        case 'Medium':
            return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Low':
            return 'bg-blue-50 text-blue-700 border-blue-100';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-100';
    }
};

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onToggleStatus, onDelete, onEdit }) => {
    const isCompleted = task.status === 'Completed';

    return (
        <div
            className={`group relative bg-white border border-slate-100 rounded-xl p-4 transition-all hover:shadow-md hover:border-indigo-100 flex items-center gap-4 ${isCompleted ? 'opacity-75' : ''
                }`}
        >
            <button
                onClick={() => onToggleStatus(task._id, isCompleted ? 'Pending' : 'Completed')}
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 text-transparent hover:border-indigo-500'
                    }`}
            >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`font-semibold text-slate-800 truncate transition-all ${isCompleted ? 'line-through text-slate-400' : ''
                        }`}>
                        {task.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                </div>
                <p className={`text-sm text-slate-500 truncate ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                    {task.description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(task)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(task._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default TaskListItem;
