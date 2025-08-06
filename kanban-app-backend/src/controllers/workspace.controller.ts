import { Request, Response } from 'express';
import Workspace from '../models/Workspace';

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user.id;

    const workspace = await Workspace.create({
      name,
      owner: userId,
      members: [userId],
    });

    res.status(201).json(workspace);
  } catch (err) {
    console.error('Create Workspace Error:', err);
    res.status(500).json({ message: 'Error creating workspace' });
  }
};

export const getMyWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const workspaces = await Workspace.find({ members: userId });
    res.json(workspaces);
  } catch (err) {
    console.error('Get Workspaces Error:', err);
    res.status(500).json({ message: 'Error fetching workspaces' });
  }
};

export const getWorkspaceById = async (req: Request, res: Response) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.json(workspace);
  } catch (err) {
    console.error('Get Workspace Error:', err);
    res.status(500).json({ message: 'Error fetching workspace' });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    const updated = await Workspace.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Update Workspace Error:', err);
    res.status(500).json({ message: 'Error updating workspace' });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const deleted = await Workspace.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.json({ message: 'Workspace deleted successfully' });
  } catch (err) {
    console.error('Delete Workspace Error:', err);
    res.status(500).json({ message: 'Error deleting workspace' });
  }
};
