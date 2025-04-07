import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";

type User = {
  _id: string;
  username: string;
  profileImage?: string;
  email: string;
  bio?: string;
};

type Post = {
  _id: string;
  text: string;
  image?: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  username: User;
};

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        {user.profileImage && (
          <img
            src={`http://localhost:3000${user.profileImage}`}
            alt={user.username}
            className="rounded-circle mb-2"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        )}
        <h3>{user.username}</h3>
        <p className="text-muted">{user.email}</p>

        {user.bio && (
          <div className="mt-3">
            <h5>Bio:</h5>
            <p>{user.bio}</p>
          </div>
        )}
      </div>

      <h5 className="mb-3">Posts by {user.username}</h5>
      {posts.length === 0 ? (
        <p>This user has no posts yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
};

export default UserProfile;
