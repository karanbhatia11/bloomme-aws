import { Link } from 'react-router-dom';
import { Flower2 } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ padding: '2rem', background: 'var(--soft-beige)', borderRadius: '50%', marginBottom: '2rem' }}>
                <Flower2 size={80} color="var(--primary-green)" />
            </div>
            <h1 style={{ color: 'var(--primary-green)' }}>Welcome to Bloomme</h1>
            <p style={{ fontSize: '1.5rem', maxWidth: '600px' }}>
                Your flower subscription has been confirmed.<br />
                Your first delivery will arrive soon.
            </p>
            <Link to="/dashboard" className="btn" style={{ marginTop: '2rem' }}>Go to My Dashboard</Link>
        </div>
    );
};

export default OrderSuccess;
