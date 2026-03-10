import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import authRoutes from './routes/auth';
import subRoutes from './routes/subscriptions';
import userRoutes from './routes/user';
import newsletterRoutes from './routes/newsletter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subs', subRoutes);
app.use('/api/user', userRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('BLOOMME Backend is running!');
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Ready to bloom' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
