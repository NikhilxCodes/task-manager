import { Response } from 'express';
import { AuthRequest } from '../types';
import {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
} from '../services/taskService';
import { TaskStatus } from '../models/Task';

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.userId!;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const task = await createTask({
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      userId,
      dueDate,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating task' });
  }
};

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const rawStatus = req.query.status as string | undefined;
    const status = rawStatus === 'Pending' || rawStatus === 'Completed' 
      ? (rawStatus as TaskStatus) 
      : undefined;
    const search = req.query.search as string | undefined;

    const tasks = await getTasksByUser(userId, status, search);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

export const getOne = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const task = await getTaskById(id, userId);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching task' });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { title, description, status, priority } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const task = await updateTask(id, userId, updateData);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating task' });
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const deleted = await deleteTask(id, userId);

    if (!deleted) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

