import { Request, Response } from 'express';
import Comment, { IComment } from '../models/Comment';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newComment: IComment = await Comment.create({
      post: postId,
      user: req.user._id,
      text,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('❌ Error creating comment:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommentsForPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error('❌ Error fetching comments:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { commentId } = req.params;
  
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
  
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }
  
      if (comment.user.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'You are not allowed to delete this comment' });
        return;
      }
  
      await comment.deleteOne();
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('❌ Error deleting comment:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  