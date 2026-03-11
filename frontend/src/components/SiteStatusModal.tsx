import React from 'react';
import { Sparkles, X, Hammer, Flower, Bell } from 'lucide-react';

interface SiteStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'coming_soon' | 'maintenance' | 'none';
}

const SiteStatusModal: React.FC<SiteStatusModalProps> = ({ isOpen, onClose, status }) => {
    if (!isOpen || status === 'none') return null;

    const isMaintenance = status === 'maintenance';

    return (
        <div className="modal-overlay glass-overlay">
            <div className={`modal-content classy-modal ${status}`}>
                <div className="modal-border-gradient"></div>
                <button className="modal-close-minimal" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="classy-modal-body">
                    <div className="modal-illustration">
                        <img
                            src={isMaintenance ? "/images/maintenance.png" : "/images/blooming.png"}
                            alt={status}
                        />
                        <div className="illustration-overlay"></div>
                    </div>

                    <div className="modal-text-content">
                        <div className="status-badge-premium">
                            {isMaintenance ? <Hammer size={14} /> : <Flower size={14} />}
                            <span>{isMaintenance ? "System Refresh" : "Exclusive Preview"}</span>
                        </div>

                        <h2>{isMaintenance ? "Currently Under Maintenance" : "Coming Soon!"}</h2>

                        <div className="modal-divider"></div>

                        <p className="modal-description-classy">
                            {isMaintenance
                                ? "Our digital gardeners are currently tending to the systems to ensure your experience remains as fresh as our morning blooms."
                                : "A divine journey of fragrance and tradition is about to begin. We're meticulously hand-picking every detail for our grand reveal."}
                        </p>

                        <div className="modal-info-box">
                            <Bell size={18} className="info-icon" />
                            <span>{isMaintenance ? "Expected to return shortly." : "Be the first to know when we bloom."}</span>
                        </div>

                        <button className="btn-classy-primary" onClick={onClose}>
                            Acknowledged
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteStatusModal;
