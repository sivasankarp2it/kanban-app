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

router.post('/', auth, createWorkspace);
router.get('/', auth, getMyWorkspaces);
router.get('/:id', auth, getWorkspaceById);
router.put('/:id', auth, updateWorkspace);
router.delete('/:id', auth, deleteWorkspace);

export default router;