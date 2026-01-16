export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  userId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'All' | 'Pending' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

