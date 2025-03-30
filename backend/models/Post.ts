import mongoose, { Document, Schema, Types, Model } from 'mongoose';

export interface IPost extends Document {
  username: Types.ObjectId;
  text: string;
  image?: string;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const postSchema: Schema<IPost> = new Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);
export default Post;
