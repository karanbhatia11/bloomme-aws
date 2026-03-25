import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, PauseCircle, PlusCircle, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
    const [subscription, setSubscription] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
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

    // Generate calendar for the month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthDays = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const calendarDays = Array(firstDay).fill(null).concat(Array.from({ length: monthDays }, (_, i) => i + 1));

    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return day === today.getDate() &&
               currentMonth.getMonth() === today.getMonth() &&
               currentMonth.getFullYear() === today.getFullYear();
    };

    const isDeliveryDay = (day: number | null) => {
        if (!day || !subscription?.custom_schedule) return false;
        const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
        return Array.isArray(subscription.custom_schedule) && subscription.custom_schedule.includes(dateStr);
    };

    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <h2><img src="/images/logo.jpeg" alt="Bloomme" style={{ height: '40px', objectFit: 'contain' }} /></h2>
                <nav>
                    <div className="sidebar-item"><Package size={20} /> My Subscription</div>
                    <div className="sidebar-item"><Calendar size={20} /> Delivery Calendar</div>
                    <div className="sidebar-item" onClick={() => navigate('/addons')} style={{ cursor: 'pointer' }}><PlusCircle size={20} /> Add Add-ons</div>
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
                                <div><small>Plan</small><div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{subscription.plan_type}</div></div>
                                <div><small>Status</small><div style={{ color: subscription.status === 'active' ? 'var(--primary)' : 'red', fontWeight: 'bold' }}>{subscription.status.toUpperCase()}</div></div>
                                <div><small>Price</small><div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{subscription.price}/mo</div></div>
                                <div><small>Next Delivery</small><div>Daily 5:30-6:30 AM</div></div>
                                <button
                                    onClick={() => navigate('/addons')}
                                    style={{
                                        marginTop: '1.5rem',
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    + Add Add-ons
                                </button>
                            </div>
                        ) : (
                            <p>You don't have an active subscription. <span onClick={() => navigate('/plans')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Start Now</span></p>
                        )}
                    </div>

                    {/* Delivery Calendar */}
                    <div className="card" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3>{monthName}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                                    {day}
                                </div>
                            ))}
                            {calendarDays.map((day, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        border: isToday(day) ? '2px solid var(--primary)' : isDeliveryDay(day) ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                                        background: isDeliveryDay(day) ? 'var(--primary)' : isToday(day) ? 'rgba(201, 104, 26, 0.1)' : 'white',
                                        color: isDeliveryDay(day) ? 'white' : 'var(--text-dark)',
                                        fontWeight: isToday(day) || isDeliveryDay(day) ? 'bold' : '500',
                                        cursor: 'default',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', fontSize: '0.9rem', padding: '1rem', background: 'var(--soft-beige)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--primary)' }}></div>
                                <span>Delivery Day</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid var(--primary)', background: 'white' }}></div>
                                <span>Today</span>
                            </div>
                        </div>
                    </div>

                    {/* Referral */}
                    <div className="card" style={{ padding: '2rem', marginTop: '1rem' }}>
                        <h3>Referral Program</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Share with friends & earn free add-ons!</p>
                        <div style={{ padding: '1rem', background: 'var(--soft-beige)', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>YOUR REFERRAL CODE</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                {user?.referral_code || 'BLM2025'}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(user?.referral_code || 'BLM2025');
                                alert('Referral code copied!');
                            }}
                            className="btn btn-gold"
                            style={{ width: '100%', padding: '0.75rem' }}
                        >
                            Copy & Share Code
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
