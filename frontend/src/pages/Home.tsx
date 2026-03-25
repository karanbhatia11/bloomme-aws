import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, Mail, MapPin, ChevronRight, Flower2 } from 'lucide-react';
import api from '../api/axios';
import SiteStatusModal from '../components/SiteStatusModal';
import { getSiteStatus, getPlans } from '../api/config';

const Home = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
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

    const handleNewsletterSubmit = async () => {
        if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
            setNewsletterStatus('error');
            return;
        }
        setNewsletterStatus('loading');
        try {
            await api.post('/newsletter/subscribe', { email: newsletterEmail });
            setNewsletterStatus('success');
            setNewsletterEmail('');
        } catch {
            setNewsletterStatus('error');
        }
    };

    return (
        <div className="home">
            {/* HERO SECTION */}
            <header className="hero">
                <div className="hero-content fade-in">
                    <div className="tagline">Faith. Freshness. On Time.</div>
                    <h1>Daily Puja Flowers Delivered Fresh</h1>
                    <p>Experience the divine essence of hand-picked, traditional Indian flowers delivered to your home every morning before your sunrise prayers.</p>
                    <div className="hero-price-badge">
                        Monthly Subscriptions Starting ₹49 /day
                    </div>
                    <Link to="/signup" className="btn btn-gold">
                        Start Your Subscription <ChevronRight size={20} />
                    </Link>
                </div>
            </header>

            {/* THE JOURNEY */}
            <section className="section section-beige">
                <div className="fade-in">
                    <h2>God's Flowers, Delivered Early</h2>
                    <div className="grid">
                        <div className="card">
                            <img src="/images/basic.png" alt="Pure Selection" className="plan-img" loading="lazy" />
                            <div className="card-content">
                                <div style={{ background: 'var(--soft-beige)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <CheckCircle size={24} color="var(--primary-green)" />
                                </div>
                                <h3>Traditional Purity</h3>
                                <p>We only deliver sacred flowers used in traditional Indian worship rituals.</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop" alt="Timely Delivery" className="plan-img" loading="lazy" />
                            <div className="card-content">
                                <div style={{ background: 'var(--soft-beige)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Truck size={24} color="var(--primary-green)" />
                                </div>
                                <h3>Early Morning Arrival</h3>
                                <p>Our team ensures your flowers arrive at your doorstep by 6 AM daily.</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src="/images/hero.png" alt="Puja Ready" className="plan-img" loading="lazy" />
                            <div className="card-content">
                                <div style={{ background: 'var(--soft-beige)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Package size={24} color="var(--primary-green)" />
                                </div>
                                <h3>Ready for Puja</h3>
                                <p>Clean, fresh, and hand-sorted flowers, ready for your morning offering.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FESTIVALS OF INDIA */}
            <section className="section">
                <h2>Flowers for Indian Festivals</h2>
                <div className="grid">
                    <div className="card">
                        <img src="/images/diwali.png" className="plan-img" alt="Diwali" loading="lazy" />
                        <div className="card-content"><h3>Diwali</h3></div>
                    </div>
                    <div className="card">
                        <img src="/images/ganesh.png" className="plan-img" alt="Ganesh Chaturthi" loading="lazy" />
                        <div className="card-content"><h3>Ganesh Chaturthi</h3></div>
                    </div>
                    <div className="card">
                        <img src="/images/navratri.png" className="plan-img" alt="Navratri" loading="lazy" />
                        <div className="card-content"><h3>Navratri</h3></div>
                    </div>
                    <div className="card">
                        <img src="/images/holi.png" className="plan-img" alt="Holi" loading="lazy" />
                        <div className="card-content"><h3>Holi & Spring</h3></div>
                    </div>
                </div>
            </section>

            {/* SUBSCRIPTION PLANS */}
            <section className="section section-beige" id="subscriptions">
                <h2>Choose Your Subscription</h2>
                <div className="grid">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`card ${plan.is_popular ? 'plans-premium-card' : ''}`}>
                            {plan.is_popular && <div className="popular-tag">MOST SACRED</div>}
                            <img src={plan.image_url} alt={plan.name} className="plan-img" loading="lazy" />
                            <div className="card-content">
                                <div className="tagline">{plan.tagline}</div>
                                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{plan.name}</h3>
                                <ul style={{ textAlign: 'left', marginBottom: '1.5rem', listStyle: 'none', padding: 0 }}>
                                    {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, idx: number) => (
                                        <li key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                            <Flower2 size={18} /> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>₹{plan.price}/mo</div>
                                <Link to="/signup" className={`btn ${plan.is_popular ? 'btn-gold' : ''}`} style={{ width: '100%' }}>View Plan</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <SiteStatusModal isOpen={showModal} onClose={() => setShowModal(false)} status={siteStatus} />

            {/* ADD-ONS PREVIEW */}
            <section className="section section-beige">
                <h2>Enhance Your Puja</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>Add these essentials to your daily delivery anytime with a single click in your dashboard.</p>
                <div className="addons-preview-grid">
                    {['Flower Mala', 'Lotus', 'Rose Petals', 'Agarbatti', 'Camphor', 'Cotton Batti'].map(item => (
                        <div key={item} className="addon-preview-item">
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
                            <div style={{ fontWeight: 600 }}>{item}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SERVICE AREA */}
            <section className="section">
                <h2>Delivering Near You</h2>
                <div className="card service-area-card">
                    <div className="service-area-info">
                        <h3>Faridabad</h3>
                        <p>We are currently blooming in:</p>
                        <div className="service-area-badges">
                            {['NIT 1', 'NIT 2', 'NIT 3', 'NIT 5'].map(area => (
                                <span key={area} className="service-area-badge">{area}</span>
                            ))}
                        </div>
                    </div>
                    <div className="service-area-image">
                        <img src="https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=800&auto=format&fit=crop" alt="Location" loading="lazy" />
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="section footer">
                <div className="footer-inner">
                    <div className="footer-grid">
                        <div>
                            <div className="logo" style={{ marginBottom: '1.5rem' }}><img src="/images/logo.jpeg" alt="Bloomme" /></div>
                            <p style={{ color: '#bdc3c7', lineHeight: 1.8 }}>Cultivating faith and freshness. Delivering the finest puja flowers to your home, every single day.</p>
                        </div>
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Contact Us</h3>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#bdc3c7' }}>
                                <Mail size={18} /> admin@bloomme.co.in
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#bdc3c7', marginTop: '1rem' }}>
                                <MapPin size={18} /> Faridabad, Haryana
                            </p>
                        </div>
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Newsletter</h3>
                            <p style={{ color: '#bdc3c7' }}>Tips for a mindful morning routine.</p>
                            {newsletterStatus === 'success' ? (
                                <p style={{ color: '#2ecc71', marginTop: '1rem', fontWeight: 600 }}>Thank you for subscribing!</p>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={newsletterEmail}
                                            onChange={(e) => { setNewsletterEmail(e.target.value); setNewsletterStatus('idle'); }}
                                            style={{ padding: '10px', borderRadius: '5px', border: newsletterStatus === 'error' ? '2px solid #e74c3c' : 'none', width: '100%' }}
                                        />
                                        <button className="btn btn-gold" style={{ padding: '10px 20px', width: 'auto' }} onClick={handleNewsletterSubmit}>Join</button>
                                    </div>
                                    {newsletterStatus === 'error' && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px' }}>Please enter a valid email.</p>}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="footer-bottom" />
                </div>
            </footer>
        </div>
    );
};

export default Home;
