import { useNavigate } from 'react-router-dom';
import { Flower2, Sparkles, Package, Heart, CheckCircle2 } from 'lucide-react';

const Plans = () => {
    const navigate = useNavigate();

    const handleSelect = (plan: string, price: number) => {
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
                    {/* BASIC PLAN */}
                    <div className="card">
                        <img src="/images/basic.png" alt="Basic Plan" className="plan-img" loading="lazy" />
                        <div className="card-content">
                            <div className="tagline">Traditional</div>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>BASIC</h3>
                            <ul style={{ textAlign: 'left', marginBottom: '2rem', listStyle: 'none', padding: 0, width: '100%' }}>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><Flower2 size={20} color="var(--primary-green)" /> 60–100g Fresh Marigolds</li>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><Sparkles size={20} color="var(--primary-green)" /> 3 Flower Varieties</li>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><Package size={20} color="var(--primary-green)" /> Eco Paper Bag Delivery</li>
                            </ul>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--primary-green)' }}>₹1499<small style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</small></div>
                            <button onClick={() => handleSelect('BASIC', 1499)} className="btn" style={{ width: '100%' }}>Select Plan</button>
                        </div>
                    </div>

                    {/* PREMIUM PLAN */}
                    <div className="card plans-premium-card">
                        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--light-gold)', color: 'white', padding: '5px 20px', borderRadius: '0 0 0 20px', fontSize: '0.8rem', fontWeight: 'bold' }}>MOST POPULAR</div>
                        <img src="/images/premium.png" alt="Premium Plan" className="plan-img" loading="lazy" />
                        <div className="card-content">
                            <div className="tagline" style={{ color: 'var(--light-gold)' }}>Divine</div>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>PREMIUM</h3>
                            <ul style={{ textAlign: 'left', marginBottom: '2rem', listStyle: 'none', padding: 0, width: '100%' }}>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><Flower2 size={20} color="var(--light-gold)" /> 150g Premium Variety</li>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><Sparkles size={20} color="var(--light-gold)" /> Rose & Jasmine Mix</li>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><CheckCircle2 size={20} color="var(--light-gold)" /> Delivered in Bloomme Box</li>
                            </ul>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--light-gold)' }}>₹2699<small style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</small></div>
                            <button onClick={() => handleSelect('PREMIUM', 2699)} className="btn btn-gold" style={{ width: '100%' }}>Select Plan</button>
                        </div>
                    </div>

                    {/* ELITE PLAN */}
                    <div className="card">
                        <img src="/images/elite.png" alt="Elite Plan" className="plan-img" loading="lazy" />
                        <div className="card-content">
                            <div className="tagline">Celestial</div>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>ELITE</h3>
                            <ul style={{ textAlign: 'left', marginBottom: '2rem', listStyle: 'none', padding: 0, width: '100%' }}>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><Flower2 size={20} color="var(--primary-green)" /> 200g Exotic Offerings</li>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><Heart size={20} color="var(--primary-green)" /> Lotus & Seasonal Specials</li>
                                <li style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><CheckCircle2 size={20} color="var(--primary-green)" /> Luxury Bloomme Box</li>
                            </ul>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--primary-green)' }}>₹4499<small style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</small></div>
                            <button onClick={() => handleSelect('ELITE', 4499)} className="btn" style={{ width: '100%' }}>Select Plan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Plans;
