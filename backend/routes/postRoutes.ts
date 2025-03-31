import { Router } from 'express';
import { createPost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';
import { getAllPosts } from '../controllers/postController';
import { getMyPosts, getPostsByUserId } from '../controllers/postController';

const router = Router();

router.post('/', protect, createPost);
router.get('/', getAllPosts);
router.get('/mine', protect, getMyPosts);
router.get('/user/:userId', getPostsByUserId);

export default router;
