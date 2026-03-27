import { useNavigate } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import SiteStatusModal from '../components/SiteStatusModal';
import { getSiteStatus, getPlans } from '../api/config';

const Plans = () => {
    const navigate = useNavigate();
    const [siteStatus, setSiteStatus] = useState<'coming_soon' | 'maintenance' | 'none'>('none');
    const [plans, setPlans] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const status = await getSiteStatus();
            const plansData = await getPlans();
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            setSiteStatus(user?.role === 'admin' ? 'none' : status.mode);
            setPlans(plansData);
        };
        fetchData();
    }, []);

    // Generate 4-week calendar from today
    const getCalendarDates = () => {
        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < 28; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const calendarDates = getCalendarDates();

    const getDayOfWeek = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00Z');
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
    };

    const isToday = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    const handleSelectPlan = (plan: any) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (siteStatus !== 'none' && user?.role !== 'admin') {
            setShowModal(true);
            return;
        }
        setSelectedPlan(plan);
        setSelectedDates([]);
    };

    const toggleDate = (date: string) => {
        setSelectedDates(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    };

    const handleProceed = () => {
        if (!selectedPlan || selectedDates.length === 0) {
            alert('Please select a plan and at least one delivery date');
            return;
        }
        localStorage.setItem('selectedPlan', JSON.stringify({ type: selectedPlan.name, price: selectedPlan.price }));
        localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
        navigate('/delivery');
    };

    if (selectedPlan) {
        return (
            <div className="section section-beige" style={{ minHeight: '100vh' }}>
                <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <button
                        onClick={() => setSelectedPlan(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1rem', marginBottom: '2rem' }}
                    >
                        ← Back to Plans
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                        {/* Plan Card */}
                        <div className={`card ${selectedPlan.is_popular ? 'plans-premium-card' : ''}`} style={{ height: 'fit-content' }}>
                            {selectedPlan.is_popular && <div className="popular-tag">MOST POPULAR</div>}
                            <img src={selectedPlan.image_url} alt={selectedPlan.name} className="plan-img" loading="lazy" />
                            <div className="card-content">
                                <div className="tagline">{selectedPlan.tagline}</div>
                                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{selectedPlan.name}</h3>
                                <ul style={{ textAlign: 'left', marginBottom: '2rem', listStyle: 'none', padding: 0 }}>
                                    {(Array.isArray(selectedPlan.features) ? selectedPlan.features : []).map((feature: string, idx: number) => (
                                        <li key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                            <Flower2 size={20} color={selectedPlan.is_popular ? 'var(--light-gold)' : 'var(--primary)'} /> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: selectedPlan.is_popular ? 'var(--light-gold)' : 'var(--primary)' }}>
                                    ₹{selectedPlan.price}<small style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</small>
                                </div>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3>Select Your Delivery Dates (Next 4 Weeks)</h3>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Selected: {selectedDates.length} days</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
                                {calendarDates.map(date => (
                                    <button
                                        key={date}
                                        onClick={() => toggleDate(date)}
                                        style={{
                                            padding: '0.75rem',
                                            border: selectedDates.includes(date) ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                            borderRadius: '8px',
                                            background: selectedDates.includes(date) ? 'var(--primary)' : isToday(date) ? '#FFE8D6' : 'white',
                                            color: selectedDates.includes(date) ? 'white' : 'var(--text-dark)',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: selectedDates.includes(date) ? 'bold' : '500',
                                            transition: 'all 0.2s',
                                            textAlign: 'center'
                                        }}
                                        title={`${getDayOfWeek(date)} ${new Date(date + 'T00:00:00Z').getDate()}`}
                                    >
                                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{getDayOfWeek(date)}</div>
                                        <div>{new Date(date + 'T00:00:00Z').getDate()}</div>
                                    </button>
                                ))}
                            </div>

                            <div style={{ background: 'var(--soft-beige)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Plan:</span>
                                    <strong>{selectedPlan.name}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Days Selected:</span>
                                    <strong>{selectedDates.length}</strong>
                                </div>
                                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>Estimated Monthly:</span>
                                    <span style={{ color: 'var(--primary)' }}>₹{Math.round(selectedPlan.price)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceed}
                                style={{ width: '100%' }}
                                className="btn btn-gold"
                            >
                                Proceed to Add-ons
                            </button>
                        </div>
                    </div>
                </div>
                <SiteStatusModal isOpen={showModal} onClose={() => setShowModal(false)} status={siteStatus} />
            </div>
        );
    }

    return (
        <div className="section section-beige" style={{ minHeight: '100vh' }}>
            <div className="fade-in">
                <h1 style={{ marginBottom: '1rem' }}>Choose Your Bloomme Plan</h1>
                <p style={{ marginBottom: '4rem', fontSize: '1.2rem', color: 'var(--text-dark)', opacity: 0.8 }}>
                    Fresh, hand-sorted sacred flowers delivered to your doorstep.
                </p>

                <div className="grid">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`card ${plan.is_popular ? 'plans-premium-card' : ''}`}>
                            {plan.is_popular && <div className="popular-tag">MOST POPULAR</div>}
                            <img src={plan.image_url} alt={plan.name} className="plan-img" loading="lazy" />
                            <div className="card-content">
                                <div className="tagline">{plan.tagline}</div>
                                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{plan.name}</h3>
                                <ul style={{ textAlign: 'left', marginBottom: '2rem', listStyle: 'none', padding: 0, width: '100%' }}>
                                    {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, idx: number) => (
                                        <li key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                            <Flower2 size={20} color={plan.is_popular ? "var(--light-gold)" : "var(--primary)"} /> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: plan.is_popular ? 'var(--light-gold)' : 'var(--primary)' }}>₹{plan.price}<small style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</small></div>
                                <button onClick={() => handleSelectPlan(plan)} className={`btn ${plan.is_popular ? 'btn-gold' : ''}`} style={{ width: '100%' }}>Select Plan</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <SiteStatusModal isOpen={showModal} onClose={() => setShowModal(false)} status={siteStatus} />
        </div>
    );
};

export default Plans;
