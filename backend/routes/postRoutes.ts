import { Router } from 'express';
import { createPost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';
import { getAllPosts } from '../controllers/postController';
import { getMyPosts, getPostsByUserId, deletePost, likePost, unlikePost} from '../controllers/postController';

const router = Router();

router.post('/', protect, createPost);
router.get('/', getAllPosts);
router.get('/mine', protect, getMyPosts);
router.get('/user/:userId', getPostsByUserId);
router.delete('/:postId', protect, deletePost);
router.put('/:postId/like', protect, likePost);
router.put('/:postId/unlike', protect, unlikePost);

export default router;
