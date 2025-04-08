import api from "./api"; 

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;  
};

export const updateUserProfile = async (userId: string, userData: FormData) => {
  const response = await api.put(`/users/${userId}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}