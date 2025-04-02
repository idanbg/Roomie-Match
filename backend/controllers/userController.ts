import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

/**
 * Generate JWT access token
 */
const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

/**
 * Generate JWT refresh token
 */
const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
/**
 * Register a new user
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      username,
      email,
      password: hashedPassword,
      refreshTokens: [],
    });

    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = generateRefreshToken(newUser._id.toString());

    newUser.refreshTokens.push(refreshToken); // 🆕 Save refresh token to DB
    await newUser.save(); // 🆕 Save user after adding refresh token

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login user and return tokens
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshTokens.push(refreshToken); // 🆕 Add new refresh token to DB
    await user.save(); // 🆕 Save changes

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get user profile
 */
interface AuthRequest extends Request {
  user?: IUser;
}

export const getUserProfile = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
  }

  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    profileImage: req.user.profileImage,
    createdAt: req.user.createdAt,
  });
};

export const updateUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { username, profileImage, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (username) user.username = username;
    if (profileImage) user.profileImage = profileImage;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfileById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Name query parameter is required" });
      return;
    }

    const users = await User.find({
      username: { $regex: name, $options: "i" },
    }).select("username profileImage _id");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      res.status(401).json({ message: 'Refresh token is required' });
      return;
    }

    // Step 1: Verify refresh token
    jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET as string, async (err, decoded) => {
      if (err || typeof decoded !== 'object' || !decoded?.id) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
      }

      const user = await User.findById(decoded.id);

      // Step 2: Check if refreshToken is in user's tokens list
      if (!user || !user.refreshTokens.includes(oldRefreshToken)) {
        res.status(403).json({ message: 'Refresh token not recognized' });
        return;
      }

      // Step 3: Generate new access token
      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());

      // Step 4: Update user's refresh tokens
      user.refreshTokens = user.refreshTokens.filter(token => token !== oldRefreshToken); // Remove old refresh token
      user.refreshTokens.push(refreshToken); // Add new refresh token
      await user.save(); // Save updated user
    

      res.status(200).json({ accessToken, refreshToken });
    });
  } catch (error) {
    console.error('❌ Error refreshing access token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove the token from user's refreshTokens array
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
