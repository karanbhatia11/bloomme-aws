import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, PauseCircle, PlusCircle, UserCircle } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
    const [subscription, setSubscription] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));

        const fetchData = async () => {
            try {
                const res = await api.get('/subs/my-subscription');
                setSubscription(res.data);
            } catch (err) {
                console.log('No active subscription');
            }
        };
        fetchData();
    }, [navigate]);

    const handlePause = async () => {
        if (window.confirm('Are you sure you want to pause your subscription?')) {
            await api.post('/subs/pause');
            alert('Subscription paused successfully.');
            window.location.reload();
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <h2><img src="/images/logo.jpeg" alt="Bloomme" style={{ height: '40px', objectFit: 'contain' }} /></h2>
                <nav>
                    <div className="sidebar-item"><Package size={20} /> My Subscription</div>
                    <div className="sidebar-item"><Calendar size={20} /> Delivery Calendar</div>
                    <div className="sidebar-item"><PlusCircle size={20} /> Add Add-ons</div>
                    <div className="sidebar-item sidebar-item-danger" onClick={handlePause}><PauseCircle size={20} /> Pause Delivery</div>
                </nav>
                <div className="sidebar-user">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><UserCircle size={20} /> {user?.name || 'User'}</div>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ marginTop: '1rem', background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Dashboard</h1>
                    <div className="referral-badge">
                        Referral Points: {user?.referral_points || 0}
                    </div>
                </header>

                <div className="grid">
                    {/* Subscription Status */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3>My Subscription</h3>
                        {subscription ? (
                            <div className="subscription-details">
                                <div><small>Plan</small><div>{subscription.plan_type}</div></div>
                                <div><small>Status</small><div style={{ color: subscription.status === 'active' ? 'var(--primary-green)' : 'red', fontWeight: 'bold' }}>{subscription.status.toUpperCase()}</div></div>
                                <div><small>Price</small><div>₹{subscription.price}/mo</div></div>
                                <div><small>Next Delivery</small><div>Daily 6:00 AM</div></div>
                            </div>
                        ) : (
                            <p>You don't have an active subscription. <span onClick={() => navigate('/plans')} style={{ color: 'var(--primary-green)', cursor: 'pointer' }}>Start Now</span></p>
                        )}
                    </div>

                    {/* Delivery Calendar Placeholder */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3>Delivery Calendar</h3>
                        {(() => {
                            const now = new Date();
                            const monthName = now.toLocaleString('default', { month: 'long' });
                            const today = now.getDate();
                            const upcomingDays = Array.from({ length: 7 }, (_, i) => today + i);
                            return (
                                <>
                                    <p>Your upcoming deliveries for {monthName}.</p>
                                    <div className="calendar-days">
                                        {upcomingDays.map(d => (
                                            <div key={d} className={`calendar-day ${d === today ? 'calendar-day-today' : ''}`}>
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                        <button className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem', marginTop: '1.5rem' }}>Change Schedule</button>
                    </div>

                    {/* Referral */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3>Referral Program</h3>
                        <p>Share with friends & earn free add-ons!</p>
                        <div style={{ padding: '10px', border: '2px dashed var(--light-gold)', margin: '1rem 0', fontWeight: 'bold' }}>
                            {user?.referral_code || 'BLOOM1234'}
                        </div>
                        <button className="btn btn-gold" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Redeem Points</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
