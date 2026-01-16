import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5050;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Task Manager API is running 🚀");
});

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

export default app;

