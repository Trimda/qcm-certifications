'use client';

import React, { createContext, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('qcm_theme', 'light');
  const [theme, setTheme] = useState<Theme>(storedTheme);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setStoredTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};
