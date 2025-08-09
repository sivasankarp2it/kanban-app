import { Request, Response } from 'express';
import Workspace from '../models/Workspace';
import { getIO } from '../socket/socket';

// CREATE
export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user?.id;

    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    const workspace = await Workspace.create({
      name,
      owner: userId,
      members: [userId],
    });

    getIO().to(`user:${userId}`).emit('workspaceCreated', workspace);

    res.status(201).json(workspace);
  } catch (err) {
    console.error('Error creating workspace:', err);
    res.status(500).json({ message: 'Error creating workspace' });
  }
};

// READ ALL (user-specific)
export const getMyWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const workspaces = await Workspace.find({ members: userId });
    res.json(workspaces);
  } catch (err) {
    console.error('Error fetching workspaces:', err);
    res.status(500).json({ message: 'Error fetching workspaces' });
  }
};

// READ ONE
export const getWorkspaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.json(workspace);
  } catch (err) {
    console.error('Error fetching workspace:', err);
    res.status(500).json({ message: 'Error fetching workspace' });
  }
};

// UPDATE
export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Workspace.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    getIO().to(`workspace:${id}`).emit('workspaceUpdated', updated);

    res.json(updated);
  } catch (err) {
    console.error('Error updating workspace:', err);
    res.status(500).json({ message: 'Error updating workspace' });
  }
};

// DELETE
export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Workspace.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    getIO().to(`workspace:${id}`).emit('workspaceDeleted', id);

    res.json({ message: 'Workspace deleted successfully' });
  } catch (err) {
    console.error('Error deleting workspace:', err);
    res.status(500).json({ message: 'Error deleting workspace' });
  }
};