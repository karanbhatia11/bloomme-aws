import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            alert('Invalid credentials.');
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
        </div>
    );
};

export default Login;
