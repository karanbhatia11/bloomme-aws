import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, Mail, MapPin, Flower2 } from 'lucide-react';
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
            <header className="hero" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(61, 31, 11, 0.6), rgba(61, 31, 11, 0.4)), url(/images/hero.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                <div className="hero-content fade-in" style={{ maxWidth: '900px', textAlign: 'center', zIndex: 2 }}>
                    {/* Sanskrit Shloka */}
                    <div style={{
                        fontSize: '1.3rem',
                        fontStyle: 'italic',
                        color: 'var(--gold)',
                        marginBottom: '0.5rem',
                        fontFamily: 'var(--font-serif)',
                        letterSpacing: '0.05em'
                    }}>
                        पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।
                    </div>

                    {/* Hindi Translation */}
                    <div style={{
                        fontSize: '1rem',
                        color: 'var(--gold-light)',
                        marginBottom: '2rem',
                        opacity: 0.95
                    }}>
                        "जो कोई भी भक्ति से मेरे को पत्र, पुष्प, फल और जल अर्पित करता है।"
                    </div>

                    {/* Main Headline */}
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 800,
                        marginBottom: '1.5rem',
                        color: 'var(--white)',
                        lineHeight: '1.2',
                        textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                    }}>
                        Daily Fresh Puja Flowers & Essentials Delivered at Your Doorstep
                    </h1>

                    {/* Subheading */}
                    <p style={{
                        fontSize: '1.4rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '2.5rem',
                        maxWidth: '800px',
                        margin: '0 auto 2.5rem',
                        lineHeight: '1.6'
                    }}>
                        Fresh puja flowers & essentials delivered before sunrise - every single day.
                    </p>

                    {/* CTA Button */}
                    <Link to="/checkout/plans" style={{
                        display: 'inline-block',
                        padding: '1.2rem 3rem',
                        background: 'var(--light-gold)',
                        color: 'var(--maroon)',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        marginBottom: '2.5rem',
                        transition: 'all 0.3s',
                        boxShadow: '0 8px 30px rgba(201, 152, 39, 0.3)',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                        (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(201, 152, 39, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                        (e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(201, 152, 39, 0.3)';
                    }}>
                        YOUR DAILY DEVOTION, STARTING FROM ONLY ₹49/DAY
                    </Link>

                    {/* Social Proof */}
                    <div style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem'
                    }}>
                        <Flower2 size={20} color="var(--gold)" />
                        <span>Join <strong>100 families</strong> who start every morning with Bloomme</span>
                    </div>
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
                                <Link to="/checkout/plans" className={`btn ${plan.is_popular ? 'btn-gold' : ''}`} style={{ width: '100%' }}>View Plan</Link>
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
