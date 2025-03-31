import express from "express";
import { registerUser, loginUser, getUserProfile,updateUserProfile,getUserProfileById } from '../controllers/userController';
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.get('/:userId', getUserProfileById);


export default router;
