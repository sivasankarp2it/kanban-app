import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard
} from '../controllers/board.controller';

const router = Router();

router.post('/', auth, createBoard);
router.get('/workspace/:workspaceId', auth, getBoardsByWorkspace);
router.get('/:boardId', auth, getBoardById);
router.put('/:boardId', auth, updateBoard);
router.delete('/:boardId', auth, deleteBoard);

export default router;