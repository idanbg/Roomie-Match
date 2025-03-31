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

export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate('username', 'username profileImage')
      .sort({ createdAt: -1 })
      .lean();

    const response = posts.map((post) => {
      const likedByMe = req.user ? post.likes.some((id) => id.toString() === req.user!._id.toString()) : false;
      return {
        ...post,
        likesCount: post.likes.length,
        likedByMe,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const posts = await Post.find({ username: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const response = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
      likedByMe: post.likes.some((id) => id.toString() === req.user!._id.toString()),
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching my posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPostsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ username: userId })
      .sort({ createdAt: -1 })
      .lean();

    const response = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.username.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'You are not allowed to delete this post' });
      return;
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.likes.includes(req.user._id)) {
      res.status(400).json({ message: 'Post already liked' });
      return;
    }

    post.likes.push(req.user._id);
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    post.likes = post.likes.filter((userId) => userId.toString() !== req.user!._id.toString());
    await post.save();

    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
