import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getSiteStatus } from '../api/config';
import { Sparkles, Hammer, Info, Flower2, Heart } from 'lucide-react';

const SiteHeader = () => {
    const [siteStatus, setSiteStatus] = useState<'coming_soon' | 'maintenance' | 'none'>('none');
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const isLandingPage = location.pathname === '/';

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await getSiteStatus();
                // Admin bypass for display, but ticker can still show info
                setSiteStatus(status.mode);
            } catch (err) {
                console.error("Failed to fetch site status for header", err);
            }
        };
        fetchStatus();
    }, []);

    const getTickerMessage = () => {
        if (siteStatus === 'coming_soon') {
            return (
                <div className="ticker-item-themed">
                    <Sparkles size={14} className="icon-gold" />
                    <span>Coming Soon: A Divine Experience Awaits Your Daily Puja rituals. Stay tuned!</span>
                    <Flower2 size={14} className="icon-green" />
                </div>
            );
        }
        if (siteStatus === 'maintenance') {
            return (
                <div className="ticker-item-themed">
                    <Hammer size={14} className="icon-gray" />
                    <span>We are Currently Under Maintenance. Tending to our digital garden for a better bloom.</span>
                    <Sparkles size={14} className="icon-gold" />
                </div>
            );
        }
        return (
            <div className="ticker-item-themed">
                <Flower2 size={14} className="icon-green" />
                <span>Traditional Divine Flowers • Delivered Early for Your Morning Prayers • Experience Absolute Purity</span>
                <Heart size={14} className="icon-gold" />
            </div>
        );
    };

    return (
        <header className="site-header-global">
            <nav className="nav-sticky">
                <Link to="/" className="logo">
                    <img src="/images/logo.jpeg" alt="Bloomme" />
                </Link>

                {/* Classy Running Line (Ticker) - Only on Landing Page */}
                {isLandingPage && (
                    <div className="ticker-wrapper">
                        <div className="ticker-content">
                            <div className="ticker-item">{getTickerMessage()}</div>
                            <div className="ticker-item">{getTickerMessage()}</div>
                            <div className="ticker-item">{getTickerMessage()}</div>
                        </div>
                    </div>
                )}

                <div className="nav-links">
                    {user ? (
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-secondary">
                            Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="login-link">Login</Link>
                    )}
                    <Link to="/signup" className="btn btn-gold-small">Join Now</Link>
                </div>
            </nav>
        </header>
    );
};

export default SiteHeader;
