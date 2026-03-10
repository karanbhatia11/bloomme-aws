import express from 'express';
import pool from '../db';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/config/add-ons', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM add_ons');
        res.json(result.rows);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/address', authenticateToken as any, async (req, res) => {
    try {
        const { full_name, phone, house_number, street, area, city, pin_code, instructions } = req.body;
        const user_id = (req as any).user.id;
        const result = await pool.query(
            'INSERT INTO addresses (user_id, full_name, phone, house_number, street, area, city, pin_code, instructions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [user_id, full_name, phone, house_number, street, area, city, pin_code, instructions]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/admin/dashboard', authenticateToken as any, authorizeAdmin as any, async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan_type = 'BASIC') as basic_deliveries,
                (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan_type = 'PREMIUM') as premium_deliveries,
                (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan_type = 'ELITE') as elite_deliveries,
                (SELECT COUNT(*) FROM users WHERE role = 'user') as total_customers
        `);
        res.json(stats.rows[0]);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
