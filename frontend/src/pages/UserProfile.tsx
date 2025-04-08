import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";
import EditProfileForm from "../components/EditProfileForm";

type User = {
  id: string;
  username: string;
  profileImage?: string;
  email: string;
  bio?: string;
  createdAt: string;
};

type Post = {
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

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const userRes = await api.get(`/users/${userId}`);
      setUser(userRes.data);

      const postsRes = await api.get(`/posts/user/${userId}`);
      setPosts(postsRes.data);
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) return <p className="text-center">Loading profile...</p>;
  if (!user) return <p className="text-center text-danger">User not found</p>;
  console.log("user object:", user);
  console.log("currentUser.id:", currentUser?.id);
  console.log("user._id:", user?.id);
  console.log("Profile Image URL:", user.profileImage);


  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        {user.profileImage && (
          <img
            src={`http://localhost:3000${user.profileImage}`}
            alt={user.username}
            className="rounded-circle mb-2"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        )}
        <h3>{user.username}</h3>
        <p className="text-muted">{user.email}</p>
        <small className="text-secondary">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </small>
        {user.bio && (
          <div className="mt-3">
            <h5>Bio:</h5>
            <p>{user.bio}</p>
          </div>
        )}
        

        {currentUser?.id === user.id && !editing && (
          <button className="btn btn-primary mt-2" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}

        {editing && (
          <EditProfileForm
            currentData={user}
            onCancel={() => setEditing(false)}
            onUpdated={async () => {
              await fetchUserProfile();
              setEditing(false);
            }}
          />
        )}
      </div>

      <h5 className="mb-3 text-center">Posts by {user.username}</h5>
      {posts.length === 0 ? (
        <p className="text-center">This user has no posts yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
};

export default UserProfile;
