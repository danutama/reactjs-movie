import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const useScrollRestoration = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const key = `scroll-${location.pathname}`;

  // Save scroll position with debounce
  useEffect(() => {
    let scrollTimeout;

    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem(key, window.scrollY.toString());
      }, 100); // debounce: 100ms
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', onScroll);
    };
  }, [key]);

  // Force browser to manual scroll handling
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Restore scroll position on back/forward
  useEffect(() => {
    if (navType === 'POP') {
      const saved = sessionStorage.getItem(key);
      const savedY = saved ? parseInt(saved, 10) : 0;

      if (!isNaN(savedY)) {
        window.scrollTo({ top: savedY, behavior: 'instant' });
      }
    } else {
      // Scroll to top on new navigation
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, navType, key]);
};
