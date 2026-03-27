import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Use authService which now includes email trigger
            const response = await authService.signup({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            if (!response.success) {
                const backendMsg = response.error?.message || 'Error signing up. Please try again.';
                alert(backendMsg);
                return;
            }

            // Success - user is now logged in and welcome email is being sent
            // Also store in localStorage for backward compatibility
            if (response.data?.token && response.data?.user) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            // Navigate to plans page
            navigate('/plans');
        } catch (err: any) {
            console.error('Frontend Signup Error:', err);
            alert(err.message || 'Error signing up. Please try again.');
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
        </div>
    );
};

export default Signup;
