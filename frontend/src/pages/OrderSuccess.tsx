import { Link, useNavigate } from 'react-router-dom';
import { Flower2, CheckCircle, MapPin, Gift, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subRes = await api.get('/subs/my-subscription');
                setSubscription(subRes.data);
            } catch (err) {
                console.error('Failed to fetch subscription:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading your subscription details...</p>
            </div>
        );
    }

    return (
        <div className="section section-beige" style={{ minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Success Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ padding: '2rem', background: 'var(--soft-beige)', borderRadius: '50%', width: 'fit-content', margin: '0 auto 2rem' }}>
                        <CheckCircle size={80} color="var(--primary)" />
                    </div>
                    <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Order Confirmed!</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Your Bloomme subscription has been successfully created. Your first delivery will arrive tomorrow morning at your doorstep.
                    </p>
                </div>

                {/* Order Summary Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Order Details */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Flower2 size={24} color="var(--primary)" />
                            Your Subscription
                        </h3>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>PLAN</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {subscription?.plan_type || 'Premium Plan'}
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>DELIVERY FREQUENCY</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                Daily at 5:30-6:30 AM
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>STATUS</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>ACTIVE</span>
                            </div>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--soft-beige)', borderRadius: '8px', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)', textAlign: 'center' }}>
                            ₹{subscription?.price || 0}/month
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MapPin size={24} color="var(--primary)" />
                            Delivery Address
                        </h3>
                        <div style={{ background: 'var(--soft-beige)', padding: '1rem', borderRadius: '8px', lineHeight: '1.8', marginBottom: '1rem', fontSize: '0.95rem' }}>
                            <div><strong>You'll get notifications</strong> when your flowers leave our warehouse</div>
                            <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Delivery starts tomorrow morning</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                View Dashboard →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upsell & Referral Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    {/* Add More Card */}
                    <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(201, 104, 26, 0.1), rgba(201, 152, 39, 0.1))' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Gift size={24} color="var(--primary)" />
                            Add Puja Essentials
                        </h3>
                        <p style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            Enhance your daily rituals with premium add-ons
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Agarbatti</div>
                                <div style={{ color: 'var(--text-muted)' }}>₹70/day</div>
                            </div>
                            <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Flower Mala</div>
                                <div style={{ color: 'var(--text-muted)' }}>₹30/day</div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/addons')}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem'
                            }}
                        >
                            Browse Add-ons
                        </button>
                    </div>

                    {/* Referral Card */}
                    <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(201, 104, 26, 0.1), rgba(201, 152, 39, 0.1))' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Users size={24} color="var(--primary)" />
                            Refer & Earn
                        </h3>
                        <p style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            Share your referral code with friends and earn rewards
                        </p>
                        <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>YOUR CODE</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                BLM2025
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText('BLM2025');
                                alert('Referral code copied!');
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'white',
                                border: '2px solid var(--primary)',
                                color: 'var(--primary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem'
                            }}
                        >
                            Copy Code
                        </button>
                    </div>
                </div>

                {/* Footer CTA */}
                <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Check your email for order confirmation and delivery details
                    </p>
                    <Link
                        to="/dashboard"
                        style={{
                            display: 'inline-block',
                            padding: '1rem 2rem',
                            background: 'var(--primary)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold'
                        }}
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
