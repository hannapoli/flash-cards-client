import './PopUp.scss';

export const PopUp = ({ isOpen, onClose, children, className }) => {
    if (!isOpen) return null;

    return (
        <div className='popupOverlay flexContainer' onClick={(e) => e.target === e.currentTarget && onClose()}>
            <article className='popupCard'>
                <button className='popupClose' onClick={onClose}>×</button>
                <div className={`popupContent flexColumn${className ? ' ' + className : ''}`}>
                    {children}
                </div>
            </article>
        </div>
    )
}