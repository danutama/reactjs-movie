import React from 'react';

const Spinner = ({ className }) => {
  return (
    <div className={`spinner-border spinner-border-sm ${className}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
