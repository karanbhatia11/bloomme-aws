import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Address = () => {
    const [formData, setFormData] = useState({
        fullName: '', phone: '', houseNumber: '', street: '', area: '', city: 'Faridabad', pinCode: '', instructions: ''
    });
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('addressData', JSON.stringify(formData));
        navigate('/addons');
    };

    return (
        <div className="section section-beige" style={{ minHeight: '100vh' }}>
            <h1>Delivery Address</h1>
            <form className="card address-form" onSubmit={handleSubmit} style={{ padding: '2rem', marginTop: '2rem' }}>
                <div className="address-form-full">
                    <label className="form-label">Full Name</label>
                    <input type="text" required className="form-input" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                    <label className="form-label">Phone</label>
                    <input type="tel" required className="form-input" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                    <label className="form-label">Pin Code</label>
                    <input type="text" required className="form-input" onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} />
                </div>
                <div>
                    <label className="form-label">House Number</label>
                    <input type="text" required className="form-input" onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })} />
                </div>
                <div>
                    <label className="form-label">Street</label>
                    <input type="text" required className="form-input" onChange={(e) => setFormData({ ...formData, street: e.target.value })} />
                </div>
                <div>
                    <label className="form-label">Area</label>
                    <select required className="form-input" onChange={(e) => setFormData({ ...formData, area: e.target.value })}>
                        <option value="">Select Area</option>
                        <option value="NIT 1">NIT 1</option>
                        <option value="NIT 2">NIT 2</option>
                        <option value="NIT 3">NIT 3</option>
                        <option value="NIT 5">NIT 5</option>
                    </select>
                </div>
                <div>
                    <label className="form-label">City</label>
                    <input type="text" disabled value="Faridabad" className="form-input" style={{ opacity: 0.6 }} />
                </div>
                <div className="address-form-full">
                    <label className="form-label">Delivery Instructions (Optional)</label>
                    <textarea className="form-input" rows={3} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}></textarea>
                </div>
                <button type="submit" className="btn btn-gold address-form-full" style={{ marginTop: '1rem' }}>Next: Add-ons</button>
            </form>
        </div>
    );
};

export default Address;
