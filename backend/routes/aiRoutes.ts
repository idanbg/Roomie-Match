import express from "express";
import { analyzeIdealRoommate } from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/match", protect, analyzeIdealRoommate);

export default router;
