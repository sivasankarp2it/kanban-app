import { Router } from 'express';
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from '../controllers/workspace.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', auth, createWorkspace);            // Create
router.get('/', auth, getMyWorkspaces);             // Read All (User-specific)
router.get('/:id', auth, getWorkspaceById);         // Read One
router.put('/:id', auth, updateWorkspace);          // Update
router.delete('/:id', auth, deleteWorkspace);       // Delete

export default router;