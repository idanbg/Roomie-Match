import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ChatPage.css";
import { motion } from "framer-motion";

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  receiver: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  text: string;
  createdAt: string;
}

const ChatPage = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${userId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await api.post("/messages", {
        receiverId: userId,
        text: newMessage,
      });
      setNewMessage("");

      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mt-4">
        <div className="chat-box">
          <h3 className="messages-title text-center">Conversation</h3>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => {
                const isSender = msg.sender._id === user?.id;

                return (
                  <div
                    key={msg._id}
                    className={`message-row ${isSender ? "sent" : "received"}`}
                  >
                    <Link to={`/users/${msg.sender._id}`}>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          msg.sender.profileImage || ""
                        }`}
                        alt={msg.sender.username}
                        className="chat-user-img"
                      />
                    </Link>

                    <div className="message-bubble">
                      <Link
                        to={`/users/${msg.sender._id}`}
                        className="chat-user-name"
                      >
                        {msg.sender.username}
                      </Link>
                      <p className="chat-text">{msg.text}</p>
                      <span className="chat-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="chat-input-box">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="chat-input"
              placeholder="Type your message..."
            />
            <button className="edit-btn" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPage;
