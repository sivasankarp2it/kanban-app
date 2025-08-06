import { Request, Response } from 'express';
import Board from '../models/Board';

// Create Board
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name, workspaceId } = req.body;
    const board = await Board.create({ name, workspace: workspaceId });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error creating board', error: err });
  }
};

// Get Boards by Workspace
export const getBoardsByWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const boards = await Board.find({ workspace: workspaceId });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching boards', error: err });
  }
};

// Get Board by ID
export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching board', error: err });
  }
};

// Update Board
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;
    const board = await Board.findByIdAndUpdate(boardId, { name }, { new: true });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error updating board', error: err });
  }
};

// Delete Board
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findByIdAndDelete(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting board', error: err });
  }
};