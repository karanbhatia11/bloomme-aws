import { useNavigate } from 'react-router-dom';
import { Flower2, Sparkles, Package, Heart, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import SiteStatusModal from '../components/SiteStatusModal';
import { getSiteStatus, getPlans } from '../api/config';

const Plans = () => {
    const navigate = useNavigate();
    const [siteStatus, setSiteStatus] = useState<'coming_soon' | 'maintenance' | 'none'>('none');
    const [plans, setPlans] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

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

    const handleSelect = (plan: string, price: number) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (siteStatus !== 'none' && user?.role !== 'admin') {
            setShowModal(true);
            return;
        }
        localStorage.setItem('selectedPlan', JSON.stringify({ type: plan, price }));
        navigate('/delivery');
    };

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
                                            <Flower2 size={20} color={plan.is_popular ? "var(--light-gold)" : "var(--primary-green)"} /> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: plan.is_popular ? 'var(--light-gold)' : 'var(--primary-green)' }}>₹{plan.price}<small style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</small></div>
                                <button onClick={() => handleSelect(plan.name, parseFloat(plan.price))} className={`btn ${plan.is_popular ? 'btn-gold' : ''}`} style={{ width: '100%' }}>Select Plan</button>
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
