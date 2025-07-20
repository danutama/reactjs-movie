import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = (options = {}) => {
  const { debounceMs = 100, restoreDelay = 0, enableAutoSave = true } = options;

  const location = useLocation();
  const scrollPositions = useRef({});
  const isRestoringRef = useRef(false);
  const timeoutRef = useRef(null);

  // Debounced scroll save
  const saveScrollPosition = useCallback(() => {
    const path = location.pathname;
    if (!isRestoringRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        scrollPositions.current[path] = window.scrollY;
      }, debounceMs);
    }
  }, [location.pathname, debounceMs]);

  // Manual save function
  const saveCurrentPosition = useCallback(() => {
    scrollPositions.current[location.pathname] = window.scrollY;
  }, [location.pathname]);

  // Get current saved position
  const getSavedPosition = useCallback(() => {
    return scrollPositions.current[location.pathname] || 0;
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;

    // Restore scroll position
    const savedPosition = scrollPositions.current[path];
    if (savedPosition !== undefined && savedPosition > 0) {
      isRestoringRef.current = true;

      const restore = () => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'instant',
        });

        // Reset flag setelah restore
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 150);
      };

      if (restoreDelay > 0) {
        setTimeout(restore, restoreDelay);
      } else {
        requestAnimationFrame(restore);
      }
    } else {
      isRestoringRef.current = false;
    }

    // Setup event listeners jika auto save enabled
    if (enableAutoSave) {
      window.addEventListener('scroll', saveScrollPosition, { passive: true });
    }

    // Cleanup
    return () => {
      if (enableAutoSave) {
        window.removeEventListener('scroll', saveScrollPosition);
      }

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Save final position saat unmount
      if (!isRestoringRef.current) {
        scrollPositions.current[path] = window.scrollY;
      }
    };
  }, [location.pathname, saveScrollPosition, enableAutoSave, restoreDelay]);

  return {
    saveCurrentPosition,
    getSavedPosition,
    clearSavedPosition: useCallback(() => {
      delete scrollPositions.current[location.pathname];
    }, [location.pathname]),
  };
};
