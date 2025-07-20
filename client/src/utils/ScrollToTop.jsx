import { useEffect } from 'react';

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return null;
};

export default ScrollToTop;
