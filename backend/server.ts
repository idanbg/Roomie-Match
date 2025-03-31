import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Roomie Match API is live!');
});

console.log('🔍 MONGO_URI:', process.env.MONGO_URI);

connectDB()
  .then(() => {
    app.listen(Number(PORT), () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
