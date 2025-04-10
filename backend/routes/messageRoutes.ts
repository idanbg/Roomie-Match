import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  sendMessage,
  getConversation,
  getChatUsers,
} from "../controllers/messageController";

const router = express.Router();

router.post("/", protect, sendMessage);

router.get("/:userId", protect, getConversation);

router.get("/", protect, getChatUsers);

export default router;
