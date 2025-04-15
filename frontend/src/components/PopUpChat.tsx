import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/PopUpChat.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Message = {
  _id: string;
  sender: { _id: string; username: string; profileImage?: string };
  receiver: { _id: string; username: string; profileImage?: string };
  text: string;
  createdAt: string;
};

type Props = {
  receiverId: string;
  receiverInfo: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  onClose: () => void;
};

const PopUpChat = ({ receiverId, receiverInfo, onClose }: Props) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchConversation = async () => {
    try {
      const res = await api.get(`/messages/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post("/messages", {
        receiverId,
        text: newMessage,
      });
      setNewMessage("");
      fetchConversation();
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [receiverId]);

  // Detect click outside the popup box
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose(); // close the popup
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div
        className="popup-chat-box"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        ref={popupRef}
      >
        <div className="popup-header">
          <h5>Chat</h5>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="popup-messages">
          {messages.map((msg) => {
            const isSender = msg.sender._id === user?.id;
            const displayUser = isSender ? msg.sender : receiverInfo;

            return (
              <div
                className={`popup-message ${isSender ? "sent" : "received"}`}
                key={msg._id}
              >
                <Link to={`/users/${displayUser._id}`}>
                  <img
                    src={displayUser.profileImage || ""}
                    className="popup-img"
                  />
                </Link>
                <div>
                  <span className="popup-name">{displayUser.username}</span>
                  <p>{msg.text}</p>
                  <span className="popup-time">
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

        <div className="popup-input-box">
          <input
            type="text"
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="edit-btn" onClick={handleSend}>Send</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PopUpChat;
