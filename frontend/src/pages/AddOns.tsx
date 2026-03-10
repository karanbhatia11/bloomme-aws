import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface AddOn {
    id: number;
    name: string;
    price: number;
}

const AddOns = () => {
    const [addOnsList, setAddOnsList] = useState<AddOn[]>([]);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const navigate = useNavigate();

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

    const subData = JSON.parse(localStorage.getItem('subscriptionData') || '{"finalPrice": 0}');
    const addonsTotal = addOnsList.filter(a => selectedAddons.includes(a.id)).reduce((sum, a) => sum + a.price, 0);

    const handleNext = () => {
        localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
        navigate('/payment');
    };

    return (
        <div className="section section-beige" style={{ minHeight: '100vh' }}>
            <h1>Add Puja Essentials</h1>
            <p>(Optional)</p>

            <div className="addons-grid">
                {addOnsList.map(item => (
                    <div key={item.id} onClick={() => setSelectedAddons(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                        className="card" style={{ cursor: 'pointer', border: selectedAddons.includes(item.id) ? '2px solid var(--primary-green)' : '1px solid #ddd', position: 'relative', padding: '1.5rem', textAlign: 'center' }}>
                        {selectedAddons.includes(item.id) && <div style={{ position: 'absolute', top: 10, right: 10, color: 'var(--primary-green)', fontWeight: 'bold' }}>✓</div>}
                        <h3>{item.name}</h3>
                        <div className="tagline">₹{item.price}</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Plan Cost:</span>
                    <span>₹{subData.finalPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span>Add-ons:</span>
                    <span>₹{addonsTotal}</span>
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '1rem' }}>
                    <span>Total:</span>
                    <span>₹{subData.finalPrice + addonsTotal}</span>
                </div>
                <button onClick={handleNext} className="btn" style={{ marginTop: '2rem', width: '100%' }}>Proceed to Payment</button>
            </div>

            <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>Note: Add-ons must be ordered 24 hours before delivery.</p>
        </div>
    );
};

export default AddOns;
