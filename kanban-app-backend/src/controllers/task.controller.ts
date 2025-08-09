import { Request, Response } from 'express';
import Task from '../models/Task';
import { getIO } from '../socket/socket';

// CREATE
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, boardId, position } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ message: 'Title and boardId are required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      board: boardId,
      position: position || 0
    });

    getIO().to(`board:${boardId}`).emit('taskCreated', task);

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// READ ALL BY BOARD
export const getTasksByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const tasks = await Task.find({ board: boardId }).sort('position');
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// READ ONE
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// UPDATE
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updated = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });

    getIO().to(`board:${updated.board}`).emit('taskUpdated', updated);

    res.json(updated);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// DELETE
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const deleted = await Task.findByIdAndDelete(taskId);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });

    getIO().to(`board:${deleted.board}`).emit('taskDeleted', taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
};