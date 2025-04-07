import api from "./api";

export const getComments = async (postId: string) => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

export const addComment = async (postId: string, text: string) => {
  const response = await api.post(`/comments/${postId}`, { text });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  await api.delete(`/comments/${commentId}`);
};
