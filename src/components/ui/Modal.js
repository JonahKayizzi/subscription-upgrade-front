import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        background: 'rgba(20,16,40,0.85)', 
        zIndex: 1000, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}
      onClick={handleBackdropClick}
    >
      <div style={{ 
        position: 'relative',
        background: 'var(--color-bg-card)', 
        borderRadius: 16, 
        padding: 32, 
        minWidth: 320, 
        maxWidth: '90vw', 
        boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            background: 'none', 
            border: 'none', 
            color: '#fff', 
            fontSize: 24, 
            cursor: 'pointer',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
} 