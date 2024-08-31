import { useState, useEffect, useMemo } from 'react';

const useTheme = () => {
  const initialTheme = localStorage.getItem('theme') || 'system';
  const [theme, setTheme] = useState(initialTheme);

  const systemTheme = useMemo(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  const applyTheme = (theme) => {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.setAttribute('data-theme', systemTheme);
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
