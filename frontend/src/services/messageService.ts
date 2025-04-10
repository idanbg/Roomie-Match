import api from "./api";

export const sendMessage = async (receiverId: string, text: string, image?: string) => {
  return await api.post("/messages", { receiverId, text, image });
};

export const getConversation = async (otherUserId: string) => {
  return await api.get(`/messages/${otherUserId}`);
};

export const getChatUsers = async () => {
  return await api.get("/messages");
};
