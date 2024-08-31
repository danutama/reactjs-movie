import React from 'react';

function ToggleTextButton({ isLongText, showFullOverview, handleToggleOverview }) {
  if (!isLongText) return null;

  return (
    <button onClick={handleToggleOverview} className="btn btn-link ps-0 fw-normal align-baseline" style={{ lineHeight: 'inherit', padding: 0 }}>
      {showFullOverview ? 'Show Less' : 'Read More'}
    </button>
  );
}

export default ToggleTextButton;
