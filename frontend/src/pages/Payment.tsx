import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Payment = () => {
    const [method, setMethod] = useState('UPI');
    const navigate = useNavigate();

    const plan = JSON.parse(localStorage.getItem('selectedPlan') || '{}');
    const subData = JSON.parse(localStorage.getItem('subscriptionData') || '{}');
    const addressData = JSON.parse(localStorage.getItem('addressData') || '{}');
    const selectedAddons = JSON.parse(localStorage.getItem('selectedAddons') || '[]');

    const handleConfirm = async () => {
        try {
            // 1. Save Address
            await api.post('/user/address', {
                full_name: addressData.fullName,
                phone: addressData.phone,
                house_number: addressData.houseNumber,
                street: addressData.street,
                area: addressData.area,
                city: addressData.city,
                pin_code: addressData.pinCode,
                instructions: addressData.instructions
            });

            // 2. Create Subscription (with selected add-ons)
            await api.post('/subs/subscribe', {
                plan_type: plan.type,
                price: subData.finalPrice,
                delivery_days: subData.schedule,
                custom_schedule: subData.customDays,
                add_on_ids: selectedAddons
            });

            // 3. Clear local storage except auth
            localStorage.removeItem('selectedPlan');
            localStorage.removeItem('subscriptionData');
            localStorage.removeItem('addressData');
            localStorage.removeItem('selectedAddons');

            navigate('/success');
        } catch (err) {
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div className="section section-beige" style={{ minHeight: '100vh' }}>
            <h1>Payment</h1>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
                <h3>Summary</h3>
                <p>Plan: <strong>{plan.type}</strong></p>
                <div style={{ padding: '1rem', background: 'var(--white)', borderRadius: '10px', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Subscription</span>
                        <span>₹{subData.finalPrice}</span>
                    </div>
                </div>

                <h3>Available Payment Options</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                    {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(m => (
                        <label key={m} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', background: method === m ? 'var(--soft-beige)' : 'white' }}>
                            <input type="radio" value={m} checked={method === m} onChange={() => setMethod(m)} />
                            <span style={{ marginLeft: '10px' }}>{m}</span>
                        </label>
                    ))}
                </div>

                <button onClick={handleConfirm} className="btn" style={{ width: '100%', marginTop: '2rem', height: '50px', fontSize: '1.2rem' }}>
                    Confirm Subscription
                </button>
            </div>
        </div>
    );
};

export default Payment;
