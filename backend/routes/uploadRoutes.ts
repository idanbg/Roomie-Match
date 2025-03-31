import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Upload image endpoint
router.post('/', protect, upload.single('image'), async (req, res): Promise<void> => {
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
  });
  
export default router;
