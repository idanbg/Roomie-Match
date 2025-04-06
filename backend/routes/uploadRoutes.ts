import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image upload
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image (protected)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               imagePath: "/uploads/example.jpg"
 *       400:
 *         description: No image uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  protect,
  upload.single('image'),
  async (req, res): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No image uploaded' });
        return;
      }

      res.status(200).json({ imagePath: `/uploads/${req.file.filename}` });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
