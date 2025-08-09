import { Request, Response } from 'express';
import Board from '../models/Board';
import { getIO } from '../socket/socket';

// CREATE
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({ message: 'Name and workspaceId are required' });
    }

    const board = await Board.create({ name, workspace: workspaceId });

    // Emit event to everyone in the workspace
    getIO().to(`workspace:${workspaceId}`).emit('boardCreated', board);

    res.status(201).json(board);
  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).json({ message: 'Error creating board' });
  }
};

// READ ALL BY WORKSPACE
export const getBoardsByWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const boards = await Board.find({ workspace: workspaceId });
    res.json(boards);
  } catch (err) {
    console.error('Error fetching boards:', err);
    res.status(500).json({ message: 'Error fetching boards' });
  }
};

// READ ONE
export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    console.error('Error fetching board:', err);
    res.status(500).json({ message: 'Error fetching board' });
  }
};

// UPDATE
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const updated = await Board.findByIdAndUpdate(boardId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Board not found' });

    getIO().to(`workspace:${updated.workspace}`).emit('boardUpdated', updated);

    res.json(updated);
  } catch (err) {
    console.error('Error updating board:', err);
    res.status(500).json({ message: 'Error updating board' });
  }
};

// DELETE
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const deleted = await Board.findByIdAndDelete(boardId);
    if (!deleted) return res.status(404).json({ message: 'Board not found' });

    getIO().to(`workspace:${deleted.workspace}`).emit('boardDeleted', boardId);

    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    console.error('Error deleting board:', err);
    res.status(500).json({ message: 'Error deleting board' });
  }
};