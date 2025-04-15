import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";
import { getRoommateMatch } from "../services/aiService";
import EditProfileForm from "../components/EditProfileForm";
import "../styles/UserProfile.css";
import { motion } from "framer-motion";

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
  const [suggestedMatch, setSuggestedMatch] = useState("");

  const handleGetMatch = async () => {
    setLoading(true);
    try {
      const result = await getRoommateMatch(user?.bio || "");
      setSuggestedMatch(result);
    } catch {
      setSuggestedMatch("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

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
  console.log("🖼️ Full image path:", `${import.meta.env.VITE_API_URL}${user.profileImage}`);

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mt-4">
        <div className="profile-container">
          
          {user.profileImage && (
            
            <img
              src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
              alt={user.username}
              className="profile-image"
            />
          )}

          <h3 className="profile-username">{user.username}</h3>
          <p className="profile-email">{user.email}</p>
          <small className="profile-date">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </small>

          <p className="profile-bio">
            {user.bio && user.bio.trim() !== ""
              ? user.bio
              : "No bio yet... Feel free to add one!"}
          </p>

          {currentUser?.id === user.id && !editing && (
            <button className="edit-btn" onClick={() => setEditing(true)}>
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
        {/* AI Recommendation Section */}
        {currentUser?.id === user.id && (
          <div className="ai-section section-block">
            <h4 className="ai-title">AI Roommate Recommendation</h4>

            <p className="ai-description">
              Want to know what kind of roommate would suit you best based on
              your bio? Let our AI analyze and suggest your ideal match!
            </p>

            <button className="ai-btn" onClick={handleGetMatch}>
              Find my ideal roommate
            </button>

            {loading ? (
              <p className="loading-text">Loading recommendation...</p>
            ) : (
              suggestedMatch && (
                <div className="ai-recommendation-box">
                  <h5 className="ai-result-title">
                    Here's your ideal roommate:
                  </h5>
                  <p>{suggestedMatch}</p>
                </div>
              )
            )}
          </div>
        )}
        <h5
          className="profile-posts-title text-center"
          style={{ marginTop: "3rem" }}
        >
          Posts by {user.username}
        </h5>
        {posts.length === 0 ? (
          <p className="text-center">This user has no posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
