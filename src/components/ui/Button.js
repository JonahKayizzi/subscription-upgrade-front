import React from 'react';

export default function Button({ children, className = '', ...props }) {
  return (
    <button className={`btn-primary ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
