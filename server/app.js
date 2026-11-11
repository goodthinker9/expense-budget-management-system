import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter        from './routes/authRoute.js';
import categoryRouter    from './routes/categoryRoute.js';
import transactionRouter from './routes/transactionRoute.js';
import reportRouter      from './routes/reportRoute.js';
import budgetRouter      from './routes/budgetRoute.js';
import errorHandler      from './middleware/errorHandler.js';
dotenv.config();

const app = express();

app.use(express.json());

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
app.use('/api/budget',      budgetRouter);

// Central error handler — must be last
app.use(errorHandler);

export default app;
