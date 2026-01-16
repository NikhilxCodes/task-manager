import Task, { ITask, TaskStatus, TaskPriority } from '../models/Task';
import mongoose from 'mongoose';

export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  dueDate?: Date | string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | string;
}

export const createTask = async (data: CreateTaskData): Promise<ITask> => {
  const task = new Task({
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    userId: new mongoose.Types.ObjectId(data.userId),
    dueDate: data.dueDate,
  });

  await task.save();
  return task;
};

export const getTasksByUser = async (
  userId: string,
  status?: TaskStatus,
  searchQuery?: string
): Promise<ITask[]> => {
  const query: any = { userId: new mongoose.Types.ObjectId(userId) };

  if (status) {
    query.status = status;
  }

  if (searchQuery?.trim()) {
    query.$text = { $search: searchQuery };
  }

  return Task.find(query).sort({ createdAt: -1 });
};

export const getTaskById = async (
  taskId: string,
  userId: string
): Promise<ITask | null> => {
  return await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    userId: new mongoose.Types.ObjectId(userId),
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskData
): Promise<ITask | null> => {
  const task = await Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(taskId),
      userId: new mongoose.Types.ObjectId(userId),
    },
    { $set: data },
    { new: true, runValidators: true }
  );

  return task;
};

export const deleteTask = async (
  taskId: string,
  userId: string
): Promise<boolean> => {
  const result = await Task.deleteOne({
    _id: new mongoose.Types.ObjectId(taskId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  return result.deletedCount > 0;
};

