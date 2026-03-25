import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface AddOn {
    id: number;
    name: string;
    price: number;
}

const Payment = () => {
    const [method, setMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [addOnsList, setAddOnsList] = useState<AddOn[]>([]);

    const planData = JSON.parse(localStorage.getItem('selectedPlan') || '{}');
    const selectedDates = JSON.parse(localStorage.getItem('selectedDates') || '[]');
    const selectedAddonsData = JSON.parse(localStorage.getItem('selectedAddons') || '{}');

    useEffect(() => {
        api.get('/user/config/add-ons')
            .then(res => setAddOnsList(res.data))
            .catch(() => {
                setAddOnsList([
                    { id: 1, name: 'Flower Mala', price: 30 },
                    { id: 2, name: 'Lotus', price: 15 },
                    { id: 3, name: 'Extra Flowers', price: 40 },
                    { id: 4, name: 'Agarbatti', price: 70 },
                    { id: 5, name: 'Camphor', price: 60 },
                    { id: 6, name: 'Cotton Batti', price: 45 },
                ]);
            });
    }, []);

    const addonsTotal = Object.keys(selectedAddonsData).reduce((sum, addonIdStr) => {
        const addon = addOnsList.find(a => a.id === parseInt(addonIdStr));
        return sum + (addon ? addon.price * (selectedAddonsData[parseInt(addonIdStr)]?.length || 0) : 0);
    }, 0);

    const totalPrice = planData.price + addonsTotal;

    const handleConfirm = async () => {
        try {
            setLoading(true);

            const selectedAddonIds = Object.keys(selectedAddonsData).map(Number);

            // Create Subscription (with selected add-ons)
            await api.post('/subs/subscribe', {
                plan_type: planData.type,
                price: planData.price,
                delivery_days: selectedDates.length,
                custom_schedule: selectedDates,
                add_on_ids: selectedAddonIds
            });

            // Clear local storage
            localStorage.removeItem('selectedPlan');
            localStorage.removeItem('selectedDates');
            localStorage.removeItem('selectedAddons');

            navigate('/success');
        } catch (err) {
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section section-beige" style={{ minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem' }}>Complete Your Order</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
                    {/* Left: Payment & Address */}
                    <div>
                        {/* Payment Method */}
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Select Payment Method</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(m => (
                                    <label
                                        key={m}
                                        style={{
                                            padding: '1rem',
                                            border: method === m ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            background: method === m ? 'rgba(201, 104, 26, 0.05)' : 'white',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            value={m}
                                            checked={method === m}
                                            onChange={() => setMethod(m)}
                                            style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontWeight: method === m ? 'bold' : '500' }}>{m}</span>
                                    </label>
                                ))}
                            </div>
                            {method === 'UPI' && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--soft-beige)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    You'll be redirected to Razorpay to complete your payment securely.
                                </div>
                            )}
                        </div>

                        {/* Order Terms */}
                        <div className="card" style={{ padding: '2rem', background: 'var(--soft-beige)', borderRadius: '12px' }}>
                            <h4 style={{ marginBottom: '1rem' }}>All-inclusive · No hidden charges</h4>
                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                                <li>✓ Fresh hand-picked flowers</li>
                                <li>✓ Early morning delivery (5:30-6:30 AM)</li>
                                <li>✓ Direct address delivery</li>
                                <li>✓ Subscription valid for 4 weeks</li>
                                <li>✓ Refund policy included</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                            <h3 style={{ marginBottom: '2rem' }}>Order Summary</h3>

                            {/* Plan */}
                            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PLAN</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <strong>{planData.type}</strong>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{planData.price}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {selectedDates.length} days over 4 weeks
                                </div>
                            </div>

                            {/* Add-ons */}
                            {Object.keys(selectedAddonsData).length > 0 && (
                                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>ADD-ONS</div>
                                    {Object.entries(selectedAddonsData).map(([addonIdStr, dates]) => {
                                        const addon = addOnsList.find(a => a.id === parseInt(addonIdStr));
                                        const datesArray = dates as string[];
                                        return (
                                            <div key={addonIdStr} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                <span>{addon?.name} ({datesArray.length}d)</span>
                                                <span style={{ fontWeight: 'bold' }}>₹{addon ? addon.price * datesArray.length : 0}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Total */}
                            <div style={{ padding: '1.5rem', background: 'var(--soft-beige)', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>TOTAL</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.5rem' }}>₹{totalPrice}</span>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>

                            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Secured by <strong>Razorpay</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
