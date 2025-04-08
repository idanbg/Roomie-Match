import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { likePost, unlikePost, deletePost } from "../services/postService";
import { useState } from "react";
import { AxiosError } from "axios";
import CommentSection from "./CommentSection";
import "../styles/PostCard.css"; // Adjust the path as necessary

type PostCardProps = {
  post: {
    _id: string;
    text: string;
    image?: string;
    createdAt: string;
    likesCount: number;
    likedByMe: boolean;
    username: {
      _id: string;
      username: string;
      profileImage?: string;
    };
  };
  onDelete?: () => void;
};

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await unlikePost(post._id);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePost(post._id);
        setLikesCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message === "Post already liked") {
        console.warn("Post already liked.");
      } else {
        console.error("Error updating like:", axiosError);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/users/${post.username._id}`} className="user-info">
          {post.username.profileImage && (
            <img
              src={`http://localhost:3000${post.username.profileImage}`}
              alt={post.username.username}
              className="avatar"
            />
          )}
          <h5 className="username">{post.username.username}</h5>
        </Link>

        {user && user.id === post.username._id && (
          <button className="delete-btn" onClick={handleDelete}>
            🗑️ Delete
          </button>
        )}
      </div>

      <p className="post-text">{post.text}</p>

      {post.image && (
        <img
          src={`http://localhost:3000${post.image}`}
          alt="Post"
          className="post-image"
        />
      )}

      <div className="post-actions">
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={handleLikeToggle}
        >
          {liked ? "❤️ Unlike" : "🤍 Like"}
        </button>
        <span className="likes-count">{likesCount} likes</span>
      </div>

      <small className="post-date">
        {new Date(post.createdAt).toLocaleString()}
      </small>

      <hr className="divider" />
      <CommentSection postId={post._id} />
    </div>
  );
};

export default PostCard;
