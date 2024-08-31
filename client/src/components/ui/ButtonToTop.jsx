import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

const ButtonToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 3000) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`btn-to-top-wrapper d-flex align-items-center justify-content-center ${isVisible ? 'show' : 'hide'}`}>
      <button onClick={scrollToTop} className="btn btn-sm btn-to-top rounded-5" aria-label="Scroll to top">
        <FaArrowUp className="icon" />
      </button>
    </div>
  );
};

export default ButtonToTop;
