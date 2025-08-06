import { Request, Response } from 'express';
import Task from '../models/Task';

// Create task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, boardId, position } = req.body;
    const task = await Task.create({
      title,
      description,
      board: boardId,
      position: position || 0
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get all tasks by board
export const getTasksByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const tasks = await Task.find({ board: boardId }).sort('position');
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Get task by ID
export const getTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Error deleting task' });
  }
};