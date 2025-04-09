import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const analyzeIdealRoommate = async (req: Request, res: Response): Promise<void> => {
  const { bio } = req.body;

  if (!bio) {
    res.status(400).json({ message: "Bio is required" });
    return;
  }

  try {

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
                text: `The following is a personal bio of someone looking for a roommate: "${bio}". 
                Based on this information, clearly and concisely describe what type of roommate would be a good match for this person. 
                Focus on personality traits, lifestyle compatibility, and shared interests. 
                Provide your answer as a short and friendly paragraph that sounds natural and helpful.`
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const text = response.text();

    console.log("✅ AI Response:", text);

    res.json({ recommendation: text });
  } catch (error) {
    console.error("❌ Gemini AI error:", error?.response?.data || error.message || error);
    res.status(500).json({ message: "Failed to analyze bio using Gemini" });
  }
};
