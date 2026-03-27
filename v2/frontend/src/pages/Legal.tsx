import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Globe, Mail, Phone, ChevronLeft, Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';

type TabKey = 'about' | 'privacy' | 'terms' | 'delivery' | 'contact';

const validTabs: TabKey[] = ['about', 'privacy', 'terms', 'delivery', 'contact'];

const tabs: { key: TabKey; label: string }[] = [
    { key: 'about', label: 'About Us' },
    { key: 'privacy', label: 'Privacy Policy' },
    { key: 'terms', label: 'Terms & Refund' },
    { key: 'delivery', label: 'Delivery Policy' },
    { key: 'contact', label: 'Contact Us' },
];

const Legal = () => {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') as TabKey | null;
    const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'about';
    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    // Sync tab when URL param changes (e.g. clicking footer links)
    useEffect(() => {
        if (tabParam && validTabs.includes(tabParam)) {
            setActiveTab(tabParam);
            window.scrollTo(0, 0);
        }
    }, [tabParam]);

    const currentTabLabel = tabs.find(t => t.key === activeTab)?.label || 'About Us';

    return (
        <div className="legal-page">
            {/* Simple top bar with logo + page title */}
            <nav className="legal-nav">
                <Link to="/" className="legal-nav-logo">
                    <img src="/images/logo.jpeg" alt="Bloomme" />
                </Link>
                <span className="legal-nav-title">{currentTabLabel}</span>
            </nav>

            {/* Content */}
            <div className="legal-content fade-in" key={activeTab}>

                {/* ABOUT US */}
                {activeTab === 'about' && (
                    <>
                        <h1>About Bloomme</h1>
                        <p>
                            Bloomme was created with a simple idea — to make daily prayers easier by delivering fresh
                            puja flowers and puja essentials directly to your doorstep.
                        </p>
                        <p>
                            For many people, starting the day with devotion and prayer is an important part of life.
                            However, finding fresh flowers and essential puja items every morning can sometimes be
                            inconvenient or time-consuming. Bloomme solves this problem by providing fresh puja
                            flowers and puja essentials delivered to your home.
                        </p>
                        <p>
                            Our goal is to bring convenience, freshness, and devotion together. Each order is carefully
                            prepared so you can focus on your prayers without worrying about sourcing flowers or puja
                            items.
                        </p>
                        <p>
                            We believe that devotion should be simple and peaceful. With Bloomme, your daily puja
                            begins with fresh flowers and essential puja items delivered right to your door.
                        </p>

                        <h2>Our Mission</h2>
                        <p>
                            To make daily devotion easier by delivering fresh puja flowers and puja essentials
                            conveniently and reliably.
                        </p>

                        <h2>Our Vision</h2>
                        <p>
                            To become a trusted platform for daily puja flowers and essentials, helping households
                            maintain their spiritual routines effortlessly.
                        </p>

                        <p style={{ marginTop: '2rem' }}>
                            For more information visit: <a href="https://www.bloomme.co.in" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>www.bloomme.co.in</a>
                        </p>
                    </>
                )}

                {/* PRIVACY POLICY */}
                {activeTab === 'privacy' && (
                    <>
                        <h1>Privacy Policy</h1>
                        <p className="legal-effective-date">Effective Date: Launch Date</p>

                        <p>
                            Bloomme respects your privacy and is committed to protecting your personal information.
                            This Privacy Policy explains how we collect, use, and safeguard your data when you use our
                            website and services.
                        </p>

                        <h2>Information We Collect</h2>
                        <p>We may collect the following information when you use our website or place an order:</p>
                        <ul>
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Delivery address</li>
                            <li>Payment details (processed securely through third-party payment providers)</li>
                        </ul>

                        <h2>How We Use Your Information</h2>
                        <p>Your information may be used to:</p>
                        <ul>
                            <li>Process orders and subscriptions</li>
                            <li>Deliver fresh puja flowers and puja essentials to your address</li>
                            <li>Send confirmations and updates</li>
                            <li>Improve our services and customer experience</li>
                            <li>Provide customer support</li>
                        </ul>
                        <p>
                            We do not sell or share your personal information with third parties except when required to
                            provide our services.
                        </p>

                        <h2>Data Protection</h2>
                        <p>
                            We take reasonable steps to protect your personal information from unauthorized access
                            or misuse. However, no internet-based system can guarantee complete security.
                        </p>

                        <h2>Changes to This Policy</h2>
                        <p>
                            Bloomme may update this Privacy Policy from time to time. Any updates will be posted on
                            this page.
                        </p>
                        <p>For questions regarding this policy, please contact us through our website.</p>
                        <p>
                            Visit our website for more information: <a href="https://www.bloomme.co.in" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>www.bloomme.co.in</a>
                        </p>
                    </>
                )}

                {/* TERMS, CANCELLATION & REFUND */}
                {activeTab === 'terms' && (
                    <>
                        <h1>Terms, Cancellation & Refund Policy</h1>
                        <p className="legal-effective-date">Effective Date: Launch Date</p>

                        <p>By using the Bloomme website and services, you agree to the following terms.</p>

                        <h2>Service Overview</h2>
                        <p>
                            Bloomme provides fresh puja flowers and puja essentials delivered to customers through
                            one-time orders or subscription plans.
                        </p>
                        <p>Product availability may vary depending on seasonal supply and market conditions.</p>

                        <h2>Orders and Payments</h2>
                        <p>
                            Customers must provide accurate information when placing an order. Payments must be
                            completed before orders are processed.
                        </p>
                        <p>Payments are securely handled by trusted third-party payment providers.</p>

                        <h2>Delivery</h2>
                        <p>
                            Bloomme aims to deliver orders within the selected delivery window. Delivery times may
                            vary due to weather, supply conditions, or other unforeseen factors.
                        </p>
                        <p>Customers are responsible for providing the correct delivery address.</p>

                        <h2>Order Cancellation</h2>
                        <p>Orders may be cancelled before they are prepared or dispatched.</p>
                        <p>For subscription services, cancellations should be made before the next billing cycle.</p>
                        <p>Once flowers or items are prepared or dispatched, cancellations may not be possible.</p>

                        <h2>Refund Policy</h2>
                        <p>Refunds may be issued in the following situations:</p>
                        <ul>
                            <li>Order cancelled before dispatch</li>
                            <li>Service issues caused by Bloomme</li>
                            <li>Incorrect items delivered</li>
                        </ul>
                        <p>
                            Refunds are generally processed within 5–10 business days depending on the payment provider.
                        </p>

                        <h2>Non-Refundable Situations</h2>
                        <p>Refunds may not be provided if:</p>
                        <ul>
                            <li>Incorrect address was provided</li>
                            <li>Customer unavailable at delivery</li>
                            <li>Order already dispatched</li>
                        </ul>

                        <h2>Changes to Terms</h2>
                        <p>Bloomme reserves the right to update these terms at any time.</p>
                        <p>
                            For more details visit: <a href="https://www.bloomme.co.in" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>www.bloomme.co.in</a>
                        </p>
                    </>
                )}

                {/* DELIVERY POLICY */}
                {activeTab === 'delivery' && (
                    <>
                        <h1>Delivery Policy</h1>
                        <p>
                            Bloomme aims to deliver fresh puja flowers and puja essentials conveniently to customers' homes.
                        </p>

                        <h2>Delivery Area</h2>
                        <p>
                            Currently Bloomme delivers within selected service areas. Delivery availability may expand
                            in the future.
                        </p>

                        <h2>Delivery Timing</h2>
                        <p>
                            Orders are typically delivered within the scheduled delivery window chosen by the customer.
                        </p>
                        <p>Delivery times may vary due to:</p>
                        <ul>
                            <li>Weather conditions</li>
                            <li>Traffic</li>
                            <li>Supply availability</li>
                        </ul>

                        <h2>Missed Deliveries</h2>
                        <p>
                            If the recipient is unavailable during delivery, the order may be left at the doorstep or with a
                            security desk if available.
                        </p>
                        <p>Bloomme is not responsible for damage or loss after successful delivery.</p>
                        <p>
                            For updates and service information visit: <a href="https://www.bloomme.co.in" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>www.bloomme.co.in</a>
                        </p>
                    </>
                )}

                {/* CONTACT US */}
                {activeTab === 'contact' && (
                    <>
                        <h1>Contact Us</h1>
                        <p>If you have any questions or need assistance, feel free to contact us.</p>

                        <div className="legal-contact-grid">
                            <div className="legal-contact-card">
                                <Globe size={28} color="var(--primary-green)" />
                                <h3>Website</h3>
                                <p><a href="https://www.bloomme.co.in" style={{ color: 'var(--primary-green)' }}>www.bloomme.co.in</a></p>
                            </div>
                            <div className="legal-contact-card">
                                <Mail size={28} color="var(--primary-green)" />
                                <h3>Email</h3>
                                <p><a href="mailto:support@bloomme.co.in" style={{ color: 'var(--primary-green)' }}>support@bloomme.co.in</a></p>
                            </div>
                            <div className="legal-contact-card">
                                <Phone size={28} color="var(--primary-green)" />
                                <h3>Phone</h3>
                                <p style={{ color: 'var(--text-dark)' }}>+91 XXXXXXXXXX</p>
                            </div>
                        </div>

                        <p style={{ marginTop: '2rem' }}>
                            We aim to respond to all customer queries as quickly as possible.
                        </p>

                        <h2>Follow Us</h2>
                        <p>Stay connected with Bloomme on social media for updates, offers, and more.</p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            {[
                                { icon: <Instagram size={22} />, label: 'Instagram' },
                                { icon: <Facebook size={22} />, label: 'Facebook' },
                                { icon: <Twitter size={22} />, label: 'X (Twitter)' },
                                { icon: <Youtube size={22} />, label: 'YouTube' },
                                { icon: <Linkedin size={22} />, label: 'LinkedIn' },
                            ].map((social) => (
                                <span
                                    key={social.label}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        background: 'rgba(79, 121, 66, 0.06)',
                                        border: '1px solid rgba(79, 121, 66, 0.15)',
                                        borderRadius: '50px',
                                        color: 'var(--primary-green)',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {social.icon} {social.label}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {/* Back to Home link */}
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-green)', textDecoration: 'none', fontWeight: 600 }}>
                        <ChevronLeft size={18} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Legal;
