import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import SiteStatusModal from '../components/SiteStatusModal';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
    const [status, setStatus] = useState<'coming_soon' | 'maintenance' | 'none'>('none');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/signup', formData);

            if (res.data.coming_soon || res.data.maintenance) {
                setStatus(res.data.coming_soon ? 'coming_soon' : 'maintenance');
                setShowModal(true);
                return;
            }

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/plans');
        } catch (err: any) {
            console.error('Frontend Signup Error:', err);
            const backendMsg = err?.response?.data?.error || err?.response?.data?.message;
            alert(backendMsg || err.message || 'Error signing up. Please try again.');
        }
    };

    return (
        <div className="full-center section-beige">
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginTop: '1.5rem' }}>
                    <div>
                        <label className="form-label">Name</label>
                        <input type="text" placeholder="Full Name" required className="form-input" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="form-label">Phone</label>
                        <input type="tel" placeholder="Phone Number" required className="form-input" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="form-label">Email</label>
                        <input type="email" placeholder="Email Address" required className="form-input" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input type="password" placeholder="Password" required className="form-input" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>Signup</button>
                </form>
                <p style={{ marginTop: '1rem' }}>Already have an account? <Link to="/login" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Login</Link></p>
            </div>
            <SiteStatusModal isOpen={showModal} onClose={() => setShowModal(false)} status={status} />
        </div>
    );
};

export default Signup;
