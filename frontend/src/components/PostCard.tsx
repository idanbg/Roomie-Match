import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { likePost, unlikePost, deletePost } from "../services/postService";
import { useState } from "react";
import { AxiosError } from "axios";
import CommentSection from "./CommentSection";

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
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <Link to={`/users/${post.username._id}`}>
              {post.username.username}
            </Link>
          </h5>

          {user && user.id === post.username._id && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
            >
              Delete 🗑️
            </button>
          )}
        </div>

        <p className="mt-2">{post.text}</p>

        {post.image && (
          <img
            src={`http://localhost:3000${post.image}`}
            alt="Post"
            className="img-fluid rounded mb-2"
          />
        )}

        <div className="d-flex align-items-center justify-content-between mt-2">
          <div>
            <button
              className={`btn btn-sm ${liked ? "btn-danger" : "btn-outline-danger"} me-2`}
              onClick={handleLikeToggle}
            >
              {liked ? "Unlike ❤️" : "Like 🤍"}
            </button>
            <span>{likesCount} likes</span>
          </div>
        </div>

        <small className="text-muted d-block mt-2">
          {new Date(post.createdAt).toLocaleString()}
        </small>

        <hr />
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
};

export default PostCard;
