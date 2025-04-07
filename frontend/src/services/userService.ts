import api from "./api"; 

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;  
};
