import { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import NewPostForm from "../components/NewPostForm";

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

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container mt-4">
      {/* Greeting section */}
      <div className="mb-4 text-center">
        <h2>Welcome to Roomie Match 🏡</h2>
        <p className="text-muted">
          Explore posts from other users and find your perfect roommate!
        </p>
      </div>

      {/* New post form */}
      <NewPostForm onPostCreated={fetchPosts} />

      {/* Posts section */}
      <div>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
