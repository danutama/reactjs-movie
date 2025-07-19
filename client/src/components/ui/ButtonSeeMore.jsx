import React, { useCallback, useRef } from 'react';

// A reusable "Load More" button with debounce logic to prevent rapid clicks
const ButtonSeeMore = ({ onClick, disabled, debounceDelay = 1000 }) => {
  const timeoutRef = useRef(null); // Ref to store timeout for debounce

  // Handle button click with debounce logic
  const handleClick = useCallback(() => {
    // Prevent multiple triggers if already disabled or in debounce window
    if (timeoutRef.current || disabled) return;

    // Trigger the callback
    onClick();

    // Set debounce timeout
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
    }, debounceDelay);
  }, [onClick, debounceDelay, disabled]);

  return (
    <button className="btn btn-sm btn-primary py-2 px-3 border-0 rounded-5 d-inline-flex align-items-center justify-content-center gap-2" onClick={handleClick} disabled={disabled}>
      {/* Button label based on loading/disabled state */}
      {disabled ? (
        <>
          <span>Loading...</span>
        </>
      ) : (
        'Load more'
      )}
    </button>
  );
};

export default ButtonSeeMore;
