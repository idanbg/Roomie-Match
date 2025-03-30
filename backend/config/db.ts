import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ MongoDB connected successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ MongoDB connection error:', error.message);
    } else {
      console.error('❌ MongoDB connection error:', error);
    }
    throw error;
  }
};

export default connectDB;
