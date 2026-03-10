import pool from './db';

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                referral_code TEXT UNIQUE,
                referral_points INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS addresses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                full_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                house_number TEXT NOT NULL,
                street TEXT NOT NULL,
                area TEXT NOT NULL,
                city TEXT NOT NULL,
                pin_code TEXT NOT NULL,
                instructions TEXT
            );

            CREATE TABLE IF NOT EXISTS subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                plan_type TEXT NOT NULL,
                price DECIMAL NOT NULL,
                status TEXT DEFAULT 'active',
                delivery_days TEXT NOT NULL,
                custom_schedule JSONB,
                start_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS add_ons (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                price DECIMAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS subscription_add_ons (
                id SERIAL PRIMARY KEY,
                subscription_id INTEGER REFERENCES subscriptions(id),
                add_on_id INTEGER REFERENCES add_ons(id),
                one_off_date DATE
            );

            CREATE TABLE IF NOT EXISTS deliveries (
                id SERIAL PRIMARY KEY,
                subscription_id INTEGER REFERENCES subscriptions(id),
                delivery_date DATE NOT NULL,
                status TEXT DEFAULT 'pending'
            );

            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                welcome_email_sent BOOLEAN DEFAULT FALSE,
                status TEXT DEFAULT 'active'
            );
        `);

        // Insert initial add_ons if table is empty
        const addOnsCount = await pool.query('SELECT COUNT(*) FROM add_ons');
        if (parseInt(addOnsCount.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO add_ons (name, price) VALUES
                ('Flower Mala', 30),
                ('Lotus', 15),
                ('Extra Flowers', 40),
                ('Agarbatti', 70),
                ('Camphor', 60),
                ('Cotton Batti', 45);
            `);
        }

        console.log('Database initialized successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database', err);
        process.exit(1);
    }
};

initDb();
