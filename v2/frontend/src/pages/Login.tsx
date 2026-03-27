import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import SiteStatusModal from '../components/SiteStatusModal';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState<'coming_soon' | 'maintenance' | 'none'>('none');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt started for:', formData.email);
        try {
            const res = await api.post('/auth/login', formData);
            console.log('Login response received:', res.data);

            const userRole = res.data.user?.role;
            const isRestricted = (res.data.coming_soon || res.data.maintenance) && userRole !== 'admin';
            console.log('Restriction check:', { isRestricted, userRole });

            if (isRestricted) {
                console.log('Showing restricted mode modal for non-admin user');
                setStatus(res.data.coming_soon ? 'coming_soon' : 'maintenance');
                setShowModal(true);
                return;
            }

            console.log('Login successful, saving session...');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect based on role
            if (userRole === 'admin') {
                console.log('Redirecting to Admin Panel');
                navigate('/admin');
            } else {
                console.log('Redirecting to:', from);
                navigate(from);
            }
        } catch (err: any) {
            console.error('Frontend Login Error:', err);
            const backendMsg = err.response?.data?.message || err.response?.data?.error;
            alert(backendMsg || err.message || 'An unexpected error occurred during login.');
        }
    };

    return (
        <div className="full-center section-beige">
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginTop: '1.5rem' }}>
                    <div>
                        <label className="form-label">Email</label>
                        <input type="email" placeholder="Email Address" required className="form-input" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input type="password" placeholder="Password" required className="form-input" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>Login</button>
                </form>
                <p style={{ marginTop: '1rem' }}>Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Register</Link></p>
            </div>
            <SiteStatusModal isOpen={showModal} onClose={() => setShowModal(false)} status={status} />
        </div>
    );
};

export default Login;
