import api from "./api";

export const getRoommateMatch = async (bio: string): Promise<string> => {
  const response = await api.post("/ai/match", { bio });
  return response.data.recommendation;
};
