import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryCustomization = () => {
    const [schedule, setSchedule] = useState('Daily Delivery');
    const [customDays, setCustomDays] = useState<string[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    const plan = JSON.parse(localStorage.getItem('selectedPlan') || '{"price": 0}');

    const needsDaySelection = ['3 Days Per Week', '5 Days Per Week', 'Custom Days'].includes(schedule);
    const maxDays = schedule === '3 Days Per Week' ? 3 : schedule === '5 Days Per Week' ? 5 : 7;

    // Recalculate price whenever schedule or customDays change
    useEffect(() => {
        let multiplier = 1;
        if (schedule === 'Daily Delivery') multiplier = 1;
        else if (schedule === '3 Days Per Week') multiplier = 0.5;
        else if (schedule === '5 Days Per Week') multiplier = 0.8;
        else if (schedule === 'Weekends Only') multiplier = 0.4;
        else if (schedule === 'Custom Days') multiplier = customDays.length / 7;

        setTotalPrice(Math.round(plan.price * multiplier));
    }, [schedule, customDays, plan.price]);

    // Handle day resets when schedule changes — separate effect, only runs on schedule change
    useEffect(() => {
        if (schedule === 'Weekends Only') {
            setCustomDays(['Saturday', 'Sunday']);
        } else if (!needsDaySelection) {
            setCustomDays([]);
        } else {
            setCustomDays([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedule]);

    const handleNext = () => {
        if (needsDaySelection && schedule !== 'Custom Days' && customDays.length !== maxDays) {
            alert(`Please select exactly ${maxDays} days for this plan.`);
            return;
        }
        if (schedule === 'Custom Days' && customDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }

        localStorage.setItem('subscriptionData', JSON.stringify({
            schedule,
            customDays,
            finalPrice: totalPrice
        }));
        navigate('/address');
    };

    return (
        <div className="section section-beige" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10rem' }}>
            <div className="fade-in" style={{ width: '100%', maxWidth: '800px', padding: '0 2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Set Your Delivery Schedule</h1>
                <p style={{ textAlign: 'center', marginBottom: '3rem', opacity: 0.8 }}>Choose the frequency that best fits your daily prayers.</p>

                <div className="card" style={{ textAlign: 'left', width: '100%', padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Select Delivery Frequency</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
                        {['Daily Delivery', '3 Days Per Week', '5 Days Per Week', 'Weekends Only', 'Custom Days'].map((mode) => (
                            <label key={mode} style={{
                                padding: '15px 20px',
                                border: schedule === mode ? '2px solid var(--primary-green)' : '1px solid #eee',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                background: schedule === mode ? 'rgba(79, 121, 66, 0.05)' : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.3s'
                            }}>
                                <input
                                    type="radio"
                                    name="schedule"
                                    value={mode}
                                    checked={schedule === mode}
                                    onChange={(e) => {
                                        setSchedule(e.target.value);
                                        setCustomDays([]); // Clear days on mode change
                                    }}
                                    style={{ accentColor: 'var(--primary-green)', width: '20px', height: '20px' }}
                                />
                                <span style={{ marginLeft: '15px', fontWeight: 600, fontSize: '1.1rem' }}>{mode}</span>
                            </label>
                        ))}
                    </div>

                    {needsDaySelection && (
                        <div className="fade-in" style={{ marginBottom: '2.5rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0 }}>Select Your {schedule !== 'Custom Days' ? maxDays : ''} Days:</h4>
                                {schedule !== 'Custom Days' && (
                                    <span style={{ fontSize: '0.85rem', color: customDays.length === maxDays ? 'var(--primary-green)' : '#666', fontWeight: 600 }}>
                                        {customDays.length} / {maxDays} Selected
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                    const isSelected = customDays.includes(day);
                                    const isDisabled = !isSelected && customDays.length >= maxDays && schedule !== 'Custom Days';

                                    return (
                                        <label key={day} style={{
                                            padding: '8px 18px',
                                            borderRadius: '50px',
                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            transition: 'all 0.3s',
                                            opacity: isDisabled ? 0.5 : 1,
                                            border: isSelected ? '2px solid var(--primary-green)' : '1px solid #ddd',
                                            background: isSelected ? 'var(--primary-green)' : 'white',
                                            color: isSelected ? 'white' : 'var(--text-dark)'
                                        }}>
                                            <input
                                                type="checkbox"
                                                hidden
                                                disabled={isDisabled}
                                                checked={isSelected}
                                                onChange={() => {
                                                    setCustomDays(prev => isSelected ? prev.filter(d => d !== day) : [...prev, day])
                                                }}
                                            />
                                            {day}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div style={{
                        marginTop: '2rem',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, var(--primary-green), var(--primary-dark-green))',
                        color: 'white',
                        borderRadius: '20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1.5rem',
                        boxShadow: '0 10px 30px rgba(79, 121, 66, 0.2)'
                    }}>
                        <div>
                            <div style={{ opacity: 0.9, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Total Amount</div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹{totalPrice}<span style={{ fontSize: '1rem', fontWeight: 400 }}>/month</span></div>
                        </div>
                        <button className="btn btn-gold" onClick={handleNext} style={{ padding: '15px 35px' }}>
                            Next: Address Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryCustomization;
