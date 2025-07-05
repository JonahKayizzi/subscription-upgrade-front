import React from 'react';

export default function Button({ children, ...props }) {
  return (
    <button className="button-primary" {...props}>
      {children}
    </button>
  );
} 