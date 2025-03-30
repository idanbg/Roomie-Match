import mongoose, { Document, Schema, Types, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  likedPosts: Types.ObjectId[];
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
