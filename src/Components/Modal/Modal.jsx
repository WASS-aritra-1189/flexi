import { useEffect } from 'react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, children, width = '400px', title }) => {
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('modal-backdrop')) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    return (
        <div className={`modal-backdrop ${isOpen ? 'open' : ''}`}>
            <div className={`modal-content ${isOpen ? 'open' : ''}`} style={{ width }}>
                {title && (
                    <div className="modal-header">
                        <div className="modal-title">{title}</div>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;