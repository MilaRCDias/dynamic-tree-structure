import { useState, useEffect, useCallback } from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export function useTheme(): [Theme, () => void] {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  const initialTheme = savedTheme === Theme.Dark ? Theme.Dark : Theme.Light;

  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === Theme.Light ? Theme.Dark : Theme.Light;
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  return [theme, toggleTheme];
}
