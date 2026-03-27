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
    const [selectedAddons, setSelectedAddons] = useState<{ [key: number]: string[] }>({});
    const [selectionMode, setSelectionMode] = useState<'all' | 'specific'>('all');
    const [planData] = useState(JSON.parse(localStorage.getItem('selectedPlan') || '{}'));
    const [selectedDates] = useState(JSON.parse(localStorage.getItem('selectedDates') || '[]'));
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

    const handleSelectAddon = (addonId: number) => {
        if (selectionMode === 'all') {
            setSelectedAddons(prev => {
                const updated = { ...prev };
                if (updated[addonId]) {
                    delete updated[addonId];
                } else {
                    updated[addonId] = selectedDates;
                }
                return updated;
            });
        }
    };

    const toggleDateForAddon = (addonId: number, date: string) => {
        setSelectedAddons(prev => {
            const updated = { ...prev };
            if (!updated[addonId]) {
                updated[addonId] = [];
            }
            if (updated[addonId].includes(date)) {
                updated[addonId] = updated[addonId].filter(d => d !== date);
                if (updated[addonId].length === 0) {
                    delete updated[addonId];
                }
            } else {
                updated[addonId].push(date);
            }
            return updated;
        });
    };

    const addonsTotal = Object.keys(selectedAddons).reduce((sum, addonIdStr) => {
        const addon = addOnsList.find(a => a.id === parseInt(addonIdStr));
        return sum + (addon ? addon.price * selectedAddons[parseInt(addonIdStr)].length : 0);
    }, 0);

    const handleNext = () => {
        localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
        navigate('/payment');
    };

    return (
        <div className="section section-beige" style={{ minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1rem' }}>Add Puja Essentials</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>(Optional) Choose add-ons for specific delivery dates</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Add-on Selection Mode</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label style={{ padding: '0.75rem 1.5rem', border: selectionMode === 'all' ? '2px solid var(--primary)' : '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer', background: selectionMode === 'all' ? 'var(--primary)' : 'white', color: selectionMode === 'all' ? 'white' : 'var(--text-dark)', fontWeight: '500' }}>
                                    <input type="radio" value="all" checked={selectionMode === 'all'} onChange={(e) => setSelectionMode(e.target.value as 'all')} style={{ marginRight: '0.5rem' }} />
                                    All Delivery Days
                                </label>
                                <label style={{ padding: '0.75rem 1.5rem', border: selectionMode === 'specific' ? '2px solid var(--primary)' : '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer', background: selectionMode === 'specific' ? 'var(--primary)' : 'white', color: selectionMode === 'specific' ? 'white' : 'var(--text-dark)', fontWeight: '500' }}>
                                    <input type="radio" value="specific" checked={selectionMode === 'specific'} onChange={(e) => setSelectionMode(e.target.value as 'specific')} style={{ marginRight: '0.5rem' }} />
                                    Pick Specific Dates
                                </label>
                            </div>
                        </div>

                        {selectionMode === 'all' ? (
                            <div className="card" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Select Add-ons</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    {addOnsList.map(addon => (
                                        <div
                                            key={addon.id}
                                            onClick={() => handleSelectAddon(addon.id)}
                                            style={{
                                                padding: '1.5rem',
                                                border: selectedAddons[addon.id] ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                background: selectedAddons[addon.id] ? 'rgba(201, 104, 26, 0.05)' : 'white',
                                                transition: 'all 0.2s',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{addon.name}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>₹{addon.price}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>per day</div>
                                            {selectedAddons[addon.id] && (
                                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                                    ✓ Selected for {selectedAddons[addon.id].length} days
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="card" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Select Add-ons & Dates</h3>
                                {addOnsList.map(addon => (
                                    <div key={addon.id} style={{ marginBottom: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h4>{addon.name} - ₹{addon.price}/day</h4>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                {selectedAddons[addon.id]?.length || 0} selected
                                            </span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                                            {selectedDates.map((date: string) => (
                                                <button
                                                    key={date}
                                                    onClick={() => toggleDateForAddon(addon.id, date)}
                                                    style={{
                                                        padding: '0.75rem 0.5rem',
                                                        border: selectedAddons[addon.id]?.includes(date) ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                        borderRadius: '8px',
                                                        background: selectedAddons[addon.id]?.includes(date) ? 'var(--primary)' : 'white',
                                                        color: selectedAddons[addon.id]?.includes(date) ? 'white' : 'var(--text-dark)',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: selectedAddons[addon.id]?.includes(date) ? 'bold' : '500',
                                                        textAlign: 'center'
                                                    }}
                                                    title={date}
                                                >
                                                    {new Date(date + 'T00:00:00Z').getDate()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>

                            <div style={{ background: 'var(--soft-beige)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Plan:</span>
                                    <strong>{planData.type}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Days:</span>
                                    <strong>{selectedDates.length}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold' }}>
                                    <span>Base Price:</span>
                                    <span style={{ color: 'var(--primary)' }}>₹{planData.price}</span>
                                </div>
                            </div>

                            {Object.keys(selectedAddons).length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Selected Add-ons:</h4>
                                    {Object.entries(selectedAddons).map(([addonIdStr, dates]) => {
                                        const addon = addOnsList.find(a => a.id === parseInt(addonIdStr));
                                        return (
                                            <div key={addonIdStr} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{addon?.name} ({dates.length}d)</span>
                                                <span style={{ fontWeight: 'bold' }}>₹{addon ? addon.price * dates.length : 0}</span>
                                            </div>
                                        );
                                    })}
                                    <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                                <span>Total:</span>
                                <span style={{ color: 'var(--primary)' }}>₹{planData.price + addonsTotal}</span>
                            </div>

                            <button
                                onClick={handleNext}
                                className="btn btn-gold"
                                style={{ width: '100%' }}
                            >
                                Proceed to Payment →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOns;
