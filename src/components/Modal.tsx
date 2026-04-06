import React from 'react';
import './Modal.css'; // Import your styles here

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, footer, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    {footer}
                </div>
            </div>
        </div>
    );
};

export default Modal;