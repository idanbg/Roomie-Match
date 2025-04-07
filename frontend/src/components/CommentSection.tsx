import { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../services/commentService";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="mt-3">
      <h6>Comments</h6>
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button className="btn btn-primary mt-1" onClick={handleAddComment}>
          Post
        </button>
      </div>
      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{comment.user.username}:</strong> {comment.text}
              <br />
              <small className="text-muted">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
            {user?.id === comment.user._id && (
              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(comment._id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;