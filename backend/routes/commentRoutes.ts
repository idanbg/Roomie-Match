import { Router } from 'express';
import { createComment, getCommentsForPost,deleteComment } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/:postId', protect, createComment);
router.get('/:postId', getCommentsForPost);
router.delete('/:commentId', protect, deleteComment);

export default router;