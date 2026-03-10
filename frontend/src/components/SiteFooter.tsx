import { Link } from 'react-router-dom';

const tabs = [
    { key: 'about', label: 'About Us' },
    { key: 'privacy', label: 'Privacy Policy' },
    { key: 'terms', label: 'Terms & Refund' },
    { key: 'delivery', label: 'Delivery Policy' },
    { key: 'contact', label: 'Contact Us' },
];

const SiteFooter = () => {
    return (
        <div className="site-footer-bar">
            <div className="site-footer-bar-inner">
                <Link to="/" className="site-footer-logo">
                    <img src="/images/logo.jpeg" alt="Bloomme" />
                </Link>
                <div className="site-footer-tabs">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            to={`/legal?tab=${tab.key}`}
                            className="site-footer-tab"
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="site-footer-copyright">
                &copy; 2026 Bloomme. All Rights Reserved.
            </div>
        </div>
    );
};

export default SiteFooter;
