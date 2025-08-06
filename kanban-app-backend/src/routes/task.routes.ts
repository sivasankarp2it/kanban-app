import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createTask,
  getTasksByBoard,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller';

const router = Router();

router.post('/', auth, createTask);
router.get('/:boardId', auth, getTasksByBoard);
router.get('/details/:taskId', auth, getTask);
router.put('/:taskId', auth, updateTask);
router.delete('/:taskId', auth, deleteTask);

export default router;