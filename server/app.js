import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import transactionRouter from './routes/transactionRoute.js';
import reportRouter from './routes/reportRoute.js';
dotenv.config();

const app = express();

app.use(express.json());

// Restrict CORS to the React dev server (or production origin)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Server is accepting requests.' });
});

app.use('/api/auth',        authRouter);
app.use('/api/category',    categoryRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/reports',     reportRouter);

export default app;
