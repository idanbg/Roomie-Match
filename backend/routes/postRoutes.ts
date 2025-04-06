import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostsByUserId,
  deletePost,
  likePost,
  unlikePost
} from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             text: "אני מחפש שותף לדירה ברמת גן"
 *             image: "https://example.com/image.jpg"
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (public)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /api/posts/mine:
 *   get:
 *     summary: Get posts created by the logged-in user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's own posts
 *       401:
 *         description: Unauthorized
 */
router.get('/mine', protect, getMyPosts);

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts by specific user ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Posts by the user
 *       404:
 *         description: User not found
 */
router.get('/user/:userId', getPostsByUserId);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID (only author allowed)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.delete('/:postId', protect, deletePost);

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   put:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to like
 *     responses:
 *       200:
 *         description: Post liked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.put('/:postId/like', protect, likePost);

/**
 * @swagger
 * /api/posts/{postId}/unlike:
 *   put:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to unlike
 *     responses:
 *       200:
 *         description: Post unliked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.put('/:postId/unlike', protect, unlikePost);

export default router;
