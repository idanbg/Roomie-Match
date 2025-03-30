import mongoose, { Document, Schema, Types, Model } from 'mongoose';

export interface IComment extends Document {
  post: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const commentSchema: Schema<IComment> = new Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
