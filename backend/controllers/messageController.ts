import {  Response } from "express";
import { Message } from "../models/Message";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/authMiddleware"; 


export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  const { receiverId, text, image } = req.body;
  const senderId = req.user?._id;

  if (!receiverId || !text) {
    res.status(400).json({ message: "Receiver and text are required" });
    return;
  }

  try {
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      image: image || undefined,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const getConversation = async (req:AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  const { userId: otherUserId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username profileImage")
      .populate("receiver", "username profileImage");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
};

export const getChatUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = new Types.ObjectId(req.user?._id);

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId },
          ],
        },
      },
      {
        $project: {
          user: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          id: "$userInfo._id",
          username: "$userInfo.username",
          profileImage: "$userInfo.profileImage",
        },
      },
    ]);

    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ message: "Failed to fetch chat users" });
  }
};
