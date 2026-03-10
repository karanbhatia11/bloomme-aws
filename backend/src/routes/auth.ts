import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bloom_secret_key';

router.post('/signup', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        // Input validation
        if (!name || !phone || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'Phone must be a valid 10-digit number.' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const referralCode = `BLOOM${Math.floor(1000 + Math.random() * 9000)}`;

        const newUser = await pool.query(
            'INSERT INTO users (name, phone, email, password, referral_code) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, referral_code, referral_points',
            [name, phone, email, hashedPassword, referralCode]
        );

        const token = jwt.sign({ id: newUser.rows[0].id, email: newUser.rows[0].email, role: newUser.rows[0].role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: newUser.rows[0] });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role }, JWT_SECRET, { expiresIn: '1d' });
        const { id, name, email: userEmail, role, referral_code, referral_points } = user.rows[0];
        res.json({ token, user: { id, name, email: userEmail, role, referral_code, referral_points } });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
