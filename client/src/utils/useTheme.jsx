import { useState, useEffect, useMemo } from 'react';

const useTheme = () => {
  const initialTheme = localStorage.getItem('theme') || 'system';
  const [theme, setTheme] = useState(initialTheme);

  const systemTheme = useMemo(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  const applyTheme = (theme) => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update meta theme-color for mobile status bar
    let themeColorMetaTag = document.querySelector('meta[name="theme-color"]');

    if (!themeColorMetaTag) {
      themeColorMetaTag = document.createElement('meta');
      themeColorMetaTag.name = 'theme-color';
      document.head.appendChild(themeColorMetaTag);
    }

    if (currentTheme === 'dark') {
      themeColorMetaTag.setAttribute('content', '#12161c');
    } else {
      themeColorMetaTag.setAttribute('content', '#ffffff');
    }
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme, systemTheme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return [theme, handleThemeChange];
};

export default useTheme;
