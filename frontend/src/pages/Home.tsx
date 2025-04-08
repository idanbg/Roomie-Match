import { useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import NewPostForm from "../components/NewPostForm";
import "../../styles/Home.css"; // Adjust the path as necessary

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
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.text.toLowerCase().includes(query) ||
      post.username.username.toLowerCase().includes(query)
    );
  });

  return (
    <div className="home-container">
      {/* Greeting section */}
      <div className="greeting">
        <h2>Welcome to Roomie Match 🏡</h2>
        <p className="greeting-sub">Explore posts and find your perfect roommate!</p>
      </div>

      {/* Search input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search posts or users..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* New post form */}
      <NewPostForm onPostCreated={fetchPosts} />

      {/* Posts section */}
      <div className="posts-section">
        {loading ? (
          <p className="loading-text">Loading posts...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="no-posts-text">No posts match your search.</p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
