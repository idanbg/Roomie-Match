import { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../services/commentService";
import { useAuth } from "../contexts/AuthContext";
import "../styles/CommentSection.css"; // Adjust the path as necessary

type Comment = {
  _id: string;
  text: string;
  createdAt: string;
  user: {
    _id: string;
    username: string;
  };
};

const CommentSection = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(postId, newComment);
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="comment-section">
      <h6 className="comment-title">Comments</h6>

      <div className="comment-form">
        <input
          type="text"
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button className="comment-submit" onClick={handleAddComment}>
          Post
        </button>
      </div>

      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment._id} className="comment-item">
            <div className="comment-content">
              <strong className="comment-author">{comment.user.username}:</strong> {comment.text}
              <br />
              <small className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>

            {user?.id === comment.user._id && (
              <button
                className="comment-delete"
                onClick={() => handleDeleteComment(comment._id)}
              >
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
