import { useEffect, useState } from 'react';
import {
    Users,
    Calendar,
    Layers,
    Package,
    Settings,
    LogOut,
    TrendingUp,
    Plus,
    Search
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState<any[]>([]);
    const [siteStatus, setSiteStatus] = useState<'coming_soon' | 'maintenance' | 'none'>('none');

    const navigate = useNavigate();

    // Forms
    const [catForm, setCatForm] = useState({ name: '', description: '', image_url: '' });
    const [prodForm, setProdForm] = useState({ name: '', price: '', image_url: '', subcategory_id: null });
    const [planForm, setPlanForm] = useState({ name: '', tagline: '', price: '', image_url: '', features: '', is_popular: false, is_active: true });
    const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

    const [showCatForm, setShowCatForm] = useState(false);
    const [showProdForm, setShowProdForm] = useState(false);
    const [showPlanForm, setShowPlanForm] = useState(false);

    const handleAddCategory = async () => {
        try {
            await api.post('/admin/categories', catForm);
            setCatForm({ name: '', description: '', image_url: '' });
            setShowCatForm(false);
            fetchData();
        } catch (err) { alert('Error adding category'); }
    };

    const handleAddProduct = async () => {
        try {
            await api.post('/admin/products', prodForm);
            setProdForm({ name: '', price: '', image_url: '', subcategory_id: null });
            setShowProdForm(false);
            fetchData();
        } catch (err) { alert('Error adding product'); }
    };

    const handleAddPlan = async () => {
        try {
            const featuresArray = typeof planForm.features === 'string'
                ? planForm.features.split(',').map(f => f.trim()).filter(f => f)
                : planForm.features;

            if (editingPlanId) {
                await api.put(`/admin/plans/${editingPlanId}`, { ...planForm, features: featuresArray });
            } else {
                await api.post('/admin/plans', { ...planForm, features: featuresArray });
            }

            setPlanForm({ name: '', tagline: '', price: '', image_url: '', features: '', is_popular: false, is_active: true });
            setEditingPlanId(null);
            setShowPlanForm(false);
            fetchData();
        } catch (err) { alert('Error saving plan'); }
    };

    const handleEditPlan = (p: any) => {
        setPlanForm({
            name: p.name,
            tagline: p.tagline,
            price: p.price,
            image_url: p.image_url,
            features: Array.isArray(p.features) ? p.features.join(', ') : p.features,
            is_popular: p.is_popular,
            is_active: p.is_active
        });
        setEditingPlanId(p.id);
        setShowPlanForm(true);
    };

    const handleDeletePlan = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;
        try {
            await api.delete(`/admin/plans/${id}`);
            fetchData();
        } catch (err) { alert('Error deleting plan'); }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || user.role !== 'admin') {
                navigate('/login');
                return;
            }
            fetchData();
        };
        checkAuth();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const res = await api.get('/admin/stats');
                setStats(res.data);
                const configRes = await api.get('/config/site-mode');
                setSiteStatus(configRes.data.mode);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } else if (activeTab === 'subscriptions') {
                const res = await api.get('/admin/subscriptions');
                setSubscriptions(res.data);
            } else if (activeTab === 'catalog') {
                const catRes = await api.get('/admin/categories');
                const prodRes = await api.get('/admin/products');
                setCategories(catRes.data);
                setProducts(prodRes.data);
            } else if (activeTab === 'plans') {
                const res = await api.get('/admin/plans');
                setPlans(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch admin data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSiteMode = async (mode: string) => {
        try {
            await api.post('/admin/config/site-mode', { mode });
            setSiteStatus(mode as any);
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const renderContent = () => {
        if (loading) return <div className="loading-spinner-container">Loading Dashboard...</div>;

        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="admin-fade-in">
                        <div className="admin-status-bar">
                            <div className="status-label">
                                <Settings size={18} /> Site Availability:
                                <select
                                    className={`site-mode-select ${siteStatus}`}
                                    value={siteStatus}
                                    onChange={(e) => handleUpdateSiteMode(e.target.value)}
                                >
                                    <option value="none">Live & Operational</option>
                                    <option value="coming_soon">Coming Soon Mode</option>
                                    <option value="maintenance">Under Maintenance</option>
                                </select>
                            </div>
                            <div className="status-hint">
                                {siteStatus === 'coming_soon' && "🌸 Blooming flowers theme active for users."}
                                {siteStatus === 'maintenance' && "🌿 Wilting flowers theme active for users."}
                                {siteStatus === 'none' && "✅ Site is public."}
                            </div>
                        </div>

                        <div className="admin-stats-cards">
                            <div className="stat-card">
                                <Users size={32} color="#4F7942" />
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.total_users}</span>
                                    <span className="stat-label">Total Customers</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <Calendar size={32} color="#D4AF37" />
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.total_subscriptions}</span>
                                    <span className="stat-label">Subscribers</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <TrendingUp size={32} color="#2ecc71" />
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.active_subscriptions}</span>
                                    <span className="stat-label">Active Plans</span>
                                </div>
                            </div>
                        </div>

                        <div className="admin-card mt-4">
                            <h3>Plan Distribution</h3>
                            <div className="plan-bars">
                                {stats?.plan_breakdown.map((plan: any) => (
                                    <div key={plan.plan_type} className="plan-bar-row">
                                        <div className="plan-name">{plan.plan_type}</div>
                                        <div className="plan-bar-wrapper">
                                            <div
                                                className="plan-bar-fill"
                                                style={{
                                                    width: `${(plan.count / (stats.total_subscriptions || 1)) * 100}%`,
                                                    backgroundColor: '#D4AF37'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="plan-count">{plan.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="admin-fade-in">
                        <div className="admin-card">
                            <div className="card-header">
                                <h3>User Management</h3>
                                <div className="search-box">
                                    <Search size={18} />
                                    <input type="text" placeholder="Search users..." />
                                </div>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td className="bold">{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone}</td>
                                            <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                            <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'subscriptions':
                return (
                    <div className="admin-fade-in">
                        <div className="admin-card">
                            <h3>Active Subscriptions</h3>
                            <table className="admin-table mt-3">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Plan</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Started</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map(s => (
                                        <tr key={s.id}>
                                            <td>
                                                <strong>{s.user_name}</strong>
                                                <div className="sub-text">{s.user_email}</div>
                                            </td>
                                            <td><span className="plan-tag">{s.plan_type}</span></td>
                                            <td>₹{s.price}</td>
                                            <td><span className={`status-tag ${s.status}`}>{s.status}</span></td>
                                            <td>{new Date(s.start_date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'catalog':
                return (
                    <div className="admin-fade-in">
                        <div className="catalog-grid">
                            <div className="admin-card">
                                <div className="card-header">
                                    <h3>Categories</h3>
                                    <button className="add-btn" onClick={() => setShowCatForm(!showCatForm)}>
                                        <Plus size={16} /> Add Category
                                    </button>
                                </div>
                                {showCatForm && (
                                    <div className="admin-mini-form">
                                        <input type="text" placeholder="Category Name" className="form-input" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} />
                                        <textarea placeholder="Description" className="form-input mt-2" value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} />
                                        <ImageUpload value={catForm.image_url} onChange={(url) => setCatForm({ ...catForm, image_url: url })} label="Category Photo" />
                                        <button className="cta-button mt-2" style={{ width: '100%', padding: '10px' }} onClick={handleAddCategory}>Save Category</button>
                                    </div>
                                )}
                                <div className="item-list mt-3">
                                    {categories.map(c => (
                                        <div key={c.id} className="catalog-item">
                                            <img src={c.image_url || '/images/logo.jpeg'} alt={c.name} />
                                            <div className="item-details">
                                                <strong>{c.name}</strong>
                                                <p>{c.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="admin-card">
                                <div className="card-header">
                                    <h3>Products</h3>
                                    <button className="add-btn" onClick={() => setShowProdForm(!showProdForm)}>
                                        <Plus size={16} /> Add Product
                                    </button>
                                </div>
                                {showProdForm && (
                                    <div className="admin-mini-form">
                                        <input type="text" placeholder="Product Name" className="form-input" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} />
                                        <input type="number" placeholder="Price" className="form-input mt-2" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} />
                                        <ImageUpload value={prodForm.image_url} onChange={(url) => setProdForm({ ...prodForm, image_url: url })} label="Product Photo" />
                                        <button className="cta-button mt-2" style={{ width: '100%', padding: '10px' }} onClick={handleAddProduct}>Save Product</button>
                                    </div>
                                )}
                                <div className="item-list mt-3">
                                    {products.map(p => (
                                        <div key={p.id} className="catalog-item">
                                            <img src={p.image_url || '/images/logo.jpeg'} alt={p.name} />
                                            <div className="item-details">
                                                <strong>{p.name}</strong>
                                                <span className="item-price">₹{p.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'plans':
                return (
                    <div className="admin-fade-in">
                        <div className="admin-card">
                            <div className="card-header">
                                <h3>Subscription Plans</h3>
                                <button className="add-btn" onClick={() => {
                                    if (showPlanForm) {
                                        setEditingPlanId(null);
                                        setPlanForm({ name: '', tagline: '', price: '', image_url: '', features: '', is_popular: false, is_active: true });
                                    }
                                    setShowPlanForm(!showPlanForm);
                                }}>
                                    <Plus size={16} /> {showPlanForm ? 'Close' : (editingPlanId ? 'Cancel Edit' : 'Add New Plan')}
                                </button>
                            </div>
                            {showPlanForm && (
                                <div className="admin-mini-form plan-form">
                                    <div className="form-row">
                                        <input type="text" placeholder="Plan Name (e.g. BASIC)" className="form-input" value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} />
                                        <input type="text" placeholder="Tagline (e.g. Traditional)" className="form-input" value={planForm.tagline} onChange={e => setPlanForm({ ...planForm, tagline: e.target.value })} />
                                    </div>
                                    <div className="form-row mt-2">
                                        <input type="number" placeholder="Price" className="form-input" value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} />
                                        <div style={{ flex: 1 }}>
                                            <ImageUpload value={planForm.image_url} onChange={(url) => setPlanForm({ ...planForm, image_url: url })} label="Plan Photo" />
                                        </div>
                                    </div>
                                    <textarea placeholder="Features (comma separated)" className="form-input mt-2" value={planForm.features} onChange={e => setPlanForm({ ...planForm, features: e.target.value })} />
                                    <div className="mt-2" style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="checkbox" checked={planForm.is_popular} onChange={e => setPlanForm({ ...planForm, is_popular: e.target.checked })} />
                                            <label className="form-label" style={{ marginBottom: 0 }}>Mark as Popular</label>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="checkbox" checked={planForm.is_active} onChange={e => setPlanForm({ ...planForm, is_active: e.target.checked })} />
                                            <label className="form-label" style={{ marginBottom: 0 }}>Plan is Active</label>
                                        </div>
                                    </div>
                                    <button className="cta-button mt-3" style={{ width: '100%', padding: '12px' }} onClick={handleAddPlan}>
                                        {editingPlanId ? 'Update Subscription Plan' : 'Save New Subscription Plan'}
                                    </button>
                                </div>
                            )}
                            <div className="item-list mt-3">
                                {plans.map(p => (
                                    <div key={p.id} className="catalog-item plan-item">
                                        <img src={p.image_url || '/images/logo.jpeg'} alt={p.name} />
                                        <div className="item-details">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <strong>{p.name}</strong>
                                                {p.is_popular && <span className="popular-badge">POPULAR</span>}
                                            </div>
                                            <p className="tagline">{p.tagline}</p>
                                            <span className="item-price">₹{p.price}/mo</span>
                                            <div className="features-list">
                                                {Array.isArray(p.features) && p.features.map((f: string, i: number) => (
                                                    <span key={i} className="f-tag">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span className={`status-tag ${p.is_active ? 'active' : 'cancelled'}`}>
                                                    {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                                                </span>
                                                <button className="control-btn" onClick={() => handleEditPlan(p)}>Edit</button>
                                                <button className="delete-btn" style={{ margin: 0 }} onClick={() => handleDeletePlan(p.id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div className="admin-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/images/logo.jpeg" alt="Bloomme Admin" />
                    <span>Control Panel</span>
                </div>
                <nav className="admin-nav">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <TrendingUp size={20} /> Dashboard
                    </button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <Users size={20} /> Users
                    </button>
                    <button className={activeTab === 'subscriptions' ? 'active' : ''} onClick={() => setActiveTab('subscriptions')}>
                        <Calendar size={20} /> Subscriptions
                    </button>
                    <button className={activeTab === 'plans' ? 'active' : ''} onClick={() => setActiveTab('plans')}>
                        <Package size={20} /> Manage Plans
                    </button>
                    <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => setActiveTab('catalog')}>
                        <Layers size={20} /> Catalog
                    </button>
                </nav>
                <div className="admin-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                    <div className="admin-user-info">
                        <span>Welcome Back, Admin</span>
                        <div className="admin-avatar">A</div>
                    </div>
                </header>
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
