import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createTask,
  getTasksByBoard,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/task.controller';

const router = Router();

// Create task
router.post('/', auth, createTask);
router.get('/:boardId', auth, getTasksByBoard);
router.get('/:taskId', auth, getTaskById);
router.put('/:taskId', auth, updateTask);
router.delete('/:taskId', auth, deleteTask);

export default router;