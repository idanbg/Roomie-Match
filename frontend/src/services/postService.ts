import api from "./api";

export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export const createPost = async (postData: FormData) => {
  const response = await api.post("/posts", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const likePost = async (postId: string) => {
    console.log("Sending like for:", postId);
    const res = await api.put(`/posts/${postId}/like`);
    console.log("Like result:", res.data);
  };
  

export const unlikePost = async (postId: string) => {
  await api.put(`/posts/${postId}/unlike`);
};

export const deletePost = async (postId: string) => {
  await api.delete(`/posts/${postId}`);
};
