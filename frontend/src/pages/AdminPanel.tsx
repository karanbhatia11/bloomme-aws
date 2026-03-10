import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminPanel = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/user/admin/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch admin stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-layout">
            <h1>Admin Dashboard (Internal)</h1>

            <div className="admin-stats-grid" style={{ marginTop: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h3>Total Customers</h3>
                    <div style={{ fontSize: '3rem', color: 'var(--primary-green)' }}>{stats?.total_customers || 0}</div>
                </div>
                <div className="card" style={{ padding: '2rem' }}>
                    <h3>Basic Deliveries</h3>
                    <div style={{ fontSize: '3rem' }}>{stats?.basic_deliveries || 0}</div>
                </div>
                <div className="card" style={{ padding: '2rem' }}>
                    <h3>Premium Deliveries</h3>
                    <div style={{ fontSize: '3rem' }}>{stats?.premium_deliveries || 0}</div>
                </div>
                <div className="card" style={{ padding: '2rem', border: '2px solid var(--light-gold)' }}>
                    <h3>Elite Deliveries</h3>
                    <div style={{ fontSize: '3rem' }}>{stats?.elite_deliveries || 0}</div>
                </div>
            </div>

            <section className="card" style={{ marginTop: '3rem', textAlign: 'left', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Monday Dashboard</h2>
                <div className="admin-monday-grid">
                    <div>
                        <strong>Basic Plan</strong>
                        <p>{stats?.basic_deliveries || 0}</p>
                    </div>
                    <div>
                        <strong>Premium Plan</strong>
                        <p>{stats?.premium_deliveries || 0}</p>
                    </div>
                    <div>
                        <strong>Elite Plan</strong>
                        <p>{stats?.elite_deliveries || 0}</p>
                    </div>
                    <div style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>
                        <strong>Total Deliveries</strong>
                        <p>{(parseInt(stats?.basic_deliveries) || 0) + (parseInt(stats?.premium_deliveries) || 0) + (parseInt(stats?.elite_deliveries) || 0)}</p>
                    </div>
                </div>

                <h3 style={{ marginTop: '2rem' }}>Flower Requirements (Est.)</h3>
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                    <li>Standard Flowers: {((parseInt(stats?.basic_deliveries) || 0) * 80 + (parseInt(stats?.premium_deliveries) || 0) * 150) / 1000} kg</li>
                    <li>Premium Exotic: {((parseInt(stats?.elite_deliveries) || 0) * 200) / 1000} kg</li>
                </ul>
            </section>
        </div>
    );
};

export default AdminPanel;
