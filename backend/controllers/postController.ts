import { Request, Response } from 'express';
import Post from '../models/Post';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, image } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newPost = await Post.create({
      username: req.user._id,
      text,
      image,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().populate('username', 'username').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
  
      const posts = await Post.find({ username: req.user._id })
        .sort({ createdAt: -1 });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching my posts:', error);
      console.error('❌ Error fetching user posts:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const getPostsByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
  
      const posts = await Post.find({ username: userId })
        .sort({ createdAt: -1 });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('❌ Error fetching user posts:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  