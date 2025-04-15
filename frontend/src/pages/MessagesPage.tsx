import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/MessagesPage.css";
import { motion } from "framer-motion";

type ChatUser = {
  id: string;
  username: string;
  profileImage?: string;
};

const MessagesPage = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/messages");
        setChatUsers(res.data);
      } catch (err) {
        console.error("Failed to load chat users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mt-4">
        <div className="messages-container">
          <h3 className="messages-title text-center">Your Conversations</h3>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : chatUsers.length === 0 ? (
            <p className="text-center">No messages yet</p>
          ) : (
            chatUsers.map((chatUser) => (
              <Link
                to={`/messages/${chatUser.id}`}
                key={chatUser.id}
                className="chat-user-box"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${
                    chatUser.profileImage || ""
                  }`}
                  alt={chatUser.username}
                  className="chat-user-img"
                />

                <span className="chat-user-name">{chatUser.username}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesPage;
