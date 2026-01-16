import express from 'express';
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from '../controllers/taskController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;

